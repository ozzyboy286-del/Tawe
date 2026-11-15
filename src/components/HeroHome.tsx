import React from 'react';
import {
  FileText,
  PlusCircle,
  ArrowRight,
  Store,
  Crown,
  BookOpen,
  History,
  ChevronRight,
} from 'lucide-react';
import { Receipt, SellerProfile, SubscriptionInfo } from '../types/receipt';
import { formatFCFA, formatDateFrench } from '../utils/storage';
import { PWAInstallButton } from './PWAInstallButton';

interface HeroHomeProps {
  onStartCreate: () => void;
  onViewHistory: () => void;
  onOpenPresentation: () => void;
  onOpenProfile: () => void;
  onOpenSubscription: () => void;
  onSelectReceipt: (receipt: Receipt) => void;
  sellerProfile: SellerProfile;
  subscription: SubscriptionInfo;
  recentReceipts: Receipt[];
  receiptsCount: number;
  canCreateMore?: boolean;
}

export const HeroHome: React.FC<HeroHomeProps> = ({
  onStartCreate,
  onViewHistory,
  onOpenPresentation,
  onOpenProfile,
  onOpenSubscription,
  onSelectReceipt,
  sellerProfile,
  subscription,
  recentReceipts,
  receiptsCount,
  canCreateMore = true,
}) => {
  const freeRemaining = Math.max(0, subscription.maxFreeReceipts - subscription.freeReceiptsUsed);

  const handleCreate = () => {
    if (!canCreateMore) {
      onOpenSubscription();
    } else {
      onStartCreate();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Focused, Airy Hero Workspace Launchpad */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white p-6 sm:p-10 shadow-xl border border-blue-900/40">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-amber-300 mb-3">
              {sellerProfile.shopName || 'Ma Boutique'} · {sellerProfile.city || 'Cotonou'}, Bénin
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white mb-3 [text-wrap:balance]">
              Crée ton reçu pro en{' '}
              <span className="text-amber-400">10 secondes</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-7 max-w-xl">
              Générez vos reçus avec logo, export PDF et envoi WhatsApp direct, avec paiement MTN MoMo et Celtiis Cash.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleCreate}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer text-sm sm:text-base whitespace-nowrap shrink-0"
              >
                <PlusCircle className="w-5 h-5 text-slate-950" />
                <span>Créer un reçu</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {receiptsCount > 0 && (
                <button
                  type="button"
                  onClick={onViewHistory}
                  className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-medium px-5 py-3.5 rounded-2xl border border-white/15 transition-all cursor-pointer text-sm whitespace-nowrap shrink-0"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Historique ({receiptsCount})</span>
                </button>
              )}

              <PWAInstallButton variant="hero" />
            </div>
          </div>

          {/* Right Quick Presentation Link Card */}
          <div className="lg:w-72 bg-white/10 border border-white/15 rounded-2xl p-5 flex flex-col justify-between gap-4 shrink-0">
            <div>
              <p className="text-xs font-semibold text-amber-300 mb-1">Nouveau sur l'application ?</p>
              <p className="text-xs text-slate-200 leading-relaxed">
                Consultez la présentation complète des fonctionnalités, secteurs et tarifs PRO.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenPresentation}
              className="w-full flex items-center justify-between gap-2 bg-white/15 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <span className="inline-flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>Voir la présentation</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Quick Workspace Status Bar (3 lightweight tiles) */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={onOpenProfile}
          className="text-left bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer flex items-center justify-between gap-3"
        >
          <div className="min-w-0">
            <p className="text-xs text-slate-500 font-medium">Boutique active</p>
            <p className="text-sm font-bold text-slate-900 truncate mt-0.5">
              {sellerProfile.shopName || 'Configurer ma boutique'}
            </p>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {sellerProfile.shopOwner || 'Nom du responsable'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
        </button>

        <button
          type="button"
          onClick={onViewHistory}
          className="text-left bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer flex items-center justify-between gap-3"
        >
          <div>
            <p className="text-xs text-slate-500 font-medium">Reçus enregistrés</p>
            <p className="text-xl font-extrabold text-slate-900 tabular-nums mt-0.5">
              {receiptsCount}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Accès rapide hors ligne</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <History className="w-5 h-5" />
          </div>
        </button>

        <button
          type="button"
          onClick={onOpenSubscription}
          className="text-left bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-300 transition-colors cursor-pointer flex items-center justify-between gap-3"
        >
          <div>
            <p className="text-xs text-slate-500 font-medium">Forfait actuel</p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {subscription.isSubscribed
                ? 'Membre PRO Illimité'
                : freeRemaining > 0
                ? `Essai · ${freeRemaining} reçu${freeRemaining > 1 ? 's' : ''} restant${freeRemaining > 1 ? 's' : ''}`
                : 'Essai gratuit épuisé'}
            </p>
            <p className="text-xs text-amber-700 font-medium mt-0.5 tabular-nums">
              {subscription.isSubscribed ? 'Actif' : 'PRO : 1 500 FCFA / mois'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5" />
          </div>
        </button>
      </section>

      {/* Recent Receipts (Clean list of up to 3 items when available) */}
      {recentReceipts.length > 0 && (
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Derniers reçus créés</h2>
            <button
              type="button"
              onClick={onViewHistory}
              className="text-xs font-semibold text-blue-900 hover:underline cursor-pointer"
            >
              Tout voir →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentReceipts.slice(0, 3).map((rec) => (
              <button
                key={rec.id}
                type="button"
                onClick={() => onSelectReceipt(rec)}
                className="w-full px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {rec.clientName}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {rec.receiptNumber} · {formatDateFrench(rec.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900 tabular-nums">
                      {formatFCFA(rec.totalAmount)}
                    </p>
                    <p
                      className={`text-[11px] font-semibold ${
                        rec.status === 'PAID'
                          ? 'text-emerald-700'
                          : rec.status === 'PARTIAL'
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {rec.status === 'PAID'
                        ? 'Payé'
                        : rec.status === 'PARTIAL'
                        ? 'Acompte'
                        : 'Impayé'}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
