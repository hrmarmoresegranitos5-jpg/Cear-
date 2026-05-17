// storage/financeiro.js — Persistência Financeira
// Ceará Planejados — Vidraçaria
//
// Este módulo tem dois papéis:
//
//   1. PREÇOS EDITÁVEIS
//      Salva sobrescrições dos preços da tabela padrão (precos.js).
//      Permite ao dono alterar valores sem mexer no código.
//
//   2. REGISTRO FINANCEIRO
//      Registra pagamentos recebidos vinculados a orçamentos.
//      Permite visualizar entradas por período.
//
// Estrutura das chaves no store 'financeiro':
//   'precos_vidros'      → Record<string, number>  (sobreposição de VIDROS)
//   'precos_acessorios'  → Record<string, Record<string, number>>
//   'config_frete'       → { gratis_km, por_km_extra }
//   'config_desconto'    → { avista }
//   'pagamentos'         → Array<Pagamento>  (acumulativo)

import { dbGet, dbUpdate } from './db';
import {
  VIDROS,
  ACESSORIOS_CONFIG,
  FRETE_GRATIS_KM,
  FRETE_POR_KM_EXTRA,
  DESCONTO_AVISTA,
} from '../data/precos';

const STORE = 'financeiro';

// ─────────────────────────────────────────────
// 1. PREÇOS EDITÁVEIS
// ─────────────────────────────────────────────

/**
 * Retorna a tabela de preços de vidros vigente.
 * Mescla os valores padrão com as sobrescrições salvas.
 * @returns {Promise<typeof VIDROS>}
 */
export async function getPrecosVidros() {
  const salvo = await dbGet(STORE, 'precos_vidros');
  if (!salvo) return { ...VIDROS };

  // Mescla: chaves salvas sobrepõem as padrão
  const merged = { ...VIDROS };
  Object.entries(salvo.valores).forEach(([chave, preco]) => {
    if (merged[chave]) merged[chave] = { ...merged[chave], preco };
  });
  return merged;
}

/**
 * Salva sobrescrições de preço de vidros.
 * @param {Record<string, number>} valores  ex: { temp_trans: 450, temp_fume: 480 }
 */
export async function salvarPrecosVidros(valores) {
  return dbUpdate(STORE, {
    chave:       'precos_vidros',
    valores,
    atualizadoEm: new Date().toISOString(),
  });
}

/**
 * Retorna a configuração de frete vigente.
 * @returns {Promise<{ gratis_km: number, por_km_extra: number }>}
 */
export async function getConfigFrete() {
  const salvo = await dbGet(STORE, 'config_frete');
  return salvo?.config ?? { gratis_km: FRETE_GRATIS_KM, por_km_extra: FRETE_POR_KM_EXTRA };
}

/**
 * Salva configuração de frete.
 * @param {{ gratis_km: number, por_km_extra: number }} config
 */
export async function salvarConfigFrete(config) {
  return dbUpdate(STORE, {
    chave: 'config_frete',
    config,
    atualizadoEm: new Date().toISOString(),
  });
}

/**
 * Retorna o desconto à vista vigente (decimal, ex: 0.10).
 * @returns {Promise<number>}
 */
export async function getDescontoAvista() {
  const salvo = await dbGet(STORE, 'config_desconto');
  return salvo?.avista ?? DESCONTO_AVISTA;
}

/**
 * Salva o desconto à vista.
 * @param {number} avista ex: 0.10
 */
export async function salvarDescontoAvista(avista) {
  return dbUpdate(STORE, {
    chave: 'config_desconto',
    avista,
    atualizadoEm: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────
// 2. REGISTRO DE PAGAMENTOS
// ─────────────────────────────────────────────

/**
 * Estrutura de um pagamento:
 * {
 *   orcamentoId : number
 *   clienteNome : string
 *   valor       : number
 *   forma       : 'pix' | 'dinheiro' | 'cartao' | 'parcelado'
 *   data        : string ISO (YYYY-MM-DD)
 *   obs         : string
 * }
 */

async function _getPagamentos() {
  const reg = await dbGet(STORE, 'pagamentos');
  return reg?.lista ?? [];
}

async function _setPagamentos(lista) {
  return dbUpdate(STORE, {
    chave: 'pagamentos',
    lista,
    atualizadoEm: new Date().toISOString(),
  });
}

/**
 * Registra um pagamento recebido.
 * @param {{ orcamentoId, clienteNome, valor, forma, data?, obs? }} dados
 */
export async function registrarPagamento(dados) {
  const lista = await _getPagamentos();
  lista.unshift({
    id:          Date.now(),      // id simples por timestamp
    orcamentoId: dados.orcamentoId ?? null,
    clienteNome: dados.clienteNome ?? '',
    valor:       Number(dados.valor),
    forma:       dados.forma ?? 'pix',
    data:        dados.data ?? new Date().toISOString().slice(0, 10),
    obs:         dados.obs?.trim() ?? '',
    criadoEm:   new Date().toISOString(),
  });
  return _setPagamentos(lista);
}

/**
 * Lista todos os pagamentos, do mais recente ao mais antigo.
 * @returns {Promise<Array>}
 */
export async function listarPagamentos() {
  return _getPagamentos();
}

/**
 * Remove um pagamento pelo id (timestamp).
 * @param {number} id
 */
export async function removerPagamento(id) {
  const lista = await _getPagamentos();
  return _setPagamentos(lista.filter(p => p.id !== id));
}

// ─────────────────────────────────────────────
// 3. RESUMO FINANCEIRO
// ─────────────────────────────────────────────

/**
 * Retorna resumo financeiro por período.
 * @param {string} dataInicio YYYY-MM-DD
 * @param {string} dataFim    YYYY-MM-DD
 * @returns {Promise<{
 *   total: number,
 *   porForma: Record<string, number>,
 *   pagamentos: Array
 * }>}
 */
export async function resumoFinanceiro(dataInicio, dataFim) {
  const todos = await _getPagamentos();

  const filtrados = todos.filter(p =>
    (!dataInicio || p.data >= dataInicio) &&
    (!dataFim    || p.data <= dataFim)
  );

  const porForma = {};
  let total = 0;

  filtrados.forEach(p => {
    total += p.valor;
    porForma[p.forma] = (porForma[p.forma] ?? 0) + p.valor;
  });

  return { total, porForma, pagamentos: filtrados };
}

/**
 * Retorna o total recebido no mês corrente.
 * @returns {Promise<number>}
 */
export async function totalMesAtual() {
  const agora  = new Date();
  const inicio = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-01`;
  const fim    = new Date().toISOString().slice(0, 10);
  const res    = await resumoFinanceiro(inicio, fim);
  return res.total;
}
