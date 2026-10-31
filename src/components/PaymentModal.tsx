import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  PhoneCall,
  Send,
  ExternalLink,
  HelpCircle,
  Hash,
} from 'lucide-react';
import { Receipt } from '../types/receipt';
import { formatFCFA } from '../utils/storage';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: Receipt | null;
  defaultOperator?: 'MTN' | 'CELTIIS';
  onPaymentSuccess?: (receiptId: string, amountPaid: number) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  receipt,
  defaultOperator = 'MTN',
  onPaymentSuccess,
}) => {
  const [operator, setOperator] = useState<'MTN' | 'CELTIIS'>(
    defaultOperator === 'CELTIIS' ? 'CELTIIS' : 'MTN'
  );
  const [copiedType, setCopiedType] = useState<'number' | 'ussd' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState<number>(
    receipt?.balanceDue || receipt?.totalAmount || 0
  );

  if (!isOpen || !receipt) return null;

  const seller = receipt.seller;

  // Coordonnées du fournisseur pour réception des fonds :
  const targetNumber =
    operator === 'MTN'
      ? seller.momoNumber || seller.shopPhone || ''
      : seller.celtiisNumber || seller.shopPhone || '';

  const targetName =
    operator === 'MTN'
      ? seller.momoName || seller.shopOwner || seller.shopName || 'Fournisseur / Vendeur'
      : seller.celtiisName || seller.shopOwner || seller.shopName || 'Fournisseur / Vendeur';

  // Standard Benin USSD transfer syntax:
  // MTN MoMo: *880*1*1*{num}*{montant}# (ou *880*41*{num}*{montant}#)
  // Celtiis Cash: *889*1*1*{num}*{montant}#
  const ussdFullSyntax =
    operator === 'MTN'
      ? `*880*1*1*${targetNumber}*${customAmount}#`
      : `*889*1*1*${targetNumber}*${customAmount}#`;

  const ussdMenuCode = operator === 'MTN' ? '*880#' : '*889#';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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
    showToast(`Code USSD ${ussdFullSyntax} copié ! Collez-le dans votre téléphone.`);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDialUSSD = () => {
    // Copy the full USSD first so the user can easily paste it
    try {
      navigator.clipboard.writeText(ussdFullSyntax);
    } catch (e) {
      // ignore clipboard error if any
    }
    showToast(`Code ${ussdFullSyntax} copié ! Lancement du composeur...`);
    // On smartphones, dialing the menu *880# or *889# is universally supported:
    window.location.href = `tel:${encodeURIComponent(ussdMenuCode)}`;
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
      if (onPaymentSuccess) {
        onPaymentSuccess(receipt.id, customAmount);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-xs">
              BJ
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Envoi direct Mobile Money</h3>
              <p className="text-xs text-slate-400">Reçu N° {receipt.receiptNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Toast Feedback */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {paymentSuccess ? (
          /* SUCCESS VIEW */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Argent envoyé avec succès
              </span>
              <h4 className="text-xl font-black text-slate-900 mt-2">
                Paiement de {formatFCFA(customAmount)} validé !
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                L'argent a été crédité sur le compte {operator === 'MTN' ? 'MTN MoMo' : 'Celtiis Cash'}. Le reçu a été mis à jour.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl text-left text-xs border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Moyen de règlement :</span>
                <span className="font-bold text-slate-800">
                  {operator === 'MTN' ? 'MTN Mobile Money' : 'Celtiis Cash Bénin'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Numéro crédité :</span>
                <span className="font-mono font-bold text-slate-900">{targetNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bénéficiaire :</span>
                <span className="font-bold text-slate-800">{targetName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Référence Reçu :</span>
                <span className="font-mono text-slate-700 font-semibold">{receipt.receiptNumber}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setPaymentSuccess(false);
                onClose();
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer shadow-md text-sm"
            >
              Fermer et voir le reçu mis à jour
            </button>
          </div>
        ) : (
          /* PAYMENT SELECTION & DIRECT ACTIONS */
          <div className="p-5 sm:p-6 space-y-4">
            {/* Operator Tabs: STRICTLY MTN MoMo vs Celtiis Cash */}
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

            {/* Merchant Details Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Titulaire du compte :</span>
                <span className="font-bold text-slate-900">{targetName}</span>
              </div>

              {/* Number with Copy button */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Numéro de transfert {operator === 'MTN' ? 'MTN MoMo' : 'Celtiis Cash'}
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 font-mono text-lg font-black bg-white px-3.5 py-2 rounded-xl border-2 border-slate-300 text-slate-900 select-all tracking-wider">
                    {targetNumber}
                  </div>
                  <button
                    onClick={handleCopyNumber}
                    className="p-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer flex items-center gap-1 font-semibold text-xs"
                    title="Copier le numéro"
                  >
                    {copiedType === 'number' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Amount to pay */}
              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Montant à envoyer (FCFA)
                </label>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value) || 0)}
                  className="w-full text-base font-bold px-3 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2.5">
              {/* Action 1: Compose / Dial USSD */}
              <button
                type="button"
                onClick={handleDialUSSD}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-center shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  operator === 'MTN'
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                    : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>Envoyer directement sur le {operator === 'MTN' ? 'MoMo' : 'Celtiis'}</span>
              </button>

              {/* Action 2: Copy USSD Full Syntax */}
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                    <span>Syntaxe USSD directe :</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUSSD}
                    className="text-xs text-blue-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    {copiedType === 'ussd' ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Copié !
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy className="w-3.5 h-3.5" /> Copier syntaxe
                      </span>
                    )}
                  </button>
                </div>
                <p className="font-mono bg-white p-2 rounded-lg text-xs font-bold text-slate-900 break-all select-all border border-slate-200">
                  {ussdFullSyntax}
                </p>
                <p className="text-[10px] text-slate-500">
                  💡 <em>Astuce : Copiez le code ci-dessus, puis collez-le directement dans votre clavier d'appel téléphonique.</em>
                </p>
              </div>
            </div>

            {/* Validation CTA */}
            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing || customAmount <= 0}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-center border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Validation de la transaction...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Valider la réception de {formatFCFA(customAmount)}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

