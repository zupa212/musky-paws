const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { getCalendarEvents } = require('./src/lib/google-calendar');

const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});
const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY']);

async function test() {
    process.env.GOOGLE_CALENDAR_ID = env['GOOGLE_CALENDAR_ID'];
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY = env['GOOGLE_SERVICE_ACCOUNT_KEY'];

    const { data: bookings } = await supabase.from('bookings')
        .select('*')
        .gte('start_at', '2026-03-03T00:00:00Z')
        .lte('start_at', '2026-03-03T23:59:59Z');

    let gcal = [];
    try {
        const tStart = new Date('2026-03-03T00:00:00Z');
        const tEnd = new Date('2026-03-03T23:59:59Z');
        gcal = await getCalendarEvents(tStart, tEnd);
    } catch (e) { console.error(e) }

    fs.writeFileSync('debug_data.json', JSON.stringify({ bookings, gcal }, null, 2));
}

test();
