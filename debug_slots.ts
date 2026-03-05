import { getAvailableSlots } from './src/lib/booking';
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function run() {
    try {
        const slots = await getAvailableSlots('2026-03-03', 'c47942fe-b50a-4a6c-aff6-f3657cd3907c');
        console.log(slots);
    } catch (e: any) {
        console.error("ERROR DETECTED:");
        console.error(e);
    }
}

run();
