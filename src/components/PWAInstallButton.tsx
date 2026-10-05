import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, hide prompt button
  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition active:scale-95 whitespace-nowrap"
        title="Install ElectraVote on your home screen or desktop for fast offline-ready access"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 px-3 py-1.5 text-xs font-medium transition active:scale-95 whitespace-nowrap"
        >
          <Smartphone className="w-3.5 h-3.5 text-sky-400" />
          <span>Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                    EV
                  </div>
                  <h3 className="font-semibold text-white">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-900/60 text-blue-300 flex items-center justify-center text-[11px] font-bold">1</span>
                  <p>In Safari, tap the <strong className="text-white">Share</strong> button (box with an arrow) on the browser toolbar.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-900/60 text-blue-300 flex items-center justify-center text-[11px] font-bold">2</span>
                  <p>Scroll down in the action sheet and select <strong className="text-white">Add to Home Screen</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-900/60 text-blue-300 flex items-center justify-center text-[11px] font-bold">3</span>
                  <p>Tap <strong className="text-blue-400">Add</strong> in top-right to launch ElectraVote as a standalone full-screen app.</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 text-xs font-semibold text-white shadow-lg transition active:scale-98"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop install hint button if browser doesn't dispatch event yet
  return (
    <button
      onClick={() => alert('To install ElectraVote Pro: Click the install icon in your browser URL bar or select "Install App" in your browser menu.')}
      className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 text-xs font-medium transition"
      title="Install as Progressive Web App"
    >
      <Download className="w-3.5 h-3.5 text-sky-400" />
      <span>Install PWA</span>
    </button>
  );
};
