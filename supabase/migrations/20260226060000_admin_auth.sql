-- ============================================================
-- Admin Auth: Profiles, Audit Log, and Admin RLS policies
-- ============================================================

-- 1) Add phone_e164 and admin_notes to customers
alter table public.customers
  add column if not exists phone_e164 text,
  add column if not exists admin_notes text;

-- Backfill phone_e164 from existing phone where it has 10 digits (Greek mobile)
update public.customers
set phone_e164 = '+30' || regexp_replace(phone, '\D', '', 'g')
where phone_e164 is null
  and length(regexp_replace(phone, '\D', '', 'g')) = 10;


-- 2) Profiles table (one per auth.users row)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 3) Audit Log table
create table public.audit_log (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,          -- e.g. 'booking.status_changed', 'service.created'
  table_name text,
  record_id uuid,
  payload jsonb,
  created_at timestamptz default now()
);

alter table public.audit_log enable row level security;


-- ============================================================
-- 4) Helper function: check if current user is admin
-- ============================================================
create or replace function public.is_admin()
returns boolean as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$ language sql security definer stable;


-- ============================================================
-- 5) RLS Policies (Admin full access via is_admin())
-- ============================================================

-- Profiles: users can read their own, admins can read all
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Admins can view all profiles" on public.profiles
  for select using (public.is_admin());

create policy "Admins can update profiles" on public.profiles
  for update using (public.is_admin());

-- Customers: admin full access
create policy "Admins can read customers" on public.customers
  for select using (public.is_admin());

create policy "Admins can update customers" on public.customers
  for update using (public.is_admin());

create policy "Admins can delete customers" on public.customers
  for delete using (public.is_admin());

-- Bookings: admin full access
create policy "Admins can read bookings" on public.bookings
  for select using (public.is_admin());

create policy "Admins can update bookings" on public.bookings
  for update using (public.is_admin());

create policy "Admins can delete bookings" on public.bookings
  for delete using (public.is_admin());

-- Services: admin full CRUD
create policy "Admins can read services" on public.services
  for select using (public.is_admin());

create policy "Admins can insert services" on public.services
  for insert with check (public.is_admin());

create policy "Admins can update services" on public.services
  for update using (public.is_admin());

create policy "Admins can delete services" on public.services
  for delete using (public.is_admin());

-- Schedules: admin full CRUD
create policy "Admins can manage schedules" on public.schedules
  for all using (public.is_admin());

create policy "Admins can manage exceptions" on public.schedule_exceptions
  for all using (public.is_admin());

-- Notification outbox: admin full access
create policy "Admins can read outbox" on public.notification_outbox
  for select using (public.is_admin());

create policy "Admins can update outbox" on public.notification_outbox
  for update using (public.is_admin());

-- Audit log: admin read-only
create policy "Admins can read audit log" on public.audit_log
  for select using (public.is_admin());

-- Audit log: only service role can insert (via Server Actions)
-- (No insert policy = only service_role bypasses RLS)


-- ============================================================
-- 6) Seed: Promote first admin user
-- ============================================================
-- After creating your first user via Supabase Auth, run:
-- UPDATE public.profiles SET is_admin = true WHERE id = 'YOUR_USER_UUID';
