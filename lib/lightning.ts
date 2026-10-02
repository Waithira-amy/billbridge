import { randomBytes } from "crypto";
const { LNBITS_URL, LNBITS_INVOICE_KEY, APP_URL, KES_PER_SAT = "0.12" } = process.env;
export const kesToSats = (kes: number) => Math.ceil(kes / Number(KES_PER_SAT));
export const demoMode = !LNBITS_INVOICE_KEY;
export async function createInvoice(sats: number, memo: string) {
  if (demoMode) { const hash = randomBytes(16).toString("hex"); return { hash, bolt11: `lnbc${sats}n1demo${hash}` }; }
  const r = await fetch(`${LNBITS_URL}/api/v1/payments`, { method: "POST",
    headers: { "X-Api-Key": LNBITS_INVOICE_KEY!, "Content-Type": "application/json" },
    body: JSON.stringify({ out: false, amount: sats, memo, webhook: `${APP_URL}/api/webhooks/lnbits` }) });
  if (!r.ok) throw new Error("LNbits error " + r.status);
  const d = await r.json(); return { hash: d.payment_hash as string, bolt11: (d.bolt11 ?? d.payment_request) as string };
}
