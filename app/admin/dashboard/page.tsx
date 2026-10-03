"use client";

import Link from "next/link";
import { useState } from "react";

type MenuItem = "dashboard" | "institutions" | "campaigns" | "payments";

const menuItems: Array<{ id: MenuItem; label: string }> = [
  { id: "dashboard", label: "Dashboard" },
  { id: "institutions", label: "Institutions" },
  { id: "campaigns", label: "Campaigns" },
  { id: "payments", label: "Contributions" },
];

const initialInstitutions = [
  { name: "Aga Khan University Hospital", country: "Kenya", status: "Pending review" },
  { name: "Kenyatta National Hospital", country: "Kenya", status: "Verified" },
  { name: "St. Joseph School", country: "Uganda", status: "Needs update" },
  { name: "Mbarara Community Clinic", country: "Uganda", status: "Pending review" },
];

const initialCampaigns = [
  { title: "Achieng Term Fees", institution: "Kenyatta National Hospital", raised: "KES 78,000", status: "Awaiting review" },
  { title: "Musa Medical Care", institution: "Aga Khan University Hospital", raised: "KES 34,500", status: "Needs update" },
  { title: "School Supplies Drive", institution: "St. Joseph School", raised: "KES 120,000", status: "Approved" },
  { title: "Community Clinic Fund", institution: "Mbarara Community Clinic", raised: "KES 52,000", status: "Pending review" },
];

