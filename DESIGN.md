---
name: Casa de Carnes Maciel
description: Catálogo de açougue com pedido fechado no WhatsApp, ancorado em vermelho-sangue, madeira e carvão.
colors:
  primary: "#C1121F"
  primary-deep: "#8B0D16"
  primary-light: "#E23B48"
  wood: "#7A4A25"
  wood-deep: "#3E2A1B"
  wood-light: "#C89B6A"
  charcoal: "#0E0E0E"
  whatsapp: "#25D366"
  neutral-bg: "#FFFFFF"
  neutral-fg: "#0F0F0F"
  neutral-muted: "#F7F4F0"
  neutral-muted-fg: "#666666"
  neutral-border: "#E8E3DC"
typography:
  display:
    fontFamily: "'Archivo Black', Inter, sans-serif"
    fontWeight: 400
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontWeight: 400
rounded:
  sm: "3px"
  md: "5px"
  lg: "0.9rem"
  full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    height: "44px"
    padding: "0 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  button-whatsapp:
    backgroundColor: "{colors.whatsapp}"
    textColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    height: "48px"
  button-outline:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.neutral-fg}"
    rounded: "{rounded.lg}"
    height: "44px"
  card-product:
    backgroundColor: "{colors.neutral-bg}"
    rounded: "{rounded.md}"
  badge-oferta:
    backgroundColor: "{colors.charcoal}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
  input-field:
    backgroundColor: "{colors.neutral-bg}"
    rounded: "{rounded.lg}"
---

# Design System: Casa de Carnes Maciel

## Overview

**Creative North Star: "O Balcão do Açougueiro"**

O site é a vitrine digital de um balcão de açougue de verdade: quente, tátil, sem enfeite corporativo. A foto do açougueiro trabalhando abre o hero, e a paleta segue direto da loja física — vermelho-sangue para ação e destaque, madeira e carvão para ambientação, branco limpo para deixar a comida ser a protagonista nos cards. A tipografia de display (Archivo Black, condensada e pesada) carrega o peso de placa de açougue; o corpo em Inter mantém tudo legível e rápido de escanear no celular. Nada aqui finge ser um marketplace: o pedido termina numa conversa de WhatsApp, então a interface prioriza clareza e confiança sobre efeito visual.

**Key Characteristics:**
- Vermelho-sangue como cor de ação, usado com moderação sobre fundo neutro
- Fotografia de comida como elemento central de cada card de produto
- Cantos arredondados suaves (nunca retos, nunca em pílula excessiva)
- Sombras suaves e difusas — nunca duras ou "flat"
- Hierarquia mobile-first: um botão primário por decisão

## Colors

Paleta quente e terrosa (vermelho-sangue, madeira, carvão) sobre uma base neutra clara, com um único acento vibrante reservado para ação.

### Primary
- **Vermelho-Sangue** (`#C1121F`): cor de ação — botões principais, preço em destaque, categoria ativa, badges de oferta com peso visual.
- **Vermelho-Sangue Profundo** (`#8B0D16`): estado hover/pressed do vermelho-sangue.
- **Vermelho-Sangue Claro** (`#E23B48`): variação clara usada em texto de estado ativo sobre fundo escuro (chip de categoria).

### Secondary
- **Madeira** (`#7A4A25`) / **Madeira Escura** (`#3E2A1B`) / **Madeira Clara** (`#C89B6A`): tons de ambientação (tábua de corte, fundo do hero), não usados em UI interativa.

### Neutral
- **Carvão** (`#0E0E0E`): "preto" da marca — nunca `#000` puro; usado em fundos escuros (nav de categorias, badges de oferta) e texto de alto contraste.
- **Branco** (`#FFFFFF`): fundo padrão de cards e telas.
- **Cinza-Amêndoa** (`#F7F4F0`): fundo `muted` (áreas secundárias, skeletons, blocos informativos).
- **Cinza-Texto-Secundário** (`#666666`): texto secundário (preço riscado, legendas).
- **Borda Amêndoa** (`#E8E3DC`): bordas de card, input e divisores.

### Named Rules
**A Regra do Acento Único.** O vermelho-sangue é reservado para ação e destaque (botão, preço, badge). Nunca decorar uma área grande inteira com ele — sua raridade é o que dá peso ao "Escolher" e ao preço.

## Typography

**Display Font:** 'Archivo Black' (com fallback Inter, sans-serif)
**Body Font:** Inter (com fallback system-ui, sans-serif)

**Character:** Archivo Black entrega peso de placa pintada à mão (usado só em números grandes, como o total do carrinho); Inter carrega o resto do texto com neutralidade e boa leitura em telas pequenas.

