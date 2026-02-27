'use client'

import { useState, useTransition, useEffect } from 'react'
import { X, Plus, Phone, Loader2 } from 'lucide-react'
import { createManualBooking } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

export default function ManualBookingModal({
    services,
    onClose,
}: {
    services: { id: string; name: string; slug: string; duration_min: number; price_from: number }[]
    onClose: () => void
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [slots, setSlots] = useState<{ time: string }[]>([])
    const [loadingSlots, setLoadingSlots] = useState(false)

    const [form, setForm] = useState({
        customerName: '', customerPhone: '', customerEmail: '',
        serviceId: services[0]?.id ?? '', date: '', time: '',
        petType: 'dog', breed: '', weightKg: '', notes: '',
        forceBooking: false, sendNotification: true,
    })

    const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

    // Fetch available slots when date + service change
    useEffect(() => {
        if (!form.date || !form.serviceId) return
        setLoadingSlots(true)
        fetch(`/api/slots?date=${form.date}&service=${form.serviceId}`)
            .then(r => r.json())
            .then(d => { setSlots(d.slots || []); setLoadingSlots(false) })
            .catch(() => setLoadingSlots(false))
    }, [form.date, form.serviceId])

    const handleSubmit = () => {
        if (!form.customerName || !form.customerPhone || !form.serviceId || !form.date || !form.time) {
            setError('Παρακαλώ συμπληρώστε τα υποχρεωτικά πεδία')
            return
        }
        setError('')
        startTransition(async () => {
            const result = await createManualBooking(form)
            if (result.success) {
                setSuccess(true)
                setTimeout(() => { onClose(); router.refresh() }, 1200)
            } else {
                setError(result.error ?? 'Σφάλμα')
            }
        })
    }

    const inputCls = "w-full text-sm border border-brand-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-accent-500 outline-none transition-colors"
    const labelCls = "text-xs font-semibold text-brand-500 mb-1 block"

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-brand-100 p-5 flex items-center justify-between rounded-t-2xl z-10">
                    <h2 className="text-lg font-bold text-brand-900 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-accent-500" /> Νέο Ραντεβού (Τηλέφωνο)
                    </h2>
                    <button onClick={onClose} className="p-1.5 hover:bg-brand-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-brand-400" />
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Customer */}
                    <div className="bg-brand-50 rounded-xl p-4 space-y-3">
                        <p className="text-xs font-bold text-brand-400 uppercase tracking-wide">Στοιχεία Πελάτη</p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2"><label className={labelCls}>Όνομα *</label><input value={form.customerName} onChange={e => set('customerName', e.target.value)} className={inputCls} placeholder="Γιώργος Παπ." /></div>
                            <div><label className={labelCls}>Τηλέφωνο *</label><input value={form.customerPhone} onChange={e => set('customerPhone', e.target.value)} className={inputCls} placeholder="694..." /></div>
                            <div><label className={labelCls}>Email</label><input value={form.customerEmail} onChange={e => set('customerEmail', e.target.value)} className={inputCls} placeholder="email@..." /></div>
                        </div>
                    </div>

                    {/* Pet */}
                    <div className="grid grid-cols-3 gap-3">
                        <div><label className={labelCls}>Ζώο</label>
                            <select value={form.petType} onChange={e => set('petType', e.target.value)} className={inputCls}>
                                <option value="dog">Σκύλος</option><option value="cat">Γάτα</option>
                            </select>
                        </div>
                        <div><label className={labelCls}>Ράτσα</label><input value={form.breed} onChange={e => set('breed', e.target.value)} className={inputCls} /></div>
                        <div><label className={labelCls}>Κιλά</label><input value={form.weightKg} onChange={e => set('weightKg', e.target.value)} className={inputCls} /></div>
                    </div>

                    {/* Service + Date/Time */}
                    <div>
                        <label className={labelCls}>Υπηρεσία *</label>
                        <select value={form.serviceId} onChange={e => set('serviceId', e.target.value)} className={inputCls}>
                            {services.map(s => <option key={s.id} value={s.id}>{s.name} ({s.duration_min}λ · από {s.price_from}€)</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelCls}>Ημερομηνία *</label>
                            <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Ώρα *</label>
                            {loadingSlots ? (
                                <div className="flex items-center gap-2 text-sm text-brand-400 py-2.5"><Loader2 className="w-4 h-4 animate-spin" /> Φόρτωση...</div>
                            ) : form.date ? (
                                <select value={form.time} onChange={e => set('time', e.target.value)} className={inputCls}>
                                    <option value="">Επιλέξτε ώρα</option>
                                    {slots.map(s => <option key={s.time} value={s.time}>{s.time}</option>)}
                                    {slots.length === 0 && <option disabled>Δεν υπάρχουν slots</option>}
                                </select>
                            ) : (
                                <p className="text-sm text-brand-400 py-2.5">Επιλέξτε πρώτα ημερομηνία</p>
                            )}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className={labelCls}>Σημειώσεις</label>
                        <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className={inputCls} />
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-wrap gap-6">
                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                            <input type="checkbox" checked={form.sendNotification} onChange={e => set('sendNotification', e.target.checked)}
                                className="w-4 h-4 rounded border-brand-300 text-accent-500 focus:ring-accent-500" />
                            Αποστολή SMS/Email επιβεβαίωσης
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-orange-600">
                            <input type="checkbox" checked={form.forceBooking} onChange={e => set('forceBooking', e.target.checked)}
                                className="w-4 h-4 rounded border-orange-300 text-orange-500 focus:ring-orange-500" />
                            Force booking (αγνόηση overlap)
                        </label>
                    </div>

                    {/* Error / Success */}
                    {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>}
                    {success && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2">✓ Ραντεβού δημιουργήθηκε!</p>}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={isPending || success}
                        className="w-full py-3 bg-brand-950 text-white font-bold rounded-xl hover:bg-brand-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Αποθήκευση...</> : <><Plus className="w-4 h-4" /> Δημιουργία Ραντεβού</>}
                    </button>
                </div>
            </div>
        </div>
    )
}
