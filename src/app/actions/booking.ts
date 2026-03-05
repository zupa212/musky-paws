"use server";

import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server";
import { addMinutes, parseISO } from "date-fns";
import { revalidatePath } from "next/cache";
import { formatGreekPhone } from "@/lib/utils/phone";
import { BUSINESS } from "@/config/business";
import { sendBookingReceivedNotification } from "@/lib/notifications";
import { createCalendarEvent } from "@/lib/google-calendar";

const bookingSchema = z.object({
    petType: z.enum(["dog", "cat", "other"]),
    breed: z.string().optional(),
    weightKg: z.string().optional(),
    serviceId: z.string().uuid("Μη έγκυρη υπηρεσία"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Μη έγκυρη ημερομηνία"),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Μη έγκυρη ώρα"),
    ownerName: z.string().min(2, "Παρακαλώ εισάγετε το πλήρες όνομα σας"),
    phone: z.string().min(10, "Παρακαλώ εισάγετε έγκυρο ελληνικό τηλέφωνο"),
    email: z.string().email("Παρακαλώ εισάγετε έγκυρο email"),
    notes: z.string().max(500).optional(),
    acceptPolicy: z.string().optional(),
    couponCode: z.string().optional(),
});

// Removed unused makePayload function

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

            // Spam Protection Check: Prevent more than 3 bookings per hour per customer
            const { count } = await supabase
                .from("bookings")
                .select("*", { count: 'exact', head: true })
                .eq("customer_id", customerId)
                .gte("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

            if (count && count >= 3) {
                throw new Error("Έχετε υπερβεί το όριο κρατήσεων. Παρακαλώ δοκιμάστε ξανά αργότερα ή καλέστε μας τηλεφωνικά.");
            }

            await supabase.from("customers").update({
                name: validated.ownerName, email: validated.email || null, phone_e164: phoneE164,
            }).eq("id", customerId);
        } else {
            const { data: nc, error: ce } = await supabase.from("customers").insert({
                name: validated.ownerName, phone: validated.phone, phone_e164: phoneE164, email: validated.email || null,
            }).select("id").single();
            if (ce) throw new Error("Αποτυχία εγγραφής πελάτη.");
            customerId = nc.id;
        }

        // 4. Create booking — ALWAYS confirmed for public bookings (auto-book)
        const { data: booking, error: be } = await supabase
            .from("bookings").insert({
                customer_id: customerId, service_id: service.id,
                staff_id: "00000000-0000-0000-0000-000000000001",
                start_at: startAt.toISOString(), end_at: endAt.toISOString(),
                status: "confirmed",
                pet_type: validated.petType, breed: validated.breed || null,
                weight_kg: validated.weightKg || null, notes: validated.notes || null,
                source: "website",
                coupon_id: validated.couponCode ? (await validateCoupon(validated.couponCode, service.price_from || 0)).coupon?.id : null
            }).select("id").single();

        if (be) {
            if (be.code === "23P01")
                throw new Error("Το επιλεγμένο ραντεβού δεν είναι πλέον διαθέσιμο. Παρακαλώ επιλέξτε άλλη ώρα.");
            throw new Error("Σφάλμα κατά την καταχώρηση του ραντεβού.");
        }

        // 5. Send Real-Time Notifications + Google Calendar
        const bookingData = {
            id: booking.id,
            start_at: startAt.toISOString(),
            pet_type: validated.petType,
            breed: validated.breed || null,
            services: { name: service.name, duration_min: service.duration_min, price_from: service.price_from }
        };
        const customerData = {
            name: validated.ownerName,
            phone: validated.phone,
            phone_e164: phoneE164,
            email: validated.email || null
        };

        // Fire and forget — don't block the customer response
        sendBookingReceivedNotification(bookingData, customerData).catch(err => console.error("Notification Error:", err));

        // Auto-sync to Google Calendar (fire and forget)
        createCalendarEvent(booking.id).catch(err => console.error("Google Calendar Error:", err));

        revalidatePath("/admin/bookings");
        return { success: true, bookingId: booking.id };

    } catch (error: any) {
        if (error instanceof z.ZodError)
            return { success: false, error: error.issues[0]?.message ?? "Παρακαλώ συμπληρώστε σωστά όλα τα πεδία." };
        return { success: false, error: error.message ?? "Παρουσιάστηκε άγνωστο σφάλμα." };
    }
}

export async function getServices() {
    try {
        const supabase = await createAdminClient();
        const { data, error } = await supabase
            .from("services")
            .select("id, name, slug, duration_min, price_from")
            .order("id", { ascending: true });

        if (error) throw error;
        return { success: true, services: data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function validateCoupon(code: string, amount: number) {
    try {
        const supabase = await createAdminClient();
        const { data: coupon, error } = await supabase
            .from("coupons")
            .select("*")
            .eq("code", code.toUpperCase())
            .eq("active", true)
            .single();

        if (error || !coupon) return { success: false, error: "Το κουπόνι δεν βρέθηκε ή είναι ανενεργό" };
        if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return { success: false, error: "Το κουπόνι έχει λήξει" };
        if (coupon.max_uses && coupon.used_count >= coupon.max_uses) return { success: false, error: "Το κουπόνι έχει εξαντληθεί" };
        if (amount < coupon.min_booking_amount) return { success: false, error: `Ελάχιστο ποσό κράτησης: ${coupon.min_booking_amount}€` };

        let discount = 0;
        if (coupon.discount_type === 'fixed') {
            discount = Number(coupon.discount_value);
        } else {
            discount = amount * (Number(coupon.discount_value) / 100);
        }

        return { success: true, coupon, discount };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
