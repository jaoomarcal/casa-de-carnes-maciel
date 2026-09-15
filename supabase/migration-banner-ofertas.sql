-- =============================================================
--  MIGRATION — Card de oferta tipo "banner"
--  Rode no Supabase: Dashboard -> SQL Editor -> New query
-- =============================================================
--  Além dos produtos normais, o painel agora permite cadastrar um
--  segundo tipo de card pra vitrine "Ofertas": só imagem + descrição,
--  sem preço, corte ou peso — pensado pra avisos/promoções que não são
--  um produto vendável (ex.: "Só essa semana", "Combo do churrasco").
--
--  Continua sendo uma linha na tabela "produtos" (mesmo CRUD do painel),
--  só que com tipo='banner'. Os demais campos (preço, cortes etc.) ficam
--  sem uso nesse caso e o front ignora eles.
-- =============================================================

alter table public.produtos
  add column if not exists tipo text not null default 'produto';

alter table public.produtos
  drop constraint if exists produtos_tipo_check;

alter table public.produtos
  add constraint produtos_tipo_check
  check (tipo in ('produto', 'banner'));
