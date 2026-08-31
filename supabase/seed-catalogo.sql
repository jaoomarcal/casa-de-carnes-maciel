-- =============================================================
--  CATÁLOGO DO CLIENTE — Casa de Carnes Maciel
--  Rode DEPOIS de "migration-catalogo.sql".
--  Supabase: Dashboard -> SQL Editor -> New query -> cole tudo -> Run
-- =============================================================
--
--  ATENÇÃO: a primeira linha APAGA todos os produtos que já existem
--  (inclusive os de exemplo e quaisquer fotos já associadas). É de
--  propósito — este arquivo recria o catálogo inteiro do zero.
--  Se quiser manter algum produto atual, remova o "delete" abaixo
--  e apague na mão os produtos de exemplo pelo painel.
--
--  unidade = 'kg' -> vendido por peso (cliente digita as gramas)
--  unidade = 'un' -> vendido por unidade (cliente escolhe a quantidade)
-- =============================================================

delete from public.produtos;

insert into public.produtos (nome, categoria, unidade, preco_kg, esgotado, ordem) values
  -- ---------------- BOVINOS ----------------
  ('Filé Mignon',                        'bovinos', 'kg', 62.00, false,  1),
  ('Picanha',                            'bovinos', 'kg', 69.90, false,  2),
  ('Contrafilé',                         'bovinos', 'kg', 44.90, false,  3),
  ('Alcatra',                            'bovinos', 'kg', 43.90, false,  4),
  ('Coxão Mole',                         'bovinos', 'kg', 43.55, false,  5),
  ('Coxão Duro com Lagarto',             'bovinos', 'kg', 40.40, false,  6),
  ('Lagarto',                            'bovinos', 'kg', 40.40, false,  7),
  ('Patinho',                            'bovinos', 'kg', 40.40, false,  8),
  ('Fraldinha',                          'bovinos', 'kg', 44.00, false,  9),
  ('Carnaza',                            'bovinos', 'kg', 37.70, false, 10),
  ('Ponta de Peito sem Osso',            'bovinos', 'kg', 38.60, false, 11),
  ('Miolo do Acém',                      'bovinos', 'kg', 38.60, false, 12),
  ('Peixinho',                           'bovinos', 'kg', 38.60, false, 13),
  ('Paleta',                             'bovinos', 'kg', 38.60, false, 14),
  ('Músculo',                            'bovinos', 'kg', 36.20, false, 15),
  ('Carne Moída',                        'bovinos', 'kg', 35.00, false, 16),
  ('Minga do Chef',                      'bovinos', 'kg', 33.20, false, 17),
  ('Costela Ripa',                       'bovinos', 'kg', 29.60, false, 18),
  ('Acém com Osso',                      'bovinos', 'kg', 22.40, false, 19),
  ('Ponta de Peito com Osso',            'bovinos', 'kg', 29.60, false, 20),
  ('Ponta de Peito com Osso Fatiada',    'bovinos', 'kg', 32.30, false, 21),
  ('Ponta de Peito Seringada',           'bovinos', 'kg', 38.60, false, 22),
  ('Kafta',                              'bovinos', 'kg', 28.70, false, 23),
  ('Fígado',                             'bovinos', 'kg', 19.90, false, 24),
  ('Cupim',                              'bovinos', 'kg', 49.00, false, 25),
  ('Cupim Seringado',                    'bovinos', 'kg', 49.00, false, 26),
  ('Cupim na Mostarda',                  'bovinos', 'kg', 49.00, false, 27),
  ('Rabo Congelado',                     'bovinos', 'kg', 31.40, false, 28),
  ('Coração Congelado',                  'bovinos', 'kg', 16.90, false, 29),
  ('Língua Congelada',                   'bovinos', 'kg', 16.90, false, 30),
  ('Bucho Congelado',                    'bovinos', 'kg', 16.90, false, 31),
  ('Mocotó Congelado',                   'bovinos', 'kg', 16.90, false, 32),

  -- ---------------- TEMPERADOS ----------------
  ('Manta Temperada',                    'temperados', 'kg', 33.20, false,  1),
  ('Costelão Temperado',                 'temperados', 'kg', 19.70, false,  2),
  ('Bife Temperado',                     'temperados', 'kg', 38.60, false,  3),
  ('Espeto Bovino Temperado',            'temperados', 'kg', 36.78, false,  4),
  ('Coxinha da Asa Temperada',           'temperados', 'kg', 17.25, false,  5),
  ('Coxa e Sobrecoxa Temperada',         'temperados', 'kg', 15.75, false,  6),
  ('Filé de Peito Fatiado Temperado',    'temperados', 'kg', 26.25, false,  7),
  ('Meio da Asa Temperada',              'temperados', 'kg', 26.20, false,  8),
  ('Espeto de Coração Temperado',        'temperados', 'kg', 36.78, false,  9),

  -- ---------------- SUÍNOS ----------------
  ('Pernil',                             'suinos', 'kg', 26.90, false,  1),
  ('Paleta Suína',                       'suinos', 'kg', 24.90, false,  2),
  ('Bisteca',                            'suinos', 'kg', 29.60, false,  3),
  ('Costela',                            'suinos', 'kg', 32.90, false,  4),
  ('Lombo',                              'suinos', 'kg', 34.90, false,  5),
  ('Toucinho',                           'suinos', 'kg', 33.00, false,  6),
  ('Barriga',                            'suinos', 'kg', 32.90, false,  7),
  ('Banha Suína',                        'suinos', 'un', 25.00, false,  8),
  ('Panceta Tuim',                       'suinos', 'un', 43.90, false,  9),
  ('Torresmo Tuim',                      'suinos', 'un', 25.00, false, 10),
  ('Picadão Suíno',                      'suinos', 'kg', 12.90, false, 11),
  ('Torresmo Pré-Frito',                 'suinos', 'un', 15.00, false, 12),
  ('Bacon',                              'suinos', 'kg', 44.50, false, 13),
  ('Pé Suíno',                           'suinos', 'kg', 14.90, false, 14),

  -- ---------------- AVES ----------------
  ('Coxinha da Asa (Bandeja)',           'aves', 'un', 19.90, false,  1),
  ('Coxa e Sobrecoxa (Bandeja)',         'aves', 'un', 15.75, false,  2),
  ('Filé de Peito Inteiro (Bandeja)',    'aves', 'un', 26.25, false,  3),
  ('Meio da Asa (Bandeja)',              'aves', 'un', 32.90, false,  4),
  ('Moela (Bandeja)',                    'aves', 'un', 21.90, false,  5),
  ('Coração (Bandeja)',                  'aves', 'un', 42.00, false,  6),
  ('Pé de Frango Congelado',             'aves', 'kg', 14.90, false,  7),
  ('Frango Inteiro Congelado',           'aves', 'kg', 16.90, false,  8),
  ('Chicken Frango Empanado',            'aves', 'un', 23.50, false,  9),
  ('Filé de Frango Empanado',            'aves', 'un', 36.00, false, 10),

  -- ---------------- PEIXES ----------------
  ('Filé de Corvina',                    'peixes', 'un', 36.40, false,  1),
  ('Filé de Tilápia',                    'peixes', 'un', 55.00, false,  2),
  ('Filé de Tilápia Empanado',           'peixes', 'un', 45.00, false,  3),

  -- ---------------- LINGUIÇAS ----------------
  ('Linguiça Mista',                     'linguica', 'kg', 17.90, false,  1),
  ('Linguiça Costela com Pimenta',       'linguica', 'kg', 26.90, false,  2),
  ('Linguiça Costela com Legumes',       'linguica', 'kg', 26.90, false,  3),
  ('Linguiça Cuiabana',                  'linguica', 'kg', 24.20, false,  4),
  ('Linguiça Toscana',                   'linguica', 'kg', 23.65, false,  5),
  ('Linguiça Caipira',                   'linguica', 'kg',  0.00, true,   6),
  ('Linguiça Cabo de Reio',              'linguica', 'kg',  9.90, false,  7),
  ('Linguiça Calabresa',                 'linguica', 'kg', 24.20, false,  8),
  ('Linguiça Calabresa Defumada',        'linguica', 'kg', 27.90, false,  9),
  ('Linguiça Codeguinho Apimentada',     'linguica', 'un', 15.25, false, 10),
  ('Linguiça Codeguinho Tradicional',    'linguica', 'un', 15.25, false, 11),

  -- ---------------- MERCEARIA ----------------
  ('Molho de Tomate Fugini',             'mercearia', 'un',  2.50, false,  1),
  ('Creme de Leite',                     'mercearia', 'un',  4.50, false,  2),
  ('Leite Condensado',                   'mercearia', 'un',  8.30, false,  3),
  ('Sazón Carnes',                       'mercearia', 'un',  7.50, false,  4),
  ('Sazón Nordeste',                     'mercearia', 'un',  7.50, false,  5),
  ('Sazón Salada',                       'mercearia', 'un',  7.50, false,  6),
  ('Maionese Fugini Sachê',              'mercearia', 'un',  5.50, false,  7),
  ('Ketchup Fugini Sachê',               'mercearia', 'un',  5.50, false,  8),
  ('Mostarda Fugini Sachê',              'mercearia', 'un',  5.50, false,  9),
  ('Azeitona sem Caroço',                'mercearia', 'un',  8.90, false, 10),
  ('Azeitona com Caroço',                'mercearia', 'un',  8.90, false, 11),
  ('Azeitona Fatiada',                   'mercearia', 'un',  8.90, false, 12),
  ('Macarrão Parafuso',                  'mercearia', 'un',  5.00, false, 13),
  ('Macarrão Espaguete',                 'mercearia', 'un',  5.00, false, 14),
  ('Farofa Mineira Costelinha com Limão','mercearia', 'un', 10.00, false, 15),
  ('Farofa Mineira Pequi',               'mercearia', 'un', 10.00, false, 16),
  ('Farofa Mineira Tradicional',         'mercearia', 'un', 10.00, false, 17),
  ('Farofa Mineira Picante',             'mercearia', 'un', 10.00, false, 18),
  ('Farofa Mineira Torresmo',            'mercearia', 'un', 10.00, false, 19),
  ('Tempero Completo',                   'mercearia', 'un',  7.80, false, 20),
  ('Sal Grosso',                         'mercearia', 'un',  3.00, false, 21),
  ('Sal de Parrilla Argentino',          'mercearia', 'un', 10.00, false, 22),
  ('Sal de Parrilla e Alho',             'mercearia', 'un', 10.00, false, 23),
  ('Sal de Parrilla e Chimichurri',      'mercearia', 'un', 10.00, false, 24),
  ('Sal de Parrilla e Lemon Pepper',     'mercearia', 'un', 10.00, false, 25),
  ('Molho para Churrasco Tradicional',   'mercearia', 'un', 12.00, false, 26),
  ('Molho para Churrasco com Pimenta',   'mercearia', 'un', 12.00, false, 27),

  -- ---------------- DIVERSOS ----------------
  ('Mandioca',                             'diversos', 'un',  9.00, false,  1),
  ('Risoles de Pizza',                     'diversos', 'un', 24.00, false,  2),
  ('Risoles de Frango',                    'diversos', 'un', 24.00, false,  3),
  ('Risoles de Carne',                     'diversos', 'un', 24.00, false,  4),
  ('Kibe',                                 'diversos', 'kg', 32.30, false,  5),
  ('Carvão',                               'diversos', 'un', 20.00, false,  6),
  ('Batata Palito',                        'diversos', 'un',  0.00, true,   7),
  ('Pão de Alho Tradicional',              'diversos', 'un', 14.30, false,  8),
  ('Pão de Alho Cheddar e Bacon',          'diversos', 'un', 14.30, false,  9),
  ('Pão de Alho Tomate Seco e Manjericão', 'diversos', 'un', 14.30, false, 10),
  ('Pão de Alho Frango Desfiado e Requeijão','diversos','un', 14.30, false, 11),
  ('Pão de Alho 4 Queijos',                'diversos', 'un', 14.30, false, 12),
  ('Queijo Coalho Lactopar',               'diversos', 'un', 26.00, false, 13),
  ('Salsicha Perdigão',                    'diversos', 'kg', 16.90, false, 14);
