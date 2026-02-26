import { createAdminClient } from '@/lib/supabase/server'
import ServicesManager from '@/components/admin/ServicesManager'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Υπηρεσίες | Musky Paws Admin' }

export default async function AdminServicesPage() {
    const supabase = await createAdminClient()
    const { data: services } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: true })

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-brand-950">Υπηρεσίες</h1>
            <ServicesManager services={services ?? []} />
        </div>
    )
}
