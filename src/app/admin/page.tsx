import { createAdminClient } from '@/lib/supabase/server'
import {
    CalendarDays, Users, Clock, AlertCircle,
    ChevronRight, ArrowUpRight, Plus, Settings,
    TrendingUp, Calendar
} from 'lucide-react'
import Link from 'next/link'
import { format, startOfToday, endOfToday, addDays, startOfTomorrow } from 'date-fns'
import { el } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
    const supabase = await createAdminClient()
    const today = new Date()
    const todayStr = format(today, 'yyyy-MM-dd')
    const nextWeekStr = format(addDays(today, 7), 'yyyy-MM-dd')

    // 1. Fetch Today's Bookings
    const { count: todayCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('start_at', format(startOfToday(), 'yyyy-MM-ddHH:mm:ss'))
        .lte('start_at', format(endOfToday(), 'yyyy-MM-ddHH:mm:ss'))
        .neq('status', 'canceled')

    // 2. Fetch Pending Bookings
    const { count: pendingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

    // 3. Fetch Weekly Bookings
    const { count: weeklyCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('start_at', today.toISOString())
        .lte('start_at', addDays(today, 7).toISOString())
        .neq('status', 'canceled')

    // 4. Fetch Total Customers
    const { count: customerCount } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })

    // 5. Fetch Recent Activity (last 5 bookings)
    const { data: recentBookings } = await supabase
        .from('bookings')
        .select('*, customers(name), services(name)')
        .order('created_at', { ascending: false })
        .limit(5)

    const stats = [
        { label: 'Σήμερα', value: todayCount || 0, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/bookings?view=today' },
        { label: 'Εκκρεμή', value: pendingCount || 0, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', link: '/admin/bookings?status=pending' },
        { label: 'Εβδομάδα', value: weeklyCount || 0, icon: Calendar, color: 'text-green-600', bg: 'bg-green-50', link: '/admin/bookings' },
        { label: 'Πελάτες', value: customerCount || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', link: '/admin/customers' },
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black text-brand-950">Καλησπέρα 👋</h1>
                <p className="text-brand-600 font-medium">Επισκόπηση της επιχείρησής σας για σήμερα, {format(today, "EEEE d MMMM", { locale: el })}</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <Link key={s.label} href={s.link} className="bg-white p-5 rounded-[24px] border border-brand-200 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <s.icon className="w-6 h-6" />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-brand-300 group-hover:text-brand-950 transition-colors" />
                        </div>
                        <p className="text-3xl font-black text-brand-950">{s.value}</p>
                        <p className="text-sm font-bold text-brand-500 uppercase tracking-wider mt-1">{s.label}</p>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-brand-950 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-accent-500" /> Πρόσφατη Δραστηριότητα
                        </h2>
                        <Link href="/admin/bookings" className="text-sm font-bold text-accent-600 hover:underline">Όλα τα ραντεβού</Link>
                    </div>

                    <div className="bg-white rounded-[32px] border border-brand-200 overflow-hidden shadow-sm">
                        <div className="divide-y divide-brand-100">
                            {recentBookings?.map((b) => (
                                <div key={b.id} className="p-5 flex items-center justify-between hover:bg-brand-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-lg">
                                            {b.pet_type === 'dog' ? '🐕' : '🐱'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-brand-950">{b.customers?.name}</p>
                                            <p className="text-xs text-brand-500 font-medium">
                                                {format(new Date(b.start_at), "d MMM, HH:mm", { locale: el })} • {b.services?.name}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${b.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' :
                                            b.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                                'bg-brand-100 text-brand-600 border-brand-200'
                                        }`}>
                                        {b.status}
                                    </div>
                                </div>
                            ))}
                            {(!recentBookings || recentBookings.length === 0) && (
                                <div className="p-10 text-center text-brand-400 font-medium italic">
                                    Δεν υπάρχει πρόσφατη δραστηριότητα.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <h2 className="text-lg font-black text-brand-950 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-accent-500" /> Γρήγορες Ενέργειες
                    </h2>
                    <div className="grid grid-cols-1 gap-3">
                        <Link href="/admin/bookings?action=new" className="flex items-center gap-4 p-4 bg-navy-900 text-white rounded-2xl hover:bg-navy-800 transition-all shadow-lg shadow-navy-900/10">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                <Plus className="w-5 h-5" />
                            </div>
                            <span className="font-bold">Νέο Ραντεβού</span>
                        </Link>

                        <Link href="/admin/schedule" className="flex items-center gap-4 p-4 bg-white border border-brand-200 rounded-2xl hover:bg-brand-50 hover:border-brand-300 transition-all">
                            <div className="w-10 h-10 bg-accent-100 text-accent-600 rounded-xl flex items-center justify-center">
                                <Settings className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-brand-950">Ρυθμίσεις Ωραρίου</span>
                        </Link>

                        <Link href="/admin/marketing" className="flex items-center gap-4 p-4 bg-white border border-brand-200 rounded-2xl hover:bg-brand-50 hover:border-brand-300 transition-all">
                            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-brand-950">Marketing / Καμπάνιες</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
