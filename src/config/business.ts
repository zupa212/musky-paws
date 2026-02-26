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
    addressUrl: 'https://maps.google.com/?q=Solonos+28B,+Peraia+57019',
    bookingUrl: 'https://muskypaws.gr/booking',
    email: {
        fromName: 'Musky Paws',
        fromAddress: 'bookings@muskypaws.gr',
    },
    sms: {
        senderName: 'MuskyPaws',
    },
    /** When true, new bookings are automatically confirmed (skip "pending") */
    autoConfirm: false,
    /** Number of days in advance customers can book */
    maxBookingDaysAhead: 30,
} as const

export type BusinessConfig = typeof BUSINESS
