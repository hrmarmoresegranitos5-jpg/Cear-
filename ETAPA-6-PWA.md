# ETAPA 6 — PWA (Progressive Web App)
## Ceará Planejados — Guia de Implementação

---

## O que foi criado

| Arquivo | Onde colocar | Função |
|---|---|---|
| `public/manifest.json` | `/public/` | Identidade do app (nome, ícones, cores, orientação) |
| `public/service-worker.js` | `/public/` | Cache offline + estratégia de fetch |
| `public/offline.html` | `/public/` | Tela bonita quando sem conexão |
| `public/icons/icon-*.png` | `/public/icons/` | Ícones 72→512px para todos dispositivos |
| `public/icons/apple-touch-icon.png` | `/public/icons/` | Ícone iOS (180×180) |
| `public/icons/favicon-*.png` | `/public/icons/` | Favicons 16 e 32px |
| `public/splash/splash-*.png` | `/public/splash/` | Splash screens iOS (3 tamanhos) |
| `index.html` | raiz do projeto | Tags PWA + splash screen inline + registro SW |
| `src/hooks/usePWA.js` | `src/hooks/` | Hook React: online/offline, install, update |
| `src/components/PWABanners.jsx` | `src/components/` | UI: banners de instalação e atualização |
| `src/App.jsx` | `src/` | App.jsx atualizado com os banners integrados |
| `vite.config.js` | raiz do projeto | Config Vite otimizada para PWA |

---

## Como aplicar ao seu projeto

### 1. Copie os arquivos `public/`

```
seu-projeto/
  public/
    manifest.json          ← copiar
    service-worker.js      ← copiar
    offline.html           ← copiar
    icons/                 ← copiar pasta inteira
    splash/                ← copiar pasta inteira
```

### 2. Substitua o `index.html`

Substitua seu `index.html` atual pelo novo.
O novo tem:
- Todas as `<meta>` tags PWA
- Splash screen animada que some quando o React monta
- Registro automático do Service Worker
- Detecção de atualização disponível

### 3. Adicione os hooks e componentes React

```
src/
  hooks/
    usePWA.js              ← copiar (novo)
  components/
    PWABanners.jsx         ← copiar (novo)
```

### 4. Atualize o `App.jsx`

Use o novo `App.jsx` ou adicione manualmente ao seu:

```jsx
import { usePWA }                                    from './hooks/usePWA';
import { InstallBanner, UpdateBanner, OfflineBadge } from './components/PWABanners';

// Dentro do componente:
const pwa = usePWA();

// Dentro do JSX (antes do <div id="hdrAndPages">):
<UpdateBanner  show={pwa.updateReady}  onUpdate={pwa.applyUpdate} />
<InstallBanner show={pwa.canInstall}   onInstall={pwa.installApp} />
<OfflineBadge  show={!pwa.isOnline} />
```

### 5. Substitua o `vite.config.js`

```
seu-projeto/
  vite.config.js           ← substituir
```

---

## Como funciona cada parte

### Splash Screen
- Aparece **instantaneamente** com CSS puro (antes do React carregar)
- Desaparece com fade-out assim que o React monta o `#root`
- Tempo mínimo de 1.4s para não ser um flash
- Fallback de 3s se o React demorar

### Service Worker — Estratégias de Cache
| Tipo de request | Estratégia |
|---|---|
| Navegação (HTML) | Network-first + cache de fallback |
| JS/CSS/Imagens | Cache-first (mais rápido) |
| Outros | Network com fallback no cache |

### Offline
- O app abre mesmo sem internet (assets em cache)
- IndexedDB (seus dados) funciona 100% offline
- Banner discreto avisa quando sem conexão
- Página `/offline.html` se o cache não tiver o HTML

### Install Banner (Android)
- Aparece automaticamente quando o browser permite
- Botão "Instalar" dispara o prompt nativo do Android
- Desaparece após instalação

### Update Banner
- Detecta quando o Service Worker tem nova versão
- Botão "Atualizar" aplica a nova versão e recarrega

---

## Para personalizar o ícone

Os ícones gerados usam a letra "C" em fundo escuro com borda dourada.
Para trocar pelo logo real da empresa:

1. Prepare um PNG 512×512 com fundo transparente ou sólido
2. Substitua os arquivos em `/public/icons/`
3. Mantenha os mesmos nomes

### Ferramenta online para ícones:
- **PWABuilder** → pwabuilder.com (upload de 1 imagem, gera todos os tamanhos)
- **Maskable.app** → maskable.app (testa se o ícone funciona como maskable)

---

## Para personalizar as splash screens iOS

As splash screens são imagens estáticas que o iOS mostra enquanto o app abre.
Edite `/tmp/gen_icons.py` e rode novamente, ou use o **PWABuilder** para gerar.

---

## Testar o PWA

### No Chrome DevTools:
1. `F12` → aba **Application**
2. **Manifest** → verifica se está carregado sem erros
3. **Service Workers** → verifica registro e status
4. **Cache Storage** → vê o que foi cacheado
5. **Offline** → marque a caixa, recarregue → deve abrir offline

### No celular Android:
1. Abra no Chrome
2. Menu (3 pontos) → "Adicionar à tela inicial"
3. Ou aguarde o banner de instalação aparecer

### No iPhone (iOS):
1. Abra no Safari
2. Botão Compartilhar → "Adicionar à Tela de Início"
3. O app abre sem barra do Safari (standalone)

---

## Checklist de produção

- [ ] `https://` — Service Workers só funcionam em HTTPS (ou localhost)
- [ ] Incrementar `CACHE_NAME` no SW a cada deploy: `cear-v1` → `cear-v2`
- [ ] Testar offline no Chrome DevTools antes de publicar
- [ ] Verificar Lighthouse PWA score (deve ser ≥90)
- [ ] Confirmar que o `manifest.json` não tem erros no DevTools
- [ ] Testar instalação no Android e iOS

---

## Score Lighthouse esperado

Com essa configuração, o Lighthouse PWA deve reportar:
- ✅ Installable
- ✅ PWA Optimized
- ✅ Manifest válido
- ✅ Service Worker registrado
- ✅ Funciona offline
- ✅ Theme color configurada
- ✅ Splash screen (via manifest)
