'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Bell, X } from 'lucide-react'

interface NewBooking {
    id: string
    status: string
    start_at: string
    pet_type: string
    breed: string | null
    created_at: string
}

export default function AdminNotificationListener() {
    const [toast, setToast] = useState<{ message: string; bookingId: string } | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const router = useRouter()
    const supabase = createClient()

    // Reusable AudioContext to bypass 1-time autoplay limits after first interaction
    const audioCtxRef = useRef<AudioContext | null>(null)

    useEffect(() => {
        // Initialize AudioContext on mount
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        if (AudioContextClass) {
            audioCtxRef.current = new AudioContextClass()
        }

        // Unlock audio context on any user interaction
        const unlockAudio = () => {
            if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume()
            }
            // Optional: play a silent sound to force unlock
            if (audioCtxRef.current) {
                const buffer = audioCtxRef.current.createBuffer(1, 1, 22050)
                const source = audioCtxRef.current.createBufferSource()
                source.buffer = buffer
                source.connect(audioCtxRef.current.destination)
                source.start(0)
            }
            window.removeEventListener('click', unlockAudio)
            window.removeEventListener('touchstart', unlockAudio)
        }

        window.addEventListener('click', unlockAudio)
        window.addEventListener('touchstart', unlockAudio)

        return () => {
            window.removeEventListener('click', unlockAudio)
            window.removeEventListener('touchstart', unlockAudio)
            if (audioCtxRef.current) {
                audioCtxRef.current.close()
            }
        }
    }, [])

    // Generate notification sound using Web Audio API
    const playNotificationSound = useCallback(() => {
        try {
            const ctx = audioCtxRef.current
            if (!ctx) return

            // Ensure context is running
            if (ctx.state === 'suspended') {
                ctx.resume()
            }

            // Play a bright, noticeable two-tone chime
            const playTone = (freq: number, startTime: number, duration: number) => {
                const osc = ctx.createOscillator()
                const gain = ctx.createGain()

                // Add a little bit of filtering to make it less harsh but still loud
                const filter = ctx.createBiquadFilter()
                filter.type = 'lowpass'
                filter.frequency.value = 3000

                osc.connect(filter)
                filter.connect(gain)
                gain.connect(ctx.destination)

                osc.type = 'triangle' // Triangle wave is brighter and more noticeable
                osc.frequency.setValueAtTime(freq, startTime)

                gain.gain.setValueAtTime(0, startTime)
                gain.gain.linearRampToValueAtTime(0.6, startTime + 0.05) // Louder volume (0.6)
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

                osc.start(startTime)
                osc.stop(startTime + duration)
            }

            const now = ctx.currentTime
            // Chime sequence: High pitched A5 → E6
            playTone(880.00, now, 0.4)        // A5
            playTone(1318.51, now + 0.15, 0.6) // E6

        } catch (e) {
            console.error('Could not play notification sound:', e)
        }
    }, [])

    useEffect(() => {
        // Subscribe to new bookings via Supabase Realtime
        const channel = supabase
            .channel('admin-new-bookings')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'bookings',
                },
                (payload: any) => {
                    const newBooking = payload.new as NewBooking

                    // Play notification sound
                    playNotificationSound()

                    // Show toast
                    setToast({
                        message: `Νέο ραντεβού!`,
                        bookingId: newBooking.id
                    })

                    // Auto-dismiss toast after 8 seconds
                    setTimeout(() => setToast(null), 8000)

                    // Refresh server data
                    router.refresh()
                }
            )
            .subscribe()

        // Also listen for status changes (to update counts, etc.)
        const statusChannel = supabase
            .channel('admin-booking-status')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'bookings',
                },
                () => {
                    // When bookings are canceled/modified, refresh the page
                    router.refresh()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
            supabase.removeChannel(statusChannel)
        }
    }, [supabase, router, playNotificationSound])

    return (
        <>
            {/* New Booking Toast */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <div className="bg-navy-900 text-white rounded-2xl shadow-2xl overflow-hidden max-w-sm border border-navy-700">
                        <div className="p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                                    <Bell className="w-5 h-5 text-navy-900 animate-bounce" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm">{toast.message}</p>
                                    <p className="text-brand-300 text-xs mt-1">
                                        Πατήστε για να δείτε τα ραντεβού
                                    </p>
                                </div>
                                <button
                                    onClick={() => setToast(null)}
                                    className="p-1 hover:bg-navy-800 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4 text-brand-400" />
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setToast(null)
                                router.push('/admin/bookings')
                            }}
                            className="w-full px-5 py-3 bg-accent-500/10 hover:bg-accent-500/20 text-accent-400 text-sm font-bold text-left transition-colors border-t border-navy-700"
                        >
                            Προβολή Ραντεβού →
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
