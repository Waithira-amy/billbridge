import Image from "next/image";

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen flex flex-col justify-end pb-20 pt-24 bg-white">
      {/* 3D Custom Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-new.jpg"
          alt="BillBridge Background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>
      
      {/* Floating Action Buttons */}
      <div className="relative z-10 w-full flex justify-center px-4">
        <div className="flex flex-col sm:flex-row gap-5">
          <button className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-blue-950 bg-white/80 backdrop-blur-md border border-blue-950/20 hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Demo
          </button>
          <button className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-blue-950 bg-gradient-to-r from-[#D4AF37] to-amber-400 hover:from-amber-400 hover:to-amber-300 transition-all shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.6)]">
            Fund a Bill
          </button>
        </div>
      </div>
    </section>
  );
}