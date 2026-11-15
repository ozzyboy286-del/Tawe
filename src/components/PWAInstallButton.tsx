import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'hero';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'hero') {
      return (
        <button
          type="button"
          onClick={install}
          className="flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-semibold px-5 py-4 rounded-2xl border border-emerald-400/30 backdrop-blur-sm transition-all cursor-pointer text-sm"
        >
          <Download className="w-4 h-4 text-emerald-300" />
          <span>Installer l'app (PWA)</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={install}
        title="Installer Reçu Pro Bénin sur votre appareil"
        className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold px-2.5 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs"
      >
        <Download className="w-3.5 h-3.5 text-emerald-700" />
        <span className="hidden sm:inline">Installer l'app</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        {variant === 'hero' ? (
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center justify-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-semibold px-5 py-4 rounded-2xl border border-emerald-400/30 backdrop-blur-sm transition-all cursor-pointer text-sm"
          >
            <Smartphone className="w-4 h-4 text-emerald-300" />
            <span>Installer sur iPhone</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            title="Installer sur iPhone / iPad"
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold px-2.5 py-1.5 rounded-full transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Installer</span>
          </button>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-950 text-amber-400 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Installer sur iPhone / iPad
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Ajoutez <strong>Reçu Pro Bénin</strong> à votre écran d'accueil pour l'utiliser comme une application native, même hors connexion :
              </p>

              <ol className="space-y-3 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <span>
                    Appuyez sur le bouton <strong>Partager</strong> <Share className="inline w-3.5 h-3.5 text-blue-600 mx-0.5" /> dans la barre Safari.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <span>
                    Faites défiler et choisissez <strong>Sur l'écran d'accueil</strong> <PlusSquare className="inline w-3.5 h-3.5 text-slate-700 mx-0.5" />.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <span>
                    Appuyez sur <strong>Ajouter</strong> en haut à droite.
                  </span>
                </li>
              </ol>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-blue-950 hover:bg-blue-900 py-2.5 text-xs font-bold text-white transition cursor-pointer"
              >
                Compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
