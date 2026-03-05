'use client'

import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Phone, Mail, Clock, FileText, UserCircle, Stethoscope, Camera, Plus, Trash2, Dog, AlertCircle } from 'lucide-react'
import { updateCustomerNotes } from '@/app/actions/admin'
import { createPetRecord, updatePetProfile, uploadPetImage, deletePetImage } from '@/app/actions/crm'

export default function CustomerProfileDrawer({ customer, onClose }: { customer: any, onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<'info' | 'pet' | 'gallery'>('info')

    // Notes state
    const [notes, setNotes] = useState(customer.admin_notes || '')
    const [savingNotes, setSavingNotes] = useState(false)

    // Pet states
    const pet = customer.pets?.[0]
    const [petData, setPetData] = useState({
        name: pet?.name || '',
        breed: pet?.breed || '',
        weight_kg: pet?.weight_kg || '',
        birth_date: pet?.birth_date || '',
        medical_notes: pet?.medical_notes || '',
        behavioral_notes: pet?.behavioral_notes || ''
    })
    const [savingPet, setSavingPet] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)

    const handleSaveNotes = async () => {
        setSavingNotes(true)
        await updateCustomerNotes(customer.id, notes)
        setSavingNotes(false)
    }

    const handleSavePet = async () => {
        setSavingPet(true)
        if (pet?.id) {
            await updatePetProfile(pet.id, petData)
        } else {
            await createPetRecord(customer.id, petData)
        }
        setSavingPet(false)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after' | 'general') => {
        if (!e.target.files || e.target.files.length === 0 || !pet?.id) return
        setUploadingImage(true)

        const fd = new FormData()
        fd.append('petId', pet.id)
        fd.append('type', type)
        fd.append('file', e.target.files[0])

        await uploadPetImage(fd)
        setUploadingImage(false)
    }

    const handleDeleteImage = async (imageId: string) => {
        if (!confirm('Διαγραφή φωτογραφίας;')) return
        await deletePetImage(imageId)
    }

    const bookingCount = customer.bookings?.length ?? 0

    return (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

            <div
                className="relative w-full max-w-xl bg-white h-full overflow-hidden flex flex-col shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 pb-0 border-b border-brand-100 flex-shrink-0">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-accent-100 text-accent-700 rounded-full flex items-center justify-center font-bold text-xl">
                                {customer.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-brand-950">{customer.name}</h2>
                                <span className="text-sm text-brand-500">Πελάτης από {format(parseISO(customer.created_at), 'MMM yyyy')}</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-50 text-brand-400 hover:text-brand-700 hover:bg-brand-100 transition-colors">&times;</button>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-6 text-sm font-semibold">
                        <button
                            className={`pb-3 border-b-2 px-1 transition-colors ${activeTab === 'info' ? 'border-accent-500 text-brand-950' : 'border-transparent text-brand-400 hover:text-brand-700'}`}
                            onClick={() => setActiveTab('info')}
                        >
                            <span className="flex items-center gap-2"><UserCircle className="w-4 h-4" /> Προφίλ</span>
                        </button>
                        <button
                            className={`pb-3 border-b-2 px-1 transition-colors ${activeTab === 'pet' ? 'border-accent-500 text-brand-950' : 'border-transparent text-brand-400 hover:text-brand-700'}`}
                            onClick={() => setActiveTab('pet')}
                        >
                            <span className="flex items-center gap-2"><Dog className="w-4 h-4" /> Ιατρικό / Pet</span>
                        </button>
                        <button
                            className={`pb-3 border-b-2 px-1 transition-colors ${activeTab === 'gallery' ? 'border-accent-500 text-brand-950' : 'border-transparent text-brand-400 hover:text-brand-700'}`}
                            onClick={() => setActiveTab('gallery')}
                        >
                            <span className="flex items-center gap-2"><Camera className="w-4 h-4" /> Gallery</span>
                        </button>
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-6 bg-brand-50/30">

                    {/* INFO TAB */}
                    {activeTab === 'info' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-white rounded-2xl p-5 border border-brand-100 shadow-sm space-y-3 text-sm">
                                <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-brand-400" /><span className="font-medium">{customer.phone_e164 || customer.phone}</span></div>
                                {customer.email && <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-brand-400" /><span>{customer.email}</span></div>}
                            </div>

                            <div className="bg-white rounded-2xl border border-brand-100 shadow-sm overflow-hidden">
                                <div className="p-4 bg-brand-50/50 border-b border-brand-100 font-bold text-brand-900 flex justify-between items-center">
                                    <span>Ιστορικό Ραντεβού ({bookingCount})</span>
                                </div>
                                <div className="p-2 space-y-1">
                                    {customer.bookings?.sort((a: any, b: any) => b.start_at.localeCompare(a.start_at)).map((b: any) => (
                                        <div key={b.id} className="flex items-center justify-between hover:bg-brand-50 rounded-lg px-3 py-2 text-sm transition-colors cursor-default">
                                            <div>
                                                <div className="font-semibold text-brand-900">{b.services?.name}</div>
                                                <div className="text-brand-500 text-xs mt-0.5">{format(parseISO(b.start_at), 'dd/MM/yyyy HH:mm')}</div>
                                            </div>
                                            <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md border ${b.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                                                    b.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                        b.status === 'canceled' ? 'bg-red-100 text-red-800 border-red-200' :
                                                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                }`}>{b.status}</span>
                                        </div>
                                    ))}
                                    {bookingCount === 0 && <div className="text-brand-400 text-center py-4 text-sm">Κανένα ραντεβού ακόμα</div>}
                                </div>
                            </div>

                            <div>
                                <label className="font-bold text-brand-900 text-sm flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-brand-400" /> Σημειώσεις Διαχειριστή (Ορατές μόνο σε εσάς)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    rows={4}
                                    placeholder="Πχ. ο πελάτης καθυστερεί συχνά..."
                                    className="w-full text-sm border border-brand-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-accent-500 outline-none resize-none"
                                />
                                <button
                                    onClick={handleSaveNotes} disabled={savingNotes}
                                    className="mt-2 px-4 py-2 bg-brand-950 text-white rounded-xl text-sm font-bold hover:bg-brand-800 transition-colors disabled:opacity-60"
                                >
                                    {savingNotes ? 'Αποθήκευση...' : 'Αποθήκευση Σημειώσεων'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PET MEDICAL TAB */}
                    {activeTab === 'pet' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {!pet && (
                                <div className="bg-accent-50 text-accent-800 p-4 rounded-xl text-sm mb-4 border border-accent-100 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <p>Δεν υπάρχει καρτέλα κατοικιδίου για αυτόν τον πελάτη (μπορεί να προέρχεται από παλιά κράτηση). Συμπληρώστε τα παρακάτω για να δημιουργήσετε τη νέα καρτέλα.</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-brand-500 mb-1 ml-1">Όνομα Κατοικιδίου</label>
                                    <input value={petData.name} onChange={e => setPetData({ ...petData, name: e.target.value })} className="w-full px-3 py-2 text-sm border border-brand-200 rounded-xl outline-none focus:border-accent-500" placeholder="Π.χ. Max" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-500 mb-1 ml-1">Ράτσα</label>
                                    <input value={petData.breed} onChange={e => setPetData({ ...petData, breed: e.target.value })} className="w-full px-3 py-2 text-sm border border-brand-200 rounded-xl outline-none focus:border-accent-500" placeholder="Π.χ. Poodle" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-500 mb-1 ml-1">Γέννηση / Ηλικία</label>
                                    <input type="date" value={petData.birth_date} onChange={e => setPetData({ ...petData, birth_date: e.target.value })} className="w-full px-3 py-2 text-sm border border-brand-200 rounded-xl outline-none focus:border-accent-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-500 mb-1 ml-1">Βάρος</label>
                                    <input value={petData.weight_kg} onChange={e => setPetData({ ...petData, weight_kg: e.target.value })} className="w-full px-3 py-2 text-sm border border-brand-200 rounded-xl outline-none focus:border-accent-500" placeholder="Π.χ. 5kg ή Μικρό" />
                                </div>
                            </div>

                            <div>
                                <label className="font-bold text-brand-900 text-sm flex items-center gap-2 mb-2">
                                    <Stethoscope className="w-4 h-4 text-brand-400" /> Ιατρικό Προφίλ (Αλλεργίες, Παθήσεις)
                                </label>
                                <textarea value={petData.medical_notes} onChange={e => setPetData({ ...petData, medical_notes: e.target.value })} rows={3} placeholder="Πχ. Αλλεργία στο σιτάρι, ευαισθησία στο αριστερό αυτί..." className="w-full text-sm border border-brand-200 rounded-xl px-4 py-3 outline-none focus:border-accent-500 resize-none" />
                            </div>

                            <div>
                                <label className="font-bold text-brand-900 text-sm flex items-center gap-2 mb-2">
                                    <FileText className="w-4 h-4 text-brand-400" /> Σημειώσεις Συμπεριφοράς
                                </label>
                                <textarea value={petData.behavioral_notes} onChange={e => setPetData({ ...petData, behavioral_notes: e.target.value })} rows={3} placeholder="Πχ. Φοβάται το πιστολάκι, δαγκώνει τα νύχια του..." className="w-full text-sm border border-brand-200 rounded-xl px-4 py-3 outline-none focus:border-accent-500 resize-none" />
                            </div>

                            <button onClick={handleSavePet} disabled={savingPet} className="w-full py-3 bg-brand-950 text-white rounded-xl text-sm font-bold hover:bg-brand-800 transition-colors disabled:opacity-60 flex justify-center items-center gap-2">
                                {savingPet ? 'Αποθήκευση...' : (pet ? 'Ενημέρωση Κατοικιδίου' : 'Δημιουργία Καρτέλας Κατοικιδίου')}
                            </button>
                        </div>
                    )}

                    {/* GALLERY TAB */}
                    {activeTab === 'gallery' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {!pet ? (
                                <div className="text-center py-10">
                                    <Dog className="w-12 h-12 text-brand-200 mx-auto mb-3" />
                                    <p className="text-brand-500 text-sm">Πρέπει πρώτα να αποθηκεύσετε την καρτέλα του κατοικιδίου (Ιατρικό / Pet) πριν ανεβάσετε φωτογραφίες.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="border border-dashed border-brand-300 rounded-2xl bg-white p-6 flex flex-col items-center justify-center text-center hover:bg-brand-50/50 transition-colors relative h-32">
                                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'before')} disabled={uploadingImage} />
                                            {uploadingImage ? <span className="text-xs font-bold text-brand-500">Φόρτωση...</span> : (
                                                <>
                                                    <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-500 mb-2"><Plus className="w-5 h-5" /></div>
                                                    <span className="text-xs font-bold text-brand-700">Add BEFORE</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="border border-dashed border-accent-300 rounded-2xl bg-accent-50/50 p-6 flex flex-col items-center justify-center text-center hover:bg-accent-50 transition-colors relative h-32">
                                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'after')} disabled={uploadingImage} />
                                            {uploadingImage ? <span className="text-xs font-bold text-accent-600">Φόρτωση...</span> : (
                                                <>
                                                    <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center text-accent-600 mb-2"><Plus className="w-5 h-5" /></div>
                                                    <span className="text-xs font-bold text-accent-800">Add AFTER</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-brand-900 border-b border-brand-200 pb-2 mb-4">Ιστορικό (Before & After)</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {pet.pet_gallery?.length === 0 && <div className="col-span-2 text-brand-400 text-sm py-4 text-center">Δεν υπάρχουν φωτογραφίες.</div>}

                                            {pet.pet_gallery?.sort((a: any, b: any) => b.created_at.localeCompare(a.created_at)).map((img: any) => (
                                                <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-brand-100 border border-brand-200">
                                                    <img src={img.image_url} alt="Pet photo" className="w-full h-full object-cover" />
                                                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded shadow text-[10px] font-bold uppercase backdrop-blur-md bg-white/80 text-brand-900">
                                                        {img.type}
                                                    </div>
                                                    <button onClick={() => handleDeleteImage(img.id)} className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-6 text-white text-xs">
                                                        {format(parseISO(img.created_at), 'dd MMM yyyy')}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
