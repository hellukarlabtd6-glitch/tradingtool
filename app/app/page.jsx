import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readToken, COOKIE } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function AppPage() {
  const access = await readToken(cookies().get(COOKIE)?.value);
  if (!access) redirect("/?error=signin");

  const ok = await hasActiveSubscription(access.customerId).catch(() => false);
  if (!ok) redirect("/?error=inactive");

  return (
    <main className="appshell">
      <div className="appbar">
        <span className="appbar-brand">SIGNAL<b>·</b>DESK</span>
        <span className="appbar-user">{access.email}</span>
        <a className="appbar-link" href="/api/portal">Manage billing</a>
      </div>
      <iframe className="appframe" src="/tool" title="Signal Desk" />
    </main>
  );
}
