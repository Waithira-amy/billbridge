import Link from "next/link";

const campaigns = [
  { title: "Achieng Term Fees", institution: "Kenyatta National Hospital", raised: "KES 78,000", status: "Awaiting review" },
  { title: "Musa Medical Care", institution: "Aga Khan University Hospital", raised: "KES 34,500", status: "Needs update" },
  { title: "School Supplies Drive", institution: "St. Joseph School", raised: "KES 120,000", status: "Approved" },
  { title: "Community Clinic Fund", institution: "Mbarara Community Clinic", raised: "KES 52,000", status: "Pending review" },
];

export default function AdminReviewCampaignsPage() {
  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Admin Review</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-blue-950">Review Campaigns</h1>
        </div>
        <Link href="/admin/dashboard" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
          Back to dashboard
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
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
            {campaigns.map((campaign) => (
              <tr key={campaign.title} className="border-t border-slate-200">
                <td className="px-5 py-4 font-semibold text-slate-900">{campaign.title}</td>
                <td className="px-5 py-4">{campaign.institution}</td>
                <td className="px-5 py-4">{campaign.raised}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-700">
                    {campaign.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link href="/admin/decisions" className="text-sm font-bold text-blue-950 hover:text-blue-800">
                    Review →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
