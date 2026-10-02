import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VerifiedBills from "@/components/sections/VerifiedBills";

export default function CampaignsPage() {
  return (
    <div className="min-h-screen font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16">
        <VerifiedBills />
      </main>

      <Footer />
    </div>
  );
}