-- =============================================================
--  CATÁLOGO — Bebidas
--  Rode no Supabase: Dashboard -> SQL Editor -> New query
--  (requer que a categoria "bebidas" já exista no CHECK da coluna
--  categoria — veja migration-bebidas.sql)
-- =============================================================

insert into public.produtos (nome, categoria, unidade, preco_kg, esgotado, ordem) values
  ('Coca-Cola 2L',                  'bebidas', 'un', 14.50, false,  1),
  ('Coca-Cola Zero 2L',             'bebidas', 'un', 14.50, false,  2),
  ('Fanta Laranja 2L',              'bebidas', 'un', 12.50, false,  3),
  ('Fanta Laranja Zero 2L',         'bebidas', 'un', 12.50, false,  4),
  ('Fanta Uva 2L',                  'bebidas', 'un', 12.50, false,  5),
  ('Sprite 2L',                     'bebidas', 'un', 12.50, false,  6),
  ('Sprite Zero 2L',                'bebidas', 'un', 12.50, false,  7),
  ('Guaraná Poty 2L',               'bebidas', 'un',  9.00, false,  8),
  ('Roller 2L',                     'bebidas', 'un',  9.00, false,  9),
  ('Guaraná Poty 3L',               'bebidas', 'un', 13.50, false, 10),
  ('Roller 3L',                     'bebidas', 'un', 13.50, false, 11),
  ('Guaraná Cotuba 2L',             'bebidas', 'un',  9.00, false, 12),
  ('Guaraná Cotuba Zero 2L',        'bebidas', 'un',  9.00, false, 13),
  ('Coca-Cola 600ml',               'bebidas', 'un',  8.00, false, 14),
  ('Coca-Cola Zero 600ml',          'bebidas', 'un',  8.00, false, 15),
  ('Suco Pomar Caju',               'bebidas', 'un', 15.00, false, 16),
  ('Suco Pomar Acerola',            'bebidas', 'un', 15.00, false, 17),
  ('Suco Pomar Goiaba',             'bebidas', 'un', 15.00, false, 18),
  ('Suco Pomar Maracujá',           'bebidas', 'un', 15.00, false, 19),
  ('Água',                          'bebidas', 'un',  3.00, false, 20),
  ('Água com Gás',                  'bebidas', 'un',  3.50, false, 21),
  ('Energético Monster',            'bebidas', 'un', 12.00, false, 22)
on conflict do nothing;
