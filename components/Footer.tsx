import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white pt-16 pb-8 border-t-[6px] border-[#D4AF37]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] flex items-center justify-center">
              <span className="font-bold text-sm text-[#D4AF37] tracking-tight">B</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">BillBridge</span>
          </div>
          <p className="text-blue-200 max-w-sm">
            Transparent fundraising, borderless contributions. Instantly settle verified institutional bills using the Bitcoin Lightning Network.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-[#D4AF37] mb-4 uppercase tracking-wider text-sm">Explore</h4>
          <ul className="space-y-3 text-blue-200 text-sm">
            <li><Link href="#campaigns" className="hover:text-white transition-colors">Active Campaigns</Link></li>
            <li><Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Verified Institutions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[#D4AF37] mb-4 uppercase tracking-wider text-sm">Legal</h4>
          <ul className="space-y-3 text-blue-200 text-sm">
            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-blue-900/50 text-center text-sm text-blue-400">
        <p>© {new Date().getFullYear()} BillBridge. All rights reserved.</p>
      </div>
    </footer>
  );
}