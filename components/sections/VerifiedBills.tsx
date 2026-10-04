"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { allPlatformCurrencies } from "@/lib/currencies";

const allCampaigns = [
  {
    id: 1, category: "Education", title: "Form 4 Tuition Arrears", 
    beneficiary: "David Ochieng", institution: "St. Mary's High School",
    percentage: 82, baseRaised: 41000, baseGoal: 50000, satsEquivalent: "~350k Sats", color: "#10B981", 
    image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=800&auto=format&fit=crop" 
  },
  {
    id: 2, category: "Medical", title: "Maternity Ward Discharge", 
    beneficiary: "Grace Mutuku & Baby", institution: "Kenyatta National Hospital",
    percentage: 91, baseRaised: 136500, baseGoal: 150000, satsEquivalent: "~1.2M Sats", color: "#D4AF37", 
    image: "https://images.unsplash.com/photo-1511988617509-a5708af470b0?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3, category: "Community", title: "Borehole Pump Repair", 
    beneficiary: "Maji Safi Village", institution: "Maji Safi Trust",
    percentage: 88, baseRaised: 88000, baseGoal: 100000, satsEquivalent: "~750k Sats", color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4, category: "Education", title: "Final Year Exam Fees", 
    beneficiary: "Brian Kipkorir", institution: "Daystar University",
    percentage: 45, baseRaised: 27000, baseGoal: 60000, satsEquivalent: "~230k Sats", color: "#10B981", 
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5, category: "Medical", title: "Emergency Appendectomy", 
    beneficiary: "Amina Hassan", institution: "Aga Khan Hospital",
    percentage: 60, baseRaised: 120000, baseGoal: 200000, satsEquivalent: "~1M Sats", color: "#D4AF37",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6, category: "Community", title: "Solar Panel Installation", 
    beneficiary: "Upendo Orphanage", institution: "Upendo Children's Home",
    percentage: 30, baseRaised: 15000, baseGoal: 50000, satsEquivalent: "~128k Sats", color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop"
  }
];

