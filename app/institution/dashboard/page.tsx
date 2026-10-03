"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Campaign = { id: string; title: string; accountRef: string; targetKes: number; raisedKes: number; status: "pending_approval" | "active" | "funded"; institution: string; paybill: string };

const formatKes = (amount: number) => `KES ${amount.toLocaleString("en-KE")}`;
const statusLabel: Record<Campaign["status"], string> = { pending_approval: "Awaiting admin approval", active: "Live", funded: "Funded" };

export default function InstitutionDashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/institution/campaigns").then((response) => response.json()).then((data: Campaign[]) => setCampaigns(data)).finally(() => setLoading(false));
  }, []);

  const awaitingApproval = campaigns.filter((campaign) => campaign.status === "pending_approval").length;
  const active = campaigns.filter((campaign) => campaign.status === "active").length;
  const raised = campaigns.reduce((total, campaign) => total + campaign.raisedKes, 0);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-5 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-amber-700">Institution portal</p><h1 className="mt-1 text-3xl font-bold text-blue-950">Campaign dashboard</h1></div><div className="flex items-center gap-4"><Link href="/institution" className="text-sm font-semibold text-slate-600 hover:text-blue-950">Exit portal</Link><Link href="/institution/campaigns/new" className="bg-blue-950 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-900">Create campaign</Link></div></header>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">{[{ label: "Awaiting approval", value: awaitingApproval }, { label: "Live campaigns", value: active }, { label: "Total received", value: formatKes(raised) }].map((metric) => <div key={metric.label} className="border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-600">{metric.label}</p><p className="mt-3 text-3xl font-bold text-blue-950">{metric.value}</p></div>)}</section>

        <section className="mt-8 border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4"><h2 className="font-bold text-blue-950">Your campaigns</h2><p className="mt-1 text-sm text-slate-500">New campaigns stay private until an administrator approves them.</p></div>
          {loading ? <p className="px-5 py-8 text-sm text-slate-500">Loading campaigns...</p> : campaigns.length === 0 ? <div className="px-5 py-10 text-center"><p className="text-sm text-slate-600">No campaigns have been submitted yet.</p><Link href="/institution/campaigns/new" className="mt-4 inline-flex text-sm font-semibold text-blue-950 hover:underline">Create your first campaign</Link></div> : <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Campaign</th><th className="px-5 py-3">Account</th><th className="px-5 py-3">Goal</th><th className="px-5 py-3">Raised</th><th className="px-5 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{campaigns.map((campaign) => <tr key={campaign.id}><td className="px-5 py-4 font-semibold text-slate-900">{campaign.title}<p className="mt-1 text-xs font-normal text-slate-500">{campaign.institution}</p></td><td className="px-5 py-4 text-slate-600">{campaign.accountRef}</td><td className="px-5 py-4 text-slate-600">{formatKes(campaign.targetKes)}</td><td className="px-5 py-4 text-slate-600">{formatKes(campaign.raisedKes)}</td><td className="px-5 py-4"><span className="inline-flex bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{statusLabel[campaign.status]}</span></td></tr>)}</tbody></table></div>}
        </section>
      </div>
    </main>
  );
}