### Hierarchy
- **Display** (400, `text-xl`+, `font-display`): total do pedido no carrinho — o único lugar com peso "placa de açougue".
- **Title** (600–700, `text-sm`–`text-lg`): nome do produto no card, títulos de seção.
- **Body** (400–500, `text-sm`): descrições, rótulos de formulário, texto de categoria.
- **Label** (600, `text-xs`): badges, legendas de preço por kg/un.

## Layout

Container centralizado com `max-w-2xl` (mobile/conteúdo estreito) até `max-w-5xl` em telas grandes. Grade de produtos responsiva (1 coluna no celular, mais colunas conforme a largura). Barra de categorias fica fixa no topo (`sticky`) com scrollspy, rolagem horizontal sem scrollbar visível no mobile. Espaçamento generoso entre seções de categoria; padding interno de card em `p-3`.

## Elevation & Depth

Sistema de sombra suave e difusa (nunca sombra dura ou "material" com múltiplas camadas). Cards descansam com uma sombra leve (`shadow-soft`) e ganham uma sombra mais presente no hover (`shadow-card`), reforçando o levantamento (`hover:-translate-y-1 hover:scale-[1.03]`). O drawer de carrinho usa vidro fosco (`glass`/`glass-dark`, blur + transparência) em vez de sombra pesada para se destacar do fundo.

### Shadow Vocabulary
- **soft** (`0 4px 20px -4px rgb(0 0 0 / 0.10)`): estado de repouso de cards.
- **card** (`0 8px 30px -8px rgb(0 0 0 / 0.15)`): estado de hover/destaque de cards.
- **glass** (`0 8px 32px rgb(0 0 0 / 0.20)`): sobreposições com vidro fosco (carrinho, modais).

### Named Rules
**A Regra do Repouso Plano.** Nada tem sombra pesada em repouso. A sombra cresce como resposta a um estado (hover, oferta em destaque), nunca como decoração fixa.

## Shapes

Cantos arredondados suaves e consistentes: `lg` (0.9rem) em botões, inputs e cards; `full` só em badges/pills e chips de categoria. Bordas finas (`border-border`, `#E8E3DC`) delimitam cards e inputs sem pesar visualmente. Nenhum elemento usa cantos retos (0px) fora de imagens de fundo em tela cheia.

## Components

### Buttons
- **Shape:** `rounded-lg` (0.9rem), altura fixa por tamanho (`h-9`/`h-11`/`h-12`).
- **Primary:** fundo vermelho-sangue, texto branco, `shadow-soft`.
- **Hover / Focus:** `hover:bg-carne-dark`; foco com anel (`focus-visible:ring-2 ring-ring`) e leve encolhimento no clique (`active:scale-[0.97]`).
- **Secondary / Ghost / WhatsApp:** outline (borda + fundo neutro), ghost (sem fundo, hover sutil), e uma variante dedicada `whatsapp` (`#25D366`) para a ação de fechar pedido — a única cor de marca externa permitida na UI.

### Chips (categoria)
- **Style:** fundo `carvao` translúcido (`bg-white/5`) com texto branco 70% de opacidade quando inativo; vermelho-sangue sólido com texto branco quando ativo.
- **State:** o chip ativo centraliza-se automaticamente na barra rolável ao trocar de categoria (scrollspy).

### Cards / Containers
- **Corner Style:** `rounded-lg`.
- **Background:** branco puro, imagem do produto ocupando a proporção `4:3` no topo.
- **Shadow Strategy:** `shadow-soft` em repouso, `shadow-card` + leve elevação no hover (ver Elevation & Depth).
- **Border:** `border-border` (1px, `#E8E3DC`).
- **Internal Padding:** `p-3`.

### Inputs / Fields
- **Style:** fundo `background`, borda `border-input`, `rounded-lg`, `px-3 py-2`.
- **Focus:** anel de 2px na cor `ring` (`focus:ring-2 focus:ring-ring`), sem mudança de borda.
- **Mobile:** fonte forçada em 16px abaixo de 640px para não disparar o zoom automático do iOS Safari.

### Navigation
- Barra de categorias fixa, fundo carvão, chips horizontais roláveis; nenhum item de menu tradicional — a navegação é 100% por categoria de produto.

## Do's and Don'ts

### Do:
- **Do** reservar o vermelho-sangue para ação e destaque (botão, preço, badge de oferta).
- **Do** manter sombras suaves e crescentes só em resposta a hover/estado.
- **Do** deixar a fotografia do produto/açougueiro ser o elemento mais chamativo da tela.

### Don't:
- **Don't** usar preto puro (`#000`) — a marca usa carvão (`#0E0E0E`).
- **Don't** aplicar sombra pesada ou múltiplas camadas em repouso.
- **Don't** introduzir uma segunda cor de ação vibrante além do vermelho-sangue (o verde do WhatsApp é a única exceção, restrita ao botão de fechar pedido).
