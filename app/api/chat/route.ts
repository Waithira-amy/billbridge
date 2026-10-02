import { REGISTRY } from "@/lib/store";
const FACTS = `You are BillBridge's help assistant. BillBridge lets diaspora and community donors fund VERIFIED institutional bills (school fees, hospital bills, funerals, community projects) via Bitcoin Lightning. Facts:
- Organizers start a fundraiser on the web (/start) or by USSD (*384*99#): they enter the institution's PayBill and account number. The PayBill is checked against a registry of registered institutions; personal wallets are rejected.
- Donors open the campaign link, pick a KES amount, and pay a Lightning invoice with any Lightning wallet (e.g. Strike, Wallet of Satoshi). No Bitcoin knowledge needed; sats are swapped to KES and paid to the institution's PayBill, never to the organizer.
- Organizer, donor view and institution get SMS/dashboard confirmation. Fees are near-zero versus 10-15% on typical remittance/card routes.
- Pages: /#campaigns (browse), /start (create), /pay/<id> (donate), /institution (dashboard).
- Demo registry PayBills: ${Object.keys(REGISTRY).join(", ")}. Demo mode simulates payments.
Be brief, friendly, plain-language. If unsure, say so; never invent fees, legal or financial advice.`;
const FAQ: [RegExp, string][] = [
  [/start|create|organi[sz]|register/i, "Go to Start a fundraiser (/start), or dial *384*99#. You enter the institution's PayBill and account number; we verify it, then give you a share link."],
  [/pay|donat|send|lightning|wallet/i, "Open the campaign link, enter an amount in KES, and pay the Lightning invoice from any Lightning wallet. We convert it and pay the institution's PayBill."],
  [/safe|trust|verif|scam|divert/i, "Payouts go only to registry-verified institution PayBills, never to the organizer's personal wallet, so funds can't be diverted."],
  [/fee|cost|charge/i, "Lightning fees are tiny, so almost every shilling reaches the cause. That's a big difference from typical 10-15% remittance/card routes."],
  [/bitcoin|crypto/i, "You don't need to understand Bitcoin. Lightning works in the background; the institution receives normal shillings by PayBill."],
  [/ussd|feature phone|\*384/i, "Organizers can start a campaign from any phone by dialing *384*99# and following the menu."]];
type AnthropicTextBlock = { type?: string; text?: string };

export async function POST(req: Request) {
  const { messages } = await req.json(), last = String(messages.at(-1)?.content ?? "");
  const key = process.env.ANTHROPIC_API_KEY;
  if (key) try {
    const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5", max_tokens: 400, system: FACTS, messages: messages.slice(-10) }) });
    const d = await r.json();
    const textBlock = Array.isArray(d.content) ? d.content.find((b: AnthropicTextBlock) => b.type === "text") : undefined;
    const t = textBlock?.text;
    if (t) return Response.json({ reply: t });
  } catch {}
  return Response.json({ reply: FAQ.find(([re]) => re.test(last))?.[1] ?? "I can help with starting a fundraiser, donating, verification, fees and USSD. Which would you like to know about?" });
}
