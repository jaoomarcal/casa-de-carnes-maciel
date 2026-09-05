-- =============================================================
--  MIGRATION — Peso estimado (corte "Peça inteira")
--  Rode no Supabase: Dashboard -> SQL Editor -> New query
-- =============================================================
--  Quando o produto vende a peça inteira (corte "peca-inteira"), o peso
--  varia de peça pra peça — por isso o cliente não escolhe o peso no site,
--  só vê um peso estimado que o dono configura aqui. O peso e o valor
--  exatos são acertados pelo WhatsApp.
-- =============================================================

alter table public.produtos
  add column if not exists peso_estimado_g integer;
