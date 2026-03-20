'use client';

import { useState, useEffect, useCallback } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'pwa-install-dismissed';
const DISMISS_DAYS = 14; // Don't show again for 14 days after dismiss

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Check if dismissed recently
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000) return;
    }

    // Detect iOS (Safari doesn't fire beforeinstallprompt)
    const ua = navigator.userAgent;
    const iosDevice = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS/.test(ua);
    if (iosDevice && isSafari) {
      setIsIos(true);
      // Show iOS banner after 30 seconds
      const timer = setTimeout(() => setShowBanner(true), 30000);
      return () => clearTimeout(timer);
    }

    // Chrome/Edge/Samsung — listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner after 20 seconds of engagement
      setTimeout(() => setShowBanner(true), 20000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowBanner(false);
    setShowIosGuide(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  }, []);

  if (!showBanner) return null;

  // iOS Safari — show manual instructions
  if (isIos) {
    return (
      <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 animate-in slide-in-from-bottom duration-300">
        <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl shrink-0">
                <Smartphone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  Install ToolsArena
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Add to your home screen for quick access — works offline too
                </p>
              </div>
              <button onClick={handleDismiss} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            {!showIosGuide ? (
              <button
                onClick={() => setShowIosGuide(true)}
                className="w-full mt-3 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
              >
                Show me how
              </button>
            ) : (
              <div className="mt-3 bg-slate-50 dark:bg-slate-900 rounded-xl p-3 space-y-2">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">In Safari:</p>
                <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-decimal list-inside">
                  <li>Tap the <strong className="text-slate-800 dark:text-slate-200">Share</strong> button (square with arrow) at the bottom</li>
                  <li>Scroll down and tap <strong className="text-slate-800 dark:text-slate-200">Add to Home Screen</strong></li>
                  <li>Tap <strong className="text-slate-800 dark:text-slate-200">Add</strong> in the top right</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Chrome/Edge/Samsung — native install prompt
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl shrink-0">
              <Download className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Install ToolsArena
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Get instant access from your home screen. Faster loading, works offline.
              </p>
            </div>
            <button onClick={handleDismiss} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium py-2.5 rounded-xl text-sm transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
