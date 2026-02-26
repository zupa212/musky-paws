import { createAdminClient, createClient } from "@/lib/supabase/server";
import { format, parse, addMinutes, isBefore, isAfter, set, startOfDay, endOfDay, getDay } from "date-fns";

type Slot = {
    time: string; // "09:00"
    available: boolean;
};

export async function getAvailableSlots(dateString: string, serviceId: string): Promise<Slot[]> {
    const supabase = await createClient(); // Use anon client for reading public schedule

    // 1. Get the Service duration + buffer
    const { data: service } = await supabase
        .from('services')
        .select('duration_min, buffer_min')
        .eq('id', serviceId)
        .single();

    if (!service) throw new Error("Service not found");

    const totalDuration = service.duration_min + service.buffer_min;

    // 2. Determine Day of Week (0 = Sun, 1 = Mon...)
    const targetDate = parse(dateString, "yyyy-MM-dd", new Date());
    const dayOfWeek = getDay(targetDate);

    // 3. Check for Exceptions (Holidays)
    const { data: exception } = await supabase
        .from('schedule_exceptions')
        .select('*')
        .eq('date', dateString)
        .maybeSingle();

    if (exception?.is_closed) {
        return []; // Closed completely
    }

    // 4. Get regular schedule for this day (assume main staff member for single-groomer MVP)
    const { data: schedule } = await supabase
        .from('schedules')
        .select('*')
        .eq('day_of_week', dayOfWeek)
        .maybeSingle();

    // If no regular schedule and no active open exception, business is closed
    const startStr = exception?.start_time || schedule?.start_time;
    const endStr = exception?.end_time || schedule?.end_time;

    if (!startStr || !endStr) return [];

    // 5. Get existing bookings for this day
    const targetStartOfDay = startOfDay(targetDate);
    const targetEndOfDay = endOfDay(targetDate);

    // Use Admin Client to read ALL bookings for availability checking without exposing data
    const adminSupabase = await createAdminClient();
    const { data: existingBookings } = await adminSupabase
        .from('bookings')
        .select('start_at, end_at')
        .gte('start_at', targetStartOfDay.toISOString())
        .lte('start_at', targetEndOfDay.toISOString())
        .in('status', ['pending', 'confirmed']);

    // 6. Generate Potential Slots
    // Start from schedule start_time and increment by e.g., 30 mins
    let currentSlot = parse(startStr, "HH:mm:ss", targetDate);
    const endWorkTime = parse(endStr, "HH:mm:ss", targetDate);
    const slots: Slot[] = [];

    const now = new Date();

    while (isBefore(currentSlot, endWorkTime) || currentSlot.getTime() === endWorkTime.getTime()) {
        // Check if slot + totalDuration > endWorkTime
        const slotEndTime = addMinutes(currentSlot, totalDuration);
        if (isAfter(slotEndTime, endWorkTime)) {
            break; // Not enough time left in the day for this service
        }

        // Is slot in the past? (Block past times for today)
        if (isBefore(currentSlot, now)) {
            currentSlot = addMinutes(currentSlot, 30);
            continue;
        }

        // Check overlap with existing bookings
        // A slot overlaps if max(slotStart, bookStart) < min(slotEnd, bookEnd)
        let isAvailable = true;
        for (const b of existingBookings || []) {
            const bStart = new Date(b.start_at);
            const bEnd = new Date(b.end_at);
            if (currentSlot < bEnd && slotEndTime > bStart) {
                isAvailable = false;
                break;
            }
        }

        // Check overlap with breaks
        const breaks = (schedule?.breaks as { start: string, end: string }[]) || [];
        for (const brk of breaks) {
            const brkStart = parse(brk.start, "HH:mm", targetDate);
            const brkEnd = parse(brk.end, "HH:mm", targetDate);
            if (currentSlot < brkEnd && slotEndTime > brkStart) {
                isAvailable = false;
                break;
            }
        }

        if (isAvailable) {
            slots.push({
                time: format(currentSlot, "HH:mm"),
                available: true
            });
        }

        // Increment slot blocks by 30 mins
        currentSlot = addMinutes(currentSlot, 30);
    }

    return slots;
}
