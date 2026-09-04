-- =============================================================
--  MIGRATION — Corte "Peça inteira"
--  Rode no Supabase: Dashboard -> SQL Editor -> New query
-- =============================================================
--  O painel já permite marcar "Peça inteira" como corte de um produto,
--  mas o banco ainda só aceitava bife/manta/cubos/moida — por isso o
--  erro "new row for relation produtos violates check constraint
--  produtos_cortes_validos" ao salvar. Esta migration atualiza a
--  constraint pra incluir o novo valor.
-- =============================================================

alter table public.produtos
  drop constraint if exists produtos_cortes_validos;

alter table public.produtos
  add constraint produtos_cortes_validos
  check (cortes <@ array['bife','manta','cubos','moida','peca-inteira']::text[]);
