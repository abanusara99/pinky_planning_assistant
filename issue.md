# Issues, Fixes, and Future Updates

## Fixed Issues

### Build and Deployment

- **`Route segment config "runtime" is not compatible with nextConfig.cacheComponents`** — Removed `export const runtime = "nodejs"` from all three API routes (`booking`, `reviews`, `availability`). Next.js 16 with Cache Components does not allow this config.
- **`Route segment config "dynamic" is not compatible with nextConfig.cacheComponents`** — Removed `export const dynamic = "force-dynamic"` from all three API routes for the same reason.
- **`File 'app/api/booking/route.ts' is not a module` (TS2306 on Vercel)** — Caused by a stale `.next/types/validator.ts` cache on Vercel. Fixed by clearing the Vercel build cache during redeploy and ensuring the route file was correctly committed with a valid `export async function POST(...)`.
- **`Next.js encountered the unstable value new Date()` on `/chat`** — The greeting function called `new Date()` during render. Fixed by moving the time read into `useEffect` and storing the greeting in `useState`.
- **`Next.js encountered the unstable value new Date()` on `/calendar`** — `AvailabilityCalendar` used `const today = useMemo(() => new Date(), [])`. Fixed by deferring `new Date()` into `useEffect` and storing the base year/month in state, with a placeholder grid shown until hydration.
- **`JSON.parse: unexpected end of data`** — The reviews page fetched `/api/reviews` and called `.json()` on an empty body. Fixed by reading `text()` first, checking if it is empty, then parsing.

### TypeScript and Editor

- **`Cannot find module '@/components/Header' / '@/components/Footer'`** — Fixed by ensuring `tsconfig.json` has `"baseUrl": "."` and `"paths": { "@/*": ["./*"] }`, then restarting the TS server.
- **`Unknown at rule @theme` in `globals.css`** — Editor-only warning. Fixed by associating `.css` files with the Tailwind CSS language mode in VS Code via the Tailwind CSS IntelliSense extension, or by setting `css.lint.unknownAtRules` to `ignore`.
- **`This expression is not callable. Type 'String' has no call signatures.`** — After converting `greeting` from a function to a string state value, the JSX still called `{greeting()}`. Fixed by using `{greeting}`.
- **`min-w-[110px]` can be written as `min-w-27.5`** — Tailwind 4 IntelliSense suggestion. Fixed by using the canonical class `min-w-27.5`.

### Reviews

- **Broken avatar images / no image placeholder** — The reviews page originally used dicebear URLs. Fixed by introducing an inline `Avatar` component that shows the reviewer's colored initial when `image_url` is null or invalid, falls back to the initial if a valid URL fails to load via `onError`, and never triggers a broken-image icon.

### UI and Theming

- **Tailwind config mismatch with Next.js 16** — Removed `tailwind.config.ts` and `postcss.config.mjs` in favor of CSS-first `@theme` tokens in `app/globals.css`. Pink palette (`pinky-50` through `pinky-500`) is defined as CSS variables.
- **Pink corner accents not showing above content** — Fixed by giving `main`, `header`, and `footer` a stacking context with `position: relative; z-index: 1`.

## Features Added

### Booking and Payment Flow

- Payment confirmation step after booking. "Yes, I paid" marks the date busy in `availability` so the calendar shows pink. "No, not yet" marks the date free so the calendar shows green.
- Thank-you message after the payment choice, confirming the calendar was updated.
- Popup confirmation after plan selection showing the chosen plan and its price.

### Calendar

- Color-coded calendar with three statuses: green = free / booking available, pink = busy / booked, red = closed every Wednesday (disabled, cannot be clicked).
- Month navigation with previous and next arrows.
- Clickable days to toggle busy or free status, persisted to Supabase via `POST /api/availability`.
- Placeholder grid shown while the current month is being computed after mount.

### Reviews

- Inline `Avatar` component with deterministic pastel colors derived from the reviewer's name.
- Optional image URL field in the feedback form. If left blank, the reviewer gets a colored initial avatar.
- Graceful fallback if the provided image URL is unreachable.
- Safe JSON parsing using `text()` before `JSON.parse` to prevent crashes on empty API responses.

### Theme and Layout

- White body with pink radial gradients in the top-left and bottom-right corners.
- Pink header with the title "Pinky Planning Assistant" and navigation for Home, Book, Calendar, and Reviews.
- Pink footer with location logo ("USA") and phone number ("+1 000-000-0000").
- Responsive layout tested for desktop, tablet, and mobile widths.

## Future Updates

### Functionality

- **Email delivery** — the "we sent the link to your email" message is a placeholder. Integrate a transactional email service such as Resend or SendGrid to send the payment link.
- **Payment integration** — connect a real payment provider such as Stripe or PayPal so "Yes, I paid" reflects a verified transaction rather than a self-reported click.
- **Booking confirmation email** — send a receipt with the selected plan, date, and time after payment.
- **Cancel or reschedule flow** — allow users to cancel a booking and free up the date in the calendar.

### Calendar

- **Prevent double-booking** — currently a user can book a date that is already marked busy. Add a check in `/api/booking` to reject bookings on busy dates.
- **Wednesday enforcement in booking** — the chat flow should also block Wednesdays, not only the calendar UI.
- **Time-slot granularity** — the calendar currently only tracks whole days. If multiple events can happen on the same day, add per-time-slot availability.

### Reviews

- **Authentication** — anyone can post a review. Add authentication so reviews are tied to real users.
- **Moderation** — add an admin view or automatic filter to remove spam reviews.
- **Rating stars** — currently reviews are text-only. Consider adding a one-to-five star rating.

### UX and Accessibility

- **Loading states** — add skeleton loaders to the reviews and calendar pages while data is fetched.
- **Error toasts** — show user-friendly error messages when API calls fail.
- **Keyboard navigation** on the calendar using arrow keys to move between days.
- **Screen reader labels** for status badges; currently only `title` attributes are used.
- **Mobile layout polish** — verify the chat and calendar at 320px width.

### Deployment

- **Staging environment** — add a Vercel preview branch workflow for testing before merging to `main`.
- **Automated tests** — add Playwright or Vitest tests for the booking flow and calendar toggling.
- **CI checks** — run `npm run build` and `npm run lint` in GitHub Actions on every pull request.

## Summary

| Category | Count |
|---|---|
| Fixed | 12 |
| Added | 12 |
| Future updates | 18 |
