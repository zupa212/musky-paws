import { format, parseISO } from 'date-fns'
import { el } from 'date-fns/locale'
import { createAdminClient } from './supabase/server'

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BUSINESS_SMS = process.env.BUSINESS_NOTIFY_SMS
const BUSINESS_EMAIL = process.env.BUSINESS_NOTIFY_EMAIL

interface BookingData {
    id: string
    start_at: string
    pet_type: string
    breed: string | null
    services?: { name: string, duration_min: number, price_from: number } | null
}

interface CustomerData {
    name: string
    phone: string
    phone_e164: string | null
    email: string | null
}

/** Helper to format date in Greek */
const formatDateTime = (dateString: string) => {
    try {
        const d = parseISO(dateString)
        return format(d, "EEEE, dd MMMM yyyy 'στις' HH:mm", { locale: el })
    } catch {
        return dateString
    }
}

async function sendBrevoEmail(toEmail: string, toName: string, subject: string, htmlContent: string) {
    if (!BREVO_API_KEY) return;

    // Fallback if not set in .env
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'no-reply@muskypaws.gr';
    const senderName = process.env.BREVO_SENDER_NAME || 'Musky Paws';

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { email: senderEmail, name: senderName },
                to: [{ email: toEmail, name: toName }],
                subject: subject,
                htmlContent: htmlContent
            })
        });

        if (!response.ok) {
            console.error('Brevo Email Error:', await response.text());
        }
    } catch (e) {
        console.error('Brevo Email Catch:', e);
    }
}

async function sendBrevoSMS(toPhoneE164: string, content: string) {
    if (!BREVO_API_KEY) return;

    // Sender must be alphanumeric and up to 11 characters
    const senderSMS = process.env.BREVO_SMS_SENDER || 'MuskyPaws';

    try {
        const response = await fetch('https://api.brevo.com/v3/transactionalSMS/sms', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                type: 'transactional',
                unicodeEnabled: true,
                sender: senderSMS,
                recipient: toPhoneE164,
                content: content
            })
        });

        if (!response.ok) {
            console.error('Brevo SMS Error:', await response.text());
        }
    } catch (e) {
        console.error('Brevo SMS Catch:', e);
    }
}

/**
 * 1. Booking Received (Pending)
 * Sent when customer finishes the online form.
 */
export async function sendBookingReceivedNotification(booking: BookingData, customer: CustomerData) {
    const timeStr = formatDateTime(booking.start_at)

    // --- SMS to Customer ---
    if (customer.phone_e164) {
        await sendBrevoSMS(
            customer.phone_e164,
            `Musky Paws 🐾 Το ραντεβού σας για τις ${timeStr} κατοχυρώθηκε επιτυχώς! Ανυπομονούμε να σας δούμε.`
        );
    }

    // --- Email to Customer ---
    if (customer.email) {
        await sendBrevoEmail(
            customer.email,
            customer.name,
            'Το ραντεβού σας κατοχυρώθηκε επιτυχώς! 🐾',
            `
                <h2>Γεια σας ${customer.name},</h2>
                <p>Το ραντεβού σας στο Musky Paws έχει κατοχυρωθεί επιτυχώς και καταχωρήθηκε στο πρόγραμμά μας.</p>
                <p><strong>Υπηρεσία:</strong> ${booking.services?.name || 'Grooming'}<br/>
                <strong>Ημερομηνία & Ώρα:</strong> ${timeStr}</p>
                <p>Σας περιμένουμε στο κατάστημά μας. Αν υπάρχει κάποια αλλαγή, παρακαλώ επικοινωνήστε μαζί μας.</p>
                <br/><p>Με εκτίμηση,<br/>Η ομάδα του Musky Paws 🐶</p>
            `
        );
    }

    // --- Alert Admin ---
    await sendAdminNewBookingAlert(booking, customer)
}

/**
 * 2. Booking Confirmed
 * Sent when Admin clicks "Confirm" in the dashboard.
 */
