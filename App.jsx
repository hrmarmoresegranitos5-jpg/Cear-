// App.jsx — Orquestrador principal — Etapa 8 (Visual Premium)
// Ceará Planejados — Vidraçaria
//
// Novidades Etapa 8:
//   - Header com glassmorphism (backdrop-filter blur)
//   - NavBar premium: glassmorphism + pill ativa animada + ícones com spring
//   - Transição de página com animação suave ao trocar aba
//   - Fonte Outfit injetada para toda a UI
//   - Estilos globais de app nativo injetados via CSS-in-JS
//   - Touch feedback com ripple effect
//   - Variáveis CSS centralizadas e expandidas

import {
  useState, useCallback, useMemo, memo, lazy, Suspense, useEffect, useRef,
} from 'react';

const Dashboard     = lazy(() => import('./pages/dashboard'));
const Orcamentos    = lazy(() => import('./pages/orcamentos'));
const Financeiro    = lazy(() => import('./pages/financeiro'));
const Agenda        = lazy(() => import('./pages/agenda'));
const Clientes      = lazy(() => import('./pages/clientes'));
const Configuracoes = lazy(() => import('./pages/configuracoes'));
const Historico     = lazy(() => import('./pages/historico'));

import { usePWA }                                    from './hooks/usePWA';
import { InstallBanner, UpdateBanner, OfflineBadge } from './components/PWABanners';
import { injectAnimations }                          from './animations';

injectAnimations();

