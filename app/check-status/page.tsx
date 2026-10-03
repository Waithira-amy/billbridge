"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CheckStatus() {
  const [searchId, setSearchId] = useState("");
  const [statusResult, setStatusResult] = useState<null | any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleStatusCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;
    setIsSearching(true);
    
    // Simulate database lookup
    setTimeout(() => {
      setIsSearching(false);
      setStatusResult({
        id: searchId.toUpperCase(),
        status: "PENDING REVIEW",
        date: new Date().toLocaleDateString(),
        notes: "Uploaded documents are currently being verified by the admin team before network listing."
      });
    }, 800);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 px-6 pb-16 pt-28">
        
        {/* Main Card with Navy Blue Accent Border */}
        <main className="mx-auto max-w-md space-y-6 rounded-[2rem] border-t-[6px] border-t-blue-950 bg-white p-8 sm:p-10 text-blue-950 shadow-2xl relative">
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Partner Portal</p>
              <h1 className="text-3xl font-extrabold tracking-tight text-blue-950 mt-1">Check Status</h1>
            </div>
            <Link href="/start" className="text-[10px] font-bold bg-slate-100 text-blue-950 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors">
              &larr; Back
            </Link>
          </div>
          
          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            Enter your Application Tracking ID below to see the current status of your submitted bill.
          </p>

          <form onSubmit={handleStatusCheck} className="space-y-4">
            <div>
              <input 
                required 
                placeholder="e.g. BB-APP-12345" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-4 text-sm font-mono outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 text-center transition-all" 
              />
            </div>
            <button type="submit" disabled={isSearching} className="w-full rounded-full bg-blue-950 py-4 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-70">
              {isSearching ? "Searching securely..." : "Track Application"}
            </button>
          </form>

          {statusResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 border border-slate-100 rounded-2xl p-6 bg-slate-50 shadow-inner">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">ID</p>
                  <p className="text-sm font-black text-slate-800 font-mono">{statusResult.id}</p>
                </div>
                <div className="bg-amber-100 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                  {statusResult.status}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Admin Notes</p>
                <p className="text-xs text-slate-500 leading-relaxed">{statusResult.notes}</p>
              </div>
            </motion.div>
          )}
          
        </main>
      </div>
    </>
  );
}