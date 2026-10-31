import React, { useState } from 'react';
import {
  X,
  Crown,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Smartphone,
  PhoneCall,
  Copy,
  Check,
  Zap,
  Clock,
} from 'lucide-react';
import { SubscriptionInfo } from '../types/receipt';
import { formatFCFA } from '../utils/storage';
import confetti from 'canvas-confetti';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionInfo;
  onSubscribeSuccess: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onSubscribeSuccess,
}) => {
  const [operator, setOperator] = useState<'MTN' | 'CELTIIS'>('MTN');
  const [simulating, setSimulating] = useState(false);
  const [copiedType, setCopiedType] = useState<'number' | 'ussd' | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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
    setTimeout(() => setToastMsg(null), 3000);
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

  const handleConfirmSubscription = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      onSubscribeSuccess();
      confetti({
        particleCount: 90,
        spread: 90,
        origin: { y: 0.6 },
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-3">
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Abonnement Professionnel Bénin</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            Passez à la formule Illimitée
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Reçus certifiés, sans limite et sans prise de tête.
          </p>
        </div>

        {/* Dynamic Toast Feedback */}
        {toastMsg && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Current Status Pill */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                Statut actuel
              </span>
              <p className="text-sm font-extrabold text-amber-950 mt-0.5">
                {subscription.isSubscribed
                  ? 'Compte PRO Illimité Actif'
                  : `Essai gratuit : ${freeRemaining} reçu${freeRemaining > 1 ? 's' : ''} restant${freeRemaining > 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-amber-800 font-semibold bg-amber-200/60 px-2 py-0.5 rounded-full">
                3 reçus offerts
              </span>
            </div>
          </div>

          {/* Pricing Highlight Card */}
          <div className="rounded-2xl border-2 border-blue-900 p-4 sm:p-5 bg-gradient-to-b from-blue-50/50 to-white relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 bg-blue-900 text-amber-300 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              Offre Unique
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                1 500 F
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500">
                / mois pour illimité
              </span>
            </div>

            <p className="text-xs text-slate-600 mt-1">
              "Essai gratuit : 3 reçus offerts, puis 1 500 F/mois pour illimité"
            </p>

            <ul className="space-y-1.5 mt-3 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Reçus et factures <strong>illimités</strong> chaque mois</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Logo de votre boutique en haute définition</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Téléchargement PDF certifié A4 & Partage WhatsApp 1-Clic</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Règlement direct par <strong>MTN MoMo (0157586308)</strong> ou <strong>Celtiis Cash (0141159129)</strong></span>
              </li>
            </ul>
          </div>

          {/* Mobile Money Selection: Strictly MTN MoMo and Celtiis Cash */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Moyen de règlement (2 méthodes uniques) :
              </span>
            </div>

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

            {/* Account Box */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Destinataire officiel :</span>
                <span className="font-bold text-slate-900">{targetName}</span>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">
                  Numéro officiel {operator === 'MTN' ? 'MTN MoMo' : 'Celtiis Cash'} :
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex-1 font-mono text-base font-black bg-white px-3 py-1.5 rounded-xl border border-slate-300 text-slate-900 select-all tracking-wider">
                    {targetNumber}
                  </div>
                  <button
                    onClick={handleCopyNumber}
                    className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
                    title="Copier le numéro"
                  >
                    {copiedType === 'number' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Direct USSD Dial / Action */}
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
                  <span>Envoyer 1 500 FCFA sur le {operator === 'MTN' ? 'MoMo' : 'Celtiis'}</span>
                </button>

                <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 text-[11px]">
                  <span className="font-mono text-slate-700 font-bold">{ussdFullSyntax}</span>
                  <button
                    type="button"
                    onClick={handleCopyUSSD}
                    className="text-blue-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    {copiedType === 'ussd' ? 'Copié !' : 'Copier'}
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Activation Button */}
            <button
              onClick={handleConfirmSubscription}
              disabled={simulating}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              {simulating ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Activation de votre compte PRO...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Activer mon abonnement PRO illimité (1 500 F/mois)</span>
                </>
              )}
            </button>
          </div>

          {/* Footer note */}
          <div className="text-center text-[11px] text-slate-400">
            Paiement 100% Mobile Money au Bénin. Développé par <strong>jboy Ozzy</strong> (Clovis Arsène junior DOUBOGAN).
          </div>
        </div>
      </div>
    </div>
  );
};
