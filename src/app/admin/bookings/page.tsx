import { createAdminClient } from '@/lib/supabase/server'
import BookingsTable from '@/components/admin/BookingsTable'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Ραντεβού | Musky Paws Admin' }

export default async function AdminBookingsPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; date_from?: string; date_to?: string; q?: string }>
}) {
    const params = await searchParams
    const supabase = await createAdminClient()

    let query = supabase
        .from('bookings')
        .select(`
      id, start_at, end_at, status, pet_type, breed, weight_kg, notes, source, created_at,
      customers (id, name, phone, phone_e164, email),
      services (id, name, duration_min, price_from)
    `)
        .order('start_at', { ascending: false })

    if (params.status) query = query.eq('status', params.status)
    if (params.date_from) query = query.gte('start_at', params.date_from)
    if (params.date_to) query = query.lte('start_at', params.date_to + 'T23:59:59')

    const { data: bookings, error } = await query

    // Fetch active services for manual booking modal
    const { data: services } = await supabase
        .from('services')
        .select('id, name, slug, duration_min, price_from')
        .eq('active', true)
        .order('name')

    // Filter by phone/email/name client-side search
    const filtered = params.q
        ? bookings?.filter((b: any) => {
            const q = params.q!.toLowerCase()
            return (
                b.customers?.name?.toLowerCase().includes(q) ||
                b.customers?.phone?.includes(q) ||
                b.customers?.email?.toLowerCase().includes(q)
            )
        })
        : bookings

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-brand-950">Ραντεβού</h1>
                <p className="text-brand-500 text-sm mt-1">
                    {filtered?.length ?? 0} αποτελέσματα
                </p>
            </div>
            <BookingsTable bookings={filtered ?? []} services={services ?? []} />
        </div>
    )
}
