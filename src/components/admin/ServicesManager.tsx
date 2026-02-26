'use client'

import { useState, useTransition } from 'react'
import { Plus, Pencil, Trash2, Check, X, ToggleLeft, ToggleRight, Clock, DollarSign } from 'lucide-react'
import { upsertService, deleteService } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

type Service = {
    id: string; slug: string; name: string
    duration_min: number; buffer_min: number
    price_from: number; active: boolean
}

const EMPTY: Omit<Service, 'id'> = { slug: '', name: '', duration_min: 60, buffer_min: 15, price_from: 0, active: true }

export default function ServicesManager({ services }: { services: Service[] }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showNew, setShowNew] = useState(false)
    const [form, setForm] = useState<Omit<Service, 'id'>>(EMPTY)

    const handleSave = async (id?: string) => {
        startTransition(async () => {
            await upsertService({ ...form, ...(id ? { id } : {}) })
            setEditingId(null)
            setShowNew(false)
            setForm(EMPTY)
            router.refresh()
        })
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Θέλετε σίγουρα να διαγράψετε αυτή την υπηρεσία;')) return
        startTransition(async () => {
            await deleteService(id)
            router.refresh()
        })
    }

    const startEdit = (srv: Service) => {
        setEditingId(srv.id)
        setForm({ slug: srv.slug, name: srv.name, duration_min: srv.duration_min, buffer_min: srv.buffer_min, price_from: srv.price_from, active: srv.active })
    }

    const inputCls = "w-full text-sm border border-brand-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-accent-500 outline-none"

    const ServiceForm = ({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) => (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-brand-50 rounded-2xl border border-brand-200">
            <div className="col-span-2 md:col-span-1">
                <label className="text-xs font-semibold text-brand-500 mb-1 block">Όνομα</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="π.χ. Πλήρης Καλλωπισμός" className={inputCls} />
            </div>
            <div>
                <label className="text-xs font-semibold text-brand-500 mb-1 block">Slug</label>
                <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="full-grooming" className={inputCls} />
            </div>
            <div>
                <label className="text-xs font-semibold text-brand-500 mb-1 block">Διάρκεια (λεπτά)</label>
                <input type="number" value={form.duration_min} onChange={e => setForm({ ...form, duration_min: +e.target.value })} className={inputCls} />
            </div>
            <div>
                <label className="text-xs font-semibold text-brand-500 mb-1 block">Buffer (λεπτά)</label>
                <input type="number" value={form.buffer_min} onChange={e => setForm({ ...form, buffer_min: +e.target.value })} className={inputCls} />
            </div>
            <div>
                <label className="text-xs font-semibold text-brand-500 mb-1 block">Τιμή από (€)</label>
                <input type="number" step="0.01" value={form.price_from} onChange={e => setForm({ ...form, price_from: +e.target.value })} className={inputCls} />
            </div>
            <div className="flex items-center gap-2 mt-5">
                <label className="text-sm font-semibold text-brand-700">Ενεργό</label>
                <button type="button" onClick={() => setForm({ ...form, active: !form.active })} className="text-accent-600">
                    {form.active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6 text-brand-400" />}
                </button>
            </div>
            <div className="col-span-2 md:col-span-3 flex gap-2 justify-end">
                <button onClick={onCancel} className="px-4 py-2 text-sm font-medium border border-brand-200 rounded-xl hover:bg-brand-100 transition-colors flex items-center gap-1"><X className="w-3.5 h-3.5" /> Άκυρο</button>
                <button onClick={onSave} disabled={isPending} className="px-4 py-2 text-sm font-bold bg-brand-950 text-white rounded-xl hover:bg-brand-800 transition-colors flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Αποθήκευση</button>
            </div>
        </div>
    )

    return (
        <div className="space-y-3">
            {services.map(srv => (
                editingId === srv.id ? (
                    <ServiceForm key={srv.id} onSave={() => handleSave(srv.id)} onCancel={() => setEditingId(null)} />
                ) : (
                    <div key={srv.id} className="bg-white rounded-2xl border border-brand-200 px-5 py-4 flex items-center gap-4 group hover:border-brand-300 transition-colors">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${srv.active ? 'bg-green-400' : 'bg-brand-300'}`} />
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-brand-900">{srv.name}</div>
                            <div className="text-xs text-brand-500 flex items-center gap-3 mt-0.5">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{srv.duration_min}λ + {srv.buffer_min}λ</span>
                                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />από {srv.price_from}€</span>
                                <span className="font-mono bg-brand-100 px-1.5 rounded">{srv.slug}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(srv)} className="p-2 text-brand-500 hover:bg-brand-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(srv.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                )
            ))}

            {showNew && (
                <ServiceForm onSave={() => handleSave()} onCancel={() => { setShowNew(false); setForm(EMPTY) }} />
            )}

            {!showNew && (
                <button
                    onClick={() => { setShowNew(true); setEditingId(null) }}
                    className="flex items-center gap-2 text-sm font-bold px-5 py-3 rounded-2xl border-2 border-dashed border-brand-300 text-brand-500 hover:border-accent-400 hover:text-accent-600 w-full transition-colors"
                >
                    <Plus className="w-4 h-4" /> Νέα Υπηρεσία
                </button>
            )}
        </div>
    )
}
