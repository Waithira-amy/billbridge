import { CATEGORIES, REGISTRY, createCampaign } from "@/lib/store";
import { sendSms } from "@/lib/sms";

export function normalizePhone(raw: string) {
  let p = String(raw ?? "").trim().replace(/[\s-]/g, "");
  if (!p) return "+254700000001";
  if (p.startsWith("07") && p.length >= 10) p = "+254" + p.slice(1);
  if (p.startsWith("254") && !p.startsWith("+")) p = "+" + p;
  if (!p.startsWith("+")) p = `+${p}`;
  return p;
}

export function appBaseUrl() {
  return (
    process.env.APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "http://localhost:3001"
  );
}

export function parseUssdText(text: string) {
  const t = String(text ?? "").trim();
  return t ? t.split("*") : [];
}

function examplePaybills(category: string) {
  return Object.entries(REGISTRY)
    .filter(([, inst]) => inst.category === category)
    .map(([paybill]) => paybill)
    .slice(0, 2)
    .join(" or ");
}

function accountPrompt(category: string) {
  if (category === "Education") return "Who is this bill for?\n(Student / admission no.)";
  if (category === "Medical") return "Who is this bill for?\n(Patient / invoice no.)";
  return "Who / what is this bill for?\n(Project or account no.)";
}

/** Africa's Talking–compatible USSD step handler. Returns CON/END plain text. */
export async function handleUssd(text: string, phoneNumber: string) {
  const phone = normalizePhone(phoneNumber);
  const s = parseUssdText(text);

  if (s.length === 0) {
    const menu = Object.entries(CATEGORIES)
      .map(([k, v]) => `${k}. ${v}`)
      .join("\n");
    return `CON BillBridge\nWhat are you fundraising for?\n${menu}`;
  }

  const sector = CATEGORIES[s[0]];
  if (!sector) return "END Invalid choice. Dial again and pick 1, 2 or 3.";

  if (s.length === 1) {
    return `CON ${sector} PayBill number:\n(e.g. ${examplePaybills(sector)})`;
  }

  const paybill = s[1];
  const inst = REGISTRY[paybill];
  if (!inst) {
    return "END This PayBill is not a registered institution. BillBridge only pays verified institutions, never personal wallets.";
  }

  if (inst.category !== sector) {
    return `END That PayBill is for ${inst.category}, not ${sector}. Use a ${sector} PayBill (e.g. ${examplePaybills(sector)}).`;
  }

  if (s.length === 2) {
    return `CON Verified: ${inst.name}\n${accountPrompt(sector)}`;
  }

  const accountRef = s[2]?.trim();
  if (!accountRef) return "END Account / person reference is required.";

  if (s.length === 3) return "CON Amount needed (KES):";

  const amt = parseInt(s[3], 10);
  if (!(amt > 0)) return "END Invalid amount.";

  if (s.length === 4) {
    return `CON Raise KES ${amt} for ${accountRef}\nat ${inst.name} (${sector})?\n1. Confirm\n2. Cancel`;
  }

  if (s[4] !== "1") return "END Cancelled.";

  const camp = createCampaign({
    paybill,
    accountRef,
    title: `${sector}: ${accountRef} @ ${inst.name}`,
    organizerPhone: phone,
    targetKes: amt,
  });

  if (!camp) {
    return "END Could not create campaign. Check the PayBill and try again.";
  }

  const link = `${appBaseUrl()}/donate/${camp.id}`;
  await sendSms(
    phone,
    `BillBridge campaign ${camp.id} is live for ${accountRef} at ${inst.name}. Share: ${link}`
  );
  return `END Campaign ${camp.id} is live.\nFor: ${accountRef}\nAt: ${inst.name}\nDonate: ${link}`;
}

export function stripUssdPrefix(raw: string) {
  const t = raw.trim();
  if (t.startsWith("CON ")) return { continuing: true, body: t.slice(4) };
  if (t.startsWith("END ")) return { continuing: false, body: t.slice(4) };
  return { continuing: false, body: t };
}
