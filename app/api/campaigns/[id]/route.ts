import { db, REGISTRY } from "@/lib/store";
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const c = db.campaigns.get((await params).id); if (!c) return Response.json({ error: "not found" }, { status: 404 });
  const i = REGISTRY[c.paybill]; // never expose organizer phone publicly
  return Response.json({ id: c.id, title: c.title, status: c.status, targetKes: c.targetKes, raisedKes: c.raisedKes, remainingKes: Math.max(0, c.targetKes - c.raisedKes), institution: i.name, category: i.category, paybill: c.paybill, accountRef: c.accountRef });
}
