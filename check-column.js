require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    console.log('Checking for google_calendar_event_id column...');
    const { data, error } = await supabase.from('bookings').select('google_calendar_event_id').limit(1);

    if (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } else {
        console.log('Success! Column exists. Data:', data);
    }
}

run();
