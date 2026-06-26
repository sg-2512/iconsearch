create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  is_internal boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists is_internal boolean not null default false,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.products (
  id text primary key check (id in ('vscode', 'figma')),
  name text not null,
  founder_limit integer not null default 500 check (founder_limit >= 0),
  founder_claimed integer not null default 0 check (founder_claimed >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (founder_claimed <= founder_limit)
);

insert into public.products (id, name, founder_limit)
values
  ('vscode', 'IconSearch for VS Code', 500),
  ('figma', 'IconSearch for Figma', 500)
on conflict (id) do update
set name = excluded.name,
    founder_limit = excluded.founder_limit,
    updated_at = now();

create table if not exists public.entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product text not null references public.products(id) on delete cascade,
  tier text not null check (tier in ('free', 'founder')),
  status text not null default 'active' check (status in ('active', 'revoked')),
  founder_number integer,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product),
  check (
    (tier = 'founder' and founder_number is not null) or
    (tier = 'free' and founder_number is null)
  )
);

create unique index if not exists entitlements_founder_number_idx
  on public.entitlements(product, founder_number)
  where founder_number is not null;

create table if not exists public.device_codes (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique,
  product text not null references public.products(id) on delete cascade,
  client_name text not null default 'IconSearch',
  request_fingerprint text,
  expires_at timestamptz not null,
  approved_by uuid references auth.users(id) on delete set null,
  entitlement_id uuid references public.entitlements(id) on delete set null,
  approved_at timestamptz,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists device_codes_rate_limit_idx
  on public.device_codes(request_fingerprint, created_at desc);

create table if not exists public.extension_sessions (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  product text not null references public.products(id) on delete cascade,
  entitlement_id uuid not null references public.entitlements(id) on delete cascade,
  expires_at timestamptz not null,
  last_seen_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists extension_sessions_user_product_idx
  on public.extension_sessions(user_id, product);

create table if not exists public.usage_daily (
  user_id uuid not null references auth.users(id) on delete cascade,
  product text not null references public.products(id) on delete cascade,
  usage_date date not null default current_date,
  action text not null,
  quantity integer not null default 0 check (quantity >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, product, usage_date, action)
);

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  product text not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (email, product)
);

create table if not exists public.entitlement_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  product text not null references public.products(id) on delete cascade,
  entitlement_id uuid references public.entitlements(id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, plan)
  values (new.id, 'free')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.claim_product_entitlement(
  p_user_id uuid,
  p_product text
)
returns table (
  product_id text,
  entitlement_id uuid,
  entitlement_tier text,
  entitlement_status text,
  entitlement_founder_number integer,
  entitlement_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_product public.products%rowtype;
  v_entitlement public.entitlements%rowtype;
  v_founder_number integer;
  v_is_internal boolean := false;
begin
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text || ':' || p_product, 0));

  select * into v_entitlement
  from public.entitlements
  where user_id = p_user_id and product = p_product
  for update;

  if found then
    return query select
      v_entitlement.product,
      v_entitlement.id,
      v_entitlement.tier,
      v_entitlement.status,
      v_entitlement.founder_number,
      v_entitlement.expires_at;
    return;
  end if;

  select coalesce(is_internal, false) into v_is_internal
  from public.profiles
  where id = p_user_id;

  select * into v_product
  from public.products
  where id = p_product
  for update;

  if not found then
    raise exception 'unknown_product';
  end if;

  if not v_is_internal and v_product.founder_claimed < v_product.founder_limit then
    v_founder_number := v_product.founder_claimed + 1;
    update public.products
    set founder_claimed = v_founder_number, updated_at = now()
    where id = p_product;

    insert into public.entitlements (user_id, product, tier, founder_number)
    values (p_user_id, p_product, 'founder', v_founder_number)
    returning * into v_entitlement;
  else
    insert into public.entitlements (user_id, product, tier)
    values (p_user_id, p_product, 'free')
    returning * into v_entitlement;
  end if;

  insert into public.entitlement_events (
    user_id, product, entitlement_id, event_type, metadata
  )
  values (
    p_user_id,
    p_product,
    v_entitlement.id,
    'entitlement_created',
    jsonb_build_object(
      'tier', v_entitlement.tier,
      'founder_number', v_entitlement.founder_number
    )
  );

  return query select
    v_entitlement.product,
    v_entitlement.id,
    v_entitlement.tier,
    v_entitlement.status,
    v_entitlement.founder_number,
    v_entitlement.expires_at;
end;
$$;

