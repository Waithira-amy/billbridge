import {
  CampaignStatus,
  DonationStatus,
  InstitutionVerificationStatus,
  LedgerTransactionType,
  PrismaClient,
  UserRole,
} from "@prisma/client";

const prisma = new PrismaClient();

const institutions = [
  { paybill: "400200", name: "St. Mary's High School (demo)", category: "Education" },
  { paybill: "522001", name: "Kenyatta National Hospital (demo)", category: "Medical" },
  { paybill: "888880", name: "Maji Safi Trust (demo)", category: "Community" },
  { paybill: "400300", name: "Daystar University (demo)", category: "Education" },
  { paybill: "522002", name: "Aga Khan Hospital (demo)", category: "Medical" },
  { paybill: "888881", name: "Upendo Children's Home (demo)", category: "Community" },
];

const campaigns = [
  { publicId: "BB-1", paybill: "400200", accountRef: "DEMO-1", title: "Form 4 Tuition Arrears", organizerPhone: "+254700000001", targetKes: 50000, raisedKes: 41000, donations: [25000, 16000] },
  { publicId: "BB-2", paybill: "522001", accountRef: "DEMO-2", title: "Maternity Ward Discharge", organizerPhone: "+254700000002", targetKes: 150000, raisedKes: 136500, donations: [100000, 36500] },
  { publicId: "BB-3", paybill: "888880", accountRef: "DEMO-3", title: "Borehole Pump Repair", organizerPhone: "+254700000003", targetKes: 100000, raisedKes: 88000, donations: [50000, 38000] },
  { publicId: "BB-4", paybill: "400300", accountRef: "DEMO-4", title: "Final Year Exam Fees", organizerPhone: "+254700000004", targetKes: 60000, raisedKes: 27000, donations: [15000, 12000] },
  { publicId: "BB-5", paybill: "522002", accountRef: "DEMO-5", title: "Emergency Appendectomy", organizerPhone: "+254700000005", targetKes: 200000, raisedKes: 120000, donations: [80000, 40000] },
  { publicId: "BB-6", paybill: "888881", accountRef: "DEMO-6", title: "Solar Panel Installation", organizerPhone: "+254700000006", targetKes: 50000, raisedKes: 15000, donations: [10000, 5000] },
];

async function main() {
  const institutionIds = new Map();
  for (const institution of institutions) {
    const saved = await prisma.institution.upsert({
      where: { paybill: institution.paybill },
      update: {
        name: institution.name,
        category: institution.category,
        verificationStatus: InstitutionVerificationStatus.VERIFIED,
      },
      create: {
        ...institution,
        verificationStatus: InstitutionVerificationStatus.VERIFIED,
        verifiedAt: new Date("2026-01-01T00:00:00.000Z"),
      },
    });
    institutionIds.set(institution.paybill, saved.id);
  }

  const donorIds = [];
  for (let index = 1; index <= 6; index += 1) {
    const donor = await prisma.user.upsert({
      where: { email: `demo-donor-${index}@example.com` },
      update: { name: `Demo Donor ${index}`, role: UserRole.DONOR },
      create: {
        name: `Demo Donor ${index}`,
        email: `demo-donor-${index}@example.com`,
        role: UserRole.DONOR,
      },
    });
    donorIds.push(donor.id);
  }

  for (const campaign of campaigns) {
    const organizer = await prisma.user.upsert({
      where: { phone: campaign.organizerPhone },
      update: { name: `Demo Organizer ${campaign.publicId}`, role: UserRole.ORGANIZER },
      create: {
        name: `Demo Organizer ${campaign.publicId}`,
        phone: campaign.organizerPhone,
        role: UserRole.ORGANIZER,
      },
    });

    const savedCampaign = await prisma.campaign.upsert({
      where: { publicId: campaign.publicId },
      update: {
        title: campaign.title,
        accountRef: campaign.accountRef,
        organizerPhone: campaign.organizerPhone,
        targetKes: campaign.targetKes,
        raisedKes: campaign.raisedKes,
        status: CampaignStatus.ACTIVE,
        institutionId: institutionIds.get(campaign.paybill),
        organizerId: organizer.id,
      },
      create: {
        publicId: campaign.publicId,
        title: campaign.title,
        accountRef: campaign.accountRef,
        organizerPhone: campaign.organizerPhone,
        targetKes: campaign.targetKes,
        raisedKes: campaign.raisedKes,
        status: CampaignStatus.ACTIVE,
        institutionId: institutionIds.get(campaign.paybill),
        organizerId: organizer.id,
      },
    });

    for (const [index, amountKes] of campaign.donations.entries()) {
      const paymentHash = `demo-${campaign.publicId.toLowerCase()}-${index + 1}`;
      const donorId = donorIds[(Number(campaign.publicId.slice(3)) + index - 1) % donorIds.length];
      const donation = await prisma.donation.upsert({
        where: { paymentHash },
        update: {
          campaignId: savedCampaign.id,
          donorId,
          donorName: `Demo Donor ${(Number(campaign.publicId.slice(3)) + index - 1) % donorIds.length + 1}`,
          donorEmail: `demo-donor-${(Number(campaign.publicId.slice(3)) + index - 1) % donorIds.length + 1}@example.com`,
          amountKes,
          sats: Math.ceil(amountKes / 0.12),
          bolt11: `demo-only-${paymentHash}`,
          status: DonationStatus.PAID,
          paidAt: new Date("2026-10-01T12:00:00.000Z"),
        },
        create: {
          id: paymentHash,
          paymentHash,
          campaignId: savedCampaign.id,
          donorId,
          donorName: `Demo Donor ${(Number(campaign.publicId.slice(3)) + index - 1) % donorIds.length + 1}`,
          donorEmail: `demo-donor-${(Number(campaign.publicId.slice(3)) + index - 1) % donorIds.length + 1}@example.com`,
          amountKes,
          sats: Math.ceil(amountKes / 0.12),
          bolt11: `demo-only-${paymentHash}`,
          status: DonationStatus.PAID,
          paidAt: new Date("2026-10-01T12:00:00.000Z"),
        },
      });

      const transactionRows = [
        {
          id: `${paymentHash}-received`,
          type: LedgerTransactionType.PAYMENT_RECEIVED,
          reference: paymentHash,
          memo: "SIMULATED demo payment; no real funds received.",
        },
        {
          id: `${paymentHash}-settled`,
          type: LedgerTransactionType.SETTLEMENT_TO_INSTITUTION,
          reference: `DEMO-PAYBILL-${campaign.paybill}-${index + 1}`,
          memo: "SIMULATED demo settlement; no real payout made.",
        },
      ];

      for (const transaction of transactionRows) {
        await prisma.ledgerTransaction.upsert({
          where: { id: transaction.id },
          update: {
            campaignId: savedCampaign.id,
            donationId: donation.id,
            amountKes,
            sats: donation.sats,
            currency: "KES",
            type: transaction.type,
            reference: transaction.reference,
            memo: transaction.memo,
          },
          create: {
            ...transaction,
            campaignId: savedCampaign.id,
            donationId: donation.id,
            amountKes,
            sats: donation.sats,
            currency: "KES",
          },
        });
      }
    }
  }

  console.log("Seeded 6 demo institutions, 6 campaigns, 6 donors, 12 donations, and 24 simulated ledger entries.");
}

main()
  .catch((error) => {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
