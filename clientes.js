// storage/clientes.js — Persistência de Clientes
// Ceará Planejados — Vidraçaria
//
// Cada cliente contém:
//   id         : gerado automaticamente
//   nome       : string (obrigatório)
//   fone       : string no formato "(85) 9XXXX-XXXX"
//   email      : string (opcional)
//   endereco   : string (opcional)
//   obs        : string (observações gerais, opcional)
//   criadoEm  : ISO string

import { dbAdd, dbGet, dbGetAll, dbUpdate, dbRemove } from './db';

const STORE = 'clientes';

// ─────────────────────────────────────────────
// Validação interna
// ─────────────────────────────────────────────

function validar(dados) {
  if (!dados.nome || dados.nome.trim().length < 2) {
    throw new Error('Nome do cliente é obrigatório (mínimo 2 caracteres).');
  }
}

// ─────────────────────────────────────────────
// Salvar
// ─────────────────────────────────────────────

/**
 * Cadastra um novo cliente. Retorna o id gerado.
 *
 * @param {{
 *   nome: string,
 *   fone?: string,
 *   email?: string,
 *   endereco?: string,
 *   obs?: string
 * }} dados
 * @returns {Promise<number>} id
 */
export async function salvarCliente(dados) {
  validar(dados);
  const registro = {
    nome:      dados.nome.trim(),
    fone:      dados.fone?.trim()     ?? '',
    email:     dados.email?.trim()    ?? '',
    endereco:  dados.endereco?.trim() ?? '',
    obs:       dados.obs?.trim()      ?? '',
    criadoEm: new Date().toISOString(),
  };
  return dbAdd(STORE, registro);
}

// ─────────────────────────────────────────────
// Leitura
// ─────────────────────────────────────────────

/**
 * Retorna todos os clientes em ordem alfabética.
 * @returns {Promise<Array>}
 */
export async function listarClientes() {
  const todos = await dbGetAll(STORE);
  return todos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

/**
 * Retorna um cliente pelo id.
 * @param {number} id
 */
export async function buscarCliente(id) {
  return dbGet(STORE, id);
}

/**
 * Busca clientes por nome ou telefone (busca parcial).
 * @param {string} termo
 * @returns {Promise<Array>}
 */
export async function pesquisarClientes(termo) {
  if (!termo || termo.trim().length === 0) return listarClientes();

  const t    = termo.toLowerCase().trim();
  const todos = await listarClientes();

  return todos.filter(c =>
    c.nome.toLowerCase().includes(t) ||
    c.fone.includes(t) ||
    c.email.toLowerCase().includes(t)
  );
}

// ─────────────────────────────────────────────
// Atualizar / Remover
// ─────────────────────────────────────────────

/**
 * Atualiza os dados de um cliente existente (deve conter o campo id).
 * @param {object} cliente
 */
export async function atualizarCliente(cliente) {
  validar(cliente);
  return dbUpdate(STORE, { ...cliente, atualizadoEm: new Date().toISOString() });
}

/**
 * Remove um cliente pelo id.
 * @param {number} id
 */
export async function removerCliente(id) {
  return dbRemove(STORE, id);
}

// ─────────────────────────────────────────────
// Vincular orçamento ao cliente (desnormalizado)
// ─────────────────────────────────────────────

/**
 * Registra um orçamento no histórico do cliente.
 * Adiciona o id do orçamento ao array cliente.orcamentos[].
 *
 * @param {number} clienteId
 * @param {number} orcamentoId
 * @param {object} resumo - { tipo, total, data }
 */
export async function vincularOrcamento(clienteId, orcamentoId, resumo) {
  const cliente = await dbGet(STORE, clienteId);
  if (!cliente) throw new Error(`Cliente id=${clienteId} não encontrado.`);

  const historico = cliente.orcamentos ?? [];
  historico.unshift({ orcamentoId, ...resumo }); // mais recente primeiro

  return dbUpdate(STORE, { ...cliente, orcamentos: historico });
}

// ─────────────────────────────────────────────
// Estatísticas
// ─────────────────────────────────────────────

/**
 * Retorna contagem total de clientes.
 * @returns {Promise<number>}
 */
export async function totalClientes() {
  const todos = await dbGetAll(STORE);
  return todos.length;
}
