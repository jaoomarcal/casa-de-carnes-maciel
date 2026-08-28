# 🧩 Guia de Montagem — Casa de Carnes Maciel

> Explicado bem devagar, como se fosse um quebra-cabeça. Cada peça tem um lugar.

---

## 🎨 A ideia em 1 parágrafo

O site tem **duas telas**:

1. **A loja** (`/`) — qualquer pessoa vê. Mostra as carnes por categoria, deixa
   escolher o peso, joga no carrinho e manda o pedido pelo WhatsApp.
2. **O painel** (`/painel`) — só o dono entra (com e-mail e senha). Ele cadastra
   carnes, sobe fotos, marca o que é oferta e liga/desliga "esgotado".

O **cérebro** dos dados é o **Supabase** (um banco de dados na nuvem + login +
armazenamento de imagens). O site é publicado na **Vercel**.

```
┌─────────────┐        lê produtos         ┌──────────────┐
│   NAVEGADOR │ ───────────────────────▶  │              │
│  (a loja)   │ ◀───────────────────────  │   SUPABASE   │
└─────────────┘        recebe a lista       │  - Postgres  │
       ▲                                    │  - Auth      │
       │  o dono cadastra/edita             │  - Storage   │
┌─────────────┐ ─────────────────────────▶ │              │
│  /painel    │                             └──────────────┘
└─────────────┘
```

A **regra de segurança (RLS)** mora dentro do Supabase: "todo mundo pode LER,
mas só o dono pode ESCREVER". Mesmo que alguém descubra o endereço `/painel`,
sem ser admin o banco recusa qualquer alteração.

---

## 🧱 As peças do quebra-cabeça (estrutura de pastas)

```
maciel/
├── index.html                 → a "moldura" da página (fontes, título, ícone)
├── vite.config.js             → configura o Vite e o atalho "@/" para "src/"
├── tailwind.config.js         → cores da marca (carne, madeira, carvão) e sombras
├── vercel.json                → faz o /painel funcionar ao recarregar a página
├── .env                       → SUAS chaves secretas do Supabase (NÃO vai pro git)
├── .env.example               → modelo do .env para copiar
│
├── supabase/
│   └── schema.sql             → 🟩 PEÇA 1: cria a tabela + regras de segurança
│
├── public/                    → arquivos servidos "como estão" (imagens)
│   ├── assets/
│   │   ├── logo-maciel.png    → a logo do cliente
│   │   ├── cutelo-3d.png      → ícone 3D do botão flutuante do carrinho
│   │   └── acougueiro-3d.png  → ícone 3D usado no carrinho vazio
│   └── textures/
│       └── madeira-hero.png   → fundo de madeira do topo
│
└── src/
    ├── main.jsx               → 🟩 liga tudo: rotas, carrinho global, avisos (toast)
    ├── index.css              → estilos base + utilitários (.glass, etc.)
    │
    ├── lib/                   → "ferramentas" sem visual
    │   ├── supabase.js        → cria a conexão com o Supabase
    │   ├── utils.js           → cn() (junta classes) + formatBRL() + formatPeso()
    │   └── whatsapp.js        → transforma o carrinho em mensagem e abre o WhatsApp
    │
    ├── data/
    │   └── categories.js      → lista de categorias e os pesos (100g/500g/1kg)
    │
    ├── context/
    │   └── CartContext.jsx    → 🟩 o carrinho: guarda os itens e salva no navegador
    │
    ├── hooks/                 → "receitas" reutilizáveis de lógica
    │   ├── useProducts.js     → busca os produtos do Supabase (loja)
    │   ├── useAuth.js         → login/logout do dono
    │   └── useAdmin.js        → criar/editar/excluir/toggle + upload de foto
    │
    ├── components/
    │   ├── ui/                → peças "cruas" reutilizáveis (estilo Shadcn)
    │   │   ├── button.jsx
    │   │   ├── badge.jsx
    │   │   ├── skeleton.jsx   → o "esqueleto" cinza do carregamento
    │   │   └── sheet.jsx      → base acessível da gaveta lateral
    │   ├── layout/
    │   │   ├── HeroBanner.jsx → logo sobre a madeira, com escurecimento
    │   │   ├── PromoBanner.jsx→ card de ofertas em vidro fosco (glassmorphism)
    │   │   └── Footer.jsx     → rodapé + link "•" escondido para o /painel
    │   ├── catalog/
    │   │   ├── ProductCard.jsx    → 🟩 PEÇA 3: o card do produto (hover + esgotado)
    │   │   ├── ProductSkeleton.jsx
    │   │   ├── CategorySection.jsx → título + grade de cards de uma categoria
    │   │   └── WeightSelector.jsx  → os botões 100g / 500g / 1kg
    │   └── cart/
    │       ├── FloatingCart.jsx   → 🟩 PEÇA 4: botão 3D + abre a gaveta
    │       └── CartDrawer.jsx     → conteúdo da gaveta (lista, aviso 10%, botões)
    │
    └── pages/
        ├── Home.jsx           → monta a loja: Hero + Promo + categorias + carrinho
        └── Admin.jsx          → login + tabela de produtos + formulário
```

