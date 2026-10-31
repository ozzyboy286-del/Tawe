import React from 'react';
import { ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';

interface CreatorBadgeProps {
  compact?: boolean;
  onOpenSupport?: () => void;
}

export const CreatorBadge: React.FC<CreatorBadgeProps> = ({ compact = false, onOpenSupport }) => {
  if (compact) {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 border-t border-slate-200/80 pt-4 px-2">
        <div className="flex items-center gap-1.5 font-medium text-slate-700">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>
            Créé par <strong className="text-blue-900">jboy Ozzy</strong> (
            <span className="text-amber-600 font-semibold">Clovis Arsène junior DOUBOGAN</span>)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
          <span className="text-slate-500">
            Soutien volontaire : <strong>MTN</strong> 0157586308 • <strong>Celtiis</strong> 0141159129
          </span>
          {onOpenSupport && (
            <button
              onClick={onOpenSupport}
              className="text-rose-600 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Heart className="w-3 h-3 fill-rose-500" />
              <span>Soutenir</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-3xl p-6 shadow-xl border border-blue-800/60 relative overflow-hidden my-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shrink-0">
            JO
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                Auteur & Concepteur
              </span>
              <span className="text-xs text-slate-300">Bénin 🇧🇯</span>
            </div>
            <h4 className="text-lg font-bold text-white tracking-tight mt-1">
              jboy Ozzy
            </h4>
            <p className="text-xs text-slate-300">
              <span className="text-amber-300 font-semibold">Clovis Arsène junior DOUBOGAN</span> • Ingénieur & Développeur Web / Mobile
            </p>
          </div>
        </div>

        {/* Support phrasing & quick CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-700/60 w-full md:w-auto">
          <div className="text-xs text-slate-300 bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10 max-w-sm">
            <p className="text-amber-200 font-semibold mb-0.5">Soutien financier au développeur :</p>
            <p className="text-[11px] text-slate-300">
              MTN MoMo : <strong className="text-white font-mono">0157586308</strong> | Celtiis : <strong className="text-white font-mono">0141159129</strong>
            </p>
          </div>

          {onOpenSupport && (
            <button
              onClick={onOpenSupport}
              className="bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Faire un don</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
