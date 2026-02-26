'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { formatGreekPhone } from '@/lib/utils/phone'

// Helper: get current admin user id
async function getAdminUserId(): Promise<string | null> {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll() { },
            },
        }
    )
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id ?? null
}

async function writeAuditLog(action: string, tableName: string, recordId: string, payload?: object) {
    const adminId = await getAdminUserId()
    const supabase = await createAdminClient()
    await supabase.from('audit_log').insert({
        admin_id: adminId,
        action,
        table_name: tableName,
        record_id: recordId,
        payload: payload ?? {},
    })
}

// ─── Bookings ────────────────────────────────────────────────────────────────

export async function updateBookingStatus(
    bookingId: string,
    status: 'confirmed' | 'canceled' | 'completed' | 'no_show'
) {
    const supabase = await createAdminClient()

    const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)

    if (error) return { success: false, error: 'Αποτυχία ενημέρωσης ραντεβού' }

    await writeAuditLog('booking.status_changed', 'bookings', bookingId, { status })

    // Queue notification
    const { data: booking } = await supabase
        .from('bookings')
        .select('*, customers(name, email, phone_e164, phone), services(name)')
        .eq('id', bookingId)
        .single()

    if (booking) {
        const phone = booking.customers.phone_e164 || formatGreekPhone(booking.customers.phone)
        const payload = {
            name: booking.customers.name,
            serviceName: booking.services.name,
            date: new Date(booking.start_at).toLocaleDateString('el-GR'),
            time: new Date(booking.start_at).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' }),
        }

        const template = status === 'confirmed' ? 'booking_confirmed'
            : status === 'canceled' ? 'booking_canceled'
                : null

        if (template) {
            const outbox: any[] = []
            if (booking.customers.email) {
                outbox.push({ booking_id: bookingId, channel: 'email', to: booking.customers.email, template, payload })
            }
            outbox.push({ booking_id: bookingId, channel: 'sms', to: phone, template: `${template}_sms`, payload })
            await supabase.from('notification_outbox').insert(outbox)
        }
    }

    revalidatePath('/admin/bookings')
    return { success: true }
}

// ─── Customers ───────────────────────────────────────────────────────────────

export async function updateCustomerNotes(customerId: string, notes: string) {
    const supabase = await createAdminClient()
    const { error } = await supabase
        .from('customers')
        .update({ admin_notes: notes })
        .eq('id', customerId)

    if (error) return { success: false, error: 'Αποτυχία αποθήκευσης σημειώσεων' }
    await writeAuditLog('customer.notes_updated', 'customers', customerId)
    revalidatePath('/admin/customers')
    return { success: true }
}

// ─── Services ────────────────────────────────────────────────────────────────

export async function upsertService(data: {
    id?: string; slug: string; name: string
    duration_min: number; buffer_min: number
    price_from: number; active: boolean
}) {
    const supabase = await createAdminClient()
    const { id, ...rest } = data

    let result
    if (id) {
        result = await supabase.from('services').update(rest).eq('id', id).select('id').single()
        if (!result.error) await writeAuditLog('service.updated', 'services', id, rest)
    } else {
        result = await supabase.from('services').insert(rest).select('id').single()
        if (!result.error) await writeAuditLog('service.created', 'services', result.data.id, rest)
    }

    if (result.error) return { success: false, error: result.error.message }
    revalidatePath('/admin/services')
    return { success: true }
}

export async function deleteService(id: string) {
    const supabase = await createAdminClient()
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    await writeAuditLog('service.deleted', 'services', id)
    revalidatePath('/admin/services')
    return { success: true }
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

export async function upsertSchedule(data: {
    staff_id: string; day_of_week: number
    start_time: string; end_time: string; breaks?: any[]
}) {
    const supabase = await createAdminClient()
    const { error } = await supabase
        .from('schedules')
        .upsert({ ...data, breaks: data.breaks ?? [] }, { onConflict: 'staff_id,day_of_week' })

    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/schedule')
    return { success: true }
}

export async function upsertScheduleException(data: {
    date: string; is_closed: boolean; notes?: string
}) {
    const supabase = await createAdminClient()
    const { error } = await supabase
        .from('schedule_exceptions')
        .upsert(data, { onConflict: 'date' })

    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/schedule')
    return { success: true }
}

export async function deleteScheduleException(id: string) {
    const supabase = await createAdminClient()
    const { error } = await supabase.from('schedule_exceptions').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/schedule')
    return { success: true }
}