Regra de ouro da organização:

- **`lib/`** = funções puras (recebem dados, devolvem dados; sem tela).
- **`hooks/`** = lógica que "conversa" com o React (usa `useState`, `useEffect`…).
- **`components/ui/`** = peças visuais burras e reutilizáveis (um botão não sabe
  o que é uma carne).
- **`components/<área>/`** = peças que já conhecem o domínio (ProductCard sabe o
  que é `preço/kg` e `esgotado`).
- **`pages/`** = só encaixam as peças acima.

---

## 👶 Montando passo a passo

### Passo 0 — O que instalar na sua máquina

- **Node.js 18+** (recomendo 20). Teste: `node -v`
- Uma conta grátis no **Supabase** (supabase.com)
- Uma conta grátis na **Vercel** (vercel.com)

### Passo 1 — Rodar o projeto localmente

```bash
cd C:\reactJs\maciel
npm install        # baixa as "peças de fábrica" (só na 1ª vez)
copy .env.example .env   # (PowerShell: Copy-Item .env.example .env)
npm run dev        # abre em http://localhost:5173
```

Nesse ponto o site abre, mas o catálogo aparece **vazio** (ainda não há banco).
Isso é esperado.

### Passo 2 — Criar o banco no Supabase (PEÇA 1)

1. No Supabase, crie um projeto novo. Anote a senha do banco.
2. Menu lateral → **SQL Editor** → **New query**.
3. Abra o arquivo `supabase/schema.sql`, **copie tudo**, cole e clique **Run**.
   - Isso cria a tabela `produtos`, a tabela `admins`, as **policies de RLS**,
     o bucket de imagens `produtos` e alguns produtos de exemplo.
4. Menu → **Project Settings → API**. Copie:
   - **Project URL** → vai em `VITE_SUPABASE_URL`
   - **anon public key** → vai em `VITE_SUPABASE_ANON_KEY`
5. Cole os dois no seu arquivo `.env` e reinicie o `npm run dev`.

Agora o catálogo carrega os produtos de exemplo. 🎉

### Passo 3 — Criar o usuário dono (admin)

1. Supabase → **Authentication → Users → Add user** (e-mail + senha do dono).
2. Supabase → **SQL Editor**, rode (trocando o e-mail):

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'dono@casadecarnesmaciel.com';
```

3. No site, vá em `/painel`, faça login. Agora você consegue criar produtos,
   subir fotos, marcar oferta e usar o toggle de estoque.
   - Se tentar salvar **sem** estar na tabela `admins`, o Supabase responde
     "permission denied" — é o RLS funcionando.

### Passo 4 — Publicar na Vercel

1. Suba o projeto para um repositório no GitHub.
   - O `.gitignore` já impede o `.env` e o `node_modules` de irem junto.
2. Na Vercel → **Add New → Project** → escolha o repositório.
3. Framework: **Vite** (detecta sozinho). Build: `npm run build`. Output: `dist`.
4. Em **Environment Variables**, adicione as **3** variáveis do seu `.env`
   (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_WHATSAPP_NUMERO`).
