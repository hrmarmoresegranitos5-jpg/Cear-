// storage/orcamentos.js — Persistência de Orçamentos — Etapa 9
// Ceará Planejados — Vidraçaria
//
// Cada orçamento salvo contém:
//   id           : gerado automaticamente
//   tipo         : 'pivotante' | 'correr' | 'janela' | 'box' | 'espelho' | 'guarda' | ...
//   larg         : largura em cm
//   alt          : altura em cm
//   vidro        : chave do VIDROS (ex: 'temp_trans')
//   clienteNome  : nome do cliente (opcional)
//   clienteFone  : telefone do cliente (opcional)          ← NOVO Etapa 9
//   km           : distância para frete
//   resultado    : { linhas, total, totalAvista }
//   criadoEm    : ISO string da data/hora
//   atualizadoEm: ISO string da última edição (opcional)

import { dbAdd, dbGet, dbGetAll, dbUpdate, dbRemove, dbGetByIndex } from './db';

const STORE = 'orcamentos';

// ─────────────────────────────────────────────
// Salvar
// ─────────────────────────────────────────────

/**
 * Salva um orçamento novo. Retorna o id gerado.
 *
 * @param {{
 *   tipo: string,
 *   larg: number,
 *   alt: number,
 *   vidro: string,
 *   accs: object,
 *   km: number,
 *   clienteNome?: string,
 *   clienteFone?: string,
 *   resultado: object
 * }} dados
 * @returns {Promise<number>} id
 */
export async function salvarOrcamento(dados) {
  const registro = {
    ...dados,
    criadoEm: new Date().toISOString(),
  };
  return dbAdd(STORE, registro);
}

// ─────────────────────────────────────────────
// Leitura
// ─────────────────────────────────────────────

/**
 * Retorna todos os orçamentos, ordenados do mais recente ao mais antigo.
 * @returns {Promise<Array>}
 */
export async function listarOrcamentos() {
  const todos = await dbGetAll(STORE);
  return todos.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));
}

/**
 * Retorna um orçamento pelo id.
 * @param {number} id
 */
export async function buscarOrcamento(id) {
  return dbGet(STORE, id);
}

/**
 * Retorna todos os orçamentos de um cliente (por nome exato).
 * @param {string} nomeCliente
 */
export async function orcamentosDoCliente(nomeCliente) {
  return dbGetByIndex(STORE, 'por_cliente', nomeCliente);
}

/**
 * Pesquisa orçamentos por nome do cliente (parcial, case-insensitive).
 * @param {string} termo
 * @returns {Promise<Array>}
 */
export async function pesquisarPorCliente(termo) {
  const t = termo.trim().toLowerCase();
  if (!t) return listarOrcamentos();
  const todos = await listarOrcamentos();
  return todos.filter(o =>
    (o.clienteNome || '').toLowerCase().includes(t)
  );
}

/**
 * Pesquisa orçamentos por telefone do cliente (parcial, apenas dígitos).
 * @param {string} fone  - pode conter formatação ou só dígitos
 * @returns {Promise<Array>}
 */
export async function pesquisarPorTelefone(fone) {
  const digitos = fone.replace(/\D/g, '');
  if (!digitos) return listarOrcamentos();
  const todos = await listarOrcamentos();
  return todos.filter(o =>
    (o.clienteFone || '').replace(/\D/g, '').includes(digitos)
  );
}

/**
 * Pesquisa orçamentos por intervalo de datas.
 * @param {string} dataInicio - 'YYYY-MM-DD' (inclusivo)
 * @param {string} dataFim    - 'YYYY-MM-DD' (inclusivo, até 23:59:59)
 * @returns {Promise<Array>}
 */
export async function pesquisarPorData(dataInicio, dataFim) {
  const todos = await listarOrcamentos();
  return todos.filter(o => {
    if (dataInicio && o.criadoEm < dataInicio) return false;
    if (dataFim    && o.criadoEm > dataFim + 'T23:59:59') return false;
    return true;
  });
}

/**
 * Retorna os N orçamentos mais recentes.
 * @param {number} n
 */
export async function ultimosOrcamentos(n = 10) {
  const todos = await listarOrcamentos();
  return todos.slice(0, n);
}

// ─────────────────────────────────────────────
// Atualizar / Remover
// ─────────────────────────────────────────────

/**
 * Atualiza um orçamento existente (deve conter o campo id).
 * @param {object} orcamento
 */
export async function atualizarOrcamento(orcamento) {
  return dbUpdate(STORE, { ...orcamento, atualizadoEm: new Date().toISOString() });
}

/**
 * Remove um orçamento pelo id.
 * @param {number} id
 */
export async function removerOrcamento(id) {
  return dbRemove(STORE, id);
}

// ─────────────────────────────────────────────
// Estatísticas rápidas para o Dashboard
// ─────────────────────────────────────────────

/**
 * Retorna resumo estatístico dos orçamentos.
 * @returns {Promise<{
 *   total: number,
 *   totalMes: number,
 *   ticketMedio: number,
 *   porTipo: Record<string, number>
 * }>}
 */
export async function estatisticasOrcamentos() {
  const todos = await dbGetAll(STORE);

  const agora     = new Date();
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1).toISOString();

  const doMes = todos.filter(o => o.criadoEm >= inicioMes);

  const somaTotal = todos.reduce((s, o) => s + (o.resultado?.total ?? 0), 0);

  const porTipo = {};
  todos.forEach(o => {
    porTipo[o.tipo] = (porTipo[o.tipo] ?? 0) + 1;
  });

  return {
    total:       todos.length,
    totalMes:    doMes.length,
    ticketMedio: todos.length ? somaTotal / todos.length : 0,
    porTipo,
  };
}
