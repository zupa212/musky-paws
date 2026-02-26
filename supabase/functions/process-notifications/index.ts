// @ts-nocheck
// This file runs in Deno / Supabase Edge Functions environment
// TypeScript errors for Deno-specific APIs are expected and safe to ignore

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
const TWILIO_FROM_NUMBER = Deno.env.get('TWILIO_FROM_NUMBER')
const FROM_EMAIL = 'Musky Paws <hello@muskypaws.gr>'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// ─── Email Templates ────────────────────────────────────────────────────────

function emailTemplate(template: string, payload: any): { subject: string; html: string } {
  const { name, serviceName, date, time } = payload

  const base = (body: string) => `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:#1a1a2e;padding:24px 32px;display:flex;align-items:center;gap:12px;">
        <span style="font-size:24px;">🐾</span>
        <span style="color:#fff;font-size:20px;font-weight:bold;">Musky Paws</span>
      </div>
      <div style="padding:32px;">${body}</div>
      <div style="background:#f9fafb;padding:20px 32px;text-align:center;font-size:12px;color:#9ca3af;">
        Musky Paws Pet Grooming · Σόλωνος 28Β, Περαία 570 19<br/>
        <a href="tel:+306948965371" style="color:#6366f1;">+30 694 896 5371</a>
      </div>
    </div>`

  switch (template) {
    case 'booking_confirmation_pending':
      return {
        subject: '🐾 Λάβαμε το αίτημα σας – Musky Paws',
        html: base(`
          <h2 style="color:#1a1a2e;margin-top:0;">Γεια σας, ${name}!</h2>
          <p style="color:#4b5563;">Λάβαμε το αίτημα σας για ραντεβού. Θα επικοινωνήσουμε σύντομα για επιβεβαίωση.</p>
          <div style="background:#f3f4f6;border-radius:8px;padding:16px;margin:20px 0;">
            <p style="margin:4px 0;color:#374151;"><strong>📋 Υπηρεσία:</strong> ${serviceName}</p>
            <p style="margin:4px 0;color:#374151;"><strong>📅 Ημερομηνία:</strong> ${date}</p>
            <p style="margin:4px 0;color:#374151;"><strong>🕐 Ώρα:</strong> ${time}</p>
          </div>
          <p style="color:#6b7280;font-size:14px;">Χρειάζεστε άλλη ώρα; Καλέστε μας στο <a href="tel:+306948965371" style="color:#6366f1;">694 896 5371</a></p>
        `)
      }
    case 'booking_confirmed':
      return {
        subject: '✅ Επιβεβαίωση Ραντεβού – Musky Paws',
        html: base(`
          <h2 style="color:#1a1a2e;margin-top:0;">Το ραντεβού σας επιβεβαιώθηκε! 🎉</h2>
          <p style="color:#4b5563;">Γεια σας, <strong>${name}</strong>! Ανυπομονούμε να σας δούμε.</p>
          <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;margin:20px 0;">
            <p style="margin:4px 0;color:#166534;"><strong>📋 Υπηρεσία:</strong> ${serviceName}</p>
            <p style="margin:4px 0;color:#166534;"><strong>📅 Ημερομηνία:</strong> ${date}</p>
            <p style="margin:4px 0;color:#166534;"><strong>🕐 Ώρα:</strong> ${time}</p>
          </div>
          <p style="color:#6b7280;font-size:14px;">📍 Σόλωνος 28Β, Περαία · <a href="https://maps.google.com/?q=Solonos+28B,+Peraia+57019" style="color:#6366f1;">Οδηγίες</a></p>
        `)
      }
    case 'booking_canceled':
      return {
        subject: '❌ Ακύρωση Ραντεβού – Musky Paws',
        html: base(`
          <h2 style="color:#1a1a2e;margin-top:0;">Ακύρωση ραντεβού</h2>
          <p style="color:#4b5563;">Γεια σας, <strong>${name}</strong>. Το ραντεβού σας για <strong>${serviceName}</strong> στις <strong>${date} ${time}</strong> ακυρώθηκε.</p>
          <p style="color:#6b7280;">Για νέο ραντεβού επισκεφτείτε <a href="https://muskypaws.gr/booking" style="color:#6366f1;">muskypaws.gr/booking</a> ή καλέστε μας.</p>
        `)
      }
    case 'reminder_24h':
      return {
        subject: '⏰ Υπενθύμιση: Αύριο το ραντεβού σας – Musky Paws',
        html: base(`
          <h2 style="color:#1a1a2e;margin-top:0;">Υπενθύμιση ραντεβού 🐶</h2>
          <p style="color:#4b5563;">Γεια σας, <strong>${name}</strong>! Υπενθυμίζουμε ότι αύριο έχετε ραντεβού:</p>
          <div style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:20px 0;">
            <p style="margin:4px 0;color:#92400e;"><strong>📋 Υπηρεσία:</strong> ${serviceName}</p>
            <p style="margin:4px 0;color:#92400e;"><strong>📅 Ημερομηνία:</strong> ${date}</p>
            <p style="margin:4px 0;color:#92400e;"><strong>🕐 Ώρα:</strong> ${time}</p>
          </div>
          <p style="color:#6b7280;font-size:14px;">📍 Σόλωνος 28Β, Περαία · Χρειάζεστε ακύρωση; Καλέστε μας στο 694 896 5371</p>
        `)
      }
    default:
      return { subject: 'Ενημέρωση Ραντεβού – Musky Paws', html: base(`<p>Ενημέρωση για το ραντεβού σας.</p>`) }
  }
}

