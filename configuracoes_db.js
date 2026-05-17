// storage/configuracoes_db.js — Persistência de Configurações da Empresa
// Ceará Planejados — Vidraçaria
//
// Salva as configurações editáveis do app:
//   empresa   → nome, telefone, endereço, logo (base64)
//   margens   → markup aplicado sobre os preços
//   app       → tema, preferências de exibição
//
// Todas as chaves ficam no store 'configuracoes' do IndexedDB.

import { dbGet, dbUpdate } from './db';

const STORE = 'configuracoes';

// ─────────────────────────────────────────────
// Defaults
// ─────────────────────────────────────────────

const DEFAULT_EMPRESA = {
  nome:      'Ceará Planejados',
  sub:       'Vidraçaria · Marcenaria · Serralheria',
  telefone:  '(85) 9 9999-9999',
  whatsapp:  '5585999999999',
  endereco:  '',
  cidade:    'Fortaleza – CE',
  email:     '',
  logo:      '',           // base64 ou URL
  horario:   'Seg–Sex 8h–18h · Sáb 8h–13h',
  freteInfo: 'Grátis até 20 km · Acima sob consulta',
};

const DEFAULT_MARGENS = {
  markup: 0,    // percentual adicional sobre o preço base (0 = sem markup extra)
};

const DEFAULT_APP = {
  tema:           'dark',   // 'dark' | 'light' (futuro)
  exibirCAD:      true,
  confirmarEnvio: true,     // pedir confirmação antes de abrir WhatsApp
};

// ─────────────────────────────────────────────
// Empresa
// ─────────────────────────────────────────────

/**
 * Retorna as configurações da empresa (mescla com defaults).
 * @returns {Promise<typeof DEFAULT_EMPRESA>}
 */
export async function getEmpresa() {
  const salvo = await dbGet(STORE, 'empresa');
  return { ...DEFAULT_EMPRESA, ...(salvo?.dados ?? {}) };
}

/**
 * Salva as configurações da empresa.
 * @param {Partial<typeof DEFAULT_EMPRESA>} dados
 */
export async function salvarEmpresa(dados) {
  const atual = await getEmpresa();
  return dbUpdate(STORE, {
    chave:       'empresa',
    dados:       { ...atual, ...dados },
    atualizadoEm: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────
// Margens
// ─────────────────────────────────────────────

/**
 * Retorna as configurações de margem.
 * @returns {Promise<typeof DEFAULT_MARGENS>}
 */
export async function getMargens() {
  const salvo = await dbGet(STORE, 'margens');
  return { ...DEFAULT_MARGENS, ...(salvo?.dados ?? {}) };
}

/**
 * Salva as configurações de margem.
 * @param {{ markup: number }} dados
 */
export async function salvarMargens(dados) {
  return dbUpdate(STORE, {
    chave:       'margens',
    dados,
    atualizadoEm: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────
// Configurações do App
// ─────────────────────────────────────────────

/**
 * Retorna as preferências do app.
 * @returns {Promise<typeof DEFAULT_APP>}
 */
export async function getConfigApp() {
  const salvo = await dbGet(STORE, 'app');
  return { ...DEFAULT_APP, ...(salvo?.dados ?? {}) };
}

/**
 * Salva as preferências do app.
 * @param {Partial<typeof DEFAULT_APP>} dados
 */
export async function salvarConfigApp(dados) {
  const atual = await getConfigApp();
  return dbUpdate(STORE, {
    chave:       'app',
    dados:       { ...atual, ...dados },
    atualizadoEm: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────
// Logo (base64)
// ─────────────────────────────────────────────

/**
 * Salva o logo como string base64.
 * @param {string} base64
 */
export async function salvarLogo(base64) {
  const empresa = await getEmpresa();
  return salvarEmpresa({ ...empresa, logo: base64 });
}

/**
 * Lê o logo salvo (string base64 ou '').
 * @returns {Promise<string>}
 */
export async function getLogo() {
  const empresa = await getEmpresa();
  return empresa.logo ?? '';
}

/**
 * Converte um File de imagem para base64 e salva como logo.
 * @param {File} arquivo
 */
export async function salvarLogoDeArquivo(arquivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = async (e) => {
      await salvarLogo(e.target.result);
      resolve(e.target.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(arquivo);
  });
}
