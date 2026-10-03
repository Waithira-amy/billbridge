import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white pt-12 pb-6 border-t-[4px] border-[#D4AF37]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="md:col-span-2">
          
          {/* Scaled down logo to match the Navbar */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full border-2 border-[#D4AF37] flex items-center justify-center">
              <span className="font-bold text-xs text-[#D4AF37] tracking-tight">B</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">BillBridge</span>
          </div>
          
          {/* Scaled down text and tighter leading */}
          <p className="text-blue-200 text-xs max-w-sm leading-relaxed">
            Transparent fundraising, borderless contributions. Instantly settle verified institutional bills using the Bitcoin Lightning Network.
          </p>
        </div>
        
        {/* Adjusted headings and list text to text-xs */}
        <div>
          <h4 className="font-bold text-[#D4AF37] mb-3 uppercase tracking-wider text-xs">Explore</h4>
          <ul className="space-y-2.5 text-blue-200 text-xs font-medium">
            <li><Link href="/campaigns" className="hover:text-white transition-colors">Active Campaigns</Link></li>
            <li><Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
            <li><Link href="/institution" className="hover:text-white transition-colors">Verified Institutions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[#D4AF37] mb-3 uppercase tracking-wider text-xs">Legal</h4>
          <ul className="space-y-2.5 text-blue-200 text-xs font-medium">
            <li><Link href="/legal" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/legal" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="mailto:hello@billbridge.example" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      
      {/* Scaled down copyright text */}
      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-blue-900/50 text-center text-xs font-medium text-blue-400">
        <p>© {new Date().getFullYear()} BillBridge. All rights reserved.</p>
      </div>
    </footer>
  );
}