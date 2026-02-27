-- ============================================================
-- Blocked Time Ranges + Booking Reschedule History
-- ============================================================

-- 1) Blocked time ranges (admin can block ad-hoc hours)
create table public.blocked_times (
  id uuid primary key default uuid_generate_v4(),
  staff_id uuid references public.staff(id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz not null,
  reason text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  constraint blocked_times_valid_range check (end_at > start_at)
);

create index idx_blocked_times_range on public.blocked_times (start_at, end_at);

alter table public.blocked_times enable row level security;

create policy "Admins can manage blocked_times" on public.blocked_times
  for all using (public.is_admin());

-- Public needs to read blocked_times for slot generation
create policy "Public can read blocked_times" on public.blocked_times
  for select using (true);


-- 2) Booking reschedule history
create table public.booking_reschedules (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  old_start_at timestamptz not null,
  old_end_at timestamptz not null,
  new_start_at timestamptz not null,
  new_end_at timestamptz not null,
  admin_id uuid references auth.users(id) on delete set null,
  rescheduled_at timestamptz default now()
);

create index idx_reschedules_booking on public.booking_reschedules (booking_id);

alter table public.booking_reschedules enable row level security;

create policy "Admins can manage reschedules" on public.booking_reschedules
  for all using (public.is_admin());
