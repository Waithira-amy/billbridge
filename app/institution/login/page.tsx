"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function InstitutionLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (!formData.get("email") || !formData.get("password")) {
      setError("Enter your email address and password to continue.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/institution/dashboard");
    }, 900);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <main className="relative mx-auto w-full max-w-md space-y-6 rounded-[2rem] border-t-[6px] border-t-[#D4AF37] bg-white p-8 text-blue-950 shadow-2xl sm:p-10">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-slate-100 bg-slate-50 shadow-sm">
              <svg className="h-5 w-5 text-blue-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Zm10-10V7a4 4 0 0 0-8 0v4h8Z" />
              </svg>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Institution Portal</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-blue-950">
              {mode === "login" ? "Institution Login" : "Register Institution"}
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              {mode === "login"
                ? "Sign in before creating and managing verified campaigns."
                : "Create access for your institution before submitting campaigns."}
            </p>
          </div>

          <div className="grid grid-cols-2 rounded-full bg-slate-100 p-1" role="tablist" aria-label="Institution access">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                mode === "login" ? "bg-white text-blue-950 shadow-sm" : "text-slate-500 hover:text-blue-950"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                mode === "register" ? "bg-white text-blue-950 shadow-sm" : "text-slate-500 hover:text-blue-950"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {mode === "register" && (
              <div>
                <label htmlFor="institution" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-blue-950">
                  Institution Name
                </label>
                <input
                  id="institution"
                  name="institution"
                  required
                  placeholder="e.g. Kenyatta National Hospital"
                  className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-blue-950">
                Institution Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="admin@institution.org"
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-blue-950">
                  Password
                </label>
                {mode === "login" && (
                  <Link href="#" className="text-[10px] font-bold text-[#D4AF37] transition-colors hover:text-amber-600">
                    Forgot?
                  </Link>
                )}
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-700" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-blue-950 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-70"
            >
              {isSubmitting ? "Authenticating..." : mode === "login" ? "Sign In Securely" : "Create Institution Access"}
            </button>
          </form>

          <div className="border-t border-slate-100 pt-6 text-center">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {mode === "login" ? "New institution?" : "Already verified?"}
            </p>
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-6 py-3 text-xs font-bold text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-blue-950"
            >
              {mode === "login" ? "Register Institution" : "Back to Institution Login"}
            </button>
          </div>
      </main>
    </div>
  );
}
