# Andressa Rodrigues — Portfólio

Portfólio pessoal em **React 19 + Vite + TypeScript**, com conteúdo em **PT/EN**.
A estrutura e a linguagem visual foram baseadas em xhulia.com; o conteúdo e a identidade são próprios.

## Rodando

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # typecheck + build de produção em dist/
npm run preview  # serve o build
npm run lint     # oxlint
```

O `vercel.json` já reescreve as rotas para o `index.html` (SPA), então `/about` funciona direto na Vercel.

### GitHub Pages

O workflow `.github/workflows/deploy.yml` publica o site a cada push na `main`.

1. Suba o projeto para um repositório no GitHub.
2. Em **Settings → Pages → Build and deployment → Source**, escolha **GitHub Actions** (só na primeira vez).
3. Faça push na `main` (ou rode o workflow em **Actions → Deploy to GitHub Pages → Run workflow**).

Endereço final:
- repositório `AndressaARodrigues.github.io` → `https://andressaarodrigues.github.io/`
- qualquer outro nome, por exemplo `portfolio` → `https://andressaarodrigues.github.io/portfolio/`

O workflow descobre sozinho o caminho certo (`--base`), e as rotas, o CV e as imagens seguem esse caminho. Como o GitHub Pages não tem reescrita de rotas, o build ganha uma cópia `404.html` do `index.html`, para que `/about` abra mesmo ao recarregar a página.

Para hospedar onde a URL da página não pode mudar (prévias embutidas, por exemplo), gere o build com `VITE_ROUTER=memory npm run build`: a navegação passa a acontecer só dentro do app.

## Onde editar o conteúdo

Todo texto e dado pessoal fica em `src/content/` — nenhum componente tem texto fixo.

| Arquivo | O que tem |
| --- | --- |
| `site.ts` | nome, e-mail, links, foto (`avatarSrc`) e CV em PT e EN (`cv`; os PDFs ficam em `public/cv/` e são baixados no idioma do site) |
| `home.ts` | hero (título, subtítulo), rótulo da seção de projetos e as pills |
| `projects.ts` | cada projeto: nome, frase de impacto (`tagline`), resumo (o projeto e o seu papel), tags (`stack`), link (`href`, se não tiver vai para o GitHub geral) e mídia |
| `about.ts` | página Sobre (título, bio, seções, fotos) |
| `ui.ts` | textos de interface (nav, botões, rótulos acessíveis) |

Cada texto é `{ pt: '...', en: '...' }`. Nos textos longos, `**negrito**` e `*itálico*` funcionam (componente `RichText`).

## Assets pendentes

| Asset | Como adicionar | Enquanto não existe |
| --- | --- | --- |
| Sua foto | arquivo em `public/` + `avatarSrc` em `site.ts` | iniciais "AR" |
| Imagens/vídeos dos projetos | arquivos em `public/projects/...` + `media` em `projects.ts` | blocos neutros na cor do projeto |

Fotos da página Sobre: as 7 ficam em `src/assets/about/` (recortadas em 456×576, sem metadados da câmera) e são importadas em `about.ts`. Para trocar uma, substitua o arquivo com o mesmo nome ou ajuste o `import`.

## Estrutura