// ── CSS Global de app premium (injetado uma vez) ─────────────────────────────
const GLOBAL_CSS = `
  /* ── Fonte Outfit para toda a UI ── */
  :root {
    --font: 'Outfit', -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;

    /* Paleta de cores */
    --bg:    #0E0E1A;
    --bg2:   #131320;
    --s1:    #16162A;
    --s2:    #1A1A2E;
    --s3:    #1E1E34;
    --s4:    #22223A;

    --gold:  #C9A84C;
    --gold2: #EDD060;
    --gold3: rgba(212,175,55,0.12);
    --gold4: rgba(212,175,55,0.06);

    --grn:   #3A9E6A;
    --grn2:  rgba(58,158,106,0.12);

    --tx:    #EDEAE0;
    --t2:    #B8B4A8;
    --t3:    #7A7880;
    --t4:    #4E4C58;

    --red:   #E05555;
    --red2:  rgba(224,85,85,0.12);

    /* Elevações */
    --shadow-sm:  0 2px 8px rgba(0,0,0,0.4);
    --shadow-md:  0 4px 20px rgba(0,0,0,0.55);
    --shadow-lg:  0 8px 40px rgba(0,0,0,0.7);

    /* Bordas */
    --border:     1px solid rgba(255,255,255,0.06);
    --border-g:   1px solid rgba(212,175,55,0.2);

    /* Raios */
    --r-sm:  8px;
    --r-md:  14px;
    --r-lg:  20px;
    --r-xl:  26px;
  }

  * { font-family: var(--font); }

  /* ── Layout principal ── */
  #sApp {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--bg);
    position: relative;
  }

  #hdrAndPages {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }

  /* ── Header premium ─────────────────────────────────────────────────────── */
  #hdr {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px 12px;
    /* Glassmorphism sutil */
    background: rgba(14,14,26,0.85);
    backdrop-filter: blur(20px) saturate(1.4);
    -webkit-backdrop-filter: blur(20px) saturate(1.4);
    /* Borda inferior com gradiente dourado */
    border-bottom: 1px solid transparent;
    background-clip: padding-box;
    position: relative;
    z-index: 50;
    flex-shrink: 0;
  }

  /* Linha inferior com gradiente */
  #hdr::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(212,175,55,0.3) 30%,
      rgba(212,175,55,0.5) 50%,
      rgba(212,175,55,0.3) 70%,
      transparent 100%
    );
  }

  .hlogo {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: linear-gradient(145deg, #1E1E30, #14141F);
    border: 1px solid rgba(212,175,55,0.35);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
    box-shadow: 0 0 14px rgba(212,175,55,0.1), var(--shadow-sm);
    flex-shrink: 0;
    cursor: pointer;
    transition: transform 160ms cubic-bezier(.34,1.56,.64,1);
  }
  .hlogo:active { transform: scale(.9); }

  .hnm {
    flex: 1;
    font-size: .95rem;
    font-weight: 700;
    color: var(--tx);
    letter-spacing: .01em;
    display: flex;
    flex-direction: column;
  }

  .hsub {
    font-size: .62rem;
    font-weight: 500;
    color: var(--t4);
    letter-spacing: .04em;
    margin-top: 1px;
  }

  .hdt {
    font-size: .72rem;
    font-weight: 500;
    color: var(--t3);
    letter-spacing: .02em;
    flex-shrink: 0;
  }

  /* ── Área de páginas ─────────────────────────────────────────────────────── */
  #pages {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-y: contain;
    /* Esconde scrollbar mas mantém funcionalidade */
    scrollbar-width: none;
  }
  #pages::-webkit-scrollbar { display: none; }

  /* ── Página genérica ── */
  .pg {
    padding: 20px 18px 0;
    animation: pageEnter 240ms cubic-bezier(.25,.46,.45,.94) both;
    will-change: opacity, transform;
  }

  /* ── NavBar premium ──────────────────────────────────────────────────────── */
  #nav {
    display: flex;
    align-items: stretch;
    /* Glassmorphism */
    background: rgba(14,14,26,0.92);
    backdrop-filter: blur(24px) saturate(1.6);
    -webkit-backdrop-filter: blur(24px) saturate(1.6);
    /* Safe area no fundo (home indicator iOS) */
    padding-bottom: env(safe-area-inset-bottom, 0px);
    position: relative;
    z-index: 100;
    flex-shrink: 0;
  }

  /* Borda superior com gradiente */
  #nav::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(212,175,55,0.2) 20%,
      rgba(212,175,55,0.4) 50%,
      rgba(212,175,55,0.2) 80%,
      transparent 100%
    );
  }

  /* ── Item de navegação ── */
  .ni {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 4px 10px;
    border: none;
    background: transparent;
    cursor: pointer;
    position: relative;
    min-height: 60px;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    transition: none;
  }

  /* Wrapper do ícone — contém a pill ativa */
  .ni-ic-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px; height: 32px;
    border-radius: 16px;
    transition: background 200ms ease;
    margin-bottom: 4px;
  }

  /* Pill de destaque do item ativo */
  .ni.on .ni-ic-wrap {
    background: rgba(212,175,55,0.14);
  }

  .ni-i {
    font-size: 1.25rem;
    display: block;
    transition: transform 200ms cubic-bezier(.34,1.56,.64,1);
    line-height: 1;
  }

  /* Ícone ativo: cresce com spring */
  .ni.on .ni-i {
    transform: scale(1.18) translateY(-1px);
    animation: navIconPop 300ms cubic-bezier(.34,1.56,.64,1) both;
  }

  .ni-l {
    font-size: .6rem;
    font-weight: 500;
    color: var(--t4);
    letter-spacing: .02em;
    transition: color 160ms ease, font-weight 160ms ease;
    line-height: 1;
    white-space: nowrap;
  }

  /* Label ativo */
  .ni.on .ni-l {
    color: var(--gold);
    font-weight: 700;
  }

  /* ── Indicador de item ativo: ponto dourado ── */
  .ni.on::after {
    content: '';
    position: absolute;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px; height: 4px;
    border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 6px rgba(212,175,55,0.6);
    animation: fadeIn 200ms ease both;
  }

  /* ── Botão CTA (Orçamento) ── */
  .ni-cta .ni-ic-wrap {
    width: 52px; height: 36px;
    border-radius: 18px;
    background: linear-gradient(145deg, #C9A84C, #A88030);
    box-shadow: 0 2px 12px rgba(180,140,40,0.35);
    transition: transform 150ms cubic-bezier(.34,1.56,.64,1),
                box-shadow 150ms ease;
  }
  .ni-cta.on .ni-ic-wrap {
    background: linear-gradient(145deg, #EDD060, #C9A84C);
    box-shadow: 0 4px 18px rgba(212,175,55,0.45);
  }
  .ni-cta:active .ni-ic-wrap {
    transform: scale(.92);
    box-shadow: 0 1px 6px rgba(180,140,40,0.2);
  }
  .ni-cta .ni-i { font-size: 1.15rem; }
  .ni-cta.on .ni-l { color: var(--gold2); }

  /* ── Cards genéricos ──────────────────────────────────────────────────────── */
  .card {
    background: var(--s2);
    border: var(--border);
    border-radius: var(--r-md);
    padding: 16px;
    margin-bottom: 14px;
    box-shadow: var(--shadow-sm);
    transition: transform 120ms ease, box-shadow 120ms ease;
  }
  .card:active { transform: scale(.99); }

  /* ── Seções ── */
  .section { margin-bottom: 20px; }

  .section-ttl {
    font-size: .7rem;
    font-weight: 700;
    color: var(--t3);
    letter-spacing: .1em;
    text-transform: uppercase;
    margin-bottom: 12px;
    padding-left: 2px;
  }

  /* ── Hero de página ── */
  .hero {
    margin-bottom: 22px;
  }
  .hero-ttl {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--tx);
    letter-spacing: -.01em;
  }
  .hero-sub {
    font-size: .78rem;
    color: var(--t3);
    margin-top: 4px;
    font-weight: 400;
  }

  /* ── Botões ── */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: none;
    border-radius: var(--r-sm);
    padding: 11px 18px;
    font-size: .82rem;
    font-weight: 700;
    font-family: var(--font);
    cursor: pointer;
    transition: transform 120ms cubic-bezier(.34,1.56,.64,1),
                opacity 120ms ease,
                box-shadow 120ms ease;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    outline: none;
  }
  .btn:active { transform: scale(.95); opacity: .9; }

  .btn-gold  { background: linear-gradient(145deg,#C9A84C,#A88030); color:#0E0E1A; box-shadow:0 2px 10px rgba(180,140,40,.3); }
  .btn-grn   { background: linear-gradient(145deg,#3A9E6A,#2E7D52); color:#fff;    box-shadow:0 2px 10px rgba(58,158,106,.25); }
  .btn-ghost { background: rgba(255,255,255,.06); color:var(--t2); border:var(--border); }
  .btn-red   { background: linear-gradient(145deg,#E05555,#B83B3B); color:#fff; }
  .btn-full  { width: 100%; }
  .btn-sm    { padding: 8px 13px; font-size: .76rem; border-radius: 8px; }

  /* ── Grid de atalhos ── */
  .qa-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .qa-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 14px;
    background: var(--s2);
    border: var(--border);
    border-radius: var(--r-md);
    cursor: pointer;
    transition: transform 130ms cubic-bezier(.34,1.56,.64,1),
                background 130ms ease,
                border-color 130ms ease;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  .qa-btn:active {
    transform: scale(.96);
    background: var(--s3);
    border-color: rgba(212,175,55,0.2);
  }

  .qa-ic {
    font-size: 1.45rem;
    width: 42px; height: 42px;
    border-radius: 12px;
    background: var(--gold4);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .qa-nm { font-size: .79rem; font-weight: 700; color: var(--tx);  line-height: 1.3; }
  .qa-sm { font-size: .65rem; font-weight: 400; color: var(--t3); margin-top: 2px; }

  /* ── Info items ── */
  .info-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .info-item:last-child { border-bottom: none; }

  .info-ic {
    font-size: 1.2rem;
    width: 36px; height: 36px;
    border-radius: 10px;
    background: var(--s3);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .info-lbl { font-size: .7rem;  font-weight: 600; color: var(--t3); margin-bottom: 2px; }
  .info-val { font-size: .78rem; font-weight: 500; color: var(--t2); }

  /* ── Stat cards ── */
  .stat-card {
    flex: 1;
    background: rgba(0,0,0,0.2);
    border: 1px solid rgba(212,175,55,0.1);
    border-radius: var(--r-md);
    padding: 12px 8px;
    text-align: center;
    transition: transform 130ms ease, border-color 130ms ease;
  }
  .stat-card:active { transform: scale(.97); }

  .stat-val { font-size: 1.3rem; font-weight: 800; color: var(--gold2); line-height: 1; margin-bottom: 4px; }
  .stat-lbl { font-size: .6rem;  font-weight: 500; color: var(--t4);   letter-spacing: .04em; }

  /* ── Banner home ── */
  .home-banner {
    border-radius: var(--r-xl);
    padding: 20px 20px 0;
    margin-bottom: 22px;
    background:
      linear-gradient(160deg, rgba(212,175,55,0.08) 0%, transparent 50%),
      linear-gradient(to bottom, #1A1A2C, #131320);
    border: 1px solid rgba(212,175,55,0.15);
    box-shadow: var(--shadow-md), inset 0 1px 0 rgba(212,175,55,0.08);
    overflow: hidden;
    position: relative;
  }

  /* Detalhe decorativo no banner */
  .home-banner::before {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 160px; height: 160px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .home-banner-top { margin-bottom: 18px; }

  .home-banner-nm {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--tx);
    letter-spacing: -.01em;
    margin-bottom: 3px;
  }
  .home-banner-sub {
    font-size: .72rem;
    color: var(--t3);
    font-weight: 400;
    letter-spacing: .02em;
  }

  .home-stats {
    display: flex;
    gap: 8px;
    padding: 14px 0 20px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }

  /* ── Badges ── */
  .badge {
    display: inline-flex; align-items: center;
    padding: 3px 9px;
    border-radius: 20px;
    font-size: .64rem; font-weight: 700;
    background: rgba(255,255,255,.06);
    color: var(--t2);
    letter-spacing: .02em;
  }
  .badge-grn  { background: var(--grn2); color: var(--grn); }
  .badge-gold { background: var(--gold3); color: var(--gold); }
  .badge-red  { background: var(--red2); color: var(--red); }

  /* ── Tabela ── */
  .tbl { width: 100%; border-collapse: collapse; }
  .tbl th, .tbl td { padding: 9px 4px; text-align: left; font-size: .76rem; }
  .tbl th { color: var(--t4); font-weight: 600; font-size: .68rem; letter-spacing:.04em; text-transform:uppercase; border-bottom:1px solid rgba(255,255,255,.05); }
  .tbl td { color: var(--t2); border-bottom: 1px solid rgba(255,255,255,.03); }
  .tbl tr:last-child td { border-bottom: none; }
  .tbl td:last-child, .tbl th:last-child { text-align: right; color: var(--gold); font-weight: 700; }

  /* ── Divider ── */
  .divider { height: 1px; background: rgba(255,255,255,.05); margin: 12px 0; }

  /* ── Inputs e fields ── */
  .field { margin-bottom: 14px; }
  .field label { display: block; font-size: .7rem; font-weight: 600; color: var(--t3); margin-bottom: 6px; letter-spacing:.03em; }

  input[type=text], input[type=number], input[type=email], select, textarea {
    width: 100%;
    background: var(--s3);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: var(--r-sm);
    padding: 12px 14px;
    font-family: var(--font);
    font-size: .86rem;
    color: var(--tx);
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }
  input:focus, select:focus, textarea:focus {
    border-color: rgba(212,175,55,0.4);
    box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
  }
  ::placeholder { color: var(--t4); }

  /* ── Price section ── */
  .price-section { margin-bottom: 24px; }
  .price-section-header { margin-bottom: 12px; }
  .price-section-header h3 { font-size: .9rem; font-weight: 700; color: var(--tx); margin-bottom: 3px; }
  .price-section-header p  { font-size: .72rem; color: var(--t3); }

  /* ── Garantia card ── */
  .garantia-card {
    background: var(--s2); border: var(--border); border-radius: var(--r-md);
    padding: 16px; text-align: center;
  }
  .garantia-ic  { font-size: 1.6rem; margin-bottom: 8px; }
  .garantia-ttl { font-size: .8rem;  font-weight: 700; color: var(--tx); margin-bottom: 4px; }
  .garantia-sub { font-size: .68rem; color: var(--t3); line-height: 1.5; }

  /* ── Offline / PWA overlays ── */
  .scr.on { display: flex; flex-direction: column; height: 100%; }

  /* ── Page loader ── */
  .page-loader {
    display: flex; align-items: center; justify-content: center;
    height: 38vh; opacity: .35; font-size: .78rem; color: var(--t4);
    animation: fadeIn 300ms ease both;
  }
`;

