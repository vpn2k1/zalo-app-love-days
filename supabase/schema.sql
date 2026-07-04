create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  zalo_user_id text unique not null,
  name text not null,
  avatar_url text,
  display_name text,
  custom_avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.couples (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  title text not null default 'Love Days',
  theme text not null default 'pastel',
  background_url text,
  created_by uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.couple_members (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null check (role in ('owner', 'partner')),
  side text not null check (side in ('left', 'right')),
  joined_at timestamptz not null default now(),
  unique (couple_id, user_id)
);

create table if not exists public.anniversaries (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  title text not null,
  date date not null,
  repeat_type text not null default 'yearly' check (repeat_type in ('yearly', 'none')),
  note text,
  image_url text,
  created_by uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.anniversaries
add column if not exists image_url text;

alter table public.couples
add column if not exists background_url text;

insert into storage.buckets (id, name, public)
values ('love-days-media', 'love-days-media', true)
on conflict (id) do update set public = true;

create table if not exists public.partner_invites (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  invite_code text unique not null,
  invited_by uuid not null references public.users(id) on delete cascade,
  accepted_by uuid references public.users(id) on delete set null,
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'expired', 'cancelled')
  ),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

create index if not exists couple_members_user_id_idx on public.couple_members(user_id);
create index if not exists couple_members_couple_id_idx on public.couple_members(couple_id);
create index if not exists anniversaries_couple_id_idx on public.anniversaries(couple_id);
create index if not exists partner_invites_invite_code_idx on public.partner_invites(invite_code);
create unique index if not exists couple_members_couple_side_unique_idx
on public.couple_members(couple_id, side);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists couples_set_updated_at on public.couples;
create trigger couples_set_updated_at
before update on public.couples
for each row execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.couples enable row level security;
alter table public.couple_members enable row level security;
alter table public.anniversaries enable row level security;
alter table public.partner_invites enable row level security;

-- Zalo Mini App client currently uses anon key directly. For production, replace
-- these permissive policies with an authenticated backend or Supabase Edge Functions.
create policy "anon users access" on public.users
for all using (true) with check (true);

create policy "anon couples access" on public.couples
for all using (true) with check (true);

create policy "anon members access" on public.couple_members
for all using (true) with check (true);

create policy "anon anniversaries access" on public.anniversaries
for all using (true) with check (true);

create policy "anon invites access" on public.partner_invites
for all using (true) with check (true);

drop policy if exists "anon love days media read" on storage.objects;
create policy "anon love days media read" on storage.objects
for select using (bucket_id = 'love-days-media');

drop policy if exists "anon love days media insert" on storage.objects;
create policy "anon love days media insert" on storage.objects
for insert with check (bucket_id = 'love-days-media');

drop policy if exists "anon love days media update" on storage.objects;
create policy "anon love days media update" on storage.objects
for update using (bucket_id = 'love-days-media') with check (bucket_id = 'love-days-media');
