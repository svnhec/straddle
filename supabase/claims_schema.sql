-- ============================================
-- CLAIMS TABLE (tickets to claim)
-- ============================================
create table if not exists public.claims (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    event_date timestamp with time zone,
    reserved_price integer not null,
    market_price integer not null,
    status text not null default 'ready', -- ready, claimed, expired
    claim_start timestamp with time zone,
    claim_end timestamp with time zone,
    inventory_id text not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create index if not exists idx_claims_inventory on public.claims(inventory_id);
create index if not exists idx_claims_status on public.claims(status);

alter table public.claims enable row level security;
create policy "Anyone can read claims" on public.claims for select using (true);
create policy "Anyone can update claim status" on public.claims for update using (true);

create or replace function public.update_claims_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_claims_updated on public.claims;
create trigger trg_claims_updated
before update on public.claims
for each row execute function public.update_claims_updated_at();

