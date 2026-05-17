// data/precos.js — Tabela de preços e configuração de acessórios
// Ceará Planejados — Vidraçaria
// Fonte única de verdade: importar de aqui em qualquer página que precisar.

export const VIDROS = {
  temp_trans: { nome: 'Transparente 8mm (Temp.)', preco: 420,  temperado: true  },
  temp_fume:  { nome: 'Fumê 8mm (Temp.)',         preco: 455,  temperado: true  },
  temp_serig: { nome: 'Serigrafado 8mm (Temp.)',  preco: 650,  temperado: true  },
  temp_jat:   { nome: 'Jateado 8mm (Temp.)',      preco: 440,  temperado: true  },
  temp_esp:   { nome: 'Espelhado 8mm (Temp.)',    preco: 620,  temperado: true  },
  com_4:      { nome: 'Incolor 4mm',              preco: 220,  temperado: false },
  com_6:      { nome: 'Incolor 6mm',              preco: 240,  temperado: false },
  com_fume3:  { nome: 'Fumê 3mm',                 preco: 210,  temperado: false },
  com_fume4:  { nome: 'Fumê 4mm',                 preco: 245,  temperado: false },
  esp_3:      { nome: 'Espelho 3mm',              preco: 260,  temperado: false },
  esp_4:      { nome: 'Espelho 4mm',              preco: 280,  temperado: false },
};

export const ACESSORIOS_CONFIG = {
  pivotante: [
    { id: 'kit',      nome: 'Kit Pivotante',    preco: 150,  obrig: true  },
    { id: 'puxador',  nome: 'Puxador',          preco: 100,  obrig: false },
    { id: 'fixador',  nome: 'Fixador',          preco: 60,   obrig: false },
  ],
  correr: [
    { id: 'kit',      nome: 'Kit Porta de Correr', preco: null, obrig: true, desc: 'calculado por m²' },
    { id: 'fechadura',nome: 'Fechadura VP',         preco: 150,  obrig: true  },
    { id: 'puxador',  nome: 'Puxador',              preco: 100,  obrig: true  },
  ],
  janela: [
    { id: 'kit',  nome: 'Kit Janela',     preco: null, obrig: true, desc: 'calculado por largura' },
    { id: 'bate', nome: 'Bate-fecha VP',  preco: 50,   obrig: true  },
  ],
  basculante: [
    { id: 'kit', nome: 'Kit Basculante', preco: 150, obrig: true },
  ],
  box: [
    { id: 'kit', nome: 'Kit Box', preco: null, obrig: true, desc: 'calculado por m²' },
  ],
  espelho: [
    { id: 'botoes', nome: 'Botões (≥60cm larg.)',   preco: null, obrig: false, desc: 'automático' },
    { id: 'colado', nome: 'Fixação Colada (sem botão)', preco: 0, obrig: false },
  ],
  comum: [
    { id: 'recorte', nome: 'Recorte (+R$10/m²)', preco: null, obrig: false },
  ],
  guarda: [],
};

// Frete
export const FRETE_GRATIS_KM = 20;
export const FRETE_POR_KM_EXTRA = 3; // R$/km acima de 20km

// Descontos
export const DESCONTO_AVISTA = 0.10; // 10%
