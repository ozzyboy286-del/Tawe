import React from 'react';
import { FileText, PlusCircle, History, Store, Crown, Sparkles, CheckCircle2 } from 'lucide-react';
import { SubscriptionInfo } from '../types/receipt';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentTab: 'home' | 'presentation' | 'create' | 'history' | 'profile' | 'subscription';
  setCurrentTab: (tab: 'home' | 'presentation' | 'create' | 'history' | 'profile' | 'subscription') => void;
  subscription: SubscriptionInfo;
  receiptsCount: number;
  onOpenSubscriptionModal: () => void;
  onOpenSupportModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  subscription,
  receiptsCount,
  onOpenSubscriptionModal,
  onOpenSupportModal,
}) => {
  const freeRemaining = Math.max(0, subscription.maxFreeReceipts - subscription.freeReceiptsUsed);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          {/* Logo & App Name */}
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 text-left group focus:outline-hidden shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-none whitespace-nowrap">
                  Reçu Pro <span className="text-amber-600">Bénin</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-1 whitespace-nowrap">
                par <strong className="text-slate-700 font-semibold">jboy Ozzy</strong>
              </p>
            </div>
          </button>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Install PWA button */}
            <PWAInstallButton variant="header" />

            {/* Support author button */}
            {onOpenSupportModal && (
              <button
                onClick={onOpenSupportModal}
                className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-semibold px-2.5 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                title="Soutenir jboy Ozzy (Clovis Arsène junior DOUBOGAN)"
              >
                <span className="text-rose-500">❤️</span>
                <span className="hidden sm:inline">Soutenir</span>
              </button>
            )}

            {/* Subscription Status */}
            {subscription.isSubscribed ? (
              <button
                onClick={onOpenSubscriptionModal}
                className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-xs hover:brightness-105 transition-all whitespace-nowrap cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                <span>PRO Illimité</span>
              </button>
            ) : freeRemaining === 0 ? (
              <button
                onClick={onOpenSubscriptionModal}
                className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold px-2.5 py-1.5 rounded-full border border-rose-300 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
              >
                <Crown className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
                <span className="hidden xs:inline">Essai épuisé · 1 500 F</span>
                <span className="xs:hidden">PRO</span>
              </button>
            ) : (
              <button
                onClick={onOpenSubscriptionModal}
                className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-amber-300/80 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
              >
                <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span className="hidden sm:inline">Essai :</span>
                <span className="font-bold text-amber-700 tabular-nums">{freeRemaining} offert{freeRemaining > 1 ? 's' : ''}</span>
              </button>
            )}

            {/* Quick CTA to create receipt */}
            {currentTab !== 'create' && (
              <button
                onClick={() => setCurrentTab('create')}
                className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 active:scale-95 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Créer un reçu</span>
                <span className="sm:hidden">Nouveau</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs (Mobile-first responsive bar) */}
        <nav className="flex items-center justify-between sm:justify-start gap-1 sm:gap-2 border-t border-slate-100 py-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
              currentTab === 'home'
                ? 'bg-blue-50 text-blue-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>Accueil</span>
          </button>

          <button
            onClick={() => setCurrentTab('presentation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
              currentTab === 'presentation'
                ? 'bg-blue-50 text-blue-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>Présentation</span>
          </button>

          <button
            onClick={() => setCurrentTab('create')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
              currentTab === 'create'
                ? 'bg-blue-50 text-blue-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Nouveau reçu</span>
          </button>

          <button
            onClick={() => setCurrentTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
              currentTab === 'history'
                ? 'bg-blue-50 text-blue-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Historique</span>
            {receiptsCount > 0 && (
              <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold tabular-nums">
                {receiptsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
              currentTab === 'profile'
                ? 'bg-blue-50 text-blue-900 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Ma Boutique</span>
          </button>

          <button
            onClick={() => setCurrentTab('subscription')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
              currentTab === 'subscription'
                ? 'bg-amber-100/70 text-amber-950 font-semibold'
                : 'text-amber-800 hover:text-amber-950 hover:bg-amber-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Abonnement</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
