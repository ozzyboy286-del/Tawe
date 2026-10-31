import { Receipt } from '../types/receipt';
import { formatFCFA, formatDateFrench } from './storage';

export function generateWhatsAppMessage(receipt: Receipt): string {
  const seller = receipt.seller;
  const statusLabel =
    receipt.status === 'PAID'
      ? '✅ FACTURE SOLDÉE / PAYÉE'
      : receipt.status === 'PARTIAL'
      ? '⏳ ACOMPTE VERSÉ (Reste à payer)'
      : '⚠️ IMPAYÉ / EN ATTENTE DE RÈGLEMENT';

  let itemsList = '';
  receipt.items.forEach((item, index) => {
    itemsList += `${index + 1}. *${item.name}*\n   Qté: ${item.quantity} × ${formatFCFA(item.unitPrice)} = *${formatFCFA(item.total)}*\n`;
  });

  const momoNumber = seller.momoNumber || seller.shopPhone || '';
  const momoName = seller.momoName || seller.shopOwner || seller.shopName;
  const celtiisNumber = seller.celtiisNumber || seller.shopPhone || '';
  const celtiisName = seller.celtiisName || seller.shopOwner || seller.shopName;
  const amountToPay = receipt.balanceDue > 0 ? receipt.balanceDue : receipt.totalAmount;

  let paymentsSection = '';
  if (momoNumber || celtiisNumber) {
    const momoInfo = momoNumber
      ? `📱 *MTN MoMo Bénin :* ${momoNumber} (${momoName})\n   ➔ *USSD direct :* *880*1*1*${momoNumber}*${amountToPay}#`
      : '';
    const celtiisInfo = celtiisNumber
      ? `📱 *Celtiis Cash Bénin :* ${celtiisNumber} (${celtiisName})\n   ➔ *USSD direct :* *889*1*${celtiisNumber}*${amountToPay}#`
      : '';

    paymentsSection = `\n━━━━━━━━━━━━━━━━━━\n💳 *ENVOI DIRECT DE L'ARGENT (FOURNISSEUR) :*\n${momoInfo}${momoInfo && celtiisInfo ? '\n\n' : ''}${celtiisInfo}\n⚠️ _Envoyez directement votre règlement sur l'un de ces numéros avec votre nom en référence._`;
  }

  const message = `🧾 *REÇU OFFICIEL - ${seller.shopName.toUpperCase()}*
━━━━━━━━━━━━━━━━━━
📍 *Reçu N° :* ${receipt.receiptNumber}
📅 *Date :* ${formatDateFrench(receipt.createdAt)}
👤 *Client :* ${receipt.clientName}
${receipt.clientPhone ? `📞 *Tél WhatsApp Client :* ${receipt.clientPhone}\n` : ''}👔 *Responsable / Fournisseur :* ${seller.shopOwner || 'Le Fournisseur'}
📞 *Contact / N° fonction :* ${seller.shopPhone || 'Non renseigné'}
━━━━━━━━━━━━━━━━━━
📦 *DÉTAIL DES ARTICLES :*
${itemsList}
━━━━━━━━━━━━━━━━━━
💰 *TOTAL GÉNÉRAL :* ${formatFCFA(receipt.totalAmount)}
💵 *Avance payée :* ${formatFCFA(receipt.advancePaid)}
${receipt.balanceDue > 0 ? `❗ *RESTE À PAYER :* ${formatFCFA(receipt.balanceDue)}\n` : ''}📌 *Statut :* ${statusLabel}
${receipt.notes ? `\n📝 *Notes :* ${receipt.notes}` : ''}
${paymentsSection}

━━━━━━━━━━━━━━━━━━
✨ ${receipt.footerText || seller.defaultFooter || 'Merci pour votre confiance !'}
🏢 *${seller.shopName}* - ${seller.city || 'Cotonou'}
📞 Contact Fournisseur : ${seller.shopPhone || ''}
━━━━━━━━━━━━━━━━━━
_Reçu généré via Reçu Pro Bénin (par jboy Ozzy)_`;

  return message;
}

export function openWhatsAppChat(receipt: Receipt): void {
  const message = generateWhatsAppMessage(receipt);
  let rawPhone = receipt.clientPhone.replace(/\D/g, '');

  if (rawPhone.length === 8 || (rawPhone.length === 10 && !rawPhone.startsWith('229'))) {
    rawPhone = `229${rawPhone}`;
  }

  const encodedMessage = encodeURIComponent(message);
  const waUrl = rawPhone
    ? `https://wa.me/${rawPhone}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;

  try {
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 200);
  } catch (err) {
    console.error('Failed to open link with anchor, trying direct window.open:', err);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }
}
