// historico.jsx — Sistema de Histórico de Orçamentos — Etapa 9
// Ceará Planejados — Vidraçaria
//
// Funcionalidades:
//   - Pesquisar por cliente (nome)
//   - Pesquisar por telefone
//   - Pesquisar por data
//   - Visualizar detalhes do orçamento
//   - Editar orçamento antigo (reabre na tela de Orçamentos)
//   - Duplicar orçamento
//   - Excluir orçamento

import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import {
  listarOrcamentos,
  removerOrcamento,
  atualizarOrcamento,
  salvarOrcamento,
} from './storage/orcamentos';
import { Modal, ModalConfirm } from './components/modals';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBRL(v) {
  if (!v && v !== 0) return '—';
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatData(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDataHora(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const TIPO_LABEL = {
  pivotante: 'Porta Pivotante',
  correr:    'Porta de Correr',
  janela:    'Janela',
  box:       'Box de Banheiro',
  espelho:   'Espelho',
  guarda:    'Guarda Corpo',
  rodape:    'Rodapé de Box',
  comum:     'Vidro Comum',
};

const TIPO_ICONE = {
  pivotante: '🚪',
  correr:    '🔲',
  janela:    '🪟',
  box:       '🛁',
  espelho:   '🪞',
  guarda:    '🏗️',
  rodape:    '🚿',
  comum:     '🪟',
};

function labelTipo(tipo) {
  return TIPO_LABEL[tipo] || tipo;
}

function iconeTipo(tipo) {
  return TIPO_ICONE[tipo] || '📋';
}

// Cor de fundo por tipo
const TIPO_COR = {
  pivotante: { bg: 'rgba(212,175,55,0.1)',  brd: 'rgba(212,175,55,0.25)' },
  correr:    { bg: 'rgba(80,160,220,0.1)',  brd: 'rgba(80,160,220,0.25)' },
  janela:    { bg: 'rgba(100,200,140,0.1)', brd: 'rgba(100,200,140,0.25)' },
  box:       { bg: 'rgba(160,120,220,0.1)', brd: 'rgba(160,120,220,0.25)' },
  espelho:   { bg: 'rgba(220,180,80,0.1)',  brd: 'rgba(220,180,80,0.25)' },
  guarda:    { bg: 'rgba(220,100,100,0.1)', brd: 'rgba(220,100,100,0.25)' },
  rodape:    { bg: 'rgba(140,200,180,0.1)', brd: 'rgba(140,200,180,0.25)' },
  comum:     { bg: 'rgba(180,180,180,0.1)', brd: 'rgba(180,180,180,0.25)' },
};

function corTipo(tipo) {
  return TIPO_COR[tipo] || { bg: 'rgba(201,168,76,0.1)', brd: 'rgba(201,168,76,0.2)' };
}

// ── CSS injetado uma vez ──────────────────────────────────────────────────────

const CSS_HIST = `
  .hist-wrap {
    display: flex; flex-direction: column;
    height: 100%; overflow: hidden;
  }
  .hist-head {
    flex-shrink: 0;
    padding: 16px 16px 0;
  }
  .hist-titulo {
    font-size: 1rem; font-weight: 700; color: var(--tx);
    margin-bottom: 12px;
  }
  .hist-filtros {
    display: flex; gap: 8px;
    margin-bottom: 10px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 2px;
  }
  .hist-filtros::-webkit-scrollbar { display: none; }
  .hist-chip {
    flex-shrink: 0;
    display: flex; align-items: center; gap: 5px;
    padding: 6px 12px;
    border-radius: 50px;
    border: 1px solid rgba(255,255,255,.08);
    background: var(--s2);
    font-size: .68rem; font-weight: 600; color: var(--t3);
    cursor: pointer; transition: all .15s;
    white-space: nowrap;
  }
  .hist-chip.on {
    background: rgba(201,168,76,.12);
    border-color: rgba(201,168,76,.3);
    color: var(--gold);
  }
  .hist-busca {
    position: relative; margin-bottom: 10px;
  }
  .hist-busca-ic {
    position: absolute; left: 12px; top: 50%;
    transform: translateY(-50%);
    font-size: .85rem; pointer-events: none;
  }
  .hist-busca input {
    width: 100%; box-sizing: border-box;
    padding: 10px 12px 10px 34px;
    background: var(--s2);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 10px;
    font-size: .78rem; color: var(--tx);
    outline: none; font-family: var(--font);
  }
  .hist-busca input:focus {
    border-color: rgba(201,168,76,.3);
    background: var(--s3);
  }
  .hist-busca input::placeholder { color: var(--t4); }

  /* data picker row */
  .hist-date-row {
    display: flex; gap: 8px; margin-bottom: 10px;
  }
  .hist-date-row input[type="date"] {
    flex: 1;
    padding: 9px 10px;
    background: var(--s2);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 10px;
    font-size: .72rem; color: var(--tx);
    outline: none; font-family: var(--font);
    color-scheme: dark;
  }
  .hist-date-row input[type="date"]:focus {
    border-color: rgba(201,168,76,.3);
  }
  .hist-date-lbl {
    font-size: .62rem; color: var(--t4);
    margin-bottom: 3px;
  }
  .hist-date-group { flex: 1; display: flex; flex-direction: column; }

  .hist-resumo {
    font-size: .64rem; color: var(--t4);
    padding: 0 2px 8px;
  }

  /* lista */
  .hist-list {
    flex: 1; overflow-y: auto;
    padding: 0 16px 16px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .hist-list::-webkit-scrollbar { display: none; }

  /* card de orçamento */
  .orc-card {
    background: var(--s2);
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 14px;
    margin-bottom: 10px;
    overflow: hidden;
    animation: fadeInUp .2s ease both;
  }
  .orc-card-top {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px;
    cursor: pointer;
  }
  .orc-card-ic {
    width: 42px; height: 42px; border-radius: 12px;
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
  }
  .orc-card-info { flex: 1; min-width: 0; }
  .orc-card-tipo {
    font-size: .8rem; font-weight: 700; color: var(--tx);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 2px;
  }
  .orc-card-cliente {
    font-size: .68rem; color: var(--t3);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .orc-card-right { text-align: right; flex-shrink: 0; }
  .orc-card-total {
    font-size: .82rem; font-weight: 700; color: var(--gold);
  }
  .orc-card-data {
    font-size: .6rem; color: var(--t4); margin-top: 2px;
  }

  /* expandido */
  .orc-card-detalhe {
    border-top: 1px solid rgba(255,255,255,.05);
    padding: 12px 14px;
    background: rgba(0,0,0,.15);
  }
  .orc-det-linha {
    display: flex; justify-content: space-between;
    font-size: .7rem; color: var(--t3);
    margin-bottom: 6px;
  }
  .orc-det-linha:last-child { margin-bottom: 0; }
  .orc-det-lbl { color: var(--t4); }
  .orc-det-val { color: var(--t2); font-weight: 600; }
  .orc-det-total {
    display: flex; justify-content: space-between;
    font-size: .78rem; font-weight: 700;
    color: var(--tx);
    margin: 10px 0 12px;
    padding: 8px 10px;
    background: rgba(201,168,76,.06);
    border-radius: 8px;
    border: 1px solid rgba(201,168,76,.12);
  }
  .orc-det-avista {
    font-size: .68rem; color: var(--grn); text-align: right;
    margin-top: -8px; margin-bottom: 12px;
  }

  /* ações do card */
  .orc-acoes {
    display: flex; gap: 8px;
  }
  .orc-btn {
    flex: 1;
    display: flex; align-items: center; justify-content: center; gap: 5px;
    padding: 8px 0;
    border-radius: 8px;
    font-size: .65rem; font-weight: 700;
    border: none; cursor: pointer;
    transition: opacity .15s, transform .1s;
    font-family: var(--font);
  }
  .orc-btn:active { transform: scale(.95); opacity: .8; }
  .orc-btn-edit  { background: rgba(201,168,76,.12); color: var(--gold); border: 1px solid rgba(201,168,76,.2); }
  .orc-btn-dup   { background: rgba(80,160,220,.1);  color: #50A0DC;     border: 1px solid rgba(80,160,220,.2); }
  .orc-btn-del   { background: rgba(224,85,85,.1);   color: var(--red);  border: 1px solid rgba(224,85,85,.2);  }
  .orc-btn-wpp   { background: rgba(58,158,106,.12); color: var(--grn);  border: 1px solid rgba(58,158,106,.2); }

  /* empty */
  .hist-empty {
    text-align: center; padding: 40px 20px;
    color: var(--t4); font-size: .78rem;
  }
  .hist-empty-ic { font-size: 2.5rem; margin-bottom: 12px; }

  /* toast */
  .hist-toast {
    position: fixed; bottom: 88px; left: 50%; transform: translateX(-50%);
    background: var(--s3); border: 1px solid rgba(255,255,255,.1);
    border-radius: 50px; padding: 10px 20px;
    font-size: .74rem; font-weight: 600; color: var(--tx);
    z-index: 999; white-space: nowrap;
    box-shadow: var(--shadow-md);
    animation: toastIn .22s ease;
  }
  @keyframes toastIn {
    from { opacity:0; transform: translate(-50%, 12px); }
    to   { opacity:1; transform: translate(-50%, 0); }
  }
  @keyframes fadeInUp {
    from { opacity:0; transform: translateY(8px); }
    to   { opacity:1; transform: translateY(0); }
  }

  /* modal detalhe de linhas */
  .orc-linhas-item {
    display: flex; justify-content: space-between;
    font-size: .72rem; padding: 7px 0;
    border-bottom: 1px solid rgba(255,255,255,.04);
    color: var(--t2);
  }
  .orc-linhas-item:last-child { border-bottom: none; }
  .orc-linhas-nome { color: var(--t3); }

  /* edição inline de nome/fone */
  .hist-edit-field {
    width: 100%; box-sizing: border-box;
    padding: 9px 11px;
    background: var(--s1);
    border: 1px solid rgba(201,168,76,.25);
    border-radius: 9px;
    font-size: .76rem; color: var(--tx);
    font-family: var(--font); outline: none;
    margin-bottom: 8px;
  }
  .hist-edit-lbl {
    font-size: .62rem; color: var(--t4);
    margin-bottom: 3px;
  }
`;

function injectHistCSS() {
  if (document.getElementById('css-historico')) return;
  const el = document.createElement('style');
  el.id = 'css-historico';
  el.textContent = CSS_HIST;
  document.head.appendChild(el);
}

// ── Filtros disponíveis ───────────────────────────────────────────────────────

const FILTROS = [
  { id: 'todos',     label: '📋 Todos'    },
  { id: 'cliente',   label: '👤 Cliente'  },
  { id: 'telefone',  label: '📱 Telefone' },
  { id: 'data',      label: '📅 Data'     },
];

// ── Card de orçamento (memoizado) ─────────────────────────────────────────────

const OrcCard = memo(function OrcCard({ orc, onEditar, onDuplicar, onExcluir }) {
  const [aberto, setAberto] = useState(false);
  const cor = corTipo(orc.tipo);

  const total     = orc.resultado?.total     ?? 0;
  const avista    = orc.resultado?.totalAvista ?? 0;
  const linhas    = orc.resultado?.linhas     ?? [];
  const clienteNome = orc.clienteNome || 'Cliente não informado';
  const clienteFone = orc.clienteFone || '';

  function abrirWpp() {
    if (!clienteFone) return;
    const num = clienteFone.replace(/\D/g, '');
    const txt = gerarTextoSimples(orc);
    window.open(`https://wa.me/55${num}?text=${encodeURIComponent(txt)}`, '_blank');
  }

  function gerarTextoSimples(o) {
    const l = labelTipo(o.tipo);
    let t = `🪟 *Orçamento — ${l}*\n`;
    t += `📐 ${o.larg} x ${o.alt} cm\n`;
    if (o.clienteNome) t += `👤 ${o.clienteNome}\n`;
    t += `\n`;
    (o.resultado?.linhas || []).forEach(l => {
      t += `• ${l.nome}: ${formatBRL(l.valor)}\n`;
    });
    t += `\n💰 *Total: ${formatBRL(o.resultado?.total)}*\n`;
    t += `💚 À vista: *${formatBRL(o.resultado?.totalAvista)}*\n`;
    t += `\n_Ceará Planejados — Vidraçaria_`;
    return t;
  }

  return (
    <div className="orc-card">
      {/* Topo clicável */}
      <div className="orc-card-top" onClick={() => setAberto(a => !a)}>
        <div
          className="orc-card-ic"
          style={{ background: cor.bg, border: `1px solid ${cor.brd}` }}
        >
          {iconeTipo(orc.tipo)}
        </div>
        <div className="orc-card-info">
          <div className="orc-card-tipo">{labelTipo(orc.tipo)}</div>
          <div className="orc-card-cliente">
            {clienteNome}
            {clienteFone ? ` · ${clienteFone}` : ''}
          </div>
        </div>
        <div className="orc-card-right">
          <div className="orc-card-total">{formatBRL(total)}</div>
          <div className="orc-card-data">{formatData(orc.criadoEm)}</div>
        </div>
      </div>

      {/* Detalhe expandido */}
      {aberto && (
        <div className="orc-card-detalhe">
          {/* Medidas */}
          <div className="orc-det-linha">
            <span className="orc-det-lbl">Medidas</span>
            <span className="orc-det-val">{orc.larg} × {orc.alt} cm</span>
          </div>
          {orc.vidro && (
            <div className="orc-det-linha">
              <span className="orc-det-lbl">Vidro</span>
              <span className="orc-det-val">{orc.vidro}</span>
            </div>
          )}
          {orc.km > 0 && (
            <div className="orc-det-linha">
              <span className="orc-det-lbl">Frete</span>
              <span className="orc-det-val">{orc.km} km</span>
            </div>
          )}
          {orc.atualizadoEm && (
            <div className="orc-det-linha">
              <span className="orc-det-lbl">Atualizado</span>
              <span className="orc-det-val">{formatDataHora(orc.atualizadoEm)}</span>
            </div>
          )}

          {/* Itens */}
          {linhas.length > 0 && (
            <div style={{ margin: '10px 0 8px' }}>
              {linhas.map((l, i) => (
                <div className="orc-linhas-item" key={i}>
                  <span className="orc-linhas-nome">{l.nome}</span>
                  <span>{formatBRL(l.valor)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          <div className="orc-det-total">
            <span>Total</span>
            <span>{formatBRL(total)}</span>
          </div>
          {avista > 0 && avista !== total && (
            <div className="orc-det-avista">
              💚 À vista (10% off): {formatBRL(avista)}
            </div>
          )}

          {/* Ações */}
          <div className="orc-acoes">
            <button className="orc-btn orc-btn-edit" onClick={() => onEditar(orc)}>
              ✏️ Editar
            </button>
            <button className="orc-btn orc-btn-dup" onClick={() => onDuplicar(orc)}>
              📋 Duplicar
            </button>
            {clienteFone && (
              <button className="orc-btn orc-btn-wpp" onClick={abrirWpp}>
                📲 Wpp
              </button>
            )}
            <button className="orc-btn orc-btn-del" onClick={() => onExcluir(orc)}>
              🗑️
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

// ── Modal de Edição de Orçamento ──────────────────────────────────────────────

function ModalEditar({ orc, onSalvar, onFechar }) {
  const [nome,  setNome]  = useState(orc?.clienteNome || '');
  const [fone,  setFone]  = useState(orc?.clienteFone || '');
  const [larg,  setLarg]  = useState(String(orc?.larg  || ''));
  const [alt,   setAlt]   = useState(String(orc?.alt   || ''));
  const [km,    setKm]    = useState(String(orc?.km    || '0'));
  const [salvo, setSalvo] = useState(false);

  async function handleSalvar() {
    const atualizado = {
      ...orc,
      clienteNome: nome.trim() || orc.clienteNome,
      clienteFone: fone.trim() || orc.clienteFone,
      larg: parseFloat(larg) || orc.larg,
      alt:  parseFloat(alt)  || orc.alt,
      km:   parseFloat(km)   || 0,
    };
    await atualizarOrcamento(atualizado);
    setSalvo(true);
    setTimeout(() => { onSalvar(atualizado); }, 500);
  }

  if (!orc) return null;

  return (
    <Modal aberto titulo={`✏️ Editar — ${labelTipo(orc.tipo)}`} onFechar={onFechar}>
      <div style={{ marginBottom: 14 }}>
        <div className="hist-edit-lbl">Nome do cliente</div>
        <input
          className="hist-edit-field"
          value={nome}
          onChange={e => setNome(e.target.value)}
          placeholder="Nome do cliente"
        />
        <div className="hist-edit-lbl">Telefone</div>
        <input
          className="hist-edit-field"
          value={fone}
          onChange={e => setFone(e.target.value)}
          placeholder="(85) 99999-9999"
          type="tel"
        />
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div className="hist-edit-lbl">Largura (cm)</div>
            <input
              className="hist-edit-field"
              value={larg}
              onChange={e => setLarg(e.target.value)}
              type="number"
              placeholder="cm"
            />
          </div>
          <div style={{ flex: 1 }}>
            <div className="hist-edit-lbl">Altura (cm)</div>
            <input
              className="hist-edit-field"
              value={alt}
              onChange={e => setAlt(e.target.value)}
              type="number"
              placeholder="cm"
            />
          </div>
        </div>
        <div className="hist-edit-lbl">KM para frete</div>
        <input
          className="hist-edit-field"
          value={km}
          onChange={e => setKm(e.target.value)}
          type="number"
          placeholder="0"
        />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-ghost btn-full" onClick={onFechar}>
          Cancelar
        </button>
        <button
          className="btn btn-gold btn-full"
          onClick={handleSalvar}
          disabled={salvo}
        >
          {salvo ? '✅ Salvo!' : 'Salvar'}
        </button>
      </div>
    </Modal>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export default memo(function Historico() {
  injectHistCSS();

  const [orcamentos, setOrcamentos]   = useState([]);
  const [carregando, setCarregando]   = useState(true);
  const [filtroAtivo, setFiltroAtivo] = useState('todos');
  const [busca, setBusca]             = useState('');
  const [dataInicio, setDataInicio]   = useState('');
  const [dataFim, setDataFim]         = useState('');

  // Modais
  const [orcEditar,  setOrcEditar]  = useState(null);
  const [orcExcluir, setOrcExcluir] = useState(null);
  const [toast, setToast]           = useState('');

  // ── Carregar do IndexedDB ──────────────────────────────────────────────────
  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const lista = await listarOrcamentos();
      setOrcamentos(lista);
    } catch (e) {
      console.error('[Historico] erro ao carregar:', e);
    }
    setCarregando(false);
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  // ── Toast ─────────────────────────────────────────────────────────────────
  function mostrarToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  // ── Filtrar lista ─────────────────────────────────────────────────────────
  const filtrados = useMemo(() => {
    let lista = [...orcamentos];
    const t = busca.trim().toLowerCase();

    if (filtroAtivo === 'cliente' && t) {
      lista = lista.filter(o =>
        (o.clienteNome || '').toLowerCase().includes(t)
      );
    } else if (filtroAtivo === 'telefone' && t) {
      const digitos = busca.replace(/\D/g, '');
      lista = lista.filter(o =>
        (o.clienteFone || '').replace(/\D/g, '').includes(digitos) ||
        (o.clienteFone || '').toLowerCase().includes(t)
      );
    } else if (filtroAtivo === 'data') {
      if (dataInicio) {
        lista = lista.filter(o => o.criadoEm >= dataInicio);
      }
      if (dataFim) {
        // inclui o dia inteiro do fim
        const fim = dataFim + 'T23:59:59';
        lista = lista.filter(o => o.criadoEm <= fim);
      }
    } else if (filtroAtivo === 'todos' && t) {
      // busca geral: nome, fone, tipo
      lista = lista.filter(o =>
        (o.clienteNome || '').toLowerCase().includes(t) ||
        (o.clienteFone || '').toLowerCase().includes(t) ||
        labelTipo(o.tipo).toLowerCase().includes(t)
      );
    }

    return lista;
  }, [orcamentos, filtroAtivo, busca, dataInicio, dataFim]);

  // ── Ações ─────────────────────────────────────────────────────────────────

  function handleFiltro(id) {
    setFiltroAtivo(id);
    setBusca('');
    setDataInicio('');
    setDataFim('');
  }

  const handleEditar = useCallback((orc) => {
    setOrcEditar(orc);
  }, []);

  const handleSalvarEdicao = useCallback((atualizado) => {
    setOrcamentos(prev =>
      prev.map(o => o.id === atualizado.id ? atualizado : o)
    );
    setOrcEditar(null);
    mostrarToast('✅ Orçamento atualizado!');
  }, []);

  const handleDuplicar = useCallback(async (orc) => {
    try {
      const { id, criadoEm, atualizadoEm, ...resto } = orc;
      const novoId = await salvarOrcamento({
        ...resto,
        clienteNome: orc.clienteNome ? `${orc.clienteNome} (cópia)` : '',
      });
      await carregar();
      mostrarToast('📋 Orçamento duplicado!');
    } catch (e) {
      console.error('[Historico] erro ao duplicar:', e);
      mostrarToast('❌ Erro ao duplicar');
    }
  }, [carregar]);

  const handleExcluir = useCallback((orc) => {
    setOrcExcluir(orc);
  }, []);

  async function confirmarExclusao() {
    if (!orcExcluir) return;
    try {
      await removerOrcamento(orcExcluir.id);
      setOrcamentos(prev => prev.filter(o => o.id !== orcExcluir.id));
      mostrarToast('🗑️ Orçamento excluído');
    } catch (e) {
      mostrarToast('❌ Erro ao excluir');
    }
    setOrcExcluir(null);
  }

  // ── Placeholder de busca por filtro ───────────────────────────────────────
  const placeholder = {
    todos:    'Buscar por cliente, telefone ou tipo…',
    cliente:  'Digite o nome do cliente…',
    telefone: 'Digite o telefone…',
    data:     '',
  }[filtroAtivo] || 'Buscar…';

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="hist-wrap">

      {/* Cabeçalho */}
      <div className="hist-head">
        <div className="hist-titulo">📂 Histórico</div>

        {/* Chips de filtro */}
        <div className="hist-filtros">
          {FILTROS.map(f => (
            <button
              key={f.id}
              className={`hist-chip${filtroAtivo === f.id ? ' on' : ''}`}
              onClick={() => handleFiltro(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Campo de busca (exceto quando filtro = data) */}
        {filtroAtivo !== 'data' && (
          <div className="hist-busca">
            <span className="hist-busca-ic">🔍</span>
            <input
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder={placeholder}
              autoComplete="off"
              autoCorrect="off"
            />
          </div>
        )}

        {/* Filtro por data */}
        {filtroAtivo === 'data' && (
          <div className="hist-date-row">
            <div className="hist-date-group">
              <div className="hist-date-lbl">De</div>
              <input
                type="date"
                value={dataInicio}
                onChange={e => setDataInicio(e.target.value)}
              />
            </div>
            <div className="hist-date-group">
              <div className="hist-date-lbl">Até</div>
              <input
                type="date"
                value={dataFim}
                onChange={e => setDataFim(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Resumo */}
        <div className="hist-resumo">
          {carregando
            ? 'Carregando…'
            : `${filtrados.length} orçamento${filtrados.length !== 1 ? 's' : ''}${orcamentos.length !== filtrados.length ? ` de ${orcamentos.length}` : ''}`
          }
        </div>
      </div>

      {/* Lista */}
      <div className="hist-list">
        {carregando ? (
          <div className="hist-empty">
            <div className="hist-empty-ic">⏳</div>
            Carregando histórico…
          </div>
        ) : filtrados.length === 0 ? (
          <div className="hist-empty">
            <div className="hist-empty-ic">📭</div>
            {orcamentos.length === 0
              ? 'Nenhum orçamento salvo ainda.\nFaça seu primeiro orçamento!'
              : 'Nenhum resultado para esta busca.'}
          </div>
        ) : (
          filtrados.map((orc, i) => (
            <OrcCard
              key={orc.id ?? i}
              orc={orc}
              onEditar={handleEditar}
              onDuplicar={handleDuplicar}
              onExcluir={handleExcluir}
            />
          ))
        )}
      </div>

      {/* Modal de edição */}
      {orcEditar && (
        <ModalEditar
          orc={orcEditar}
          onSalvar={handleSalvarEdicao}
          onFechar={() => setOrcEditar(null)}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      <ModalConfirm
        aberto={!!orcExcluir}
        titulo="🗑️ Excluir orçamento?"
        mensagem={`Deseja excluir o orçamento de ${orcExcluir?.clienteNome || labelTipo(orcExcluir?.tipo)}? Esta ação não pode ser desfeita.`}
        labelConfirmar="Excluir"
        labelCancelar="Cancelar"
        perigoso
        onConfirmar={confirmarExclusao}
        onCancelar={() => setOrcExcluir(null)}
      />

      {/* Toast */}
      {toast && <div className="hist-toast">{toast}</div>}
    </div>
  );
});
