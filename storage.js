// storage/storage.js — Barrel + Hooks de Storage
// Ceará Planejados — Vidraçaria
//
// Ponto único de importação para todo o sistema de armazenamento:
//
//   import { salvarOrcamento, listarClientes, ... } from './storage/storage';
//
// Também exporta:
//   useStorage(fn, deps)  → hook React para carregar dados assíncronos
//   baixarBackup()        → gera e faz download de backup JSON
//   restaurarBackup(file) → restaura backup de um File JSON

// ── Re-exports por módulo ─────────────────────
export * from './orcamentos';
export * from './clientes';
export * from './agenda';
export * from './financeiro';
export { exportarBackup, importarBackup, getDB } from './db';

// ─────────────────────────────────────────────
// Hook: useStorage
// ─────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook genérico para carregar dados do IndexedDB em um componente React.
 *
 * @param {Function} fn        - função assíncrona que retorna os dados
 * @param {Array}    deps      - dependências (re-executa fn quando mudam)
 * @returns {{ dados, carregando, erro, recarregar }}
 *
 * Exemplo:
 *   const { dados: orcamentos, carregando } = useStorage(listarOrcamentos, []);
 */
export function useStorage(fn, deps = []) {
  const [dados,      setDados]      = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro,       setErro]       = useState(null);

  const executar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const resultado = await fn();
      setDados(resultado);
    } catch (e) {
      console.error('[useStorage] Erro:', e);
      setErro(e.message ?? 'Erro ao carregar dados.');
    } finally {
      setCarregando(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { executar(); }, [executar]);

  return { dados, carregando, erro, recarregar: executar };
}

// ─────────────────────────────────────────────
// Backup: download JSON
// ─────────────────────────────────────────────
import { exportarBackup, importarBackup } from './db';

/**
 * Gera e faz download automático de um backup JSON completo.
 * Chame no clique de um botão "Exportar Backup".
 */
export async function baixarBackup() {
  const backup = await exportarBackup();
  const json   = JSON.stringify(backup, null, 2);
  const blob   = new Blob([json], { type: 'application/json' });
  const url    = URL.createObjectURL(blob);

  const data   = new Date().toISOString().slice(0, 10);
  const anchor = document.createElement('a');
  anchor.href     = url;
  anchor.download = `cear-backup-${data}.json`;
  anchor.click();

  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/**
 * Restaura um backup a partir de um objeto File (input type="file").
 * Sobrescreve todos os dados existentes.
 *
 * @param {File} arquivo
 * @returns {Promise<void>}
 *
 * Exemplo no componente:
 *   <input type="file" accept=".json"
 *     onChange={e => restaurarBackup(e.target.files[0])} />
 */
export async function restaurarBackup(arquivo) {
  if (!arquivo) throw new Error('Nenhum arquivo selecionado.');

  const texto  = await arquivo.text();
  const backup = JSON.parse(texto);

  if (!backup._versao) {
    throw new Error('Arquivo inválido: não parece ser um backup do Ceará Planejados.');
  }

  await importarBackup(backup);
}

// ─────────────────────────────────────────────
// Checagem de suporte
// ─────────────────────────────────────────────

/**
 * Retorna true se o browser suporta IndexedDB.
 * Use para mostrar aviso ao usuário se necessário.
 */
export function indexedDBSuportado() {
  return typeof indexedDB !== 'undefined';
}
