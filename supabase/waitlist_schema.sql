-- WAITLIST TABLE
create table if not exists public.waitlist (
    id uuid primary key default gen_random_uuid(),
    email text not null,
    product_id text not null,
    product_name text,
    created_at timestamp with time zone default now(),
    unique(email, product_id)
);

-- NEWSLETTER TABLE
create table if not exists public.newsletter (
    id uuid primary key default gen_random_uuid(),
    email text not null unique,
    subscribed_at timestamp with time zone default now(),
    is_active boolean default true
);

-- RLS
alter table public.waitlist enable row level security;
alter table public.newsletter enable row level security;

create policy "Anyone can signup for waitlist" on public.waitlist for insert with check (true);
create policy "Anyone can signup for newsletter" on public.newsletter for insert with check (true);

