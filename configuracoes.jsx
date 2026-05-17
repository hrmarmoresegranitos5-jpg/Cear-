// configuracoes.jsx — Configurações / Sobre a Empresa
// Ceará Planejados — Vidraçaria
//
// Etapa 7 — Performance:
//   - memo() no componente
//   - Dados em arrays estáticos fora do render
//   - useCallback no handler de WhatsApp

import { useCallback, memo } from 'react';

// ── Dados estáticos ───────────────────────────────────────────────────────────
const DIFERENCIAIS = [
  { ic: '🏆', ttl: 'Qualidade',  sub: 'Vidros certificados'          },
  { ic: '🔧', ttl: 'Instalação', sub: 'Profissional especializado'   },
  { ic: '⚡', ttl: 'Agilidade',  sub: 'Prazo cumprido'               },
  { ic: '💬', ttl: 'Suporte',    sub: 'Atendimento direto'           },
];

const CONTATOS = [
  { ic: '⏰', lbl: 'Horário',    val: 'Seg–Sex 8h–18h · Sáb 8h–13h'      },
  { ic: '🚛', lbl: 'Frete',     val: 'Grátis até 20 km · Acima sob consulta' },
  { ic: '💳', lbl: 'Pagamento', val: 'PIX · Dinheiro · Cartão · Parcelado'   },
  { ic: '📐', lbl: 'Medição',   val: 'Visita técnica disponível'             },
];

const SERVICOS = [
  ['🚪','Portas de Vidro'], ['🪟','Janelas'],
  ['🛁','Box de Banheiro'], ['🪞','Espelhos'],
  ['🏗️','Guarda Corpo'],   ['🪵','Marcenaria'],
  ['⚙️','Serralheria'],    ['🔆','Vidros Comuns'],
];

// ── Componente principal memoizado ────────────────────────────────────────────
const Configuracoes = memo(function Configuracoes() {
  const abrirWpp = useCallback(() => {
    window.open('https://wa.me/5585999999999', '_blank');
  }, []);

  return (
    <div id="pgConfiguracoes" className="pg on">

      {/* Hero */}
      <div className="sobre-hero">
        <div className="sobre-nm">Ceará Planejados</div>
        <div className="sobre-sub">Vidraçaria · Marcenaria · Serralheria</div>
      </div>

      <div className="section">

        {/* Diferenciais */}
        <div className="garantia-grid">
          {DIFERENCIAIS.map(g => (
            <div key={g.ttl} className="garantia-card">
              <div className="garantia-ic">{g.ic}</div>
              <div className="garantia-ttl">{g.ttl}</div>
              <div className="garantia-sub">{g.sub}</div>
            </div>
          ))}
        </div>

        {/* Contato */}
        <div className="section-ttl">Contato &amp; Informações</div>
        <div className="card" style={{ padding: '6px 16px' }}>
          {CONTATOS.map(item => (
            <div key={item.lbl} className="info-item">
              <span className="info-ic">{item.ic}</span>
              <div className="info-body">
                <div className="info-lbl">{item.lbl}</div>
                <div className="info-val">{item.val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Serviços */}
        <div className="section-ttl" style={{ marginTop: '20px' }}>Nossos Serviços</div>
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {SERVICOS.map(([ic, nome]) => (
              <div key={nome} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <span>{ic}</span>
                <span style={{ fontSize: '.78rem', color: 'var(--t2)' }}>{nome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp CTA */}
        <button className="btn btn-grn btn-full" onClick={abrirWpp} style={{ marginTop: '18px' }}>
          📲 Falar no WhatsApp
        </button>

        <div className="divider" style={{ marginTop: '24px' }} />

        {/* Configurações placeholder */}
        <div className="section-ttl" style={{ marginTop: '4px' }}>Configurações do App</div>
        <div className="card" style={{
          background: 'linear-gradient(135deg,rgba(201,168,76,.06),rgba(201,168,76,.02))',
          borderColor: 'rgba(201,168,76,.2)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <span style={{ fontSize: '1.5rem' }}>🚧</span>
          <div>
            <div style={{ fontSize: '.76rem', fontWeight: 700, color: 'var(--gold2)', marginBottom: '3px' }}>
              Em desenvolvimento
            </div>
            <div style={{ fontSize: '.65rem', color: 'var(--t4)', lineHeight: 1.5 }}>
              Edição de dados da empresa, margens personalizadas e configurações gerais em breve.
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div style={{ fontSize: '.55rem', color: 'var(--t4)', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Ceará Planejados · v7.0
          </div>
        </div>
      </div>

      <div style={{ height: '80px' }} />
    </div>
  );
});

export default Configuracoes;