export default function VerifiedBills() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [campaignSearch, setCampaignSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0); 
  
  const [activeCurrencyCode, setActiveCurrencyCode] = useState("USD");
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const categories = ["All", "Medical", "Education", "Community"];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCurrencyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const radius = 28; 
  const circumference = 2 * Math.PI * radius;

  const filteredCurrencies = allPlatformCurrencies.filter(
    (c) => c.code.toLowerCase().includes(currencySearch.toLowerCase()) || 
           c.name.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const africanCurrencies = filteredCurrencies.filter(c => c.type === "African");
  const globalCurrencies = filteredCurrencies.filter(c => c.type === "Global");

  // Updated filter logic to include the new search bar
  const filteredCampaigns = allCampaigns.filter((campaign) => {
    const matchesCategory = activeCategory === "All" || campaign.category === activeCategory;
    const searchLower = campaignSearch.toLowerCase();
    const matchesSearch = campaign.title.toLowerCase().includes(searchLower) || 
                          campaign.institution.toLowerCase().includes(searchLower) ||
                          campaign.beneficiary.toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const currentCampaigns = filteredCampaigns.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    if (totalPages <= 1) return;
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 7000);
    return () => clearInterval(timer);
  }, [totalPages, activeCategory, campaignSearch]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(0);
  };

  const activeCurrencyData = allPlatformCurrencies.find(c => c.code === activeCurrencyCode) || allPlatformCurrencies[0];
  const formatAmount = (baseAmount: number) => {
    const converted = baseAmount * activeCurrencyData.rate;
    return `${activeCurrencyData.symbol}${converted.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  };

  return (
    // Changed to bg-white and added border-t to completely separate it from the previous section
    <section id="campaigns" className="py-24 bg-white border-t border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-10">
          <h2 className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-3">Direct Funding</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-blue-950 mb-4">Verified Campaigns</h3>
          <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto">
            These institutional campaigns are verified and awaiting funding. Select a category and donate instantly via the Lightning Network.
          </p>
        </div>

        {/* Enhanced Filters Row with Search Bar */}
        <div className="flex flex-col md:flex-row flex-wrap items-center justify-between gap-4 mb-12 relative z-50">
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-slate-50 p-1.5 rounded-full inline-flex flex-wrap justify-center gap-1 border border-slate-200 shadow-sm">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                    activeCategory === cat 
                      ? "bg-blue-950 text-white shadow-md" 
                      : "text-slate-500 hover:text-blue-950 hover:bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* New Campaign Search Bar */}
            <div className="relative w-full md:w-64">
              <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                type="text" 
                placeholder="Search campaigns..."
                value={campaignSearch}
                onChange={(e) => { setCampaignSearch(e.target.value); setCurrentPage(0); }}
                className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-blue-950 focus:ring-1 focus:ring-blue-950 transition-colors shadow-sm"
              />
            </div>
          </div>

          <div className="relative w-full md:w-auto" ref={dropdownRef}>
            <div className="flex items-center bg-slate-50 border border-slate-200 shadow-sm rounded-full p-1 md:w-64">
              <button 
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex-1 text-xs font-bold text-slate-500 hover:text-blue-950 transition-colors text-left pl-4"
              >
                Choose Currency
              </button>
              <button 
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="bg-white text-blue-950 px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-2 hover:bg-slate-100 transition-colors shadow-sm"
              >
                <span>{activeCurrencyCode}</span>
                <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>

            <AnimatePresence>
              {isCurrencyDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-full md:w-72 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                >
                  <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative">
                      <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      <input 
                        type="text" 
                        placeholder="Search currency..."
                        value={currencySearch}
                        onChange={(e) => setCurrencySearch(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-8 pr-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-950/20"
                      />
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto p-1.5 scrollbar-thin scrollbar-thumb-gray-200">
                    
                    {africanCurrencies.length > 0 && (
                      <div className="mb-2">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1 mt-1">African Currencies</div>
                        {africanCurrencies.map(currency => (
                          <button
                            key={currency.code}
                            onClick={() => {
                              setActiveCurrencyCode(currency.code);
                              setIsCurrencyDropdownOpen(false);
                              setCurrencySearch("");
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                              activeCurrencyCode === currency.code ? "bg-blue-50 text-blue-950 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-blue-950"
                            }`}
                          >
                            <span>{currency.name}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">{currency.code}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {globalCurrencies.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1 mt-1">Global Currencies</div>
                        {globalCurrencies.map(currency => (
                          <button
                            key={currency.code}
                            onClick={() => {
                              setActiveCurrencyCode(currency.code);
                              setIsCurrencyDropdownOpen(false);
                              setCurrencySearch("");
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                              activeCurrencyCode === currency.code ? "bg-blue-50 text-blue-950 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-blue-950"
                            }`}
                          >
                            <span>{currency.name}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">{currency.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* The Animated Carousel Grid */}
        <div className="min-h-[500px] relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 absolute w-full">
            <AnimatePresence mode="popLayout">
              {currentCampaigns.length > 0 ? currentCampaigns.map((campaign, index) => {
                const strokeDashoffset = circumference - (campaign.percentage / 100) * circumference;

                return (
                  <motion.div 
                    key={`${campaign.id}-${currentPage}`}
                    initial={{ opacity: 0, y: -60, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 60, scale: 0.95 }} 
                    transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                    className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden group hover:shadow-xl transition-shadow pb-4"
                  >
                    <div className="relative w-full h-44 bg-gradient-to-br from-blue-100 to-amber-100">
                      <Image
                        src={campaign.image}
                        alt={campaign.title}
                        fill
                        unoptimized onError={(e) => { e.currentTarget.style.display = "none"; }}
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-blue-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        {campaign.category}
                      </div>
                    </div>

                    <div className="relative px-5 pt-8 pb-3 flex-1 flex flex-col">
                      <div className="absolute -top-10 right-5 bg-white rounded-full p-1 shadow-md">
                        <div className="relative w-16 h-16 flex items-center justify-center bg-slate-50 rounded-full">
                          <span className="text-xs font-extrabold" style={{ color: campaign.color }}>
                            {campaign.percentage}%
                          </span>
                          <svg className="absolute inset-0 w-full h-full -rotate-90 transform">
                            <circle cx="32" cy="32" r={radius} stroke="#e2e8f0" strokeWidth="4" fill="none" />
                            <motion.circle
                              cx="32" cy="32" r={radius}
                              stroke={campaign.color}
                              strokeWidth="4" fill="none" strokeLinecap="round"
                              initial={{ strokeDashoffset: circumference }}
                              animate={{ strokeDashoffset }}
                              transition={{ duration: 1.5, delay: 0.4 }}
                              style={{ strokeDasharray: circumference }}
                            />
                          </svg>
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-blue-950 mb-2 leading-tight">{campaign.title}</h4>
                      
                      <div className="flex flex-col gap-1 mb-4">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          <p className="text-xs font-medium text-slate-800">
                            <span className="text-gray-500 font-normal">For:</span> {campaign.beneficiary}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                          <p className="text-xs font-medium text-slate-800">
                            <span className="text-gray-500 font-normal">Payee:</span> {campaign.institution}
                          </p>
                        </div>
                      </div>

                      <div className="flex-1"></div> 

                      <div className="bg-slate-50 w-full rounded-xl p-3 mb-5 border border-slate-100">
                        <div className="flex justify-between items-center mb-1 text-xs font-bold text-blue-950">
                          <span>Raised</span>
                          <span>Goal</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-extrabold text-blue-950">
                            {formatAmount(campaign.baseRaised)}
                          </span>
                          <span className="text-gray-400 font-medium text-xs">
                            {formatAmount(campaign.baseGoal)}
                          </span>
                        </div>
                        <div className="text-[10px] font-bold text-amber-600 bg-amber-100/50 py-1 px-2 rounded-md inline-block border border-amber-200">
                          Diaspora Est: {campaign.satsEquivalent}
                        </div>
                      </div>

                      {/* Reduced width Donate Button centered in the card */}
                      <div className="flex justify-center">
                        <Link href={`/donate/BB-${campaign.id}?currency=${activeCurrencyCode}`}
                          className="block text-center w-[80%] py-2.5 rounded-full text-xs font-bold text-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                          style={{ backgroundColor: campaign.color }}
                        >
                          Donate Now
                        </Link>
                      </div>

                    </div>
                  </motion.div>
                );
              }) : (
                <div className="col-span-3 text-center py-12 text-slate-500 text-sm">
                  No verified campaigns found matching your search.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}