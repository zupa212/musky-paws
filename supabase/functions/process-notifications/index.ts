// @ts-nocheck
// Runs in Deno / Supabase Edge Functions — Deno-specific APIs are expected
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ── Config (mirrors src/config/business.ts) ───────────────────────────────────
const BUSINESS = {
  name: Deno.env.get('BUSINESS_NAME') ?? 'Musky Paws',
  phone: Deno.env.get('BUSINESS_PHONE') ?? '+306948965371',
  phoneDisplay: Deno.env.get('BUSINESS_PHONE_DISP') ?? '694 896 5371',
  bookingUrl: Deno.env.get('BUSINESS_BOOKING_URL') ?? 'https://muskypaws.gr/booking',
  emailFrom: Deno.env.get('RESEND_FROM_EMAIL') ?? 'bookings@muskypaws.gr',
  emailFromName: Deno.env.get('RESEND_FROM_NAME') ?? 'Musky Paws',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')
const TWILIO_FROM_NUMBER = Deno.env.get('TWILIO_FROM_NUMBER')
const BUSINESS_NOTIFY_SMS = Deno.env.get('BUSINESS_NOTIFY_SMS')  // owner SMS (optional)
const BUSINESS_NOTIFY_EMAIL = Deno.env.get('BUSINESS_NOTIFY_EMAIL') // owner email (optional)

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// ── Greek date/time helpers ───────────────────────────────────────────────────
function grDate(iso: string) {
  return new Date(iso).toLocaleDateString('el-GR', {
    weekday: 'long', day: 'numeric', month: 'long',
    timeZone: 'Europe/Athens'
  })
}
function grTime(iso: string) {
  return new Date(iso).toLocaleTimeString('el-GR', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Athens'
  })
}

// ── SMS Templates (exact professional Greek style) ────────────────────────────
function smsBody(template: string, p: Record<string, string>): string {
  const B = BUSINESS.name, PH = BUSINESS.phoneDisplay, URL = BUSINESS.bookingUrl
  const dateGr = p.date_gr ?? '', timeGr = p.time_gr ?? '', svc = p.service ?? ''

  switch (template) {
    case 'booking_pending_customer':
      return `«Το αίτημά σας για ραντεβού στο "${B}" για ${svc} στις ${dateGr} ${timeGr} καταχωρήθηκε. Θα λάβετε επιβεβαίωση σύντομα. Τηλ: ${PH}.»`
    case 'booking_confirmed_customer':
      return `«Το ραντεβού σας στο "${B}" για ${svc} στις ${dateGr} ${timeGr} επιβεβαιώθηκε. Για οποιαδήποτε αλλαγή καλέστε στο ${PH}.»`
    case 'booking_canceled_customer':
      return `«Το ραντεβού σας στο "${B}" στις ${dateGr} ${timeGr} ακυρώθηκε. Για νέα κράτηση: ${URL} ή ${PH}.»`
    case 'reminder_24h_customer':
      return `«Υπενθύμιση: Το ραντεβού σας στο "${B}" για ${svc} είναι αύριο στις ${timeGr}. Για αλλαγή καλέστε ${PH}.»`
    case 'reminder_2h_customer':
      return `«Υπενθύμιση: Σε 2 ώρες στις ${timeGr} έχετε ραντεβού στο "${B}" (${svc}). Σας περιμένουμε!»`
    case 'booking_pending_business':
      return `[${B}] Νέο αίτημα ραντεβού: ${p.customer_name}, ${svc}, ${dateGr} ${timeGr}. Τηλ: ${p.customer_phone}`
    case 'booking_confirmed_business':
      return `[${B}] Επιβεβαιώθηκε: ${p.customer_name}, ${svc}, ${dateGr} ${timeGr}.`
    case 'booking_rescheduled_customer': {
      const nd = p.new_date_gr ?? dateGr, nt = p.new_time_gr ?? timeGr
      return `«Το ραντεβού σας στο "${B}" μεταφέρθηκε στις ${nd} ${nt}. Για αλλαγές καλέστε ${PH}.»`
    }
    default:
      return `[${B}] Ενημέρωση ραντεβού: ${dateGr} ${timeGr}.`
  }
}

