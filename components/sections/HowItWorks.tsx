export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-4">The Pipeline</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-blue-950 mb-6">Local USSD to Global Lightning</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A frictionless bridge designed for zero leakage. See exactly how a campaign moves from a basic feature phone directly into an institutional ledger.
          </p>
        </div>

        <div className="relative">
          {/* Central connecting line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-0.5 bg-gray-200 -translate-x-1/2"></div>

          {/* Step 1: Left Aligned */}
          <div className="relative flex flex-col md:flex-row items-center justify-between mb-20 md:mb-12">
            <div className="md:w-5/12 text-center md:text-right pr-0 md:pr-12 mb-8 md:mb-0">
              <div className="w-16 h-16 bg-white border-2 border-blue-950 rounded-2xl flex items-center justify-center text-2xl font-bold text-blue-950 mx-auto md:ml-auto md:mr-0 mb-6 shadow-sm">1</div>
              <h4 className="text-2xl font-bold text-blue-950 mb-4">Dial *384*99#</h4>
              <p className="text-gray-600 leading-relaxed">
                The local organizer initiates the campaign offline. They enter the verified PayBill or bank account of the target institution (school, hospital). The system instantly validates the payee against our public registry.
              </p>
            </div>
            <div className="hidden md:flex absolute left-1/2 top-8 w-4 h-4 bg-[#D4AF37] rounded-full -translate-x-1/2 border-4 border-slate-50 z-10"></div>
            <div className="md:w-5/12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center">
              {/* Visual representation of a USSD menu */}
              <div className="w-full max-w-[200px] bg-blue-950 rounded-xl p-4 text-green-400 font-mono text-sm leading-relaxed border-t-8 border-gray-800">
                &gt; BillBridge<br/>
                1. Register Bill<br/>
                2. Check Status<br/>
                &gt; 1<br/>
                Enter PayBill No:
              </div>
            </div>
          </div>

          {/* Step 2: Right Aligned */}
          <div className="relative flex flex-col md:flex-row-reverse items-center justify-between mb-20 md:mb-12">
            <div className="md:w-5/12 text-center md:text-left pl-0 md:pl-12 mb-8 md:mb-0">
              <div className="w-16 h-16 bg-blue-950 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto md:mr-auto md:ml-0 mb-6 shadow-md">2</div>
              <h4 className="text-2xl font-bold text-blue-950 mb-4">Generate & Share</h4>
              <p className="text-gray-600 leading-relaxed">
                Once validated, the backend spins up a dedicated landing page and a Lightning Network invoice tied strictly to that ledger. The organizer gets an SMS link to forward to diaspora WhatsApp groups.
              </p>
            </div>
            <div className="hidden md:flex absolute left-1/2 top-8 w-4 h-4 bg-blue-950 rounded-full -translate-x-1/2 border-4 border-slate-50 z-10"></div>
            <div className="md:w-5/12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center">
               <div className="w-full h-32 border-2 border-dashed border-[#D4AF37] rounded-xl flex items-center justify-center bg-amber-50">
                 <span className="font-bold text-[#D4AF37]">Link Generated</span>
               </div>
            </div>
          </div>

          {/* Step 3: Left Aligned */}
          <div className="relative flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-5/12 text-center md:text-right pr-0 md:pr-12 mb-8 md:mb-0">
              <div className="w-16 h-16 bg-gradient-to-r from-[#D4AF37] to-amber-400 rounded-2xl flex items-center justify-center text-2xl font-bold text-blue-950 mx-auto md:ml-auto md:mr-0 mb-6 shadow-lg shadow-amber-400/30">3</div>
              <h4 className="text-2xl font-bold text-blue-950 mb-4">Instant Settlement</h4>
              <p className="text-gray-600 leading-relaxed">
                Diaspora donors pay via Lightning. The Bitcoin is instantly swapped to KES fiat and deposited directly into the institution's account. No middlemen. No waiting periods.
              </p>
            </div>
            <div className="hidden md:flex absolute left-1/2 top-8 w-4 h-4 bg-[#D4AF37] rounded-full -translate-x-1/2 border-4 border-slate-50 z-10"></div>
            <div className="md:w-5/12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}