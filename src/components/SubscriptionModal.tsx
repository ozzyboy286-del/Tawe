import React, { useState, useEffect } from 'react';
import {
  X,
  Crown,
  CheckCircle2,
  ShieldCheck,
  PhoneCall,
  Copy,
  Check,
  Clock,
  CreditCard,
  ExternalLink,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { SellerProfile, SubscriptionInfo } from '../types/receipt';
import confetti from 'canvas-confetti';

interface FedaPayCompleteEvent {
  reason: unknown;
  transaction?: {
    id?: number | string;
    status?: string;
  };
}

interface FedaPayGlobal {
  CHECKOUT_COMPLETED: unknown;
  DIALOG_DISMISSED: unknown;
  init: (options: {
    public_key: string;
    transaction: { id: number | string };
    onComplete?: (event: FedaPayCompleteEvent) => void;
  }) => { open: () => void };
}

declare global {
  interface Window {
    FedaPay?: FedaPayGlobal;
  }
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionInfo;
  sellerProfile?: SellerProfile;
  onSubscribeSuccess: (transactionId?: string) => void;
}

interface PendingFedaPayTx {
  transactionId: string;
  reference: string;
  checkoutUrl: string;
  publicKey: string;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  subscription,
  sellerProfile,
  onSubscribeSuccess,
}) => {
  const [paymentTab, setPaymentTab] = useState<'FEDAPAY' | 'MANUAL'>('FEDAPAY');
  const [operator, setOperator] = useState<'MTN' | 'CELTIIS'>('MTN');
  const [copiedType, setCopiedType] = useState<'number' | 'ussd' | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // FedaPay states
  const [fedaPayStatusLoading, setFedaPayStatusLoading] = useState(false);
  const [fedaPayConfigured, setFedaPayConfigured] = useState<boolean | null>(null);
  const [fedaPayEnv, setFedaPayEnv] = useState<'sandbox' | 'live'>('sandbox');
  const [creatingTx, setCreatingTx] = useState(false);
  const [verifyingTx, setVerifyingTx] = useState(false);
  const [pendingTx, setPendingTx] = useState<PendingFedaPayTx | null>(null);

  // Customer info for FedaPay
  const [customerName, setCustomerName] = useState(sellerProfile?.shopOwner || '');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState(sellerProfile?.shopPhone || '');

  useEffect(() => {
    if (!isOpen) return;
    setErrorMsg(null);
    setCustomerName((prev) => prev || sellerProfile?.shopOwner || '');
    setCustomerPhone((prev) => prev || sellerProfile?.shopPhone || '');

    let cancelled = false;
    const checkStatus = async () => {
      setFedaPayStatusLoading(true);
      try {
        const resp = await fetch('/api/payments/fedapay/status');
        if (!resp.ok) throw new Error('Status check failed');
        const data = (await resp.json()) as {
          configured?: boolean;
          environment?: 'sandbox' | 'live';
        };
        if (!cancelled) {
          setFedaPayConfigured(Boolean(data.configured));
          if (data.environment) setFedaPayEnv(data.environment);
        }
      } catch {
        if (!cancelled) setFedaPayConfigured(false);
      } finally {
        if (!cancelled) setFedaPayStatusLoading(false);
      }
    };

    checkStatus();
    return () => {
      cancelled = true;
    };
  }, [isOpen, sellerProfile]);

  if (!isOpen) return null;

  const freeRemaining = Math.max(0, subscription.maxFreeReceipts - subscription.freeReceiptsUsed);
  const targetNumber = operator === 'MTN' ? '0157586308' : '0141159129';
  const targetName = 'jboy Ozzy (Clovis Arsène junior DOUBOGAN)';
  const ussdFullSyntax =
    operator === 'MTN'
      ? `*880*1*1*0157586308*1500#`
      : `*889*1*1*0141159129*1500#`;
  const ussdMenuCode = operator === 'MTN' ? '*880#' : '*889#';

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(targetNumber);
    setCopiedType('number');
    showToast(`Numéro ${targetNumber} copié !`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyUSSD = () => {
    navigator.clipboard.writeText(ussdFullSyntax);
    setCopiedType('ussd');
    showToast(`Code USSD ${ussdFullSyntax} copié !`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDialUSSD = () => {
    try {
      navigator.clipboard.writeText(ussdFullSyntax);
    } catch {}
    showToast(`Code ${ussdFullSyntax} copié ! Ouverture du composeur...`);
    window.location.href = `tel:${encodeURIComponent(ussdMenuCode)}`;
  };

  const verifyFedaPayTransaction = async (txId: string) => {
    setVerifyingTx(true);
    setErrorMsg(null);
    try {
      const resp = await fetch(`/api/payments/fedapay/verify/${encodeURIComponent(txId)}`);
      const data = (await resp.json()) as {
        success?: boolean;
        isApproved?: boolean;
        status?: string;
        error?: string;
      };

      if (!resp.ok || !data.success) {
        setErrorMsg(data.error || 'Impossible de vérifier le paiement FedaPay.');
        return;
      }

      if (data.isApproved) {
        onSubscribeSuccess(String(txId));
        setPendingTx(null);
        confetti({
          particleCount: 90,
          spread: 90,
          origin: { y: 0.6 },
        });
        onClose();
      } else {
        setErrorMsg(
          `Statut du paiement : "${data.status || 'en attente'}". Finalisez la validation Mobile Money sur votre téléphone puis cliquez sur « Vérifier le paiement ».`
        );
      }
    } catch {
      setErrorMsg('Erreur réseau lors de la vérification du paiement.');
    } finally {
      setVerifyingTx(false);
    }
  };

  const handlePayWithFedaPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanName = customerName.trim() || sellerProfile?.shopName || 'Commerçant Bénin';
    const nameParts = cleanName.split(/\s+/);
    const firstname = nameParts[0] || 'Commerçant';
    const lastname = nameParts.slice(1).join(' ') || 'Bénin';
    const cleanEmail = customerEmail.trim() || 'client@recuprobenin.bj';
    const cleanPhone = customerPhone.trim();

    if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 8) {
      setErrorMsg('Veuillez saisir votre numéro de téléphone Bénin (ex: 0197000000).');
      return;
    }

    setCreatingTx(true);
    try {
      const resp = await fetch('/api/payments/fedapay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname,
          lastname,
          email: cleanEmail,
          phone: cleanPhone,
          shopName: sellerProfile?.shopName,
        }),
      });

      const data = (await resp.json()) as {
        success?: boolean;
        configured?: boolean;
        transactionId?: number | string;
        reference?: string;
        checkoutUrl?: string;
        publicKey?: string;
        error?: string;
      };

      if (!resp.ok || !data.success || !data.transactionId) {
        if (data.configured === false) {
          setFedaPayConfigured(false);
        }
        setErrorMsg(data.error || 'Impossible de démarrer le paiement FedaPay.');
        return;
      }

      const txInfo: PendingFedaPayTx = {
        transactionId: String(data.transactionId),
        reference: data.reference || String(data.transactionId),
        checkoutUrl: data.checkoutUrl || '',
        publicKey: data.publicKey || '',
      };
      setPendingTx(txInfo);

      // Open embedded FedaPay Checkout.js widget if loaded
      if (window.FedaPay && txInfo.publicKey) {
        try {
          const widget = window.FedaPay.init({
            public_key: txInfo.publicKey,
            transaction: { id: data.transactionId },
            onComplete: ({ reason }) => {
              if (reason === window.FedaPay?.CHECKOUT_COMPLETED) {
                verifyFedaPayTransaction(txInfo.transactionId);
              }
            },
          });
          widget.open();
        } catch {
          showToast('Lien de paiement FedaPay prêt ci-dessous.');
        }
      } else {
        showToast('Lien de paiement FedaPay généré !');
      }
    } catch {
      setErrorMsg('Impossible de contacter le serveur de paiement.');
    } finally {
      setCreatingTx(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <p className="text-xs font-semibold text-amber-300 mb-1.5">
            Abonnement Professionnel Bénin
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            Passez à la formule Illimitée
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Paiement sécurisé via FedaPay (MTN MoMo, Moov, Celtiis &amp; Carte).
          </p>
        </div>

        {/* Dynamic Toast Feedback */}
        {toastMsg && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Current Status */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                Statut actuel
              </span>
              <p className="text-sm font-extrabold text-amber-950 mt-0.5">
                {subscription.isSubscribed
                  ? 'Compte PRO Illimité Actif'
                  : `Essai gratuit : ${freeRemaining} reçu${freeRemaining > 1 ? 's' : ''} restant${freeRemaining > 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xl font-black text-slate-900 tabular-nums">1 500 F</span>
              <span className="block text-[11px] text-slate-600 font-medium">/ mois</span>
            </div>
          </div>

          {/* Features summary */}
          <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Reçus et factures <strong>illimités</strong> pendant 30 jours</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Export PDF A4 avec logo &amp; cachet officiel + WhatsApp 1-Clic</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Activation automatique après validation FedaPay</span>
            </li>
          </ul>

          {/* Payment Mode Switcher: FedaPay vs Direct Transfer */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setPaymentTab('FEDAPAY');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                paymentTab === 'FEDAPAY'
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>FedaPay (Auto)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPaymentTab('MANUAL');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                paymentTab === 'MANUAL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
              <span>MoMo / Celtiis direct</span>
            </button>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-xl p-3 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {paymentTab === 'FEDAPAY' ? (
            <div className="space-y-4">
              {fedaPayStatusLoading ? (
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-600 flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-spin text-blue-800" />
                  <span>Vérification du module FedaPay...</span>
                </div>
              ) : fedaPayConfigured === false ? (
                <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/70 space-y-2 text-xs text-amber-950">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Clés API FedaPay requises sur le serveur</span>
                  </p>
                  <p className="text-amber-900 leading-relaxed">
                    Ajoutez <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">FEDAPAY_SECRET_KEY</code> et{' '}
                    <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">FEDAPAY_PUBLIC_KEY</code> (plus{' '}
                    <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">FEDAPAY_ENVIRONMENT</code> ={' '}
                    <code className="font-mono">live</code> ou <code className="font-mono">sandbox</code>) dans les secrets de votre projet pour activer le guichet FedaPay en direct.
                  </p>
                  <button
                    type="button"
                    onClick={() => setPaymentTab('MANUAL')}
                    className="text-blue-900 font-bold hover:underline cursor-pointer pt-1 inline-block"
                  >
                    Utiliser le transfert direct MTN MoMo / Celtiis Cash →
                  </button>
                </div>
              ) : null}

              {pendingTx ? (
                <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/60 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-950">Transaction FedaPay prête</span>
                    <span className="font-mono text-[11px] text-blue-800">Réf: {pendingTx.reference}</span>
                  </div>

                  <p className="text-slate-700 leading-relaxed">
                    Validez le paiement de <strong>1 500 FCFA</strong> dans la fenêtre FedaPay (ou via le lien ci-dessous), puis cliquez sur vérifier pour débloquer votre compte PRO.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {pendingTx.checkoutUrl && (
                      <a
                        href={pendingTx.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-950 hover:bg-blue-900 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Ouvrir FedaPay</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => verifyFedaPayTransaction(pendingTx.transactionId)}
                      disabled={verifyingTx}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${verifyingTx ? 'animate-spin' : ''}`} />
                      <span>{verifyingTx ? 'Vérification...' : 'Vérifier le paiement'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPendingTx(null)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Annuler et recommencer
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePayWithFedaPay} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Nom &amp; Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ex: Ahouéfa Mensah"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-800 focus:outline-hidden text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Téléphone Bénin *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Ex: 0197254018"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-800 focus:outline-hidden text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email (pour le reçu FedaPay)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="boutique@exemple.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-blue-800 focus:outline-hidden text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={creatingTx || fedaPayConfigured === false}
                    className="w-full bg-gradient-to-r from-blue-950 to-blue-800 hover:from-blue-900 hover:to-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingTx ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Connexion à FedaPay...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>
                          Payer 1 500 FCFA avec FedaPay {fedaPayEnv === 'sandbox' ? '(Test)' : ''}
                        </span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Manual Mobile Money Transfer Tab (MTN MoMo & Celtiis Cash) */
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setOperator('MTN')}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    operator === 'MTN'
                      ? 'bg-amber-400 text-slate-950 shadow-sm ring-2 ring-amber-500'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-950 text-amber-400 text-[10px] font-black flex items-center justify-center">
                    M
                  </span>
                  <span>MTN MoMo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOperator('CELTIIS')}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    operator === 'CELTIIS'
                      ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-700'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white text-sky-600 text-[10px] font-black flex items-center justify-center">
                    C
                  </span>
                  <span>Celtiis Cash</span>
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-slate-500">Bénéficiaire :</span>
                  <span className="font-bold text-slate-900 text-right">{targetName}</span>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1">
                    Numéro {operator === 'MTN' ? 'MTN MoMo' : 'Celtiis Cash'} :
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 font-mono text-base font-black bg-white px-3 py-1.5 rounded-xl border border-slate-300 text-slate-900 select-all tracking-wider">
                      {targetNumber}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyNumber}
                      className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
                      title="Copier le numéro"
                    >
                      {copiedType === 'number' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-1 space-y-2">
                  <button
                    type="button"
                    onClick={handleDialUSSD}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                      operator === 'MTN'
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                        : 'bg-sky-600 hover:bg-sky-500 text-white'
                    }`}
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Composer USSD ({ussdMenuCode}) sur téléphone</span>
                  </button>

                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 text-[11px]">
                    <span className="font-mono text-slate-700 font-bold">{ussdFullSyntax}</span>
                    <button
                      type="button"
                      onClick={handleCopyUSSD}
                      className="text-blue-700 font-bold hover:underline cursor-pointer"
                    >
                      {copiedType === 'ussd' ? 'Copié !' : 'Copier'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="text-center text-[11px] text-slate-400">
            Paiement sécurisé FedaPay &amp; Mobile Money Bénin · <strong>jboy Ozzy</strong> (Clovis Arsène junior DOUBOGAN)
          </div>
        </div>
      </div>
    </div>
  );
};
