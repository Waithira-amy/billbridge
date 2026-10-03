import Link from "next/link";

const payments = [
  { campaign: "Achieng Term Fees", amount: "KES 45,000", status: "Settled", time: "2 mins ago" },
  { campaign: "Musa Medical Care", amount: "KES 12,500", status: "Processing", time: "18 mins ago" },
  { campaign: "School Supplies Drive", amount: "KES 67,000", status: "Verified", time: "1 hour ago" },
  { campaign: "Community Clinic Fund", amount: "KES 9,400", status: "Pending", time: "3 hours ago" },
];

export default function AdminPaymentsPage() {
  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Admin Monitoring</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-blue-950">Monitor Payments</h1>
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
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-700">
                    {payment.status}
                  </span>
                </td>
                <td className="px-5 py-4">{payment.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
