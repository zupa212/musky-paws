'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { PawPrint, Mail, Lock, Loader2, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            setError('Λάθος email ή κωδικός.')
            setLoading(false)
        } else {
            router.push('/admin/bookings')
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen bg-brand-950 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-500 mb-4">
                        <PawPrint className="w-8 h-8 text-brand-950" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Musky Paws Admin</h1>
                    <p className="text-brand-400 text-sm mt-1">Είσοδος στο διαχειριστικό</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-brand-700 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-brand-400" />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="admin@muskypaws.gr"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-brand-700 mb-2">Κωδικός</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-brand-400" />
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-brand-200 focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none text-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-950 text-white font-bold hover:bg-brand-800 transition-colors disabled:opacity-60"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            {loading ? 'Είσοδος...' : 'Σύνδεση'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
