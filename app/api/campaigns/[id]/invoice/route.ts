import { db } from "@/lib/store";
import { createInvoice, kesToSats } from "@/lib/lightning";
import { isValidDonorEmail, isValidDonorName, isValidDonorPhone } from "@/lib/donor-validation";
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const c = db.campaigns.get((await params).id); if (!c) return Response.json({ error: "not found" }, { status: 404 });
  const body = await req.json();
  const remaining = c.targetKes - c.raisedKes, kes = Math.floor(Number(body.amountKes));
  if (!(kes > 0) || kes > remaining) return Response.json({ error: `Amount must be 1-${remaining}` }, { status: 400 });
  const details = body.donorDetails ?? {};
  const name = typeof details.name === "string" ? details.name.trim() : "";
  const email = typeof details.email === "string" ? details.email.trim() : "";
  const phone = typeof details.phone === "string" ? details.phone.replace(/[\s().-]/g, "") : "";
  if (!isValidDonorName(name)) {
    return Response.json({ error: "Name can only contain letters and spaces (up to 100 characters)." }, { status: 400 });
  }
  if (!isValidDonorEmail(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (phone && !isValidDonorPhone(phone)) {
    return Response.json({ error: "Enter a valid phone number for the selected country." }, { status: 400 });
  }
  const donor = { ...(name && { name }), ...(email && { email }), ...(phone && { phone }) };
  const sats = kesToSats(kes), inv = await createInvoice(sats, `BillBridge ${c.id}`);
  db.payments.set(inv.hash, {
    hash: inv.hash,
    campaignId: c.id,
    kes,
    sats,
    bolt11: inv.bolt11,
    status: "pending",
    ...(Object.keys(donor).length > 0 && { donor }),
  });
  return Response.json({ hash: inv.hash, bolt11: inv.bolt11, sats, kes });
}
export async function GET(req: Request) { // poll status: ?hash=
  const p = db.payments.get(new URL(req.url).searchParams.get("hash") ?? ""); return Response.json({ status: p?.status ?? "unknown" });
}
