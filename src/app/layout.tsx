import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import { PublicShell } from "@/components/layout/PublicShell";
import { SiteProtection } from "@/components/layout/SiteProtection";
import { seoReviews } from "@/config/seo";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://muskypaws.gr'),
  applicationName: "Musky Paws",
  title: "Musky Paws | Κομμωτήριο Σκύλων Περαία Θεσσαλονίκη",
  description: "Full grooming, πλύσιμο σκύλου, deshedding, furminator, νύχια και αυτιά στην Περαία Θεσσαλονίκης. Εξυπηρετούμε Περαία, Καλαμαριά, Μηχανιώνα, Τρίλοφο, Επανομή και Θέρμη με online booking.",
  keywords: [
    "κομμωτήριο σκύλων Περαία",
    "dog grooming Περαία",
    "κούρεμα σκύλου Περαία",
    "πλύσιμο σκύλου Περαία",
    "deshedding σκύλου Θεσσαλονίκη",
    "furminator σκύλου Περαία",
    "puppy grooming Θεσσαλονίκη",
    "κούρεμα μικρόσωμου σκύλου",
    "dog grooming Καλαμαριά",
    "dog grooming Μηχανιώνα",
    "dog grooming Τρίλοφος",
    "dog grooming Επανομή",
    "dog grooming Θέρμη",
    "Musky Paws"
  ],
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Musky Paws | Dog Grooming Περαία Θεσσαλονίκη",
    description: "Full grooming, bath & brush, deshedding, furminator και puppy grooming στην Περαία Θεσσαλονίκης.",
    url: "https://muskypaws.gr",
    siteName: "Musky Paws",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Musky Paws Dog Grooming Περαία Θεσσαλονίκη",
      },
    ],
    locale: "el_GR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Musky Paws | Dog Grooming Περαία Θεσσαλονίκη",
    description: "Κούρεμα σκύλου, πλύσιμο, deshedding και puppy grooming στην Περαία Θεσσαλονίκης.",
    images: ["/og-image.jpg"],
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
            "image": "https://muskypaws.gr/og-image.jpg",
            "logo": "https://muskypaws.gr/logo.png",
            "@id": "https://muskypaws.gr",
            "url": "https://muskypaws.gr",
            "telephone": "+306948965371",
            "priceRange": "$$",
            "description": "Κομμωτήριο σκύλων στην Περαία Θεσσαλονίκης για full grooming, πλύσιμο, deshedding, furminator και puppy grooming.",
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
            ],
            "areaServed": ["Περαία", "Καλαμαριά", "Μηχανιώνα", "Τρίλοφος", "Επανομή", "Θέρμη", "Ανατολική Θεσσαλονίκη"],
            "review": seoReviews.map((review) => ({
              "@type": "Review",
              "author": {
                "@type": "Person",
                "name": review.author,
              },
              "reviewBody": review.body,
            }))
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
