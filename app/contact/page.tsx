import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedbackForm from "@/components/FeedbackForm";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow bg-slate-50 px-6 pb-16 pt-28">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-gray-100 bg-white p-8 text-blue-950 shadow-xl sm:p-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">We’d love to hear from you</p>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight">Contact BillBridge</h1>
          <p className="mb-8 text-gray-600">
            Send us feedback, questions, or suggestions. Your message is saved securely for the BillBridge team.
          </p>
          <FeedbackForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
