-- 1) Enable pg_cron (if available on your Supabase plan, usually Pro or higher)
-- Or use Supabase HTTP Hooks / Edge Function triggers
-- This SQL sets up a scheduled trigger to process the notification outbox every minute

-- Note: On many Supabase local environments, pg_cron might not be enabled by default.
-- You can also run this manually or via a GitHub Action 'curl' to the Edge Function.

-- create extension if not exists pg_cron;

/* 
  Example of setting up the cron job via pg_net (Supabase's preferred way for Webhooks)
  This calls our 'process-notifications' edge function every minute.
*/

-- Make sure to replace YOUR_PROJECT_ID and YOUR_ANON_KEY and YOUR_CRON_SECRET
-- In production, the URL is https://[project-id].supabase.co/functions/v1/process-notifications

/*
select
  cron.schedule(
    'process-notifications-every-minute',
    '* * * * *',
    $$
      select
        net.http_post(
          url:='https://[project-id].supabase.co/functions/v1/process-notifications',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer [YOUR_CRON_SECRET]"}'::jsonb,
          body:='{}'::jsonb
        ) as request_id;
    $$
  );
*/


-- 2) Reminders Logic Migration
-- This part creates a function to find bookings happening in 24h and 2h
-- and inserts them into the notification_outbox automatically.

create or replace function public.queue_appointment_reminders()
returns void as $$
begin
  -- 24 Hour Email/SMS Reminders
  insert into public.notification_outbox (booking_id, channel, "to", template, payload, run_at)
  select 
    b.id,
    'email',
    c.email,
    'reminder_24h',
    jsonb_build_object(
      'name', c.name,
      'date', to_char(b.start_at at time zone 'Europe/Athens', 'DD/MM/YYYY'),
      'time', to_char(b.start_at at time zone 'Europe/Athens', 'HH24:MI')
    ),
    now()
  from public.bookings b
  join public.customers c on b.customer_id = c.id
  where b.status = 'confirmed'
    and c.email is not null
    and b.start_at > now() + interval '23 hours' 
    and b.start_at <= now() + interval '24 hours'
    -- Ensure we don't duplicate
    and not exists (
      select 1 from public.notification_outbox n 
      where n.booking_id = b.id and n.template = 'reminder_24h'
    );

  -- 2 Hour SMS Reminders
  insert into public.notification_outbox (booking_id, channel, "to", template, payload, run_at)
  select 
    b.id,
    'sms',
    c.phone,
    'reminder_2h_sms',
    jsonb_build_object(
      'name', c.name,
      'time', to_char(b.start_at at time zone 'Europe/Athens', 'HH24:MI')
    ),
    now()
  from public.bookings b
  join public.customers c on b.customer_id = c.id
  where b.status = 'confirmed'
    and b.start_at > now() + interval '1 hour' 
    and b.start_at <= now() + interval '2 hours'
    and not exists (
      select 1 from public.notification_outbox n 
      where n.booking_id = b.id and n.template = 'reminder_2h_sms'
    );
end;
$$ language plpgsql;


/*
  Schedule the reminder queuer to run every hour
  select
    cron.schedule(
      'queue-reminders-hourly',
      '0 * * * *',
      'select public.queue_appointment_reminders();'
    );
*/
