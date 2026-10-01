import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen flex flex-col justify-end pb-12 md:pb-16 bg-white overflow-hidden">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/billbridge-hero-v2.jpg"
          alt="BillBridge Overview"
          fill
          priority
          className="object-cover object-center scale-125"
        />
      </div>
      
      {/* Independent Buttons Container - Scaled down padding, gaps, and text */}
      <div className="relative z-10 w-full flex justify-center px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-4xl">
          
          {/* Button 1: Watch Demo */}
          <button className="w-full md:w-auto px-6 py-3 rounded-full text-sm font-bold text-slate-700 bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-white hover:text-blue-950 transition-all shadow-sm flex items-center justify-center gap-2">
            <svg className="w-4 h-4 fill-current text-blue-600" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Demo
          </button>

          {/* Button 2: Donate to a Campaign */}
          <Link href="#campaigns" className="w-full md:w-auto">
            <button className="w-full px-8 py-3 rounded-full text-sm font-bold text-blue-950 bg-gradient-to-r from-[#D4AF37] to-amber-400 hover:from-amber-400 hover:to-amber-300 transition-all shadow-[0_6px_15px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.4)] hover:-translate-y-0.5 transform duration-200">
              Donate to a Campaign
            </button>
          </Link>

          {/* Button 3: Start a Campaign */}
          <button className="w-full md:w-auto px-8 py-3 rounded-full text-sm font-bold text-white bg-blue-950 hover:bg-blue-900 border border-blue-900 transition-all shadow-[0_6px_15px_rgba(23,37,84,0.2)] hover:shadow-[0_6px_20px_rgba(23,37,84,0.3)] hover:-translate-y-0.5 transform duration-200">
            Start a Campaign
          </button>

        </div>
      </div>
      
    </section>
  );
}