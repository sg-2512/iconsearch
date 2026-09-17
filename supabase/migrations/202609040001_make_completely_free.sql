-- Migration: 202609040001_make_completely_free.sql
-- Description: Transition IconSearch to 100% completely free forever for all users.
-- Removes artificial 500-founder limits, ensures all current and future users get active lifetime entitlements,
-- and raises agent search/retrieve daily quotas to generous community limits.

-- 1. Update all products to have unlimited capacity
update public.products
set founder_limit = 2147483647,
    updated_at = now();

-- 2. Ensure agent usage limits are generous for the free tier
insert into public.agent_usage_limits (tier, action, daily_limit)
values
  ('free', 'search', 10000),
  ('free', 'retrieve', 20000),
  ('founder', 'search', 10000),
  ('founder', 'retrieve', 20000)
on conflict (tier, action) do update
set daily_limit = excluded.daily_limit,
    updated_at = now();

-- 3. Replace claim_product_entitlement to guarantee all accounts receive active lifetime access
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
begin
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text || ':' || p_product, 0));

  -- If entitlement already exists, return it directly
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

  -- Ensure profile exists
  begin
    insert into public.profiles (id, plan, is_internal)
    values (p_user_id, 'free', false)
    on conflict (id) do nothing;
  exception
    when others then
      null;
  end;

  -- Ensure product exists
  select * into v_product
  from public.products
  where id = p_product
  for update;

  if not found then
    insert into public.products (id, name, founder_limit)
    values (p_product, 'IconSearch for ' || initcap(p_product), 2147483647)
    returning * into v_product;
  end if;

  -- Increment product claim counter for tracking total active community users
  v_founder_number := coalesce(v_product.founder_claimed, 0) + 1;
  update public.products
  set founder_claimed = v_founder_number, updated_at = now()
  where id = p_product;

  -- Grant 100% Free Lifetime Entitlement
  insert into public.entitlements (user_id, product, tier, status, founder_number)
  values (p_user_id, p_product, 'free', 'active', v_founder_number)
  returning * into v_entitlement;

  -- Audit event
  insert into public.entitlement_events (
    entitlement_id,
    user_id,
    product,
    event_type,
    metadata
  ) values (
    v_entitlement.id,
    p_user_id,
    p_product,
    'claimed_free_lifetime',
    jsonb_build_object(
      'free_forever', true,
      'claim_number', v_founder_number
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

revoke all on function public.claim_product_entitlement(uuid, text) from public;
grant execute on function public.claim_product_entitlement(uuid, text) to service_role;
