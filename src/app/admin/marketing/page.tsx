import { createAdminClient } from '@/lib/supabase/server'
import { Metadata } from 'next'
import MarketingView from '@/components/admin/MarketingView'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Marketing | Musky Paws Admin' }

export default async function AdminMarketingPage() {
    const supabase = await createAdminClient()

    // 1. Fetch Coupons
    const { data: coupons } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })

    // 2. Fetch Stats
    // Total discounts (simplified - assuming we want a count of used coupons from bookings)
    const { count: usedCouponsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .not('coupon_id', 'is', null)

    const { count: reviewRequestsSent } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('review_request_sent', true)

    const { count: retentionRemindersSent } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('retention_reminder_sent', true)

    const stats = {
        activeCoupons: coupons?.filter(c => c.active).length || 0,
        usedCouponsCount: usedCouponsCount || 0,
        reviewRequestsSent: reviewRequestsSent || 0,
        retentionRemindersSent: retentionRemindersSent || 0
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-brand-950">Marketing & Loyalty</h1>
                <p className="text-brand-500 text-sm mt-1">
                    Διαχείριση προσφορών και αυτοματισμών επικοινωνίας.
                </p>
            </div>

            <MarketingView coupons={coupons || []} stats={stats} />
        </div>
    )
}
