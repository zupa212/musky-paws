const { getCalendarEvents } = require('./src/lib/google-calendar');
const { startOfDay, endOfDay } = require('date-fns');

async function checkGcal() {
    const targetDate = new Date('2026-03-03T00:00:00Z');
    const tStart = startOfDay(targetDate);
    const tEnd = endOfDay(targetDate);

    try {
        const events = await getCalendarEvents(tStart, tEnd);
        console.log("EVENTS:", JSON.stringify(events, null, 2));
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}

checkGcal();