function injectGlobalStyles() {
  if (document.getElementById('cear-global')) return;
  const el = document.createElement('style');
  el.id = 'cear-global';
  el.textContent = GLOBAL_CSS;
  document.head.appendChild(el);
}
injectGlobalStyles();

// ── Dados estáticos ───────────────────────────────────────────────────────────
const LOGO_SRC = '';

const NAV_ITEMS = [
  { id: 'home',          label: 'Início',    icon: '🏠',  cta: false },
  { id: 'orc',           label: 'Orçamento', icon: '🧮',  cta: true  },
  { id: 'financeiro',    label: 'Preços',    icon: '💎',  cta: false },
  { id: 'historico',     label: 'Histórico', icon: '📂',  cta: false },
  { id: 'clientes',      label: 'Clientes',  icon: '👥',  cta: false },
  { id: 'configuracoes', label: 'Config.',   icon: 'ℹ️',  cta: false },
];

function getDataHdr() {
  const d    = new Date();
  const dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  return `${dias[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
}
const DATA_HDR = getDataHdr();

// ── Fallback leve para Suspense ───────────────────────────────────────────────
function PageLoader() {
  return <div className="page-loader">Carregando…</div>;
}

// ── Header premium (memoizado) ────────────────────────────────────────────────
const Header = memo(function Header({ isOnline, onLogoClick }) {
  return (
    <div id="hdr">
      <div className="hlogo" onClick={onLogoClick}>
        {LOGO_SRC ? <img src={LOGO_SRC} alt="Logo" style={{ width:'100%', borderRadius:'8px' }} /> : '🪨'}
      </div>
      <div className="hnm">
        Ceará Planejados
        <span className="hsub">Vidraçaria · Marcenaria</span>
      </div>
      <div className="hdt">
        {!isOnline && (
          <span title="Sem conexão" style={{ marginRight: '.3rem', opacity: .7 }}>📵</span>
        )}
        {DATA_HDR}
      </div>
    </div>
  );
});

// ── NavBar premium (memoizado) ────────────────────────────────────────────────
const NavBar = memo(function NavBar({ paginaAtiva, onNav }) {
  return (
    <div id="nav">
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`ni${item.cta ? ' ni-cta' : ''}${paginaAtiva === item.id ? ' on' : ''}`}
          data-pg={item.id}
          onClick={() => onNav(item.id)}
          aria-label={item.label}
          aria-current={paginaAtiva === item.id ? 'page' : undefined}
        >
          <div className="ni-ic-wrap">
            <span className="ni-i">{item.icon}</span>
          </div>
          <span className="ni-l">{item.label}</span>
        </button>
      ))}
    </div>
  );
});

// ── Componente principal ──────────────────────────────────────────────────────
export default function App() {
  const [paginaAtiva, setPaginaAtiva] = useState('home');
  const [currentTipo, setCurrentTipo] = useState('pivotante');
  // Key para forçar re-mount da animação ao trocar de página
  const [pageKey, setPageKey] = useState(0);

  const pwa = usePWA();

  const navTo = useCallback(pg => {
    if (pg === paginaAtiva) return; // sem re-render se já na aba
    setPaginaAtiva(pg);
    setPageKey(k => k + 1);
  }, [paginaAtiva]);

  const goHome = useCallback(() => navTo('home'), [navTo]);

  const handleSetTipo = useCallback((tipo) => {
    setCurrentTipo(tipo);
    setPaginaAtiva('orc');
    setPageKey(k => k + 1);
  }, []);

  const sharedProps = useMemo(() => ({
    navTo,
    setTipo: handleSetTipo,
    logoSrc: LOGO_SRC,
  }), [navTo, handleSetTipo]);

  function renderPagina() {
    switch (paginaAtiva) {
      case 'home':          return <Dashboard     {...sharedProps} />;
      case 'orc':           return <Orcamentos    currentTipo={currentTipo} setCurrentTipo={setCurrentTipo} />;
      case 'financeiro':    return <Financeiro    />;
      case 'agenda':        return <Agenda        />;
      case 'clientes':      return <Clientes      />;
      case 'historico':     return <Historico     />;
      case 'configuracoes': return <Configuracoes logoSrc={LOGO_SRC} />;
      default:              return <Dashboard     {...sharedProps} />;
    }
  }

  return (
    <div id="sApp" className="scr on">

      {/* ── Banners PWA ───────────────────────────────────────────────────── */}
      <UpdateBanner  show={pwa.updateReady} onUpdate={pwa.applyUpdate} />
      <InstallBanner show={pwa.canInstall}  onInstall={pwa.installApp} />
      <OfflineBadge  show={!pwa.isOnline} />

      <div id="hdrAndPages">
        <Header isOnline={pwa.isOnline} onLogoClick={goHome} />

        {/* ── Páginas com animação de entrada ──────────────────────────── */}
        <div id="pages">
          <Suspense fallback={<PageLoader />}>
            {/* key={pageKey} recria o componente ao trocar de aba → dispara animação */}
            <div key={pageKey} className="pg">
              {renderPagina()}
            </div>
          </Suspense>
        </div>
      </div>

      <NavBar paginaAtiva={paginaAtiva} onNav={navTo} />
    </div>
  );
}
