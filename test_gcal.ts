import { getCalendarEvents } from './src/lib/google-calendar';
import { startOfDay, endOfDay } from 'date-fns';
import { loadEnvConfig } from '@next/env';
import fs from 'fs';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function checkGcal() {
    const targetDate = new Date('2026-03-03T00:00:00.000Z');
    const tStart = startOfDay(targetDate);
    const tEnd = endOfDay(targetDate);

    try {
        const events = await getCalendarEvents(tStart, tEnd);
        fs.writeFileSync('gcal_debug.json', JSON.stringify(events, null, 2));
    } catch (e: any) {
        console.error("ERROR:", e.message);
    }
}

checkGcal();
