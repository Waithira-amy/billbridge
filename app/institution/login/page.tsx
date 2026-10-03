"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function InstitutionLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (!formData.get("email") || !formData.get("password")) {
      setError("Enter your email address and password to continue.");
      return;
    }
    router.push("/institution/dashboard");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70 sm:p-9">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#D4AF37] bg-[#FFF7D6] text-sm font-black text-blue-950">B</div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Institution Portal</p>
          <h1 className="mt-3 text-3xl font-black text-blue-950">
            {mode === "login" ? "Welcome back" : "Register your institution"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{mode === "login" ? "Sign in to manage your campaigns." : "Start your institution verification."}</p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Institution access">
          <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => { setMode("login"); setError(""); }} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${mode === "login" ? "bg-white text-blue-950 shadow-sm" : "text-slate-500 hover:text-blue-950"}`}>Sign in</button>
          <button type="button" role="tab" aria-selected={mode === "register"} onClick={() => { setMode("register"); setError(""); }} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${mode === "register" ? "bg-white text-blue-950 shadow-sm" : "text-slate-500 hover:text-blue-950"}`}>Register</button>
        </div>

        <form className="space-y-5" onSubmit={submit}>
          {mode === "register" && (
            <div>
              <label htmlFor="institution" className="mb-2 block text-sm font-semibold text-slate-700">Institution name</label>
              <input id="institution" name="institution" required placeholder="Your institution" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-950 focus:bg-white focus:ring-2 focus:ring-blue-100" />
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Work email</label>
            <input id="email" name="email" type="email" autoComplete="email" required placeholder="name@institution.org" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-950 focus:bg-white focus:ring-2 focus:ring-blue-100" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
            <input id="password" name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required placeholder="Enter your password" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-950 focus:bg-white focus:ring-2 focus:ring-blue-100" />
          </div>
          {error && <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Link href="/institution" className="text-sm font-semibold text-slate-600 hover:text-blue-950">Back to portal</Link>
            <button type="submit" className="rounded-full bg-blue-950 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-950/20 transition hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:ring-offset-2">{mode === "login" ? "Sign in" : "Register"}</button>
          </div>
        </form>
      </div>
    </main>
  );
}
