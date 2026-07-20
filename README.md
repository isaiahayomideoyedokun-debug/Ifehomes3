# Ife Homes

A full-stack apartment + roommate-finder platform for students and agents around
Ile-Ife. Built with Next.js 14 (App Router), Prisma + Postgres, NextAuth,
Cloudinary, Resend, and (optionally) Twilio Verify.

## What's included

- **Real accounts with OTP verification** — sign up as a Student or an Agent;
  confirm your account with a 6-digit code sent to your **email** (via Resend),
  or optionally your **phone via SMS** (via Twilio Verify, if configured).
  Accounts can't log in until verified.
- **Agent annual plan (₦50,000/year)** — agents see the plan and Opay bank
  transfer details on their Billing page, tap "I've made the transfer," and an
  admin manually confirms it before that agent can publish listings.
- **Free-text locations** — agents type any area/location when listing (no
  fixed dropdown); students search listings by typing a location too.
- **Direct WhatsApp contact** — every listing and roommate profile has a "Chat
  on WhatsApp" button built from that person's phone number — no in-app
  messaging system, just a direct link to `wa.me`.
- **Image uploads** — agents upload real photos to Cloudinary when creating a listing.
- **Roommate finder** — students fill in a profile (faculty, level, budget,
  lifestyle tags, WhatsApp number); other students filter and chat them directly.
- **Admin page** (`/admin`) — approve/revoke agent payments.

## 1. Local setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

- `DATABASE_URL` — Postgres connection string (Neon or Supabase).
- `NEXTAUTH_SECRET` — random string, e.g. `openssl rand -base64 32`.
- `NEXTAUTH_URL` — `http://localhost:3000` locally.
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` —
  free at [cloudinary.com](https://cloudinary.com).
- `RESEND_API_KEY` — free at [resend.com](https://resend.com) → API Keys.
  This is what sends the email verification codes.
- `EMAIL_FROM` — while testing, `onboarding@resend.dev` works out of the box
  with any free Resend account (no domain setup needed).
- `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_VERIFY_SERVICE_SID` —
  **optional.** Only fill these in if you also want to offer phone-SMS
  verification. Get them from [twilio.com](https://twilio.com) → create a
  **Verify Service** (not a phone number purchase — Verify handles that).
  If you leave these blank, the signup form will simply only offer email
  verification, which is enough on its own.
- `NEXT_PUBLIC_ENABLE_PHONE_VERIFY` — set to `"true"` only once the three
  Twilio values above are filled in, to reveal the "verify by phone" option.
- `ADMIN_EMAIL` — the email address of the account that should be able to
  open `/admin` and approve agent payments. Use whichever email you plan to
  sign up with as the site owner.

Then create the database tables and (optionally) seed demo data:

```bash
npx prisma migrate dev --name init
npm run db:seed   # optional: demo agent (pre-paid), two demo students, three listings
npm run dev
```

Visit `http://localhost:3000`. If you seeded, sign in with
`agent@ifehomes.test` / `tolu@ifehomes.test`, password `password123` — both are
pre-verified and the demo agent is pre-paid, so you can try listing right away.

## 2. How the agent payment gate works

There's no payment gateway wired in — Opay transfers can't be confirmed
automatically without a business API integration, so the flow is manual:

1. Agent signs up, goes to **Billing**, sees the ₦50,000/year plan and the
   Opay account details (account 8078307401, Oyedokun Isaiah Ayomide, Opay).
2. Agent makes the transfer for real, then taps **"I've made the transfer"** —
   this sets their status to `pending`.
3. You (the site owner, signed in with the account matching `ADMIN_EMAIL`)
   open **/admin**, check your Opay account for that transfer, and tap
   **"Mark as paid."**
4. The agent can now publish listings. This is enforced both in the UI
   (middleware redirects to Billing if unpaid) and on the server (the
   listings API rejects creation if `agentPaymentStatus !== "paid"`), so it
   can't be bypassed by editing the page.

## 3. Project structure

```
app/
  (auth)/         login, signup
  verify/         OTP entry page (email or phone code)
  listings/       browse (free-text location search), detail, agent "new listing" form
  roommates/      browse + filter roommate profiles, WhatsApp contact built in
  dashboard/       agent's own listings + billing page
  admin/          approve/revoke agent payments
  profile/        edit your own account (incl. WhatsApp number)
  api/            all backend routes
components/       ListingCard, RoommateCard, WhatsAppButton, ImageUploader, Navbar
lib/              prisma, next-auth, cloudinary, resend, twilio, otp helpers
prisma/           schema.prisma + seed.ts
```

## 4. Deploying it for real

1. Push this project to a GitHub repo.
2. Create a free Postgres database on Neon or Supabase.
3. Create free accounts on Cloudinary and Resend (Twilio only if you want
   phone OTP too).
4. Import the repo on [vercel.com](https://vercel.com), add every variable
   from `.env.example` with real values in Environment Variables (set
   `NEXTAUTH_URL` to your real Vercel URL), and deploy.
5. Run the migration once against your production database from your own
   machine:
   ```bash
   npx prisma migrate deploy
   ```
6. Sign up on the live site with the email you set as `ADMIN_EMAIL`, so you
   can access `/admin` there too.

## 5. Things worth knowing

- **Phone OTP is optional.** Without Twilio configured, everyone verifies by
  email — which is genuinely enough for most launches.
- **The Opay transfer confirmation is manual**, by design, since there's no
  payment gateway integration. If this becomes a bottleneck later, a proper
  payment gateway (Paystack/Flutterwave support bank transfer + webhooks)
  would automate step 3 above.
- **WhatsApp links use the `wa.me` scheme** — they open WhatsApp directly with
  the other person's number and a pre-filled message; there's no message
  history stored in the app itself anymore.
- **No image size/count limits** yet on uploads — worth adding before wide use.

## 6. Useful commands

```bash
npm run dev          # local dev server
npm run build        # production build
npm run db:studio    # Prisma Studio — browse/edit your database in a GUI
npm run db:migrate   # create a new migration after changing prisma/schema.prisma
```
