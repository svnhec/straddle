-- ============================================
-- MARKET FEED TABLE (Volatility Context)
-- ============================================
-- Stores contextual reasons and price deltas per option
-- For display in the MarketFeed component

create table if not exists public.market_feed (
    id uuid primary key default gen_random_uuid(),
    inventory_id text not null references public.inventory(id) on delete cascade,
    change_percent integer not null, -- e.g. +12 or -6
    reason text,                     -- "Victoire contre OTT hier soir"
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create index if not exists idx_market_feed_inventory on public.market_feed(inventory_id);
create index if not exists idx_market_feed_created on public.market_feed(created_at desc);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table public.market_feed enable row level security;
create policy "Anyone can read market feed" on public.market_feed
    for select using (true);

-- For now, allow inserts from service/admin only (default with RLS); adjust as needed

-- ============================================
-- TRIGGERS (update updated_at)
create or replace function update_market_feed_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger trg_market_feed_updated
before update on public.market_feed
for each row execute function update_market_feed_updated_at();

