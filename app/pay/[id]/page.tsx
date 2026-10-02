"use client";
import Navbar from "@/components/Navbar";
import ShareButton from "@/components/ShareButton";
import { use, useEffect, useState } from "react";
const kes = (n: number) => "KES " + n.toLocaleString();
export default function Pay({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [bill, setBill] = useState<any>(null), [amt, setAmt] = useState(""), [inv, setInv] = useState<any>(null), [err, setErr] = useState(""), [paid, setPaid] = useState(false);
  const load = () => fetch(`/api/campaigns/${id}`).then(r => r.json()).then(setBill);
  useEffect(() => { load(); }, [id]);
  useEffect(() => { // poll until the Lightning payment confirms
    if (!inv || paid) return;
    const t = setInterval(async () => { const s = await (await fetch(`/api/campaigns/${id}/invoice?hash=${inv.hash}`)).json(); if (s.status === "paid") { setPaid(true); load(); } }, 2000);
    return () => clearInterval(t);
  }, [inv, paid]);
  async function pay() {
    setErr(""); const r = await fetch(`/api/campaigns/${id}/invoice`, { method: "POST", body: JSON.stringify({ amountKes: amt }) }), d = await r.json();
    r.ok ? setInv(d) : setErr(d.error);
  }
  const shell = (c: React.ReactNode) => <><Navbar /><div className="min-h-screen bg-slate-50 px-6 pb-16 pt-28"><main className="mx-auto max-w-md space-y-5 rounded-[2rem] border border-gray-100 bg-white p-8 text-blue-950 shadow-xl">{c}</main></div></>;
  if (!bill) return shell(<p className="text-gray-500">Loading…</p>);
  if (bill.error) return shell(<p className="text-gray-500">Campaign not found.</p>);
  const pct = Math.min(100, Math.round((bill.raisedKes / bill.targetKes) * 100));
  return shell(<>
    <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Payee (verified)</p>
    <h1 className="text-2xl font-extrabold tracking-tight text-blue-950">{bill.title}</h1>
    <p className="text-sm text-gray-500">✅ {bill.institution} · PayBill {bill.paybill} · Acct {bill.accountRef}. Funds go straight here, never to the organizer.</p>
    <div><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-amber-400" style={{ width: pct + "%" }} /></div>
      <div className="mt-2 flex justify-between text-sm"><span className="font-extrabold text-blue-950">{kes(bill.raisedKes)}</span><span className="text-gray-400">{kes(bill.targetKes)} goal · {pct}%</span></div></div>
    {paid ? <p className="rounded-2xl bg-amber-50 p-4 text-sm font-medium text-blue-950">🎉 Payment confirmed. The organizer and institution have been notified. Thank you!</p>
      : inv ? <div className="space-y-3">
          <p className="text-sm text-blue-950">Pay <b>{inv.sats.toLocaleString()} sats</b> (≈ {kes(inv.kes)}) with any Lightning wallet:</p>
          <textarea readOnly className="w-full break-all rounded-xl border border-gray-200 bg-slate-50 p-3 text-xs text-blue-950" rows={4} value={inv.bolt11} />
          {inv.bolt11.includes("demo") && <button className="rounded-full bg-blue-950 px-4 py-2 text-xs font-bold text-white hover:bg-blue-900" onClick={() => fetch("/api/demo/pay", { method: "POST", body: JSON.stringify({ hash: inv.hash }) })}>Demo: simulate wallet payment</button>}
          <p className="text-xs text-gray-400">Waiting for payment…</p></div>
      : bill.remainingKes > 0 && <div className="space-y-3">
          <input className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-blue-950 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#D4AF37]" type="number" placeholder="Amount (KES)" value={amt} onChange={e => setAmt(e.target.value)} />
          <button className="w-full rounded-full bg-gradient-to-r from-[#D4AF37] to-amber-400 py-4 font-bold text-blue-950 shadow-md transition hover:-translate-y-0.5" onClick={pay}>Pay Instantly</button>
          {err && <p className="text-sm text-red-600">{err}</p>}</div>}
    <ShareButton text={`Please help fund "${bill.title}" (verified payee: ${bill.institution}) on BillBridge:`} path={`/pay/${id}`} className="block w-full rounded-full border border-blue-950 py-3 text-center text-sm font-bold text-blue-950 transition hover:bg-blue-950 hover:text-white">Share on WhatsApp</ShareButton>
  </>);
}
