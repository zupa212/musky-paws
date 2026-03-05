// Run Google Calendar Migration
// Adds google_calendar_event_id column to bookings table

const SUPABASE_URL = 'https://gowgutmkaifhkhjuzhaj.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key-here'

async function runMigration() {
    console.log('🗄️  Running Google Calendar migration...\n')

    const sql = `
        ALTER TABLE public.bookings 
        ADD COLUMN IF NOT EXISTS google_calendar_event_id TEXT;
        
        CREATE INDEX IF NOT EXISTS idx_bookings_google_cal_event_id 
        ON public.bookings(google_calendar_event_id);
    `

    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ query: sql })
    })

    // Try direct SQL via the management API
    const sqlRes = await fetch(`${SUPABASE_URL}/pg/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ query: sql })
    })

    // Fallback: check if column already exists
    const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/bookings?select=google_calendar_event_id&limit=1`, {
        headers: {
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        }
    })

    if (checkRes.ok) {
        console.log('✅ Column google_calendar_event_id already exists or was just created!')
    } else {
        const err = await checkRes.json()
        if (err.message?.includes('does not exist')) {
            console.log('⚠️  Column does not exist yet.')
            console.log('\n📋 Please run this SQL manually in your Supabase Dashboard → SQL Editor:\n')
            console.log('─────────────────────────────────────────────────')
            console.log(sql.trim())
            console.log('─────────────────────────────────────────────────')
        } else {
            console.log('⚠️  Unexpected response:', err)
        }
    }

    console.log('\n🔧 Next steps for Google Calendar:')
    console.log('─────────────────────────────────────────────────')
    console.log('1. Go to: https://console.cloud.google.com/')
    console.log('2. Create a project or select existing one')
    console.log('3. Enable "Google Calendar API"')
    console.log('4. Create a Service Account & download the JSON key')
    console.log('5. Share your Google Calendar with the service account email')
    console.log('6. Add these to your .env.local:')
    console.log('   GOOGLE_CALENDAR_ID=your-email@gmail.com')
    console.log('   GOOGLE_SERVICE_ACCOUNT_KEY=<paste the JSON key contents>')
    console.log('─────────────────────────────────────────────────')
}

runMigration()
