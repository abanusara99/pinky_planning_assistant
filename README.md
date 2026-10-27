# Project Documentation — Pinky Planning Assistant

## Overview

Pinky Planning Assistant is a Next.js web application for organizing weddings, birthdays, and community events. It provides a guided booking flow, a color-coded availability calendar, and a reviews page. Data is stored in Supabase, and the project deploys to Vercel with the Supabase integration handling environment variables automatically.

## Project Structure

```
pinky-planning-assistant/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx
│   ├── chat/page.tsx
│   ├── calendar/page.tsx
│   ├── reviews/page.tsx
│   └── api/
│       ├── booking/route.ts
│       ├── reviews/route.ts
│       └── availability/route.ts
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── AvailabilityCalendar.tsx
├── lib/
│   ├── supabase.ts
│   └── types.ts
├── supabase/
│   └── schema.sql
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── package.json
├── README.md
└── ISSUES.md
```

## Technology Stack

Next.js 16.4.3 (App Router, Turbopack), React 19.3.0, Tailwind CSS 4 with `@tailwindcss/turbopack`, Supabase JS 2.118.0, lucide-react for icons, TypeScript 5, ESLint 9 (flat config). The project uses CSS-first Tailwind configuration via `@theme` in `app/globals.css`, so there is no `tailwind.config.ts` or `postcss.config.mjs`.

## Environment Variables

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are required. Locally they live in `.env.local`, which must not be committed. On Vercel they are injected automatically by the Supabase integration from the Vercel Marketplace.

## Installation

Clone the repository, run `npm install`, then `npm install lucide-react`. Create `.env.local` with the Supabase URL and publishable key. Run `supabase/schema.sql` in the Supabase SQL Editor to create the `bookings`, `reviews`, and `availability` tables and seed four sample reviews.

## Running the Project

Development uses `npm run dev` and serves on http://localhost:3000. Production uses `npm run build` followed by `npm start`. Linting uses `npm run lint`. Deployment pushes the repository to GitHub, imports it in Vercel, installs the Supabase integration from the Marketplace, runs `supabase/schema.sql` once, and deploys.

## Data Model

The `bookings` table stores `plan_type` (wedding, birthday, community, big), `plan_price`, `event_date`, `event_time`, and `created_at`. The `reviews` table stores `name`, `username`, `image_url`, `review`, and `created_at`. The `availability` table stores a unique `date` and a `status` of either `busy` or `free`. All three tables have row-level security enabled with permissive policies for the demo.

## Application Flow

### Home Page (`/`)

Displays a short about section and three buttons linking to the chat, calendar, and reviews pages. Uses the shared header and footer.

### Chat Page (`/chat`)

Implements a four-step guided booking flow. Step one shows a time-aware greeting (computed in `useEffect` to satisfy prerender rules) and four plan buttons: Wedding $220, Birthday $170, Community Event $500, Big Event $1000. Step two shows a popup confirming the selected plan. Step three collects the event date and time and submits them to `POST /api/booking`. Step four asks "Have you paid?" — "Yes, I paid" calls `POST /api/availability` with `status: "busy"`, and "No, not yet" calls it with `status: "free"`. A final thank-you message is displayed.

### Calendar Page (`/calendar`)

Fetches busy dates from `GET /api/availability` on mount. Renders the `AvailabilityCalendar` component, which uses three colors: green for free days, pink for busy days, and red for Wednesdays (closed, disabled, cannot be clicked). Clicking a non-Wednesday day toggles its status via `POST /api/availability`. The calendar's base year and month are computed in `useEffect` to avoid the unstable `new Date()` prerender error.

### Reviews Page (`/reviews`)

Fetches reviews from `GET /api/reviews` using `text()` before `JSON.parse` to guard against empty bodies. Each review is rendered with an inline `Avatar` component that shows a colored initial derived from the reviewer's name when `image_url` is null or invalid, and falls back to the initial if a provided URL fails via `onError`. The feedback form posts to `POST /api/reviews` with name, username, optional image URL, and review text.

## API Routes

`POST /api/booking` inserts a new row into `bookings` after validating required fields. `GET /api/reviews` returns all reviews ordered by `created_at` descending. `POST /api/reviews` inserts a new row and returns it. `GET /api/availability` returns all rows from `availability`. `POST /api/availability` upserts a date and status using `onConflict: "date"` so re-marking a date updates the existing row. None of these routes use `runtime` or `dynamic` exports because Next.js 16 with Cache Components disallows them.

## Theming

The body is white with pink radial gradients in the top-left and bottom-right corners, implemented as `body::before` and `body::after` pseudo-elements in `app/globals.css`. The header and footer use `bg-pinky-200`. Accent colors `pinky-400` and `pinky-500` are defined as CSS variables inside the `@theme` block. The header contains the title "Pinky Planning Assistant" and navigation. The footer shows a MapPin icon with "USA" and a Phone icon with "+1 000-000-0000".

## Prerender Rules

Next.js 16 with Cache Components enforces two rules that shaped this project. First, route segment configs `runtime` and `dynamic` cannot be exported from API routes. Second, `new Date()` must not be read during render in Client Components — it is deferred to `useEffect` in both the chat greeting and the calendar's month base. Both fixes use a placeholder initial state that is replaced after mount.

## Known Issues and Future Work

Email delivery and payment processing are placeholders. The "we sent the link to your email" message is static, and "Yes, I paid" is a self-reported click rather than a verified transaction. Double-booking is not prevented — a busy date can still be booked. Wednesdays are blocked only in the calendar UI, not in the booking flow. RLS policies are permissive and should be scoped to `auth.uid()` before production. Reviews have no authentication or moderation. Loading states, error toasts, keyboard navigation, and mobile polish at 320px are pending. Automated tests and CI checks are not yet configured.

## Deployment Notes

The Supabase integration in Vercel injects environment variables at build time. If the build fails with a Supabase-related error, confirm the integration is installed and the project is linked. If the build shows a stale `.next/types` error, redeploy with "Clear build cache" checked. If a prerender error references `new Date()`, verify that no Client Component reads it during render.
