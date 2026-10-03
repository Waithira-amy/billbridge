import Link from "next/link";

export default function AdminLoginPage() {
return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
        <div className="mb-6 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Admin Login</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-blue-950">Welcome back</h1>
        </div>

        <form className="space-y-5">
        <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
            Admin email
            </label>
            <input
            id="email"
            type="email"
            defaultValue="admin@billbridge.org"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
            />
        </div>

        <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
        Password
            </label>
            <input
            id="password"
            type="password"
            defaultValue="admin123"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-950 focus:ring-2 focus:ring-blue-100"
            />
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
            <Link href="/admin/register" className="text-sm font-semibold text-slate-600 hover:text-blue-950">
            Create an account
            </Link>
            <Link
            href="/admin/dashboard"
            className="rounded-full bg-blue-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-900"
            >
            Sign in
            </Link>
        </div>
        </form>
    </div>
    </main>
);
}
