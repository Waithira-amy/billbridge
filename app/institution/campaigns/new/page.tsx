"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const institutions = [["400200", "St. Mary's High School"], ["522001", "Kenyatta National Hospital"], ["888880", "Maji Safi Trust"], ["400300", "Daystar University"], ["522002", "Aga Khan Hospital"], ["888881", "Upendo Children's Home"]] as const;

export default function NewInstitutionCampaignPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/institution/campaigns", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: formData.get("title"), paybill: formData.get("paybill"), accountRef: formData.get("accountRef"), targetKes: formData.get("targetKes") }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error ?? "We could not submit this campaign."); setSubmitting(false); return; }
    router.push("/institution/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8"><div className="mx-auto max-w-2xl"><Link href="/institution/dashboard" className="text-sm font-semibold text-slate-600 hover:text-blue-950">Back to dashboard</Link><div className="mt-7 border border-slate-200 bg-white p-7 shadow-sm"><p className="text-sm font-semibold text-amber-700">Institution portal</p><h1 className="mt-2 text-3xl font-bold text-blue-950">Create campaign</h1><p className="mt-3 text-sm leading-6 text-slate-600">Submitting creates a private campaign for the BillBridge admin team to review. It will not be visible to donors until approval.</p>
      <form className="mt-7 space-y-5" onSubmit={submit}>
        <label className="block text-sm font-semibold text-slate-700">Campaign title<input name="title" required placeholder="e.g. Maternity ward equipment" className="mt-2 w-full border border-slate-300 bg-white px-3 py-3 font-normal text-slate-900 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100" /></label>
        <label className="block text-sm font-semibold text-slate-700">Verified institution<select name="paybill" required defaultValue="" className="mt-2 w-full border border-slate-300 bg-white px-3 py-3 font-normal text-slate-900 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100"><option value="" disabled>Select your institution</option>{institutions.map(([paybill, name]) => <option key={paybill} value={paybill}>{name} - PayBill {paybill}</option>)}</select></label>
        <label className="block text-sm font-semibold text-slate-700">Student, patient, or invoice reference<input name="accountRef" required placeholder="e.g. INV-2026-014" className="mt-2 w-full border border-slate-300 bg-white px-3 py-3 font-normal text-slate-900 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100" /></label>
        <label className="block text-sm font-semibold text-slate-700">Funding target (KES)<input name="targetKes" required min="1" type="number" inputMode="numeric" placeholder="50000" className="mt-2 w-full border border-slate-300 bg-white px-3 py-3 font-normal text-slate-900 outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-100" /></label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={submitting} className="w-full bg-blue-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-slate-400">{submitting ? "Submitting..." : "Submit for admin approval"}</button>
      </form>
    </div></div></main>
  );
}
