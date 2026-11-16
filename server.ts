import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUBSCRIPTION_PRICE_FCFA = 1500;

interface FedaPayConfig {
  secretKey: string;
  publicKey: string;
  environment: 'live' | 'sandbox';
  apiBaseUrl: string;
  isConfigured: boolean;
}

function getFedaPayConfig(): FedaPayConfig {
  const secretKey = (process.env.FEDAPAY_SECRET_KEY || '').trim();
  const publicKey = (process.env.FEDAPAY_PUBLIC_KEY || '').trim();
  const rawEnv = (process.env.FEDAPAY_ENVIRONMENT || '').trim().toLowerCase();

  const environment: 'live' | 'sandbox' =
    rawEnv === 'live' || secretKey.startsWith('sk_live_') ? 'live' : 'sandbox';

  const apiBaseUrl =
    environment === 'live'
      ? 'https://api.fedapay.com/v1'
      : 'https://sandbox-api.fedapay.com/v1';

  const isPlaceholder =
    !secretKey ||
    !publicKey ||
    secretKey.includes('MY_FEDAPAY') ||
    publicKey.includes('MY_FEDAPAY');

  return {
    secretKey,
    publicKey,
    environment,
    apiBaseUrl,
    isConfigured: !isPlaceholder,
  };
}

function normalizePhoneForFedaPay(rawPhone: string): string {
  const digits = (rawPhone || '').replace(/\D/g, '');
  if (!digits) return '+2290100000000';
  if (digits.startsWith('229')) return `+${digits}`;
  return `+229${digits}`;
}

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT || 3000);
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // 1. Check FedaPay availability
  app.get('/api/payments/fedapay/status', (_req: Request, res: Response) => {
    const cfg = getFedaPayConfig();
    res.json({
      configured: cfg.isConfigured,
      environment: cfg.environment,
      publicKey: cfg.isConfigured ? cfg.publicKey : null,
      amount: SUBSCRIPTION_PRICE_FCFA,
      currency: 'XOF',
    });
  });

  // 2. Create FedaPay transaction and payment token
  app.post('/api/payments/fedapay/create', async (req: Request, res: Response) => {
    const cfg = getFedaPayConfig();
    if (!cfg.isConfigured) {
      res.status(503).json({
        success: false,
        configured: false,
        error:
          "Les clés API FedaPay (FEDAPAY_SECRET_KEY et FEDAPAY_PUBLIC_KEY) ne sont pas encore configurées sur le serveur.",
      });
      return;
    }

    try {
      const body = req.body as {
        firstname?: string;
        lastname?: string;
        email?: string;
        phone?: string;
        shopName?: string;
      };

      const firstname = (body.firstname || 'Commerçant').trim().slice(0, 80);
      const lastname = (body.lastname || 'Bénin').trim().slice(0, 80);
      const email = (body.email || 'client@recuprobenin.bj').trim().slice(0, 120);
      const phone = normalizePhoneForFedaPay(body.phone || '');

      const originHeader = req.get('origin') || process.env.APP_URL || `http://localhost:${port}`;
      const callbackUrl = `${originHeader.replace(/\/$/, '')}/?fedapay_callback=1`;

      const createPayload = {
        description: `Abonnement Mensuel PRO Illimité - ${body.shopName || 'Reçu Pro Bénin'}`,
        amount: SUBSCRIPTION_PRICE_FCFA,
        currency: { iso: 'XOF' },
        callback_url: callbackUrl,
        customer: {
          firstname,
          lastname,
          email,
          phone_number: {
            number: phone,
            country: 'bj',
          },
        },
      };

      const txResp = await fetch(`${cfg.apiBaseUrl}/transactions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cfg.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createPayload),
      });

      const txJson = (await txResp.json()) as Record<string, unknown>;
      if (!txResp.ok) {
        const errMsg =
          typeof txJson.message === 'string'
            ? txJson.message
            : 'Erreur lors de la création de la transaction FedaPay.';
        res.status(txResp.status).json({
          success: false,
          configured: true,
          error: errMsg,
        });
        return;
      }

      const txData = (txJson['v1/transaction'] || txJson) as {
        id?: number | string;
        reference?: string;
        status?: string;
      };

      if (!txData?.id) {
        res.status(502).json({
          success: false,
          configured: true,
          error: 'Réponse FedaPay invalide : identifiant de transaction manquant.',
        });
        return;
      }

      // Generate checkout token & URL
      const tokenResp = await fetch(`${cfg.apiBaseUrl}/transactions/${txData.id}/token`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cfg.secretKey}`,
          'Content-Type': 'application/json',
        },
      });

      const tokenJson = (await tokenResp.json()) as {
        token?: string;
        url?: string;
        message?: string;
      };

      if (!tokenResp.ok || !tokenJson.token) {
        res.status(tokenResp.status || 502).json({
          success: false,
          configured: true,
          error: tokenJson.message || 'Impossible de générer le lien de paiement FedaPay.',
        });
        return;
      }

      res.json({
        success: true,
        configured: true,
        transactionId: txData.id,
        reference: txData.reference || String(txData.id),
        token: tokenJson.token,
        checkoutUrl: tokenJson.url,
        publicKey: cfg.publicKey,
        environment: cfg.environment,
      });
    } catch (error) {
      console.error('FedaPay create error:', error);
      res.status(500).json({
        success: false,
        configured: true,
        error: 'Erreur de connexion avec le service FedaPay.',
      });
    }
  });

  // 3. Verify FedaPay transaction status server-side
  app.get('/api/payments/fedapay/verify/:transactionId', async (req: Request, res: Response) => {
    const cfg = getFedaPayConfig();
    if (!cfg.isConfigured) {
      res.status(503).json({
        success: false,
        configured: false,
        error: 'FedaPay non configuré sur le serveur.',
      });
      return;
    }

    const transactionId = req.params.transactionId;
    if (!transactionId || !/^[a-zA-Z0-9_-]+$/.test(transactionId)) {
      res.status(400).json({
        success: false,
        error: 'Identifiant de transaction invalide.',
      });
      return;
    }

    try {
      const verifyResp = await fetch(`${cfg.apiBaseUrl}/transactions/${transactionId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cfg.secretKey}`,
          'Content-Type': 'application/json',
        },
      });

      const verifyJson = (await verifyResp.json()) as Record<string, unknown>;
      if (!verifyResp.ok) {
        res.status(verifyResp.status).json({
          success: false,
          error:
            typeof verifyJson.message === 'string'
              ? verifyJson.message
              : 'Impossible de vérifier la transaction FedaPay.',
        });
        return;
      }

      const txData = (verifyJson['v1/transaction'] || verifyJson) as {
        id?: number | string;
        status?: string;
        amount?: number;
        reference?: string;
      };

      const status = txData.status || 'pending';
      const isApproved = status === 'approved' || status === 'transferred';

      res.json({
        success: true,
        transactionId: txData.id || transactionId,
        reference: txData.reference || String(transactionId),
        status,
        amount: txData.amount || SUBSCRIPTION_PRICE_FCFA,
        isApproved,
      });
    } catch (error) {
      console.error('FedaPay verify error:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la vérification du paiement FedaPay.',
      });
    }
  });

  // Frontend serving: Vite middleware in dev, static dist/ in prod
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build introuvable. Exécutez npm run build.');
      }
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
