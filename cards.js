// cards.js — Componentes de Card
// Ceará Planejados — Vidraçaria
//
// Agrupa todos os cards reutilizáveis do sistema:
//   StatCard      → card de estatística (home-stats)
//   InfoItem      → item de informação com ícone (horário, frete, etc.)
//   QAButton      → botão de atalho de orçamento (qa-grid)
//   ClienteCard   → card de cliente com WhatsApp
//   EventoCard    → card de evento da agenda
//   GarantiaCard  → card de diferencial (Config)
//   BannerWIP     → banner "em desenvolvimento" reutilizável
//   PagamentoCard → card de condições de pagamento

// ─────────────────────────────────────────────
// StatCard — home-stats
// ─────────────────────────────────────────────
/**
 * @param {{ valor: string, label: string }} props
 */
export function StatCard({ valor, label }) {
  return (
    <div className="stat-card">
      <div className="stat-val">{valor}</div>
      <div className="stat-lbl">{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// InfoItem — linha de informação com ícone
// ─────────────────────────────────────────────
/**
 * @param {{ icone: string, label: string, valor: string }} props
 */
export function InfoItem({ icone, label, valor }) {
  return (
    <div className="info-item">
      <span className="info-ic">{icone}</span>
      <div className="info-body">
        <div className="info-lbl">{label}</div>
        <div className="info-val">{valor}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// QAButton — botão de atalho de orçamento
// ─────────────────────────────────────────────
/**
 * @param {{ icone: string, nome: string, sub: string, onClick: Function }} props
 */
export function QAButton({ icone, nome, sub, onClick }) {
  return (
    <div className="qa-btn" onClick={onClick}>
      <span className="qa-ic">{icone}</span>
      <div className="qa-info">
        <div className="qa-nm">{nome}</div>
        <div className="qa-sm">{sub}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ClienteCard — card de cliente com ações
// ─────────────────────────────────────────────
/**
 * @param {{ nome: string, fone: string, ult: string, data: string }} props
 */
export function ClienteCard({ nome, fone, ult, data }) {
  function abrirWpp() {
    const num = fone.replace(/\D/g, '');
    window.open(`https://wa.me/55${num}`, '_blank');
  }

  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Avatar + info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
            background: 'rgba(201,168,76,.1)', border: '1px solid rgba(201,168,76,.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem',
          }}>
            {nome.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--tx)', marginBottom: '2px' }}>
              {nome}
            </div>
            <div style={{ fontSize: '.66rem', color: 'var(--t3)' }}>{fone}</div>
          </div>
        </div>

        {/* Botão WhatsApp */}
        <button
          className="btn btn-ghost btn-sm"
          style={{ padding: '8px 12px', fontSize: '.65rem' }}
          onClick={abrirWpp}
        >
          📲
        </button>
      </div>

      {/* Último orçamento */}
      <div style={{
        marginTop: '10px', padding: '8px 10px',
        background: 'rgba(0,0,0,.2)', borderRadius: '8px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ fontSize: '.65rem', color: 'var(--t4)' }}>
          Último orçamento:{' '}
          <span style={{ color: 'var(--t2)', fontWeight: 600 }}>{ult}</span>
        </div>
        <div style={{ fontSize: '.6rem', color: 'var(--t4)' }}>{data}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// EventoCard — card de evento da agenda
// ─────────────────────────────────────────────
/**
 * @param {{ data: string, hora: string, tipo: string, cliente: string, local: string, status: 'confirmado'|'pendente' }} props
 */
export function EventoCard({ data, hora, tipo, cliente, local, status }) {
  const diaSemana = data.split(',')[0];
  const confirmado = status === 'confirmado';

  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Data/hora */}
          <div style={{
            background: 'rgba(201,168,76,.1)', border: '1px solid rgba(201,168,76,.2)',
            borderRadius: '10px', padding: '8px 10px', textAlign: 'center', flexShrink: 0,
          }}>
            <div style={{ fontSize: '.6rem', color: 'var(--t4)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {diaSemana}
            </div>
            <div style={{ fontSize: '.95rem', fontWeight: 700, color: 'var(--gold2)' }}>
              {hora}
            </div>
          </div>

          {/* Detalhes */}
          <div>
            <div style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--tx)', marginBottom: '3px' }}>
              {tipo} — {cliente}
            </div>
            <div style={{ fontSize: '.65rem', color: 'var(--t4)' }}>{local}</div>
            <div style={{ fontSize: '.63rem', color: 'var(--t3)', marginTop: '3px' }}>{data}</div>
          </div>
        </div>

        {/* Badge status */}
        <span className={`badge ${confirmado ? 'badge-grn' : 'badge-gold'}`}>
          {confirmado ? '✓ OK' : '⏳'}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// GarantiaCard — card de diferencial (Config)
// ─────────────────────────────────────────────
/**
 * @param {{ icone: string, titulo: string, sub: string }} props
 */
export function GarantiaCard({ icone, titulo, sub }) {
  return (
    <div className="garantia-card">
      <div className="garantia-ic">{icone}</div>
      <div className="garantia-ttl">{titulo}</div>
      <div className="garantia-sub">{sub}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// BannerWIP — banner "em desenvolvimento"
// ─────────────────────────────────────────────
/**
 * @param {{ mensagem?: string }} props
 */
export function BannerWIP({ mensagem = 'Funcionalidade em desenvolvimento. Em breve!' }) {
  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg,rgba(201,168,76,.06),rgba(201,168,76,.02))',
      borderColor: 'rgba(201,168,76,.2)',
      marginBottom: '20px',
      display: 'flex', alignItems: 'center', gap: '12px',
    }}>
      <span style={{ fontSize: '1.5rem' }}>🚧</span>
      <div>
        <div style={{ fontSize: '.76rem', fontWeight: 700, color: 'var(--gold2)', marginBottom: '3px' }}>
          Em desenvolvimento
        </div>
        <div style={{ fontSize: '.65rem', color: 'var(--t4)', lineHeight: 1.5 }}>
          {mensagem}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PagamentoCard — condições de pagamento
// ─────────────────────────────────────────────
export function PagamentoCard() {
  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg,rgba(58,158,106,.08),rgba(201,168,76,.05))',
      borderColor: 'rgba(58,158,106,.2)',
    }}>
      <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--grn)', marginBottom: '10px' }}>
        💚 Condições de Pagamento
      </div>
      <div style={{ fontSize: '.74rem', color: 'var(--t3)', lineHeight: 1.8 }}>
        • <b style={{ color: 'var(--t2)' }}>Desconto à vista:</b> 10% nos vidros temperados<br />
        • <b style={{ color: 'var(--t2)' }}>Parcelamento:</b> até 6x sem juros<br />
        • <b style={{ color: 'var(--t2)' }}>Cartão:</b> pode acrescentar 10% sobre total<br />
        • <b style={{ color: 'var(--t2)' }}>Padrão:</b> 50% entrada + 50% na entrega
      </div>
    </div>
  );
}
