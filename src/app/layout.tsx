import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import { PublicShell } from "@/components/layout/PublicShell";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Musky Paws | Dog Grooming Περαία Θεσσαλονίκη",
  description: "Premium υπηρεσίες καλλωπισμού σκύλων (dog grooming) στην Περαία Θεσσαλονίκης. Κλείστε ραντεβού σήμερα για την καλύτερη φροντίδα του αγαπημένου σας κατοικίδιου.",
  keywords: ["dog grooming", "grooming σκύλων", "Περαία", "Θεσσαλονίκη", "κούρεμα σκύλου", "μπάνιο σκύλου", "Musky Paws"],
  openGraph: {
    title: "Musky Paws | Dog Grooming Περαία",
    description: "Premium υπηρεσίες καλλωπισμού σκύλων στην Περαία Θεσσαλονίκης.",
    url: "https://muskypaws.gr",
    siteName: "Musky Paws",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Musky Paws Dog Grooming Περαία",
      },
    ],
    locale: "el_GR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" suppressHydrationWarning>
      <body
        className={`${outfit.variable} antialiased min-h-screen flex flex-col font-sans`}
        suppressHydrationWarning
      >
        <Script id="json-ld" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DogGrooming",
            "name": "Musky Paws",
            "image": "https://muskypaws.gr/logo.png",
            "@id": "https://muskypaws.gr",
            "url": "https://muskypaws.gr",
            "telephone": "+306948965371",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Solonos 28B",
              "addressLocality": "Peraia",
              "postalCode": "57019",
              "addressCountry": "GR"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 40.50,
              "longitude": 22.92
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "18:00"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Saturday",
                "opens": "10:00",
                "closes": "15:00"
              }
            ],
            "sameAs": [
              "https://www.facebook.com/p/Musky-Paws-61558785775782/",
              "https://instagram.com/muskypaws_dog_grooming"
            ]
          })}
        </Script>
        {/* Google Analytics & Google Ads Tag */}
        {(process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GOOGLE_ADS_ID) && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-tags" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                ${process.env.NEXT_PUBLIC_GA_ID ? `gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');` : ''}
                ${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ? `gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}');` : ''}
              `}
            </Script>
          </>
        )}

        {/* Meta Pixel Code */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

        <PublicShell>
          {children}
        </PublicShell>
        <WhatsAppButton />
      </body>
    </html>
  );
}
