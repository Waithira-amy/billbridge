import { db, REGISTRY } from "./store";
import { sendSms } from "./sms";
// Called when a Lightning payment is confirmed. Payout destination is ALWAYS the verified institution paybill (never the organizer).
export async function confirmPayment(hash: string) {
  const p = db.payments.get(hash); if (!p || p.status === "paid") return p ?? null; // idempotent
  p.status = "paid"; const c = db.campaigns.get(p.campaignId)!, inst = REGISTRY[c.paybill];
  c.raisedKes += p.kes; if (c.raisedKes >= c.targetKes) c.status = "funded";
  const at = new Date().toISOString();
  db.txs.push({ campaignId: c.id, kind: "payment_received", kes: p.kes, ref: hash, at });
  // Swap sats -> KES and pay the institution's PayBill. Production: Daraja B2B or an LN-to-fiat provider.
  db.txs.push({ campaignId: c.id, kind: "settlement_to_institution", kes: p.kes, ref: `PAYBILL ${c.paybill} / ${c.accountRef} / MPESA-${hash.slice(0, 8).toUpperCase()}`, at });
  const left = Math.max(0, c.targetKes - c.raisedKes);
  await sendSms(c.organizerPhone, `BillBridge: KES ${p.kes} paid to ${inst.name} (acct ${c.accountRef}) for "${c.title}". Remaining: KES ${left}.`);
  return p;
}
