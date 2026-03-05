import { google } from 'googleapis';
import { createAdminClient } from './supabase/server';
import { BUSINESS } from '@/config/business';

/**
 * Helper to get the authenticated Google Calendar client
 * Uses a Service Account configured via Environment Variables.
 */
function getCalendarClient() {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const serviceAccountKeyStr = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!calendarId || !serviceAccountKeyStr) {
        console.warn('⚠️ Google Calendar integration not fully configured. Missing GOOGLE_CALENDAR_ID or GOOGLE_SERVICE_ACCOUNT_KEY.');
        return { calendar: null, calendarId: null };
    }

    try {
        const credentials = JSON.parse(serviceAccountKeyStr);
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/calendar.events'],
        });

        const calendar = google.calendar({ version: 'v3', auth });
        return { calendar, calendarId };
    } catch (error) {
        console.error('❌ Failed to parse Google Service Account Key:', error);
        return { calendar: null, calendarId: null };
    }
}

/**
 * Creates an event in Google Calendar for a confirmed booking
 */
export async function createCalendarEvent(bookingId: string) {
    const { calendar, calendarId } = getCalendarClient();
    if (!calendar || !calendarId) return null;

    try {
        const supabase = await createAdminClient();

        // Fetch full booking details
        const { data: booking, error } = await supabase
            .from('bookings')
            .select(`
                *,
                customers (name, phone, email),
                services (name)
            `)
            .eq('id', bookingId)
            .single();

        if (error || !booking) throw new Error('Booking not found');

        const customerInfo = `Πελάτης: ${booking.customers?.name}\nΤηλέφωνο: ${booking.customers?.phone}\nEmail: ${booking.customers?.email || '-'}`;
        const petInfo = `Κατοικίδιο: ${booking.petType === 'dog' ? 'Σκύλος' : booking.petType === 'cat' ? 'Γάτα' : booking.petType} - ${booking.weightKg}kg${booking.breed ? ` (${booking.breed})` : ''}`;
        const notes = booking.notes ? `\n\nΣημειώσεις:\n${booking.notes}` : '';

        const description = `${customerInfo}\n${petInfo}${notes}\n\nMusky Paws: ${BUSINESS.bookingUrl}`;

        const event = {
            summary: `Musky Paws - ${booking.services?.name} (${booking.customers?.name})`,
            location: BUSINESS.address,
            description,
            start: {
                dateTime: booking.start_at,
                timeZone: BUSINESS.timezone,
            },
            end: {
                dateTime: booking.end_at,
                timeZone: BUSINESS.timezone,
            },
            colorId: '9', // Blueberry blue
        };

        const res = await calendar.events.insert({
            calendarId,
            requestBody: event,
        });

        // Store the google_calendar_event_id back to Supabase
        if (res.data.id) {
            await supabase
                .from('bookings')
                .update({ google_calendar_event_id: res.data.id })
                .eq('id', bookingId);

            return res.data.id;
        }

        return null;
    } catch (error) {
        console.error('❌ Error creating Google Calendar event:', error);
        return null;
    }
}

/**
 * Updates an existing Google Calendar event (e.g., when a booking is rescheduled)
 */
export async function updateCalendarEvent(bookingId: string) {
    const { calendar, calendarId } = getCalendarClient();
    if (!calendar || !calendarId) return null;

    try {
        const supabase = await createAdminClient();

        const { data: booking, error } = await supabase
            .from('bookings')
            .select('start_at, end_at, google_calendar_event_id')
            .eq('id', bookingId)
            .single();

        if (error || !booking) return null;
        if (!booking.google_calendar_event_id) {
            // If it doesn't exist, create it instead
            return createCalendarEvent(bookingId);
        }

        const eventPatch = {
            start: {
                dateTime: booking.start_at,
                timeZone: BUSINESS.timezone,
            },
            end: {
                dateTime: booking.end_at,
                timeZone: BUSINESS.timezone,
            },
        };

        await calendar.events.patch({
            calendarId,
            eventId: booking.google_calendar_event_id,
            requestBody: eventPatch,
        });

        return booking.google_calendar_event_id;
    } catch (error) {
        console.error('❌ Error updating Google Calendar event:', error);
        return null;
    }
}

