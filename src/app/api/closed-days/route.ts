import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Returns an array of day_of_week numbers (0-6) that are CLOSED
 * (no schedule row, or no start_time/end_time configured).
 * This lets the booking calendar proactively grey-out those days.
 */
export async function GET() {
    try {
        const supabase = await createClient()
        const { data: schedules } = await supabase
            .from('schedules')
            .select('day_of_week, start_time, end_time')

        const openDays = new Set(
            (schedules || [])
                .filter(s => s.start_time && s.end_time)
                .map(s => s.day_of_week)
        )

        // Days 0-6 that are NOT in the openDays set
        const closedDays: number[] = []
        for (let i = 0; i < 7; i++) {
            if (!openDays.has(i)) closedDays.push(i)
        }

        return NextResponse.json({ closedDays }, {
            headers: { 'Cache-Control': 'public, max-age=300' } // 5 min cache
        })
    } catch (error: any) {
        console.error('Error fetching closed days:', error)
        return NextResponse.json({ closedDays: [0] }) // Fallback: only Sunday closed
    }
}
