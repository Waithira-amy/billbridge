import { db } from "@/lib/store";
import { createInvoice, kesToSats } from "@/lib/lightning";
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const c = db.campaigns.get((await params).id); if (!c) return Response.json({ error: "not found" }, { status: 404 });
  const remaining = c.targetKes - c.raisedKes, kes = Math.floor(Number((await req.json()).amountKes));
  if (!(kes > 0) || kes > remaining) return Response.json({ error: `Amount must be 1-${remaining}` }, { status: 400 });
  const sats = kesToSats(kes), inv = await createInvoice(sats, `BillBridge ${c.id}`);
  db.payments.set(inv.hash, { hash: inv.hash, campaignId: c.id, kes, sats, bolt11: inv.bolt11, status: "pending" });
  return Response.json({ hash: inv.hash, bolt11: inv.bolt11, sats, kes });
}
export async function GET(req: Request) { // poll status: ?hash=
  const p = db.payments.get(new URL(req.url).searchParams.get("hash") ?? ""); return Response.json({ status: p?.status ?? "unknown" });
}
