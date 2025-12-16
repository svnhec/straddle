-- ============================================
-- PRICE HISTORY TABLE
-- ============================================
-- Stores historical prices per inventory item for charts.

create table if not exists public.price_history (
    id uuid primary key default gen_random_uuid(),
    inventory_id text not null references public.inventory(id) on delete cascade,
    price integer not null,               -- Price in dollars (aligns with inventory.price)
    recorded_at timestamp with time zone default now()
);

create index if not exists idx_price_history_inventory on public.price_history(inventory_id);
create index if not exists idx_price_history_recorded on public.price_history(recorded_at desc);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.price_history enable row level security;
create policy "Anyone can read price history" on public.price_history
    for select using (true);

-- Inserts/updates should be done by service/admin (default RLS)

