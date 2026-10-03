import { REGISTRY } from "@/lib/store";

const OFF_TOPIC_REPLY =
  "I only help with BillBridge — starting a fundraiser, donating, PayBill verification, Lightning payments, fees, escrow, and USSD. Ask me something about BillBridge.";

const FACTS = `You are BillBridge Help — the in-app assistant for BillBridge ONLY.

HARD RULE — stay on topic:
- Answer questions about BillBridge: fundraising, donations, money safety/trust, PayBill verification, Lightning/Bitcoin payments, fees, escrow, USSD, institutions, campaigns, and how to use this app.
- These ARE on-topic even if the user does not say "BillBridge": money safety, fees, starting a fundraiser, donating, verification, USSD, Bitcoin/Lightning.
- If the user asks about anything else (weather, sports, coding, homework, politics, other apps, jokes, recipes, news, math, etc.), do NOT answer it.
- For truly off-topic questions, reply with EXACTLY this sentence and nothing else:
"${OFF_TOPIC_REPLY}"
- Greetings like "hi" or "thanks" are OK — reply briefly and offer BillBridge help.

Use ONLY these product facts. Do not invent buttons, pages, or features that are not listed here.
Write clear English only. Never invent nonsense words or repeat syllables.

Product facts:
- Organizers start a fundraiser on the web at /start or by USSD (*384*99#): they enter the institution's PayBill and account number. The PayBill is checked against a registry of registered institutions; personal wallets are rejected.
- Donors open the campaign link, pick a KES amount, and pay a Lightning invoice with any Lightning wallet (e.g. Strike, Wallet of Satoshi). No Bitcoin knowledge needed; sats are swapped to KES and paid to the institution's PayBill, never to the organizer.
- Organizer, donor view and institution get SMS/dashboard confirmation. Fees are near-zero versus 10-15% on typical remittance/card routes.
- Pages: /#campaigns (browse), /start (create), /pay/<id> (donate), /institution (dashboard), /demo, /lightning, /institutions.
- Demo registry PayBills: ${Object.keys(REGISTRY).join(", ")}. Demo mode can simulate payments when Lightning keys are not configured.
- Escrow: donations are held until the campaign goal is met, then released to the verified institution PayBill.
- Refunds when a goal is not met are NOT available yet (roadmap only). Do not say money is refunded.

Style: 2-4 short sentences. Friendly, plain language. Answer directly. No thinking aloud.`;

/** Curated answers for the Help chip buttons — always correct, no model risk */
const WHAT_IS_BILLBRIDGE =
  "BillBridge is a fundraising platform for verified institutional bills — school fees, hospital bills, community projects. Organizers create a campaign with a registry-checked PayBill (web /start or USSD *384*99#); donors pay by Lightning, and funds go to the institution in KES — never to a personal wallet.";

const ON_TOPIC_FALLBACK =
  "I can help with what BillBridge is, starting a fundraiser, donating, verification, fees, and USSD. Which would you like to know about?";

const PRESET_ANSWERS: Record<string, string> = {
  billbridge: WHAT_IS_BILLBRIDGE,
  "what is billbridge": WHAT_IS_BILLBRIDGE,
  "what is billbridge?": WHAT_IS_BILLBRIDGE,
  "how do i start a fundraiser?":
    "Go to Start a fundraiser (/start), or dial *384*99#. Enter the institution's PayBill and account number; we verify it against the registry, then give you a share link.",
  "is my money safe?":
    "Yes. Donations are held in escrow and released only to the verified institution's PayBill once the campaign goal is met — never to the organizer's personal wallet. Personal wallets are rejected.",
  "what are the fees?":
    "Lightning fees are tiny, so almost every shilling reaches the cause. That's a big difference from typical 10-15% remittance or card routes.",
};

const FAQ: [RegExp, string][] = [
  [/^(what is |who are you|about |explain )?billbridge\??$/i, WHAT_IS_BILLBRIDGE],
  [/what is billbridge|who are you|about billbridge|explain billbridge/i, WHAT_IS_BILLBRIDGE],
  [/start|create|organi[sz]|register/i, PRESET_ANSWERS["how do i start a fundraiser?"]],
  [/safe|trust|scam|divert|money/i, PRESET_ANSWERS["is my money safe?"]],
  [/escrow|held until|released to/i, "Donations are held in escrow until the campaign goal is met, then released to the verified institution's PayBill. The organizer never receives the funds. Refunds are not available in the current demo."],
  [/fee|cost|charge/i, PRESET_ANSWERS["what are the fees?"]],
  [/pay|donat|send|lightning|wallet/i, "Open the campaign link, enter an amount in KES, and pay the Lightning invoice from any Lightning wallet. We convert it and pay the institution's PayBill — never the organizer."],
  [/verif|registry|paybill/i, "We check the PayBill against a registry of registered institutions. Personal wallets are rejected, so payouts can only go to verified institution PayBills."],
  [/bitcoin|crypto/i, "You don't need to understand Bitcoin. Lightning works in the background; the institution receives normal shillings by PayBill."],
  [/ussd|feature phone|\*384/i, "Organizers can start a campaign from any phone by dialing *384*99# and following the menu."],
];

const FREE_MODELS = [
  "nvidia/nemotron-3.5-lightning:free",
  "google/gemma-4-26b-a4b-it:free",
  "qwen/qwen3.8-27b:free",
  "thinkingmachines/inkling-small:free",
];

const ON_TOPIC =
  /billbridge|fundrais|donat|paybill|pay\b|lightning|bitcoin|wallet|ussd|\*384|escrow|fee|verif|institut|school|hospital|funeral|campaign|sats|mpesa|m-pesa|remittance|organi[sz]|donor|invoice|registry|account|kes|shilling|strike|feature phone|safe|trust|scam|cost|charge|crypto|contribute|share link|payout|goal|demo|how (do|to|can|does)|start|help|money|send|receive/i;

