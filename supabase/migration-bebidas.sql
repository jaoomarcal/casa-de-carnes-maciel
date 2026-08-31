-- =============================================================
--  MIGRAÇÃO — Nova categoria "bebidas"
--  Rode no Supabase: Dashboard -> SQL Editor -> New query
-- =============================================================
--
-- A coluna "categoria" da tabela produtos tem um CHECK que lista
-- as categorias permitidas. Para o site aceitar "bebidas", esse
-- CHECK precisa ser recriado incluindo o novo valor.

alter table public.produtos
  drop constraint if exists produtos_categoria_check;

alter table public.produtos
  add constraint produtos_categoria_check
  check (categoria in ('bovinos','suinos','aves','linguica','temperados','bebidas'));
