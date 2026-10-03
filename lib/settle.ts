import { DonationStatus, LedgerTransactionType } from "@prisma/client";
import { prisma } from "./prisma";
import { sendSms } from "./sms";

export async function confirmPayment(hash: string) {
  const payment = await prisma.$transaction(async (transaction) => {
    const donation = await transaction.donation.findUnique({
      where: { paymentHash: hash },
      include: { campaign: { include: { institution: true } } },
    });

    if (!donation || donation.status === DonationStatus.PAID) return null;

    const claimed = await transaction.donation.updateMany({
      where: { id: donation.id, status: DonationStatus.PENDING },
      data: { status: DonationStatus.PAID, paidAt: new Date() },
    });
    if (claimed.count === 0) return null;

    const campaign = await transaction.campaign.update({
      where: { id: donation.campaignId },
      data: { raisedKes: { increment: donation.amountKes } },
    });

    if (campaign.raisedKes >= campaign.targetKes) {
      await transaction.campaign.update({
        where: { id: campaign.id },
        data: { status: "FUNDED" },
      });
    }

    await transaction.ledgerTransaction.createMany({
      data: [
        {
          campaignId: campaign.id,
          donationId: donation.id,
          type: LedgerTransactionType.PAYMENT_RECEIVED,
          amountKes: donation.amountKes,
          sats: donation.sats,
          reference: hash,
          memo: "Payment confirmed",
        },
        {
          campaignId: campaign.id,
          donationId: donation.id,
          type: LedgerTransactionType.SETTLEMENT_TO_INSTITUTION,
          amountKes: donation.amountKes,
          sats: donation.sats,
          reference: `PAYBILL ${donation.campaign.institution.paybill} / ${donation.campaign.accountRef} / MPESA-${hash.slice(0, 8).toUpperCase()}`,
          memo: "Payout simulation - not a real-world settlement",
        },
      ],
    });

    return {
      donation,
      raisedKes: campaign.raisedKes,
      targetKes: campaign.targetKes,
      title: campaign.title,
      publicId: campaign.publicId,
      organizerPhone: campaign.organizerPhone,
      accountRef: campaign.accountRef,
      institution: donation.campaign.institution.name,
    };
  });

  if (!payment) return null;

  const left = Math.max(0, payment.targetKes - payment.raisedKes);
  await sendSms(payment.organizerPhone, `BillBridge: KES ${payment.donation.amountKes} paid to ${payment.institution} (acct ${payment.accountRef}) for "${payment.title}". Remaining: KES ${left}.`);
  if (payment.donation.donorPhone) {
    const donorGreeting = payment.donation.donorName ? `, ${payment.donation.donorName}` : "";
    await sendSms(payment.donation.donorPhone, `BillBridge: Thank you${donorGreeting} for your KES ${payment.donation.amountKes} contribution to "${payment.title}". Your payment is confirmed.`);
  }

  return payment.donation;
}
