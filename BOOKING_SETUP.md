# Musky Paws Booking System - Setup Guide

This project includes a production-grade booking system using Next.js 16 and Supabase.

## ✨ Features
- **Frictionless Stepper**: Mobile-first multi-step booking form.
- **Availability Engine**: Prevents double-booking using Postgres exclusion constraints.
- **Admin Dashboard**: Calendar/List view for managing appointments.
- **Automated Notifications**: Email (Resend) and SMS (Twilio) support with retry logic.
- **Local SEO**: Optimized area pages for Perarea, Kalamaria, and more.

## 🚀 Setup Instructions

### 1. Database (Supabase)
1. Create a new Supabase project.
2. Go to **SQL Editor** and run the migrations found in `./supabase/migrations/`.
3. Enable **pg_cron** if you want automated reminders (optional).

### 2. Environment Variables (`.env.local`)
Create a `.env.local` file with the following:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Notifications (For Edge Functions)
# Add these in Supabase Dashboard -> Edge Functions -> Secrets
RESEND_API_KEY=re_xxx
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_FROM_NUMBER=+1xxx
CRON_SECRET=a_random_secure_string_for_cron
```

### 3. Deploy Edge Functions
Login to Supabase CLI and deploy the notification processor:
```bash
supabase functions deploy process-notifications
```

## 🛠 Tech Stack
- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Lucide icons.
- **Backend**: Supabase (Postgres, RLS), Server Actions, Edge Functions (Deno).
- **Validation**: Zod.
- **Date Handling**: date-fns.

## 📱 Admin Access
The admin dashboard is located at `/admin`.
> [!NOTE]
> Currently, it uses the service role to bypass RLS for ease of MVP setup. For a multi-tenant or multi-user environment, integrate Supabase Auth with proper RLS policies.
