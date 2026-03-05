'use client'

import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Phone, Mail, Clock, Star, Search, ChevronRight } from 'lucide-react'
import CustomerProfileDrawer from './CustomerProfileDrawer'

export default function CustomersTable({ customers }: { customers: any[] }) {
    const [selected, setSelected] = useState<any>(null)
    const [search, setSearch] = useState('')

    const filtered = customers.filter(c => {
        const q = search.toLowerCase()
        return !q || c.name?.toLowerCase().includes(q) || c.phone?.includes(q) || c.email?.toLowerCase().includes(q)
    })

    const openCustomer = (c: any) => {
        setSelected(c)
    }

    const bookingCount = (c: any) => c.bookings?.length ?? 0
    const lastBooking = (c: any) =>
        c.bookings?.sort((a: any, b: any) => b.start_at.localeCompare(a.start_at))[0]

    return (
        <>
            {/* Search */}
            <div className="bg-white rounded-2xl border border-brand-200 p-4">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-brand-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Αναζήτηση ονόματος, τηλ, email…"
                        className="w-full pl-9 pr-4 py-2 text-sm border border-brand-200 rounded-xl focus:ring-2 focus:ring-accent-500 outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-brand-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-brand-50 border-b border-brand-100 text-brand-500 text-xs uppercase tracking-wide">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Πελάτης</th>
                                <th className="px-4 py-3 font-semibold">Επικοινωνία</th>
                                <th className="px-4 py-3 font-semibold">Ραντεβού</th>
                                <th className="px-4 py-3 font-semibold">Τελευταίο Ραντεβού</th>
                                <th className="px-4 py-3 font-semibold"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-100">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={5} className="py-12 text-center text-brand-400">Δεν βρέθηκαν πελάτες</td></tr>
                            ) : filtered.map(c => {
                                const last = lastBooking(c)
                                return (
                                    <tr key={c.id} className="hover:bg-brand-50/60 cursor-pointer group transition-colors" onClick={() => openCustomer(c)}>
                                        <td className="px-4 py-3">
                                            <div className="font-bold text-brand-900">{c.name}</div>
                                            <div className="text-brand-400 text-xs mt-0.5">Εγγραφή {format(parseISO(c.created_at), 'dd/MM/yyyy')}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5 text-brand-600"><Phone className="w-3.5 h-3.5 text-brand-400" />{c.phone_e164 || c.phone}</div>
                                            {c.email && <div className="flex items-center gap-1.5 text-brand-500 text-xs mt-1"><Mail className="w-3 h-3 text-brand-400" />{c.email}</div>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1 bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full text-xs font-bold">
                                                <Star className="w-3 h-3" />{bookingCount(c)} ραντεβού
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {last ? (
                                                <div>
                                                    <div className="text-brand-700 font-medium">{last.services?.name}</div>
                                                    <div className="text-brand-400 text-xs flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" />{format(parseISO(last.start_at), 'dd/MM/yyyy')}</div>
                                                </div>
                                            ) : <span className="text-brand-400 text-xs">—</span>}
                                        </td>
                                        <td className="px-4 py-3 text-right"><ChevronRight className="w-4 h-4 text-brand-300 group-hover:text-brand-600 transition-colors" /></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Customer Detail Drawer */}
            {selected && (
                <CustomerProfileDrawer customer={selected} onClose={() => setSelected(null)} />
            )}
        </>
    )
}
