import React from 'react';
import {
  FileText,
  PlusCircle,
  Smartphone,
  Share2,
  Download,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Zap,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Award,
} from 'lucide-react';
import { CreatorBadge } from './CreatorBadge';
import { SupportBanner } from './SupportBanner';

interface HeroHomeProps {
  onStartCreate: () => void;
  onViewHistory: () => void;
  onOpenSubscription: () => void;
  onOpenSupportModal?: () => void;
  receiptsCount: number;
  canCreateMore?: boolean;
}

export const HeroHome: React.FC<HeroHomeProps> = ({
  onStartCreate,
  onViewHistory,
  onOpenSubscription,
  onOpenSupportModal,
  receiptsCount,
  canCreateMore = true,
}) => {
  const handleCreate = () => {
    if (!canCreateMore) {
      onOpenSubscription();
    } else {
      onStartCreate();
    }
  };
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-blue-900/40">
        {/* Glow shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          {/* Benin Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-amber-300 mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Spécialement conçu pour les commerçants du Bénin 🇧🇯</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white mb-4">
            Crée ton reçu pro en <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300">10 secondes</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-8">
            Adieu les carnets en papier froissés ! Génère des factures et reçus impeccables avec ton logo,
            envoi WhatsApp direct, suivi des acomptes et boutons de paiement direct sur tes comptes <strong className="text-amber-400 font-semibold">MTN MoMo</strong> et <strong className="text-sky-300 font-semibold">Celtiis Cash</strong>.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              onClick={handleCreate}
              className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-7 py-4 rounded-2xl shadow-lg shadow-amber-500/25 active:scale-98 transition-all cursor-pointer text-base"
            >
              <PlusCircle className="w-5 h-5 text-slate-950" />
              <span>Créer un reçu</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {receiptsCount > 0 && (
              <button
                onClick={onViewHistory}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-medium px-5 py-4 rounded-2xl border border-white/15 backdrop-blur-sm transition-all cursor-pointer text-sm"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Voir mes {receiptsCount} reçu{receiptsCount > 1 ? 's' : ''}</span>
              </button>
            )}
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-8 mt-8 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zéro papier, 100% Mobile</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Partage WhatsApp 1-Clic</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Téléchargement PDF certifié</span>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Attribution Section */}
      <CreatorBadge onOpenSupport={onOpenSupportModal} />

      {/* Financial Support phrase and MoMo banner */}
      <SupportBanner onOpenSupportModal={onOpenSupportModal} />

      {/* Feature Pillars: Built for Cotonou Merchants */}
      <section className="space-y-4">
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Pensé pour le commerce à Cotonou & partout au Bénin
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Que vous vendiez sur WhatsApp, TikTok, Instagram ou en boutique physique à Dantokpa, Ganhi, Calavi ou Cadjèhoun.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center mb-3.5">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Remplissage en 10s</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ajoutez vos articles, quantités et prix en FCFA. Le total et les acomptes se calculent instantanément.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3.5">
              <Share2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Envoi WhatsApp direct</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Message pré-rempli ultra propre envoyé directement sur le WhatsApp de votre client(e) avec l'indicatif +229.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3.5">
              <Smartphone className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">MTN MoMo & Celtiis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Boutons de paiement intégrés pour que vos clients vous envoient directement leur règlement sur votre MTN MoMo ou Celtiis Cash.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center mb-3.5">
              <Download className="w-5 h-5 text-blue-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">PDF Pro avec Cachet</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reçu authentique avec logo, numéro unique REC-2026-..., date et cachet officiel PAYÉ ou ACOMPTE.
            </p>
          </div>
        </div>
      </section>

      {/* Typical Merchant Categories */}
      <section className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-blue-500/10 p-6 rounded-3xl border border-amber-200/60">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold text-amber-800 tracking-wider uppercase bg-amber-200/60 px-2.5 py-1 rounded-md">
              Secteurs clés au Bénin
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-2">
              Idéal pour vos activités de commerce quotidien
            </h3>
          </div>
          <button
            onClick={handleCreate}
            className="text-xs sm:text-sm font-semibold text-blue-900 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Créer un modèle express →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <p className="font-bold text-slate-900 text-sm">👗 Prêt-à-porter & Wax</p>
            <p className="text-slate-500 mt-1">Robes, ensembles, pagnes, costumes sur mesure.</p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <p className="font-bold text-slate-900 text-sm">💇‍♀️ Perruques & Mèches</p>
            <p className="text-slate-500 mt-1">Frontales, closures, tissages brésiliens & soins.</p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <p className="font-bold text-slate-900 text-sm">👠 Chaussures & Sacs</p>
            <p className="text-slate-500 mt-1">Talons, sneakers, sacs à main, maroquinerie.</p>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <p className="font-bold text-slate-900 text-sm">📱 Téléphones & High-Tech</p>
            <p className="text-slate-500 mt-1">Smartphones, écouteurs, montres & accessoires.</p>
          </div>
        </div>
      </section>

      {/* Free Trial Callout */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Offre de lancement</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Essai gratuit : 3 reçus offerts immédiatement
          </h3>
          <p className="text-sm text-slate-600 max-w-xl">
            Testez sans engagement ! Ensuite, bénéficiez de reçus illimités pour seulement <strong className="text-slate-900">1 500 FCFA / mois</strong> via <strong className="text-amber-600">MTN MoMo (0157586308)</strong> ou <strong className="text-sky-600">Celtiis Cash (0141159129)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            onClick={handleCreate}
            className="flex-1 md:flex-initial bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer text-center"
          >
            Créer mon premier reçu
          </button>
          <button
            onClick={onOpenSubscription}
            className="flex-1 md:flex-initial bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-sm px-5 py-3.5 rounded-xl transition-all cursor-pointer text-center"
          >
            Voir l'offre PRO
          </button>
        </div>
      </section>
    </div>
  );
};
