-- ============================================
-- MARKET FEED PIPELINE (auto insert on inventory price change)
-- ============================================
-- Computes change_percent vs previous price and stores a contextual reason placeholder.

-- Ensure inventory has a previous price to compare
do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_name = 'inventory'
      and column_name = 'previous_price'
  ) then
    alter table public.inventory add column previous_price integer;
  end if;
end $$;

-- Function to populate market_feed + price_history on inventory update
create or replace function public.handle_inventory_price_change()
returns trigger as $$
declare
  delta integer := 0;
begin
  if NEW.price is null or OLD.price is null then
    return NEW;
  end if;

  if OLD.price = 0 then
    delta := 0;
  else
    delta := round(((NEW.price - OLD.price)::numeric / OLD.price::numeric) * 100);
  end if;

  -- Insert into price_history
  insert into public.price_history (inventory_id, price)
  values (NEW.id, NEW.price);

  -- Insert into market_feed if delta not zero
  if delta <> 0 then
    insert into public.market_feed (inventory_id, change_percent, reason)
    values (
      NEW.id,
      delta,
      case 
        when delta > 0 then 'Premium en hausse (demande forte)'
        else 'Premium en baisse (opportunité d’entrée)'
      end
    );
  end if;

  -- Keep a previous_price column updated (optional for debugging)
  NEW.previous_price := OLD.price;

  return NEW;
end;
$$ language plpgsql;

-- Trigger on inventory price change
drop trigger if exists trg_inventory_price_change on public.inventory;
create trigger trg_inventory_price_change
before update of price on public.inventory
for each row
when (OLD.price is distinct from NEW.price)
execute function public.handle_inventory_price_change();