5. **Deploy**. Em ~1 minuto o site está no ar.
6. Volte no Supabase → **Authentication → URL Configuration** e adicione a URL
   da Vercel em "Site URL" / "Redirect URLs" (para o login funcionar em produção).

---

## 🔍 Como cada peça-chave funciona

### 🟩 O carrinho (`context/CartContext.jsx`)

- É um **Context**: um "quadro de avisos" que qualquer componente lê sem precisar
  passar props de pai para filho.
- Guarda uma lista de itens `{ id, nome, precoKg, gramas, quantidade, imagem }`.
- O mesmo produto em pesos diferentes vira **linhas diferentes** (a "chave" é
  `id + gramas`).
- Toda mudança é salva no **localStorage** — se o cliente fechar e voltar, o
  carrinho continua lá.
- `adicionar()` já dispara o toast "Item adicionado ao carrinho".

### 🟩 O card do produto (`components/catalog/ProductCard.jsx`)

- **Hover suave:** `hover:-translate-y-1 hover:scale-[1.03] hover:shadow-card`
  no `<article>`, e a imagem dá um leve zoom (`group-hover:scale-110`).
- **Esgotado (`produto.esgotado === true`):**
  - imagem recebe `grayscale`, o card inteiro fica com `opacity-60`;
  - o botão "Adicionar" **some** e no lugar entra a badge **"Indisponível"**;
  - os botões de peso ficam desabilitados.
- **Oferta:** mostra o preço cheio riscado + o preço de oferta em vermelho.
- O preço sempre aparece como `R$ 48,50 / kg` (via `formatBRL`).

### 🟩 O botão flutuante 3D (`components/cart/FloatingCart.jsx`)

- Usa o **Framer Motion**. O bloco `<AnimatePresence>` só renderiza o botão
  quando `itens.length > 0`; quando o carrinho esvazia, ele **anima a saída**
  (desce e encolhe) em vez de sumir seco.
- Entrada: `initial={{ y: 80, scale: 0.6, opacity: 0 }}` → `animate` com uma mola
  (`type: "spring"`), então ele "pula" para dentro da tela.
- O ícone é a imagem 3D `cutelo-3d.png`. Um **badge vermelho** no canto mostra a
  quantidade e "pisca" a cada mudança (`key={quantidadeTotal}` remonta o span).
- Ao clicar, abre o **Drawer** (gaveta) — não um modal central:
  - fundo: `<Dialog.Overlay>` do Radix (foco preso, ESC fecha, trava o scroll);
  - a gaveta é um `<motion.div>` que desliza de `x: "100%"` até `x: 0`,
    ancorado em `inset-y-0 right-0` (colado na direita, altura total).

### 🟩 A gaveta (`components/cart/CartDrawer.jsx`)

- Lista os itens com miniatura, peso, preço/kg, **stepper** de quantidade e um
  ícone de **lixeira** (`Trash2` do lucide-react) para remover na hora.
- Cada item entra/sai com animação (`<AnimatePresence>` + `layout`).
- Mostra em destaque o aviso:
  **"Item sujeito a alteração de peso de 10% para mais ou para menos"**.
- Rodapé fixo com o **total estimado** e dois botões:
  - **Continuar comprando** → só fecha a gaveta (`onClose`);
  - **Fechar pedido via WhatsApp** → chama `enviarPedidoWhatsApp(itens)`.

### 🟩 O WhatsApp (`lib/whatsapp.js`)

