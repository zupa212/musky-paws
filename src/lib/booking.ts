import { createAdminClient, createClient } from "@/lib/supabase/server";
import { format, parse, addMinutes, isBefore, isAfter, getDay, startOfDay, endOfDay } from "date-fns";

type Slot = {
    time: string; // "09:00"
    available: boolean;
};

export async function getAvailableSlots(dateString: string, serviceId: string): Promise<Slot[]> {
    const supabase = await createClient();

    // 1. Service duration + buffer
    const { data: service } = await supabase
        .from('services')
        .select('duration_min, buffer_min')
        .eq('id', serviceId)
        .single();
    if (!service) throw new Error("Service not found");

    const totalDuration = service.duration_min + service.buffer_min;

    // 2. Day of week
    const targetDate = parse(dateString, "yyyy-MM-dd", new Date());
    const dayOfWeek = getDay(targetDate);

    // 3. Exception check (holiday / special hours)
    const { data: exception } = await supabase
        .from('schedule_exceptions')
        .select('*')
        .eq('date', dateString)
        .maybeSingle();

    if (exception?.is_closed) return [];

    // 4. Regular schedule
    const { data: schedule } = await supabase
        .from('schedules')
        .select('*')
        .eq('day_of_week', dayOfWeek)
        .maybeSingle();

    const startStr = exception?.start_time || schedule?.start_time;
    const endStr = exception?.end_time || schedule?.end_time;
    if (!startStr || !endStr) return [];

    // 5. Existing bookings (pending + confirmed block availability)
    const tStart = startOfDay(targetDate);
    const tEnd = endOfDay(targetDate);
    const adminSupabase = await createAdminClient();

    const { data: existingBookings } = await adminSupabase
        .from('bookings')
        .select('start_at, end_at')
        .gte('start_at', tStart.toISOString())
        .lte('start_at', tEnd.toISOString())
        .in('status', ['pending', 'confirmed']);

    // 6. Blocked time ranges
    const { data: blockedTimes } = await supabase
        .from('blocked_times')
        .select('start_at, end_at')
        .gte('end_at', tStart.toISOString())
        .lte('start_at', tEnd.toISOString());

    // 7. Generate slots
    let currentSlot = parse(startStr, "HH:mm:ss", targetDate);
    const endWorkTime = parse(endStr, "HH:mm:ss", targetDate);
    const slots: Slot[] = [];
    const now = new Date();

    // Breaks from schedule
    const breaks = (schedule?.breaks as { start: string; end: string }[]) || [];

    while (isBefore(currentSlot, endWorkTime)) {
        const slotEnd = addMinutes(currentSlot, totalDuration);
        if (isAfter(slotEnd, endWorkTime)) break;

        // Skip past times
        if (isBefore(currentSlot, now)) {
            currentSlot = addMinutes(currentSlot, 30);
            continue;
        }

        let available = true;

        // Check bookings overlap
        for (const b of existingBookings || []) {
            const bStart = new Date(b.start_at);
            const bEnd = new Date(b.end_at);
            if (currentSlot < bEnd && slotEnd > bStart) { available = false; break; }
        }

        // Check blocked times overlap
        if (available) {
            for (const bt of blockedTimes || []) {
                const btStart = new Date(bt.start_at);
                const btEnd = new Date(bt.end_at);
                if (currentSlot < btEnd && slotEnd > btStart) { available = false; break; }
            }
        }

        // Check breaks overlap
        if (available) {
            for (const brk of breaks) {
                const brkStart = parse(brk.start, "HH:mm", targetDate);
                const brkEnd = parse(brk.end, "HH:mm", targetDate);
                if (currentSlot < brkEnd && slotEnd > brkStart) { available = false; break; }
            }
        }

        if (available) {
            slots.push({ time: format(currentSlot, "HH:mm"), available: true });
        }

        currentSlot = addMinutes(currentSlot, 30);
    }

    return slots;
}
