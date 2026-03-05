'use client'

import { useState } from 'react'
import { Ticket, Plus, Trash2, Calendar, Target, TrendingUp, Search, X, Loader2, Star, RefreshCcw, Download } from 'lucide-react'
import { createCoupon, deleteCoupon, exportCustomers } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

interface Coupon {
    id: string
    code: string
    discount_type: 'fixed' | 'percentage'
    discount_value: number
    min_booking_amount: number
    used_count: number
    max_uses: number | null
    expires_at: string | null
    active: boolean
    created_at: string
}

interface Stats {
    activeCoupons: number
    usedCouponsCount: number
    reviewRequestsSent: number
    retentionRemindersSent: number
}

export default function MarketingView({ coupons, stats }: { coupons: Coupon[], stats: Stats }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleDelete = async (id: string) => {
        if (!confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το κουπόνι;')) return
        const res = await deleteCoupon(id)
        if (res.success) router.refresh()
        else alert(res.error)
    }

    const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        const fd = new FormData(e.currentTarget)
        const data = {
            code: fd.get('code') as string,
            discount_type: fd.get('discount_type') as 'fixed' | 'percentage',
            discount_value: Number(fd.get('discount_value')),
            min_booking_amount: Number(fd.get('min_booking_amount')),
            max_uses: fd.get('max_uses') ? Number(fd.get('max_uses')) : undefined,
            expires_at: fd.get('expires_at') as string || undefined,
        }

        const res = await createCoupon(data)
        setIsSubmitting(false)
        if (res.success) {
            setIsModalOpen(false)
            router.refresh()
        } else {
            alert(res.error)
        }
    }

    const handleExportCSV = async () => {
        setIsSubmitting(true);
        const res = await exportCustomers();
        setIsSubmitting(false);
        if (!res.success || !res.customers) return alert('Σφάλμα εξαγωγής');

        const headers = ['Όνομα', 'Τηλέφωνο', 'Email', 'Ημ/νία Εγγραφής', 'Σημειώσεις'];
        const rows = res.customers.map((c: any) => [
            c.name, c.phone_e164 || c.phone, c.email || '',
            new Date(c.created_at).toLocaleDateString('el-GR'),
            c.admin_notes || ''
        ]);

        const csv = [headers, ...rows].map(r => r.map(col => `"${col?.toString().replace(/"/g, '""') || ''}"`).join(',')).join('\n');
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'text/csv;charset=utf-8;' }); // adding BOM for Excel
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-navy-900 hidden">Dashboard</h2>
                <div className="flex ml-auto">
                    <button
                        onClick={handleExportCSV}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-white border-2 border-brand-200 text-navy-900 px-5 py-2.5 rounded-xl font-bold hover:bg-brand-50 hover:border-brand-300 transition-all shadow-sm disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-5 h-5" />}
                        Εξαγωγή Πελατών (.CSV)
                    </button>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Ticket} label="Ενεργά Κουπόνια" value={stats.activeCoupons} color="blue" />
                <StatCard icon={TrendingUp} label="Χρήσεις Κουπονιών" value={stats.usedCouponsCount} color="green" />
                <StatCard icon={Star} label="Google Reviews Requests" value={stats.reviewRequestsSent} color="amber" />
                <StatCard icon={RefreshCcw} label="Retention Reminders" value={stats.retentionRemindersSent} color="indigo" />
            </div>

            {/* Coupons Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-brand-200 overflow-hidden">
                <div className="p-6 border-b border-brand-100 flex items-center justify-between bg-brand-50/50">
                    <div className="flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-navy-900" />
                        <h2 className="font-bold text-navy-900">Διαθέσιμα Κουπόνια</h2>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-navy-800 transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Δημιουργία
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-semibold text-brand-500 uppercase tracking-wider bg-brand-50/30">
                                <th className="px-6 py-4">Κωδικός</th>
                                <th className="px-6 py-4">Έκπτωση</th>
                                <th className="px-6 py-4">Χρήσεις</th>
                                <th className="px-6 py-4">Ελάχ. Ποσό</th>
                                <th className="px-6 py-4">Λήξη</th>
                                <th className="px-6 py-4 text-right">Ενέργειες</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-100">
                            {coupons.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-brand-400 italic">
                                        Δεν υπάρχουν διαθέσιμα κουπόνια.
                                    </td>
                                </tr>
                            ) : (
                                coupons.map((c) => (
                                    <tr key={c.id} className="hover:bg-brand-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-bold text-navy-900 bg-brand-100 px-2.5 py-1 rounded-lg border border-brand-200 uppercase">
                                                {c.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-navy-900">
                                                {c.discount_type === 'percentage' ? `${c.discount_value}%` : `${c.discount_value}€`}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-navy-900">{c.used_count} φορές</span>
                                                {c.max_uses && <span className="text-[10px] text-brand-400">max: {c.max_uses}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-brand-600">{c.min_booking_amount}€</td>
                                        <td className="px-6 py-4 text-sm text-brand-600">
                                            {c.expires_at ? new Date(c.expires_at).toLocaleDateString('el-GR') : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Coupon Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-brand-200 overflow-hidden text-navy-900 animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-brand-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold">Νέο Κουπόνι Έκπτωσης</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-brand-50 rounded-full transition-colors">
                                <X className="w-5 h-5 text-brand-400" />
                            </button>
                        </div>
                        <form onSubmit={onCreate} className="p-8 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-brand-500 uppercase tracking-wider mb-2">Κωδικός</label>
                                <input name="code" required placeholder="π.χ. WELCOME10" className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:ring-2 focus:ring-accent-500 outline-none uppercase font-mono" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-brand-500 uppercase tracking-wider mb-2">Τύπος Έκπτωσης</label>
                                    <select name="discount_type" className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:ring-2 focus:ring-accent-500 outline-none">
                                        <option value="fixed">Σταθερό (€)</option>
                                        <option value="percentage">Ποσοστό (%)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-500 uppercase tracking-wider mb-2">Τιμή Έκπτωσης</label>
                                    <input name="discount_value" type="number" required defaultValue={10} className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:ring-2 focus:ring-accent-500 outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-brand-500 uppercase tracking-wider mb-2">Ελάχ. Ποσό Κράτησης (€)</label>
                                    <input name="min_booking_amount" type="number" defaultValue={30} className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:ring-2 focus:ring-accent-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-500 uppercase tracking-wider mb-2">Μέγιστες Χρήσεις</label>
                                    <input name="max_uses" type="number" placeholder="Απεριόριστα" className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:ring-2 focus:ring-accent-500 outline-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-brand-500 uppercase tracking-wider mb-2">Ημ/νία Λήξης</label>
                                <input name="expires_at" type="date" className="w-full rounded-xl border border-brand-200 px-4 py-3 text-sm focus:ring-2 focus:ring-accent-500 outline-none" />
                            </div>

                            <div className="pt-6 border-t border-brand-100 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border-2 border-brand-200 rounded-2xl font-bold text-sm hover:bg-brand-50 transition-colors">Ακύρωση</button>
                                <button type="submit" disabled={isSubmitting} className="flex-2 flex items-center justify-center gap-2 py-3 bg-navy-900 text-white rounded-2xl font-bold text-sm hover:bg-navy-800 transition-all shadow-md disabled:opacity-50">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Δημιουργία Κουπονιού'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: number, color: 'blue' | 'green' | 'amber' | 'indigo' }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        amber: 'bg-amber-50 text-amber-600',
        indigo: 'bg-indigo-50 text-indigo-600'
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-200 flex items-center gap-5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClasses[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs font-bold text-brand-500 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-black text-navy-900 mt-0.5">{value}</p>
            </div>
        </div>
    )
}
