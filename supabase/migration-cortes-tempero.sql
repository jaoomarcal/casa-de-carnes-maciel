-- =============================================================
--  MIGRATION — Cortes e tempero por produto
--  Rode no Supabase: Dashboard -> SQL Editor -> New query
-- =============================================================
--  Adiciona duas colunas na tabela de produtos:
--   - cortes:          quais cortes o açougueiro faz nesse produto
--                      (subconjunto de bife / manta / cubos / moida).
--                      Vazio = o produto não recebe corte.
--   - permite_tempero: se true, o site mostra a opção "Vai temperada?".
-- =============================================================

alter table public.produtos
  add column if not exists cortes text[] not null default '{}',
  add column if not exists permite_tempero boolean not null default false;

-- Garante que só valores conhecidos entrem no array de cortes
alter table public.produtos
  drop constraint if exists produtos_cortes_validos;

alter table public.produtos
  add constraint produtos_cortes_validos
  check (cortes <@ array['bife','manta','cubos','moida']::text[]);
