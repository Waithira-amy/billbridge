import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function InstitutionPortalPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 px-6 pb-16 pt-28">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-semibold text-amber-700">BillBridge for institutions</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-bold text-blue-950">Institution portal</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Create verified fundraising campaigns, follow contributions, and send each campaign to the BillBridge team for approval.</p>

          <section className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-sm font-semibold text-blue-950">Existing institution</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Sign in to your portal</h2>
              <p className="mt-3 leading-6 text-slate-600">View campaign activity and submit a new funding request for review.</p>
              <Link href="/institution/login" className="mt-6 inline-flex bg-blue-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-900">Institution login</Link>
            </div>
            <div className="border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-sm font-semibold text-amber-700">New to BillBridge</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">Get your institution verified</h2>
              <p className="mt-3 leading-6 text-slate-600">Registration will collect your institution details and PayBill before your team can publish campaigns.</p>
              <Link href="/institution/login" className="mt-6 inline-flex border border-blue-950 px-5 py-3 text-sm font-semibold text-blue-950 transition hover:bg-blue-50">Register institution</Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
