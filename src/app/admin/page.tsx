import { createAdminClient } from "@/lib/supabase/server";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, Search, User, Phone, Mail, FileText, PawPrint } from "lucide-react";
import { updateBookingStatus } from "@/app/actions/admin";

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    const supabase = await createAdminClient();

    const { data: bookings, error } = await supabase
        .from("bookings")
        .select(`
      id, start_at, end_at, status, pet_type, breed, weight_kg, notes,
      customers (name, phone, email),
      services (name, duration_min)
    `)
        .order("start_at", { ascending: true });

    if (error) {
        return <div className="p-8 text-red-500">Error loading bookings: {error.message}</div>;
    }

    // Helper to trigger server action from client component (we'll use a hidden form for simplicity without "use client")
    return (
        <div className="min-h-screen bg-brand-50 p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-brand-200">
                    <div>
                        <h1 className="text-2xl font-bold text-brand-950 flex items-center gap-3">
                            <PawPrint className="text-accent-500" />
                            Musky Paws Admin
                        </h1>
                        <p className="text-brand-500 text-sm mt-1">Διαχείριση Ραντεβού & Υπηρεσιών</p>
                    </div>
                    <div className="flex bg-brand-100 p-1 rounded-full">
                        <button className="px-6 py-2 bg-white rounded-full shadow-sm text-sm font-bold">Ραντεβού</button>
                        <button className="px-6 py-2 rounded-full text-brand-600 text-sm font-medium hover:text-brand-900 transition-colors">Υπηρεσίες</button>
                        <button className="px-6 py-2 rounded-full text-brand-600 text-sm font-medium hover:text-brand-900 transition-colors">Ωράριο</button>
                    </div>
                </header>

                {/* LIST VIEW */}
                <main className="bg-white rounded-3xl shadow-sm border border-brand-200 overflow-hidden">
                    <div className="p-6 border-b border-brand-100 flex justify-between items-center bg-brand-50/50">
                        <h2 className="text-lg font-bold text-brand-900 flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-brand-500" /> Όλα τα Ραντεβού
                        </h2>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-2.5 text-brand-400" />
                            <input type="text" placeholder="Αναζήτηση..." className="pl-9 pr-4 py-2 bg-white border border-brand-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 w-64" />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-brand-50/80 text-brand-500 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-semibold">Ημερομηνία & Ώρα</th>
                                    <th className="p-4 font-semibold">Πελάτης & Κατοικίδιο</th>
                                    <th className="p-4 font-semibold">Υπηρεσία</th>
                                    <th className="p-4 font-semibold">Κατάσταση</th>
                                    <th className="p-4 font-semibold text-right">Ενέργειες</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-100">
                                {bookings?.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-brand-500">Δεν βρέθηκαν ραντεβού.</td>
                                    </tr>
                                ) : (
                                    bookings?.map((booking: any) => {
                                        const start = parseISO(booking.start_at);
                                        return (
                                            <tr key={booking.id} className="hover:bg-brand-50/50 transition-colors group">
                                                <td className="p-4">
                                                    <div className="font-bold text-brand-900">{format(start, 'dd/MM/yyyy')}</div>
                                                    <div className="text-sm text-brand-500 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" /> {format(start, 'HH:mm')}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-brand-900 flex items-center gap-1">
                                                        <User className="w-4 h-4 text-brand-400" /> {booking.customers.name}
                                                    </div>
                                                    <div className="text-sm text-brand-600 flex items-center gap-2 mt-1">
                                                        <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-brand-400" /> {booking.customers.phone}</span>
                                                        <span className="bg-brand-100 px-2 rounded font-medium text-xs">{booking.pet_type === 'dog' ? 'Σκύλος' : 'Γάτα'} - {booking.weight_kg}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-semibold text-brand-900">{booking.services.name}</div>
                                                    <div className="text-sm text-brand-500">{booking.services.duration_min} λεπτά</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                            ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : ''}
                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 border border-green-200' : ''}
                            ${booking.status === 'canceled' ? 'bg-red-100 text-red-800 border border-red-200' : ''}
                            ${booking.status === 'completed' ? 'bg-blue-100 text-blue-800 border border-blue-200' : ''}
                          `}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {booking.status === 'pending' && (
                                                            <form action={async () => {
                                                                "use server";
                                                                await updateBookingStatus(booking.id, 'confirmed');
                                                            }}>
                                                                <button type="submit" title="Επιβεβαίωση" className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg">
                                                                    <CheckCircle2 className="w-4 h-4" />
                                                                </button>
                                                            </form>
                                                        )}
                                                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                                            <form action={async () => {
                                                                "use server";
                                                                await updateBookingStatus(booking.id, 'canceled');
                                                            }}>
                                                                <button type="submit" title="Ακύρωση" className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg">
                                                                    <XCircle className="w-4 h-4" />
                                                                </button>
                                                            </form>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}
