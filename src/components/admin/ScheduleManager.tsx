'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Save, Calendar, Clock } from 'lucide-react'
import { upsertSchedule, deleteScheduleException, upsertScheduleException } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

const DAYS = ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο']

export default function ScheduleManager({ schedules, exceptions }: { schedules: any[], exceptions: any[] }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [editedSchedules, setEditedSchedules] = useState<Record<string, any>>(
        Object.fromEntries(schedules.map(s => [s.day_of_week, s]))
    )
    const [newException, setNewException] = useState({ date: '', is_closed: true, notes: '' })

    const staffId = '00000000-0000-0000-0000-000000000001'

    const handleScheduleChange = (day: number, field: string, value: any) => {
        setEditedSchedules(prev => ({
            ...prev,
            [day]: { ...(prev[day] || { day_of_week: day, staff_id: staffId }), [field]: value }
        }))
    }

    const handleSaveSchedules = () => {
        startTransition(async () => {
            for (const entry of Object.values(editedSchedules)) {
                if (entry.start_time && entry.end_time) {
                    await upsertSchedule({ ...entry, staff_id: staffId })
                }
            }
            router.refresh()
        })
    }

    const handleAddException = () => {
        if (!newException.date) return
        startTransition(async () => {
            await upsertScheduleException(newException)
            setNewException({ date: '', is_closed: true, notes: '' })
            router.refresh()
        })
    }

    const handleDeleteException = (id: string) => {
        startTransition(async () => {
            await deleteScheduleException(id)
            router.refresh()
        })
    }

    const inputCls = "text-sm border border-brand-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-accent-500 outline-none"

    return (
        <div className="space-y-8">
            {/* Weekly Schedule */}
            <div className="bg-white rounded-2xl border border-brand-200 overflow-hidden">
                <div className="border-b border-brand-100 p-5 flex items-center justify-between">
                    <h2 className="font-bold text-brand-900 flex items-center gap-2"><Clock className="w-5 h-5 text-brand-400" /> Εβδομαδιαίο Ωράριο</h2>
                    <button onClick={handleSaveSchedules} disabled={isPending} className="flex items-center gap-2 px-4 py-2 bg-brand-950 text-white text-sm font-bold rounded-xl hover:bg-brand-800 transition-colors disabled:opacity-60">
                        <Save className="w-4 h-4" /> Αποθήκευση
                    </button>
                </div>
                <div className="divide-y divide-brand-100">
                    {[1, 2, 3, 4, 5, 6, 0].map(day => {
                        const sch = editedSchedules[day]
                        const isActive = Boolean(sch?.start_time)
                        return (
                            <div key={day} className="px-5 py-4 flex flex-wrap items-center gap-4">
                                <div className="w-24 font-semibold text-brand-900 text-sm">{DAYS[day]}</div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <div
                                        onClick={() => {
                                            if (isActive) {
                                                handleScheduleChange(day, 'start_time', '')
                                                handleScheduleChange(day, 'end_time', '')
                                            } else {
                                                handleScheduleChange(day, 'start_time', '09:00')
                                                handleScheduleChange(day, 'end_time', '18:00')
                                            }
                                        }}
                                        className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${isActive ? 'bg-green-400' : 'bg-brand-200'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform shadow ${isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                    </div>
                                    <span className="text-sm text-brand-600">{isActive ? 'Ανοιχτό' : 'Κλειστό'}</span>
                                </label>
                                {isActive && (
                                    <>
                                        <input type="time" value={sch?.start_time || ''} onChange={e => handleScheduleChange(day, 'start_time', e.target.value)} className={inputCls} />
                                        <span className="text-brand-400 text-sm">έως</span>
                                        <input type="time" value={sch?.end_time || ''} onChange={e => handleScheduleChange(day, 'end_time', e.target.value)} className={inputCls} />
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Exceptions / Holidays */}
            <div className="bg-white rounded-2xl border border-brand-200 overflow-hidden">
                <div className="border-b border-brand-100 p-5">
                    <h2 className="font-bold text-brand-900 flex items-center gap-2"><Calendar className="w-5 h-5 text-brand-400" /> Εξαιρέσεις / Αργίες</h2>
                </div>

                {/* Add exception */}
                <div className="p-5 bg-brand-50 border-b border-brand-100 flex flex-wrap gap-3 items-end">
                    <div>
                        <label className="text-xs font-semibold text-brand-500 mb-1 block">Ημερομηνία</label>
                        <input type="date" value={newException.date} onChange={e => setNewException({ ...newException, date: e.target.value })} className={inputCls} />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-brand-500 mb-1 block">Τύπος</label>
                        <select value={newException.is_closed ? 'closed' : 'open'} onChange={e => setNewException({ ...newException, is_closed: e.target.value === 'closed' })} className={inputCls}>
                            <option value="closed">Κλειστό</option>
                            <option value="open">Ειδικό Ωράριο</option>
                        </select>
                    </div>
                    <div className="flex-1 min-w-40">
                        <label className="text-xs font-semibold text-brand-500 mb-1 block">Σημείωση</label>
                        <input type="text" value={newException.notes} onChange={e => setNewException({ ...newException, notes: e.target.value })} placeholder="π.χ. Πάσχα" className={`${inputCls} w-full`} />
                    </div>
                    <button onClick={handleAddException} disabled={isPending || !newException.date} className="flex items-center gap-2 px-4 py-2 bg-brand-950 text-white text-sm font-bold rounded-xl hover:bg-brand-800 disabled:opacity-50 transition-colors">
                        <Plus className="w-4 h-4" /> Προσθήκη
                    </button>
                </div>

                {/* List */}
                <div className="divide-y divide-brand-100">
                    {exceptions.length === 0 ? (
                        <p className="text-center text-brand-400 py-8 text-sm">Δεν υπάρχουν εξαιρέσεις</p>
                    ) : exceptions.map(ex => (
                        <div key={ex.id} className="px-5 py-3 flex items-center gap-4 group hover:bg-brand-50 transition-colors">
                            <div className="font-medium text-brand-900 w-28 text-sm">{ex.date}</div>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${ex.is_closed ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                                {ex.is_closed ? 'Κλειστό' : 'Ειδικό'}
                            </span>
                            {ex.notes && <span className="text-sm text-brand-500">{ex.notes}</span>}
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleDeleteException(ex.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
