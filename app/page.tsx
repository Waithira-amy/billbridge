import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import ActiveBridges from "@/components/sections/VerifiedBills";

export default function Home() {
  return (
    <div className="min-h-screen font-sans flex flex-col scroll-smooth">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <ActiveBridges />
      </main>

      <Footer />
    </div>
  );
}