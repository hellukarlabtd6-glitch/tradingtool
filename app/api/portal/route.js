import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stripe, getBaseUrl } from "@/lib/stripe";
import { readToken, COOKIE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const base = getBaseUrl(req);
  const access = await readToken(cookies().get(COOKIE)?.value);
  if (!access) return NextResponse.redirect(`${base}/`, 303);

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: access.customerId,
      return_url: `${base}/app`,
    });
    return NextResponse.redirect(portal.url, 303);
  } catch (e) {
    return NextResponse.redirect(`${base}/app?error=portal_failed`, 303);
  }
}
