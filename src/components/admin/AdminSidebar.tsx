'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PawPrint, CalendarDays, Users, Wrench, Clock, LogOut, ChevronRight, Megaphone, Menu, X, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: TrendingUp },
    { href: '/admin/bookings', label: 'Ραντεβού', icon: CalendarDays },
    { href: '/admin/customers', label: 'Πελάτες', icon: Users },
    { href: '/admin/services', label: 'Υπηρεσίες', icon: Wrench },
    { href: '/admin/schedule', label: 'Ωράριο', icon: Clock },
    { href: '/admin/marketing', label: 'Marketing', icon: Megaphone },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [mobileOpen, setMobileOpen] = useState(false)

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
        router.refresh()
    }

    const currentPage = navItems.find(item => pathname.startsWith(item.href))

    return (
        <>
            {/* ═══ Mobile Top Bar ═══ */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-brand-950 text-white h-14 flex items-center justify-between px-4 shadow-lg">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="p-2 -ml-2 rounded-xl hover:bg-brand-800 transition-colors"
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <PawPrint className="w-4 h-4 text-accent-400" />
                    <span className="font-bold text-sm">{currentPage?.label || 'Admin'}</span>
                </div>
                <div className="w-9" /> {/* Spacer for centering */}
            </div>

            {/* ═══ Mobile Overlay ═══ */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ═══ Sidebar ═══ */}
            <aside className={`
                fixed md:sticky top-0 left-0 z-50 h-screen
                w-[280px] md:w-64
                bg-brand-950 text-white flex flex-col shrink-0
                transition-transform duration-300 ease-out
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                {/* Logo + Close */}
                <div className="p-5 md:p-6 border-b border-brand-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-accent-500 flex items-center justify-center shrink-0">
                            <PawPrint className="w-5 h-5 text-brand-950" />
                        </div>
                        <div>
                            <div className="font-bold text-sm">Musky Paws</div>
                            <div className="text-brand-400 text-xs">Admin Panel</div>
                        </div>
                    </div>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="md:hidden p-2 -mr-2 rounded-xl hover:bg-brand-800 transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-5 h-5 text-brand-400" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 md:p-4 space-y-1 overflow-y-auto">
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const active = pathname.startsWith(href)
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 px-4 py-3.5 md:py-3 rounded-xl text-sm font-medium transition-all group ${active
                                    ? 'bg-accent-500 text-brand-950 shadow-lg shadow-accent-500/20'
                                    : 'text-brand-300 hover:bg-brand-800 hover:text-white active:bg-brand-700'
                                    }`}
                            >
                                <Icon className="w-5 h-5 md:w-4 md:h-4 shrink-0" />
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
                        className="flex items-center gap-3 w-full px-4 py-3.5 md:py-3 rounded-xl text-sm font-medium text-brand-300 hover:bg-brand-800 hover:text-red-400 transition-colors active:bg-brand-700"
                    >
                        <LogOut className="w-5 h-5 md:w-4 md:h-4" />
                        Αποσύνδεση
                    </button>
                </div>
            </aside>
        </>
    )
}
