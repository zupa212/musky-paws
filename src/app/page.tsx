import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Heart, Sparkles, Clock, Star, MapPin, ChevronDown, CheckCircle2, ArrowRight, Scissors, Bath, Dog } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden bg-brand-50 pt-8 pb-0 sm:pt-12 lg:pt-16">
        {/* Decorative paw prints */}
        <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-paw-100 opacity-60 blur-sm" />
        <div className="absolute top-32 right-32 w-16 h-16 rounded-full bg-paw-200 opacity-40 blur-sm" />
        <div className="absolute bottom-20 left-10 w-20 h-20 rounded-full bg-paw-100 opacity-50 blur-sm" />

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: Text */}
            <div className="max-w-xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy-900 leading-[1.1] mb-6">
                Το Δεύτερο Σπίτι του <span className="text-accent-500">Σκύλου</span> σας
              </h1>
              <p className="text-lg sm:text-xl text-brand-600 mb-8 leading-relaxed max-w-lg">
                Ένα ζεστό, ασφαλές και ήρεμο περιβάλλον για τον καλύτερο σας φίλο. Premium grooming στην Περαία.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center rounded-full bg-navy-900 text-white px-8 py-4 text-base font-bold shadow-lg transition-all hover:bg-navy-800 hover:scale-105 hover:shadow-xl"
                >
                  Κλείσε Ραντεβού
                </Link>
                <a
                  href="tel:+306948965371"
                  className="inline-flex items-center justify-center rounded-full border-2 border-navy-900 text-navy-900 px-8 py-4 text-base font-semibold transition-colors hover:bg-navy-900 hover:text-white"
                >
                  Κάλεσε τώρα
                </a>
              </div>
            </div>

            {/* Right: Dog Image */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-[340px] h-[400px] sm:w-[420px] sm:h-[480px] lg:w-[500px] lg:h-[560px]">
                <Image
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800"
                  alt="Happy dog at Musky Paws grooming"
                  fill
                  className="object-cover object-top rounded-t-[40px] drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Service pills bar */}
        <div className="container mx-auto px-4 -mt-8 sm:-mt-12 relative z-10 pb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-brand-200 px-6 py-6 flex flex-wrap justify-center gap-8 sm:gap-12">
            {[
              { icon: '🛁', title: 'Μπάνιο', desc: 'Εξειδικευμένο μπάνιο & βούρτσισμα.' },
              { icon: '✂️', title: 'Grooming', desc: 'Κούρεμα φυλής & styling.' },
              { icon: '🐶', title: 'Κουτάβια', desc: 'Ήπιο πρώτο ραντεβού.' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 text-left min-w-[160px]">
                <span className="text-3xl">{s.icon}</span>
                <div>
                  <p className="font-bold text-navy-900 text-sm">{s.title}</p>
                  <p className="text-brand-500 text-xs">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PET CARE STANDARDS ═══════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-navy-900 mb-16">Τα Standards μας</h2>

          <div className="space-y-20">
            {/* Standard 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80">
                <div className="absolute inset-0 rounded-full bg-paw-100" />
                <Image
                  src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=600"
                  alt="Spacious play area"
                  fill
                  className="object-cover rounded-full p-3"
                />
              </div>
              <div className="max-w-lg">
                <h3 className="text-2xl font-bold text-navy-900 mb-4">Ήπιος Χειρισμός</h3>
                <p className="text-brand-600 text-base leading-relaxed">
                  Δεν χρησιμοποιούμε ποτέ κατασταλτικά ή νάρκωση. Κάθε σκύλος αντιμετωπίζεται με υπομονή, θετική ενίσχυση και σεβασμό στην ψυχολογία του. Η εμπιστοσύνη χτίζεται σε κάθε ραντεβού.
                </p>
              </div>
            </div>

            {/* Standard 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-lg order-2 lg:order-1">
                <h3 className="text-2xl font-bold text-navy-900 mb-4">Πλήρης Υγιεινή & Ασφάλεια</h3>
                <p className="text-brand-600 text-base leading-relaxed">
                  Πλήρης αποστείρωση εργαλείων και καθαρισμός χώρου μετά από κάθε πελάτη. Χρησιμοποιούμε premium, βιολογικά σαμπουάν χωρίς χημικά. Η υγεία του σκύλου σας είναι η πρώτη μας προτεραιότητα.
                </p>
              </div>
              <div className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80 order-1 lg:order-2">
                <div className="absolute inset-0 rounded-full bg-sage-100" />
                <Image
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600"
                  alt="Safe and clean environment"
                  fill
                  className="object-cover rounded-full p-3"
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center rounded-full bg-navy-900 text-white px-8 py-3.5 text-base font-bold shadow-lg transition-all hover:bg-navy-800 hover:scale-105"
            >
              Κλείσε Ραντεβού
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ WHY CHOOSE US GRID ═══════════════ */}
      <section className="py-20 bg-brand-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-navy-900 mb-4">Γιατί Musky Paws;</h2>
          <p className="text-center text-brand-600 max-w-2xl mx-auto mb-14 text-lg">
            Η εμπειρία και η αγάπη μας εγγυώνται το τέλειο αποτέλεσμα.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: '🛡️', title: 'Κορυφαία Υγιεινή', desc: 'Αποστείρωση εργαλείων μετά κάθε χρήση.' },
              { icon: '🏠', title: 'Σύγχρονος Χώρος', desc: 'Ήρεμο, καθαρό περιβάλλον φτιαγμένο για σκύλους.' },
              { icon: '✂️', title: 'Εξειδίκευση', desc: 'Πιστοποιημένος Groomer με γνώση κάθε φυλής.' },
              { icon: '🧴', title: 'Premium Προϊόντα', desc: 'Βιολογικά σαμπουάν χωρίς χημικούς ερεθισμούς.' },
              { icon: '🐕', title: 'Ήπιος Χειρισμός', desc: 'Χωρίς καταστολή, μόνο θετική ενίσχυση.' },
              { icon: '📍', title: 'Εύκολη Πρόσβαση', desc: 'Κεντρικά στην Περαία, άνετο πάρκινγκ.' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-white border border-brand-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <span className="text-4xl mb-4">{item.icon}</span>
                <h3 className="font-bold text-navy-900 text-base sm:text-lg mb-2">{item.title}</h3>
                <p className="text-brand-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SERVICES PREVIEW ═══════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-4">Οι Υπηρεσίες μας</h2>
              <p className="text-lg text-brand-600">Επιλέξτε το πακέτο που ταιριάζει στις ανάγκες του σκύλου σας.</p>
            </div>
            <Link href="/services" className="inline-flex items-center gap-2 font-semibold text-navy-900 hover:text-accent-500 transition-colors">
              Όλες οι Υπηρεσίες <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Πλήρης Καλλωπισμός", desc: "Μπάνιο, κούρεμα φυλής, καθαρισμός αυτιών & νύχια.", link: "/services/full-grooming", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80" },
              { title: "Μπάνιο & Βούρτσισμα", desc: "Premium σαμπουάν, βαθύς καθαρισμός και αφαίρεση νεκρής τρίχας.", link: "/services/bath-brush", img: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&q=80" },
              { title: "Περιποίηση Κουταβιών", desc: "Θετική πρώτη εμπειρία grooming για κουτάβια.", link: "/services/puppy-grooming", img: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&q=80" }
            ].map((service, idx) => (
              <Link key={idx} href={service.link} className="group relative overflow-hidden rounded-2xl bg-brand-50 border border-brand-200 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image src={service.img} alt={service.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-accent-500 transition-colors">{service.title}</h3>
                  <p className="text-brand-600 text-sm">{service.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="py-20 bg-navy-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-16">Τι Λένε για εμάς</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "Ο Μάξ είναι δύσκολος στο κούρεμα, αλλά στο Musky Paws του φέρθηκαν με τόση υπομονή! Εξαιρετικό αποτέλεσμα.", author: "Μαρία Π.", dog: "Poodle" },
              { text: "Ο καθαρότερος χώρος που έχω πάει τον σκύλο μου. Η ποιότητα φαίνεται στη λεπτομέρεια.", author: "Γιώργος Α.", dog: "Golden Retriever" },
              { text: "Άψογη εξυπηρέτηση! Το κουτάβι μου έφυγε χαρούμενο και μοσχομυριστό. Ανεπιφύλακτα!", author: "Ελένη Μ.", dog: "Maltese" }
            ].map((review, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="flex text-accent-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-lg leading-relaxed mb-6 font-medium text-white/90">&ldquo;{review.text}&rdquo;</p>
                <div>
                  <p className="font-bold text-white">{review.author}</p>
                  <p className="text-white/50 text-sm">{review.dog}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ LOCATION ═══════════════ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-6">Εύκολη Πρόσβαση στην Περαία</h2>
              <p className="text-lg text-brand-600 mb-8">
                Βρισκόμαστε στην καρδιά της Περαίας (Σόλωνος 28Β), εύκολα προσβάσιμοι από τους Νέους Επιβάτες, την Αγία Τριάδα και όλη την Ανατολική Θεσσαλονίκη.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 font-medium text-navy-900"><CheckCircle2 className="w-5 h-5 text-sage-400" /> Σύγχρονος χώρος</li>
                <li className="flex items-center gap-3 font-medium text-navy-900"><CheckCircle2 className="w-5 h-5 text-sage-400" /> Άνετο πάρκινγκ</li>
                <li className="flex items-center gap-3 font-medium text-navy-900"><CheckCircle2 className="w-5 h-5 text-sage-400" /> Κοντά στην αγορά</li>
              </ul>
              <a
                href="https://maps.google.com/?q=Solonos+28B,+Peraia,+Greece+57019"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-navy-900 text-white px-8 py-3.5 text-base font-semibold shadow-lg transition-all hover:bg-navy-800 hover:scale-105"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Οδηγίες MAPS
              </a>
            </div>
            <div className="rounded-2xl overflow-hidden h-[400px] border border-brand-200 shadow-lg relative bg-brand-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3032.091178!2d22.92345!3d40.50!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDMwJzAwLjAiTiAyMsKwNTUnMjQuNCJF!5e0!3m2!1sen!2sgr!4v1620000000000!5m2!1sen!2sgr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                title="Musky Paws Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="py-20 bg-brand-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 mb-12">Συχνές Ερωτήσεις</h2>
          <div className="space-y-4 text-left">
            {[
              { q: "Χρησιμοποιείτε ηρέμηση / νάρκωση;", a: "Απολύτως όχι. Λειτουργούμε με βάση την υπομονή, τον θετικό χειρισμό και τη δημιουργία εμπιστοσύνης με τον σκύλο σας." },
              { q: "Κάνετε stripping;", a: "Ναι, προσφέρουμε εξειδικευμένο Hand Stripping για σκληρότριχες φυλές, ανάλογα με την κατάσταση του τριχώματος." },
              { q: "Πόσο διαρκεί ο καλλωπισμός;", a: "Εξαρτάται από τη φυλή, το μέγεθος και το τρίχωμα. Συνήθως 1.5 – 3 ώρες. Ενημερώνουμε 30 λεπτά πριν την παραλαβή." },
              { q: "Νύχια & αυτιά συμπεριλαμβάνονται;", a: "Ναι, το κόψιμο νυχιών και ο καθαρισμός αυτιών περιλαμβάνονται δωρεάν σε κάθε ολοκληρωμένη υπηρεσία." },
              { q: "Μπορώ να περιμένω στο κατάστημα;", a: "Προτείνουμε να μην είστε παρόντες, καθώς δυσκολεύει τον χειρισμό και αυξάνει τον κίνδυνο τραυματισμού." },
              { q: "Μεγαλόσωμα σκυλιά;", a: "Φυσικά! Οι εγκαταστάσεις μας εξυπηρετούν σκύλους όλων των μεγεθών." }
            ].map((faq, idx) => (
              <details key={idx} className="group border border-brand-200 bg-white rounded-xl overflow-hidden">
                <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-navy-900 text-base sm:text-lg marker:content-none">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-brand-500 transition-transform group-open:rotate-180 shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 text-brand-600 text-base leading-relaxed">
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ BOTTOM CTA ═══════════════ */}
      <section className="py-16 bg-navy-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Κλείσε Ραντεβού Σήμερα!</h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8">
            Online κράτηση 24/7 ή κάλεσε τώρα για να μιλήσεις μαζί μας.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center rounded-full bg-accent-500 text-white px-8 py-4 text-base font-bold shadow-lg transition-all hover:bg-accent-400 hover:scale-105"
            >
              Κλείσε Ραντεβού
            </Link>
            <a
              href="tel:+306948965371"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/30 text-white px-8 py-4 text-base font-semibold transition-colors hover:bg-white/10"
            >
              📞 694 896 5371
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/50">
            <span className="flex items-center gap-1.5">✓ Χωρίς κρυφές χρεώσεις</span>
            <span className="flex items-center gap-1.5">✓ Ασφαλές περιβάλλον</span>
            <span className="flex items-center gap-1.5">✓ Εξυπηρέτηση 24/7</span>
          </div>
        </div>
      </section>
    </>
  );
}
