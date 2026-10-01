import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-white">
      
      {/* 1. Background Image - NO dark overlay so your bright white background shines */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.jpg"
          alt="BillBridge Background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* 2. Transparent Top Navigation (Navy Blue text for contrast against the white) */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
        
        {/* Minimal left logo to remind users where they are when scrolling down */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border-2 border-blue-950 flex items-center justify-center">
            <span className="font-bold text-sm text-blue-950 tracking-tight">B</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-blue-950">BillBridge</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-10 text-sm text-blue-950 font-bold uppercase tracking-wider">
          <Link href="#product" className="hover:text-amber-500 transition-colors">Product</Link>
          <Link href="#how-it-works" className="hover:text-amber-500 transition-colors">How it works</Link>
          <Link href="#verification" className="hover:text-amber-500 transition-colors">Verification</Link>
        </div>

        {/* Right Action Button */}
        <div className="flex items-center gap-6 text-sm font-bold uppercase tracking-wider">
          <Link href="/login" className="hidden sm:block text-blue-950 hover:text-amber-500 transition-colors">Sign in</Link>
        </div>
      </nav>

      {/* 3. Empty Center Spacer - This forces the UI to the edges, leaving your 3D logo completely unobstructed */}
      <div className="flex-1" />

      {/* 4. Floating Bottom Action Bar - Frosted glass effect to hold your CTAs over the bottom gold elements */}
      <div className="relative z-10 w-full max-w-5xl mx-auto mb-10 sm:mb-16 px-4">
        <div className="backdrop-blur-xl bg-white/60 border border-white/80 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="text-blue-950 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
              Ready to activate your campaign?
            </h2>
            <p className="text-blue-900/80 font-medium text-lg">
              Verify your institution and start accepting Lightning payments instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <button className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-blue-950 hover:bg-blue-950/5 transition-all border-2 border-blue-950">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              USSD Demo
            </button>
            <button className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] to-amber-400 hover:from-amber-400 hover:to-amber-300 text-blue-950 px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]">
              Fund a Bill
            </button>
          </div>

        </div>
      </div>

    </main>
  );
}