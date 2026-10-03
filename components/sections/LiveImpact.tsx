"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const impactFeed = [
  { id: 1, type: "Medical", amount: "1.2M Sats", fiat: "$780", institution: "Kenyatta National Hospital", time: "2 mins ago", icon: "🏥" },
  { id: 2, type: "Education", amount: "450k Sats", fiat: "$290", institution: "Daystar University", time: "15 mins ago", icon: "🎓" },
  { id: 3, type: "Community", amount: "128k Sats", fiat: "$85", institution: "Maji Safi Trust", time: "1 hour ago", icon: "💧" },
  { id: 4, type: "Medical", amount: "850k Sats", fiat: "$550", institution: "Aga Khan Hospital", time: "3 hours ago", icon: "🏥" },
];

export default function LiveImpact() {
  const [feed, setFeed] = useState(impactFeed);

  // Simulates a live feed scrolling
  useEffect(() => {
    const interval = setInterval(() => {
      setFeed((prev) => {
        const newFeed = [...prev];
        const first = newFeed.shift();
        if (first) newFeed.push(first);
        return newFeed;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-white overflow-hidden border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Stats */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <h2 className="text-xs font-bold tracking-[0.2em] text-green-600 uppercase">Live Network</h2>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-extrabold text-blue-950 mb-4 leading-tight">
              Real-Time Settlement
            </h3>
            <p className="text-sm text-gray-600 mb-8 max-w-md">
              Watch as the diaspora directly funds verified institutional bills back home. No middlemen, zero delays, absolute transparency.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Settled</p>
                <p className="text-2xl font-extrabold text-blue-950">24.5M <span className="text-sm text-[#D4AF37]">Sats</span></p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Institutions</p>
                <p className="text-2xl font-extrabold text-blue-950">50+</p>
              </div>
            </div>
          </div>

          {/* Right Side: Animated Feed */}
          <div className="relative h-[320px] bg-slate-900 rounded-[2rem] p-6 overflow-hidden shadow-2xl border-4 border-slate-800">
            {/* Fade overlays for smooth scrolling effect */}
            <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-slate-900 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-slate-900 to-transparent z-10 pointer-events-none"></div>
            
            <div className="flex flex-col gap-3">
              {feed.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-slate-800/50 border border-slate-700/50 p-3.5 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-lg">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white mb-0.5">
                        <span className="text-[#D4AF37]">⚡ {item.amount}</span> ({item.fiat})
                      </p>
                      <p className="text-[10px] text-slate-400">Settled at {item.institution}</p>
                    </div>
                  </div>
                  <div className="text-[10px] font-medium text-slate-500 bg-slate-800 px-2 py-1 rounded-md">
                    {item.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}