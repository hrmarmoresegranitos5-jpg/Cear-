// animations.js — Animações e Transições — Etapa 8 (Visual Premium)
// Ceará Planejados — Vidraçaria
//
// Novidades Etapa 8:
//   - pageEnter: entrada de página com spring suave
//   - navActive: transição do item ativo na navbar
//   - springIn: entrada com mola para elementos interativos
//   - glowPulse: pulso dourado para destaque
//   - Durations revisados: fast 80ms, normal 160ms, slow 260ms
//   - Delays incrementais mais refinados (15ms steps)

import { useState, useEffect } from 'react';

export const DURATIONS = {
  fast:   '80ms',
  normal: '160ms',
  slow:   '260ms',
};

const KEYFRAMES_CSS = `
/* ════════════════════════════════════════════════════
   Animações globais — Ceará Planejados — Etapa 8
   ════════════════════════════════════════════════════ */

/* Respeita preferência do usuário */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ── Keyframes básicos ── */

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(18px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(-10px); opacity: 0; }
  to   { transform: translateY(0);     opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(.94); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: .4; }
}

/* ── Shimmer (GPU) ── */
@keyframes shimmer {
  from { transform: translateX(-100%); }
  to   { transform: translateX(100%);  }
}

/* ── Entrada de página — spring suave ── */
@keyframes pageEnter {
  0%   { opacity: 0; transform: translateY(10px) scale(.99); }
  60%  { opacity: 1; transform: translateY(-2px)  scale(1.001); }
  100% { opacity: 1; transform: translateY(0)      scale(1); }
}

/* ── Ícone ativo da navbar: spring para cima ── */
@keyframes navIconPop {
  0%   { transform: scale(1)    translateY(0); }
  40%  { transform: scale(1.25) translateY(-3px); }
  70%  { transform: scale(.95)  translateY(1px); }
  100% { transform: scale(1.12) translateY(0); }
}

/* ── Entrada com mola (botões, cards interativos) ── */
@keyframes springIn {
  0%   { transform: scale(.88); opacity: 0; }
  55%  { transform: scale(1.04); opacity: 1; }
  80%  { transform: scale(.98); }
  100% { transform: scale(1);   opacity: 1; }
}

/* ── Glow dourado pulsante ── */
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0); }
  50%       { box-shadow: 0 0 16px 4px rgba(212,175,55,0.25); }
}

/* ── Ripple: feedback tátil no toque ── */
@keyframes ripple {
  from { transform: scale(0); opacity: .35; }
  to   { transform: scale(2.5); opacity: 0; }
}

/* ════════════════════════════════════════════════════
   Classes utilitárias
   ════════════════════════════════════════════════════ */

.anim-fade   { animation: fadeIn   ${DURATIONS.normal} ease both; }
.anim-up     { animation: slideUp  ${DURATIONS.normal} ease both; }
.anim-down   { animation: slideDown ${DURATIONS.normal} ease both; }
.anim-scale  { animation: scaleIn  ${DURATIONS.fast}   ease both; }
.anim-spring { animation: springIn .4s cubic-bezier(.34,1.56,.64,1) both; }
.anim-pulse  { animation: pulse 2s ease-in-out infinite; }
.anim-glow   { animation: glowPulse 2.5s ease-in-out infinite; }

/* Delays escalonados */
.delay-1 { animation-delay: 25ms;  }
.delay-2 { animation-delay: 50ms;  }
.delay-3 { animation-delay: 80ms;  }
.delay-4 { animation-delay: 110ms; }
.delay-5 { animation-delay: 145ms; }
.delay-6 { animation-delay: 185ms; }

/* ── Skeleton loader ── */
.skeleton {
  position: relative;
  overflow: hidden;
  background: rgba(255,255,255,.04);
  border-radius: 8px;
}
.skeleton::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255,255,255,.07) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s infinite;
  will-change: transform;
}

/* ── Transição de página ── */
.pg {
  animation: pageEnter 260ms cubic-bezier(.25,.46,.45,.94) both;
  will-change: opacity, transform;
}

/* ── Toque: remove highlight do browser e delay 300ms ── */
.qa-btn, .ni, .btn, .card, button, [role="button"] {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

/* ── Ripple wrapper ── */
.ripple-wrap {
  position: relative;
  overflow: hidden;
}
.ripple-wrap .ripple-dot {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  animation: ripple .5s ease-out forwards;
  pointer-events: none;
}
`;

let _injected = false;

export function injectAnimations() {
  if (_injected) return;
  const style = document.createElement('style');
  style.id = 'cear-animations';
  style.textContent = KEYFRAMES_CSS;
  document.head.appendChild(style);
  _injected = true;
}

/* ── Estilos inline prontos ────────────────────────────────────────────────── */
export const fadeInStyle   = { animation: `fadeIn ${DURATIONS.normal} ease both` };
export const slideUpStyle  = { animation: `slideUp ${DURATIONS.normal} ease both` };
export const scaleInStyle  = { animation: `scaleIn ${DURATIONS.fast} ease both` };
export const pageEnterStyle = { animation: `pageEnter 260ms cubic-bezier(.25,.46,.45,.94) both` };
export const springInStyle  = { animation: `springIn .4s cubic-bezier(.34,1.56,.64,1) both` };

/* ── Hook de entrada escalonada ────────────────────────────────────────────── */
export function useEntrada(delayMs = 0) {
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisivel(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);
  return visivel;
}

/* ── Skeleton helpers ──────────────────────────────────────────────────────── */
export function Skeleton({ largura = '100%', altura = '16px', style }) {
  return (
    <div
      className="skeleton"
      style={{ width: largura, height: altura, ...style }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: '10px' }}>
      <Skeleton altura="14px" largura="60%" style={{ marginBottom: '10px' }} />
      <Skeleton altura="11px" largura="85%" style={{ marginBottom: '6px' }} />
      <Skeleton altura="11px" largura="70%" />
    </div>
  );
}
