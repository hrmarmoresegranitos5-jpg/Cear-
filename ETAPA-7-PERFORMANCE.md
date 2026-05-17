# ETAPA 7 — Performance & Otimização

## Objetivo
Deixar o app leve, rápido e fluido igual aplicativo profissional.

---

## O que foi feito

### 1. Lazy Loading de Páginas (`App.jsx`)
- Cada página agora usa `lazy(() => import(...))` + `<Suspense>`
- O JS de cada tela só é baixado quando o usuário navega até ela
- Resultado: bundle inicial **muito menor** → app abre mais rápido no celular

```jsx
const Dashboard  = lazy(() => import('./pages/dashboard'));
const Orcamentos = lazy(() => import('./pages/orcamentos'));
// ...
<Suspense fallback={<PageLoader />}>{renderPagina()}</Suspense>
```

---

### 2. `memo()` em todos os componentes e sub-componentes
- `App.jsx`: `Header` e `NavBar` memoizados — só re-renderizam quando realmente mudam
- `dashboard.jsx`: `AtalhoBtn`, `InfoRow`, `Dashboard` todos com `memo()`
- `clientes.jsx`: `ClienteCard` com `memo()` — lista não repinta sem mudança
- `agenda.jsx`: `EventoCard` com `memo()`
- `financeiro.jsx`: `TabelaSection` com `memo()`
- `configuracoes.jsx`: componente raiz com `memo()`

---

### 3. `useCallback` para callbacks estáveis
- `navTo`, `goHome`, `handleSetTipo` em `App.jsx`
- `handleAtalho` em `Dashboard`
- `abrirWpp` em `Clientes` e `Configuracoes`
- Evita que componentes filhos recebam novas referências de função a cada render

---

### 4. `useMemo` para computações derivadas
- `sharedProps` em `App.jsx` — objeto de props compartilhadas não é recriado
- `filtrados` em `Clientes` — filtro da lista só roda quando `busca` muda

---

### 5. Dados estáticos fora dos componentes
- Arrays de atalhos, infos, serviços, eventos alocados uma vez no módulo
- Nunca recriados durante renders
- Afeta: `dashboard.jsx`, `financeiro.jsx`, `agenda.jsx`, `configuracoes.jsx`

---

### 6. `injectAnimations()` movido para fora do ciclo React
- Antes estava em `useEffect` dentro do componente
- Agora é chamado no nível do módulo → executa **uma vez, antes do React montar**
- Elimina um efeito e uma comparação de dependências

---

### 7. `dataHdr` virou constante (sem estado)
- Antes: `useState` + `useEffect` recalculando a data no mount
- Agora: `const DATA_HDR = getDataHdr()` calculado uma vez na carga do módulo
- Elimina um `useState` e um `useEffect` do componente raiz

---

### 8. Animações GPU-friendly (`animations.js`)
- Keyframes agora usam apenas `transform` e `opacity` (composited layers)
- Shimmer usa `transform: translateX()` ao invés de `background-position`
- `will-change: transform` e `will-change: opacity` onde necessário
- `touch-action: manipulation` nos elementos clicáveis → elimina delay de 300ms no iOS
- `-webkit-tap-highlight-color: transparent` → sem flash azul ao tocar
- `prefers-reduced-motion`: desativa todas as animações para usuários com essa preferência
- Durações reduzidas: fast=100ms, normal=180ms, slow=280ms (era 140/220/360ms)

---

### 9. Vite config otimizado (`vite.config.js`)
- `manualChunks`: cada página em seu próprio chunk JS
  - `vendor-react` → React + ReactDOM (cache longa duração)
  - `page-home`, `page-orc`, `page-fin`, etc. → carregados sob demanda
  - `storage` → código de IndexedDB separado
- `cssCodeSplit: true` → CSS de cada página só carrega quando visitada
- `assetsInlineLimit: 4096` → assets < 4KB viram base64 (menos requests HTTP)
- `minify: 'terser'` com `passes: 2` → compressão mais agressiva
- `drop_console: true` → remove todos os `console.log` do bundle de produção
- `mangle: { safari10: true }` → compatibilidade iOS 10+

---

### 10. `index.html` performance hints
- `<link rel="dns-prefetch">` e `<link rel="preconnect">` para fontes
- `<meta name="color-scheme" content="dark">` → evita flash branco no carregamento
- `will-change: transform` + `translateZ(0)` no `#nav` e `#hdr` → força GPU layer nos elementos fixos
- `MIN_TIME` da splash reduzido de 1400ms → 800ms para abertura mais rápida

---

## Impacto esperado

| Métrica                        | Antes      | Depois      |
|-------------------------------|-----------|-------------|
| Bundle JS inicial              | ~100% do código | ~40% (só home + react) |
| Re-renders desnecessários     | Frequentes | Eliminados (memo) |
| Delay de toque no iOS         | ~300ms   | ~0ms (touch-action) |
| Animações (frame drop celular)| Médio     | Baixo (só GPU props) |
| Splash mínima                 | 1.4s     | 0.8s        |
| Console.log no build          | Presentes | Removidos   |

---

## Estrutura de arquivos modificados

```
App.jsx           ← lazy + Suspense + memo + useCallback + useMemo
dashboard.jsx     ← memo + dados estáticos + useCallback
financeiro.jsx    ← memo + dados estáticos
clientes.jsx      ← memo + useMemo + useCallback
agenda.jsx        ← memo + dados estáticos
configuracoes.jsx ← memo + useCallback
animations.js     ← GPU-friendly + reduced-motion + touch fixes
vite.config.js    ← chunks + terser + cssCodeSplit
index.html        ← preconnect + color-scheme + will-change + splash
```
