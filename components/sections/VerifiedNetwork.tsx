"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const partners = [
  {
    name: "Machankura",
    logo: (
      <div className="flex items-center gap-3">
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14zm-6-1h2v2h-2z"/></svg>
        <span className="font-sans font-black text-3xl tracking-tighter uppercase">Machankura</span>
      </div>
    )
  },
  {
    name: "Bitnob",
    logo: (
      <div className="flex items-center gap-2">
         <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66C7.67 12.16 9.21 9.42 11 6h1l-1 7h3.5c.49 0 .56.33.47.51l-4.97 7.49z"/></svg>
         <span className="font-extrabold text-3xl tracking-tight">Bitnob</span>
      </div>
    )
  },
  {
    name: "Gridless",
    logo: (
      <div className="flex items-center gap-3">
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/></svg>
        <span className="font-bold text-3xl tracking-widest uppercase">Gridless</span>
      </div>
    )
  },
  {
    name: "Btrust",
    logo: (
      <div className="flex items-center gap-3">
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        <span className="font-serif font-bold text-3xl tracking-tight">BTRUST</span>
      </div>
    )
  },
  {
    name: "Kotani Pay",
    logo: (
      <div className="flex items-center gap-3">
        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
        <span className="font-bold text-3xl">Kotani Pay</span>
      </div>
    )
  },
  {
    name: "Bitcoin Dada",
    logo: (
      <div className="flex items-center gap-3">
         <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v12m-4-6h8" stroke="white" strokeWidth="2"/></svg>
         <span className="font-black text-3xl tracking-tight">BITCOIN DADA</span>
      </div>
    )
  },
];

export default function VerifiedNetwork() {
  const marqueeItems = [...partners, ...partners, ...partners];

  return (
    <section className="relative py-28 bg-white overflow-hidden border-b border-slate-100">
      
      {/* Minimal Header */}
      <div className="text-center mb-20 relative z-10">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
          Verified Partners
        </h3>
      </div>

      {/* Enlarged Stark Black Scrolling Logos */}
      <div 
        className="relative z-10 flex overflow-x-hidden"
        style={{ maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}
      >
        <motion.div
          className="flex whitespace-nowrap gap-28 px-8 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
        >
          {marqueeItems.map((partner, index) => (
            <div 
              key={index} 
              className="group flex items-center justify-center text-black opacity-30 hover:opacity-100 transition-opacity duration-500 cursor-pointer"
            >
              {partner.logo}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Solid Black Button */}
      <div className="mt-24 flex justify-center relative z-10">
        <Link 
          href="#contact" 
          className="px-8 py-3.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
        >
          Become a Partner
        </Link>
      </div>

    </section>
  );
}