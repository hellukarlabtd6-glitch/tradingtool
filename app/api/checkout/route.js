import { NextResponse } from "next/server";
import { stripe, getBaseUrl } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const base = getBaseUrl(req);
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription", // change to "payment" for a one-time purchase
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${base}/api/verify?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/?canceled=1`,
      allow_promotion_codes: true,
    });
    return NextResponse.redirect(session.url, 303);
  } catch (e) {
    return NextResponse.redirect(`${base}/?error=checkout_failed`, 303);
  }
}