// ── Email HTML Templates ──────────────────────────────────────────────────────
function emailContent(template: string, p: Record<string, string>): { subject: string; html: string } {
  const B = BUSINESS.name, PH = BUSINESS.phoneDisplay, URL = BUSINESS.bookingUrl
  const dateGr = p.date_gr ?? '', timeGr = p.time_gr ?? '', svc = p.service ?? ''
  const name = p.customer_name ?? 'Πελάτη'

  const wrap = (title: string, color: string, body: string) => ({
    subject: `${title} – ${B}`,
    html: `<!DOCTYPE html><html lang="el"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;background:#f9fafb;font-family:'Segoe UI',Arial,sans-serif">
<div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
  <div style="background:#1a1a2e;padding:24px 32px;display:flex;align-items:center;gap:12px">
    <span style="font-size:28px">🐾</span>
    <span style="color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.5px">${B}</span>
  </div>
  <div style="padding:32px">
    <div style="display:inline-block;background:${color};color:#fff;border-radius:8px;padding:4px 14px;font-size:13px;font-weight:600;margin-bottom:20px">${title}</div>
    ${body}
  </div>
  <div style="background:#f3f4f6;padding:20px 32px;text-align:center;font-size:12px;color:#9ca3af;border-top:1px solid #e5e7eb">
    ${B} · Σόλωνος 28Β, Περαία 570 19<br/>
    <a href="tel:${BUSINESS.phone}" style="color:#6366f1">📞 ${PH}</a> &nbsp;|&nbsp;
    <a href="${URL}" style="color:#6366f1">Κάντε κράτηση online</a>
  </div>
</div></body></html>`
  })

  const detailBox = (bgColor = '#f0fdf4', borderColor = '#86efac', textColor = '#166534') =>
    `<div style="background:${bgColor};border:1px solid ${borderColor};border-radius:10px;padding:16px;margin:16px 0">
      <p style="margin:6px 0;color:${textColor}"><strong>📋 Υπηρεσία:</strong> ${svc}</p>
      <p style="margin:6px 0;color:${textColor}"><strong>📅 Ημερομηνία:</strong> ${dateGr}</p>
      <p style="margin:6px 0;color:${textColor}"><strong>🕐 Ώρα:</strong> ${timeGr}</p>
    </div>`

  switch (template) {
    case 'booking_pending_customer':
      return wrap('Αίτημα Καταχωρήθηκε ⏳', '#f59e0b', `
        <p style="color:#374151;font-size:16px">Γεια σας, <strong>${name}</strong>!</p>
        <p style="color:#6b7280">Λάβαμε το αίτημά σας και θα επικοινωνήσουμε σύντομα για επιβεβαίωση.</p>
        ${detailBox('#fffbeb', '#fde68a', '#92400e')}
        <p style="color:#6b7280;font-size:14px">Χρειάζεστε αλλαγή; Καλέστε μας: <a href="tel:${BUSINESS.phone}" style="color:#6366f1">${PH}</a></p>`)

    case 'booking_confirmed_customer':
      return wrap('Ραντεβού Επιβεβαιώθηκε ✅', '#10b981', `
        <p style="color:#374151;font-size:16px">Γεια σας, <strong>${name}</strong>! Ανυπομονούμε να σας δούμε 🐶</p>
        ${detailBox()}
        <p style="color:#6b7280;font-size:14px">📍 Σόλωνος 28Β, Περαία &nbsp;
          <a href="https://maps.google.com/?q=Solonos+28B,+Peraia+57019" style="color:#6366f1">Οδηγίες →</a></p>
        <p style="color:#6b7280;font-size:14px">Για αλλαγή/ακύρωση: <a href="tel:${BUSINESS.phone}" style="color:#6366f1">${PH}</a></p>`)

    case 'booking_canceled_customer':
      return wrap('Ραντεβού Ακυρώθηκε ❌', '#ef4444', `
        <p style="color:#374151">Το ραντεβού σας για <strong>${svc}</strong> στις <strong>${dateGr} ${timeGr}</strong> ακυρώθηκε.</p>
        <p style="color:#6b7280">Για νέα κράτηση: <a href="${URL}" style="color:#6366f1">${URL}</a> ή καλέστε <strong>${PH}</strong></p>`)

    case 'reminder_24h_customer':
      return wrap('Υπενθύμιση Ραντεβού ⏰', '#8b5cf6', `
        <p style="color:#374151">Γεια σας, <strong>${name}</strong>! Υπενθυμίζουμε ότι <strong>αύριο</strong> έχετε ραντεβού:</p>
        ${detailBox('#fefce8', '#fde68a', '#92400e')}
        <p style="color:#6b7280;font-size:14px">📍 Σόλωνος 28Β, Περαία · Ακύρωση: <a href="tel:${BUSINESS.phone}" style="color:#6366f1">${PH}</a></p>`)

    case 'booking_rescheduled_customer': {
      const nd = p.new_date_gr ?? dateGr, nt = p.new_time_gr ?? timeGr
      return wrap('Αλλαγή Ώρας Ραντεβού 🔄', '#8b5cf6', `
        <p style="color:#374151;font-size:16px">Γεια σας, <strong>${name}</strong>!</p>
        <p style="color:#6b7280">Το ραντεβού σας μεταφέρθηκε στη νέα ώρα:</p>
        <div style="background:#f5f3ff;border:1px solid #c4b5fd;border-radius:10px;padding:16px;margin:16px 0">
          <p style="margin:6px 0;color:#5b21b6"><strong>📋 Υπηρεσία:</strong> ${svc}</p>
          <p style="margin:6px 0;color:#5b21b6"><strong>📅 Νέα Ημερομηνία:</strong> ${nd}</p>
          <p style="margin:6px 0;color:#5b21b6"><strong>🕐 Νέα Ώρα:</strong> ${nt}</p>
        </div>
        <p style="color:#6b7280;font-size:14px">Για αλλαγή/ακύρωση: <a href="tel:${BUSINESS.phone}" style="color:#6366f1">${PH}</a></p>`)
    }

    default:
      return wrap('Ενημέρωση Ραντεβού', '#6366f1',
        `<p style="color:#374151">Ενημέρωση σχετικά με το ραντεβού σας (${dateGr} ${timeGr}).</p>`)
  }
}

