"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { addMinutes, parseISO } from "date-fns";
import { revalidatePath } from "next/cache";

// Booking Form Validation Schema
const bookingSchema = z.object({
    petType: z.enum(["dog", "cat", "other"]),
    breed: z.string().optional(),
    weightKg: z.string().optional(),
    serviceId: z.string().uuid(),
    date: z.string(), // "2024-10-15"
    time: z.string(), // "09:00"
    ownerName: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email().optional().or(z.literal("")),
    notes: z.string().optional(),
});

export async function submitBooking(formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());

        // Validate Input
        const validated = bookingSchema.parse({
            ...rawData,
            petType: rawData.petType || "dog",
        });

        const supabase = await createAdminClient();

        // 1. Fetch Service to calculate end_time
        const { data: service, error: serviceError } = await supabase
            .from("services")
            .select("*")
            .eq("id", validated.serviceId)
            .single();

        if (serviceError || !service) {
            throw new Error("Invalid service selected.");
        }

        const totalDuration = service.duration_min + service.buffer_min;

        // 2. Parse Start Time and End Time (in UTC / Server Time)
        // Note: In production you should properly handle Europe/Athens tz
        const startAtStr = `${validated.date}T${validated.time}:00`;
        const startAt = parseISO(startAtStr);
        const endAt = addMinutes(startAt, totalDuration);

        // 3. Upsert Customer (create if not exists by phone)
        let customerId;
        const { data: existingCustomer } = await supabase
            .from("customers")
            .select("id")
            .eq("phone", validated.phone)
            .maybeSingle();

        if (existingCustomer) {
            customerId = existingCustomer.id;
            // Optionally update email/name here if they changed
        } else {
            const { data: newCustomer, error: custError } = await supabase
                .from("customers")
                .insert({
                    name: validated.ownerName,
                    phone: validated.phone,
                    email: validated.email || null,
                })
                .select("id")
                .single();

            if (custError) throw new Error("Failed to register customer.");
            customerId = newCustomer.id;
        }

        // 4. Create the Booking
        // This will throw if the PostgreSQL exclusion constraint (overlapping times) is violated
        const { data: booking, error: bookingError } = await supabase
            .from("bookings")
            .insert({
                customer_id: customerId,
                service_id: service.id,
                staff_id: '00000000-0000-0000-0000-000000000001', // Default groomer
                start_at: startAt.toISOString(),
                end_at: endAt.toISOString(),
                status: "pending",
                pet_type: validated.petType,
                breed: validated.breed,
                weight_kg: validated.weightKg,
                notes: validated.notes,
                source: "website",
            })
            .select("id")
            .single();

        if (bookingError) {
            if (bookingError.code === '23P01') {
                // PostgreSQL exclusion violation code
                throw new Error("Το επιλεγμένο ραντεβού δεν είναι πλέον διαθέσιμο. Παρακαλώ επιλέξτε άλλη ώρα.");
            }
            throw new Error("Σφάλμα κατά την καταχώρηση του ραντεβού.");
        }

        // 5. Queue Email & SMS Notifications in Outbox
        const emailPayload = {
            name: validated.ownerName,
            serviceName: service.name,
            date: validated.date,
            time: validated.time
        };

        if (validated.email) {
            await supabase.from("notification_outbox").insert({
                booking_id: booking.id,
                channel: 'email',
                to: validated.email,
                template: 'booking_confirmation_pending',
                payload: emailPayload
            });
        }

        await supabase.from("notification_outbox").insert({
            booking_id: booking.id,
            channel: 'sms',
            to: validated.phone,
            template: 'booking_confirmation_pending_sms',
            payload: emailPayload
        });

        revalidatePath('/admin');

        return { success: true, bookingId: booking.id };

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return { success: false, error: "Παρακαλώ συμπληρώστε σωστά όλα τα πεδία." };
        }
        return { success: false, error: error.message || "Παρουσιάστηκε άγνωστο σφάλμα." };
    }
}
