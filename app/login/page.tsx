"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    // Simulate secure authentication delay, then route to the portal
    setTimeout(() => {
      setIsLoggingIn(false);
      router.push("/start");
    }, 1200);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 px-6 pb-16 pt-28 flex items-center justify-center">
        
        {/* Main Card with Gold Accent Border */}
        <main className="mx-auto w-full max-w-md space-y-6 rounded-[2rem] border-t-[6px] border-t-[#D4AF37] bg-white p-8 sm:p-10 text-blue-950 shadow-2xl relative">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-5 h-5 text-blue-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Secure Access</p>
            <h1 className="text-2xl font-extrabold tracking-tight text-blue-950 mt-1">Partner Login</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-blue-950 uppercase tracking-wider mb-1.5">Institution Email / ID</label>
              <input 
                required 
                type="text"
                placeholder="e.g. admin@knh.or.ke" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all" 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[11px] font-bold text-blue-950 uppercase tracking-wider">Password</label>
                <Link href="#" className="text-[10px] font-bold text-[#D4AF37] hover:text-amber-600 transition-colors">
                  Forgot?
                </Link>
              </div>
              <input 
                required 
                type="password"
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoggingIn} 
              className="w-full rounded-full bg-blue-950 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-70 flex justify-center items-center gap-2 mt-2"
            >
              {isLoggingIn ? "Authenticating..." : "Sign In Securely"}
            </button>
          </form>

          {/* Footer Section */}
          <div className="pt-6 border-t border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Not yet registered?</p>
            <Link href="#contact" className="inline-block w-full rounded-full bg-slate-50 border border-slate-200 px-6 py-3 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-blue-950 hover:border-slate-300 transition-all shadow-sm">
              Apply to Become a Partner
            </Link>
          </div>

        </main>
      </div>
    </>
  );
}