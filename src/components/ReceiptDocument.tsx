import React from 'react';
import { Store, Phone, MapPin, Calendar, Hash, User, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Receipt } from '../types/receipt';
import { formatFCFA, formatDateFrench } from '../utils/storage';

interface ReceiptDocumentProps {
  receipt: Receipt;
  onOpenPaymentModal?: (operator: 'MTN' | 'CELTIIS') => void;
  isPrintView?: boolean;
}

export const ReceiptDocument: React.FC<ReceiptDocumentProps> = ({
  receipt,
  onOpenPaymentModal,
  isPrintView = false,
}) => {
  const seller = receipt.seller;

  return (
    <div
      id="receipt-document"
      className="receipt-container bg-white text-slate-800 p-3.5 sm:p-6 md:p-8 max-w-2xl w-full mx-auto rounded-2xl border sm:border-2 border-slate-900 shadow-md sm:shadow-xl relative overflow-hidden select-text"
      style={{ minHeight: '600px' }}
    >
      {/* Decorative Benin subtle corner stripes */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-amber-400 to-rose-600" />

      {/* Frame border inner line */}
      <div className="border border-slate-200 rounded-xl p-3 sm:p-5 md:p-6 relative">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b-2 border-slate-100">
          <div className="flex items-center gap-4">
            {seller.logoUrl ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-slate-200 p-1 bg-white shadow-xs flex items-center justify-center shrink-0">
                <img
                  src={seller.logoUrl}
                  alt={seller.shopName}
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl bg-blue-950 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
                {seller.shopName.substring(0, 2).toUpperCase() || 'RP'}
              </div>
            )}

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                {seller.shopName || 'Boutique Commerciale'}
              </h1>
              <div className="flex flex-col gap-0.5 text-xs text-slate-600 mt-1">
                {seller.shopOwner && (
                  <p className="text-xs text-slate-800 font-semibold">
                    Responsable / Fournisseur : <span className="text-slate-950 font-bold">{seller.shopOwner}</span>
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                  {seller.shopPhone && (
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Phone className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>Contact / N° de fonction : <strong className="text-slate-900 font-mono">{seller.shopPhone}</strong></span>
                    </span>
                  )}
                  {seller.city && (
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3 h-3 text-blue-700 shrink-0" />
                      <span>{seller.shopAddress ? `${seller.shopAddress}, ` : ''}{seller.city} (Bénin)</span>
                    </span>
                  )}
                </div>
              </div>
              {(seller.ifuNumber || seller.rccmNumber) && (
                <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                  {seller.ifuNumber && <span>IFU : {seller.ifuNumber}</span>}
                  {seller.rccmNumber && <span>RCCM : {seller.rccmNumber}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Receipt Number & Date Badge */}
          <div className="sm:text-right shrink-0">
            <div className="inline-block bg-blue-950 text-white px-3.5 py-1.5 rounded-lg shadow-xs">
              <span className="text-[10px] uppercase tracking-widest text-amber-300 block font-bold">
                REÇU OFFICIEL
              </span>
              <span className="text-base sm:text-lg font-black tracking-wider">
                {receipt.receiptNumber}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 flex items-center sm:justify-end gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formatDateFrench(receipt.createdAt)}</span>
            </p>
          </div>
        </div>

        {/* CLIENT DETAILS BOX */}
        <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Délivré à l'attention de :
            </span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {receipt.clientName}
            </p>
          </div>
          <div className="sm:text-right">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Contact client (WhatsApp) :
            </span>
            <p className="text-sm font-semibold text-emerald-700 mt-0.5">
              {receipt.clientPhone || 'Non renseigné'}
            </p>
          </div>
        </div>

        {/* ARTICLES TABLE */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 mb-5">
          <table className="w-full min-w-[320px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold">
                <th className="py-2.5 px-3 w-8 text-center">N°</th>
                <th className="py-2.5 px-3">Désignation</th>
                <th className="py-2.5 px-3 text-center w-14">Qté</th>
                <th className="py-2.5 px-3 text-right w-24">Prix Unit.</th>
                <th className="py-2.5 px-3 text-right w-28">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {receipt.items.map((item, idx) => (
                <tr key={item.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="py-2.5 px-3 text-center text-slate-400 font-medium">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{item.name}</td>
                  <td className="py-2.5 px-3 text-center text-slate-700 font-bold">{item.quantity}</td>
                  <td className="py-2.5 px-3 text-right text-slate-600">{formatFCFA(item.unitPrice)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatFCFA(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FINANCIAL SUMMARY & STAMP */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center mb-6">
          {/* STAMP / CACHET (MANDATORY REQUIREMENT: super beau avec cachet "PAYÉ" ou "IMPAYÉ") */}
          <div className="sm:col-span-6 flex justify-center sm:justify-start">
            {receipt.status === 'PAID' && (
              <div className="relative transform -rotate-6 border-4 border-emerald-600 rounded-xl px-4 py-2.5 text-center font-black tracking-widest text-emerald-700 bg-emerald-50/60 shadow-xs pointer-events-none">
                <div className="border border-emerald-500 rounded p-1">
                  <div className="text-[10px] tracking-widest uppercase">RÉPUBLIQUE DU BÉNIN</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600 leading-none my-0.5">
                    ★ PAYÉ ★
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-emerald-700 font-bold">
                    FACTURE TOTALEMENT SOLDÉE
                  </div>
                </div>
              </div>
            )}

            {receipt.status === 'PARTIAL' && (
              <div className="relative transform -rotate-4 border-4 border-amber-600 rounded-xl px-4 py-2.5 text-center font-black tracking-widest text-amber-700 bg-amber-50/60 shadow-xs pointer-events-none">
                <div className="border border-amber-500 rounded p-1">
                  <div className="text-[10px] tracking-widest uppercase">RÉPUBLIQUE DU BÉNIN</div>
                  <div className="text-lg sm:text-xl font-black text-amber-700 leading-none my-0.5">
                    ★ ACOMPTE VERSÉ ★
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-amber-800 font-bold">
                    Reste : {formatFCFA(receipt.balanceDue)}
                  </div>
                </div>
              </div>
            )}

            {receipt.status === 'UNPAID' && (
              <div className="relative transform rotate-3 border-4 border-rose-600 rounded-xl px-4 py-2.5 text-center font-black tracking-widest text-rose-700 bg-rose-50/60 shadow-xs pointer-events-none">
                <div className="border border-rose-500 rounded p-1">
                  <div className="text-[10px] tracking-widest uppercase">RÉPUBLIQUE DU BÉNIN</div>
                  <div className="text-xl sm:text-2xl font-black text-rose-600 leading-none my-0.5">
                    ★ IMPAYÉ ★
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-rose-700 font-bold">
                    EN ATTENTE DE RÈGLEMENT
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TOTALS BOX */}
          <div className="sm:col-span-6 bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>Total Général :</span>
              <span className="font-bold text-slate-900 text-sm">{formatFCFA(receipt.totalAmount)}</span>
            </div>

            <div className="flex justify-between items-center text-slate-600">
              <span>Avance versée :</span>
              <span className="font-bold text-amber-700 text-sm">{formatFCFA(receipt.advancePaid)}</span>
            </div>

            <div className="border-t border-slate-200 pt-1.5 flex justify-between items-center font-extrabold">
              <span className={receipt.balanceDue > 0 ? 'text-rose-600' : 'text-emerald-700'}>
                Reste à payer :
              </span>
              <span className={`text-base font-black ${receipt.balanceDue > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                {formatFCFA(receipt.balanceDue)}
              </span>
            </div>
          </div>
        </div>

        {/* NOTES IF ANY */}
        {receipt.notes && (
          <div className="mb-5 p-2.5 rounded-lg bg-blue-50/60 border border-blue-200/60 text-xs text-blue-900">
            <strong>Note :</strong> {receipt.notes}
          </div>
        )}

        {/* MODE DE PAIEMENT : STRICTEMENT MTN MOMO & CELTIIS CASH */}
        <div className="mb-5 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-50 to-blue-500/10 border border-slate-200 no-print">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Paiement direct vendeur (MTN MoMo & Celtiis Cash) :
            </span>
            <span className="text-[10px] text-slate-400">Cliquez pour envoyer sur le MoMo / Celtiis</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* MTN MoMo Button */}
            <button
              type="button"
              onClick={() => onOpenPaymentModal && onOpenPaymentModal('MTN')}
              className="flex items-center justify-between bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-2.5 rounded-xl border border-amber-500 shadow-xs transition-all cursor-pointer font-semibold text-xs active:scale-98"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center font-black text-[10px]">
                  M
                </span>
                <div className="text-left">
                  <span className="block font-bold leading-tight">Payer avec MTN MoMo</span>
                  <span className="text-[11px] text-slate-900 font-bold font-mono">
                    {seller.momoNumber || seller.shopPhone || 'Non configuré'}
                  </span>
                  {seller.momoName && (
                    <span className="text-[10px] text-slate-800 block truncate max-w-[130px]">
                      {seller.momoName}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[10px] bg-slate-900/10 px-1.5 py-0.5 rounded font-bold uppercase">
                Bénin 🇧🇯
              </span>
            </button>

            {/* Celtiis Cash Button */}
            <button
              type="button"
              onClick={() => onOpenPaymentModal && onOpenPaymentModal('CELTIIS')}
              className="flex items-center justify-between bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-2.5 rounded-xl border border-sky-700 shadow-xs transition-all cursor-pointer font-semibold text-xs active:scale-98"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white text-sky-700 flex items-center justify-center font-black text-[10px]">
                  C
                </span>
                <div className="text-left">
                  <span className="block font-bold leading-tight">Payer avec Celtiis Cash</span>
                  <span className="text-[11px] text-sky-100 font-bold font-mono">
                    {seller.celtiisNumber || seller.shopPhone || 'Non configuré'}
                  </span>
                  {seller.celtiisName && (
                    <span className="text-[10px] text-sky-200 block truncate max-w-[130px]">
                      {seller.celtiisName}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold uppercase">
                Bénin 🇧🇯
              </span>
            </button>
          </div>
        </div>

        {/* PRINT STATIC PAYMENT DETAILS (for PDF and printing) */}
        <div className="hidden print-only mb-4 text-[10px] text-slate-600 border-t border-slate-200 pt-2">
          <strong>Règlement Mobile Money Fournisseur :</strong> {seller.momoNumber ? `MTN MoMo : ${seller.momoNumber} (${seller.momoName || seller.shopOwner})` : ''} {seller.celtiisNumber ? `• Celtiis Cash : ${seller.celtiisNumber} (${seller.celtiisName || seller.shopOwner})` : ''}
        </div>

        {/* FOOTER & CREATOR CREDIT */}
        <div className="text-center pt-4 border-t border-slate-200 space-y-1">
          <p className="font-semibold text-slate-800 text-xs italic">
            "{receipt.footerText || seller.defaultFooter || 'Merci pour votre confiance !'}"
          </p>
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
            <span>Certifié conforme</span>
            <span>•</span>
            <span>Reçu Pro Bénin</span>
            <span>•</span>
            <span className="font-medium text-slate-500">
              Développé par jboy Ozzy (Clovis Arsène junior DOUBOGAN)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
