"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { addMinutes, parseISO } from "date-fns";
import { revalidatePath } from "next/cache";
import { formatGreekPhone } from "@/lib/utils/phone";
import { BUSINESS } from "@/config/business";

// ── Validation ────────────────────────────────────────────────────────────────
const bookingSchema = z.object({
    petType: z.enum(["dog", "cat", "other"]),
    breed: z.string().optional(),
    weightKg: z.string().optional(),
    serviceId: z.string().uuid("Μη έγκυρη υπηρεσία"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Μη έγκυρη ημερομηνία"),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Μη έγκυρη ώρα"),
    ownerName: z.string().min(2, "Παρακαλώ εισάγετε το πλήρες όνομα σας"),
    phone: z.string().min(10, "Παρακαλώ εισάγετε έγκυρο ελληνικό τηλέφωνο"),
    email: z.string().email("Μη έγκυρο email").optional().or(z.literal("")),
    notes: z.string().max(500).optional(),
    acceptPolicy: z.string().optional(),
});

// ── Notification helper ───────────────────────────────────────────────────────
function makePayload(name: string, service: string, startIso: string) {
    const asDate = new Date(startIso)
    return {
        customer_name: name,
        service,
        date_gr: asDate.toLocaleDateString('el-GR', {
            weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Athens'
        }),
        time_gr: asDate.toLocaleTimeString('el-GR', {
            hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Athens'
        }),
    }
}

export async function submitBooking(formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const validated = bookingSchema.parse({ ...rawData, petType: rawData.petType || "dog" });

        const phoneE164 = formatGreekPhone(validated.phone);
        const supabase = await createAdminClient();

        // 1. Service
        const { data: service, error: svcErr } = await supabase
            .from("services").select("*").eq("id", validated.serviceId).single();
        if (svcErr || !service) throw new Error("Μη έγκυρη υπηρεσία.");

        // 2. Timing
        const startAt = parseISO(`${validated.date}T${validated.time}:00`);
        const endAt = addMinutes(startAt, service.duration_min + service.buffer_min);

        // 3. Upsert customer
        let customerId: string;
        const { data: existing } = await supabase
            .from("customers").select("id")
            .or(`phone_e164.eq.${phoneE164},phone.eq.${validated.phone}`)
            .maybeSingle();

        if (existing) {
            customerId = existing.id;
            await supabase.from("customers").update({
                name: validated.ownerName,
                email: validated.email || null,
                phone_e164: phoneE164,
            }).eq("id", customerId);
        } else {
            const { data: nc, error: ce } = await supabase.from("customers").insert({
                name: validated.ownerName,
                phone: validated.phone,
                phone_e164: phoneE164,
                email: validated.email || null,
            }).select("id").single();
            if (ce) throw new Error("Αποτυχία εγγραφής πελάτη.");
            customerId = nc.id;
        }

        // 4. Create booking
        const status = BUSINESS.autoConfirm ? "confirmed" : "pending";
        const { data: booking, error: be } = await supabase
            .from("bookings").insert({
                customer_id: customerId,
                service_id: service.id,
                staff_id: "00000000-0000-0000-0000-000000000001",
                start_at: startAt.toISOString(),
                end_at: endAt.toISOString(),
                status,
                pet_type: validated.petType,
                breed: validated.breed || null,
                weight_kg: validated.weightKg || null,
                notes: validated.notes || null,
                source: "website",
            }).select("id").single();

        if (be) {
            if (be.code === "23P01")
                throw new Error("Το επιλεγμένο ραντεβού δεν είναι πλέον διαθέσιμο. Παρακαλώ επιλέξτε άλλη ώρα.");
            throw new Error("Σφάλμα κατά την καταχώρηση του ραντεβού.");
        }

        // 5. Queue notifications
        const payload = makePayload(validated.ownerName, service.name, startAt.toISOString())
        const customerTemplate = status === "confirmed"
            ? "booking_confirmed_customer"
            : "booking_pending_customer"

        const outbox: any[] = [
            // Customer SMS (always)
            { booking_id: booking.id, channel: "sms", to: phoneE164, template: customerTemplate, payload },
        ]
        // Customer Email (if provided)
        if (validated.email) {
            outbox.push({ booking_id: booking.id, channel: "email", to: validated.email, template: customerTemplate, payload })
        }
        // Business owner notifications (if configured)
        if (BUSINESS.phone) {
            outbox.push({
                booking_id: booking.id, channel: "sms", to: BUSINESS.phone,
                template: status === "confirmed" ? "booking_confirmed_business" : "booking_pending_business",
                payload: { ...payload, customer_phone: phoneE164 }
            })
        }

        await supabase.from("notification_outbox").insert(outbox);

        revalidatePath("/admin/bookings");
        return { success: true, bookingId: booking.id };

    } catch (error: any) {
        if (error instanceof z.ZodError)
            return { success: false, error: error.issues[0]?.message ?? "Παρακαλώ συμπληρώστε σωστά όλα τα πεδία." };
        return { success: false, error: error.message ?? "Παρουσιάστηκε άγνωστο σφάλμα." };
    }
}
