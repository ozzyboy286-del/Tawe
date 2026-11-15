import React from 'react';
import {
  Zap,
  Share2,
  Smartphone,
  Download,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  Crown,
  WifiOff,
} from 'lucide-react';
import { CreatorBadge } from './CreatorBadge';
import { SupportBanner } from './SupportBanner';
import { PWAInstallButton } from './PWAInstallButton';

interface PresentationPageProps {
  onStartCreate: () => void;
  onOpenSubscription: () => void;
  onOpenSupportModal?: () => void;
  onGoHome: () => void;
  canCreateMore?: boolean;
}

export const PresentationPage: React.FC<PresentationPageProps> = ({
  onStartCreate,
  onOpenSubscription,
  onOpenSupportModal,
  onGoHome,
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
    <div className="space-y-10 pb-12">
      {/* 01. Intro & Value Proposition */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-blue-900/40">
        <div className="relative z-10 max-w-3xl">
          <p className="text-xs font-semibold text-amber-300 tracking-wide mb-3">
            Présentation · Cotonou &amp; Bénin
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white mb-4 [text-wrap:balance]">
            L'outil simple pour facturer vos clients sans carnet papier
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-8">
            Reçu Pro Bénin remplace les carnets froissés par des reçus professionnels avec votre logo,
            envoi WhatsApp en un clic, suivi des acomptes et paiement direct sur{' '}
            <strong className="text-amber-400 font-semibold">MTN MoMo</strong> et{' '}
            <strong className="text-sky-300 font-semibold">Celtiis Cash</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              type="button"
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer text-sm sm:text-base whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-5 h-5 text-slate-950" />
              <span>Créer un reçu maintenant</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onGoHome}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-medium px-5 py-3.5 rounded-2xl border border-white/15 transition-all cursor-pointer text-sm whitespace-nowrap shrink-0"
            >
              <span>Retour à l'accueil</span>
            </button>

            <PWAInstallButton variant="hero" />
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-7 mt-8 border-t border-white/10 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              100% Mobile &amp; PC
            </span>
            <span className="inline-flex items-center gap-1.5">
              <WifiOff className="w-4 h-4 text-amber-300 shrink-0" />
              Fonctionne hors ligne (PWA)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              Export PDF certifié
            </span>
          </div>
        </div>
      </section>

      {/* 02. Core Capabilities */}
      <section className="space-y-5">
        <div>
          <p className="text-xs font-semibold text-blue-800 mb-1">01. Fonctionnalités clés</p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 [text-wrap:balance]">
            Pensé pour le commerce à Cotonou &amp; partout au Bénin
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Que vous vendiez sur WhatsApp, TikTok, Instagram ou en boutique à Dantokpa, Ganhi, Calavi ou Cadjèhoun.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 transition-colors hover:border-blue-300">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center mb-3.5">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Remplissage en 10s</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ajoutez vos articles, quantités et prix en FCFA. Le total et les acomptes se calculent instantanément.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 transition-colors hover:border-emerald-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3.5">
              <Share2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Envoi WhatsApp direct</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Message pré-rempli ultra propre envoyé directement sur le WhatsApp de votre client avec l'indicatif +229.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 transition-colors hover:border-amber-300">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3.5">
              <Smartphone className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">MTN MoMo &amp; Celtiis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Boutons de paiement intégrés pour recevoir vos règlements directement sur MTN MoMo ou Celtiis Cash.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 transition-colors hover:border-blue-300">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center mb-3.5">
              <Download className="w-5 h-5 text-blue-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">PDF Pro avec Cachet</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reçu authentique avec logo, numéro unique REC-2026, date et cachet officiel PAYÉ, ACOMPTE ou IMPAYÉ.
            </p>
          </div>
        </div>
      </section>

      {/* 03. Merchant Categories */}
      <section className="bg-white p-6 rounded-3xl border border-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-xs font-semibold text-amber-700 mb-1">02. Secteurs adaptés</p>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Idéal pour vos activités de commerce quotidien
            </h3>
          </div>
          <button
            type="button"
            onClick={handleCreate}
            className="text-xs sm:text-sm font-semibold text-blue-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Créer un modèle express →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <p className="font-bold text-slate-900 text-sm">Prêt-à-porter &amp; Wax</p>
            <p className="text-slate-600 mt-1 leading-relaxed">Robes, ensembles, pagnes, costumes sur mesure.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <p className="font-bold text-slate-900 text-sm">Perruques &amp; Mèches</p>
            <p className="text-slate-600 mt-1 leading-relaxed">Frontales, closures, tissages brésiliens &amp; soins.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <p className="font-bold text-slate-900 text-sm">Chaussures &amp; Sacs</p>
            <p className="text-slate-600 mt-1 leading-relaxed">Talons, sneakers, sacs à main, maroquinerie.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <p className="font-bold text-slate-900 text-sm">Téléphones &amp; High-Tech</p>
            <p className="text-slate-600 mt-1 leading-relaxed">Smartphones, écouteurs, montres &amp; accessoires.</p>
          </div>
        </div>
      </section>

      {/* 04. Pricing & Trial */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-emerald-700">03. Offre &amp; Abonnement</p>
          <h3 className="text-xl font-bold text-slate-900">
            Essai gratuit : 3 reçus offerts immédiatement
          </h3>
          <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
            Testez sans engagement ! Ensuite, bénéficiez de reçus illimités pour seulement{' '}
            <strong className="text-slate-900 tabular-nums">1 500 FCFA / mois</strong> via{' '}
            <strong className="text-amber-700 font-mono">MTN MoMo (0157586308)</strong> ou{' '}
            <strong className="text-sky-700 font-mono">Celtiis Cash (0141159129)</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={handleCreate}
            className="bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors cursor-pointer text-center whitespace-nowrap"
          >
            Créer un reçu
          </button>
          <button
            type="button"
            onClick={onOpenSubscription}
            className="inline-flex items-center justify-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-sm px-5 py-3 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
          >
            <Crown className="w-4 h-4 text-amber-600" />
            <span>Voir l'offre PRO</span>
          </button>
        </div>
      </section>

      {/* 05. Creator & Support */}
      <div className="space-y-4">
        <CreatorBadge onOpenSupport={onOpenSupportModal} />
        <SupportBanner onOpenSupportModal={onOpenSupportModal} />
      </div>
    </div>
  );
};
