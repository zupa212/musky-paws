"use client";

export function generateICS(date: string, time: string, serviceName: string, durationMin: number) {
    // Parsing date and time (simplistic approach for MVP)
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    const startDate = new Date(year, month - 1, day, hour, minute);
    const endDate = new Date(startDate.getTime() + durationMin * 60000);

    const formatDate = (date: Date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Musky Paws//Grooming Booking//EN',
        'BEGIN:VEVENT',
        `UID:${Date.now()}@muskypaws.gr`,
        `DTSTAMP:${formatDate(new Date())}`,
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        `SUMMARY:Ραντεβού Musky Paws - ${serviceName}`,
        'DESCRIPTION:Το ραντεβού σας για καλλωπισμό σκύλου στην οδό Σόλωνος 28Β, Περαία.',
        'LOCATION:Σόλωνος 28Β, Περαία 570 19',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `musky-paws-booking.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
