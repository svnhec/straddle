-- INVENTORY TABLE
create table if not exists public.inventory (
    id text primary key,
    title text not null,
    description text not null,
    price integer not null,
    face_value integer,
    status text not null check (status in ('available', 'sold_out')),
    remaining integer default 0,
    stripe_link text not null,
    tags text[] default '{}',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- SEED DATA
insert into public.inventory (id, title, description, price, face_value, status, remaining, stripe_link, tags)
values
    ('opt_rouge', 'Zone Rouges (Premium)', 'Siège garanti niveau glace (Sec 100-124). Vue imprenable.', 95, 350, 'sold_out', 0, 'https://buy.stripe.com/test_5kQ7sK7YF0282Xx6EZ7kc00', ARRAY['Best Seller', 'Niveau 100']),
    ('opt_desjardins', 'Club Desjardins (VIP)', 'Nourriture et boissons à volonté incluses. Accès Lounge privé.', 125, 500, 'sold_out', 0, 'https://buy.stripe.com/test_bJe14m92J5mscy74wR7kc01', ARRAY['All Inclusive', 'VIP']),
    ('opt_blancs', 'Zone Blancs (Fan Zone)', 'L''ambiance électrique des vrais fans. Section 300 centrale.', 59, 150, 'sold_out', 0, 'https://buy.stripe.com/test_6oU4gydiZ7uA41B6EZ7kc02', ARRAY['Budget', 'Ambiance'])
on conflict (id) do nothing;

-- RLS
alter table public.inventory enable row level security;
create policy "Anyone can view inventory" on public.inventory for select using (true);

