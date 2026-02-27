"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { formatGreekPhone } from "@/lib/utils/phone";
import { addMinutes, parseISO } from "date-fns";

// ── Auth helper ───────────────────────────────────────────────────────────────
async function getAdminUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll(), setAll: () => { } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id ?? null;
}

async function writeAuditLog(action: string, tableName: string, recordId: string, payload?: object) {
    const adminId = await getAdminUserId();
    const supabase = await createAdminClient();
    await supabase.from("audit_log").insert({ admin_id: adminId, action, table_name: tableName, record_id: recordId, payload: payload ?? {} });
}

function makePayload(name: string, service: string, startIso: string, customerPhone?: string) {
    const d = new Date(startIso);
    return {
        customer_name: name, customer_phone: customerPhone ?? '', service,
        date_gr: d.toLocaleDateString("el-GR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Athens" }),
        time_gr: d.toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Athens" }),
    };
}

// ── Update Booking Status ─────────────────────────────────────────────────────
export async function updateBookingStatus(
    bookingId: string,
    status: "confirmed" | "canceled" | "completed" | "no_show"
) {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId);
    if (error) return { success: false, error: "Αποτυχία ενημέρωσης ραντεβού" };

    await writeAuditLog("booking.status_changed", "bookings", bookingId, { status });

    const { data: b } = await supabase
        .from("bookings")
        .select("*, customers(name, email, phone_e164, phone), services(name)")
        .eq("id", bookingId).single();

    if (b) {
        const phone = b.customers.phone_e164 || formatGreekPhone(b.customers.phone);
        const payload = makePayload(b.customers.name, b.services.name, b.start_at, phone);
        const templateMap: Record<string, string | null> = {
            confirmed: "booking_confirmed_customer",
            canceled: "booking_canceled_customer",
            completed: null,
            no_show: null,
        };
        const template = templateMap[status];
        if (template) {
            const outbox: any[] = [{ booking_id: bookingId, channel: "sms", to: phone, template, payload }];
            if (b.customers.email)
                outbox.push({ booking_id: bookingId, channel: "email", to: b.customers.email, template, payload });
            await supabase.from("notification_outbox").insert(outbox);
        }
    }

    revalidatePath("/admin/bookings");
    return { success: true };
}

// ── Resend Notification ───────────────────────────────────────────────────────
export async function resendNotification(bookingId: string, channel: "sms" | "email", template: string) {
    const supabase = await createAdminClient();
    const { data: b } = await supabase
        .from("bookings")
        .select("*, customers(name, email, phone_e164, phone), services(name)")
        .eq("id", bookingId).single();
    if (!b) return { success: false, error: "Ραντεβού δεν βρέθηκε" };

    const phone = b.customers.phone_e164 || formatGreekPhone(b.customers.phone);
    const to = channel === "sms" ? phone : b.customers.email;
    if (!to) return { success: false, error: "Δεν υπάρχει τηλέφωνο/email" };

    const payload = makePayload(b.customers.name, b.services.name, b.start_at, phone);
    await supabase.from("notification_outbox").insert({ booking_id: bookingId, channel, to, template, payload, run_at: new Date().toISOString() });
    await writeAuditLog("notification.resent", "notification_outbox", bookingId, { channel, template });
    return { success: true };
}

