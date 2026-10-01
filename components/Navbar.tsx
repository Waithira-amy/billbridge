import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border-2 border-blue-950 flex items-center justify-center">
            <span className="font-bold text-sm text-blue-950 tracking-tight">B</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-blue-950">BillBridge</span>
        </Link>

        {/* Desktop Links - Now pointing to the section IDs */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-blue-950">
          <Link href="#hero" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          <Link href="#how-it-works" className="hover:text-[#D4AF37] transition-colors">How it Works</Link>
          <Link href="#campaigns" className="hover:text-[#D4AF37] transition-colors">Campaigns</Link>
        </div>

        {/* Call to Action */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-sm font-bold uppercase tracking-wider text-blue-950 hover:text-[#D4AF37] transition-colors">
            Sign In
          </Link>
          <button className="bg-blue-950 hover:bg-blue-900 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md">
            Start a Campaign
          </button>
        </div>
      </div>
    </nav>
  );
}