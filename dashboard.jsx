// dashboard.jsx — Tela Inicial Premium — Etapa 8 (Visual)
// Ceará Planejados — Vidraçaria
//
// Novidades Etapa 8:
//   - Banner hero redesenhado com profundidade e detalhe decorativo
//   - Stat cards com borda dourada e glow sutil
//   - Atalhos com ícone em círculo colorido e entrada escalonada
//   - Infos com ícone em caixas coloridas individualmente
//   - Todos os elementos entram com animação escalonada (delay progressivo)

import { useCallback, memo } from 'react';

// ── Dados estáticos ───────────────────────────────────────────────────────────
const ATALHOS = [
  { tipo: 'pivotante', icone: '🚪', nome: 'Porta Pivotante', sub: 'Temperado 8mm',        cor: 'rgba(212,175,55,0.12)', borda: 'rgba(212,175,55,0.25)' },
  { tipo: 'correr',    icone: '🔲', nome: 'Porta de Correr',  sub: '2 ou 4 folhas',        cor: 'rgba(80,160,220,0.1)',  borda: 'rgba(80,160,220,0.2)'  },
  { tipo: 'janela',    icone: '🪟', nome: 'Janela',           sub: 'Correr / Basculante',   cor: 'rgba(100,200,140,0.1)', borda: 'rgba(100,200,140,0.2)' },
  { tipo: 'box',       icone: '🛁', nome: 'Box de Banheiro',  sub: 'Pivotante / Correr',   cor: 'rgba(160,120,220,0.1)', borda: 'rgba(160,120,220,0.2)' },
  { tipo: 'espelho',   icone: '🪞', nome: 'Espelho',          sub: 'Com / sem bisotê',      cor: 'rgba(220,180,80,0.1)',  borda: 'rgba(220,180,80,0.2)'  },
  { tipo: 'guarda',    icone: '🏗️', nome: 'Guarda Corpo',     sub: 'Módulos de 120cm',      cor: 'rgba(220,100,100,0.1)', borda: 'rgba(220,100,100,0.2)' },
];

const INFOS = [
  { ic: '⏰', lbl: 'Horário',     val: 'Seg–Sex 8h–18h · Sáb 8h–13h',          bg: 'rgba(212,175,55,0.1)',  border: 'rgba(212,175,55,0.2)'  },
  { ic: '🚛', lbl: 'Frete',      val: 'Grátis até 20 km · Acima sob consulta',  bg: 'rgba(58,158,106,0.1)',  border: 'rgba(58,158,106,0.2)'  },
  { ic: '💳', lbl: 'Pagamento',  val: '10% desconto à vista · 6x sem juros',    bg: 'rgba(80,160,220,0.1)',  border: 'rgba(80,160,220,0.2)'  },
  { ic: '🔧', lbl: 'Instalação', val: 'Profissional capacitado · Garantia inclusa', bg: 'rgba(160,120,220,0.1)', border: 'rgba(160,120,220,0.2)' },
];

// ── Botão de atalho ───────────────────────────────────────────────────────────
const AtalhoBtn = memo(function AtalhoBtn({ icone, nome, sub, onClick, cor, borda, delay }) {
  return (
    <div
      className="qa-btn anim-up"
      style={{ animationDelay: delay, animationFillMode: 'both' }}
      onClick={onClick}
    >
      <span className="qa-ic" style={{ background: cor, border: `1px solid ${borda}` }}>
        {icone}
      </span>
      <div className="qa-info">
        <div className="qa-nm">{nome}</div>
        <div className="qa-sm">{sub}</div>
      </div>
    </div>
  );
});

// ── Info row ─────────────────────────────────────────────────────────────────
const InfoRow = memo(function InfoRow({ ic, lbl, val, bg, border }) {
  return (
    <div className="info-item">
      <span className="info-ic" style={{ background: bg, border: `1px solid ${border}` }}>
        {ic}
      </span>
      <div className="info-body">
        <div className="info-lbl">{lbl}</div>
        <div className="info-val">{val}</div>
      </div>
    </div>
  );
});

// ── Dashboard principal ───────────────────────────────────────────────────────
const Dashboard = memo(function Dashboard({ navTo, setTipo }) {
  const handleAtalho = useCallback((tipo) => {
    navTo('orc');
    setTipo(tipo);
  }, [navTo, setTipo]);

  return (
    <div id="pgHome">

      {/* ── Banner Hero ── */}
      <div className="home-banner anim-up" style={{ animationDelay: '0ms' }}>
        <div className="home-banner-top">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="home-banner-nm">Ceará Planejados</div>
              <div className="home-banner-sub">Vidraçaria · Marcenaria · Serralheria</div>
            </div>
            {/* Badge de status */}
            <div style={{
              background: 'rgba(58,158,106,0.15)',
              border: '1px solid rgba(58,158,106,0.3)',
              borderRadius: '20px',
              padding: '4px 10px',
              fontSize: '.62rem',
              fontWeight: 700,
              color: '#3A9E6A',
              letterSpacing: '.04em',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}>
              <span style={{
                width: '6px', height: '6px',
                borderRadius: '50%',
                background: '#3A9E6A',
                boxShadow: '0 0 6px rgba(58,158,106,0.6)',
                animation: 'pulse 2s infinite',
              }} />
              Aberto
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="home-stats">
          <div className="stat-card">
            <div className="stat-val">8mm</div>
            <div className="stat-lbl">Temperado</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">10%</div>
            <div className="stat-lbl">À vista</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">20km</div>
            <div className="stat-lbl">Frete grátis</div>
          </div>
        </div>
      </div>

      {/* ── Atalhos de orçamento ── */}
      <div className="section">
        <div className="section-ttl anim-fade" style={{ animationDelay: '60ms' }}>
          Calcular orçamento
        </div>
        <div className="qa-grid">
          {ATALHOS.map((a, i) => (
            <AtalhoBtn
              key={a.tipo}
              icone={a.icone}
              nome={a.nome}
              sub={a.sub}
              cor={a.cor}
              borda={a.borda}
              delay={`${80 + i * 28}ms`}
              onClick={() => handleAtalho(a.tipo)}
            />
          ))}
        </div>
      </div>

      {/* ── Informações rápidas ── */}
      <div className="section">
        <div className="section-ttl anim-fade" style={{ animationDelay: '260ms' }}>
          Informações
        </div>
        <div className="card anim-up" style={{ padding: '4px 16px', animationDelay: '290ms' }}>
          {INFOS.map(info => (
            <InfoRow
              key={info.lbl}
              ic={info.ic}
              lbl={info.lbl}
              val={info.val}
              bg={info.bg}
              border={info.border}
            />
          ))}
        </div>
      </div>

      {/* Espaço para navbar */}
      <div style={{ height: '88px' }} />
    </div>
  );
});

export default Dashboard;
