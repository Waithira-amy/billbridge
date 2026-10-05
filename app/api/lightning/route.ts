import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, description, customerEmail } = body;

    // Bitnob Sandbox Endpoint for creating a charge (invoice)
    const response = await fetch("https://sandboxapi.bitnob.co/api/v1/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.BITNOB_SECRET_KEY}`
      },
      body: JSON.stringify({
        amount: amount, 
        description: description,
        customerEmail: customerEmail
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.message }, { status: response.status });
    }

    // Return the generated Lightning invoice string back to your frontend
    return NextResponse.json({ 
      invoice: data.data.lightning_instructions.invoice
    });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}