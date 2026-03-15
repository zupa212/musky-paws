/**
 * Central business configuration for Musky Paws.
 * Edit these values to change branding, contact info, and behavior.
 * All notification templates and UI strings use these values.
 */
export const BUSINESS = {
    name: 'Musky Paws',
    phone: '+306948965371',
    phoneFormatted: '694 896 5371',
    city: 'Θεσσαλονίκη',
    timezone: 'Europe/Athens',
    address: 'Σόλωνος 28Β, Περαία 570 19',
    addressUrl: 'https://www.google.com/maps/place//data=!4m2!3m1!1s0x14a8157d8e728873:0xdcebed07995b9773?sa=X&ved=1t:8290&ictx=111',
    bookingUrl: 'https://muskypaws.gr/booking',
    email: {
        fromName: 'Musky Paws',
        fromAddress: 'bookings@muskypaws.gr',
    },
    sms: {
        senderName: 'MuskyPaws',
    },
    /** Number of days in advance customers can book */
    maxBookingDaysAhead: 30,
} as const

export type BusinessConfig = typeof BUSINESS
