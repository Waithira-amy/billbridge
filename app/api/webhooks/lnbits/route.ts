import { confirmPayment } from "@/lib/settle";
// LNbits calls this when an invoice is paid. NOTE: in production verify via LNbits GET /api/v1/payments/{hash} before trusting.
export async function POST(req: Request) { const { payment_hash } = await req.json(); await confirmPayment(payment_hash); return Response.json({ ok: true }); }