// ── Manual Booking (Admin creates from phone call) ────────────────────────────
export async function createManualBooking(data: {
    customerName: string; customerPhone: string; customerEmail?: string;
    serviceId: string; date: string; time: string;
    petType: string; breed?: string; weightKg?: string; notes?: string;
    forceBooking?: boolean; sendNotification?: boolean;
}) {
    const supabase = await createAdminClient();
    const phoneE164 = formatGreekPhone(data.customerPhone);

    // 1. Service
    const { data: service, error: svcErr } = await supabase
        .from("services").select("*").eq("id", data.serviceId).single();
    if (svcErr || !service) return { success: false, error: "Μη έγκυρη υπηρεσία" };

    const startAt = parseISO(`${data.date}T${data.time}:00`);
    const endAt = addMinutes(startAt, service.duration_min + service.buffer_min);

    // 2. Upsert customer
    let customerId: string;
    const { data: existing } = await supabase
        .from("customers").select("id")
        .or(`phone_e164.eq.${phoneE164},phone.eq.${data.customerPhone}`)
        .maybeSingle();

    if (existing) {
        customerId = existing.id;
        await supabase.from("customers").update({
            name: data.customerName, email: data.customerEmail || null, phone_e164: phoneE164,
        }).eq("id", customerId);
    } else {
        const { data: nc, error: ce } = await supabase.from("customers").insert({
            name: data.customerName, phone: data.customerPhone, phone_e164: phoneE164,
            email: data.customerEmail || null,
        }).select("id").single();
        if (ce) return { success: false, error: "Αποτυχία εγγραφής πελάτη" };
        customerId = nc.id;
    }

    // 3. Create booking — manual bookings default to confirmed
    const { data: booking, error: be } = await supabase
        .from("bookings").insert({
            customer_id: customerId, service_id: service.id,
            staff_id: "00000000-0000-0000-0000-000000000001",
            start_at: startAt.toISOString(), end_at: endAt.toISOString(),
            status: "confirmed",
            pet_type: data.petType || "dog", breed: data.breed || null,
            weight_kg: data.weightKg || null, notes: data.notes || null,
            source: "phone",
        }).select("id").single();

    if (be) {
        if (be.code === "23P01" && !data.forceBooking)
            return { success: false, error: "Αυτή η ώρα είναι ήδη κλεισμένη. Ενεργοποιήστε 'Force booking' αν θέλετε να συνεχίσετε." };
        if (be.code === "23P01" && data.forceBooking) {
            // Force: temporarily drop the constraint isn't feasible with service_role,
            // so we just try inserting. If admin chose force but constraint fires,
            // the DB doesn't allow it. In practice, the overlap happens only when
            // another booking exists for the same staff — admin should cancel the other.
            return { success: false, error: "Υπάρχει overlap στη βάση. Ακυρώστε πρώτα το υπάρχον ραντεβού." };
        }
        return { success: false, error: "Σφάλμα καταχώρησης ραντεβού" };
    }

    await writeAuditLog("booking.manual_created", "bookings", booking.id, { source: "phone", customerPhone: phoneE164 });

    // 4. Notification (optional)
    if (data.sendNotification !== false) {
        const payload = makePayload(data.customerName, service.name, startAt.toISOString(), phoneE164);
        const outbox: any[] = [
            { booking_id: booking.id, channel: "sms", to: phoneE164, template: "booking_confirmed_customer", payload },
        ];
        if (data.customerEmail)
            outbox.push({ booking_id: booking.id, channel: "email", to: data.customerEmail, template: "booking_confirmed_customer", payload });
        await supabase.from("notification_outbox").insert(outbox);
    }

    revalidatePath("/admin/bookings");
    return { success: true, bookingId: booking.id };
}

