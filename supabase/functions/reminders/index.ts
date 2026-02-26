// @ts-nocheck
// Deno Edge Function – runs in Supabase environment
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
    const auth = req.headers.get('Authorization')
    if (auth !== `Bearer ${Deno.env.get('CRON_SECRET')}`) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const now = new Date()

    // ── 24-Hour Email + SMS Reminders ────────────────────────────────────────────
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const in23h = new Date(now.getTime() + 23 * 60 * 60 * 1000)

    const { data: upcoming24 } = await supabase
        .from('bookings')
        .select('id, start_at, customers(name, email, phone_e164, phone), services(name)')
        .eq('status', 'confirmed')
        .gte('start_at', in23h.toISOString())
        .lte('start_at', in24h.toISOString())

    let queued = 0

    for (const b of upcoming24 ?? []) {
        const phone = b.customers.phone_e164 || b.customers.phone
        const payload = {
            name: b.customers.name,
            serviceName: b.services.name,
            date: new Date(b.start_at).toLocaleDateString('el-GR'),
            time: new Date(b.start_at).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' }),
        }

        // Check no duplicate
        const { count } = await supabase
            .from('notification_outbox')
            .select('id', { count: 'exact', head: true })
            .eq('booking_id', b.id)
            .eq('template', 'reminder_24h')

        if (!count || count === 0) {
            const inserts: any[] = [
                { booking_id: b.id, channel: 'sms', to: phone, template: 'reminder_2h_sms', payload, run_at: now.toISOString() }
            ]
            if (b.customers.email) {
                inserts.push({ booking_id: b.id, channel: 'email', to: b.customers.email, template: 'reminder_24h', payload, run_at: now.toISOString() })
            }
            await supabase.from('notification_outbox').insert(inserts)
            queued += inserts.length
        }
    }

    // ── 2-Hour SMS Reminders ─────────────────────────────────────────────────────
    const in2h = new Date(now.getTime() + 2 * 60 * 60 * 1000)
    const in1h = new Date(now.getTime() + 1 * 60 * 60 * 1000)

    const { data: upcoming2h } = await supabase
        .from('bookings')
        .select('id, start_at, customers(name, phone_e164, phone), services(name)')
        .eq('status', 'confirmed')
        .gte('start_at', in1h.toISOString())
        .lte('start_at', in2h.toISOString())

    for (const b of upcoming2h ?? []) {
        const phone = b.customers.phone_e164 || b.customers.phone
        const { count } = await supabase
            .from('notification_outbox')
            .select('id', { count: 'exact', head: true })
            .eq('booking_id', b.id)
            .eq('template', 'reminder_2h_sms')

        if (!count || count === 0) {
            await supabase.from('notification_outbox').insert({
                booking_id: b.id,
                channel: 'sms',
                to: phone,
                template: 'reminder_2h_sms',
                payload: {
                    name: b.customers.name,
                    serviceName: b.services.name,
                    date: new Date(b.start_at).toLocaleDateString('el-GR'),
                    time: new Date(b.start_at).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' }),
                },
                run_at: now.toISOString()
            })
            queued++
        }
    }

    return new Response(JSON.stringify({ queued }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
    })
})
