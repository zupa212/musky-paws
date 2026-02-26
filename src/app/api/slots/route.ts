import { NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/booking';
import { z } from 'zod';

const schema = z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    service: z.string().uuid()
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        const service = searchParams.get('service');

        const result = schema.safeParse({ date, service });

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
        }

        const slots = await getAvailableSlots(result.data.date, result.data.service);

        return NextResponse.json({ slots });
    } catch (error: any) {
        console.error('Error fetching slots:', error);
        return NextResponse.json(
            { error: 'Internal server error while evaluating schedule.' },
            { status: 500 }
        );
    }
}
