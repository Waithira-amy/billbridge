import { confirmPayment } from "@/lib/settle";
import { demoMode } from "@/lib/lightning";
export async function POST(req: Request) { // demo only: simulates a donor's wallet paying the invoice
  if (!demoMode) return Response.json({ error: "disabled" }, { status: 403 });
  await confirmPayment((await req.json()).hash); return Response.json({ ok: true });
}
