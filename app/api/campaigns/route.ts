import { db, REGISTRY, createCampaign } from "@/lib/store";
import { sendSms } from "@/lib/sms";
export const dynamic = "force-dynamic";
export async function GET() { // public list; organizer phone is never exposed
  return Response.json([...db.campaigns.values()].map(c => ({ id: c.id, title: c.title, institution: REGISTRY[c.paybill].name, category: REGISTRY[c.paybill].category, targetKes: c.targetKes, raisedKes: c.raisedKes, status: c.status })));
}
export async function POST(req: Request) {
  const b = await req.json(), target = Math.floor(Number(b.targetKes));
  if (!b.title || !b.accountRef || !b.organizerPhone || !(target > 0)) return Response.json({ error: "Fill in every field with a valid target." }, { status: 400 });
  const c = createCampaign({ paybill: String(b.paybill), accountRef: String(b.accountRef), title: String(b.title), organizerPhone: String(b.organizerPhone), targetKes: target });
  if (!c) return Response.json({ error: "This PayBill is not a registered institution. BillBridge only pays verified institutions, never personal wallets." }, { status: 422 });
  await sendSms(c.organizerPhone, `BillBridge campaign ${c.id} is live: ${process.env.APP_URL ?? "http://localhost:3000"}/pay/${c.id}`);
  return Response.json({ id: c.id, institution: REGISTRY[c.paybill].name });
}
