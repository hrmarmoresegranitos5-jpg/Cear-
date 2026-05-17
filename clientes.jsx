// clientes.jsx — Cadastro e Histórico de Clientes
// Ceará Planejados — Vidraçaria
//
// Etapa 7 — Performance:
//   - memo() no componente e no ClienteCard
//   - useMemo para filtrar lista (evita recalcular sem necessidade)
//   - useCallback no handler de WhatsApp
//   - Dados mock fora do componente (alocados uma vez)
//   - Avatar com inicial pré-computada

import { useState, useMemo, useCallback, memo } from 'react';

// ── Dados mock fora do componente ─────────────────────────────────────────────
const CLIENTES_MOCK = [
  { nome: 'João Silva',   fone: '(85) 99111-2233', ult: 'Porta Pivotante · R$ 2.840', data: '14 Mai 2025' },
  { nome: 'Maria Costa',  fone: '(85) 98222-3344', ult: 'Box de Banheiro · R$ 1.560', data: '10 Mai 2025' },
  { nome: 'Pedro Alves',  fone: '(85) 97333-4455', ult: 'Janela Correr · R$ 980',     data: '05 Mai 2025' },
  { nome: 'Ana Souza',    fone: '(85) 96444-5566', ult: 'Espelho · R$ 430',           data: '28 Abr 2025' },
  { nome: 'Carlos Lima',  fone: '(85) 95555-6677', ult: 'Guarda Corpo · R$ 3.200',    data: '20 Abr 2025' },
];

// ── Card de cliente memoizado ─────────────────────────────────────────────────
const ClienteCard = memo(function ClienteCard({ nome, fone, ult, data }) {
  const abrirWpp = useCallback(() => {
    const num = fone.replace(/\D/g, '');
    window.open(`https://wa.me/55${num}`, '_blank');
  }, [fone]);

  return (
    <div className="card" style={{ padding: '14px 16px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            <div style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--tx)', marginBottom: '2px' }}>{nome}</div>
            <div style={{ fontSize: '.66rem', color: 'var(--t3)' }}>{fone}</div>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          style={{ padding: '8px 12px', fontSize: '.65rem' }}
          onClick={abrirWpp}
        >
          📲
        </button>
      </div>

      <div style={{
        marginTop: '10px', padding: '8px 10px',
        background: 'rgba(0,0,0,.2)', borderRadius: '8px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ fontSize: '.65rem', color: 'var(--t4)' }}>
          Último: <span style={{ color: 'var(--t2)', fontWeight: 600 }}>{ult}</span>
        </div>
        <div style={{ fontSize: '.6rem', color: 'var(--t4)' }}>{data}</div>
      </div>
    </div>
  );
});

// ── Componente principal memoizado ────────────────────────────────────────────
const Clientes = memo(function Clientes() {
  const [busca, setBusca] = useState('');

  // useMemo: só recalcula quando busca muda
  const filtrados = useMemo(() =>
    busca.trim() === ''
      ? CLIENTES_MOCK
      : CLIENTES_MOCK.filter(c =>
          c.nome.toLowerCase().includes(busca.toLowerCase()) ||
          c.fone.includes(busca)
        ),
  [busca]);

  return (
    <div id="pgClientes" className="pg on">
      <div className="hero">
        <div className="hero-ttl">👥 Clientes</div>
        <div className="hero-sub">Cadastro e histórico de atendimentos</div>
      </div>

      <div className="section">

        {/* Banner em construção */}
        <div className="card" style={{
          background: 'linear-gradient(135deg,rgba(201,168,76,.06),rgba(201,168,76,.02))',
          borderColor: 'rgba(201,168,76,.2)', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <span style={{ fontSize: '1.5rem' }}>🚧</span>
          <div>
            <div style={{ fontSize: '.76rem', fontWeight: 700, color: 'var(--gold2)', marginBottom: '3px' }}>
              Em desenvolvimento
            </div>
            <div style={{ fontSize: '.65rem', color: 'var(--t4)', lineHeight: 1.5 }}>
              CRM completo com histórico e cadastro total de clientes em breve.
            </div>
          </div>
        </div>

        {/* Campo de busca */}
        <div className="field" style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="🔍  Buscar por nome ou telefone…"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{
              width: '100%', background: 'var(--s3)',
              border: '1px solid rgba(40,40,47,.9)', borderRadius: '12px',
              padding: '13px 15px', fontFamily: "'DM Sans',sans-serif",
              fontSize: '.86rem', color: 'var(--tx)', outline: 'none',
            }}
          />
        </div>

        <div className="section-ttl">{filtrados.length} cliente{filtrados.length !== 1 ? 's' : ''}</div>

        {filtrados.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '28px 16px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔍</div>
            <div style={{ fontSize: '.76rem', color: 'var(--t4)' }}>Nenhum cliente encontrado</div>
          </div>
        ) : (
          filtrados.map(c => (
            <ClienteCard key={c.fone} nome={c.nome} fone={c.fone} ult={c.ult} data={c.data} />
          ))
        )}

        <button
          className="btn btn-gold btn-full"
          style={{ marginTop: '8px' }}
          onClick={() => alert('Cadastro de cliente: em desenvolvimento')}
        >
          + Novo Cliente
        </button>
      </div>

      <div style={{ height: '80px' }} />
    </div>
  );
});

export default Clientes;
