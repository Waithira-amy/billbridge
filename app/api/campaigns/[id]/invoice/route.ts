import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { amountKes, customerEmail, description } = body;

    // Bitnob's API requires the amount in USD cents. 
    // We do a rough conversion here (Assuming ~130 KES = $1.00 = 100 cents)
    const amountInCents = Math.round((amountKes / 130) * 100); 

    // Securely call the Bitnob Sandbox API
    const response = await fetch("https://sandboxapi.bitnob.co/api/v1/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.BITNOB_SECRET_KEY}`
      },
      body: JSON.stringify({
        amount: amountInCents > 0 ? amountInCents : 100, // Minimum charge is 100 cents
        customerEmail: customerEmail,
        description: description,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Bitnob API Error:", data);
      return NextResponse.json({ error: data.message || "Failed to generate invoice with Bitnob" }, { status: response.status });
    }

    // Extract the actual Lightning invoice string (BOLT11) from Bitnob's response
    const invoiceString = data.data?.lightning_instructions?.invoice || data.data?.invoice;

    return NextResponse.json({ 
      invoice: invoiceString,
      trackingId: data.data?.id,
      message: "Invoice created successfully" 
    });

  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}