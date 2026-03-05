"use client";

import { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, User, Phone, PawPrint, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, MapPin, Mail, Loader2, ArrowRight, Sparkles, PartyPopper } from 'lucide-react';
import { submitBooking, getServices, validateCoupon } from '@/app/actions/booking';
import { generateICS } from '@/lib/utils/calendar';

/* ─── Analytics helper ─── */
const trackEvent = (name: string, params?: object) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', name, params);
    }
};

/* ─── Types ─── */
interface Service {
    id: string;
    name: string;
    slug: string;
    duration_min: number;
    price_from?: number;
}

/* ─── Service icon map ─── */
const SERVICE_ICONS: Record<string, string> = {
    'full-grooming': '✂️',
    'bath-brush': '🛁',
    'deshedding': '🧹',
    'puppy': '🐶',
    'nails-ears': '💅',
};

/* ─── Stepper Config ─── */
const STEPS = [
    { num: 1, label: 'Υπηρεσία', icon: '🐾' },
    { num: 2, label: 'Ημ/νία & Ώρα', icon: '📅' },
    { num: 3, label: 'Στοιχεία', icon: '👤' },
];

/* ─── Week Calendar Helpers ─── */
function getWeekDays(startDate: Date): Date[] {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        days.push(d);
    }
    return days;
}

const GREEK_DAYS = ['Κυρ', 'Δευ', 'Τρί', 'Τετ', 'Πέμ', 'Παρ', 'Σάβ'];
const GREEK_MONTHS = ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μάι', 'Ιούν', 'Ιούλ', 'Αύγ', 'Σεπ', 'Οκτ', 'Νοέ', 'Δεκ'];

function formatDateStr(d: Date): string {
    return d.toISOString().split('T')[0];
}

function isToday(d: Date): boolean {
    const today = new Date();
    return d.toDateString() === today.toDateString();
}