```
src/
  content/        conteúdo (PT/EN)
  i18n/           provider, hook e tipos de idioma
  lib/
    pillPhysics.ts  simulação das pills (Matter.js), sem React
  components/
    SiteNav/        nav: monograma, links, idioma, e-mail
    Pill/           pílula colorida (texto mono + ícone, ou só ícone)
    PhysicsPills/   pilha arrastável do hero
    DisplayHeading/ título serif grande (Home e Sobre)
    DragStrip/      faixa de imagens dos projetos: rola sozinha, arrasta com inércia, cursor "Arraste"
    PhotoFan/       leque de fotos da página Sobre (abre a partir do centro, com legendas em balão)
    MediaTile/      item da faixa: imagem, vídeo ou bloco neutro
    ProjectCard/    card de projeto (empilha: o próximo desliza sobre o anterior)
    MoreWork/       "Mais [pasta] projetos" (leva ao GitHub): no hover, 3 cartões saem da pasta e a pílula "Ver" segue o cursor
    Panel/          superfície branca arredondada sobre o hero e sobre o footer
    SiteFooter/     footer escuro; o nome copia o e-mail (CopyNameButton)
    WatchingEyes/   olhos do footer que seguem o cursor
    ScrollProgress/ barra amarela de progresso no topo
    FitText/        ajusta o tamanho da fonte para ocupar a largura (nome no footer)
    Avatar/, CopyEmailButton/, RichText/
  hooks/
    useStickyFit.ts       sticky que nunca esconde o fim de um bloco mais alto que a tela
    useScrollDirection.ts esconde a nav ao rolar para baixo
  pages/
    Home/, About/
  styles/
    tokens.css      cores e escala fluida de tipografia e tamanhos
    tones.module.css  tons das pills (--tone)
    global.css
```

## Decisões

- **Tokens** em `src/styles/tokens.css`. As cores foram amostradas pixel a pixel da referência.
  - **Tamanhos fluidos:** crescem com a largura da tela (`clamp` + `vw`), do mínimo de celular até cerca de 90–95% do tamanho medido na referência a 1916px.
  - **Títulos grandes:** também são limitados pela altura da tela (`vh`), para caberem em notebooks baixos.
  - **Espaçamentos verticais:** de hero, cards, Sobre e footer também usam `vh`.
  - **Breakpoints:** 810 e 1200px, e só mudam o layout (nav só com ícones, botão do card abaixo do texto, nome do footer em duas linhas).
  - Para ajustar a escala geral, edite os tokens; os componentes não têm tamanhos de fonte fixos.
- **Fontes** auto-hospedadas via Fontsource: Instrument Serif (títulos, confirmada pelas medidas), Inter (texto) e Geist Mono (pills — aproximação; a mono original não foi identificada com certeza).
- **Ícones**: `lucide-react` (o layout de referência usa ícones exclusivos do Lucide).
- **Pills com física** (`lib/pillPhysics.ts`, carregado sob demanda):
  - passo fixo, então uma semente sempre gera a mesma pilha;
  - antes de mostrar, sementes candidatas são simuladas fora da tela e só é usada uma cuja pilha não cubra o texto do hero;
  - a quantidade de pills se ajusta ao espaço livre abaixo do texto (as primeiras do array em `home.ts` têm prioridade);
  - arrastáveis com mouse e toque; pausam fora da tela;
  - com `prefers-reduced-motion`, a pilha aparece já assentada, sem arrastar, e os marquees param.
- **Interações (gravação de tela da referência)**:
  - o hero fica parado e o painel de projetos desliza por cima;
  - cada card gruda no topo e o próximo desliza sobre ele;
  - a faixa de imagens anda 36px/s e pode ser arrastada;
  - a nav some ao rolar para baixo e volta ao rolar para cima;
  - a barra amarela de 2px no topo mostra o progresso;
  - na pasta "Mais projetos" (aba curva, degradê e granulação medidos na gravação), a pílula "Ver" segue o cursor em toda a área do link. Só sobre a pasta, ou com foco do teclado, três cartões se abrem em leque, a frente tomba e dois feixes de brilho atravessam a frente enquanto ela se move, na abertura e no fechamento. Os cartões usam a primeira imagem de cada projeto, ou a cor e o ícone dele enquanto não houver imagens;
  - na página Sobre, as fotos se abrem em leque a partir do centro ao aparecer e as legendas surgem depois. No celular, as fotos se sobrepõem mais e as legendas mantêm tamanho legível;
  - os olhos do footer seguem o cursor;
  - clicar no nome do footer copia o e-mail.

  Quando um bloco é mais alto que a tela, `useStickyFit` faz ele rolar até o fim aparecer antes de grudar.
- **Acessibilidade**: skip link, landmarks, `aria-current`, rótulos em links só com ícone (celular), pills marcadas como decorativas, `lang` do documento acompanha o idioma.
