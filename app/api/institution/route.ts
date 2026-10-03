import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const [campaigns, transactions] = await Promise.all([
    prisma.campaign.findMany({
      include: { institution: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.ledgerTransaction.findMany({
      include: { campaign: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return Response.json({
    campaigns: campaigns.map((campaign) => ({
      id: campaign.publicId,
      institution: campaign.institution.name,
      paybill: campaign.institution.paybill,
      accountRef: campaign.accountRef,
      targetKes: campaign.targetKes,
      raisedKes: campaign.raisedKes,
      status: campaign.status.toLowerCase(),
    })),
    txs: transactions.map((transaction) => ({
      campaignId: transaction.campaign.publicId,
      kind: transaction.type.toLowerCase(),
      kes: transaction.amountKes,
      ref: transaction.reference,
      at: transaction.createdAt.toISOString(),
    })),
  });
}
