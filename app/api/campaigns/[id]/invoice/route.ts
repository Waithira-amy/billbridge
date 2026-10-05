import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { amountKes, customerEmail, description } = body;

    // Bitnob Lightning endpoint requires amounts in Satoshis.
    // 1 KES is roughly 25 Satoshis. We calculate the satoshi amount here.
    const amountInSatoshis = Math.round(amountKes * 25); 

    // Both Sandbox and Production use the same base URL in Bitnob
    const response = await fetch("https://api.bitnob.com/api/lightning/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.BITNOB_SECRET_KEY}`
      },
      body: JSON.stringify({
        amount: amountInSatoshis > 0 ? amountInSatoshis : 1000, 
        description: description || "Donation",
        customerEmail: customerEmail || "donor@billbridge.io",
        reference: `BB-${id}-${Date.now()}` // Bitnob requires a unique reference
      })
    });

    // Read as text first to avoid a JSON crash if Bitnob returns an HTML firewall page
    const text = await response.text(); 

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Bitnob returned non-JSON (Likely IP Block):", text);
      return NextResponse.json({ error: "API connection blocked. Ensure your IP is whitelisted in Bitnob." }, { status: 403 });
    }

    if (!response.ok) {
      console.error("Bitnob API Error:", data);
      return NextResponse.json({ error: data.message || "Failed to generate invoice with Bitnob" }, { status: response.status });
    }

    return NextResponse.json({ 
      invoice: data.data?.invoice || data.data?.lightning_instructions?.invoice,
      trackingId: data.data?.id,
      message: "Invoice created successfully" 
    });

  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}