const payments = [
  { campaign: "Achieng Term Fees", amount: "KES 45,000", status: "Settled", time: "2 mins ago" },
  { campaign: "Musa Medical Care", amount: "KES 12,500", status: "Processing", time: "18 mins ago" },
  { campaign: "School Supplies Drive", amount: "KES 67,000", status: "Verified", time: "1 hour ago" },
  { campaign: "Community Clinic Fund", amount: "KES 9,400", status: "Pending", time: "3 hours ago" },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<MenuItem>("dashboard");
  const [institutions, setInstitutions] = useState(initialInstitutions);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [institutionFilter, setInstitutionFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [campaignFilter, setCampaignFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const pendingInstitutionCount = institutions.filter(
    (institution) => institution.status !== "Verified" && institution.status !== "Rejected"
  ).length;
  const pendingCampaignCount = campaigns.filter(
    (campaign) => campaign.status !== "Approved" && campaign.status !== "Rejected"
  ).length;

  const filteredInstitutions = institutions.filter((institution) => {
    if (institutionFilter === "all") return true;
    if (institutionFilter === "pending") return institution.status !== "Verified" && institution.status !== "Rejected";
    if (institutionFilter === "approved") return institution.status === "Verified";
    return institution.status === "Rejected";
  });

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (campaignFilter === "all") return true;
    if (campaignFilter === "pending") return campaign.status !== "Approved" && campaign.status !== "Rejected";
    if (campaignFilter === "approved") return campaign.status === "Approved";
    return campaign.status === "Rejected";
  });

  const handleRecordDecision = (
    type: "institution" | "campaign",
    name: string,
    decision: "approve" | "reject"
  ) => {
    if (type === "institution") {
      setInstitutions((current) =>
        current.map((institution) =>
          institution.name === name
            ? {
                ...institution,
                status: decision === "approve" ? "Verified" : "Rejected",
              }
            : institution
        )
      );
      return;
    }

    setCampaigns((current) =>
      current.map((campaign) =>
        campaign.title === name
          ? {
              ...campaign,
              status: decision === "approve" ? "Approved" : "Rejected",
            }
          : campaign
      )
    );
  };

  return (
    <main className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
      <div className="flex min-h-[calc(100vh-6rem)] flex-col md:flex-row">
        <aside className="w-full border-b border-slate-200 bg-slate-50 p-4 md:w-72 md:border-b-0 md:border-r">
          <div className="mb-6 px-2">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">BillBridge</p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-blue-950">Admin Panel</h2>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex w-full items-center rounded-xl px-3 py-2.5 text-left text-sm font-bold transition ${
                    isActive
                      ? "bg-blue-950 text-white shadow-md"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="flex-1 p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Admin Dashboard</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-blue-950">
                {menuItems.find((item) => item.id === activeTab)?.label}
              </h1>
            </div>

            <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-blue-950">
              Exit to site
            </Link>
          </div>

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Pending Institutions", value: String(pendingInstitutionCount), tone: "bg-blue-50 text-blue-950" },
                  { label: "Queued Campaigns", value: String(pendingCampaignCount), tone: "bg-slate-100 text-slate-900" },
                  { label: "Awaiting Decisions", value: String(pendingInstitutionCount + pendingCampaignCount), tone: "bg-[#FFF7D6] text-slate-900" },
                  { label: "Payments Today", value: "KES 1.8M", tone: "bg-emerald-50 text-emerald-700" },
                ].map((item) => (
                  <div key={item.label} className={`rounded-2xl border border-slate-200 p-5 ${item.tone}`}>
                    <p className="text-xs font-bold uppercase tracking-[0.18em]">{item.label}</p>
                    <p className="mt-3 text-3xl font-black">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                {menuItems
                  .filter((item) => item.id !== "dashboard")
                  .map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={activeTab === item.id}
                      onClick={() => setActiveTab(item.id)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left transition hover:border-slate-300 hover:bg-white"
                    >
                      <h2 className="text-base font-black text-blue-950">{item.label}</h2>
                    </button>
                  ))}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-black text-blue-950">Recent activity</h3>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Last 24 hours</span>
                </div>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                    <span>St. Joseph School submitted a new verification request</span>
                    <span className="font-bold text-blue-950">2h ago</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                    <span>Campaign “Achieng Term Fees” was flagged for review</span>
                    <span className="font-bold text-blue-950">4h ago</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3">
                    <span>Payment batch for “School Supplies Drive” was settled</span>
                    <span className="font-bold text-blue-950">6h ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "institutions" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(["all", "pending", "approved", "rejected"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setInstitutionFilter(filter)}
                    className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${
                      institutionFilter === filter
                        ? "bg-blue-950 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {filter === "all" ? "All" : filter}
                  </button>
                ))}
              </div>

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Institution</th>
                      <th className="px-5 py-4">Country</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInstitutions.map((institution) => (
                      <tr key={institution.name} className="border-t border-slate-200 align-middle">
                        <td className="px-5 py-4 font-semibold text-slate-900">{institution.name}</td>
                        <td className="px-5 py-4">{institution.country}</td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-700">
                            {institution.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleRecordDecision("institution", institution.name, "approve")}
                              className="rounded-full bg-emerald-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white hover:bg-emerald-500"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRecordDecision("institution", institution.name, "reject")}
                              className="rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white hover:bg-red-500"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "campaigns" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(["all", "pending", "approved", "rejected"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setCampaignFilter(filter)}
                    className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${
                      campaignFilter === filter
                        ? "bg-blue-950 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {filter === "all" ? "All" : filter}
                  </button>
                ))}
              </div>

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Campaign</th>
                      <th className="px-5 py-4">Institution</th>
                      <th className="px-5 py-4">Raised</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCampaigns.map((campaign) => (
                      <tr key={campaign.title} className="border-t border-slate-200 align-middle">
                        <td className="px-5 py-4 font-semibold text-slate-900">{campaign.title}</td>
                        <td className="px-5 py-4">{campaign.institution}</td>
                        <td className="px-5 py-4">{campaign.raised}</td>
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-700">
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleRecordDecision("campaign", campaign.title, "approve")}
                              className="rounded-full bg-emerald-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white hover:bg-emerald-500"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRecordDecision("campaign", campaign.title, "reject")}
                              className="rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white hover:bg-red-500"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Campaign</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.campaign} className="border-t border-slate-200">
                      <td className="px-5 py-4 font-semibold text-slate-900">{payment.campaign}</td>
                      <td className="px-5 py-4">{payment.amount}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-700">
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">{payment.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
