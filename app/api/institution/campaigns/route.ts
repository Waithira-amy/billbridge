import { createCampaign, db, REGISTRY } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    [...db.campaigns.values()].map((campaign) => ({
      id: campaign.id,
      title: campaign.title,
      accountRef: campaign.accountRef,
      targetKes: campaign.targetKes,
      raisedKes: campaign.raisedKes,
      status: campaign.status,
      institution: REGISTRY[campaign.paybill].name,
      paybill: campaign.paybill,
    }))
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const targetKes = Math.floor(Number(body.targetKes));
  const paybill = String(body.paybill ?? "");
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const accountRef = typeof body.accountRef === "string" ? body.accountRef.trim() : "";

  if (!title || !accountRef || !(targetKes > 0)) {
    return Response.json({ error: "Enter a title, account reference, and valid target amount." }, { status: 400 });
  }

  const campaign = createCampaign({
    paybill,
    title,
    accountRef,
    targetKes,
    organizerPhone: "institution-portal",
    status: "pending_approval",
  });

  if (!campaign) return Response.json({ error: "Select a verified institution PayBill." }, { status: 422 });

  return Response.json({ id: campaign.id, status: campaign.status, institution: REGISTRY[campaign.paybill].name });
}