create or replace function public.approve_device_code(
  p_code_hash text,
  p_user_id uuid
)
returns table (
  product_id text,
  entitlement_id uuid,
  entitlement_tier text,
  entitlement_status text,
  entitlement_founder_number integer,
  entitlement_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code public.device_codes%rowtype;
  v_claim record;
begin
  select * into v_code
  from public.device_codes
  where code_hash = p_code_hash
  for update;

  if not found then raise exception 'invalid_device_code'; end if;
  if v_code.expires_at <= now() then raise exception 'expired_device_code'; end if;
  if v_code.consumed_at is not null then raise exception 'consumed_device_code'; end if;
  if v_code.approved_by is not null and v_code.approved_by <> p_user_id then
    raise exception 'device_code_already_approved';
  end if;

  select * into v_claim
  from public.claim_product_entitlement(p_user_id, v_code.product);

  update public.device_codes
  set approved_by = p_user_id,
      entitlement_id = v_claim.entitlement_id,
      approved_at = coalesce(approved_at, now())
  where id = v_code.id;

  return query select
    v_claim.product_id::text,
    v_claim.entitlement_id::uuid,
    v_claim.entitlement_tier::text,
    v_claim.entitlement_status::text,
    v_claim.entitlement_founder_number::integer,
    v_claim.entitlement_expires_at::timestamptz;
end;
$$;

create or replace function public.consume_device_code(
  p_code_hash text,
  p_token_hash text,
  p_session_expires_at timestamptz
)
returns table (
  session_id uuid,
  session_user_id uuid,
  session_product text,
  session_entitlement_id uuid,
  entitlement_tier text,
  entitlement_founder_number integer,
  session_expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code public.device_codes%rowtype;
  v_entitlement public.entitlements%rowtype;
  v_session public.extension_sessions%rowtype;
begin
  select * into v_code
  from public.device_codes
  where code_hash = p_code_hash
  for update;

  if not found then raise exception 'invalid_device_code'; end if;
  if v_code.expires_at <= now() then raise exception 'expired_device_code'; end if;
  if v_code.approved_by is null or v_code.entitlement_id is null then
    raise exception 'authorization_pending';
  end if;
  if v_code.consumed_at is not null then raise exception 'consumed_device_code'; end if;

  select * into v_entitlement
  from public.entitlements
  where id = v_code.entitlement_id and status = 'active';

  if not found then raise exception 'inactive_entitlement'; end if;

  insert into public.extension_sessions (
    token_hash, user_id, product, entitlement_id, expires_at
  )
  values (
    p_token_hash,
    v_code.approved_by,
    v_code.product,
    v_code.entitlement_id,
    p_session_expires_at
  )
  returning * into v_session;

  update public.device_codes
  set consumed_at = now()
  where id = v_code.id;

  insert into public.entitlement_events (
    user_id, product, entitlement_id, event_type, metadata
  )
  values (
    v_code.approved_by,
    v_code.product,
    v_code.entitlement_id,
    'device_connected',
    jsonb_build_object('session_id', v_session.id)
  );

  return query select
    v_session.id,
    v_session.user_id,
    v_session.product,
    v_session.entitlement_id,
    v_entitlement.tier,
    v_entitlement.founder_number,
    v_session.expires_at;
end;
$$;

revoke all on function public.claim_product_entitlement(uuid, text) from public;
revoke all on function public.approve_device_code(text, uuid) from public;
revoke all on function public.consume_device_code(text, text, timestamptz) from public;
grant execute on function public.claim_product_entitlement(uuid, text) to service_role;
grant execute on function public.approve_device_code(text, uuid) to service_role;
grant execute on function public.consume_device_code(text, text, timestamptz) to service_role;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.entitlements enable row level security;
alter table public.device_codes enable row level security;
alter table public.extension_sessions enable row level security;
alter table public.usage_daily enable row level security;
alter table public.waitlist enable row level security;
alter table public.entitlement_events enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists products_read_all on public.products;
create policy products_read_all
  on public.products for select
  to anon, authenticated
  using (true);

drop policy if exists entitlements_select_own on public.entitlements;
create policy entitlements_select_own
  on public.entitlements for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists usage_daily_select_own on public.usage_daily;
create policy usage_daily_select_own
  on public.usage_daily for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists waitlist_select_own on public.waitlist;
create policy waitlist_select_own
  on public.waitlist for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists entitlement_events_select_own on public.entitlement_events;
create policy entitlement_events_select_own
  on public.entitlement_events for select
  to authenticated
  using ((select auth.uid()) = user_id);
