import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readFile } from "fs/promises";
import path from "path";
import { readToken, COOKIE } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const access = await readToken(cookies().get(COOKIE)?.value);
  if (!access) return new NextResponse("Unauthorized", { status: 401 });

  const ok = await hasActiveSubscription(access.customerId).catch(() => false);
  if (!ok) return new NextResponse("Subscription inactive", { status: 402 });

  const file = path.join(process.cwd(), "tool", "signal-desk.html");
  const html = await readFile(file, "utf8");
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
