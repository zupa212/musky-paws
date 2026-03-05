import { NextResponse } from 'next/server'
import { processNotificationOutbox } from '@/lib/notifications'

export const dynamic = 'force-dynamic'

/**
 * process-notifications
 * This endpoint should be called by a CRON job (e.g. Vercel Cron)
 * to send scheduled marketing messages and review requests.
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    // Basic security: Check for a secret key
    if (process.env.CRON_SECRET && key !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const result = await processNotificationOutbox()
        return NextResponse.json({
            success: true,
            processed: result.processed,
            timestamp: new Date().toISOString()
        })
    } catch (error: any) {
        console.error('Cron Error:', error)
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}
