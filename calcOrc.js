// utils/calcOrc.js — Lógica de cálculo do orçamento
// Ceará Planejados — Vidraçaria
// Extraído do script inline do HTML original para módulo reutilizável.

import { VIDROS, ACESSORIOS_CONFIG, FRETE_GRATIS_KM, FRETE_POR_KM_EXTRA, DESCONTO_AVISTA } from '../data/precos';

/**
 * Calcula o orçamento completo.
 * @param {{ tipo, larg, alt, vidro, accs, km }} params
 * @returns {{ linhas: Array<{nome, valor}>, total: number, totalAvista: number }}
 */
export function calcularOrcamento({ tipo, larg, alt, vidro, accs, km }) {
  const linhas = [];
  let total = 0;
  let descontoAvistaBase = 0;

  if (!larg || !alt || isNaN(larg) || isNaN(alt)) {
    return null;
  }

  const area   = (larg / 100) * (alt / 100);
  const perim  = 2 * ((larg / 100) + (alt / 100));
  const vidroObj = VIDROS[vidro];

  // ── Vidro ──────────────────────────────────────
  if (vidroObj) {
    const val = area * vidroObj.preco;
    linhas.push({ nome: vidroObj.nome, valor: val });
    total += val;
    if (vidroObj.temperado) descontoAvistaBase += val * DESCONTO_AVISTA;
  }

  // ── Kits / ferragens ───────────────────────────
  const accConfig = ACESSORIOS_CONFIG[tipo] || [];
  accConfig.forEach(a => {
    const ativo = accs[a.id] ?? a.obrig;
    if (!ativo) return;

    let val = 0;
    if (a.preco !== null && a.preco !== undefined) {
      val = a.preco;
    } else {
      // Preços calculados automaticamente
      if (tipo === 'correr')  val = area * 100;
      if (tipo === 'janela')  val = (larg / 100) * 100;
      if (tipo === 'box')     val = area * 120;
      if (tipo === 'espelho' && a.id === 'botoes') val = larg >= 60 ? 4 * 15 : 0;
      if (tipo === 'comum'   && a.id === 'recorte') val = area * 10;
    }

    linhas.push({ nome: a.nome, valor: val });
    total += val;
  });

  // ── Frete ──────────────────────────────────────
  const kmNum = parseFloat(km) || 0;
  let frete = 0;
  if (kmNum > FRETE_GRATIS_KM) {
    frete = (kmNum - FRETE_GRATIS_KM) * FRETE_POR_KM_EXTRA;
  }
  linhas.push({ nome: `Frete (${kmNum} km)`, valor: frete });
  total += frete;

  const totalAvista = total - descontoAvistaBase;

  return { linhas, total, totalAvista };
}

/**
 * Formata valor em BRL.
 */
export function formatBRL(val) {
  return 'R$ ' + Number(val).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

/**
 * Gera texto formatado para WhatsApp.
 */
export function gerarTextoWpp({ cliente, tipo, larg, alt, vidro, resultado }) {
  if (!resultado) return '';
  const vidroObj = VIDROS[vidro];
  const now = new Date();
  const dataStr = now.toLocaleDateString('pt-BR');

  let txt = `*Orçamento — Ceará Planejados*\n`;
  txt += `📅 ${dataStr}\n`;
  if (cliente) txt += `👤 Cliente: ${cliente}\n`;
  txt += `\n`;
  txt += `📦 Produto: *${labelTipo(tipo)}*\n`;
  txt += `📐 Medidas: ${larg} x ${alt} cm\n`;
  if (vidroObj) txt += `🔷 Vidro: ${vidroObj.nome}\n`;
  txt += `\n`;
  txt += `*Composição:*\n`;
  resultado.linhas.forEach(l => {
    txt += `• ${l.nome}: ${formatBRL(l.valor)}\n`;
  });
  txt += `\n`;
  txt += `💰 *Total: ${formatBRL(resultado.total)}*\n`;
  txt += `💚 À vista (10% off): *${formatBRL(resultado.totalAvista)}*\n`;
  txt += `\n_Orçamento gerado pelo app Ceará Planejados_`;

  return txt;
}

function labelTipo(tipo) {
  const map = {
    pivotante: 'Porta Pivotante', correr: 'Porta de Correr',
    janela: 'Janela', box: 'Box de Banheiro',
    espelho: 'Espelho', comum: 'Vidro Comum',
    basculante: 'Basculante', guarda: 'Guarda Corpo',
  };
  return map[tipo] || tipo;
}
