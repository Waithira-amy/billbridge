import { handleUssd } from "@/lib/ussd";

// Africa's Talking USSD callback (form-encoded).
// Flow: category > institution PayBill (verified) > account > amount > confirm.
export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  let phoneNumber = "";
  let text = "";

  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    phoneNumber = String(body.phoneNumber ?? "");
    text = String(body.text ?? "");
  } else {
    const f = await req.formData();
    phoneNumber = String(f.get("phoneNumber") ?? "");
    text = String(f.get("text") ?? "");
  }

  const message = await handleUssd(text, phoneNumber);
  return new Response(message, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
