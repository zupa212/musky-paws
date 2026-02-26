import { createAdminClient } from '@/lib/supabase/server'
import CustomersTable from '@/components/admin/CustomersTable'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Πελάτες | Musky Paws Admin' }

export default async function AdminCustomersPage() {
    const supabase = await createAdminClient()

    const { data: customers } = await supabase
        .from('customers')
        .select(`
      id, name, phone, phone_e164, email, admin_notes, created_at,
      bookings (id, status, start_at, services (name))
    `)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-brand-950">Πελάτες</h1>
                <p className="text-brand-500 text-sm mt-1">{customers?.length ?? 0} καταγεγραμμένοι πελάτες</p>
            </div>
            <CustomersTable customers={customers ?? []} />
        </div>
    )
}
