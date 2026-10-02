"use client";

import Navbar from "@/components/Navbar";
import ShareButton from "@/components/ShareButton";
import { QRCodeSVG } from "qrcode.react";
import { use, useEffect, useState } from "react";

const kes = (n: number) => "KES " + n.toLocaleString();
const SUGGESTED_AMOUNTS = [500, 1000, 2500, 5000, 10000];

export default function Pay({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [bill, setBill] = useState<any>(null);
  const [amt, setAmt] = useState("");
  const [inv, setInv] = useState<any>(null);
  const [err, setErr] = useState("");
  const [paid, setPaid] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [copied, setCopied] = useState(false);
  const [demoPaying, setDemoPaying] = useState(false);

  // Reload the bill so the funding progress stays in sync after a payment lands.
  const load = async () => {
    try {
      const response = await fetch(`/api/campaigns/${id}`);
      const data = await response.json();

      setBill(data);
    } catch {
      setErr("Unable to load this campaign. Please try again.");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  // Poll the backend until the Lightning payment confirms and the campaign is updated.
  useEffect(() => {
    if (!inv || paid) return;

    const t = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/campaigns/${id}/invoice?hash=${inv.hash}`
        );

        const status = await response.json();

          if (status.status === "paid") {
          setPaid(true);
          await load();
        }
      } catch {
        setErr("Unable to check payment status. Please try again.");
      }
    }, 2000);

    return () => clearInterval(t);
  }, [inv, paid, id]);

  async function pay() {
    setErr("");

    const amount = Number(amt);
    if (!amount || amount <= 0) {
      setErr("Please enter a valid contribution amount.");
      return;
    }

    if (bill && amount > bill.remainingKes) {
      setErr(
        `The remaining bill is ${kes(bill.remainingKes)}. Please enter a smaller amount.`
      );
      return;
    }

    // Keep the donation state consistent before creating a new invoice.
    setCreatingInvoice(true);
    setInv(null);
    setPaid(false);
    setCopied(false);

    try {
      const response = await fetch(`/api/campaigns/${id}/invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amountKes: amt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErr(data.error || "Unable to create the payment request.");
        return;
      }

      // Store the invoice so the QR code, copied text, and payment-waiting state can render.
      setInv(data);
    } catch {
      setErr("Something went wrong while creating the payment.");
    } finally {
      setCreatingInvoice(false);
    }
  }

  async function copyInvoice() {
    if (!inv?.bolt11) return;

    try {
      await navigator.clipboard.writeText(inv.bolt11);

      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch {
      setErr("Unable to copy the Lightning invoice.");
    }
  }

  async function simulateDemoPayment() {
    if (!inv?.hash) return;

    setDemoPaying(true);
    setErr("");

    try {
      const response = await fetch("/api/demo/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hash: inv.hash,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErr(data.error || "Demo payment failed.");
      }

      
    } catch {
      setErr("Unable to complete the demo payment.");
    } finally {
      setDemoPaying(false);
    }
  }

  const shell = (content: React.ReactNode) => (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 px-6 pb-16 pt-28">
        <main className="mx-auto max-w-md rounded-[2rem] border border-gray-100 bg-white p-8 text-blue-950 shadow-xl">
          {content}
        </main>
      </div>
    </>
  );

  if (!bill) {
    return shell(
      <div className="py-10 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-950" />

        <p className="text-gray-500">Loading campaign...</p>
      </div>
    );
  }

  if (bill.error) {
    return shell(
      <div className="py-10 text-center">
        <p className="mb-2 text-4xl">😕</p>

        <h1 className="mb-2 text-xl font-bold text-blue-950">
          Campaign not found
        </h1>

        <p className="text-sm text-gray-500">
          This campaign may have been removed or the link may be incorrect.
        </p>
      </div>
    );
  }

  const pct = Math.min(
    100,
    Math.round((bill.raisedKes / bill.targetKes) * 100)
  );

  const isDemoInvoice =
    typeof inv?.bolt11 === "string" &&
    inv.bolt11.toLowerCase().includes("demo");

  return shell(
    <>
      <div className="mb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
          Verified payment destination
        </p>

        <h1 className="text-2xl font-extrabold tracking-tight text-blue-950">
          {bill.title}
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          ✅ {bill.institution}
          {" · "}
          PayBill {bill.paybill}
          {" · "}
          Account {bill.accountRef}
        </p>

        <p className="mt-2 text-xs text-gray-400">
          Funds are directed to the verified payment destination rather than
          the organizer's personal wallet.
        </p>
      </div>

      <div className="mb-7">
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-amber-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-2 flex justify-between text-sm">
          <span className="font-extrabold text-blue-950">
            {kes(bill.raisedKes)}
          </span>

          <span className="text-gray-400">
            {kes(bill.targetKes)} goal · {pct}%
          </span>
        </div>
      </div>

      {paid ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-green-100 bg-green-50 p-5 text-center">
            <div className="mb-3 text-4xl">✓</div>

            <h2 className="text-xl font-extrabold text-green-800">
              Payment Confirmed
            </h2>

            <p className="mt-2 text-sm text-green-700">
              Thank you for supporting this bill.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
              Payment receipt
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Campaign</span>

                <span className="text-right font-semibold text-blue-950">
                  {bill.title}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Amount</span>

                <span className="font-bold text-blue-950">
                  {kes(Number(inv?.kes || amt))}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Payment</span>

                <span className="font-semibold text-blue-950">
                  Bitcoin Lightning
                </span>
              </div>

              {inv?.hash && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Reference</span>

                  <span className="max-w-[180px] truncate font-mono text-xs text-blue-950">
                    {inv.hash}
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Status</span>

                <span className="font-bold text-green-700">Paid</span>
              </div>
            </div>
          </div>

          <ShareButton
            text={`I contributed to "${bill.title}" on BillBridge. You can support the verified bill here:`}
            path={`/pay/${id}`}
            className="block w-full rounded-full bg-blue-950 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-900"
          >
            Share on WhatsApp
          </ShareButton>
        </div>
      ) : inv ? (
        
        <div className="space-y-5">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              Payment request
            </p>

            <h2 className="mt-1 text-xl font-extrabold text-blue-950">
              Pay {kes(Number(inv.kes || amt))}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              ≈ {Number(inv.sats || 0).toLocaleString()} sats
            </p>
          </div>

          <div className="flex justify-center rounded-2xl bg-white p-5">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              {/* The QR code is generated from the Lightning invoice so a wallet can scan it directly. */}
              <QRCodeSVG
                value={inv.bolt11}
                size={220}
                level="M"
                marginSize={4}
                title="Bitcoin Lightning payment QR code"
              />
            </div>
          </div>

          <p className="text-center text-xs text-gray-500">
            Scan this QR code with your Lightning wallet to make the payment.
          </p>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
              Lightning invoice
            </label>

            <textarea
              readOnly
              className="w-full break-all rounded-xl border border-gray-200 bg-slate-50 p-3 text-xs text-blue-950 outline-none"
              rows={4}
              value={inv.bolt11}
              onFocus={(e) => e.currentTarget.select()}
            />
          </div>

          <button
            type="button"
            onClick={copyInvoice}
            className="w-full rounded-full border border-blue-950 py-3 text-sm font-bold text-blue-950 transition hover:bg-blue-950 hover:text-white"
          >
            {copied ? "✓ Invoice copied" : "Copy Lightning invoice"}
          </button>

          <div className="rounded-2xl bg-amber-50 p-4 text-center">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-amber-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            </div>

            <p className="text-sm font-semibold text-blue-950">
              Waiting for payment...
            </p>

            <p className="mt-1 text-xs text-gray-500">
              This page will update automatically once the payment is
              confirmed.
            </p>
          </div>

          {isDemoInvoice && (
            <button
              type="button"
              disabled={demoPaying}
              onClick={simulateDemoPayment}
              className="w-full rounded-full bg-blue-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {demoPaying
                ? "Processing demo payment..."
                : "Demo: simulate wallet payment"}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setInv(null);
              setErr("");
            }}
            className="w-full text-sm font-semibold text-gray-500 hover:text-blue-950"
          >
            ← Change contribution amount
          </button>
        </div>
      ) : bill.remainingKes > 0 ? (
        <div className="space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              Make a contribution
            </p>

            <h2 className="mt-1 text-xl font-extrabold text-blue-950">
              Choose your amount
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Every contribution goes toward this verified bill.
            </p>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold text-gray-500">
              Suggested amounts
            </p>

            <div className="grid grid-cols-3 gap-2">
              {SUGGESTED_AMOUNTS.map((amount) => {
                if (amount > bill.remainingKes) return null;

                return (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setAmt(String(amount))}
                    className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${
                      amt === String(amount)
                        ? "border-blue-950 bg-blue-950 text-white"
                        : "border-gray-200 bg-white text-blue-950 hover:border-blue-950"
                    }`}
                  >
                    {kes(amount)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="amount"
              className="mb-2 block text-sm font-semibold text-blue-950"
            >
              Contribution amount
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                KES
              </span>

              <input
                id="amount"
                className="w-full rounded-xl border border-gray-200 bg-slate-50 py-4 pl-14 pr-4 text-blue-950 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                type="number"
                min="1"
                max={bill.remainingKes}
                step="1"
                placeholder="Enter amount"
                value={amt}
                onChange={(e) => {
                  setAmt(e.target.value);
                  setErr("");
                }}
              />
            </div>

            <p className="mt-2 text-xs text-gray-400">
              Remaining bill: {kes(bill.remainingKes)}
            </p>
          </div>

          {err && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
              {err}
            </div>
          )}

          <button
            type="button"
            disabled={creatingInvoice || !amt}
            onClick={pay}
            className="w-full rounded-full bg-gradient-to-r from-[#D4AF37] to-amber-400 py-4 font-bold text-blue-950 shadow-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creatingInvoice
              ? "Creating payment..."
              : "Generate Lightning payment"}
          </button>

          <p className="text-center text-xs text-gray-400">
            You will receive a Lightning payment request after continuing.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-green-50 p-5 text-center">
          <div className="mb-2 text-3xl">✓</div>

          <h2 className="font-bold text-green-800">Bill fully funded</h2>

          <p className="mt-1 text-sm text-green-700">
            This campaign has reached its funding target.
          </p>
        </div>
      )}

      {!paid && !inv && err && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {err}
        </div>
      )}

      {!paid && (
        <ShareButton
          text={`Please help fund "${bill.title}" (verified payee: ${bill.institution}) on BillBridge:`}
          path={`/pay/${id}`}
          className="block w-full rounded-full border border-blue-950 py-3 text-center text-sm font-bold text-blue-950 transition hover:bg-blue-950 hover:text-white"
        >
          Share on WhatsApp
        </ShareButton>
      )}
    </>
  );
}