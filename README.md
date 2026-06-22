# Signal Desk — paywalled crypto signal terminal

A Next.js app that puts the Signal Desk tool behind a Stripe subscription paywall,
ready to deploy on Vercel. No database and no webhook required.

## How it works

- The tool's HTML lives at a **gated route** (`/tool`). It is only returned if the
  visitor has a valid signed access cookie **and** a live Stripe subscription.
- **Stripe Checkout** handles payment. After a verified checkout, the app sets an
  httpOnly cookie and sends the user to `/app`.
- `/app` and `/tool` re-check Stripe for an active subscription on every load, so a
  cancellation removes access on the next page view — **no database needed**.

```
/            landing + Subscribe button
/api/checkout   creates a Stripe Checkout session  (POST)
/api/verify     confirms payment, sets the access cookie
/api/portal     opens the Stripe billing portal
/app            protected page (frames the tool)
/tool           gated HTML of the signal terminal
```

---

## What you'll do vs. what's already done

The code is finished. The parts only you can do are: creating your own GitHub, Vercel,
and Stripe accounts, and pasting **your** secret keys into Vercel's environment-variable
settings (the app never ships any keys — you add them in the Vercel dashboard).

You need three accounts, all free to start: **GitHub**, **Vercel**, **Stripe**.

---

## Step 1 — Put the code in your own GitHub repo

From inside this project folder:

```bash
git init
git add .
git commit -m "Signal Desk paywall"
```

Create an empty repo on github.com (no README), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Step 2 — Create the Stripe product and price

1. Go to dashboard.stripe.com and stay in **Test mode** (toggle, top right) for now.
2. **Product catalog → Add product.** Name it, set a **recurring** price (e.g. $19 / month).
   Save, then copy the **Price ID** — it looks like `price_...`.
3. **Developers → API keys.** Copy your **Secret key** — `sk_test_...`.

## Step 3 — Generate a cookie-signing secret

Run this and copy the output:

```bash
openssl rand -base64 32
```

(No openssl? Any long random string of 32+ characters works.)

## Step 4 — Deploy on Vercel

1. Go to vercel.com → **Add New → Project** → import your GitHub repo.
2. Framework preset auto-detects **Next.js**. Leave build settings as-is.
3. Open **Environment Variables** and add these three:

   | Name | Value |
   |------|-------|
   | `STRIPE_SECRET_KEY` | your `sk_test_...` key |
   | `STRIPE_PRICE_ID` | your `price_...` ID |
   | `AUTH_SECRET` | the random string from Step 3 |

4. Click **Deploy**. You'll get a URL like `https://your-app.vercel.app`.

> The success/cancel URLs are derived from the request automatically, so there is
> nothing else to configure for the default `*.vercel.app` domain.

## Step 5 — Test the whole flow

1. Open your Vercel URL and click **Subscribe**.
2. On Stripe Checkout use the test card **4242 4242 4242 4242**, any future expiry,
   any CVC, any postal code.
3. You should land on `/app` and see the terminal. Try **Manage billing** to confirm
   the portal opens.

## Step 6 — Go live

1. In Stripe, flip to **Live mode** and recreate the product/price (or activate it).
2. In Vercel, change `STRIPE_SECRET_KEY` to your `sk_live_...` key and
   `STRIPE_PRICE_ID` to the live `price_...`, then redeploy.
3. Update `PRICE_LABEL` in `app/page.jsx` so the displayed price matches Stripe.

---

## Run locally (optional)

```bash
npm install
cp .env.local.example .env.local   # then fill in the three values
npm run dev
```

For local Checkout redirects to work, set `NEXT_PUBLIC_BASE_URL=http://localhost:3000`
in `.env.local`.

---

## Good to know / honest limits

- **Access is per-device in this MVP.** The cookie lives on the browser where checkout
  finished. If a subscriber clears cookies or switches devices, they currently can't
  restore access without subscribing again. The clean fix is adding real login
  (Clerk or Auth.js) keyed to the Stripe customer — that's the recommended next upgrade.
- **A paid user can still save the tool's HTML.** Anything sent to the browser can be
  copied. To truly protect the logic, move the signal computation to a server route so
  only the *results* reach the client. The paywall here gates **access**, which is the
  standard approach for an MVP.
- **One-time purchase instead of subscription?** In `app/api/checkout/route.js` change
  `mode: "subscription"` to `mode: "payment"`, and in the two access checks replace the
  `hasActiveSubscription` call with your own paid-once check (a one-time purchase has no
  ongoing subscription to query, so you'd record the customer/payment — a small database
  or Stripe metadata lookup — instead).
- **Webhooks** aren't required because access is re-verified live against Stripe. If you
  later add a database for performance, that's where a webhook would keep it in sync.

## Not financial advice

The signals are mechanical technical-indicator outputs for informational use only. They
are not predictions and not financial advice. Crypto is volatile and you can lose money.
