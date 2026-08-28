-- =============================================================
--  CASA DE CARNES MACIEL — Esquema do banco (Supabase / PostgreSQL)
--  Rode este arquivo no Supabase: Dashboard -> SQL Editor -> New query
-- =============================================================

-- Necessário para gerar UUID (no Supabase geralmente já vem habilitado)
create extension if not exists "pgcrypto";

-- -------------------------------------------------------------
-- 1) TABELA PRODUTOS
-- -------------------------------------------------------------
create table if not exists public.produtos (
  id                uuid primary key default gen_random_uuid(),
  nome              text not null,
  descricao         text,
  categoria         text not null
                    check (categoria in ('bovinos','suinos','aves','linguica','temperados')),
  preco_kg          numeric(10,2) not null check (preco_kg >= 0),
  preco_oferta_kg   numeric(10,2) check (preco_oferta_kg >= 0),
  em_oferta         boolean not null default false,
  esgotado          boolean not null default false,
  cortes            text[] not null default '{}'  -- cortes disponíveis: bife/manta/cubos/moida (vazio = não recebe corte)
                    check (cortes <@ array['bife','manta','cubos','moida']::text[]),
  permite_tempero   boolean not null default false, -- mostra a opção "Vai temperada?" no site
  imagem_url        text,          -- "path" do arquivo no Storage (bucket "produtos")
  ordem             integer not null default 0,   -- controla a ordem de exibição
  criado_em         timestamptz not null default now(),
  atualizado_em     timestamptz not null default now()
);

-- Índices para as consultas mais comuns da vitrine
create index if not exists produtos_categoria_idx on public.produtos (categoria);
create index if not exists produtos_oferta_idx    on public.produtos (em_oferta) where em_oferta;

-- Mantém "atualizado_em" sempre em dia
create or replace function public.tg_set_atualizado_em()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists set_atualizado_em on public.produtos;
create trigger set_atualizado_em
  before update on public.produtos
  for each row execute function public.tg_set_atualizado_em();


-- -------------------------------------------------------------
-- 2) QUEM É ADMIN?
--    Opção recomendada: uma tabela de administradores.
--    (mais limpo do que colar um UUID fixo dentro da policy)
-- -------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  criado_em timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Cada admin só enxerga a própria linha (ninguém lista todos os admins)
drop policy if exists "admin ve a si mesmo" on public.admins;
create policy "admin ve a si mesmo"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid());

-- Função auxiliar: retorna true se o usuário logado é admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;


-- -------------------------------------------------------------
-- 3) ROW LEVEL SECURITY na tabela produtos
--    SELECT  -> liberado para todo mundo (catálogo público)
--    INSERT/UPDATE/DELETE -> só admin
-- -------------------------------------------------------------
alter table public.produtos enable row level security;

drop policy if exists "produtos: leitura publica"  on public.produtos;
drop policy if exists "produtos: admin insere"     on public.produtos;
drop policy if exists "produtos: admin atualiza"   on public.produtos;
drop policy if exists "produtos: admin deleta"     on public.produtos;

create policy "produtos: leitura publica"
  on public.produtos for select
  using (true);

create policy "produtos: admin insere"
  on public.produtos for insert
  to authenticated
  with check (public.is_admin());

create policy "produtos: admin atualiza"
  on public.produtos for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "produtos: admin deleta"
  on public.produtos for delete
  to authenticated
  using (public.is_admin());


-- -------------------------------------------------------------
--  >>> ALTERNATIVA SIMPLES (sem a tabela admins) <<<
--  Se preferir travar direto num UUID, comente o bloco 2 e 3 acima
--  e use isto, trocando o UUID pelo id do seu usuário
--  (Supabase -> Authentication -> Users -> copiar "User UID"):
--
--  create policy "produtos: admin escreve"
--    on public.produtos for all
--    to authenticated
--    using  (auth.uid() = '00000000-0000-0000-0000-000000000000')
--    with check (auth.uid() = '00000000-0000-0000-0000-000000000000');
-- -------------------------------------------------------------


-- -------------------------------------------------------------
-- 4) STORAGE — bucket público "produtos" para as fotos
-- -------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('produtos', 'produtos', true)
on conflict (id) do nothing;

drop policy if exists "storage produtos: leitura publica" on storage.objects;
drop policy if exists "storage produtos: admin envia"     on storage.objects;
drop policy if exists "storage produtos: admin atualiza"  on storage.objects;
drop policy if exists "storage produtos: admin deleta"    on storage.objects;

create policy "storage produtos: leitura publica"
  on storage.objects for select
  using (bucket_id = 'produtos');

create policy "storage produtos: admin envia"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'produtos' and public.is_admin());

create policy "storage produtos: admin atualiza"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'produtos' and public.is_admin());

create policy "storage produtos: admin deleta"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'produtos' and public.is_admin());


-- -------------------------------------------------------------
-- 5) DEPOIS DE CRIAR SEU USUÁRIO (Authentication -> Add user),
--    registre-o como admin rodando (troque o e-mail):
--
--  insert into public.admins (user_id)
--  select id from auth.users where email = 'dono@casadecarnesmaciel.com';
-- -------------------------------------------------------------


-- -------------------------------------------------------------
-- 6) DADOS DE EXEMPLO (opcional — pode apagar)
-- -------------------------------------------------------------
insert into public.produtos (nome, categoria, preco_kg, preco_oferta_kg, em_oferta, esgotado, ordem)
values
  ('Contra Filé',        'bovinos',    48.50, 42.90, true,  false, 1),
  ('Picanha',            'bovinos',    89.90, null,  false, false, 2),
  ('Costela Bovina',     'bovinos',    32.00, null,  false, true,  3),
  ('Bisteca Suína',      'suinos',     24.90, null,  false, false, 1),
  ('Pernil sem Osso',    'suinos',     27.50, 23.90, true,  false, 2),
  ('Coxa e Sobrecoxa',   'aves',       14.90, null,  false, false, 1),
  ('Peito de Frango',    'aves',       18.90, null,  false, false, 2),
  ('Linguiça Toscana',   'linguica',   25.00, null,  false, false, 1),
  ('Linguiça Cuiabana',  'linguica',   28.00, null,  false, false, 2),
  ('Picanha Temperada',  'temperados', 94.90, null,  false, false, 1),
  ('Frango a Passarinho Temperado', 'temperados', 19.90, 16.90, true, false, 2)
on conflict do nothing;
