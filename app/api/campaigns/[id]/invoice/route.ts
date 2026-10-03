import { DonationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createInvoice, kesToSats } from "@/lib/lightning";
import { isValidDonorEmail, isValidDonorName, isValidDonorPhone } from "@/lib/donor-validation";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({ where: { publicId: id } });
  if (!campaign) return Response.json({ error: "not found" }, { status: 404 });

  const body: unknown = await req.json();
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Enter a valid donation amount." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const remaining = campaign.targetKes - campaign.raisedKes;
  const kes = Math.floor(Number(input.amountKes));
  if (!(kes > 0) || kes > remaining) return Response.json({ error: `Amount must be 1-${remaining}` }, { status: 400 });

  const details = input.donorDetails && typeof input.donorDetails === "object"
    ? input.donorDetails as Record<string, unknown>
    : {};
  const name = typeof details.name === "string" ? details.name.trim() : "";
  const email = typeof details.email === "string" ? details.email.trim() : "";
  const phone = typeof details.phone === "string" ? details.phone.replace(/[\s().-]/g, "") : "";
  if (!isValidDonorName(name)) {
    return Response.json({ error: "Name can only contain letters and spaces (up to 100 characters)." }, { status: 400 });
  }
  if (!isValidDonorEmail(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (phone && !isValidDonorPhone(phone)) {
    return Response.json({ error: "Enter a valid phone number for the selected country." }, { status: 400 });
  }

  const sats = kesToSats(kes);
  const donation = await prisma.donation.create({
    data: {
      campaignId: campaign.id,
      amountKes: kes,
      sats,
      donorName: name || null,
      donorEmail: email || null,
      donorPhone: phone || null,
    },
  });

  try {
    const invoice = await createInvoice(sats, `BillBridge ${campaign.publicId}`);
    await prisma.donation.update({
      where: { id: donation.id },
      data: { paymentHash: invoice.hash, bolt11: invoice.bolt11 },
    });
    return Response.json({ hash: invoice.hash, bolt11: invoice.bolt11, sats, kes });
  } catch (error) {
    await prisma.donation.update({
      where: { id: donation.id },
      data: { status: DonationStatus.FAILED },
    });
    console.error("Unable to create a donation invoice:", error);
    return Response.json({ error: "Unable to create a payment request. Please try again." }, { status: 502 });
  }
}

export async function GET(req: Request) {
  const paymentHash = new URL(req.url).searchParams.get("hash");
  if (!paymentHash) return Response.json({ status: "unknown" });

  const donation = await prisma.donation.findUnique({
    where: { paymentHash },
    select: { status: true },
  });
  return Response.json({ status: donation?.status.toLowerCase() ?? "unknown" });
}
