import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-white">
      
      {/* Background Image (Updated to bypass cache) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-new.jpg"
          alt="BillBridge Background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Transparent Top Navigation */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border-2 border-blue-950 flex items-center justify-center">
            <span className="font-bold text-sm text-blue-950 tracking-tight">B</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-blue-950">BillBridge</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-sm text-blue-950 font-bold uppercase tracking-wider">
          <Link href="#product" className="hover:text-amber-500 transition-colors">Product</Link>
          <Link href="#how-it-works" className="hover:text-amber-500 transition-colors">How it works</Link>
          <Link href="#verification" className="hover:text-amber-500 transition-colors">Verification</Link>
        </div>

        <div className="flex items-center gap-6 text-sm font-bold uppercase tracking-wider">
          <Link href="/login" className="hidden sm:block text-blue-950 hover:text-amber-500 transition-colors">Sign in</Link>
        </div>
      </nav>

      {/* Spacer to push buttons to the bottom */}
      <div className="flex-1" />

      {/* Clean, floating buttons without the bulky card */}
      <div className="relative z-10 w-full flex justify-center pb-10 px-4">
        <div className="flex flex-col sm:flex-row gap-5">
          <button className="px-10 py-4 rounded-full font-bold text-blue-950 bg-white/70 backdrop-blur-md border border-blue-950/20 hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            USSD Demo
          </button>
          <button className="px-10 py-4 rounded-full font-bold text-blue-950 bg-gradient-to-r from-[#D4AF37] to-amber-400 hover:from-amber-400 hover:to-amber-300 transition-all shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.6)]">
            Fund a Bill
          </button>
        </div>
      </div>

    </main>
  );
}