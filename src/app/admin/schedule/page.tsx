import { createAdminClient } from '@/lib/supabase/server'
import ScheduleManager from '@/components/admin/ScheduleManager'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Ωράριο | Musky Paws Admin' }

export default async function AdminSchedulePage() {
    const supabase = await createAdminClient()

    const [{ data: schedules }, { data: exceptions }] = await Promise.all([
        supabase.from('schedules').select('*').order('day_of_week'),
        supabase.from('schedule_exceptions').select('*').order('date', { ascending: false }).limit(30),
    ])

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-brand-950">Ωράριο & Εξαιρέσεις</h1>
            <ScheduleManager schedules={schedules ?? []} exceptions={exceptions ?? []} />
        </div>
    )
}