// ─── SMS Templates ───────────────────────────────────────────────────────────

function smsTemplate(template: string, payload: any): string {
  const { name, serviceName, date, time } = payload
  switch (template) {
    case 'booking_confirmation_pending_sms':
      return `Musky Paws: Λάβαμε το αίτημα σας για ${serviceName} (${date} ${time}). Θα επικοινωνήσουμε σύντομα. Πληρ: 694 896 5371`
    case 'booking_confirmed_sms':
      return `Musky Paws: ✅ Επιβεβαίωση! ${name}, σας περιμένουμε ${date} στις ${time} (${serviceName}). Σόλωνος 28Β, Περαία.`
    case 'booking_canceled_sms':
      return `Musky Paws: Το ραντεβού σας (${date} ${time}) ακυρώθηκε. Νέο ραντεβού: muskypaws.gr/booking`
    case 'reminder_2h_sms':
      return `Musky Paws ⏰: Υπενθύμιση! Σήμερα στις ${time} - ${serviceName}. Σόλωνος 28Β, Περαία.`
    default:
      return `Musky Paws: Ενημέρωση για το ραντεβού σας (${date} ${time}).`
  }
}

// ─── Senders ─────────────────────────────────────────────────────────────────

async function sendEmail(to: string, template: string, payload: any): Promise<string> {
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not set')
  const { subject, html } = emailTemplate(template, payload)
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Resend API error')
  return data.id
}

async function sendSMS(to: string, template: string, payload: any): Promise<string> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) throw new Error('Twilio not configured')
  // Ensure E.164 format
  const phone = to.startsWith('+') ? to : `+30${to.replace(/\D/g, '')}`
  const body = smsTemplate(template, payload)
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`
  const params = new URLSearchParams({ To: phone, From: TWILIO_FROM_NUMBER, Body: body })
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Twilio API error')
  return data.sid
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

serve(async (req) => {
  const auth = req.headers.get('Authorization')
  if (auth !== `Bearer ${Deno.env.get('CRON_SECRET')}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const { data: pending, error } = await supabase
      .from('notification_outbox')
      .select('*')
      .eq('status', 'pending')
      .lte('run_at', new Date().toISOString())
      .lt('attempts', 3)
      .order('created_at', { ascending: true })
      .limit(50)

    if (error) throw error
    if (!pending?.length) return new Response(JSON.stringify({ message: 'No pending notifications.' }), { status: 200 })

    let sent = 0, failed = 0

    for (const n of pending) {
      // Mark as processing
      await supabase.from('notification_outbox').update({ status: 'processing', attempts: n.attempts + 1 }).eq('id', n.id)

      try {
        let providerId: string
        if (n.channel === 'email') {
          providerId = await sendEmail(n.to, n.template, n.payload)
        } else {
          providerId = await sendSMS(n.to, n.template, n.payload)
        }
        await supabase.from('notification_outbox').update({ status: 'sent', provider_message_id: providerId, last_error: null }).eq('id', n.id)
        sent++
      } catch (err: any) {
        const isFinal = n.attempts >= 2
        await supabase.from('notification_outbox').update({
          status: isFinal ? 'failed' : 'pending',
          last_error: err.message
        }).eq('id', n.id)
        failed++
      }
    }

    return new Response(JSON.stringify({ sent, failed }), { headers: { 'Content-Type': 'application/json' }, status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