export async function sendBookingConfirmedNotification(booking: BookingData, customer: CustomerData) {
    const timeStr = formatDateTime(booking.start_at)

    if (customer.phone_e164) {
        await sendBrevoSMS(
            customer.phone_e164,
            `Musky Paws ✅ Το ραντεβού σας ΕΠΙΒΕΒΑΙΩΘΗΚΕ για τις ${timeStr}. Σας περιμένουμε!`
        );
    }

    if (customer.email) {
        await sendBrevoEmail(
            customer.email,
            customer.name,
            'Το ραντεβού σας επιβεβαιώθηκε! ✅🐾',
            `
                <h2>Γεια σας ${customer.name},</h2>
                <p>Το ραντεβού σας στο Musky Paws επιβεβαιώθηκε με επιτυχία!</p>
                <p><strong>Υπηρεσία:</strong> ${booking.services?.name || 'Grooming'}<br/>
                <strong>Ημερομηνία & Ώρα:</strong> ${timeStr}</p>
                <p>Σας περιμένουμε! Αν χρειαστεί να ακυρώσετε, παρακαλώ επικοινωνήστε μαζί μας εγκαίρως.</p>
                <br/><p>Με εκτίμηση,<br/>Η ομάδα του Musky Paws 🐶</p>
            `
        );
    }
}

/**
 * 3. Alert to Admin (Email or SMS)
 */
export async function sendAdminNewBookingAlert(booking: BookingData, customer: CustomerData) {
    const timeStr = formatDateTime(booking.start_at)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3020'

    if (BUSINESS_EMAIL) {
        await sendBrevoEmail(
            BUSINESS_EMAIL,
            'Musky Paws Admin',
            `🔔 Νέα Κράτηση (Επιβεβαιωμένη): ${customer.name}`,
            `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; background: #fafaf8; border-radius: 16px; overflow: hidden; border: 1px solid #e5e3de;">
                    <div style="background: #0F172A; padding: 20px 24px; text-align: center;">
                        <span style="font-size: 24px;">🐾</span>
                        <h2 style="color: white; margin: 8px 0 0 0; font-size: 18px;">Νέο Ραντεβού!</h2>
                    </div>
                    <div style="padding: 24px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #8b8680; font-size: 13px;">Πελάτης</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #0F172A; text-align: right; font-size: 14px;">${customer.name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #8b8680; font-size: 13px;">Τηλέφωνο</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #0F172A; text-align: right; font-size: 14px;">${customer.phone}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #8b8680; font-size: 13px;">Κατοικίδιο</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #0F172A; text-align: right; font-size: 14px;">${booking.breed || booking.pet_type}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #8b8680; font-size: 13px;">Υπηρεσία</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #0F172A; text-align: right; font-size: 14px;">${booking.services?.name || 'Grooming'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #8b8680; font-size: 13px;">Ζητούμενη Ώρα</td>
                                <td style="padding: 8px 0; font-weight: bold; color: #0F172A; text-align: right; font-size: 14px;">${timeStr}</td>
                            </tr>
                        </table>
                        <div style="margin-top: 20px; text-align: center;">
                            <a href="${siteUrl}/admin/bookings" style="display: inline-block; padding: 12px 28px; background-color: #0F172A; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px;">Μετάβαση στο Admin Panel →</a>
                        </div>
                    </div>
                </div>
            `
        );
    }

    if (BUSINESS_SMS) {
        await sendBrevoSMS(
            BUSINESS_SMS,
            `MuskyPaws Alert 🔔 Νέο ραντεβού: ${customer.name} - ${timeStr}. Δείτε το στο Admin Panel.`
        );
    }
}

/**
 * 4. Google Review Request
 */
