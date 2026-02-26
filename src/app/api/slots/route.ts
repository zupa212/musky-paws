import { NextRequest, NextResponse } from 'next/server'
import { getAvailableSlots } from '@/lib/booking'
import { z } from 'zod'

// Simple in-memory rate limiter (per IP, per minute)
const rateLimitMap = new Map<string, { count: number; reset: number }>()
const LIMIT = 30 // requests per minute per IP

function checkRateLimit(ip: string): boolean {
    const now = Date.now()
    const entry = rateLimitMap.get(ip)
    if (!entry || entry.reset < now) {
        rateLimitMap.set(ip, { count: 1, reset: now + 60_000 })
        return true
    }
    if (entry.count >= LIMIT) return false
    entry.count++
    return true
}

const schema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    service: z.string().uuid()
})

export async function GET(request: NextRequest) {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
    if (!checkRateLimit(ip)) {
        return NextResponse.json({ error: 'Πολλά αιτήματα. Παρακαλώ περιμένετε.' }, { status: 429 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const parsed = schema.safeParse({
            date: searchParams.get('date'),
            service: searchParams.get('service')
        })
        if (!parsed.success) {
            return NextResponse.json({ error: 'Μη έγκυρες παράμετροι' }, { status: 400 })
        }

        const slots = await getAvailableSlots(parsed.data.date, parsed.data.service)
        return NextResponse.json({ slots }, {
            headers: {
                'Cache-Control': 'no-store', // availability is always fresh
            }
        })
    } catch (error: any) {
        console.error('Error fetching slots:', error)
        return NextResponse.json({ error: 'Σφάλμα κατά τον υπολογισμό διαθεσιμότητας.' }, { status: 500 })
    }
}
