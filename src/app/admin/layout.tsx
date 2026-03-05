import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminNotificationListener from '@/components/admin/AdminNotificationListener'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // If not logged in, render children without sidebar (login page)
    // The middleware handles the actual redirect to /admin/login
    if (!user) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen bg-brand-50 md:flex">
            <AdminSidebar userEmail={user.email ?? ''} />
            <main className="flex-1 overflow-auto p-4 pt-[72px] md:pt-0 md:p-8">
                {children}
            </main>
            <AdminNotificationListener />
        </div>
    )
}
