import { db, REGISTRY, CATEGORIES } from "@/lib/store";
import { sendSms } from "@/lib/sms";
// Africa's Talking USSD callback (form-encoded). Flow: category > institution PayBill (verified instantly) > account no. > amount > confirm.
export async function POST(req: Request) {
  const f = await req.formData(); const phone = String(f.get("phoneNumber") ?? "").replace(/^ /, "+");
  const t = String(f.get("text") ?? ""), s = t ? t.split("*") : [];
  const res = (m: string) => new Response(m, { headers: { "Content-Type": "text/plain" } });
  if (s.length === 0) return res("CON BillBridge\nWhat are you fundraising for?\n" + Object.entries(CATEGORIES).map(([k, v]) => `${k}. ${v}`).join("\n"));
  if (!CATEGORIES[s[0]]) return res("END Invalid choice.");
  if (s.length === 1) return res("CON Institution PayBill number:");
  const inst = REGISTRY[s[1]];
  if (!inst) return res("END This PayBill is not a registered institution. BillBridge only pays verified institutions, never personal wallets.");
  if (s.length === 2) return res(`CON Verified: ${inst.name}\nAccount / student / invoice no:`);
  if (s.length === 3) return res("CON Amount needed (KES):");
  const amt = parseInt(s[3], 10); if (!(amt > 0)) return res("END Invalid amount.");
  if (s.length === 4) return res(`CON Raise KES ${amt} for ${inst.name}, acct ${s[2]}?\n1. Confirm\n2. Cancel`);
  if (s[4] !== "1") return res("END Cancelled.");
  const id = "BB-" + (1000 + db.campaigns.size + 1);
  db.campaigns.set(id, { id, paybill: s[1], accountRef: s[2], title: `${CATEGORIES[s[0]]}: acct ${s[2]}`, organizerPhone: phone, targetKes: amt, raisedKes: 0, status: "active" });
  await sendSms(phone, `BillBridge campaign ${id} is live. Share this link: ${process.env.APP_URL ?? "http://localhost:3000"}/pay/${id}`);
  return res(`END Campaign ${id} is live. Your share link is coming by SMS.`);
}
