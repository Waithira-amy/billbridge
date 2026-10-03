import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import VerifiedNetwork from "@/components/sections/VerifiedNetwork";
import HowItWorks from "@/components/sections/HowItWorks";
import LiveImpact from "@/components/sections/LiveImpact";
import ActiveBridges from "@/components/sections/VerifiedBills";

export default function Home() {
  return (
    <div className="min-h-screen font-sans flex flex-col scroll-smooth">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <ActiveBridges />
        <VerifiedNetwork />
        <LiveImpact />
        
      </main>

      <Footer />
    </div>
  );
}