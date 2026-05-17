# Ceará Planejados — PWA

Sistema de orçamento para Vidraçaria · Marcenaria · Serralheria.

## Etapas concluídas

| Etapa | Foco                   | Status |
|-------|------------------------|--------|
| 1–5   | Funcionalidades core   | ✅     |
| 6     | PWA (installable)      | ✅     |
| 7     | Performance            | ✅     |
| 8     | Visual Premium (nativo)| ✅     |

## Etapa 8 — Visual Premium

### Objetivo
Fazer o app parecer um aplicativo nativo premium — eliminar aparência de browser.

### Melhorias implementadas

**Splash Screen**
- Halo de luz animado por trás do ícone
- Shimmer dourado no ícone (reflexo de luz)
- Saída com blur + scale (como apps nativos)
- Barra de progresso com gradiente animado
- Fonte Outfit carregada na splash

**App Shell**
- Fonte Outfit em toda a UI (substitui system-font genérica)
- CSS Variables centralizadas e expandidas
- `overscroll-behavior: none` — sem bounce de browser
- `user-select: none` — sem seleção acidental de texto
- Scrollbar oculta nas páginas

**Header**
- Glassmorphism com `backdrop-filter: blur(20px)`
- Borda inferior com gradiente dourado (não mais linha sólida)
- Ícone/logo com glow dourado e active state
- Mais altura e hierarquia visual

**Navegação (NavBar)**
- Glassmorphism: `backdrop-filter: blur(24px)`
- Borda superior com gradiente (não mais linha sólida)
- Item ativo: pill de fundo dourado sutil
- Ícone ativo: cresce com animação spring (navIconPop)
- Ponto indicador animado acima do item ativo
- Botão CTA "Orçamento" com gradiente e sombra dourada
- `touch-action: manipulation` — sem delay 300ms no iOS

**Transições de página**
- Cada troca de aba dispara `pageEnter` (slide + fade + scale)
- `key={pageKey}` garante re-mount e nova animação a cada navegação
- Durations reduzidos para parecer mais responsivo

**Tela Inicial (Dashboard)**
- Banner hero com gradiente em camadas e detalhe circular decorativo
- Badge "Aberto" com ponto verde pulsante
- Ícones dos atalhos com cor individual por categoria
- Ícones de informações com caixas coloridas por tipo
- Entrada escalonada: cada item entra com delay progressivo

## Dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