/**
 * Deletes a Google Calendar event (e.g., when a booking is cancelled)
 */
export async function deleteCalendarEvent(bookingId: string) {
    const { calendar, calendarId } = getCalendarClient();
    if (!calendar || !calendarId) return false;

    try {
        const supabase = await createAdminClient();

        const { data: booking, error } = await supabase
            .from('bookings')
            .select('google_calendar_event_id')
            .eq('id', bookingId)
            .single();

        if (error || !booking || !booking.google_calendar_event_id) return false;

        await calendar.events.delete({
            calendarId,
            eventId: booking.google_calendar_event_id,
        });

        // Nullify the ID in the DB
        await supabase
            .from('bookings')
            .update({ google_calendar_event_id: null })
            .eq('id', bookingId);

        return true;
    } catch (error) {
        console.error('❌ Error deleting Google Calendar event:', error);
        // It might be already deleted on Google's side, which is fine
        return false;
    }
}

/**
 * Fetches events from Google Calendar between two dates.
 * Used for two-way sync to block availability.
 */
export async function getCalendarEvents(timeMin: Date, timeMax: Date) {
    const { calendar, calendarId } = getCalendarClient();
    if (!calendar || !calendarId) return [];

    try {
        const res = await calendar.events.list({
            calendarId,
            timeMin: timeMin.toISOString(),
            timeMax: timeMax.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });

        return (res.data.items || [])
            .map(e => ({
                start: e.start?.dateTime || e.start?.date, // could be all-day (YYYY-MM-DD)
                end: e.end?.dateTime || e.end?.date,
            }))
            .filter(e => e.start && e.end) as { start: string; end: string }[];
    } catch (error) {
        console.error('❌ Error fetching Google Calendar events:', error);
        return [];
    }
}

/**
 * Syncs deletions from Google Calendar back to Supabase.
 * Finds all 'confirmed' future bookings, checks if their GCal event is cancelled,
 * and updates them to 'canceled' if so.
 */
export async function syncCancelledEventsFromCalendar() {
    const { calendar, calendarId } = getCalendarClient();
    if (!calendar || !calendarId) return { synced: 0, error: 'No calendar client' };

    try {
        const supabase = await createAdminClient();

        // 1. Get all future confirmed bookings that have a GCal ID
        const now = new Date().toISOString();
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('id, google_calendar_event_id')
            .eq('status', 'confirmed')
            .not('google_calendar_event_id', 'is', null)
            .gte('start_at', now);

        if (error || !bookings || bookings.length === 0) return { synced: 0 };

        // 2. Fetch all Google Calendar events from now onwards (including deleted ones)
        const res = await calendar.events.list({
            calendarId,
            timeMin: now,
            showDeleted: true,
            singleEvents: true,
            maxResults: 2500, // Should be plenty for future events
        });

        const gcalEvents = res.data.items || [];
        const cancelledEventIds = new Set(
            gcalEvents.filter(e => e.status === 'cancelled').map(e => e.id)
        );

        // 3. Find which bookings have been cancelled in GCal
        const bookingsToCancel = bookings.filter(b =>
            cancelledEventIds.has(b.google_calendar_event_id)
        );

        if (bookingsToCancel.length === 0) return { synced: 0 };

        // 4. Update them in Supabase
        const bookingIds = bookingsToCancel.map(b => b.id);

        await supabase
            .from('bookings')
            .update({ status: 'canceled' })
            .in('id', bookingIds);

        return { synced: bookingIds.length, cancelledIds: bookingIds };
    } catch (error) {
        console.error('❌ Error syncing cancelled events:', error);
        return { synced: 0, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