- `subtotalItem(item)` = `precoKg * (gramas / 1000) * quantidade`.
- Monta um texto com bullets, total e o aviso dos 10%.
- Abre `https://wa.me/5517991316331?text=<mensagem codificada>`.
- O número vem de `VITE_WHATSAPP_NUMERO` (fallback já é o número da Maciel).

### 🟩 Estados de carregamento (Skeleton)

- Enquanto `useProducts` está buscando (`loading === true`), a `CategorySection`
  renderiza `ProductGridSkeleton` (cards cinza pulsando) no lugar dos produtos.
  A tela nunca fica "em branco".

### 🟩 O painel invisível + RLS

- **Invisível:** no `Footer.jsx` há um `<Link to="/painel">` cujo texto é só um
  `•` quase transparente. Não é "segurança por obscuridade" — é só estética.
- **Segurança de verdade:** está no `schema.sql`.
  - `SELECT` → `using (true)` → catálogo público.
  - `INSERT/UPDATE/DELETE` → `with check (public.is_admin())` → só quem está na
    tabela `admins`.
  - O mesmo vale para o **Storage** (subir/apagar foto = só admin).
- O front nem precisa "esconder" o painel: se um não-admin logar e tentar salvar,
  o banco recusa.

---

## 🖼️ Sobre as imagens que você deixou

| Arquivo usado                     | Onde entra                                  |
| --------------------------------- | ------------------------------------------- |
| `logo-maciel.png`                 | Hero, favicon, tela de login                |
| `cutelo-3d.png`                   | Ícone do botão flutuante do carrinho (FAB)  |
| `acougueiro-3d.png`               | Ilustração do carrinho vazio                |
| `textures/madeira-hero.png`       | Fundo de madeira do topo                    |
| `textures/madeira-clara.png`      | Reserva (ex.: fundo de seções secundárias)  |
| `carnes-og.png`                   | Imagem de compartilhamento + fallback       |

> ⚠️ A logo atual tem **fundo branco**. Para o Hero ficar perfeito sobre a
> madeira, gere/recorte uma versão com **fundo transparente** e substitua
> `public/assets/logo-maciel.png` (mesmo nome). As fotos das outras carnes
> (linguiça, aves etc.) você sobe pelo painel — não precisa colocar no código.

As imagens que **não** usei (águia "SU", "Adoleta Boutique", troféu de perfume)
são de outros projetos e ficaram de fora de propósito.

---

## 🎨 Trocar cores / marca

Tudo está em **`tailwind.config.js`** → `theme.extend.colors`:

```js
carne:   { DEFAULT: "#C1121F", dark: "#8B0D16", light: "#E23B48" }, // vermelho
madeira: { DEFAULT: "#7A4A25", escura: "#3E2A1B", clara: "#C89B6A" },
carvao:  "#0E0E0E", // "preto" da marca — evite #000 puro
```

Mudou aqui, mudou no site inteiro (`bg-carne`, `text-carne`, `ring-carne`…).

---

## ✅ Checklist de "está pronto?"

- [ ] `npm run dev` abre sem erro no console
- [ ] `schema.sql` rodado no Supabase sem erro
- [ ] `.env` preenchido com URL + anon key + número do WhatsApp
- [ ] Catálogo carrega os produtos de exemplo
- [ ] Usuário dono criado e inserido em `public.admins`
- [ ] `/painel` faz login e salva um produto de teste com foto
- [ ] Adicionar item → botão 3D aparece animado com o badge
- [ ] "Fechar pedido via WhatsApp" abre o chat com a mensagem formatada
- [ ] Deploy na Vercel com as 3 variáveis de ambiente
- [ ] URL da Vercel adicionada no Supabase (Auth → URL Configuration)

---

## 🧰 Comandos do dia a dia

```bash
npm run dev       # desenvolvimento (hot reload)
npm run build     # gera a versão de produção em dist/
npm run preview   # testa o build localmente
```
