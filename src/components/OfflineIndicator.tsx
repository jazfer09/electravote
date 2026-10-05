import React, { useEffect, useState } from 'react';
import { WifiOff, Check } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  if (showReconnected) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 px-3.5 py-2 text-xs font-medium shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-200">
        <Check className="w-3.5 h-3.5 text-emerald-400" />
        <span>Connected to live election ledger</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-950/90 border border-amber-500/50 text-amber-200 px-3.5 py-2 text-xs font-medium shadow-2xl backdrop-blur-md animate-bounce">
      <WifiOff className="w-3.5 h-3.5 text-amber-400" />
      <span>Offline Mode — Ballot draft & local ledger cached locally</span>
    </div>
  );
};
