-- 1) Create Coupons table
create table public.coupons (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  discount_type text not null check (discount_type in ('fixed', 'percentage')),
  discount_value numeric(10, 2) not null,
  min_booking_amount numeric(10, 2) default 0.00,
  max_uses integer,
  used_count integer default 0,
  expires_at timestamptz,
  active boolean default true,
  created_at timestamptz default now()
);

-- 2) Update Bookings table to track used coupons
alter table public.bookings add column coupon_id uuid references public.coupons(id) on delete set null;

-- 3) Enable RLS on coupons
alter table public.coupons enable row level security;

-- 4) Policies for Coupons
-- Public can READ active coupons (to validate during booking)
create policy "Allow public read active coupons" on public.coupons
  for select using (active = true and (expires_at is null or expires_at > now()));

-- 5) Add review_request_sent flag to bookings
alter table public.bookings add column review_request_sent boolean default false;
alter table public.bookings add column retention_reminder_sent boolean default false;

-- 6) Audit Log entries for Marketing
insert into public.audit_log (admin_id, action, table_name, record_id, payload)
values (null, 'marketing.init', 'system', '00000000-0000-0000-0000-000000000000', '{"info": "Marketing system initialized"}');
