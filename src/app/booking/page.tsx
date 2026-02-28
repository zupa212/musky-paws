"use client";

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, PawPrint, CheckCircle2, ChevronDown, MapPin, Mail, Loader2, ArrowRight } from 'lucide-react';
import { submitBooking, getServices } from '@/app/actions/booking';
import { generateICS } from '@/lib/utils/calendar';

// Analytics helper
const trackEvent = (name: string, params?: object) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', name, params);
    }
};

// Replaced hardcoded SERVICES with dynamic fetching from DB
interface Service {
    id: string;
    name: string;
    slug: string;
    duration_min: number;
}

export default function BookingPageWrapper() {
    const [step, setStep] = useState(1);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");
    const [services, setServices] = useState<Service[]>([]);
    const [loadingServices, setLoadingServices] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        petType: 'dog',
        breed: '',
        weightKg: '',
        serviceId: '',
        date: '',
        time: '',
        ownerName: '',
        phone: '',
        email: '',
        notes: ''
    });

    // Track Start & Load Services
    useEffect(() => {
        trackEvent('booking_start');
        getServices().then(res => {
            if (res.success && res.services) {
                setServices(res.services);
            } else {
                console.error("Failed to load services", res.error);
                setErrorMessage("Αποτυχία φόρτωσης υπηρεσιών. Παρακαλώ ανανεώστε τη σελίδα.");
            }
            setLoadingServices(false);
        });
    }, []);

    // Available Slots state
    const [slots, setSlots] = useState<{ time: string, available: boolean }[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Fetch slots when date or service changes
    useEffect(() => {
        if (formData.date && formData.serviceId && step === 2) {
            setLoadingSlots(true);
            fetch(`/api/slots?date=${formData.date}&service=${formData.serviceId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.slots) setSlots(data.slots);
                    else setSlots([]);
                })
                .catch(err => {
                    console.error("Failed to fetch slots", err);
                    setSlots([]);
                })
                .finally(() => setLoadingSlots(false));
        }
    }, [formData.date, formData.serviceId, step]);

    const updateForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => {
        if (step === 1 && !formData.serviceId) {
            alert("Παρακαλώ επιλέξτε υπηρεσία");
            return;
        }
        if (step === 2 && !formData.time) {
            alert("Παρακαλώ επιλέξτε ώρα");
            return;
        }

        const nextS = Math.min(step + 1, 3);
        if (nextS === 2) trackEvent('service_selected', { service: formData.serviceId });
        if (nextS === 3) trackEvent('slot_selected', { date: formData.date, time: formData.time });

        setStep(nextS);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const prevStep = () => {
        setStep(s => Math.max(s - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage("");

        // Create FormData object for Server Action
        const fd = new FormData();
        Object.entries(formData).forEach(([key, value]) => fd.append(key, value));

        try {
            trackEvent('booking_submit_attempt');
            const res = await submitBooking(fd);
            if (res.success) {
                trackEvent('booking_success', { service: formData.serviceId });
                setStatus('success');
            } else {
                setStatus('error');
                setErrorMessage(res.error || "Παρουσιάστηκε σφάλμα");
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage("Παρουσιάστηκε άγνωστο σφάλμα");
        }
    };

    if (status === 'success') {
        return (
            <section className="min-h-[80vh] bg-brand-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-lg w-full p-8 md:p-12 text-center rounded-3xl shadow-xl border border-brand-200">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-extrabold mb-4 text-brand-950">Το Ραντεβού σας Καταχωρήθηκε!</h2>
                    <p className="text-brand-600 mb-8 text-lg font-medium leading-relaxed">
                        Έχουμε λάβει το αίτημά σας. Ένα επιβεβαιωτικό email & SMS στάλθηκε στα στοιχεία επικοινωνίας σας.
                    </p>

                    <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-8 text-left space-y-2">
                        <p className="flex justify-between text-sm"><span className="text-brand-500">Όνομα:</span> <strong className="text-brand-900">{formData.ownerName}</strong></p>
                        <p className="flex justify-between text-sm"><span className="text-brand-500">Ημ/νία:</span> <strong className="text-brand-900">{formData.date}</strong></p>
                        <p className="flex justify-between text-sm"><span className="text-brand-500">Ώρα:</span> <strong className="text-brand-900">{formData.time}</strong></p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                const srv = services.find(s => s.id === formData.serviceId);
                                generateICS(formData.date, formData.time, srv?.name || "Grooming", srv?.duration_min || 60);
                            }}
                            className="inline-flex justify-center items-center gap-2 rounded-full border-2 border-brand-900 text-brand-900 bg-transparent px-8 py-3.5 font-bold hover:bg-brand-50 transition-colors w-full"
                        >
                            <Calendar className="w-5 h-5" /> Προσθήκη στο Ημερολόγιο
                        </button>
                        <button
                            onClick={() => {
                                setStatus('idle');
                                setStep(1);
                                setFormData({ ...formData, date: '', time: '', serviceId: '' });
                            }}
                            className="inline-flex justify-center rounded-full bg-foreground text-background px-8 py-3.5 font-bold shadow-sm hover:bg-brand-800 transition-colors w-full"
                        >
                            Νέο Ραντεβού
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // MIN DATES for calendar
    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <section className="bg-brand-950 text-brand-50 py-12 md:py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Κλείσε Ραντεβού</h1>
                    {/* Stepper Dots */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-accent-500' : 'bg-brand-700'}`}></div>
                        <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-accent-500' : 'bg-brand-700'}`}></div>
                        <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-accent-500' : 'bg-brand-700'}`}></div>
                        <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-accent-500' : 'bg-brand-700'}`}></div>
                        <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-accent-500' : 'bg-brand-700'}`}></div>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-background text-foreground min-h-[60vh]">
                <div className="container mx-auto px-4 max-w-3xl">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-brand-900/40 p-6 md:p-10 rounded-3xl shadow-xl border border-brand-200 dark:border-brand-800 flex flex-col gap-8">

                        {/* STEP 1: PET & SERVICE */}
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><PawPrint className="text-accent-500" /> Στοιχεία & Υπηρεσία</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="petType" className="block text-sm font-semibold mb-2">Κατοικίδιο</label>
                                            <div className="relative">
                                                <select id="petType" name="petType" value={formData.petType} onChange={updateForm} required className="w-full appearance-none rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-brand-950 px-4 py-3 focus:ring-2 focus:ring-accent-500 outline-none">
                                                    <option value="dog">Σκύλος</option>
                                                    <option value="cat">Γάτα</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-brand-500 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="weightKg" className="block text-sm font-semibold mb-2">Μέγεθος / Κιλά</label>
                                            <div className="relative">
                                                <select id="weightKg" name="weightKg" value={formData.weightKg} onChange={updateForm} required className="w-full appearance-none rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-brand-950 px-4 py-3 focus:ring-2 focus:ring-accent-500 outline-none">
                                                    <option value="">Επιλέξτε...</option>
                                                    <option value="small">Μικρό (έως 10 κιλά)</option>
                                                    <option value="medium">Μεσαίο (11 - 25 κιλά)</option>
                                                    <option value="large">Μεγάλο (άνω των 25 κιλά)</option>
                                                </select>
                                                <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-brand-500 pointer-events-none" />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label htmlFor="breed" className="block text-sm font-semibold mb-2">Ράτσα (Προαιρετικό)</label>
                                            <input type="text" id="breed" name="breed" value={formData.breed} onChange={updateForm} placeholder="π.χ. Poodle, Ημίαιμο" className="w-full rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-brand-950 px-4 py-3 focus:ring-2 focus:ring-accent-500 outline-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-brand-100 dark:border-brand-800">
                                    <label className="block text-sm font-semibold mb-4">Επιλέξτε Υπηρεσία <span className="text-red-500">*</span></label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {services.map(srv => (
                                            <label
                                                key={srv.id}
                                                className={`relative flex cursor-pointer rounded-xl border p-4 shadow-sm focus:outline-none transition-all ${formData.serviceId === srv.id ? 'border-accent-500 ring-1 ring-accent-500 bg-accent-50/50 dark:bg-accent-950/30' : 'border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 hover:bg-brand-50 dark:hover:bg-brand-900/50'
                                                    }`}
                                            >
                                                <input type="radio" name="serviceId" value={srv.id} checked={formData.serviceId === srv.id} onChange={updateForm} className="sr-only" aria-labelledby={`service-label-${srv.id}`} />
                                                <span className="flex flex-1">
                                                    <span className="flex flex-col">
                                                        <span id={`service-label-${srv.id}`} className="block text-sm font-bold text-brand-900 dark:text-brand-100">{srv.name}</span>
                                                        <span className="mt-1 flex items-center text-xs text-brand-500 dark:text-brand-400 gap-1"><Clock className="w-3 h-3" /> ~{srv.duration_min} λεπτά</span>
                                                    </span>
                                                </span>
                                                <CheckCircle2 className={`h-5 w-5 ${formData.serviceId === srv.id ? 'text-accent-600' : 'text-transparent'}`} aria-hidden="true" />
                                            </label>
                                        ))}
                                        {loadingServices && (
                                            <div className="col-span-1 sm:col-span-2 flex justify-center py-4">
                                                <Loader2 className="w-6 h-6 animate-spin text-accent-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: DATE & TIME */}
                        {step === 2 && (
                            <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Calendar className="text-accent-500" /> Ημερομηνία & Ώρα</h2>

                                <div>
                                    <label htmlFor="date" className="block text-sm font-semibold mb-2">Ημερομηνία Ραντεβού</label>
                                    <input type="date" id="date" name="date" min={today} value={formData.date} onChange={updateForm} required className="w-full rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-brand-950 px-4 py-3 focus:ring-2 focus:ring-accent-500 outline-none" />
                                </div>

                                <div className="pt-6 border-t border-brand-100 dark:border-brand-800 min-h-[200px]">
                                    <label className="block text-sm font-semibold mb-4">Διαθέσιμες Ώρες</label>

                                    {!formData.date ? (
                                        <div className="text-center p-8 border-2 border-dashed border-brand-200 dark:border-brand-800 rounded-xl text-brand-500">
                                            Επιλέξτε ημερομηνία για να δείτε διαθεσιμότητα
                                        </div>
                                    ) : loadingSlots ? (
                                        <div className="flex items-center justify-center p-8">
                                            <Loader2 className="w-8 h-8 text-accent-500 animate-spin" />
                                        </div>
                                    ) : slots.length === 0 ? (
                                        <div className="text-center p-8 border-2 border-dashed border-brand-200 dark:border-brand-800 rounded-xl text-brand-500 font-medium bg-brand-50 dark:bg-brand-950">
                                            Δεν υπάρχουν διαθέσιμα ραντεβού για αυτήν την ημερομηνία.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                            {slots.map((slot) => (
                                                <label
                                                    key={slot.time}
                                                    className={`
                            relative flex cursor-pointer rounded-lg border py-3 px-1 text-center font-bold text-sm shadow-sm transition-all
                            ${!slot.available ? 'opacity-50 cursor-not-allowed bg-brand-100 border-brand-200 text-brand-400 dark:bg-brand-900/50' :
                                                            formData.time === slot.time ? 'border-accent-500 bg-accent-50 text-accent-700 dark:bg-accent-950 dark:text-accent-300' : 'border-brand-200 bg-white hover:border-accent-300 dark:bg-brand-950 dark:border-brand-700 dark:hover:border-brand-500'
                                                        }
                          `}
                                                >
                                                    <input type="radio" name="time" value={slot.time} checked={formData.time === slot.time} onChange={updateForm} disabled={!slot.available} className="sr-only" />
                                                    <span className="w-full">{slot.time}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* STEP 3: OWNER DETAILS */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><User className="text-accent-500" /> Στοιχεία Επικοινωνίας</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label htmlFor="ownerName" className="block text-sm font-semibold mb-2">Ονοματεπώνυμο <span className="text-red-500">*</span></label>
                                        <input type="text" id="ownerName" name="ownerName" value={formData.ownerName} onChange={updateForm} required placeholder="π.χ. Κώστας Παπαδόπουλος" className="w-full rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-brand-950 px-4 py-3 focus:ring-2 focus:ring-accent-500 outline-none" />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold mb-2">Κινητό Τηλέφωνο <span className="text-red-500">*</span></label>
                                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={updateForm} required placeholder="69" className="w-full rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-brand-950 px-4 py-3 focus:ring-2 focus:ring-accent-500 outline-none" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold mb-2">Email</label>
                                        <input type="email" id="email" name="email" value={formData.email} onChange={updateForm} placeholder="προαιρετικό" className="w-full rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-brand-950 px-4 py-3 focus:ring-2 focus:ring-accent-500 outline-none" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label htmlFor="notes" className="block text-sm font-semibold mb-2">Παρατηρήσεις / Αλλεργίες Κατοικίδιου</label>
                                        <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={updateForm} placeholder="Κάτι που πρέπει να γνωρίζουμε..." className="w-full rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-brand-950 px-4 py-3 focus:ring-2 focus:ring-accent-500 outline-none resize-none"></textarea>
                                    </div>
                                </div>

                                {status === 'error' && (
                                    <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 mt-4 font-medium flex items-center gap-3">
                                        {errorMessage}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ACTION BUTTONS */}
                        <div className="flex gap-4 pt-6 border-t border-brand-100 dark:border-brand-800 mt-auto">
                            {step > 1 && (
                                <button type="button" onClick={prevStep} disabled={status === 'submitting'} className="px-6 py-3.5 rounded-full font-bold border-2 border-brand-200 text-brand-700 hover:bg-brand-50 focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors disabled:opacity-50">
                                    Πίσω
                                </button>
                            )}

                            {step < 3 ? (
                                <button type="button" onClick={nextStep} className="flex-1 flex justify-center items-center gap-2 py-3.5 px-8 border border-transparent rounded-full shadow-sm font-bold text-brand-950 bg-accent-500 hover:bg-accent-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-colors">
                                    Επόμενο <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button type="submit" disabled={status === 'submitting'} className="flex-1 flex justify-center items-center gap-2 py-3.5 px-8 border border-transparent rounded-full shadow-sm font-bold text-background bg-foreground hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-colors disabled:opacity-70">
                                    {status === 'submitting' ? <><Loader2 className="w-5 h-5 animate-spin" /> Υποβολή...</> : 'Επιβεβαίωση Κράτησης'}
                                </button>
                            )}
                        </div>

                    </form>

                    {/* QUICK ACTIONS */}
                    <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">
                        <a href="tel:+306948965371" className="flex items-center justify-center gap-3 py-3 px-6 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/50 border border-brand-200 dark:border-brand-800 rounded-full font-bold transition-colors">
                            <Phone className="w-4 h-4 text-accent-500" />
                            Κάλεσε Τώρα
                        </a>
                        <a href="https://maps.google.com/?q=Solonos+28B,+Peraia,+Greece+57019" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 py-3 px-6 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/50 border border-brand-200 dark:border-brand-800 rounded-full font-bold transition-colors">
                            <MapPin className="w-4 h-4 text-accent-500" />
                            Οδηγίες Καταστήματος
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
