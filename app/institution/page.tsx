"use client";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
export default function Institution() {
  const [d, setD] = useState<any>({ campaigns: [], txs: [] });
  useEffect(() => { const l = () => fetch("/api/institution").then(r => r.json()).then(setD); l(); const t = setInterval(l, 3000); return () => clearInterval(t); }, []);
  return (
    <><Navbar /><div className="min-h-screen bg-slate-50 px-6 pb-16 pt-28"><main className="mx-auto max-w-5xl space-y-6 overflow-x-auto rounded-[2rem] border border-gray-100 bg-white p-8 text-blue-950 shadow-xl">
      <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Verified institutions</p><h1 className="text-2xl font-extrabold tracking-tight text-blue-950">Institution dashboard</h1>
      <table className="w-full text-sm text-blue-950"><thead><tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wider text-gray-400"><th>Campaign</th><th>Institution</th><th>PayBill / Acct</th><th>Target</th><th>Received</th><th>Outstanding</th><th>Status</th></tr></thead>
        <tbody>{d.campaigns.map((c: any) => <tr key={c.id} className="border-b border-gray-100"><td>{c.id}</td><td>{c.institution}</td><td>{c.paybill} / {c.accountRef}</td><td>{c.targetKes}</td><td>{c.raisedKes}</td><td>{c.targetKes - c.raisedKes}</td><td>{c.status}</td></tr>)}</tbody></table>
      <h2 className="font-extrabold text-blue-950">Payments & settlement</h2>
      <ul className="space-y-1 text-sm text-gray-600">{d.txs.map((t: any, i: number) => <li key={i}>{t.kind === "payment_received" ? "⚡ Received" : "🏦 Settled to institution"} KES {t.kes} · {t.campaignId} · <code>{t.ref}</code></li>)}</ul>
    </main></div></>
  );
}
