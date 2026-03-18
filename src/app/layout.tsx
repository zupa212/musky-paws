import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import { PublicShell } from "@/components/layout/PublicShell";
import { SiteProtection } from "@/components/layout/SiteProtection";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://muskypaws.gr'),
  title: "Κομμωτήριο Σκύλων Περαία | Dog Grooming & Spa | Musky Paws",
  description: "Το premium κομμωτήριο σκύλων στην Περαία. Εξειδικευμένο dog grooming, κούρεμα και πλύσιμο σκύλων χωρίς άγχος. Κλείστε το ραντεβού σας!",
  keywords: ["dog grooming", "grooming σκύλων", "πλύσιμο σκύλου", "Περαία", "Θεσσαλονίκη", "Τρίλοφος", "Επανομή", "Μηχανιώνα", "Θέρμη", "Πλαγιάρι", "Ανατολική Θεσσαλονίκη", "Καλαμαριά", "κούρεμα σκύλου", "μπάνιο σκύλου", "Musky Paws", "κομμωτήριο σκύλων Περαία"],
  openGraph: {
    title: "Κομμωτήριο Σκύλων Περαία | Musky Paws",
    description: "Premium υπηρεσίες dog grooming στην Περαία Θεσσαλονίκης.",
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
            "@type": "LocalBusiness",
            "name": "Musky Paws Dog Grooming",
            "image": "https://muskypaws.gr/logo.png",
            "@id": "https://muskypaws.gr",
            "url": "https://muskypaws.gr",
            "telephone": "+306948965371",
            "priceRange": "$$",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Σόλωνος 28Β",
              "addressLocality": "Περαία",
              "postalCode": "570 19",
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
                "closes": "21:00"
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

        <SiteProtection />
        <PublicShell>
          {children}
        </PublicShell>
      </body>
    </html>
  );
}
