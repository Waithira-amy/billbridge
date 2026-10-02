import Link from "next/link";
import Navbar from "@/components/Navbar";
export default function Login() {
  return (<><Navbar /><div className="min-h-screen bg-slate-50 px-6 pb-16 pt-28"><main className="mx-auto max-w-md text-center space-y-4 rounded-[2rem] border border-gray-100 bg-white p-8 text-blue-950 shadow-xl">
    <h1 className="text-2xl font-bold text-blue-950">Sign in</h1>
    <p className="text-gray-500">Accounts are coming soon. For now, organizers launch and track campaigns with just a verified PayBill, on the web or by dialing *384*99#.</p>
    <Link href="/start" className="inline-block rounded-full bg-blue-950 px-6 py-3 text-sm font-bold text-white">Start a Campaign</Link></main></div></>);
}
