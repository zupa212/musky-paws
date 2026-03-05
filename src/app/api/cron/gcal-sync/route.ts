import { NextResponse } from 'next/server';
import { syncCancelledEventsFromCalendar } from '@/lib/google-calendar';

// To secure this endpoint for Vercel Cron
// Vercel sends a specific header, but we can also use a secret token
// https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');

    // Allow local testing or valid Vercel Cron Secret
    if (
        process.env.NODE_ENV !== 'development' &&
        authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        // Return 401 if unauthorized in production
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await syncCancelledEventsFromCalendar();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Cron GCal Sync Error:', error);
        return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
}
