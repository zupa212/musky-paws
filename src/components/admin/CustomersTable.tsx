'use client'

import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Phone, Mail, Clock, Star, Search, FileText, ChevronRight } from 'lucide-react'
import { updateCustomerNotes } from '@/app/actions/admin'

export default function CustomersTable({ customers }: { customers: any[] }) {
    const [selected, setSelected] = useState<any>(null)
    const [notes, setNotes] = useState('')
    const [savingNotes, setSavingNotes] = useState(false)
    const [search, setSearch] = useState('')

    const filtered = customers.filter(c => {
        const q = search.toLowerCase()
        return !q || c.name?.toLowerCase().includes(q) || c.phone?.includes(q) || c.email?.toLowerCase().includes(q)
    })

    const openCustomer = (c: any) => {
        setSelected(c)
        setNotes(c.admin_notes || '')
    }

    const handleSaveNotes = async () => {
        if (!selected) return
        setSavingNotes(true)
        await updateCustomerNotes(selected.id, notes)
        setSavingNotes(false)
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
                <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelected(null)}>
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                    <div
                        className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl p-6 space-y-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">{selected.name}</h2>
                            <button onClick={() => setSelected(null)} className="text-brand-400 hover:text-brand-700 text-2xl">&times;</button>
                        </div>

                        {/* Contact */}
                        <div className="bg-brand-50 rounded-2xl p-4 space-y-2 text-sm">
                            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-400" /><span className="font-medium">{selected.phone_e164 || selected.phone}</span></div>
                            {selected.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-400" /><span>{selected.email}</span></div>}
                            <div className="text-xs text-brand-400">Εγγραφή: {format(parseISO(selected.created_at), 'dd/MM/yyyy')}</div>
                        </div>

                        {/* Booking History */}
                        <div>
                            <h3 className="font-bold text-brand-900 mb-3">Ιστορικό Ραντεβού ({bookingCount(selected)})</h3>
                            <div className="space-y-2">
                                {selected.bookings?.sort((a: any, b: any) => b.start_at.localeCompare(a.start_at)).map((b: any) => (
                                    <div key={b.id} className="flex items-center justify-between bg-brand-50 rounded-xl px-4 py-3 text-sm">
                                        <div>
                                            <div className="font-semibold text-brand-900">{b.services?.name}</div>
                                            <div className="text-brand-500 text-xs">{format(parseISO(b.start_at), 'dd/MM/yyyy HH:mm')}</div>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${b.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                                                b.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                    b.status === 'canceled' ? 'bg-red-100 text-red-800 border-red-200' :
                                                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                                            }`}>{b.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Admin Notes */}
                        <div>
                            <label className="font-bold text-brand-900 text-sm flex items-center gap-2 mb-2">
                                <FileText className="w-4 h-4 text-brand-400" /> Σημειώσεις Admin
                            </label>
                            <textarea
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                rows={4}
                                placeholder="Προσωπικές σημειώσεις για αυτόν τον πελάτη…"
                                className="w-full text-sm border border-brand-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent-500 outline-none resize-none"
                            />
                            <button
                                onClick={handleSaveNotes}
                                disabled={savingNotes}
                                className="mt-2 px-4 py-2 bg-brand-950 text-white rounded-xl text-sm font-bold hover:bg-brand-800 transition-colors disabled:opacity-60"
                            >
                                {savingNotes ? 'Αποθήκευση…' : 'Αποθήκευση Σημειώσεων'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
