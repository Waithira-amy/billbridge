// In-memory store for the demo. Swap for Supabase using supabase/schema.sql (same shapes).
export type Institution = { name: string; category: string };
export type Campaign = { id: string; paybill: string; accountRef: string; title: string; organizerPhone: string;
  targetKes: number; raisedKes: number; status: "pending_approval" | "active" | "funded" };
export type DonorDetails = { name?: string; email?: string; phone?: string };
export type Payment = { hash: string; campaignId: string; kes: number; sats: number; bolt11: string; status: "pending" | "paid"; donor?: DonorDetails };
export type Tx = { campaignId: string; kind: string; kes: number; ref: string; at: string };
export const CATEGORIES: Record<string, string> = { "1": "Education", "2": "Medical", "3": "Community" };
// Demo stand-in for the registered-business database. Production: query a real registry/KYB provider.
export const REGISTRY: Record<string, Institution> = {
  "400200": { name: "St. Mary's High School (demo)", category: "Education" },
  "522001": { name: "Kenyatta National Hospital (demo)", category: "Medical" },
  "888880": { name: "Maji Safi Trust (demo)", category: "Community" },
  "400300": { name: "Daystar University (demo)", category: "Education" },
  "522002": { name: "Aga Khan Hospital (demo)", category: "Medical" },
  "888881": { name: "Upendo Children's Home (demo)", category: "Community" } };
type BillBridgeStore = { campaigns: Map<string, Campaign>; payments: Map<string, Payment>; txs: Tx[] };
const g = globalThis as typeof globalThis & { billbridge?: BillBridgeStore };
g.billbridge ??= { campaigns: new Map<string, Campaign>([
  ["BB-1", { id: "BB-1", paybill: "400200", accountRef: "DEMO-1", title: "Form 4 Tuition Arrears", organizerPhone: "+254700000001", targetKes: 50000, raisedKes: 41000, status: "active" }],
  ["BB-2", { id: "BB-2", paybill: "522001", accountRef: "DEMO-2", title: "Maternity Ward Discharge", organizerPhone: "+254700000002", targetKes: 150000, raisedKes: 136500, status: "active" }],
  ["BB-3", { id: "BB-3", paybill: "888880", accountRef: "DEMO-3", title: "Borehole Pump Repair", organizerPhone: "+254700000003", targetKes: 100000, raisedKes: 88000, status: "active" }],
  ["BB-4", { id: "BB-4", paybill: "400300", accountRef: "DEMO-4", title: "Final Year Exam Fees", organizerPhone: "+254700000004", targetKes: 60000, raisedKes: 27000, status: "active" }],
  ["BB-5", { id: "BB-5", paybill: "522002", accountRef: "DEMO-5", title: "Emergency Appendectomy", organizerPhone: "+254700000005", targetKes: 200000, raisedKes: 120000, status: "active" }],
  ["BB-6", { id: "BB-6", paybill: "888881", accountRef: "DEMO-6", title: "Solar Panel Installation", organizerPhone: "+254700000006", targetKes: 50000, raisedKes: 15000, status: "active" }]]),
  payments: new Map<string, Payment>(), txs: [] as Tx[] };
export const db: BillBridgeStore = g.billbridge;
export function createCampaign(c: { paybill: string; accountRef: string; title: string; organizerPhone: string; targetKes: number; status?: Campaign["status"] }) {
  if (!REGISTRY[c.paybill]) return null; // verification engine: only registered institutions
  const id = "BB-" + (1000 + db.campaigns.size + 1);
  const { status = "active", ...details } = c;
  const camp: Campaign = { id, ...details, raisedKes: 0, status }; db.campaigns.set(id, camp); return camp;
}
