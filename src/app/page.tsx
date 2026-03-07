"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, PawPrint, Play } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Services for Marquee
const marqueeServices = [
  { text: 'Full Grooming', color: 'bg-red-500' },
  { text: 'Λύσιμο - Ξεκόμπιασμα', color: 'bg-vetic-blue' },
  { text: 'Μπάνιο & Βούρτσισμα', color: 'bg-vetic-green' },
  { text: 'Κόψιμο Νυχιών', color: 'bg-vetic-yellow' },
  { text: 'Pomeranian Grooming', color: 'bg-vetic-blue' },
  { text: 'Αφαίρεση Νεκρής Τρίχας', color: 'bg-red-500' },
  { text: 'Καθαρισμός Αυτιών', color: 'bg-vetic-green' },
  { text: 'Spa & Υγιεινή', color: 'bg-vetic-yellow' },
];

export default function Home() {
  return (
    <>
      <div className="pt-24 pb-8 overflow-hidden">

        {/* ═══════════════ VETIC HERO SECTION ═══════════════ */}
        <section className="relative px-4 max-w-7xl mx-auto flex flex-col items-center text-center mt-8 lg:mt-16 z-10">

          {/* Subtle top pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm text-sm font-semibold text-navy-800 mb-8 border border-brand-200"
          >
            <div className="w-2 h-2 rounded-full bg-red-500" />
            Dog Grooming Περαία
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold text-navy-900 tracking-tight leading-[1.1] max-w-4xl mx-auto relative z-20"
          >
            Dog Grooming
            <br />
            <span className="wavy-underline">Θεσσαλονίκη</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-navy-800/60 max-w-xl mx-auto text-lg leading-relaxed relative z-20"
          >
            Premium περιποίηση σκύλων & γατών στην Περαία. Κλείσε ραντεβού online ή κάλεσε τώρα για άμεση επιβεβαίωση.
          </motion.p>

          {/* Floating Badges (Framer Motion) */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="hidden md:flex absolute top-12 left-[10%] xl:left-[15%] w-14 h-14 bg-vetic-blue rounded-full items-center justify-center shadow-lg"
          >
            <PawPrint className="w-6 h-6 text-navy-900" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="hidden md:flex absolute top-2 right-[20%] w-12 h-12 bg-vetic-yellow rounded-full items-center justify-center shadow-lg transform rotate-12"
          >
            <PawPrint className="w-5 h-5 text-navy-900" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 2 }}
            className="hidden lg:flex absolute bottom-[30%] right-[10%] w-16 h-16 bg-vetic-green rounded-full items-center justify-center shadow-lg -rotate-12"
          >
            <PawPrint className="w-7 h-7 text-navy-900" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
            className="hidden lg:flex absolute bottom-[35%] left-[15%] w-12 h-12 bg-vetic-yellow rounded-full items-center justify-center shadow-lg"
          >
            <PawPrint className="w-5 h-5 text-navy-900" />
          </motion.div>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-6 relative z-30"
          >
            <div className="flex items-center bg-navy-900 rounded-full pl-6 pr-2 py-2 shadow-xl hover:bg-navy-800 transition-colors">
              <Link href="/booking" className="text-white font-semibold mr-4">
                Κλείσε Ραντεβού Online
              </Link>
              <div className="w-10 h-10 bg-vetic-pink rounded-full flex items-center justify-center shrink-0">
                <PawPrint className="w-5 h-5 text-navy-900 fill-navy-900" />
              </div>
            </div>

            <Link href="/gallery" className="flex items-center gap-2 font-semibold text-navy-900 hover:text-vetic-pink transition-colors">
              Before/After Αποτελέσματα <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Sitelinks & Callouts (SEO Extensions) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 relative z-30 max-w-3xl"
          >
            {/* Callouts */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-medium text-navy-800/80">
              <span className="flex items-center gap-1"><span className="text-vetic-green">✔</span> Online Κράτηση</span>
              <span className="flex items-center gap-1"><span className="text-vetic-green">✔</span> Άμεση Επικοινωνία</span>
              <span className="flex items-center gap-1"><span className="text-vetic-green">✔</span> Premium Παροχές</span>
              <span className="flex items-center gap-1"><span className="text-vetic-green">✔</span> 100% Υγιεινή</span>
            </div>
            {/* Sitelinks */}
            <div className="w-full h-px bg-brand-200 my-2 opacity-50" />
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-bold text-navy-900">
              <Link href="/booking" className="hover:text-vetic-pink underline decoration-vetic-pink/30 underline-offset-4">Booking</Link>
              <Link href="/pricing" className="hover:text-vetic-pink underline decoration-vetic-pink/30 underline-offset-4">Τιμές</Link>
              <Link href="/services" className="hover:text-vetic-pink underline decoration-vetic-pink/30 underline-offset-4">Υπηρεσίες</Link>
              <Link href="/gallery" className="hover:text-vetic-pink underline decoration-vetic-pink/30 underline-offset-4">Before/After</Link>
            </div>
          </motion.div>

          {/* Hero Squircles Images */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 w-full max-w-5xl mx-auto"
          >
            <div className="relative aspect-square md:aspect-auto md:h-[400px] w-full rounded-3xl md:rounded-[40px] overflow-hidden bg-[#e0ccff]">
              <Image src="https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=800" alt="Γάτα grooming Περαία" fill className="object-cover object-top hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative aspect-square md:aspect-auto md:h-[400px] w-full rounded-3xl md:rounded-[40px] overflow-hidden bg-[#ffe600]">
              <Image src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800" alt="Σκύλος grooming Θεσσαλονίκη" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative aspect-[4/3] md:aspect-auto md:h-[400px] w-full col-span-2 md:col-span-1 rounded-3xl md:rounded-[40px] overflow-hidden bg-[#b3e5fc] md:-mt-8">
              <Image src="/images/stella.webp" alt="Στέλλα - Head Groomer Musky Paws" fill className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </motion.div>
        </section>
      </div>

      {/* ═══════════════ MARQUEE & ABOUT SECTION ═══════════════ */}
      <section className="pt-32 pb-20 bg-brand-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-20">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-navy-800 mb-6">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                Κομμωτήριο Σκύλων Θεσσαλονίκη
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 tracking-tight leading-[1.1]">
                Υγιεινή, Ασφάλεια & <span className="wavy-underline">Φροντίδα</span>
              </h2>
            </div>
            <div className="max-w-lg">
              <p className="text-navy-800/60 leading-relaxed text-lg">
                Full grooming, μπάνιο, deshedding, νύχια και αυτιά. Εύκολη πρόσβαση από Θεσσαλονίκη με premium υπηρεσίες, καθαρό αποτέλεσμα και ήπιο χειρισμό χωρίς στρες για τους μικρούς μας φίλους.
              </p>
            </div>
          </div>
        </div>

        {/* Marquee Row 1 */}
        <div className="relative flex overflow-x-hidden mb-6">
          <div className="animate-marquee gap-6 py-2 px-3">
            {[...marqueeServices, ...marqueeServices].map((service, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white px-8 py-4 rounded-full shadow-sm border border-brand-200 shrink-0 hover:-translate-y-1 transition-transform cursor-pointer">
                <div className={`w-3 h-3 rounded-full ${service.color}`} />
                <span className="font-semibold text-navy-900 text-lg">{service.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Row 2 (Reverse direction if wanted, or just offset) */}
        <div className="relative flex overflow-x-hidden" dir="rtl">
          <div className="animate-marquee gap-6 py-2 px-3">
            {[...marqueeServices, ...marqueeServices].reverse().map((service, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white px-8 py-4 rounded-full shadow-sm border border-brand-200 shrink-0 hover:-translate-y-1 transition-transform cursor-pointer" dir="ltr">
                <div className={`w-3 h-3 rounded-full ${service.color === 'bg-vetic-green' ? 'bg-vetic-pink' : service.color}`} />
                <span className="font-semibold text-navy-900 text-lg">{service.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ OUR AMAZING TEAM ═══════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-brand-100/50 rounded-[40px] p-8 md:p-12 lg:p-16 border border-brand-200/50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

              {/* Left text */}
              <div className="lg:col-span-4 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-sm font-semibold text-navy-800 mb-6">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  Pet Grooming Θεσσαλονίκη
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy-900 tracking-tight leading-[1.1] mb-10">
                  Η έμπειρη <span className="wavy-underline">ομάδα</span> μας
                </h2>
                <div>
                  <Link href="/about" className="inline-flex items-center bg-navy-900 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-navy-800 transition-colors">
                    Γνωρίστε μας
                  </Link>
                </div>
              </div>

              {/* Right Images Squircles */}
              <div className="lg:col-span-8 flex justify-center items-center">

                {/* Team member 1 */}
                <div className="relative w-full max-w-md h-[450px] squircle overflow-hidden bg-vetic-blue group shadow-xl">
                  <Image
                    src="/images/stella.webp"
                    alt="Στέλλα - Head Groomer Musky Paws"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Floating info card */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white rounded-3xl p-5 flex items-center justify-between shadow-xl">
                    <div>
                      <h3 className="font-bold text-navy-900 text-xl">Στέλλα</h3>
                      <p className="text-navy-800/60 text-sm font-medium">Head Groomer</p>
                    </div>
                    <Link href="/booking" className="w-12 h-12 rounded-full bg-vetic-pink flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-24 md:py-32 bg-brand-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-navy-800 mb-8">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-navy-900 tracking-tight leading-[1.15]">
            Τι λένε οι χαρούμενοι<br />
            <span className="wavy-underline">ιδιοκτήτες</span>
          </h2>
        </div>

        {/* Scrolling Testimonial Cards */}
        <div className="relative">
          <div className="animate-marquee">
            {[
              {
                quote: "Η Στέλλα είναι καταπληκτική! Ο Μπρούνο μας γυρνάει πάντα σαν καινούργιος — μυρωδάτος και πανέμορφος. Δεν αλλάζουμε groomer με τίποτα!",
                name: "Μαρία Κ.",
                location: "Περαία",
                img: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200&h=200"
              },
              {
                quote: "Πρώτο κούρεμα για τον Τζάκι μας και η εμπειρία ήταν εξαιρετική. Ήπιος χειρισμός, χωρίς στρες. Τον αγαπήσαμε ακόμα πιο πολύ μετά!",
                name: "Γιώργος Π.",
                location: "Τρίλοφος",
                img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=200&h=200"
              },
              {
                quote: "Online κράτηση σε 2 λεπτά, τέλεια εξυπηρέτηση και η Λούλα μας βγήκε σαν μοντέλο! Συστήνω ανεπιφύλακτα σε όλους τους φίλους μου.",
                name: "Ελένη Σ.",
                location: "Καλαμαριά",
                img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=200&h=200"
              },
              {
                quote: "Φέρνω τον Ρέξ εδώ και 2 χρόνια. Πάντα πεντακάθαρος, με τα νύχια του κομμένα και τα αυτάκια του καθαρά. Η καλύτερη επιλογή στη Θεσσαλονίκη!",
                name: "Δημήτρης Α.",
                location: "Αγία Τριάδα",
                img: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80&w=200&h=200"
              },
              {
                quote: "Η μικρή μας Κανέλα φοβόταν πολύ, αλλά η Στέλλα την ηρέμησε αμέσως. Τώρα χαίρεται κάθε φορά που πάμε! Επαγγελματισμός και αγάπη.",
                name: "Κατερίνα Μ.",
                location: "Μηχανιώνα",
                img: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=200&h=200"
              },
              {
                quote: "Deshedding στον Τόμπυ μας και δεν πιστεύαμε πόση τρίχα έφυγε! Το σπίτι μας είναι πλέον καθαρότερο. Ευχαριστούμε Musky Paws!",
                name: "Νίκος Β.",
                location: "Περαία",
                img: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&q=80&w=200&h=200"
              },
            ].map((t, i) => (
              <div key={i} className="w-[500px] shrink-0 mx-4">
                <div className="bg-white rounded-[28px] p-8 shadow-sm h-full flex flex-col">
                  {/* Top row: Photo + Quote */}
                  <div className="flex items-start gap-5 mb-6">
                    {/* Dog Photo */}
                    <div className="relative shrink-0">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-brand-200">
                        <Image src={t.img} alt={t.name} fill className="object-cover" />
                      </div>
                      {/* Pink quote SVG bubble */}
                      <div className="absolute -top-2 -right-3 w-9 h-9 bg-vetic-pink rounded-full flex items-center justify-center shadow-md">
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.4 0H0V5.6C0 8.8 1.6 11.2 4.8 12L5.6 10.4C3.6 9.6 2.8 8 2.8 6.4H6.4V0ZM16 0H9.6V5.6C9.6 8.8 11.2 11.2 14.4 12L15.2 10.4C13.2 9.6 12.4 8 12.4 6.4H16V0Z" fill="white" />
                        </svg>
                      </div>
                    </div>
                    {/* Quote text */}
                    <p className="text-[16px] leading-[1.7] text-navy-900/75 flex-1 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  {/* Bottom: Name + Location */}
                  <div className="mt-auto">
                    <p className="font-bold text-navy-900 text-base">{t.name}</p>
                    <p className="text-navy-900/40 text-sm mt-0.5">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {[
              {
                quote: "Η Στέλλα είναι καταπληκτική! Ο Μπρούνο μας γυρνάει πάντα σαν καινούργιος — μυρωδάτος και πανέμορφος. Δεν αλλάζουμε groomer με τίποτα!",
                name: "Μαρία Κ.",
                location: "Περαία",
                img: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200&h=200"
              },
              {
                quote: "Πρώτο κούρεμα για τον Τζάκι μας και η εμπειρία ήταν εξαιρετική. Ήπιος χειρισμός, χωρίς στρες. Τον αγαπήσαμε ακόμα πιο πολύ μετά!",
                name: "Γιώργος Π.",
                location: "Τρίλοφος",
                img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=200&h=200"
              },
              {
                quote: "Online κράτηση σε 2 λεπτά, τέλεια εξυπηρέτηση και η Λούλα μας βγήκε σαν μοντέλο! Συστήνω ανεπιφύλακτα σε όλους τους φίλους μου.",
                name: "Ελένη Σ.",
                location: "Καλαμαριά",
                img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=200&h=200"
              },
              {
                quote: "Φέρνω τον Ρέξ εδώ και 2 χρόνια. Πάντα πεντακάθαρος, με τα νύχια του κομμένα και τα αυτάκια του καθαρά. Η καλύτερη επιλογή στη Θεσσαλονίκη!",
                name: "Δημήτρης Α.",
                location: "Αγία Τριάδα",
                img: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80&w=200&h=200"
              },
              {
                quote: "Η μικρή μας Κανέλα φοβόταν πολύ, αλλά η Στέλλα την ηρέμησε αμέσως. Τώρα χαίρεται κάθε φορά που πάμε! Επαγγελματισμός και αγάπη.",
                name: "Κατερίνα Μ.",
                location: "Μηχανιώνα",
                img: "https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=200&h=200"
              },
              {
                quote: "Deshedding στον Τόμπυ μας και δεν πιστεύαμε πόση τρίχα έφυγε! Το σπίτι μας είναι πλέον καθαρότερο. Ευχαριστούμε Musky Paws!",
                name: "Νίκος Β.",
                location: "Περαία",
                img: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&q=80&w=200&h=200"
              },
            ].map((t, i) => (
              <div key={`dup-${i}`} className="w-[500px] shrink-0 mx-4">
                <div className="bg-white rounded-[28px] p-8 shadow-sm h-full flex flex-col">
                  <div className="flex items-start gap-5 mb-6">
                    <div className="relative shrink-0">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-brand-200">
                        <Image src={t.img} alt={t.name} fill className="object-cover" />
                      </div>
                      <div className="absolute -top-2 -right-3 w-9 h-9 bg-vetic-pink rounded-full flex items-center justify-center shadow-md">
                        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.4 0H0V5.6C0 8.8 1.6 11.2 4.8 12L5.6 10.4C3.6 9.6 2.8 8 2.8 6.4H6.4V0ZM16 0H9.6V5.6C9.6 8.8 11.2 11.2 14.4 12L15.2 10.4C13.2 9.6 12.4 8 12.4 6.4H16V0Z" fill="white" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-[16px] leading-[1.7] text-navy-900/75 flex-1 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  <div className="mt-auto">
                    <p className="font-bold text-navy-900 text-base">{t.name}</p>
                    <p className="text-navy-900/40 text-sm mt-0.5">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRE-FOOTER ANIMAL GRID CTA ═══════════════ */}
      <section className="py-24 bg-brand-50 overflow-hidden">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-14">

            {/* Left Images (Hidden on mobile) */}
            <div className="hidden sm:flex gap-6 lg:w-[35%] justify-center lg:justify-end">
              <div className="relative w-48 md:w-56 lg:w-64 xl:w-72 aspect-[10/16] rounded-[40px] overflow-hidden bg-[#e0ccff] shadow-md hover:-translate-y-2 transition-transform duration-500">
                <Image src="/images/footer-cta/pet1.webp" alt="Dog placeholder" fill className="object-cover" />
              </div>
              <div className="relative w-48 md:w-56 lg:w-64 xl:w-72 aspect-[10/16] rounded-[40px] overflow-hidden bg-[#b3e5fc] shadow-md hover:-translate-y-2 transition-transform duration-500 md:mt-16 lg:mt-0">
                <Image src="/images/footer-cta/pet2.webp" alt="Turtle placeholder" fill className="object-cover" />
              </div>
            </div>

            {/* Center Content */}
            <div className="flex flex-col items-center justify-center text-center py-12 lg:w-[30%] shrink-0">
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-navy-900 tracking-tight leading-[1.1] mb-10">
                Because your<br />pets deserve the<br /><span className="relative inline-block z-10 font-black mt-2">
                  best, always
                  <svg className="absolute -bottom-3 left-0 w-full z-[-1]" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0,10 Q25,20 50,10 T100,10" fill="none" stroke="#ffb8d8" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                </span>
              </h2>

              <Link href="/booking" className="inline-flex items-center bg-navy-900 rounded-full pl-8 pr-2 py-2 group shadow-xl hover:-translate-y-1 transition-transform">
                <span className="text-white font-bold mr-6 text-xl tracking-wide">Contact us</span>
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-vetic-pink rounded-full flex items-center justify-center shrink-0 relative">
                  <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vetic-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-vetic-green border-2 border-white"></span>
                  </span>
                  <PawPrint className="w-6 h-6 lg:w-7 lg:h-7 text-navy-900 fill-navy-900" />
                </div>
              </Link>
            </div>

            {/* Right Images (Hidden on mobile) */}
            <div className="hidden md:flex gap-6 lg:w-[35%] justify-center lg:justify-start">
              <div className="relative w-48 md:w-56 lg:w-64 xl:w-72 aspect-[10/16] rounded-[40px] overflow-hidden bg-[#ffe600] shadow-md hover:-translate-y-2 transition-transform duration-500 lg:mt-0">
                <Image src="/images/footer-cta/pet3.webp" alt="Golden Retriever placeholder" fill className="object-cover" />
              </div>
              <div className="relative w-48 md:w-56 lg:w-64 xl:w-72 aspect-[10/16] rounded-[40px] overflow-hidden bg-[#e0ccff] shadow-md hover:-translate-y-2 transition-transform duration-500 md:mt-16 lg:mt-0">
                <Image src="/images/footer-cta/pet4.webp" alt="Rabbit placeholder" fill className="object-cover" />
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
