"use client";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function Start() {
  const r = useRouter(), [f, setF] = useState({ title: "", paybill: "", accountRef: "", targetKes: "", organizerPhone: "" }), [err, setErr] = useState("");
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  async function go() { setErr(""); const res = await fetch("/api/campaigns", { method: "POST", body: JSON.stringify(f) }), d = await res.json(); res.ok ? r.push(`/donate/${d.id}`) : setErr(d.error); }
  const L = (label: string, k: string, ph: string) => <label className="block text-sm font-bold text-blue-950">{label}<input className="mt-1 w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-blue-950 placeholder:text-gray-400 font-normal outline-none focus:ring-2 focus:ring-[#D4AF37]" placeholder={ph} value={(f as any)[k]} onChange={set(k)} /></label>;
  return (<><Navbar /><div className="min-h-screen bg-slate-50 px-6 pb-16 pt-28"><main className="mx-auto max-w-md space-y-4 rounded-[2rem] border border-gray-100 bg-white p-8 text-blue-950 shadow-xl">
    <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Direct funding</p>
    <h1 className="text-2xl font-extrabold tracking-tight text-blue-950">Start a Campaign</h1>
    <p className="text-sm text-gray-500">Funds are paid straight to a verified institution. Demo PayBills: 400200, 522001, 888880, 400300, 522002, 888881.</p>
    {L("Campaign title", "title", "e.g. Term 2 fees for Achieng")}{L("Institution PayBill", "paybill", "400200")}
    {L("Account / student / invoice no.", "accountRef", "ADM-2291")}{L("Target (KES)", "targetKes", "45000")}{L("Your phone (for SMS)", "organizerPhone", "+2547…")}
    <button onClick={go} className="w-full rounded-full bg-blue-950 py-4 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-blue-900">Verify & launch</button>{err && <p className="text-sm text-red-600">{err}</p>}
  </main></div></>);
}
