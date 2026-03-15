import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Κλείσε Ραντεβού Online | Musky Paws Περαία',
    description: 'Κλείστε το ραντεβού σας για καλλωπισμό σκύλου online στο Musky Paws. Επιλέξτε υπηρεσία, ημερομηνία και ώρα που σας εξυπηρετεί.',
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
