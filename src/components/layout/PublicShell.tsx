'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'

/**
 * Conditionally renders the public Header and Footer.
 * They are hidden on /admin routes where the admin sidebar provides navigation.
 */
export function PublicShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')

    if (isAdmin) {
        return <>{children}</>
    }

    return (
        <>
            <Header />
            <main className="flex-grow flex flex-col">
                {children}
            </main>
            <Footer />
        </>
    )
}
