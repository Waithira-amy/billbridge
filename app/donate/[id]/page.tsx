"use client";

import Navbar from "@/components/Navbar";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const kes = (n: number) => "KES " + n.toLocaleString();
const SUGGESTED_AMOUNTS = [500, 1000, 2500, 5000, 10000];

export default function Donate({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [bill, setBill] = useState<any>(null);
  const [amt, setAmt] = useState("");
  const [err, setErr] = useState("");
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  useEffect(() => {
    async function loadBill() {
      try {
        const response = await fetch(`/api/campaigns/${id}`);
        const data = await response.json();
        setBill(data);
      } catch {
        setErr("Unable to load this campaign. Please try again.");
      }
    }

    loadBill();
  }, [id]);

  async function submit() {
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

    setCreatingInvoice(true);

    try {
      const response = await fetch(`/api/campaigns/${id}/invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amountKes: amt }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErr(data.error || "Unable to create the payment request.");
        return;
      }

      sessionStorage.setItem(`billbridge_invoice_${id}`, JSON.stringify(data));
      router.push(`/pay/${id}`);
    } catch {
      setErr("Something went wrong while creating the payment.");
    } finally {
      setCreatingInvoice(false);
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
        <h1 className="mb-2 text-xl font-bold text-blue-950">Campaign not found</h1>
        <p className="text-sm text-gray-500">
          This campaign may have been removed or the link may be incorrect.
        </p>
      </div>
    );
  }

  return shell(
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
          Make a contribution
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-blue-950">
          {bill.title}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Verified payee: {bill.institution} · PayBill {bill.paybill}
        </p>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold text-gray-500">Suggested amounts</p>
        <div className="grid grid-cols-3 gap-2">
          {SUGGESTED_AMOUNTS.filter((amount) => amount <= bill.remainingKes).map((amount) => (
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
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="amount" className="mb-2 block text-sm font-semibold text-blue-950">
          Contribution amount
        </label>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
            KES
          </span>

          <input
            id="amount"
            list="quick-amounts"
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

        <datalist id="quick-amounts">
          {SUGGESTED_AMOUNTS.filter((amount) => amount <= bill.remainingKes).map((amount) => (
            <option key={amount} value={String(amount)} />
          ))}
        </datalist>

        <p className="mt-2 text-xs text-gray-400">Remaining bill: {kes(bill.remainingKes)}</p>
      </div>

      {err && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {err}
        </div>
      )}

      <button
        type="button"
        disabled={creatingInvoice || !amt}
        onClick={submit}
        className="w-full rounded-full bg-gradient-to-r from-[#D4AF37] to-amber-400 py-4 font-bold text-blue-950 shadow-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {creatingInvoice ? "Creating payment..." : "Generate Lightning payment"}
      </button>
    </div>
  );
}
