import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// Resolve the site's origin for Stripe redirect URLs.
// On Vercel the host headers are set automatically; NEXT_PUBLIC_BASE_URL overrides.
export function getBaseUrl(req) {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  const h = req.headers;
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

// Source of truth for access: does this customer have a live subscription right now?
// This means cancellations are enforced on the next page load with no database.
export async function hasActiveSubscription(customerId) {
  for (const status of ["active", "trialing"]) {
    const subs = await stripe.subscriptions.list({ customer: customerId, status, limit: 1 });
    if (subs.data.length > 0) return true;
  }
  return false;
}
