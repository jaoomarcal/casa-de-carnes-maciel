-- =============================================================
--  MIGRAÇÃO — Catálogo do cliente
--  Novas categorias (peixes, mercearia, diversos) + coluna "unidade"
--  Rode no Supabase: Dashboard -> SQL Editor -> New query
-- =============================================================

-- 1) Categorias novas -------------------------------------------------
--    (bovinos/suinos/aves/linguica/temperados/bebidas já existem)
alter table public.produtos
  drop constraint if exists produtos_categoria_check;

alter table public.produtos
  add constraint produtos_categoria_check
  check (categoria in (
    'bovinos','suinos','aves','peixes','linguica',
    'temperados','mercearia','diversos','bebidas'
  ));

-- 2) Como o produto é vendido ---------------------------------------
--    'kg' -> preço por quilo, cliente escolhe o peso (padrão do açougue)
--    'un' -> preço por unidade, cliente escolhe a quantidade
--            (bebidas, mercearia, bandejas, congelados embalados)
--    Quando unidade = 'un', a coluna preco_kg passa a valer "preço por unidade".
alter table public.produtos
  add column if not exists unidade text not null default 'kg';

alter table public.produtos
  drop constraint if exists produtos_unidade_check;

alter table public.produtos
  add constraint produtos_unidade_check
  check (unidade in ('kg','un'));
