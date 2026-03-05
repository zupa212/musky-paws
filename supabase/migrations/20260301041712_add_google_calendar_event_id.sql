-- Add Google Calendar Event ID column to bookings table to track synced events
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS google_calendar_event_id TEXT;

-- Index for faster lookups when syncing back from Google (optional, but good practice)
CREATE INDEX IF NOT EXISTS idx_bookings_google_cal_event_id ON public.bookings(google_calendar_event_id);
