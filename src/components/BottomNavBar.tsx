import React from 'react';
import { Home, PlusCircle, History, Store, Crown, Heart } from 'lucide-react';
import { SubscriptionInfo } from '../types/receipt';

interface BottomNavBarProps {
  currentTab: 'home' | 'create' | 'history' | 'profile' | 'subscription';
  setCurrentTab: (tab: 'home' | 'create' | 'history' | 'profile' | 'subscription') => void;
  receiptsCount: number;
  subscription: SubscriptionInfo;
  onOpenSupportModal: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  setCurrentTab,
  receiptsCount,
  subscription,
  onOpenSupportModal,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 safe-bottom shadow-lg">
      <div className="grid grid-cols-5 items-center max-w-lg mx-auto py-1 px-1">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'home'
              ? 'text-blue-900 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5 leading-none">Accueil</span>
        </button>

        {/* 2. Nouveau Reçu (Hero Primary Action) */}
        <button
          type="button"
          onClick={() => setCurrentTab('create')}
          className="flex flex-col items-center justify-center py-1 px-1 transition-all cursor-pointer group"
        >
          <div
            className={`w-11 h-11 -mt-4 rounded-full flex items-center justify-center shadow-lg transition-transform group-active:scale-95 ${
              currentTab === 'create'
                ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 ring-4 ring-amber-200/80 scale-105'
                : 'bg-gradient-to-tr from-blue-900 to-slate-900 text-white shadow-blue-900/30'
            }`}
          >
            <PlusCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span
            className={`text-[10px] mt-1 font-bold leading-none ${
              currentTab === 'create' ? 'text-amber-600' : 'text-slate-700'
            }`}
          >
            Nouveau
          </span>
        </button>

        {/* 3. Historique */}
        <button
          type="button"
          onClick={() => setCurrentTab('history')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer relative ${
            currentTab === 'history'
              ? 'text-blue-900 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <History className={`w-5 h-5 ${currentTab === 'history' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {receiptsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {receiptsCount > 9 ? '9+' : receiptsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 leading-none">Reçus</span>
        </button>

        {/* 4. Ma Boutique */}
        <button
          type="button"
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'profile'
              ? 'text-blue-900 font-bold scale-105'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Store className={`w-5 h-5 ${currentTab === 'profile' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5 leading-none">Boutique</span>
        </button>

        {/* 5. PRO / Soutien */}
        <button
          type="button"
          onClick={onOpenSupportModal}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer text-rose-600 hover:text-rose-700 group"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-[10px] mt-0.5 leading-none font-bold text-rose-700">Soutenir</span>
        </button>
      </div>
    </div>
  );
};
