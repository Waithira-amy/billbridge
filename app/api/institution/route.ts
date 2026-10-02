import { db, REGISTRY } from "@/lib/store";
export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json({ campaigns: [...db.campaigns.values()].map(c => ({ id: c.id, institution: REGISTRY[c.paybill].name, paybill: c.paybill, accountRef: c.accountRef, targetKes: c.targetKes, raisedKes: c.raisedKes, status: c.status })), txs: db.txs.slice().reverse() });
}
