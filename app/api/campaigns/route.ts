import { randomBytes } from "node:crypto";
import { CampaignStatus, InstitutionVerificationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendSms } from "@/lib/sms";
export const dynamic = "force-dynamic";

export async function GET() {
  const campaigns = await prisma.campaign.findMany({
    where: {
      status: CampaignStatus.ACTIVE,
      institution: { verificationStatus: InstitutionVerificationStatus.VERIFIED },
    },
    include: { institution: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(campaigns.map((campaign) => ({
    id: campaign.publicId,
    title: campaign.title,
    institution: campaign.institution.name,
    category: campaign.institution.category,
    targetKes: campaign.targetKes,
    raisedKes: campaign.raisedKes,
    status: campaign.status.toLowerCase(),
  })));
}

export async function POST(req: Request) {
  const body: unknown = await req.json();
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Fill in every field with a valid target." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const paybill = typeof input.paybill === "string" ? input.paybill.trim() : "";
  const accountRef = typeof input.accountRef === "string" ? input.accountRef.trim() : "";
  const organizerPhone = typeof input.organizerPhone === "string" ? input.organizerPhone.trim() : "";
  const targetKes = Math.floor(Number(input.targetKes));

  if (!title || !paybill || !accountRef || !organizerPhone || !Number.isSafeInteger(targetKes) || targetKes <= 0) {
    return Response.json({ error: "Fill in every field with a valid target." }, { status: 400 });
  }

  const institution = await prisma.institution.findFirst({
    where: { paybill, verificationStatus: InstitutionVerificationStatus.VERIFIED },
  });
  if (!institution) {
    return Response.json({ error: "This PayBill is not a registered institution. BillBridge only pays verified institutions, never personal wallets." }, { status: 422 });
  }

  const publicId = `BB-${randomBytes(8).toString("hex").toUpperCase()}`;
  const campaign = await prisma.campaign.create({
    data: {
      publicId,
      title,
      accountRef,
      organizerPhone,
      targetKes,
      status: CampaignStatus.ACTIVE,
      institutionId: institution.id,
    },
  });

  const appUrl = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/+$/, "");
  await sendSms(campaign.organizerPhone, `BillBridge campaign ${campaign.publicId} is live: ${appUrl}/donate/${campaign.publicId}`);
  return Response.json({ id: campaign.publicId, institution: institution.name });
}
