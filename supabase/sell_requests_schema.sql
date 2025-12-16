-- ============================================
-- SELL REQUESTS TABLE (Instant / Limit)
-- ============================================
create table if not exists public.sell_requests (
    id uuid primary key default gen_random_uuid(),
    option_id text not null,
    inventory_id text not null,
    mode text not null check (mode in ('instant','limit')),
    limit_price integer,
    status text not null default 'pending', -- pending, processing, filled, cancelled
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create index if not exists idx_sell_requests_inventory on public.sell_requests(inventory_id);
create index if not exists idx_sell_requests_status on public.sell_requests(status);

alter table public.sell_requests enable row level security;
create policy "Anyone can insert sell requests" on public.sell_requests for insert with check (true);
create policy "Anyone can view own sell requests" on public.sell_requests for select using (true);

create or replace function public.update_sell_requests_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_sell_requests_updated on public.sell_requests;
create trigger trg_sell_requests_updated
before update on public.sell_requests
for each row execute function public.update_sell_requests_updated_at();

