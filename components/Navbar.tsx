"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-3" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo - Scaled down */}
        <Link href="/" className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${isScrolled ? 'border-blue-950' : 'border-blue-950'}`}>
            <span className="font-bold text-xs text-blue-950 tracking-tight">B</span>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-blue-950">BillBridge</span>
        </Link>

        {/* Desktop Links - Smaller text (text-xs) and tighter gap */}
        <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-blue-950">
          <Link href="/#hero" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          <Link href="/#how-it-works" className="hover:text-[#D4AF37] transition-colors">How it Works</Link>
          <Link href="/campaigns" className="hover:text-[#D4AF37] transition-colors">Campaigns</Link>
        </div>

        {/* Call to Action - Scaled down button */}
        <div className="flex items-center gap-4">
          <Link href="/start" className="bg-blue-950 hover:bg-blue-900 text-white px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg">
            Start a Campaign
          </Link>
        </div>
      </div>
    </nav>
  );
}