// ── Reschedule Booking ────────────────────────────────────────────────────────
export async function rescheduleBooking(bookingId: string, newDate: string, newTime: string) {
    const supabase = await createAdminClient();

    // Fetch current booking + service
    const { data: b } = await supabase
        .from("bookings")
        .select("*, customers(name, email, phone_e164, phone), services(name, duration_min, buffer_min)")
        .eq("id", bookingId).single();
    if (!b) return { success: false, error: "Ραντεβού δεν βρέθηκε" };

    const oldStartAt = b.start_at;
    const oldEndAt = b.end_at;
    const newStartAt = parseISO(`${newDate}T${newTime}:00`);
    const newEndAt = addMinutes(newStartAt, b.services.duration_min + b.services.buffer_min);

    // Update booking times
    const { error } = await supabase.from("bookings").update({
        start_at: newStartAt.toISOString(),
        end_at: newEndAt.toISOString(),
    }).eq("id", bookingId);

    if (error) {
        if (error.code === "23P01")
            return { success: false, error: "Η νέα ώρα δεν είναι διαθέσιμη." };
        return { success: false, error: "Σφάλμα αλλαγής ώρας" };
    }

    // Record reschedule history
    const adminId = await getAdminUserId();
    await supabase.from("booking_reschedules").insert({
        booking_id: bookingId,
        old_start_at: oldStartAt,
        old_end_at: oldEndAt,
        new_start_at: newStartAt.toISOString(),
        new_end_at: newEndAt.toISOString(),
        admin_id: adminId,
    });

    await writeAuditLog("booking.rescheduled", "bookings", bookingId, {
        old_start_at: oldStartAt, new_start_at: newStartAt.toISOString()
    });

    // Send rescheduled notification
    const phone = b.customers.phone_e164 || formatGreekPhone(b.customers.phone);
    const payload = {
        ...makePayload(b.customers.name, b.services.name, newStartAt.toISOString(), phone),
        new_date_gr: newStartAt.toLocaleDateString("el-GR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Athens" }),
        new_time_gr: newStartAt.toLocaleTimeString("el-GR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Athens" }),
    };

    const outbox: any[] = [
        { booking_id: bookingId, channel: "sms", to: phone, template: "booking_rescheduled_customer", payload },
    ];
    if (b.customers.email)
        outbox.push({ booking_id: bookingId, channel: "email", to: b.customers.email, template: "booking_rescheduled_customer", payload });
    await supabase.from("notification_outbox").insert(outbox);

    revalidatePath("/admin/bookings");
    return { success: true };
}

// ── Blocked Times ─────────────────────────────────────────────────────────────
export async function createBlockedTime(data: { date: string; startTime: string; endTime: string; reason?: string }) {
    const supabase = await createAdminClient();
    const adminId = await getAdminUserId();
    const startAt = parseISO(`${data.date}T${data.startTime}:00`);
    const endAt = parseISO(`${data.date}T${data.endTime}:00`);

    const { error } = await supabase.from("blocked_times").insert({
        staff_id: "00000000-0000-0000-0000-000000000001",
        start_at: startAt.toISOString(), end_at: endAt.toISOString(),
        reason: data.reason || null, created_by: adminId,
    });
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/schedule");
    return { success: true };
}

export async function deleteBlockedTime(id: string) {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("blocked_times").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/schedule");
    return { success: true };
}

// ── Customers ─────────────────────────────────────────────────────────────────
export async function updateCustomerNotes(customerId: string, notes: string) {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("customers").update({ admin_notes: notes }).eq("id", customerId);
    if (error) return { success: false, error: "Αποτυχία αποθήκευσης" };
    await writeAuditLog("customer.notes_updated", "customers", customerId);
    revalidatePath("/admin/customers");
    return { success: true };
}

// ── Services ──────────────────────────────────────────────────────────────────
export async function upsertService(data: {
    id?: string; slug: string; name: string;
    duration_min: number; buffer_min: number; price_from: number; active: boolean;
}) {
    const supabase = await createAdminClient();
    const { id, ...rest } = data;
    let result;
    if (id) {
        result = await supabase.from("services").update(rest).eq("id", id).select("id").single();
        if (!result.error) await writeAuditLog("service.updated", "services", id, rest);
    } else {
        result = await supabase.from("services").insert(rest).select("id").single();
        if (!result.error) await writeAuditLog("service.created", "services", result.data.id, rest);
    }
    if (result.error) return { success: false, error: result.error.message };
    revalidatePath("/admin/services");
    return { success: true };
}

export async function deleteService(id: string) {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    await writeAuditLog("service.deleted", "services", id);
    revalidatePath("/admin/services");
    return { success: true };
}

// ── Schedule ──────────────────────────────────────────────────────────────────
export async function upsertSchedule(data: { staff_id: string; day_of_week: number; start_time: string; end_time: string; breaks?: any[] }) {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("schedules").upsert({ ...data, breaks: data.breaks ?? [] }, { onConflict: "staff_id,day_of_week" });
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/schedule");
    return { success: true };
}

export async function upsertScheduleException(data: { date: string; is_closed: boolean; notes?: string }) {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("schedule_exceptions").upsert(data, { onConflict: "date" });
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/schedule");
    return { success: true };
}

export async function deleteScheduleException(id: string) {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("schedule_exceptions").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/schedule");
    return { success: true };
}
