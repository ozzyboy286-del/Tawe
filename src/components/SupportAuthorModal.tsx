import React, { useState } from 'react';
import {
  X,
  Heart,
  Smartphone,
  Copy,
  Check,
  PhoneCall,
  Sparkles,
  Award,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SupportAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportAuthorModal: React.FC<SupportAuthorModalProps> = ({ isOpen, onClose }) => {
  const [copiedOperator, setCopiedOperator] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);

  if (!isOpen) return null;

  const mtnNumber = '0157586308';
  const celtiisNumber = '0141159129';
  const authorName = 'jboy Ozzy (Clovis Arsène junior DOUBOGAN)';

  const mtnUssd = `*880*41*${mtnNumber}*${selectedAmount}#`;
  const celtiisUssd = `*889*1*${celtiisNumber}*${selectedAmount}#`;

  const handleCopy = (text: string, op: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOperator(op);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
    });
    setTimeout(() => setCopiedOperator(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with warm gradient */}
        <div className="bg-gradient-to-r from-rose-900 via-pink-900 to-amber-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-bold border border-rose-400/30 mb-3">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Soutien au Créateur Béninois</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            Soutenir jboy Ozzy
          </h3>
          <p className="text-xs sm:text-sm text-rose-100 mt-1">
            <span className="text-amber-300 font-semibold">Clovis Arsène junior DOUBOGAN</span> • Développeur & Concepteur de Reçu Pro Bénin
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Heartfelt support message */}
          <div className="bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 p-4 rounded-2xl border border-rose-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2">
            <p className="font-semibold text-rose-950">
              🙏 <strong>Un geste pour encourager l'innovation locale :</strong>
            </p>
            <p className="text-slate-700">
              Vous appréciez <strong>Reçu Pro Bénin</strong> et cette solution vous fait gagner du temps au quotidien ?
              Si vous souhaitez me soutenir financièrement pour encourager mon travail et m'aider à maintenir l'outil gratuit et accessible à tous les commerçants du Bénin, vous pouvez m'envoyer une contribution via Mobile Money :
            </p>
          </div>

          {/* Amount selector for quick USSD generation */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Montant du soutien (FCFA) :
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[500, 1000, 2000, 5000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSelectedAmount(amt)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedAmount === amt
                      ? 'bg-rose-600 text-white border-rose-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {amt} F
                </button>
              ))}
            </div>
          </div>

          {/* MTN MoMo card */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-amber-400 font-black text-[10px] flex items-center justify-center">
                  M
                </span>
                <span>MTN Mobile Money Bénin</span>
              </span>
              <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                01 57 58 63 08
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-700">
              <span>Bénéficiaire : <strong>{authorName}</strong></span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`tel:${encodeURIComponent(mtnUssd)}`}
                className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Envoyer {selectedAmount} F via MoMo</span>
              </a>

              <button
                type="button"
                onClick={() => handleCopy(mtnNumber, 'MTN')}
                className="bg-white hover:bg-amber-100 text-slate-800 border border-amber-300 p-2.5 rounded-xl transition-colors cursor-pointer"
                title="Copier le numéro MTN"
              >
                {copiedOperator === 'MTN' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Celtiis Cash card */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border-2 border-sky-300 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-sky-950 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-black text-[10px] flex items-center justify-center">
                  C
                </span>
                <span>Celtiis Cash Bénin</span>
              </span>
              <span className="text-[10px] bg-sky-200 text-sky-900 font-bold px-2 py-0.5 rounded-full">
                01 41 15 91 29
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-700">
              <span>Bénéficiaire : <strong>{authorName}</strong></span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`tel:${encodeURIComponent(celtiisUssd)}`}
                className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Envoyer {selectedAmount} F via Celtiis</span>
              </a>

              <button
                type="button"
                onClick={() => handleCopy(celtiisNumber, 'CELTIIS')}
                className="bg-white hover:bg-sky-100 text-slate-800 border border-sky-300 p-2.5 rounded-xl transition-colors cursor-pointer"
                title="Copier le numéro Celtiis"
              >
                {copiedOperator === 'CELTIIS' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-center text-slate-500 italic">
            "Chaque soutien, quel qu'en soit le montant, me touche profondément et m'aide à continuer à servir la communauté des commerçants béninois. Merci infiniment !"
          </p>

          <button
            onClick={onClose}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
