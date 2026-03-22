import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Κλείσε Ραντεβού Dog Grooming Online | Musky Paws Περαία',
    description: 'Κλείστε online ραντεβού για κούρεμα σκύλου, πλύσιμο, deshedding, furminator ή puppy grooming στο Musky Paws στην Περαία Θεσσαλονίκης.',
    alternates: {
        canonical: 'https://muskypaws.gr/booking',
    },
};

export default function BookingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
