import Link from "next/link";

const decisions = [
  { name: "Achieng Term Fees", type: "Campaign", status: "Pending approval" },
  { name: "Kenyatta National Hospital", type: "Institution", status: "Pending verification" },
  { name: "Musa Medical Care", type: "Campaign", status: "Needs revision" },
  { name: "St. Joseph School", type: "Institution", status: "Approved" },
];

export default function AdminDecisionsPage() {
  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Admin Decisions</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-blue-950">Approve / Reject</h1>
        </div>
        <Link href="/admin/dashboard" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
          Back to dashboard
        </Link>
      </div>

      <div className="space-y-4">
        {decisions.map((item) => (
          <div key={`${item.type}-${item.name}`} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{item.type}</p>
              <h2 className="mt-1 text-xl font-black text-blue-950">{item.name}</h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-700">
                {item.status}
              </span>
              <button className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-emerald-500">
                Approve
              </button>
              <button className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-red-500">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