const CLEARLY_OFF_TOPIC =
  /\b(weather|forecast|python|javascript|typescript|homework|recipe|cook|football|soccer|cricket|politics|president|movie|netflix|joke|poem|translate this|capital of|who won|write (me )?(a |an )?(function|script|essay|poem))\b/i;

const GREETING = /^(hi|hello|hey|thanks|thank you|ok|okay|yo|hola)\b/i;

type ChatMessage = { role?: string; content?: string };

function normalizeQuestion(q: string) {
  return q.trim().toLowerCase().replace(/\s+/g, " ");
}

function isOffTopic(question: string) {
  const t = question.trim();
  if (!t) return true;
  if (GREETING.test(t) && t.length < 40) return false;
  if (PRESET_ANSWERS[normalizeQuestion(t)]) return false;
  // Even if a broad ON_TOPIC word matches, block clear off-topic (e.g. "how do I cook")
  if (CLEARLY_OFF_TOPIC.test(t)) return true;
  // Default deny: only BillBridge-related wording goes to the model / FAQ
  return !ON_TOPIC.test(t);
}

function isStockOffTopicReply(reply: string) {
  return /i only help with billbridge/i.test(reply);
}

/** Catch free-model gibberish like "Yourellsellsellsells" */
function isGarbledReply(text: string) {
  const t = text.trim();
  if (!t) return true;
  if (/([a-z]{3,})\1{2,}/i.test(t)) return true; // sellsellsell
  if (/(.)\1{5,}/i.test(t)) return true; // llllll
  if (/yourell|sellsell|lllll|zzzzz|aaaaaa/i.test(t)) return true;
  // Too few real English words relative to length
  const words = t.split(/\s+/).filter(Boolean);
  const weird = words.filter((w) => /^[a-z]*([a-z]{2,})\1+[a-z]*$/i.test(w) && w.length > 10);
  if (weird.length > 0) return true;
  return false;
}

function faqReply(last: string) {
  const preset = PRESET_ANSWERS[normalizeQuestion(last)];
  if (preset) return preset;
  if (isOffTopic(last)) return OFF_TOPIC_REPLY;
  return FAQ.find(([re]) => re.test(last))?.[1] ?? ON_TOPIC_FALLBACK;
}

function cleanReply(text: string) {
  let t = text.trim();
  const markers = [
    /(?:^|\n)\s*(?:final answer|answer)\s*:\s*/i,
    /(?:^|\n)\s*(?:here's (?:the )?(?:final )?answer)\s*:\s*/i,
  ];
  for (const re of markers) {
    const m = t.match(re);
    if (m && m.index != null) t = t.slice(m.index + m[0].length).trim();
  }
  if (
    /here's a thinking process/i.test(t) ||
    /^1\.\s+\*\*Analyze/i.test(t) ||
    /feasibility\s*:/i.test(t) ||
    /i need to answer about/i.test(t) ||
    /let me recall the product facts/i.test(t)
  ) {
    return "";
  }
  if (isGarbledReply(t)) return "";
  // Free models sometimes invent refunds — not in product yet
  if (/\brefund/i.test(t)) return "";
  return t;
}

function looksLikeOffTopicAnswer(userQuestion: string, reply: string) {
  if (!isOffTopic(userQuestion)) return false;
  return !isStockOffTopicReply(reply);
}

async function askOpenRouter(key: string, model: string, messages: { role: string; content: string }[], appUrl: string) {
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": appUrl,
      "X-OpenRouter-Title": "BillBridge Help",
    },
    body: JSON.stringify({
      model,
      max_tokens: 300,
      temperature: 0,
      reasoning: { effort: "none" },
      messages,
    }),
  });

  const d = await r.json();
  if (!r.ok) return null;
  const raw = d?.choices?.[0]?.message?.content;
  if (typeof raw !== "string") return null;
  const cleaned = cleanReply(raw);
  return cleaned || null;
}

export async function POST(req: Request) {
  const { messages } = await req.json() as { messages?: ChatMessage[] };
  const history = Array.isArray(messages) ? messages : [];
  const last = String(history.at(-1)?.content ?? "");

  // Preset Help chips: always return curated correct answers
  const preset = PRESET_ANSWERS[normalizeQuestion(last)];
  if (preset) {
    return Response.json({ reply: preset });
  }

  if (isOffTopic(last)) {
    return Response.json({ reply: OFF_TOPIC_REPLY });
  }

  const key = process.env.OPENROUTER_API_KEY?.trim();
  if (key) {
    const preferred = process.env.OPENROUTER_MODEL?.trim();
    const models = preferred
      ? [preferred, ...FREE_MODELS.filter((m) => m !== preferred)]
      : FREE_MODELS;
    const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

    const openRouterMessages = [
      { role: "system", content: FACTS },
      ...history
        .slice(-10)
        .filter((m) => m?.role === "user" || m?.role === "assistant")
        .map((m) => ({ role: m.role as string, content: String(m.content ?? "") })),
    ];

    for (const model of models) {
      try {
        const reply = await askOpenRouter(key, model, openRouterMessages, appUrl);
        if (!reply) continue;
        if (isStockOffTopicReply(reply) && !isOffTopic(last)) {
          return Response.json({ reply: faqReply(last) });
        }
        if (looksLikeOffTopicAnswer(last, reply)) {
          return Response.json({ reply: OFF_TOPIC_REPLY });
        }
        return Response.json({ reply });
      } catch {
        // try next free model
      }
    }
  }

  return Response.json({ reply: faqReply(last) });
}
