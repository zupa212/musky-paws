"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { addMinutes, parseISO } from "date-fns";
import { revalidatePath } from "next/cache";

// Validate + format a Greek phone number to E.164
function toE164Greek(raw: string): string {
    const digits = raw.replace(/\D/g, '');
    if (digits.startsWith('30') && digits.length === 12) return `+${digits}`;
    if (digits.length === 10) return `+30${digits}`;
    return `+30${digits}`; // best-effort
}

// Booking Form Validation Schema
const bookingSchema = z.object({
    petType: z.enum(["dog", "cat", "other"]),
    breed: z.string().optional(),
    weightKg: z.string().optional(),
    serviceId: z.string().uuid(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().regex(/^\d{2}:\d{2}$/),
    ownerName: z.string().min(2, "Παρακαλώ εισάγετε το πλήρες όνομα σας"),
    phone: z.string().min(10, "Παρακαλώ εισάγετε έγκυρο τηλέφωνο"),
    email: z.string().email().optional().or(z.literal("")),
    notes: z.string().optional(),
});

export async function submitBooking(formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());

        const validated = bookingSchema.parse({
            ...rawData,
            petType: rawData.petType || "dog",
        });

        // Format phone to E.164 immediately
        const phoneE164 = toE164Greek(validated.phone);

        const supabase = await createAdminClient();

        // 1. Fetch Service
        const { data: service, error: serviceError } = await supabase
            .from("services")
            .select("*")
            .eq("id", validated.serviceId)
            .single();

        if (serviceError || !service) throw new Error("Μη έγκυρη υπηρεσία.");

        const totalDuration = service.duration_min + service.buffer_min;
        const startAtStr = `${validated.date}T${validated.time}:00`;
        const startAt = parseISO(startAtStr);
        const endAt = addMinutes(startAt, totalDuration);

        // 2. Upsert Customer (match by phone_e164 or raw phone)
        let customerId: string;
        const { data: existingCustomer } = await supabase
            .from("customers")
            .select("id")
            .or(`phone_e164.eq.${phoneE164},phone.eq.${validated.phone}`)
            .maybeSingle();

        if (existingCustomer) {
            customerId = existingCustomer.id;
            // Update name/email/phone_e164 in case they changed
            await supabase.from("customers").update({
                name: validated.ownerName,
                email: validated.email || null,
                phone_e164: phoneE164,
            }).eq('id', customerId);
        } else {
            const { data: newCustomer, error: custError } = await supabase
                .from("customers")
                .insert({
                    name: validated.ownerName,
                    phone: validated.phone,
                    phone_e164: phoneE164,
                    email: validated.email || null,
                })
                .select("id")
                .single();

            if (custError) throw new Error("Αποτυχία εγγραφής πελάτη.");
            customerId = newCustomer.id;
        }

        // 3. Create Booking (exclusion constraint prevents overlaps at DB level)
        const { data: booking, error: bookingError } = await supabase
            .from("bookings")
            .insert({
                customer_id: customerId,
                service_id: service.id,
                staff_id: '00000000-0000-0000-0000-000000000001',
                start_at: startAt.toISOString(),
                end_at: endAt.toISOString(),
                status: "pending",
                pet_type: validated.petType,
                breed: validated.breed || null,
                weight_kg: validated.weightKg || null,
                notes: validated.notes || null,
                source: "website",
            })
            .select("id")
            .single();

        if (bookingError) {
            if (bookingError.code === '23P01') {
                throw new Error("Το επιλεγμένο ραντεβού δεν είναι πλέον διαθέσιμο. Παρακαλώ επιλέξτε άλλη ώρα.");
            }
            throw new Error("Σφάλμα κατά την καταχώρηση του ραντεβού.");
        }

        // 4. Queue Notifications
        const notifPayload = {
            name: validated.ownerName,
            serviceName: service.name,
            date: validated.date,
            time: validated.time,
        };

        const outboxItems: any[] = [
            // Always queue SMS to the E.164 number
            {
                booking_id: booking.id,
                channel: 'sms',
                to: phoneE164,
                template: 'booking_confirmation_pending_sms',
                payload: notifPayload,
            }
        ];

        // Queue email only if provided
        if (validated.email) {
            outboxItems.push({
                booking_id: booking.id,
                channel: 'email',
                to: validated.email,
                template: 'booking_confirmation_pending',
                payload: notifPayload,
            });
        }

        await supabase.from("notification_outbox").insert(outboxItems);

        revalidatePath('/admin/bookings');
        return { success: true, bookingId: booking.id };

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            const firstMsg = error.issues[0]?.message
            return { success: false, error: firstMsg || "Παρακαλώ συμπληρώστε σωστά όλα τα πεδία." };
        }
        return { success: false, error: error.message || "Παρουσιάστηκε άγνωστο σφάλμα." };
    }
}
