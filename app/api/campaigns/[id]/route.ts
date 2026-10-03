import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({
    where: { publicId: id },
    include: { institution: true },
  });

  if (!campaign) return Response.json({ error: "not found" }, { status: 404 });

  return Response.json({
    id: campaign.publicId,
    title: campaign.title,
    status: campaign.status.toLowerCase(),
    targetKes: campaign.targetKes,
    raisedKes: campaign.raisedKes,
    remainingKes: Math.max(0, campaign.targetKes - campaign.raisedKes),
    institution: campaign.institution.name,
    category: campaign.institution.category,
    paybill: campaign.institution.paybill,
    accountRef: campaign.accountRef,
  });
}
