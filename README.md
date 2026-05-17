# Ceará Planejados — Estrutura do Projeto

Sistema de orçamento e gestão para vidraçaria/marcenaria.

## Estrutura — ETAPA 1 (separação de páginas)

```
src/
├── App.jsx                    ← Orquestrador: shell, nav, roteamento
│
├── pages/
│   ├── dashboard.jsx          ← Página Inicial (atalhos de orçamento + infos)
│   ├── orcamentos.jsx         ← Calculadora de Orçamento + CAD Preview
│   ├── financeiro.jsx         ← Tabela de Preços (ex-"Preços")
│   ├── agenda.jsx             ← Agenda de visitas/instalações (stub)
│   ├── clientes.jsx           ← Cadastro de clientes (stub)
│   └── configuracoes.jsx      ← Sobre a empresa + futuras configs (ex-"Sobre")
│
├── data/
│   └── precos.js              ← VIDROS, ACESSORIOS_CONFIG, constantes de frete
│
└── utils/
    ├── calcOrc.js             ← calcularOrcamento(), formatBRL(), gerarTextoWpp()
    └── cad.js                 ← renderCAD() — desenho técnico SVG
```

## O que foi feito na ETAPA 1

- **Separação de páginas**: cada tela tem seu próprio arquivo `.jsx`
- **App.jsx limpo**: só gerencia estado de navegação e renderiza a página ativa
- **Dados centralizados**: `data/precos.js` é fonte única para preços e acessórios
- **Utilitários extraídos**: lógica de cálculo e CAD fora das páginas
- **Stubs preparados**: `agenda.jsx` e `clientes.jsx` têm UI inicial com dados mock

## Próximas etapas sugeridas

- **ETAPA 2**: Componentização (NavBar, Header, OrcCard como componentes isolados)
- **ETAPA 3**: Persistência de dados (localStorage ou API)
- **ETAPA 4**: Implementação real de Agenda e Clientes
- **ETAPA 5**: Modo admin / configurações editáveis

## Como rodar

```bash
# Instalar dependências (Vite + React)
npm create vite@latest . -- --template react
npm install

# Copiar os arquivos src/ para dentro do projeto
npm run dev
```
