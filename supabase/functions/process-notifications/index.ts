import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
const TWILIO_FROM_NUMBER = Deno.env.get('TWILIO_FROM_NUMBER')

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  // Use a secret to prevent unauthorized execution (e.g., via pg_cron HTTP request)
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${Deno.env.get('CRON_SECRET')}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    // 1. Fetch pending notifications that are ready to run
    const { data: pendingNotifications, error: fetchError } = await supabase
      .from('notification_outbox')
      .select('*')
      .eq('status', 'pending')
      .lte('run_at', new Date().toISOString())
      .lt('attempts', 3) // Max retries
      .order('created_at', { ascending: true })
      .limit(50); // Process in batches

    if (fetchError) throw fetchError;
    if (!pendingNotifications || pendingNotifications.length === 0) {
      return new Response(JSON.stringify({ message: "No pending notifications." }), { status: 200 })
    }

    const updates = []

    // 2. Process each notification
    for (const notification of pendingNotifications) {
      // Mark as processing
      await supabase.from('notification_outbox').update({ status: 'processing', attempts: notification.attempts + 1 }).eq('id', notification.id)

      try {
        let providerId = null;

        if (notification.channel === 'email') {
          // SEND EMAIL VIA RESEND
          if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

          let subject = "To ραντεβού σας στο Musky Paws";
          let html = `Γεια σας ${notification.payload.name},<br><br>Ευχαριστούμε για την προτίμηση...`;

          if (notification.template === 'booking_confirmation_pending') {
            subject = "Λάβαμε το αίτημα σας - Musky Paws";
            html = `Γεια σας ${notification.payload.name},<br><br>Λάβαμε το αίτημα σας για <strong>${notification.payload.serviceName}</strong> στις ${notification.payload.date} ${notification.payload.time}. Θα επικοινωνήσουμε σύντομα μαζί σας για επιβεβαίωση.`;
          } else if (notification.template === 'booking_confirmed') {
            subject = "Επιβεβαίωση Ραντεβού - Musky Paws";
            html = `Το ραντεβού σας επιβεβαιώθηκε για <strong>${notification.payload.date} στις ${notification.payload.time}</strong>! Ανυπομονούμε να σας δούμε.`;
          } else if (notification.template === 'booking_canceled') {
            subject = "Ακύρωση Ραντεβού - Musky Paws";
            html = `Το ραντεβού σας στις ${notification.payload.date} ακυρώθηκε.`;
          }

          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'Musky Paws <hello@muskypaws.gr>', // Must be a verified domain in Resend
              to: notification.to,
              subject: subject,
              html: html
            })
          });

          const resData = await res.json();
          if (!res.ok) throw new Error(resData.message || "Resend API Error");
          providerId = resData.id;

        } else if (notification.channel === 'sms') {
          // SEND SMS VIA TWILIO
          if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) throw new Error("Twilio not configured");

          let body = `Musky Paws: Ευχαριστούμε για το ραντεβού (${notification.payload.date}). Θα σας καλέσουμε σύντομα.`;

          if (notification.template === 'booking_confirmed_sms') {
            body = `Musky Paws: Το ραντεβού σας επιβεβαιώθηκε! ${notification.payload.date} ${notification.payload.time}`;
          }

          const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
          const params = new URLSearchParams({
            To: notification.to.startsWith('+') ? notification.to : `+30${notification.to.replace(/\D/g, '')}`, // Default to Greece +30
            From: TWILIO_FROM_NUMBER,
            Body: body
          });

          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
          });

          const resData = await res.json();
          if (!res.ok) throw new Error(resData.message || "Twilio API Error");
          providerId = resData.sid;
        }

        // Success
        updates.push({
          id: notification.id,
          status: 'sent',
          provider_message_id: providerId,
          last_error: null
        });

      } catch (err: any) {
        console.error(`Failed to send notification ${notification.id}`, err);
        updates.push({
          id: notification.id,
          status: notification.attempts >= 2 ? 'failed' : 'pending', // Give up after 3 attempts (0, 1, 2)
          last_error: err.message
        });
      }
    }

    // 3. Batch update outcomes
    for (const update of updates) {
      await supabase.from('notification_outbox').update(update).eq('id', update.id);
    }

    return new Response(JSON.stringify({ message: `Processed ${updates.length} notifications.` }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })

  } catch (error: any) {
    console.error("Critical Function Error", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    })
  }
})
