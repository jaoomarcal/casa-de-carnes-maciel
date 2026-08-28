# Casa de Carnes Maciel 🥩

Web app de catálogo/delivery mobile-first para casa de carnes premium.
**React + Vite + Tailwind + Shadcn UI + Framer Motion + Supabase.**

## Rodar

```bash
npm install
cp .env.example .env   # preencha com suas chaves do Supabase
npm run dev
```

## Passo a passo completo

👉 Leia **[GUIA-DE-MONTAGEM.md](./GUIA-DE-MONTAGEM.md)** — explica cada peça do
projeto, o banco (`supabase/schema.sql`), o RLS e o deploy na Vercel.

## Stack

| Camada    | Ferramenta                                  |
| --------- | ------------------------------------------- |
| Build     | Vite 6                                      |
| UI        | Tailwind 3 + componentes estilo Shadcn      |
| Animação  | Framer Motion (FAB 3D, drawer, cards)       |
| Avisos    | Sonner (toasts)                             |
| Ícones    | lucide-react                                |
| Backend   | Supabase (Postgres + Auth + Storage + RLS)  |
| Deploy    | Vercel                                      |

## Rotas

- `/` — a loja (pública)
- `/painel` — painel do dono (Supabase Auth + RLS)

Número do WhatsApp: `VITE_WHATSAPP_NUMERO` (padrão `5517991316331`).