// ── Provider adapters ─────────────────────────────────────────────────────────
async function sendSMS(to: string, body: string): Promise<string> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER)
    throw new Error('Twilio not configured')
  const phone = to.startsWith('+') ? to : `+30${to.replace(/\D/g, '')}`
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({ To: phone, From: TWILIO_FROM_NUMBER, Body: body }).toString()
    }
  )
  const d = await res.json()
  if (!res.ok) throw new Error(d.message ?? 'Twilio error')
  return d.sid
}

async function sendEmail(to: string, subject: string, html: string): Promise<string> {
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not set')
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `${BUSINESS.emailFromName} <${BUSINESS.emailFrom}>`,
      to, subject, html
    })
  })
  const d = await res.json()
  if (!res.ok) throw new Error(d.message ?? 'Resend error')
  return d.id
}

// ── Main handler ──────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.headers.get('Authorization') !== `Bearer ${Deno.env.get('CRON_SECRET')}`)
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const { data: pending, error } = await supabase
    .from('notification_outbox')
    .select('*')
    .eq('status', 'pending')
    .lte('run_at', new Date().toISOString())
    .lt('attempts', 5)
    .order('created_at', { ascending: true })
    .limit(50)

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  if (!pending?.length) return new Response(JSON.stringify({ message: 'Nothing to process' }), { status: 200 })

  let sent = 0, failed = 0

  for (const n of pending) {
    // Mark as processing (idempotency guard)
    const { error: lockError } = await supabase
      .from('notification_outbox')
      .update({ status: 'processing', attempts: n.attempts + 1 })
      .eq('id', n.id)
      .eq('status', 'pending') // only grab if still pending (concurrent safety)
    if (lockError) continue // another worker grabbed it

    try {
      const p = n.payload as Record<string, string>
      let providerId: string

      if (n.channel === 'sms') {
        const body = smsBody(n.template, p)
        providerId = await sendSMS(n.to, body)
      } else {
        const { subject, html } = emailContent(n.template, p)
        providerId = await sendEmail(n.to, subject, html)
      }

      await supabase.from('notification_outbox').update({
        status: 'sent', provider_message_id: providerId, last_error: null
      }).eq('id', n.id)
      sent++
    } catch (err: any) {
      // Exponential backoff: retry after 2^attempts minutes
      const minutesDelay = Math.pow(2, n.attempts) // 2, 4, 8, 16, 32 min
      const runAt = new Date(Date.now() + minutesDelay * 60_000).toISOString()
      const isFinal = n.attempts >= 4 // 5th attempt = give up

      await supabase.from('notification_outbox').update({
        status: isFinal ? 'failed' : 'pending',
        last_error: err.message,
        run_at: isFinal ? n.run_at : runAt
      }).eq('id', n.id)
      failed++
    }
  }

  return new Response(JSON.stringify({ sent, failed }), { status: 200 })
})
