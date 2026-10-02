"use client";

import Navbar from "@/components/Navbar";
import { QRCodeSVG } from "qrcode.react";
import { use, useEffect, useState } from "react";

const kes = (n: number) => "KES " + n.toLocaleString();

export default function Pay({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [bill, setBill] = useState<any>(null);
  const [inv, setInv] = useState<any>(null);
  const [err, setErr] = useState("");
  const [paid, setPaid] = useState(false);

  const storageKey = `billbridge_invoice_${id}`;

  const loadBill = async () => {
    try {
      const response = await fetch(`/api/campaigns/${id}`);
      const data = await response.json();
      setBill(data);
    } catch {
      setErr("Unable to load this campaign. Please try again.");
    }
  };

  useEffect(() => {
    loadBill();
  }, [id]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = sessionStorage.getItem(storageKey);
    if (!saved) return;

    try {
      setInv(JSON.parse(saved));
    } catch {
      sessionStorage.removeItem(storageKey);
    }
  }, [id, storageKey]);

  useEffect(() => {
    if (!inv || paid) return;

    const t = setInterval(async () => {
      try {
        const response = await fetch(`/api/campaigns/${id}/invoice?hash=${inv.hash}`);
        const status = await response.json();

        if (status.status === "paid") {
          setPaid(true);
          await loadBill();
        }
      } catch {
        setErr("Unable to check payment status. Please try again.");
      }
    }, 2000);

    return () => clearInterval(t);
  }, [inv, paid, id]);

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
        <h1 className="mb-2 text-xl font-bold text-blue-950">Campaign not found</h1>
        <p className="text-sm text-gray-500">
          This campaign may have been removed or the link may be incorrect.
        </p>
      </div>
    );
  }

  const pct = Math.min(100, Math.round((bill.raisedKes / bill.targetKes) * 100));
  const isDemoInvoice =
    typeof inv?.bolt11 === "string" && inv.bolt11.toLowerCase().includes("demo");

  if (!inv) {
    return shell(
      <div className="space-y-5 text-center">
        <div className="mb-2 text-3xl">⚡</div>
        <h1 className="text-xl font-extrabold text-blue-950">No payment request yet</h1>
        <p className="text-sm text-gray-500">
          Start a contribution for this campaign to generate the invoice.
        </p>
        <a
          href={`/donate/${id}`}
          className="mt-4 inline-block rounded-full bg-blue-950 px-5 py-3 text-sm font-bold text-white"
        >
          Choose an amount
        </a>
      </div>
    );
  }

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
          ✅ {bill.institution} · PayBill {bill.paybill} · Account {bill.accountRef}
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
          <span className="font-extrabold text-blue-950">{kes(bill.raisedKes)}</span>
          <span className="text-gray-400">
            {kes(bill.targetKes)} goal · {pct}%
          </span>
        </div>
      </div>

      {paid ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-green-100 bg-green-50 p-5 text-center">
            <div className="mb-3 text-4xl">✓</div>
            <h2 className="text-xl font-extrabold text-green-800">Payment Confirmed</h2>
            <p className="mt-2 text-sm text-green-700">Thank you for supporting this bill.</p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
              Payment receipt
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Campaign</span>
                <span className="text-right font-semibold text-blue-950">{bill.title}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-blue-950">{kes(Number(inv.kes || 0))}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Payment</span>
                <span className="font-semibold text-blue-950">Bitcoin Lightning</span>
              </div>
              {inv.hash && (
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
        </div>
      ) : (
        <div className="space-y-5">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              Payment request
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-blue-950">
              Pay {kes(Number(inv.kes || 0))}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              ≈ {Number(inv.sats || 0).toLocaleString()} sats
            </p>
          </div>

          <div className="flex justify-center rounded-2xl bg-white p-5">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
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
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(inv.bolt11);
              } catch {
                setErr("Unable to copy the Lightning invoice.");
              }
            }}
            className="w-full rounded-full border border-blue-950 py-3 text-sm font-bold text-blue-950 transition hover:bg-blue-950 hover:text-white"
          >
            Copy Lightning invoice
          </button>

          <div className="rounded-2xl bg-amber-50 p-4 text-center">
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-amber-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
            </div>
            <p className="text-sm font-semibold text-blue-950">Waiting for payment...</p>
            <p className="mt-1 text-xs text-gray-500">
              This page will update automatically once the payment is confirmed.
            </p>
          </div>

          {isDemoInvoice && (
            <button
              type="button"
              onClick={async () => {
                try {
                  const response = await fetch("/api/demo/pay", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ hash: inv.hash }),
                  });
                  const data = await response.json();
                  if (!response.ok) {
                    setErr(data.error || "Demo payment failed.");
                  }
                } catch {
                  setErr("Unable to complete the demo payment.");
                }
              }}
              className="w-full rounded-full bg-blue-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-900"
            >
              Demo: simulate wallet payment
            </button>
          )}

          <a
            href={`/donate/${id}`}
            className="block w-full text-center text-sm font-semibold text-gray-500 hover:text-blue-950"
          >
            ← Change contribution amount
          </a>
        </div>
      )}

      {err && !paid && (
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {err}
        </div>
      )}
    </>
  );
}