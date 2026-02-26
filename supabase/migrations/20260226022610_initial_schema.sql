-- 1) Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "btree_gist"; -- Required for exclusion constraints on time ranges

-- 2) Define Tables

-- Services
create table public.services (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text,
  duration_min integer not null default 60,
  buffer_min integer not null default 15,
  price_from numeric(10, 2) not null default 0.00,
  active boolean default true,
  created_at timestamptz default now()
);

-- Staff (Optional for multiple groomers, we'll keep it simple but extensible)
create table public.staff (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Schedules (Working hours per day of week)
-- day_of_week: 0 = Sunday, 1 = Monday, ... 6 = Saturday
create table public.schedules (
  id uuid primary key default uuid_generate_v4(),
  staff_id uuid references public.staff(id) on delete cascade on update cascade,
  day_of_week integer not null check (day_of_week >= 0 and day_of_week <= 6),
  start_time time not null,
  end_time time not null,
  breaks jsonb default '[]'::jsonb, -- e.g., [{"start": "13:00", "end": "14:00"}]
  created_at timestamptz default now(),
  unique(staff_id, day_of_week)
);

-- Schedule Exceptions (Holidays or custom closed days)
create table public.schedule_exceptions (
  id uuid primary key default uuid_generate_v4(),
  date date not null,
  is_closed boolean default true,
  start_time time, -- only used if is_closed = false
  end_time time,   -- only used if is_closed = false
  notes text,
  created_at timestamptz default now(),
  unique(date)
);

-- Customers
create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  email text,
  created_at timestamptz default now()
);

-- Bookings
-- Using btree_gist for non-overlapping time ranges for a specific staff member
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  service_id uuid not null references public.services(id) on delete restrict,
  staff_id uuid references public.staff(id) on delete restrict,
  
  start_at timestamptz not null,
  end_at timestamptz not null, -- start_at + service.duration + service.buffer
  
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'canceled', 'no_show')),
  
  pet_type text not null,
  breed text,
  weight_kg text,
  notes text,
  source text default 'website',
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add Exclusion constraint: Ensure a staff member cannot have overlapping bookings
-- A booking overlaps if the tsranges (start_at, end_at) intersect
alter table public.bookings 
add constraint bookings_no_overlap 
exclude using gist (
  staff_id with =,
  tstzrange(start_at, end_at) with &&
) where (status in ('pending', 'confirmed'));


-- Notification Outbox (Processed by Edge Functions)
create table public.notification_outbox (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  channel text not null check (channel in ('email', 'sms')),
  "to" text not null,
  template text not null, -- e.g., 'booking_confirmation', 'reminder_24h'
  payload jsonb not null default '{}'::jsonb,
  
  status text not null default 'pending' check (status in ('pending', 'processing', 'sent', 'failed')),
  attempts integer not null default 0,
  last_error text,
  provider_message_id text,
  
  run_at timestamptz not null default now(), -- When to send (e.g., now, or 24h before booking)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create updated_at trigger for bookings and outbox
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_bookings_updated_at
  before update on public.bookings
  for each row execute function public.handle_updated_at();

create trigger set_notification_outbox_updated_at
  before update on public.notification_outbox
  for each row execute function public.handle_updated_at();

-- 3) Row Level Security (RLS)

-- Enable RLS on all tables
alter table public.services enable row level security;
alter table public.staff enable row level security;
alter table public.schedules enable row level security;
alter table public.schedule_exceptions enable row level security;
alter table public.customers enable row level security;
alter table public.bookings enable row level security;
alter table public.notification_outbox enable row level security;

-- Policies for public (anon) access:
-- Anyone can READ active services
create policy "Allow public read active services" on public.services
  for select using (active = true);

-- Anyone can CREATE a customer (when booking)
create policy "Allow public insert customer" on public.customers
  for insert with check (true);

-- Anyone can CREATE a booking
create policy "Allow public insert booking" on public.bookings
  for insert with check (true);

-- Anyone can READ schedules & exceptions to see availability
create policy "Allow public read schedules" on public.schedules
  for select using (true);

create policy "Allow public read exceptions" on public.schedule_exceptions
  for select using (true);

-- Public cannot READ customers, bookings, or outbox. They cannot UPDATE/DELETE anything.
-- Only authenticated Admins (using service role or authenticated role in the future) can manage these.

-- NOTE: To keep the MVP simple and ultra-fast, Admin operations will be performed 
-- via Next.js Server Actions using the `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS entirely.
-- Alternatively, if setting up proper auth, we would define permissive policies for `auth.uid()`.

-- 4) Seed Initial Data

insert into public.services (slug, name, duration_min, buffer_min, price_from) values
  ('full-grooming', 'Πλήρης Καλλωπισμός', 120, 15, 35.00),
  ('bath-brush', 'Μπάνιο & Βούρτσισμα', 60, 10, 20.00),
  ('deshedding', 'Απομάκρυνση Νεκρής Τρίχας (Deshedding)', 90, 15, 30.00),
  ('puppy', 'Περιποίηση Κουταβιού', 60, 10, 20.00),
  ('nails-ears', 'Κόψιμο Νυχιών & Καθαρισμός Αυτιών', 15, 5, 5.00);

-- Insert dummy staff member to track overlapping rules
insert into public.staff (id, name) values ('00000000-0000-0000-0000-000000000001', 'Γιώργος (Main Groomer)');

-- Insert basic working hours (Monday-Friday 09:00 - 18:00, Sat: 10:00 - 15:00)
insert into public.schedules (staff_id, day_of_week, start_time, end_time, breaks) values
  ('00000000-0000-0000-0000-000000000001', 1, '09:00', '18:00', '[]'),
  ('00000000-0000-0000-0000-000000000001', 2, '09:00', '18:00', '[]'),
  ('00000000-0000-0000-0000-000000000001', 3, '09:00', '18:00', '[]'),
  ('00000000-0000-0000-0000-000000000001', 4, '09:00', '18:00', '[]'),
  ('00000000-0000-0000-0000-000000000001', 5, '09:00', '18:00', '[]'),
  ('00000000-0000-0000-0000-000000000001', 6, '10:00', '15:00', '[]');
