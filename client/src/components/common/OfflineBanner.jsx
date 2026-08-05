import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';

export default function OfflineBanner() {
  const isOffline = useOfflineStatus();

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center p-2 bg-red-500 text-white font-medium text-sm shadow-md animate-in slide-in-from-top">
      <WifiOff className="w-4 h-4 mr-2" />
      You are currently offline. Some features may not be available.
    </div>
  );
}
