import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Heart, Sparkles, Clock, Star, MapPin, ChevronDown, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-brand-950 text-white py-24 sm:py-32 lg:py-40">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80"
            alt="Dog grooming background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/80 to-transparent"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center sm:text-left h-full flex flex-col justify-center">
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-brand-50 mb-6 drop-shadow-md">
            Premium Περιποίηση Σκύλων στην <span className="text-accent-400">Περαία</span>
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl text-brand-200 mb-10 leading-relaxed font-medium">
            Στο Musky Paws παρέχουμε κορυφαίες υπηρεσίες grooming και επιλεγμένα προϊόντα. Εγγυόμαστε ένα καθαρό, ασφαλές και ήρεμο περιβάλλον για τον καλύτερο σας φίλο.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-start">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center rounded-full bg-accent-500 text-brand-950 px-8 py-3.5 text-base font-bold shadow-sm transition-transform hover:scale-105 hover:bg-accent-400"
            >
              Κλείσε Ραντεβού
            </Link>
            <a
              href="tel:+306948965371"
              className="inline-flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3.5 text-base font-semibold shadow-sm transition-colors hover:bg-white/20"
            >
              Κάλεσε τώρα
            </a>
          </div>
        </div>
      </section>

      {/* Trust / Why Us Section */}
      <section className="py-20 bg-background text-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Γιατί Musky Paws;</h2>
            <p className="text-lg text-brand-600 dark:text-brand-400">
              Η εμπειρία και η αγάπη μας για τα ζώα εγγυώνται το τέλειο αποτέλεσμα, με κύριο γνώμονα την ασφάλεια και την ευεξία τους.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-brand-50 dark:bg-brand-900/50">
              <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-800 flex items-center justify-center mb-4 text-brand-800 dark:text-brand-200">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Κορυφαία Υγιεινή</h3>
              <p className="text-brand-600 dark:text-brand-400 text-sm">Πλήρης αποστείρωση εργαλείων και καθαριότητα του χώρου μετά από κάθε πελάτη.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-brand-50 dark:bg-brand-900/50">
              <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-800 flex items-center justify-center mb-4 text-brand-800 dark:text-brand-200">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Ήπιος Χειρισμός</h3>
              <p className="text-brand-600 dark:text-brand-400 text-sm">Χωρίς καταστολή, με υπομονή και σεβασμό στην ψυχολογία του ζώου.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-brand-50 dark:bg-brand-900/50">
              <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-800 flex items-center justify-center mb-4 text-brand-800 dark:text-brand-200">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Εξειδίκευση</h3>
              <p className="text-brand-600 dark:text-brand-400 text-sm">Πιστοποιημένος Groomer με γνώση των προτύπων κάθε φυλής.</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-brand-50 dark:bg-brand-900/50">
              <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-800 flex items-center justify-center mb-4 text-brand-800 dark:text-brand-200">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Χωρίς Αναμονή</h3>
              <p className="text-brand-600 dark:text-brand-400 text-sm">Σέβομαστε τον χρόνο σας και η παραλαβή γίνεται στην ώρα της.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-brand-50 dark:bg-brand-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Οι Υπηρεσίες μας</h2>
              <p className="text-lg text-brand-600 dark:text-brand-400">Επιλέξτε το πακέτο που ταιριάζει στις ανάγκες του δικού σας σκύλου, σεβόμενοι πάντα τον τύπο τριχώματος.</p>
            </div>
            <Link href="/services" className="inline-flex items-center gap-2 font-semibold text-brand-800 dark:text-brand-200 hover:text-accent-500 transition-colors">
              Όλες οι Υπηρεσίες <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Πλήρης Καλλωπισμός", desc: "Μπάνιο, κούρεμα φυλής ή δικής σας επιλογής, καθαρισμός αυτιών & κόψιμο νυχιών.", link: "/services/full-grooming", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80" },
              { title: "Μπάνιο & Βούρτσισμα", desc: "Εξειδικευμένα σαμπουάν, βαθύς καθαρισμός και βούρτσισμα για αφαίρεση νεκρής τρίχας.", link: "/services/bath-brush", img: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?auto=format&fit=crop&q=80" },
              { title: "Περιποίηση Κουταβιών", desc: "Μεγάλη προσοχή στη θετική ενίσχυση για την πρώτη επαφή του κουταβιού με το grooming.", link: "/services/puppy-grooming", img: "https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&q=80" }
            ].map((service, idx) => (
              <Link key={idx} href={service.link} className="group relative overflow-hidden rounded-2xl bg-background border border-brand-200 dark:border-brand-800 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image src={service.img} alt={service.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-accent-500 transition-colors">{service.title}</h3>
                  <p className="text-brand-600 dark:text-brand-400 text-sm">{service.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After Teaser */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-12">Πριν & Μετά</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Placeholders for B/A */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                <Image src={`https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80`} alt="Before After Placeholder" fill className="object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link href="/gallery" className="text-white font-semibold flex items-center gap-2">Δείτε το Gallery <ArrowRight className="w-4 h-4" /></Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/gallery" className="inline-flex items-center justify-center rounded-full border border-brand-300 dark:border-brand-700 px-8 py-3 font-medium hover:bg-brand-50 dark:hover:bg-brand-900 transition-colors">
              Περισσότερες Μεταμορφώσεις
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Placeholder */}
      <section className="py-20 bg-brand-950 text-brand-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-16 text-white">Τι λένε για εμάς</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "Ο Μάξ είναι δύσκολος στο κούρεμα, αλλά στο Musky Paws του φέρθηκαν με τόση υπομονή! Το αποτέλεσμα εξαιρετικό.",
                author: "Μαρία Παπαδοπούλου",
                dog: "Poodle"
              },
              {
                text: "Ο καθαρότερος χώρος που έχω πάει τον σκύλο μου. Η ποιότητα της δουλειάς φαίνεται στη λεπτομέρεια.",
                author: "Γιώργος Αντωνίου",
                dog: "Golden Retriever"
              },
              {
                text: "Άψογη εξυπηρέτηση και το κουτάβι μου έφυγε χαρούμενο και μοσχομυριστό! Το προτείνω ανεπιφύλακτα.",
                author: "Ελένη Μ.",
                dog: "Maltese"
              }
            ].map((review, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-brand-900 border border-brand-800 relative">
                <div className="flex text-accent-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-lg leading-relaxed mb-6 font-medium">"{review.text}"</p>
                <div>
                  <p className="font-bold text-white">{review.author}</p>
                  <p className="text-brand-400 text-sm">{review.dog}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Map Teaser */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">Εύκολη Πρόσβαση στην Περαία</h2>
              <p className="text-lg text-brand-600 dark:text-brand-400 mb-8">
                Βρισκόμαστε στην καρδιά της Περαίας (Σόλωνος 28Β), εύκολα προσβάσιμοι από τους Νέους Επιβάτες, την Αγία Τριάδα και όλη την Ανατολική Θεσσαλονίκη.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 font-medium text-foreground"><CheckCircle2 className="w-5 h-5 text-accent-500" /> Σύγχρονος χώρος</li>
                <li className="flex items-center gap-3 font-medium text-foreground"><CheckCircle2 className="w-5 h-5 text-accent-500" /> Άνετο πάρκινγκ στην περιοχή</li>
                <li className="flex items-center gap-3 font-medium text-foreground"><CheckCircle2 className="w-5 h-5 text-accent-500" /> Κοντά στην αγορά</li>
              </ul>
              <a
                href="https://maps.google.com/?q=Solonos+28B,+Peraia,+Greece+57019"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-foreground text-background border border-foreground px-8 py-3.5 text-base font-semibold shadow-sm transition-colors hover:bg-brand-800"
              >
                <MapPin className="w-5 h-5 mr-no mb-no mr-2" />
                Οδηγίες MAPS
              </a>
            </div>
            <div className="rounded-2xl overflow-hidden h-[400px] border border-brand-200 dark:border-brand-800 shadow-lg relative bg-brand-100 flex items-center justify-center">
              {/* Google Map Embed Placeholder */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3032.091178!2d22.92345!3d40.50!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDMwJzAwLjAiTiAyMsKwNTUnMjQuNCJF!5e0!3m2!1sen!2sgr!4v1620000000000!5m2!1sen!2sgr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                title="Google Maps Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-brand-50 dark:bg-brand-950">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-12">Συχνές Ερωτήσεις</h2>
          <div className="space-y-4 text-left">
            {[
              { q: "Χρησιμοποιείτε ηρέμηση / νάρκωση στο κούρεμα;", a: "Απολύτως όχι. Στο Musky Paws δεν χρησιμοποιούμε ποτέ κατασταλτικά ή ηρεμιστικά. Λειτουργούμε με βάση την υπομονή, τον θετικό χειρισμό και τη δημιουργία κλίματος εμπιστοσύνης με τον σκύλο σας." },
              { q: "Κάνετε stripping;", a: "Ναι, προσφέρουμε εξειδικευμένες υπηρεσίες Hand Stripping για σκληρότριχες φυλές, πάντα ανάλογα με την κατάσταση του τριχώματος." },
              { q: "Πόσο διαρκεί ο καλλωπισμός;", a: "Ο χρόνος εξαρτάται από τη φυλή, το μέγεθος και την κατάσταση του τριχώματος, αλλά συνήθως διαρκεί από 1.5 έως 3 ώρες. Ενημερώνουμε πάντα για την παραλαβή 30 λεπτά πριν." },
              { q: "Κόβετε νύχια και καθαρίζετε αυτιά; Συμπεριλαμβάνονται στην τιμή;", a: "Ναι, το κόψιμο νυχιών και ο καθαρισμός αυτιών περιλαμβάνονται δωρεάν τόσο στην υπηρεσία πλήρους καλλωπισμού όσο και στο Μπάνιο & Βούρτσισμα." },
              { q: "Μπορώ να περιμένω μέσα στο κατάστημα όσο κουρεύεται ο σκύλος μου;", a: "Γενικά προτείνουμε να μην είστε παρόντες κατά τη διάρκεια της διαδικασίας, καθώς λειτουργεί αποσπασματικά για τον σκύλο, γεγονός που δυσκολεύει τον χειρισμό και αυξάνει τον κίνδυνο τραυματισμού." },
              { q: "Αναλαμβάνετε μεγαλόσωμα σκυλιά;", a: "Φυσικά. Οι εγκαταστάσεις μας είναι πλήρως εξοπλισμένες για να εξυπηρετήσουν με άνεση σκύλους όλων των μεγεθών." }
            ].map((faq, idx) => (
              <details key={idx} className="group border border-brand-200 dark:border-brand-800 bg-background rounded-lg">
                <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-lg marker:content-none">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-brand-600 dark:text-brand-400 text-base leading-relaxed">
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
