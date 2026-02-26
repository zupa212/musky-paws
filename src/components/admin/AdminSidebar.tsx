'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PawPrint, CalendarDays, Users, Wrench, Clock, LogOut, ChevronRight } from 'lucide-react'

const navItems = [
    { href: '/admin/bookings', label: 'Ραντεβού', icon: CalendarDays },
    { href: '/admin/customers', label: 'Πελάτες', icon: Users },
    { href: '/admin/services', label: 'Υπηρεσίες', icon: Wrench },
    { href: '/admin/schedule', label: 'Ωράριο', icon: Clock },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
        router.refresh()
    }

    return (
        <aside className="w-64 bg-brand-950 text-white flex flex-col shrink-0 min-h-screen">
            {/* Logo */}
            <div className="p-6 border-b border-brand-800">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent-500 flex items-center justify-center shrink-0">
                        <PawPrint className="w-5 h-5 text-brand-950" />
                    </div>
                    <div>
                        <div className="font-bold text-sm">Musky Paws</div>
                        <div className="text-brand-400 text-xs">Admin Panel</div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname.startsWith(href)
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors group ${active
                                    ? 'bg-accent-500 text-brand-950'
                                    : 'text-brand-300 hover:bg-brand-800 hover:text-white'
                                }`}
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="flex-1">{label}</span>
                            {active && <ChevronRight className="w-3 h-3" />}
                        </Link>
                    )
                })}
            </nav>

            {/* User / Sign out */}
            <div className="p-4 border-t border-brand-800">
                <div className="text-xs text-brand-500 mb-3 truncate px-1">{userEmail}</div>
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-brand-300 hover:bg-brand-800 hover:text-red-400 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Αποσύνδεση
                </button>
            </div>
        </aside>
    )
}
