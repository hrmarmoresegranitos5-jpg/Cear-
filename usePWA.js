// src/hooks/usePWA.js — Hook React para recursos PWA
//
// Expõe:
//   isOnline       → true/false (conexão atual)
//   canInstall     → true se o browser tem prompt de instalação disponível
//   installApp()   → dispara o prompt de instalação
//   updateReady    → true se nova versão do SW está disponível
//   applyUpdate()  → aplica a atualização e recarrega
//   isStandalone   → true se rodando como PWA instalado (sem barra do browser)

import { useState, useEffect, useCallback, useRef } from 'react';

export function usePWA() {
  const [isOnline,    setIsOnline]    = useState(navigator.onLine);
  const [canInstall,  setCanInstall]  = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  const [isStandalone] = useState(
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );

  const deferredPrompt = useRef(null);
  const waitingWorker  = useRef(null);

  useEffect(() => {
    // ── Online / Offline ───────────────────────────────────────────────────
    const goOnline  = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);

    // ── Prompt de instalação (Android/Desktop) ─────────────────────────────
    const handleInstallPrompt = e => {
      e.preventDefault();
      deferredPrompt.current = e;
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    // Quando o app é instalado, remove o botão
    window.addEventListener('appinstalled', () => {
      setCanInstall(false);
      deferredPrompt.current = null;
    });

    // ── Detecção de nova versão do Service Worker ──────────────────────────
    const handleUpdate = () => setUpdateReady(true);
    window.addEventListener('pwa-update-available', handleUpdate);

    // Captura o SW esperando via Service Worker API
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        if (reg.waiting) {
          waitingWorker.current = reg.waiting;
          setUpdateReady(true);
        }
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              waitingWorker.current = newWorker;
              setUpdateReady(true);
            }
          });
        });
      });
    }

    return () => {
      window.removeEventListener('online',  goOnline);
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('pwa-update-available', handleUpdate);
    };
  }, []);

  // Dispara prompt de instalação
  const installApp = useCallback(async () => {
    if (!deferredPrompt.current) return;
    deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    deferredPrompt.current = null;
    if (outcome === 'accepted') setCanInstall(false);
  }, []);

  // Aplica atualização do SW e recarrega
  const applyUpdate = useCallback(() => {
    if (waitingWorker.current) {
      waitingWorker.current.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  }, []);

  return { isOnline, canInstall, installApp, updateReady, applyUpdate, isStandalone };
}