export async function sendReviewRequestNotification(customer: CustomerData) {
    const googleMapsReviewLink = "https://g.page/r/YOUR_GOOGLE_REVIEW_ID/review" // Placeholder

    // --- SMS ---
    if (customer.phone_e164) {
        await sendBrevoSMS(
            customer.phone_e164,
            `Musky Paws 🐾 Ευχαριστούμε που μας προτιμήσατε! Πώς σας φάνηκε η εμπειρία σας; Αν μείνατε ευχαριστημένοι βοηθήστε μας με μια κριτική στο Google: ${googleMapsReviewLink}`
        );
    }

    // --- Email ---
    if (customer.email) {
        await sendBrevoEmail(
            customer.email,
            customer.name,
            'Πώς σας φάνηκε η εμπειρία σας στο Musky Paws; 🐾',
            `
                <h2>Γεια σας ${customer.name},</h2>
                <p>Ευχαριστούμε πολύ για την προτίμησή σας στο Musky Paws!</p>
                <p>Θα θέλαμε πολύ να μάθουμε την άποψή σας. Αν μείνατε ικανοποιημένοι από την περιποίηση, θα σήμαινε πολλά για εμάς αν αφιερώνατε ένα λεπτό για μια κριτική στο Google!</p>
                <br/>
                <a href="${googleMapsReviewLink}" style="padding: 10px 20px; background-color: #F97316; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Αξιολόγηση στο Google ⭐️</a>
                <br/><p>Με εκτίμηση,<br/>Η ομάδα του Musky Paws 🐶</p>
            `
        );
    }
}

/**
 * 5. Retention Reminder
 */
export async function sendRetentionReminder(customer: CustomerData, petName?: string) {
    const bookingLink = "https://muskypaws.gr/booking"

    // --- SMS ---
    if (customer.phone_e164) {
        await sendBrevoSMS(
            customer.phone_e164,
            `Musky Paws 🐾 Γεια σας! Έχει περάσει καιρός από την τελευταία επίσκεψη του ${petName || 'κατοικιδίου'} σας. Μήπως ήρθε η ώρα για ένα φρεσκάρισμα; Κλείστε άμεσα ραντεβού: ${bookingLink}`
        );
    }

    // --- Email ---
    if (customer.email) {
        await sendBrevoEmail(
            customer.email,
            customer.name,
            'Μήπως ήρθε η ώρα για ένα φρεσκάρισμα; 🐾🛁',
            `
                <h2>Γεια σας ${customer.name},</h2>
                <p>Ελπίζουμε εσείς και ο ${petName || 'τετράποδος φίλος σας'} να είστε καλά!</p>
                <p>Παρατηρήσαμε ότι έχει περάσει καιρός από την τελευταία σας επίσκεψη. Η τακτική περιποίηση είναι σημαντική για την υγεία και την ευεξία του κατοικιδίου σας.</p>
                <p>Κλείστε το επόμενο ραντεβού σας εύκολα και γρήγορα!</p>
                <br/>
                <a href="${bookingLink}" style="padding: 10px 20px; background-color: #0F172A; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Κλείσε Ραντεβού 🗓️</a>
                <br/><p>Με εκτίμηση,<br/>Η ομάδα του Musky Paws 🐶</p>
            `
        );
    }
}

/**
 * 6. Outbox Processor
 */
export async function processNotificationOutbox() {
    const supabase = await createAdminClient()
    const now = new Date().toISOString()

    // Fetch pending notifications
    const { data: pending, error } = await supabase
        .from('notification_outbox')
        .select(`
            id, booking_id, channel, to, template, payload,
            bookings(id, review_request_sent, retention_reminder_sent, customers(name, email, phone_e164, phone))
        `)
        .lte('run_at', now)
        .order('run_at', { ascending: true })
        .limit(20)

    if (error || !pending) return { processed: 0 }

    let processedCount = 0
    for (const item of pending) {
        const booking = item.bookings as any
        if (!booking) continue

        const customer: CustomerData = {
            name: booking.customers.name,
            phone: booking.customers.phone,
            phone_e164: booking.customers.phone_e164,
            email: booking.customers.email
        }

        try {
            if (item.template === 'review_request') {
                await sendReviewRequestNotification(customer)
                await supabase.from('bookings').update({ review_request_sent: true }).eq('id', item.booking_id)
            } else if (item.template === 'retention_reminder') {
                await sendRetentionReminder(customer, item.payload?.pet_name)
                await supabase.from('bookings').update({ retention_reminder_sent: true }).eq('id', item.booking_id)
            }

            // Delete from outbox once processed
            await supabase.from('notification_outbox').delete().eq('id', item.id)
            processedCount++
        } catch (e) {
            console.error(`Error processing notification ${item.id}:`, e)
        }
    }

    return { processed: processedCount }
}