/* ─── Google Calendar URL builder ─── */
function buildGoogleCalendarUrl(date: string, time: string, serviceName: string, durationMin: number): string {
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    const start = new Date(year, month - 1, day, hour, minute);
    const end = new Date(start.getTime() + durationMin * 60000);
    const fmt = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: `Ραντεβού Musky Paws - ${serviceName}`,
        dates: `${fmt(start)}/${fmt(end)}`,
        location: 'Σόλωνος 28Β, Περαία 570 19',
        details: 'Το ραντεβού σας για καλλωπισμό σκύλου στο Musky Paws.\nhttps://muskypaws.gr',
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/* ═══════════════════════════════════════════════════ */
export default function BookingPage() {
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
        notes: '',
        couponCode: '',
        acceptTerms: false
    });

    const [couponInfo, setCouponInfo] = useState<{ discount: number, code: string } | null>(null);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [couponError, setCouponError] = useState("");

    // Week calendar state
    const [weekStart, setWeekStart] = useState(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    });

    // Track Start & Load Services
    useEffect(() => {
        trackEvent('booking_start');
        getServices().then(res => {
            if (res.success && res.services) {
                setServices(res.services);
            } else {
                console.error("Failed to load services", res.error);
                setErrorMessage("Αποτυχία φόρτωσης υπηρεσιών.");
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
            setFormData(prev => ({ ...prev, time: '' }));
            fetch(`/api/slots?date=${formData.date}&service=${formData.serviceId}`)
                .then(res => res.json())
                .then(data => setSlots(data.slots || []))
                .catch(() => setSlots([]))
                .finally(() => setLoadingSlots(false));
        }
    }, [formData.date, formData.serviceId, step]);

    const updateField = (name: string, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const updateForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        updateField(e.target.name, e.target.value);
    };

    const selectedService = useMemo(() => services.find(s => s.id === formData.serviceId), [services, formData.serviceId]);

    const nextStep = () => {
        if (step === 1 && !formData.serviceId) {
            setErrorMessage("Παρακαλώ επιλέξτε υπηρεσία");
            return;
        }
        if (step === 1 && !formData.weightKg) {
            setErrorMessage("Παρακαλώ επιλέξτε μέγεθος");
            return;
        }
        if (step === 2 && !formData.time) {
            setErrorMessage("Παρακαλώ επιλέξτε ώρα");
            return;
        }
        setErrorMessage("");
        const nextS = Math.min(step + 1, 3);
        if (nextS === 2) trackEvent('service_selected', { service: formData.serviceId });
        if (nextS === 3) trackEvent('slot_selected', { date: formData.date, time: formData.time });
        setStep(nextS);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const prevStep = () => {
        setErrorMessage("");
        setStep(s => Math.max(s - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleValidateCoupon = async () => {
        if (!formData.couponCode) return;
        setIsValidatingCoupon(true);
        setCouponError("");
        try {
            const res = await validateCoupon(formData.couponCode, selectedService?.price_from || 0);
            if (res.success && res.discount !== undefined) {
                setCouponInfo({ discount: res.discount, code: formData.couponCode.toUpperCase() });
                trackEvent('coupon_applied', { code: formData.couponCode.toUpperCase(), discount: res.discount });
            } else {
                setCouponError(res.error || "Μη έγκυρο κουπόνι");
                setCouponInfo(null);
            }
        } catch {
            setCouponError("Σφάλμα κατά την επαλήθευση");
        } finally {
            setIsValidatingCoupon(false);
        }
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.ownerName || !formData.phone) {
            setErrorMessage("Παρακαλώ συμπληρώστε τα υποχρεωτικά πεδία.");
            return;
        }
        if (!formData.acceptTerms) {
            setErrorMessage("Πρέπει να αποδεχτείτε τους όρους χρήσης για να συνεχίσετε.");
            return;
        }
        setStatus('submitting');
        setErrorMessage("");
        const fd = new FormData();
        Object.entries(formData).forEach(([key, value]) => fd.append(key, typeof value === 'boolean' ? value.toString() : value as string));

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
        } catch {
            setStatus('error');
            setErrorMessage("Παρουσιάστηκε άγνωστο σφάλμα");
        }
    };

    // Week navigation
    const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Make sure 'today' represents midnight to compare correctly with 'day'

    today.setHours(0, 0, 0, 0);

    const canGoPrev = weekStart > today;
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30);

    const goNextWeek = () => {
        const next = new Date(weekStart);
        next.setDate(next.getDate() + 7);
        if (next <= maxDate) setWeekStart(next);
    };
    const goPrevWeek = () => {
        const prev = new Date(weekStart);
        prev.setDate(prev.getDate() - 7);
        if (prev >= today) setWeekStart(prev);
        else setWeekStart(new Date(today));
    };

    // Group slots by morning/afternoon
    const morningSlots = slots.filter(s => {
        const h = parseInt(s.time.split(':')[0]);
        return h < 13;
    });
    const afternoonSlots = slots.filter(s => {
        const h = parseInt(s.time.split(':')[0]);
        return h >= 13;
    });

    /* ═══════════════ SUCCESS SCREEN ═══════════════ */
    if (status === 'success') {
        const googleCalUrl = selectedService
            ? buildGoogleCalendarUrl(formData.date, formData.time, selectedService.name, selectedService.duration_min)
            : '#';

        return (
            <section className="min-h-[80vh] bg-brand-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-lg w-full p-8 md:p-12 text-center rounded-3xl shadow-xl border border-brand-200 relative overflow-hidden">
                    {/* Celebration decorations */}
                    <div className="absolute -top-4 -left-4 text-5xl opacity-30 rotate-[-20deg]">🎉</div>
                    <div className="absolute -top-4 -right-4 text-5xl opacity-30 rotate-[20deg]">🐾</div>
                    <div className="absolute -bottom-4 -left-4 text-4xl opacity-20">✨</div>

                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-extrabold mb-2 text-navy-900">Επιτυχής Κράτηση! 🎉</h2>
                    <p className="text-brand-600 mb-6 text-lg font-medium leading-relaxed">
                        Η κράτησή σας καταχωρήθηκε με επιτυχία! Το αίτημα έχει σταλεί και θα ενημερωθείτε σύντομα.
                    </p>
                    <div className="bg-brand-50 text-navy-900 text-sm font-medium p-4 rounded-xl mb-8 border border-brand-200">
                        Για οποιαδήποτε πληροφορία ή αλλαγή, καλέστε μας στο <a href="tel:+306948965371" className="text-accent-500 font-bold hover:underline">694 896 5371</a>.
                    </div>

                    {/* Booking Summary */}
                    <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5 mb-8 text-left space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-brand-500">Υπηρεσία</span>
                            <strong className="text-navy-900">{selectedService?.name}</strong>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-brand-500">Ημ/νία</span>
                            <strong className="text-navy-900">{formData.date}</strong>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-brand-500">Ώρα</span>
                            <strong className="text-navy-900">{formData.time}</strong>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-brand-500">Όνομα</span>
                            <strong className="text-navy-900">{formData.ownerName}</strong>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <a
                            href={googleCalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex justify-center items-center gap-2 rounded-full bg-navy-900 text-white px-8 py-3.5 font-bold hover:bg-navy-800 transition-all w-full shadow-md hover:scale-[1.02]"
                        >
                            <Calendar className="w-5 h-5" /> Προσθήκη στο Google Calendar
                        </a>
                        <button
                            onClick={() => {
                                generateICS(formData.date, formData.time, selectedService?.name || "Grooming", selectedService?.duration_min || 60);
                            }}
                            className="inline-flex justify-center items-center gap-2 rounded-full border-2 border-brand-300 text-navy-900 bg-transparent px-8 py-3.5 font-bold hover:bg-brand-50 transition-colors w-full"
                        >
                            📥 Λήψη .ICS αρχείου
                        </button>
                        <button
                            onClick={() => {
                                setStatus('idle');
                                setStep(1);
                                setFormData({ ...formData, date: '', time: '', serviceId: '' });
                            }}
                            className="text-sm text-brand-500 hover:text-navy-900 transition-colors font-medium mt-2"
                        >
                            ← Νέο Ραντεβού
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    /* ═══════════════ MAIN FORM ═══════════════ */
    return (
        <>
            {/* ─── Header + Stepper ─── */}
            <section className="bg-ui-navy text-white py-12 md:py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-3">Κλείσε Ραντεβού</h1>
                    <p className="text-white/60 text-sm md:text-base mb-10">Online κράτηση σε 3 απλά βήματα</p>

                    {/* Visual Stepper */}
                    <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-lg mx-auto">
                        {STEPS.map((s, i) => (
                            <div key={s.num} className="flex items-center gap-2 sm:gap-4">
                                <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${step >= s.num ? 'opacity-100' : 'opacity-50'}`}>
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl transition-all duration-300 ${step === s.num ? 'bg-ui-coral text-ui-navy scale-110 shadow-[0_0_20px_rgba(222,115,99,0.4)]' : step > s.num ? 'bg-white/20 text-white' : 'bg-ui-navy border-2 border-white/20 text-white/50'}`}>
                                        {step > s.num ? <CheckCircle2 className="w-6 h-6" /> : s.icon}
                                    </div>
                                    <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider hidden sm:block ${step === s.num ? 'text-white' : 'text-white/50'}`}>{s.label}</span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`w-10 sm:w-20 h-1 rounded-full transition-colors duration-300 ${step > s.num ? 'bg-ui-coral' : 'bg-white/10'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-10 md:py-16 -mt-6 bg-[#fef9f3] min-h-[60vh]">
                <div className="container mx-auto px-4 max-w-3xl">
                    <form onSubmit={handleSubmit} className="bg-ui-taupe p-6 sm:p-8 md:p-12 rounded-[32px] md:rounded-[40px] shadow-[0_20px_50px_-12px_rgba(41,36,70,0.3)] border border-white/40 flex flex-col gap-6">

                        {/* ═══ STEP 1: PET & SERVICE ═══ */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-black text-ui-navy flex items-center gap-2">
                                    <PawPrint className="w-6 h-6 text-ui-coral" /> Επιλέξτε Υπηρεσία
                                </h2>

                                {/* Pet & Weight Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[13px] font-bold text-ui-navy/80 mb-2">Κατοικίδιο</label>
                                        <div className="flex gap-2">
                                            {[{ v: 'dog', l: '🐕 Σκύλος' }, { v: 'cat', l: '🐱 Γάτα' }].map(opt => (
                                                <button
                                                    key={opt.v}
                                                    type="button"
                                                    onClick={() => updateField('petType', opt.v)}
                                                    className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${formData.petType === opt.v ? 'border-ui-navy bg-ui-navy text-white shadow-md' : 'border-white/30 bg-white/20 text-ui-navy hover:bg-white/30'}`}
                                                >
                                                    {opt.l}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-ui-navy/80 mb-2">Μέγεθος</label>
                                        <div className="relative">
                                            <select name="weightKg" value={formData.weightKg} onChange={updateForm} className="w-full appearance-none rounded-xl border-2 border-white/30 bg-white/20 px-4 py-3 text-sm font-semibold text-ui-navy focus:border-ui-navy focus:bg-white/40 outline-none transition-colors">
                                                <option value="">Επιλέξτε...</option>
                                                <option value="small">Μικρό (≤10 kg)</option>
                                                <option value="medium">Μεσαίο (11-25 kg)</option>
                                                <option value="large">Μεγάλο (25+ kg)</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-[14px] w-5 h-5 text-ui-navy pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Breed (optional, compact) */}
                                <input
                                    type="text"
                                    name="breed"
                                    value={formData.breed}
                                    onChange={updateForm}
                                    placeholder="Ράτσα (προαιρετικό)"
                                    className="w-full rounded-xl border-2 border-white/30 bg-white/20 px-4 py-3 text-sm font-semibold text-ui-navy placeholder-ui-navy/50 focus:border-ui-navy focus:bg-white/40 outline-none transition-colors"
                                />

                                {/* Service Cards */}
                                <div className="pt-2 border-t border-ui-navy/10">
                                    <label className="block text-[13px] font-bold text-ui-navy/80 mb-3">
                                        Υπηρεσία <span className="text-ui-coral">*</span>
                                    </label>

                                    {loadingServices ? (
                                        <div className="flex justify-center py-8">
                                            <Loader2 className="w-8 h-8 animate-spin text-ui-coral" />
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {services.map(srv => {
                                                const icon = SERVICE_ICONS[srv.slug] || '✨';
                                                const isSelected = formData.serviceId === srv.id;
                                                return (
                                                    <label
                                                        key={srv.id}
                                                        className={`flex items-center gap-4 cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 ${isSelected
                                                            ? 'border-ui-navy bg-ui-navy text-white shadow-lg scale-[1.02]'
                                                            : 'border-white/30 bg-white/20 hover:border-ui-navy/40 hover:bg-white/30 text-ui-navy'
                                                            }`}
                                                    >
                                                        <input type="radio" name="serviceId" value={srv.id} checked={isSelected} onChange={updateForm} className="sr-only" />
                                                        <span className="text-3xl w-14 h-14 flex items-center justify-center rounded-xl bg-white/10">{icon}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-base">{srv.name}</p>
                                                            <p className={`text-xs flex items-center gap-1 mt-1 font-medium ${isSelected ? 'text-white/80' : 'text-ui-navy/70'}`}>
                                                                <Clock className="w-3.5 h-3.5" /> ~{srv.duration_min} λεπτά
                                                                {srv.price_from && <span className="ml-2">• από {srv.price_from}€</span>}
                                                            </p>
                                                        </div>
                                                        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-ui-coral bg-ui-coral' : 'border-ui-navy/30'}`}>
                                                            {isSelected && <CheckCircle2 className="w-4 h-4 text-ui-navy stroke-[3]" />}
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ═══ STEP 2: DATE & TIME ═══ */}
                        {step === 2 && (
                            <div className="space-y-8">
                                <h2 className="text-xl font-black text-ui-navy flex items-center gap-2">
                                    <Calendar className="w-6 h-6 text-ui-coral" /> Ημερομηνία & Ώρα
                                </h2>

                                {/* Visual Week Calendar */}
                                <div className="bg-ui-navy rounded-2xl p-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]">
                                    <div className="flex items-center justify-between mb-4">
                                        <button type="button" onClick={goPrevWeek} disabled={!canGoPrev} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-colors">
                                            <ChevronLeft className="w-5 h-5 text-white" />
                                        </button>
                                        <span className="text-sm font-bold text-white uppercase tracking-wider">
                                            {GREEK_MONTHS[weekDays[0].getMonth()]} {weekDays[0].getFullYear()}
                                        </span>
                                        <button type="button" onClick={goNextWeek} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                                            <ChevronRight className="w-5 h-5 text-white" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-7 gap-1.5">
                                        {weekDays.map(day => {
                                            const dateStr = formatDateStr(day);
                                            const isPast = day < today;
                                            const isSunday = day.getDay() === 0;
                                            const isSelected = formData.date === dateStr;
                                            const isTodayDate = isToday(day);
                                            const disabled = isPast || isSunday;

                                            return (
                                                <button
                                                    key={dateStr}
                                                    type="button"
                                                    disabled={disabled}
                                                    onClick={() => updateField('date', dateStr)}
                                                    className={`relative flex flex-col items-center py-3 px-1 rounded-xl text-center transition-all duration-200 ${isSelected
                                                        ? 'bg-ui-coral text-ui-navy shadow-md shadow-ui-coral/50 scale-105'
                                                        : disabled
                                                            ? 'opacity-30 cursor-not-allowed border-2 border-transparent'
                                                            : isTodayDate
                                                                ? 'hover:bg-white/20 cursor-pointer border-2 border-ui-coral bg-white/5'
                                                                : 'hover:bg-white/20 cursor-pointer border-2 border-transparent text-white'
                                                        }`}
                                                >
                                                    <span className={`text-[10px] font-bold uppercase mb-1 ${isSelected ? 'text-ui-navy' : isTodayDate && !disabled ? 'text-ui-coral' : 'text-white/60'}`}>
                                                        {GREEK_DAYS[day.getDay()]}
                                                    </span>
                                                    <span className={`text-xl font-black ${isSelected ? 'text-ui-navy' : 'text-white'}`}>
                                                        {day.getDate()}
                                                    </span>
                                                    {!disabled && !isSelected && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="h-px bg-white/30" />

                                {/* Time Slots */}
                                <div className="min-h-[180px]">
                                    <h3 className="text-[13px] font-bold text-ui-navy/80 mb-3">Διαθέσιμες Ώρες</h3>
                                    {!formData.date ? (
                                        <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-ui-navy/30 rounded-2xl text-ui-coral bg-ui-navy/5">
                                            <p className="font-semibold text-sm">Επιλέξτε ημερομηνία για να δείτε διαθεσιμότητα</p>
                                        </div>
                                    ) : loadingSlots ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-8 h-8 text-ui-coral animate-spin" />
                                        </div>
                                    ) : slots.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-ui-navy/30 rounded-2xl text-ui-coral bg-ui-navy/5">
                                            <p className="font-semibold">Κλειστά αυτή την ημέρα</p>
                                            <p className="text-xs mt-1 text-ui-navy/60">Δοκιμάστε μια άλλη ημερομηνία</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {morningSlots.length > 0 && (
                                                <div>
                                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                                                        {morningSlots.map(slot => (
                                                            <button
                                                                key={slot.time}
                                                                type="button"
                                                                disabled={!slot.available}
                                                                onClick={() => {
                                                                    updateField('time', slot.time);
                                                                    setTimeout(() => {
                                                                        setErrorMessage("");
                                                                        trackEvent('slot_selected', { date: formData.date, time: slot.time });
                                                                        setStep(3);
                                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                    }, 150);
                                                                }}
                                                                className={`py-3 rounded-xl text-sm font-bold transition-all duration-200 ${!slot.available
                                                                    ? 'opacity-40 cursor-not-allowed bg-ui-navy/5 text-ui-navy line-through border border-transparent'
                                                                    : formData.time === slot.time
                                                                        ? 'bg-ui-navy text-ui-coral shadow-md scale-[1.03] border-2 border-ui-navy'
                                                                        : 'bg-transparent border-2 border-white/40 text-ui-navy hover:border-ui-navy/60 hover:bg-white/20'
                                                                    }`}
                                                            >
                                                                {slot.time}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {afternoonSlots.length > 0 && (
                                                <div>
                                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                                                        {afternoonSlots.map(slot => (
                                                            <button
                                                                key={slot.time}
                                                                type="button"
                                                                disabled={!slot.available}
                                                                onClick={() => {
                                                                    updateField('time', slot.time);
                                                                    setTimeout(() => {
                                                                        setErrorMessage("");
                                                                        trackEvent('slot_selected', { date: formData.date, time: slot.time });
                                                                        setStep(3);
                                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                    }, 150);
                                                                }}
                                                                className={`py-3 rounded-xl text-sm font-bold transition-all duration-200 ${!slot.available
                                                                    ? 'opacity-40 cursor-not-allowed bg-ui-navy/5 text-ui-navy line-through border border-transparent'
                                                                    : formData.time === slot.time
                                                                        ? 'bg-ui-navy text-ui-coral shadow-md scale-[1.03] border-2 border-ui-navy'
                                                                        : 'bg-transparent border-2 border-white/40 text-ui-navy hover:border-ui-navy/60 hover:bg-white/20'
                                                                    }`}
                                                            >
                                                                {slot.time}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ═══ STEP 3: CONTACT DETAILS ═══ */}
                        {step === 3 && (
                            <div className="space-y-5">
                                <h2 className="text-xl font-black text-ui-navy flex items-center gap-2">
                                    <User className="w-6 h-6 text-ui-coral" /> Στοιχεία Επικοινωνίας
                                </h2>

                                <div>
                                    <label className="block text-[13px] font-bold text-ui-navy/80 mb-2">
                                        Ονοματεπώνυμο <span className="text-ui-coral">*</span>
                                    </label>
                                    <input type="text" name="ownerName" value={formData.ownerName} onChange={updateForm} required placeholder="π.χ. Κώστας Παπαδόπουλος" className="w-full rounded-xl bg-ui-navy text-white placeholder-white/40 px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-ui-coral border border-transparent outline-none transition-all shadow-inner" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[13px] font-bold text-ui-navy/80 mb-2">
                                            Κινητό <span className="text-ui-coral">*</span>
                                        </label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={updateForm} required placeholder="69..." className="w-full rounded-xl bg-ui-navy text-white placeholder-white/40 px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-ui-coral border border-transparent outline-none transition-all shadow-inner" />
                                    </div>
                                    <div>
                                        <label className="block text-[13px] font-bold text-ui-navy/80 mb-2">
                                            Email <span className="text-ui-coral">*</span>
                                        </label>
                                        <input type="email" name="email" value={formData.email} onChange={updateForm} required placeholder="π.χ. email@google.com" className="w-full rounded-xl bg-ui-navy text-white placeholder-white/40 px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-ui-coral border border-transparent outline-none transition-all shadow-inner" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[13px] font-bold text-ui-navy/80 mb-2">Σημειώσεις</label>
                                    <textarea name="notes" rows={3} value={formData.notes} onChange={updateForm} placeholder="Αλλεργίες, ιδιαιτερότητες κτλ." className="w-full rounded-xl bg-ui-navy text-white placeholder-white/40 px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-ui-coral border border-transparent outline-none resize-none transition-all shadow-inner" />
                                </div>

                                {/* Coupon Code Field */}
                                <div className="pt-5 mt-2 border-t border-ui-navy/10">
                                    <label className="block text-[13px] font-bold text-ui-navy/80 mb-2">Κωδικός Έκπτωσης (Προαιρετικό)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="couponCode"
                                            value={formData.couponCode}
                                            onChange={updateForm}
                                            placeholder="EX. WELCOME10"
                                            className="flex-1 rounded-xl bg-ui-navy text-white placeholder-white/40 px-4 py-3 text-sm font-medium uppercase focus:ring-2 focus:ring-ui-coral border border-transparent outline-none transition-all shadow-inner"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleValidateCoupon}
                                            disabled={!formData.couponCode || isValidatingCoupon}
                                            className="px-6 py-3 bg-ui-coral text-ui-navy rounded-xl font-bold text-sm hover:brightness-110 disabled:opacity-50 transition-all shadow-md"
                                        >
                                            {isValidatingCoupon ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Χρήση'}
                                        </button>
                                    </div>
                                    {couponError && <p className="text-xs font-bold text-red-600 mt-2 ml-1">❌ {couponError}</p>}
                                    {couponInfo && <p className="text-xs text-green-700 mt-2 ml-1 flex items-center gap-1.5 font-bold"><PartyPopper className="w-4 h-4" /> Εφαρμόστηκε έκπτωση -{couponInfo.discount}€!</p>}
                                </div>

                                {/* Accept Terms */}
                                <div className="pt-4 border-t border-ui-navy/10 flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={(e) => updateField('acceptTerms', e.target.checked)}
                                        className="mt-1 w-5 h-5 rounded border-2 border-ui-navy/30 text-ui-coral focus:ring-ui-coral bg-transparent accent-ui-coral cursor-pointer"
                                        required
                                    />
                                    <label htmlFor="acceptTerms" className="text-[13px] text-ui-navy/80 font-medium leading-relaxed">
                                        Αποδέχομαι τους <a href="/terms" target="_blank" className="font-extrabold text-ui-coral hover:underline hover:text-ui-navy">Όρους Χρήσης</a> και την <a href="/privacy" target="_blank" className="font-extrabold text-ui-coral hover:underline hover:text-ui-navy">Πολιτική Απορρήτου</a> και συναινώ στην επεξεργασία των προσωπικών μου δεδομένων για τους σκοπούς της κράτησης. *
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* ─── Error Message ─── */}
                        {errorMessage && (
                            <div className="bg-red-100/80 text-red-800 px-4 py-3 rounded-xl border border-red-200/50 text-sm font-bold flex items-center gap-2 mt-2">
                                ⚠️ {errorMessage}
                            </div>
                        )}

                        {/* ─── Action Buttons ─── */}
                        <div className="flex gap-4 mt-6">
                            {step > 1 && (
                                <button type="button" onClick={prevStep} className="px-6 py-3.5 rounded-full font-bold border-2 border-ui-navy/30 text-ui-navy hover:bg-white/20 transition-colors text-sm">
                                    Πίσω
                                </button>
                            )}
                            {step < 3 ? (
                                <button type="button" onClick={nextStep} className="flex-1 flex justify-center items-center gap-2 py-3.5 rounded-full font-extrabold bg-ui-coral text-ui-navy hover:brightness-110 shadow-lg transition-all hover:scale-[1.02] text-[15px]">
                                    Επόμενο <ArrowRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button type="submit" disabled={status === 'submitting'} className="flex-1 flex justify-center items-center gap-2 py-3.5 rounded-full font-extrabold bg-ui-coral text-ui-navy hover:brightness-110 shadow-lg transition-all hover:scale-[1.02] disabled:opacity-70 text-[15px]">
                                    {status === 'submitting' ? <><Loader2 className="w-5 h-5 animate-spin" /> Υποβολή...</> : '✅ Επιβεβαίωση'}
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Quick Actions */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="tel:+306948965371" className="flex items-center justify-center gap-2 py-3 px-6 bg-ui-taupe border-2 border-white/30 rounded-full text-sm font-bold text-ui-navy hover:shadow-lg transition-all">
                            <Phone className="w-4 h-4 text-ui-coral" /> Κάλεσε Τώρα
                        </a>
                        <a href="https://maps.google.com/?q=Solonos+28B,+Peraia,+Greece+57019" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 px-6 bg-ui-taupe border-2 border-white/30 rounded-full text-sm font-bold text-ui-navy hover:shadow-lg transition-all">
                            <MapPin className="w-4 h-4 text-ui-coral" /> Οδηγίες
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
