// storage/agenda.js — Persistência de Agenda
// Ceará Planejados — Vidraçaria
//
// Cada evento contém:
//   id         : gerado automaticamente
//   tipo       : 'Medição' | 'Instalação' | 'Entrega' | 'Visita' | 'Outro'
//   cliente    : string
//   local      : string
//   data       : string ISO (YYYY-MM-DD)
//   hora       : string HH:MM
//   status     : 'confirmado' | 'pendente' | 'cancelado' | 'concluido'
//   obs        : string (opcional)
//   clienteId  : number | null (ref ao store clientes)
//   criadoEm  : ISO string

import { dbAdd, dbGet, dbGetAll, dbUpdate, dbRemove, dbGetByIndex } from './db';

const STORE = 'agenda';

// ─────────────────────────────────────────────
// Tipos e status disponíveis (para selects)
// ─────────────────────────────────────────────

export const TIPOS_EVENTO  = ['Medição', 'Instalação', 'Entrega', 'Visita', 'Outro'];
export const STATUS_EVENTO = ['pendente', 'confirmado', 'concluido', 'cancelado'];

// ─────────────────────────────────────────────
// Salvar
// ─────────────────────────────────────────────

/**
 * Cadastra um novo evento na agenda. Retorna o id gerado.
 *
 * @param {{
 *   tipo: string,
 *   cliente: string,
 *   local: string,
 *   data: string,
 *   hora: string,
 *   status?: string,
 *   obs?: string,
 *   clienteId?: number
 * }} dados
 * @returns {Promise<number>} id
 */
export async function salvarEvento(dados) {
  if (!dados.data || !dados.cliente) {
    throw new Error('Data e cliente são obrigatórios para o evento.');
  }

  const registro = {
    tipo:      dados.tipo      ?? 'Outro',
    cliente:   dados.cliente.trim(),
    local:     dados.local?.trim()  ?? '',
    data:      dados.data,           // YYYY-MM-DD
    hora:      dados.hora     ?? '08:00',
    status:    dados.status   ?? 'pendente',
    obs:       dados.obs?.trim()    ?? '',
    clienteId: dados.clienteId      ?? null,
    criadoEm: new Date().toISOString(),
  };

  return dbAdd(STORE, registro);
}

// ─────────────────────────────────────────────
// Leitura
// ─────────────────────────────────────────────

/**
 * Retorna todos os eventos ordenados por data/hora crescente.
 * @returns {Promise<Array>}
 */
export async function listarEventos() {
  const todos = await dbGetAll(STORE);
  return todos.sort((a, b) => {
    const da = `${a.data}T${a.hora}`;
    const db = `${b.data}T${b.hora}`;
    return da.localeCompare(db);
  });
}

/**
 * Retorna um evento pelo id.
 * @param {number} id
 */
export async function buscarEvento(id) {
  return dbGet(STORE, id);
}

/**
 * Retorna eventos de hoje.
 * @returns {Promise<Array>}
 */
export async function eventosHoje() {
  const hoje = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return dbGetByIndex(STORE, 'por_data', hoje);
}

/**
 * Retorna eventos futuros (a partir de hoje), ordenados.
 * @returns {Promise<Array>}
 */
export async function eventosFuturos() {
  const todos = await listarEventos();
  const hoje  = new Date().toISOString().slice(0, 10);
  return todos.filter(e => e.data >= hoje && e.status !== 'cancelado');
}

/**
 * Retorna eventos de um período específico.
 * @param {string} dataInicio YYYY-MM-DD
 * @param {string} dataFim    YYYY-MM-DD
 */
export async function eventosPorPeriodo(dataInicio, dataFim) {
  const todos = await listarEventos();
  return todos.filter(e => e.data >= dataInicio && e.data <= dataFim);
}

/**
 * Retorna eventos por status.
 * @param {'pendente'|'confirmado'|'concluido'|'cancelado'} status
 */
export async function eventosPorStatus(status) {
  return dbGetByIndex(STORE, 'por_status', status);
}

// ─────────────────────────────────────────────
// Atualizar
// ─────────────────────────────────────────────

/**
 * Atualiza um evento existente (deve conter o campo id).
 * @param {object} evento
 */
export async function atualizarEvento(evento) {
  return dbUpdate(STORE, { ...evento, atualizadoEm: new Date().toISOString() });
}

/**
 * Atalho: muda apenas o status de um evento.
 * @param {number} id
 * @param {'pendente'|'confirmado'|'concluido'|'cancelado'} novoStatus
 */
export async function atualizarStatusEvento(id, novoStatus) {
  const evento = await dbGet(STORE, id);
  if (!evento) throw new Error(`Evento id=${id} não encontrado.`);
  return dbUpdate(STORE, { ...evento, status: novoStatus, atualizadoEm: new Date().toISOString() });
}

// ─────────────────────────────────────────────
// Remover
// ─────────────────────────────────────────────

/**
 * Remove um evento pelo id.
 * @param {number} id
 */
export async function removerEvento(id) {
  return dbRemove(STORE, id);
}

// ─────────────────────────────────────────────
// Resumo para Dashboard
// ─────────────────────────────────────────────

/**
 * Retorna contagem por status (útil para badge de alertas).
 * @returns {Promise<{ pendentes: number, confirmados: number, hoje: number }>}
 */
export async function resumoAgenda() {
  const todos = await dbGetAll(STORE);
  const hoje  = new Date().toISOString().slice(0, 10);

  return {
    pendentes:   todos.filter(e => e.status === 'pendente').length,
    confirmados: todos.filter(e => e.status === 'confirmado').length,
    hoje:        todos.filter(e => e.data === hoje).length,
  };
}
