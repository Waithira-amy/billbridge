"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import Link from "next/link";

export default function Start() {
  const [f, setF] = useState({ title: "", paybill: "", accountRef: "", target: "", phoneCode: "+254", phone: "" });
  const [file, setFile] = useState<File | null>(null);
  const [err, setErr] = useState("");
  const [submittedId, setSubmittedId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (k: keyof typeof f) => (e: any) => setF({ ...f, [k]: e.target.value });

  async function go(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setIsSubmitting(true);
    
    // Simulating API call to submit data & document
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedId("BB-APP-" + Math.floor(10000 + Math.random() * 90000));
    }, 1500);
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 px-6 pb-16 pt-28">
        {/* Main Card with Gold Accent Border */}
        <main className="mx-auto max-w-lg space-y-6 rounded-[2rem] border-t-[6px] border-t-[#D4AF37] bg-white p-8 sm:p-10 text-blue-950 shadow-2xl relative">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Partner Portal</p>
              <h1 className="text-3xl font-extrabold tracking-tight text-blue-950 mt-1">Submit a Bill</h1>
            </div>
            <Link href="/check-status" className="text-[10px] font-bold bg-slate-100 text-blue-950 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors">
              Check Status &rarr;
            </Link>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Submit verified institutional bills for network listing. Funds are routed directly to the provided PayBill.
          </p>

          {!submittedId ? (
            <form onSubmit={go} className="space-y-5">
              
              <div>
                <label className="block text-[11px] font-bold text-blue-950 uppercase tracking-wider mb-1">Beneficiary Name</label>
                <input required placeholder="e.g. Term 2 fees for Achieng" value={f.title} onChange={set("title")} className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-blue-950 uppercase tracking-wider mb-1">Institution PayBill</label>
                  <input required placeholder="e.g. 400200" value={f.paybill} onChange={set("paybill")} className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-blue-950 uppercase tracking-wider mb-1">Invoice / Account No.</label>
                  <input required placeholder="e.g. ADM-2291" value={f.accountRef} onChange={set("accountRef")} className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-blue-950 uppercase tracking-wider mb-1">Target Amount</label>
                <input required type="number" placeholder="e.g. 45000" value={f.target} onChange={set("target")} className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all" />
              </div>

              {/* African Phone Selector */}
              <div>
                <label className="block text-[11px] font-bold text-blue-950 uppercase tracking-wider mb-1">Contact Phone</label>
                <div className="flex gap-2">
                  <select value={f.phoneCode} onChange={set("phoneCode")} className="w-1/3 rounded-xl border border-gray-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all cursor-pointer">
                    <option value="+254">🇰🇪 +254</option>
                    <option value="+234">🇳🇬 +234</option>
                    <option value="+27">🇿🇦 +27</option>
                    <option value="+233">🇬🇭 +233</option>
                    <option value="+256">🇺🇬 +256</option>
                    <option value="+255">🇹🇿 +255</option>
                    <option value="+250">🇷🇼 +250</option>
                  </select>
                  <input required placeholder="712 345 678" value={f.phone} onChange={set("phone")} className="w-2/3 rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all" />
                </div>
              </div>

              {/* Document Upload Space */}
              <div>
                <label className="block text-[11px] font-bold text-blue-950 uppercase tracking-wider mb-1">Upload Invoice / Proof</label>
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-[#D4AF37] transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-6 h-6 text-[#D4AF37] mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="text-xs text-blue-950 font-bold">{file ? file.name : "Click to upload document"}</p>
                  </div>
                  <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} accept=".pdf,.jpg,.jpeg,.png" />
                </label>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-blue-950 py-4 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-70 flex justify-center items-center gap-2">
                {isSubmitting ? "Submitting securely..." : "Submit Application"}
              </button>
              {err && <p className="text-xs font-bold text-red-600 text-center mt-2">{err}</p>}
            </form>
          ) : (
            
            /* Success State */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h2 className="text-2xl font-bold text-blue-950 mb-2">Application Received</h2>
              <p className="text-sm text-gray-500 mb-6">Your bill has been submitted and is pending verification.</p>
              
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tracking ID</p>
                <p className="text-xl font-mono font-black text-blue-950">{submittedId}</p>
              </div>
              
              <Link href="/check-status" className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider hover:text-amber-600 transition-colors">
                Track Application Status &rarr;
              </Link>
            </div>
          )}
        </main>
      </div>
    </>
  );
}