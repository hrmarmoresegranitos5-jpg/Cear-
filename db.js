// storage/db.js — Núcleo do IndexedDB
// Ceará Planejados — Vidraçaria
//
// Responsabilidades:
//   - Abrir / criar o banco "CearPlanejados"
//   - Definir os object stores (tabelas) e índices
//   - Expor helpers genéricos de CRUD (add, get, getAll, update, remove, clear)
//
// NÃO importar diretamente nas páginas — usar os módulos específicos:
//   orcamentosDB  → storage/orcamentos.js
//   clientesDB    → storage/clientes.js
//   agendaDB      → storage/agenda.js
//   financeiroDb  → storage/financeiro.js

// ─────────────────────────────────────────────
// Configuração do banco
// ─────────────────────────────────────────────
const DB_NAME    = 'CearPlanejados';
const DB_VERSION = 1;

/**
 * Schema do banco — cada entrada define um object store.
 *
 * keyPath    : campo que serve de chave primária
 * autoIncrement: gera id automático se true
 * indexes    : índices secundários para buscas eficientes
 */
const SCHEMA = [
  {
    store: 'orcamentos',
    options: { keyPath: 'id', autoIncrement: true },
    indexes: [
      { name: 'por_data',    keyPath: 'criadoEm',    unique: false },
      { name: 'por_cliente', keyPath: 'clienteNome', unique: false },
      { name: 'por_tipo',    keyPath: 'tipo',         unique: false },
    ],
  },
  {
    store: 'clientes',
    options: { keyPath: 'id', autoIncrement: true },
    indexes: [
      { name: 'por_nome', keyPath: 'nome', unique: false },
      { name: 'por_fone', keyPath: 'fone', unique: false },
    ],
  },
  {
    store: 'agenda',
    options: { keyPath: 'id', autoIncrement: true },
    indexes: [
      { name: 'por_data',   keyPath: 'data',   unique: false },
      { name: 'por_status', keyPath: 'status', unique: false },
    ],
  },
  {
    store: 'financeiro',
    options: { keyPath: 'chave' }, // chave manual: 'precos', 'config', etc.
    indexes: [],
  },
  {
    store: 'configuracoes',
    options: { keyPath: 'chave' }, // chave manual: 'empresa', 'margens', etc.
    indexes: [],
  },
];

// ─────────────────────────────────────────────
// Singleton: promise da conexão aberta
// ─────────────────────────────────────────────
let _dbPromise = null;

/**
 * Retorna a conexão aberta com o banco (singleton).
 * @returns {Promise<IDBDatabase>}
 */
export function getDB() {
  if (_dbPromise) return _dbPromise;

  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (event) => {
      const db = event.target.result;

      SCHEMA.forEach(({ store, options, indexes }) => {
        // Cria o store se ainda não existe
        if (!db.objectStoreNames.contains(store)) {
          const os = db.createObjectStore(store, options);
          indexes.forEach(({ name, keyPath, unique }) => {
            os.createIndex(name, keyPath, { unique });
          });
        }
      });
    };

    req.onsuccess  = (e) => resolve(e.target.result);
    req.onerror    = (e) => {
      console.error('[CearDB] Erro ao abrir banco:', e.target.error);
      reject(e.target.error);
    };
    req.onblocked  = () => {
      console.warn('[CearDB] Banco bloqueado — feche outras abas do app.');
    };
  });

  return _dbPromise;
}

// ─────────────────────────────────────────────
// Helpers genéricos de transação
// ─────────────────────────────────────────────

/**
 * Executa uma operação dentro de uma transação e retorna Promise.
 * @param {string}   storeName
 * @param {'readonly'|'readwrite'} mode
 * @param {Function} fn  - recebe (store) e retorna IDBRequest
 */
async function tx(storeName, mode, fn) {
  const db    = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, mode);
    const store       = transaction.objectStore(storeName);
    const req         = fn(store);

    if (req) {
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror   = (e) => reject(e.target.error);
    } else {
      transaction.oncomplete = () => resolve();
      transaction.onerror    = (e) => reject(e.target.error);
    }
  });
}

// ─────────────────────────────────────────────
// CRUD genérico
// ─────────────────────────────────────────────

/** Adiciona um registro. Retorna o id gerado. */
export async function dbAdd(storeName, data) {
  return tx(storeName, 'readwrite', (store) => store.add(data));
}

/** Lê um registro pelo id/chave. */
export async function dbGet(storeName, key) {
  return tx(storeName, 'readonly', (store) => store.get(key));
}

/** Lê todos os registros de um store. */
export async function dbGetAll(storeName) {
  return tx(storeName, 'readonly', (store) => store.getAll());
}

/** Atualiza (put) um registro — substitui se a chave já existe. */
export async function dbUpdate(storeName, data) {
  return tx(storeName, 'readwrite', (store) => store.put(data));
}

/** Remove um registro pelo id/chave. */
export async function dbRemove(storeName, key) {
  return tx(storeName, 'readwrite', (store) => store.delete(key));
}

/** Remove todos os registros de um store. */
export async function dbClear(storeName) {
  return tx(storeName, 'readwrite', (store) => store.clear());
}

/**
 * Busca registros usando um índice secundário.
 * @param {string} storeName
 * @param {string} indexName  - nome do índice (ver SCHEMA)
 * @param {*}      value      - valor exato a buscar
 */
export async function dbGetByIndex(storeName, indexName, value) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store       = transaction.objectStore(storeName);
    const index       = store.index(indexName);
    const req         = index.getAll(value);
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror   = (e) => reject(e.target.error);
  });
}

// ─────────────────────────────────────────────
// Utilitário: exportar tudo (backup)
// ─────────────────────────────────────────────

/**
 * Exporta todos os stores como objeto JSON.
 * @returns {Promise<object>} ex: { orcamentos: [...], clientes: [...] }
 */
export async function exportarBackup() {
  const stores = SCHEMA.map(s => s.store);
  const backup = { _versao: DB_VERSION, _exportadoEm: new Date().toISOString() };

  for (const nome of stores) {
    backup[nome] = await dbGetAll(nome);
  }

  return backup;
}

/**
 * Importa um backup completo (sobrescreve os dados existentes).
 * @param {object} backup - objeto gerado por exportarBackup()
 */
export async function importarBackup(backup) {
  const stores = SCHEMA.map(s => s.store);

  for (const nome of stores) {
    if (!Array.isArray(backup[nome])) continue;
    await dbClear(nome);
    for (const item of backup[nome]) {
      await dbUpdate(nome, item);
    }
  }
}
