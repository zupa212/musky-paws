"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateBookingStatus(bookingId: string, status: 'confirmed' | 'canceled' | 'completed' | 'no_show') {
    const supabase = await createAdminClient();

    const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", bookingId);

    if (error) {
        return { success: false, error: "Αποτυχία ενημέρωσης ραντεβού" };
    }

    // Fetch booking details for notification
    const { data: booking } = await supabase
        .from("bookings")
        .select(`*, customers(name, email, phone), services(name)`)
        .eq("id", bookingId)
        .single();

    if (booking) {
        // Queue Notification for Status Change (Confirmed / Canceled)
        const template = status === 'confirmed' ? 'booking_confirmed' : status === 'canceled' ? 'booking_canceled' : null;

        if (template) {
            const payload = {
                name: booking.customers.name,
                serviceName: booking.services.name,
                date: booking.start_at.split('T')[0], // simplistic date extracting
                time: booking.start_at.split('T')[1].substring(0, 5) // hh:mm
            };

            if (booking.customers.email) {
                await supabase.from("notification_outbox").insert({
                    booking_id: bookingId,
                    channel: 'email',
                    to: booking.customers.email,
                    template: template,
                    payload
                });
            }

            await supabase.from("notification_outbox").insert({
                booking_id: bookingId,
                channel: 'sms',
                to: booking.customers.phone,
                template: `${template}_sms`,
                payload
            });
        }
    }

    revalidatePath('/admin');
    return { success: true };
}
