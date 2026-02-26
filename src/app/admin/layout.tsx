import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/admin/login')

    return (
        <div className="min-h-screen bg-brand-50 flex">
            <AdminSidebar userEmail={user.email ?? ''} />
            <main className="flex-1 overflow-auto p-6 md:p-8">
                {children}
            </main>
        </div>
    )
}
