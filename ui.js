// ui.js — Primitivos de UI Reutilizáveis
// Ceará Planejados — Vidraçaria
//
// Componentes atômicos que compõem a interface:
//   Badge         → pill de status (confirmado, pendente, etc.)
//   Btn           → botão padronizado com variantes
//   SectionTitle  → título de seção
//   Hero          → bloco hero de topo de página
//   SearchInput   → campo de busca estilizado
//   Divider       → separador visual
//   EmptyState    → estado vazio genérico
//   TabelaPrecos  → tabela de preços reutilizável (Financeiro)
//   ServicoGrid   → grid de serviços (Configurações)

// ─────────────────────────────────────────────
// Badge — pill de status
// ─────────────────────────────────────────────
/**
 * @param {{ variante?: 'grn'|'gold'|'red'|'default', children: React.ReactNode }} props
 */
export function Badge({ variante = 'default', children }) {
  const cls = variante === 'default' ? 'badge' : `badge badge-${variante}`;
  return <span className={cls}>{children}</span>;
}

// ─────────────────────────────────────────────
// Btn — botão padronizado
// ─────────────────────────────────────────────
/**
 * @param {{
 *   variante?: 'gold'|'grn'|'ghost'|'red',
 *   full?: boolean,
 *   sm?: boolean,
 *   onClick?: Function,
 *   disabled?: boolean,
 *   style?: object,
 *   children: React.ReactNode
 * }} props
 */
export function Btn({ variante = 'gold', full = false, sm = false, onClick, disabled, style, children }) {
  let cls = 'btn';
  if (variante) cls += ` btn-${variante}`;
  if (full)     cls += ' btn-full';
  if (sm)       cls += ' btn-sm';

  return (
    <button className={cls} onClick={onClick} disabled={disabled} style={style}>
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────
// SectionTitle — título de seção
// ─────────────────────────────────────────────
/**
 * @param {{ style?: object, children: React.ReactNode }} props
 */
export function SectionTitle({ style, children }) {
  return (
    <div className="section-ttl" style={style}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// Hero — bloco de topo de página
// ─────────────────────────────────────────────
/**
 * @param {{ titulo: string, sub?: string }} props
 */
export function Hero({ titulo, sub }) {
  return (
    <div className="hero">
      <div className="hero-ttl">{titulo}</div>
      {sub && <div className="hero-sub">{sub}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// SearchInput — campo de busca estilizado
// ─────────────────────────────────────────────
/**
 * @param {{ valor: string, onChange: Function, placeholder?: string, style?: object }} props
 */
export function SearchInput({ valor, onChange, placeholder = '🔍  Buscar…', style }) {
  return (
    <div className="field" style={{ marginBottom: '16px', ...style }}>
      <input
        type="text"
        placeholder={placeholder}
        value={valor}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          background: 'var(--s3)',
          border: '1px solid rgba(40,40,47,.9)',
          borderRadius: '12px',
          padding: '13px 15px',
          fontFamily: "'DM Sans',sans-serif",
          fontSize: '.86rem',
          color: 'var(--tx)',
          outline: 'none',
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// Divider — linha separadora
// ─────────────────────────────────────────────
export function Divider({ style }) {
  return <div className="divider" style={style} />;
}

// ─────────────────────────────────────────────
// EmptyState — estado vazio com ícone
// ─────────────────────────────────────────────
/**
 * @param {{ icone?: string, mensagem: string }} props
 */
export function EmptyState({ icone = '🔍', mensagem }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{icone}</div>
      <div style={{ fontSize: '.76rem', color: 'var(--t4)' }}>{mensagem}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TabelaPrecos — tabela de preços (Financeiro)
// ─────────────────────────────────────────────
/**
 * @param {{ titulo: string, sub: string, linhas: [string, string][] }} props
 */
export function TabelaPrecos({ titulo, sub, linhas }) {
  return (
    <div className="price-section">
      <div className="price-section-header">
        <h3>{titulo}</h3>
        <p>{sub}</p>
      </div>
      <div className="card" style={{ padding: '4px 12px' }}>
        <table className="tbl">
          <tbody>
            <tr>
              <th>Tipo</th>
              <th style={{ textAlign: 'right' }}>Valor</th>
            </tr>
            {linhas.map(([nome, val], i) => (
              <tr key={i}>
                <td>{nome}</td>
                <td>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ServicoGrid — grid 2 colunas de serviços
// ─────────────────────────────────────────────
/**
 * @param {{ servicos: [string, string][] }} props
 * Cada item: [icone, nome]
 */
export function ServicoGrid({ servicos }) {
  return (
    <div className="card">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {servicos.map(([ic, nome], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
            <span>{ic}</span>
            <span style={{ fontSize: '.78rem', color: 'var(--t2)' }}>{nome}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PageSpacer — espaço inferior para navBar
// ─────────────────────────────────────────────
export function PageSpacer() {
  return <div style={{ height: '80px' }} />;
}
