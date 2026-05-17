// src/components/PWABanners.jsx
//
// Dois banners contextuais:
//   <InstallBanner>  — aparece quando o app pode ser instalado (Android/Desktop)
//   <UpdateBanner>   — aparece quando nova versão do SW está disponível
//   <OfflineBadge>   — indicador discreto quando offline
//
// Uso em App.jsx:
//   import { InstallBanner, UpdateBanner, OfflineBadge } from './components/PWABanners';
//   const pwa = usePWA();
//   ...
//   <InstallBanner  show={pwa.canInstall}    onInstall={pwa.installApp} />
//   <UpdateBanner   show={pwa.updateReady}   onUpdate={pwa.applyUpdate} />
//   <OfflineBadge   show={!pwa.isOnline} />

import { useState } from 'react';

// ─────────────────────────────────────────────
// Estilos inline (não depende de CSS externo)
// ─────────────────────────────────────────────
const S = {
  // Banner de instalação (bottom sheet)
  installWrap: {
    position:   'fixed',
    bottom:     'calc(env(safe-area-inset-bottom, 0px) + 72px)', // acima da navbar
    left:       '1rem',
    right:      '1rem',
    zIndex:     1000,
    background: '#1C1C2A',
    border:     '1px solid rgba(212,175,55,0.3)',
    borderRadius: '16px',
    padding:    '1rem',
    display:    'flex',
    alignItems: 'center',
    gap:        '.75rem',
    boxShadow:  '0 8px 32px rgba(0,0,0,0.6)',
    animation:  'slideUp .35s cubic-bezier(.34,1.56,.64,1)',
  },
  installIcon: {
    width:      '44px',
    height:     '44px',
    borderRadius: '10px',
    background: '#12121C',
    border:     '1.5px solid #D4AF37',
    display:    'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize:   '1.4rem',
    flexShrink: 0,
  },
  installText: {
    flex:       1,
    minWidth:   0,
  },
  installTitle: {
    fontSize:   '.85rem',
    fontWeight: 700,
    color:      '#E8E8F0',
    lineHeight: 1.3,
  },
  installSub: {
    fontSize:   '.72rem',
    color:      '#6666AA',
    marginTop:  '.15rem',
  },
  installBtn: {
    background: '#D4AF37',
    color:      '#12121C',
    border:     'none',
    borderRadius: '8px',
    padding:    '.5rem .9rem',
    fontSize:   '.8rem',
    fontWeight: 700,
    cursor:     'pointer',
    flexShrink: 0,
  },
  closeBtn: {
    background: 'none',
    border:     'none',
    color:      '#6666AA',
    cursor:     'pointer',
    fontSize:   '1rem',
    padding:    '2px',
    flexShrink: 0,
    lineHeight: 1,
  },

  // Banner de atualização (top)
  updateWrap: {
    position:   'fixed',
    top:        'calc(env(safe-area-inset-top, 0px) + 60px)', // abaixo do header
    left:       '1rem',
    right:      '1rem',
    zIndex:     1000,
    background: '#1C1C2A',
    border:     '1px solid rgba(212,175,55,0.4)',
    borderRadius: '12px',
    padding:    '.75rem 1rem',
    display:    'flex',
    alignItems: 'center',
    gap:        '.75rem',
    boxShadow:  '0 4px 20px rgba(0,0,0,0.5)',
    animation:  'slideDown .3s ease',
  },
  updateIcon: { fontSize: '1.1rem' },
  updateText: {
    flex:     1,
    fontSize: '.82rem',
    color:    '#E8E8F0',
    lineHeight: 1.3,
  },
  updateBtn: {
    background: '#D4AF37',
    color:      '#12121C',
    border:     'none',
    borderRadius: '8px',
    padding:    '.4rem .8rem',
    fontSize:   '.78rem',
    fontWeight: 700,
    cursor:     'pointer',
    flexShrink: 0,
  },

  // Badge offline
  offlineBadge: {
    position:   'fixed',
    bottom:     'calc(env(safe-area-inset-bottom, 0px) + 76px)',
    left:       '50%',
    transform:  'translateX(-50%)',
    zIndex:     999,
    background: '#2A1A1A',
    border:     '1px solid #AA3333',
    borderRadius: '20px',
    padding:    '.35rem .9rem',
    fontSize:   '.72rem',
    color:      '#FF7777',
    display:    'flex',
    alignItems: 'center',
    gap:        '.4rem',
    whiteSpace: 'nowrap',
    boxShadow:  '0 2px 12px rgba(0,0,0,0.4)',
  },
  offlineDot: {
    width:        '6px',
    height:       '6px',
    borderRadius: '50%',
    background:   '#FF4444',
    animation:    'pulse 2s infinite',
  },
};

// Injeta keyframes globais uma vez
if (typeof document !== 'undefined') {
  const styleId = 'pwa-banners-keyframes';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes slideUp   { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes slideDown { from { transform: translateY(-12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes pulse     { 0%,100% { opacity:1; } 50% { opacity:.3; } }
    `;
    document.head.appendChild(style);
  }
}

// ─────────────────────────────────────────────
// InstallBanner
// ─────────────────────────────────────────────
export function InstallBanner({ show, onInstall }) {
  const [dismissed, setDismissed] = useState(false);
  if (!show || dismissed) return null;

  return (
    <div style={S.installWrap} role="banner">
      <div style={S.installIcon}>🪨</div>
      <div style={S.installText}>
        <div style={S.installTitle}>Instalar o app</div>
        <div style={S.installSub}>Acesso rápido sem abrir o browser</div>
      </div>
      <button style={S.installBtn} onClick={onInstall}>Instalar</button>
      <button style={S.closeBtn}   onClick={() => setDismissed(true)} aria-label="Fechar">✕</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// UpdateBanner
// ─────────────────────────────────────────────
export function UpdateBanner({ show, onUpdate }) {
  const [dismissed, setDismissed] = useState(false);
  if (!show || dismissed) return null;

  return (
    <div style={S.updateWrap} role="alert">
      <span style={S.updateIcon}>🔄</span>
      <span style={S.updateText}>Nova versão disponível</span>
      <button style={S.updateBtn} onClick={onUpdate}>Atualizar</button>
      <button style={S.closeBtn}  onClick={() => setDismissed(true)} aria-label="Fechar">✕</button>
    </div>
  );
}

// ─────────────────────────────────────────────
// OfflineBadge
// ─────────────────────────────────────────────
export function OfflineBadge({ show }) {
  if (!show) return null;

  return (
    <div style={S.offlineBadge} role="status" aria-live="polite">
      <div style={S.offlineDot}></div>
      Sem conexão — dados locais
    </div>
  );
}
