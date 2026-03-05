import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { PublicShell } from "@/components/layout/PublicShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Musky Paws | Dog Grooming & Pet Shop Περαία",
  description: "Premium υπηρεσίες καλλωπισμού σκύλων (dog grooming) και pet shop στην Περαία Θεσσαλονίκης. Κλείστε ραντεβού σήμερα για την καλύτερη φροντίδα του αγαπημένου σας κατοικίδιου.",
  keywords: ["dog grooming", "pet shop", "Περαία", "Θεσσαλονίκη", "κούρεμα σκύλου", "μπάνιο σκύλου", "Musky Paws"],
  openGraph: {
    title: "Musky Paws | Dog Grooming & Pet Shop Περαία",
    description: "Premium υπηρεσίες καλλωπισμού σκύλων και pet shop στην Περαία Θεσσαλονίκης.",
    url: "https://muskypaws.gr", // Αντικαταστήστε με το τελικό domain
    siteName: "Musky Paws",
    images: [
      {
        url: "/og-image.jpg", // Create an og-image.jpg in the public folder
        width: 1200,
        height: 630,
        alt: "Musky Paws Dog Grooming Περαία",
      },
    ],
    locale: "el_GR",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans`}
        suppressHydrationWarning
      >
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
      </body>
    </html>
  );
}
