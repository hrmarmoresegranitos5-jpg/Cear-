// financeiro.jsx — Tabela de Preços / Financeiro
// Ceará Planejados — Vidraçaria
//
// Etapa 7 — Performance:
//   - memo() no componente e sub-componentes
//   - Dados em arrays estáticos (fora do render)
//   - TabelaSection extraída como componente memoizado

import { memo } from 'react';

// ── Dados estáticos ───────────────────────────────────────────────────────────
const SECOES = [
  {
    titulo: '🔥 Vidros Temperados — 8mm',
    sub:    'Alta resistência · 10% desconto à vista',
    linhas: [
      ['Transparente','R$ 420,00'], ['Fumê','R$ 455,00'],
      ['Serigrafado','R$ 650,00'], ['Jateado','R$ 440,00'],
      ['Espelhado','R$ 620,00'],
    ],
  },
  {
    titulo: '🔲 Vidros Comuns',
    sub:    'Uso residencial · Recorte +R$10/m²',
    linhas: [
      ['Incolor 4mm','R$ 220,00'], ['Incolor 6mm','R$ 240,00'],
      ['Fumê 3mm','R$ 210,00'],   ['Fumê 4mm','R$ 245,00'],
      ['Espelho 3mm','R$ 260,00'],['Espelho 4mm','R$ 280,00'],
    ],
  },
  {
    titulo: '🔧 Kits e Ferragens',
    sub:    'Inclusos conforme o produto selecionado',
    linhas: [
      ['Kit pivotante comum','R$ 150,00'], ['Kit pivotante jumbo','R$ 350,00'],
      ['Kit porta de correr','R$ 100/m²'], ['Kit janela 2 folhas','R$ 100/m'],
      ['Kit janela 4 folhas','R$ 110/m'],  ['Kit basculante','R$ 150,00'],
    ],
  },
  {
    titulo: '🪝 Acessórios Avulsos',
    sub:    'Adicionados automaticamente por produto',
    linhas: [
      ['Fechadura VP','R$ 150,00'],        ['Fechadura VV','R$ 180,00'],
      ['Puxador','R$ 100,00'],             ['Fixador','R$ 60,00'],
      ['Bate-fecha VP','R$ 50,00'],        ['Bate-fecha VV','R$ 80,00'],
      ['Cantoneira alumínio','R$ 10/m'],   ['PU (poliuretano)','R$ 70/m'],
    ],
  },
];

// ── Sub-componente memoizado ──────────────────────────────────────────────────
const TabelaSection = memo(function TabelaSection({ titulo, sub, linhas }) {
  return (
    <div className="price-section">
      <div className="price-section-header">
        <h3>{titulo}</h3>
        <p>{sub}</p>
      </div>
      <div className="card" style={{ padding: '4px 12px' }}>
        <table className="tbl">
          <tbody>
            <tr><th>Tipo</th><th style={{ textAlign: 'right' }}>Valor</th></tr>
            {linhas.map(([nome, val]) => (
              <tr key={nome}><td>{nome}</td><td>{val}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

// ── Componente principal memoizado ────────────────────────────────────────────
const Financeiro = memo(function Financeiro() {
  return (
    <div id="pgFinanceiro" className="pg on">
      <div className="hero">
        <div className="hero-ttl">💎 Tabela de Preços</div>
        <div className="hero-sub">Valores por m² — Vidraçaria Ceará Planejados</div>
      </div>

      <div className="section">
        {SECOES.map(s => (
          <TabelaSection key={s.titulo} titulo={s.titulo} sub={s.sub} linhas={s.linhas} />
        ))}

        {/* Condições de pagamento */}
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
      </div>

      <div style={{ height: '80px' }} />
    </div>
  );
});

export default Financeiro;
