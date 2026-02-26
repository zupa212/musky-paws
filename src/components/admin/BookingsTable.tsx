'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import {
    Search, Filter, Download, CheckCircle2, XCircle,
    ChevronRight, Clock, User, Phone, Mail, PawPrint,
    CheckCheck, AlertCircle, MoreHorizontal
} from 'lucide-react'
import { updateBookingStatus, resendNotification } from '@/app/actions/admin'
import { Send } from 'lucide-react'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending: { label: 'Αναμονή', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    confirmed: { label: 'Επιβεβαιωμένο', color: 'bg-green-100 text-green-800 border-green-200' },
    completed: { label: 'Ολοκληρώθηκε', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    canceled: { label: 'Ακυρώθηκε', color: 'bg-red-100 text-red-800 border-red-200' },
    no_show: { label: 'No Show', color: 'bg-gray-100 text-gray-700 border-gray-200' },
}

export default function BookingsTable({ bookings }: { bookings: any[] }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [drawerBooking, setDrawerBooking] = useState<any>(null)
    const [actionPending, setActionPending] = useState<string | null>(null)
    const [resendBusy, setResendBusy] = useState<string | null>(null)
    const [resendDone, setResendDone] = useState<string | null>(null)

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) params.set(key, value)
        else params.delete(key)
        startTransition(() => router.push(`${pathname}?${params.toString()}`))
    }

    const handleStatusChange = async (id: string, status: string) => {
        setActionPending(id)
        await updateBookingStatus(id, status as any)
        setActionPending(null)
        setDrawerBooking(null)
    }

    const handleResend = async (channel: 'sms' | 'email', template: string) => {
        if (!drawerBooking) return
        const key = `${channel}-${template}`
        setResendBusy(key)
        await resendNotification(drawerBooking.id, channel, template)
        setResendBusy(null)
        setResendDone(key)
        setTimeout(() => setResendDone(null), 3000)
    }

    const exportCSV = () => {
        const headers = ['ID', 'Ημερομηνία', 'Πελάτης', 'Τηλέφωνο', 'Email', 'Υπηρεσία', 'Κατοικίδιο', 'Κατάσταση']
        const rows = bookings.map(b => [
            b.id,
            format(parseISO(b.start_at), 'dd/MM/yyyy HH:mm'),
            b.customers?.name,
            b.customers?.phone_e164 || b.customers?.phone,
            b.customers?.email,
            b.services?.name,
            `${b.pet_type} ${b.breed || ''} ${b.weight_kg || ''}`.trim(),
            b.status,
        ])
        const csv = [headers, ...rows].map(r => r.map(c => `"${c ?? ''}"`).join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url
        a.download = `bookings_${format(new Date(), 'yyyyMMdd')}.csv`
        document.body.appendChild(a); a.click(); document.body.removeChild(a)
    }

    return (
        <>
            {/* Filters Bar */}
            <div className="bg-white rounded-2xl border border-brand-200 p-4 flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-brand-400" />
                    <input
                        placeholder="Αναζήτηση ονόματος, τηλ, email…"
                        defaultValue={searchParams.get('q') ?? ''}
                        onChange={e => updateParam('q', e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-brand-200 rounded-xl focus:ring-2 focus:ring-accent-500 outline-none"
                    />
                </div>

                <select
                    defaultValue={searchParams.get('status') ?? ''}
                    onChange={e => updateParam('status', e.target.value)}
                    className="text-sm border border-brand-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-accent-500 outline-none bg-white"
                >
                    <option value="">Όλες οι καταστάσεις</option>
                    {Object.entries(STATUS_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                    ))}
                </select>

                <input
                    type="date"
                    defaultValue={searchParams.get('date_from') ?? ''}
                    onChange={e => updateParam('date_from', e.target.value)}
                    className="text-sm border border-brand-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-accent-500 outline-none"
                />
                <span className="text-brand-400 text-sm">έως</span>
                <input
                    type="date"
                    defaultValue={searchParams.get('date_to') ?? ''}
                    onChange={e => updateParam('date_to', e.target.value)}
                    className="text-sm border border-brand-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-accent-500 outline-none"
                />

                <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-brand-200 hover:bg-brand-50 transition-colors ml-auto"
                >
                    <Download className="w-4 h-4" /> CSV
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-brand-200 overflow-hidden">
                {bookings.length === 0 ? (
                    <div className="py-20 text-center text-brand-400">
                        <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">Δεν βρέθηκαν ραντεβού</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-brand-50 border-b border-brand-100 text-brand-500 uppercase text-xs tracking-wide">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Ημ/νία & Ώρα</th>
                                    <th className="px-4 py-3 font-semibold">Πελάτης</th>
                                    <th className="px-4 py-3 font-semibold">Υπηρεσία</th>
                                    <th className="px-4 py-3 font-semibold">Κατοικίδιο</th>
                                    <th className="px-4 py-3 font-semibold">Κατάσταση</th>
                                    <th className="px-4 py-3 font-semibold text-right">Ενέργειες</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-100">
                                {bookings.map(b => {
                                    const start = parseISO(b.start_at)
                                    const st = STATUS_LABELS[b.status] ?? { label: b.status, color: 'bg-gray-100 text-gray-700 border-gray-200' }
                                    return (
                                        <tr
                                            key={b.id}
                                            className="hover:bg-brand-50/60 transition-colors cursor-pointer group"
                                            onClick={() => setDrawerBooking(b)}
                                        >
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="font-bold text-brand-900">{format(start, 'dd/MM/yyyy')}</div>
                                                <div className="text-brand-500 flex items-center gap-1 mt-0.5">
                                                    <Clock className="w-3 h-3" />{format(start, 'HH:mm')}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-brand-900">{b.customers?.name}</div>
                                                <div className="text-brand-500 flex items-center gap-1 mt-0.5">
                                                    <Phone className="w-3 h-3" />
                                                    {b.customers?.phone_e164 || b.customers?.phone}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-brand-900">{b.services?.name}</div>
                                                <div className="text-brand-500 text-xs">{b.services?.duration_min}λ · από {b.services?.price_from}€</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-1 bg-brand-100 px-2 py-0.5 rounded text-xs font-medium">
                                                    <PawPrint className="w-3 h-3" />
                                                    {b.pet_type === 'dog' ? 'Σκύλος' : 'Γάτα'}
                                                    {b.breed ? ` · ${b.breed}` : ''}
                                                    {b.weight_kg ? ` · ${b.weight_kg}` : ''}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${st.color}`}>
                                                    {st.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {b.status === 'pending' && (
                                                        <button
                                                            disabled={actionPending === b.id}
                                                            onClick={() => handleStatusChange(b.id, 'confirmed')}
                                                            title="Επιβεβαίωση"
                                                            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {(b.status === 'pending' || b.status === 'confirmed') && (
                                                        <button
                                                            disabled={actionPending === b.id}
                                                            onClick={() => handleStatusChange(b.id, 'completed')}
                                                            title="Ολοκλήρωση"
                                                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                        >
                                                            <CheckCheck className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {(b.status === 'pending' || b.status === 'confirmed') && (
                                                        <button
                                                            disabled={actionPending === b.id}
                                                            onClick={() => handleStatusChange(b.id, 'canceled')}
                                                            title="Ακύρωση"
                                                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setDrawerBooking(b)}
                                                        className="p-2 bg-brand-50 text-brand-600 hover:bg-brand-100 rounded-lg transition-colors"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail Drawer */}
            {drawerBooking && (
                <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setDrawerBooking(null)}>
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                    <div
                        className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl p-6 space-y-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Λεπτομέρειες Ραντεβού</h2>
                            <button onClick={() => setDrawerBooking(null)} className="text-brand-400 hover:text-brand-700 text-2xl leading-none">&times;</button>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="text-xs font-semibold text-brand-400 uppercase tracking-wide">Κατάσταση</label>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {['confirmed', 'completed', 'canceled', 'no_show'].map(s => (
                                    <button
                                        key={s}
                                        disabled={drawerBooking.status === s || actionPending === drawerBooking.id}
                                        onClick={() => handleStatusChange(drawerBooking.id, s)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors
                      ${drawerBooking.status === s
                                                ? STATUS_LABELS[s]?.color + ' opacity-100'
                                                : 'border-brand-200 text-brand-600 hover:bg-brand-50'
                                            }`}
                                    >
                                        {STATUS_LABELS[s]?.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date/Time */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-brand-400 font-semibold text-xs uppercase">Ημερομηνία</span><p className="font-bold mt-1">{format(parseISO(drawerBooking.start_at), 'dd/MM/yyyy')}</p></div>
                            <div><span className="text-brand-400 font-semibold text-xs uppercase">Ώρα</span><p className="font-bold mt-1">{format(parseISO(drawerBooking.start_at), 'HH:mm')}</p></div>
                            <div><span className="text-brand-400 font-semibold text-xs uppercase">Υπηρεσία</span><p className="font-bold mt-1">{drawerBooking.services?.name}</p></div>
                            <div><span className="text-brand-400 font-semibold text-xs uppercase">Διάρκεια</span><p className="font-bold mt-1">{drawerBooking.services?.duration_min} λεπτά</p></div>
                        </div>

                        {/* Customer */}
                        <div className="bg-brand-50 rounded-2xl p-4 space-y-2 text-sm">
                            <div className="font-bold text-brand-900 flex items-center gap-2"><User className="w-4 h-4 text-brand-400" /> {drawerBooking.customers?.name}</div>
                            <div className="flex items-center gap-2 text-brand-600"><Phone className="w-3.5 h-3.5 text-brand-400" /> {drawerBooking.customers?.phone_e164 || drawerBooking.customers?.phone}</div>
                            {drawerBooking.customers?.email && <div className="flex items-center gap-2 text-brand-600"><Mail className="w-3.5 h-3.5 text-brand-400" /> {drawerBooking.customers?.email}</div>}
                        </div>

                        {/* Pet */}
                        <div>
                            <span className="text-brand-400 font-semibold text-xs uppercase">Κατοικίδιο</span>
                            <p className="mt-1 text-sm font-medium">{drawerBooking.pet_type === 'dog' ? '🐶 Σκύλος' : '🐱 Γάτα'} {drawerBooking.breed ? `· ${drawerBooking.breed}` : ''} {drawerBooking.weight_kg ? `· ${drawerBooking.weight_kg}` : ''}</p>
                        </div>

                        {/* Notes */}
                        {drawerBooking.notes && (
                            <div>
                                <span className="text-brand-400 font-semibold text-xs uppercase">Παρατηρήσεις</span>
                                <p className="mt-1 text-sm bg-brand-50 rounded-xl p-3">{drawerBooking.notes}</p>
                            </div>
                        )}

                        {/* Resend Notifications */}
                        <div>
                            <label className="text-xs font-semibold text-brand-400 uppercase tracking-wide">Επαναποστολή Ειδοποίησης</label>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {[
                                    { channel: 'sms' as const, template: `booking_${drawerBooking.status}_customer`, label: 'SMS Πελάτη' },
                                    ...(drawerBooking.customers?.email ? [{ channel: 'email' as const, template: `booking_${drawerBooking.status}_customer`, label: 'Email Πελάτη' }] : []),
                                ].map(({ channel, template, label }) => {
                                    const key = `${channel}-${template}`
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => handleResend(channel, template)}
                                            disabled={resendBusy === key}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors
                                              ${resendDone === key ? 'bg-green-100 text-green-700 border-green-300' : 'border-brand-200 text-brand-600 hover:bg-brand-50'}`}
                                        >
                                            <Send className="w-3 h-3" />
                                            {resendDone === key ? '✓ Εστάλη' : resendBusy === key ? '...' : label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="text-xs text-brand-400">ID: {drawerBooking.id}</div>
                    </div>
                </div>
            )}
        </>
    )
}
