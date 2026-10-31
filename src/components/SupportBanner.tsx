import React, { useState } from 'react';
import { Heart, Smartphone, Copy, Check, Sparkles, Send } from 'lucide-react';

interface SupportBannerProps {
  onOpenSupportModal?: () => void;
}

export const SupportBanner: React.FC<SupportBannerProps> = ({ onOpenSupportModal }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyNumber = (num: string, label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(num);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-rose-200/80 shadow-xs relative overflow-hidden my-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <Heart className="w-5 h-5 fill-white" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded-md">
                Soutenir le développeur
              </span>
              <span className="text-xs text-slate-500">Bénin 🇧🇯</span>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              Vous aimez Reçu Pro Bénin ? Soutenez financièrement le projet
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              Cette application a été créée avec passion pour simplifier la vie des commerçantes et commerçants.
              Si vous souhaitez soutenir financièrement <strong>jboy Ozzy (Clovis Arsène junior DOUBOGAN)</strong> pour m'aider à maintenir l'outil et ses serveurs, vous pouvez m'envoyer un don ou pourboire direct via Mobile Money :
            </p>
          </div>
        </div>

        {/* Action pills */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto pt-2 md:pt-0">
          {/* MTN button */}
          <button
            type="button"
            onClick={(e) => copyNumber('0157586308', 'MTN', e)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl border border-amber-500 shadow-2xs transition-colors cursor-pointer"
            title="Copier le numéro MTN"
          >
            <span className="w-4 h-4 rounded-full bg-slate-950 text-amber-400 font-bold text-[9px] flex items-center justify-center">
              M
            </span>
            <span>MTN : 01 57 58 63 08</span>
            {copied === 'MTN' ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5 text-slate-700" />}
          </button>

          {/* Celtiis button */}
          <button
            type="button"
            onClick={(e) => copyNumber('0141159129', 'CELTIIS', e)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3 py-2 rounded-xl border border-sky-700 shadow-2xs transition-colors cursor-pointer"
            title="Copier le numéro Celtiis"
          >
            <span className="w-4 h-4 rounded-full bg-white text-sky-600 font-bold text-[9px] flex items-center justify-center">
              C
            </span>
            <span>Celtiis : 01 41 15 91 29</span>
            {copied === 'CELTIIS' ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5 text-sky-200" />}
          </button>

          {onOpenSupportModal && (
            <button
              type="button"
              onClick={onOpenSupportModal}
              className="w-full md:w-auto text-xs font-bold text-rose-800 hover:text-rose-950 bg-rose-100 hover:bg-rose-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Plus d'options →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
