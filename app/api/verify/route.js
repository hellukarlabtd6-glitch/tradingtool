import { NextResponse } from "next/server";
import { stripe, getBaseUrl } from "@/lib/stripe";
import { createToken, COOKIE } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  const base = getBaseUrl(req);
  const sessionId = new URL(req.url).searchParams.get("session_id");
  if (!sessionId) return NextResponse.redirect(`${base}/?error=missing_session`, 303);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid" || session.status === "complete";
    const customerId =
      typeof session.customer === "string" ? session.customer : session.customer?.id;
    const email = session.customer_details?.email || "";

    if (!paid || !customerId) {
      return NextResponse.redirect(`${base}/?error=not_paid`, 303);
    }

    const token = await createToken({ customerId, email });
    const res = NextResponse.redirect(`${base}/app`, 303);
    res.cookies.set(COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch (e) {
    return NextResponse.redirect(`${base}/?error=verify_failed`, 303);
  }
}
