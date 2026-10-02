import Link from "next/link";
import ShareButton from "@/components/ShareButton";
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-4">Simple as SMS</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-blue-950 mb-6">How BillBridge Works</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            No apps to download on the ground. See exactly how a family can clear an emergency bill with help from relatives abroad in just three steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          
          {/* STEP 1: THE DIALER */}
          <div className="flex flex-col items-center">
            {/* Phone Mockup */}
            <div className="w-[260px] h-[520px] bg-white rounded-[3rem] border-[10px] border-gray-900 shadow-xl relative overflow-hidden flex flex-col mb-8">
              {/* Phone Notch */}
              <div className="absolute top-0 inset-x-0 h-5 bg-gray-900 w-32 mx-auto rounded-b-2xl"></div>
              
              <div className="flex-1 flex flex-col justify-end p-6 bg-gray-50">
                <div className="text-center text-4xl font-light text-slate-800 mb-10 tracking-wider">
                  *384*99#
                </div>
                
                {/* Fake Keypad */}
                <div className="grid grid-cols-3 gap-y-6 text-center text-2xl text-slate-600 mb-8 font-light">
                  <span>1</span><span>2</span><span>3</span>
                  <span>4</span><span>5</span><span>6</span>
                  <span>7</span><span>8</span><span>9</span>
                  <span>*</span><span>0</span><span>#</span>
                </div>

                {/* Call Button with Pulsing Highlight */}
                <div className="flex justify-center relative mb-4">
                  {/* The Pulse Effect */}
                  <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-60 h-16 w-16 mx-auto"></div>
                  {/* The Button */}
                  <div className="relative bg-green-500 text-white rounded-full h-16 w-16 flex items-center justify-center shadow-lg z-10">
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Layman Explanation */}
            <div className="text-center px-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-950 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">1</div>
              <h4 className="text-2xl font-bold text-blue-950 mb-3">Dial the Code</h4>
              <p className="text-gray-600 leading-relaxed text-sm">
                Start on any basic phone. Dial the code, enter the Hospital or School&apos;s official PayBill number, and enter the amount needed.
              </p>
            </div>
          </div>


          {/* STEP 2: THE SMS SHARE */}
          <div className="flex flex-col items-center">
            {/* Phone Mockup */}
            <div className="w-[260px] h-[520px] bg-white rounded-[3rem] border-[10px] border-gray-900 shadow-xl relative overflow-hidden flex flex-col mb-8">
              <div className="absolute top-0 inset-x-0 h-5 bg-gray-900 w-32 mx-auto rounded-b-2xl"></div>
              
              {/* Header */}
              <div className="bg-slate-100 pt-10 pb-4 px-4 text-center border-b border-gray-200">
                <span className="font-bold text-slate-800">Messages</span>
              </div>

              <div className="flex-1 p-4 flex flex-col justify-end bg-white pb-10">
                {/* Fake SMS Bubble */}
                <div className="bg-gray-100 text-slate-800 p-4 rounded-2xl rounded-tl-sm text-sm mb-8 shadow-sm">
                  <p className="font-bold text-blue-950 mb-1">BillBridge Alert</p>
                  <p className="mb-2">Campaign ready for Kenyatta National Hospital.</p>
                  <p className="text-blue-600 underline">bbridge.io/knh-123</p>
                </div>

                {/* Forward/Share Button with Pulsing Highlight */}
                <div className="relative mx-auto w-full">
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-50"></div>
                  <ShareButton text="Help fund a verified bill on BillBridge:" path="/#campaigns" className="relative w-full bg-blue-600 text-white rounded-full py-3 font-bold flex items-center justify-center gap-2 shadow-lg z-10">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M15 5l-1.41 1.41L18.17 11H2v2h16.17l-4.59 4.59L15 19l7-7-7-7z"/></svg>
                    Forward to Family
                  </ShareButton>
                </div>
              </div>
            </div>

            {/* Layman Explanation */}
            <div className="text-center px-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-950 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">2</div>
              <h4 className="text-2xl font-bold text-blue-950 mb-3">Share to WhatsApp</h4>
              <p className="text-gray-600 leading-relaxed text-sm">
                You will instantly receive a secure link via SMS. Forward this link to your family, friends, or diaspora WhatsApp groups.
              </p>
            </div>
          </div>


          {/* STEP 3: THE DONOR WALLET */}
          <div className="flex flex-col items-center">
            {/* Phone Mockup */}
            <div className="w-[260px] h-[520px] bg-slate-900 rounded-[3rem] border-[10px] border-gray-900 shadow-xl relative overflow-hidden flex flex-col mb-8 text-white">
              <div className="absolute top-0 inset-x-0 h-5 bg-black w-32 mx-auto rounded-b-2xl"></div>
              
              <div className="flex-1 p-6 flex flex-col justify-center items-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                </div>
                
                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Payee (Verified)</h3>
                <p className="text-xl font-bold text-center mb-8">Kenyatta National Hospital</p>
                
                <div className="text-3xl font-light mb-1">KES 15,000</div>
                <div className="text-gray-500 text-sm mb-12">≈ $115.50 (Zero Fees)</div>

                {/* Pay Button with Pulsing Highlight */}
                <div className="relative w-full">
                  <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-40"></div>
                  <Link href="/#campaigns" className="relative w-full bg-gradient-to-r from-[#D4AF37] to-amber-500 text-blue-950 rounded-full py-4 font-bold text-lg shadow-lg shadow-amber-500/20 z-10 flex justify-center items-center gap-2">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M11 21L13 13H20L9 3V11H2L11 21Z"/></svg>
                    Pay Instantly
                  </Link>
                </div>
              </div>
            </div>

            {/* Layman Explanation */}
            <div className="text-center px-4">
              <div className="w-10 h-10 bg-[#D4AF37] text-blue-950 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-md">3</div>
              <h4 className="text-2xl font-bold text-blue-950 mb-3">They Pay Directly</h4>
              <p className="text-gray-600 leading-relaxed text-sm">
                Relatives abroad open the link and tap pay. The money goes straight to the hospital&apos;s account immediately. No middlemen.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}