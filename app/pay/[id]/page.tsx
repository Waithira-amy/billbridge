"use client";

import { use, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

export default function Pay({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Retrieve the Bitnob invoice data saved during the checkout step
    const data = sessionStorage.getItem(`billbridge_invoice_${id}`);
    if (data) {
      setInvoiceData(JSON.parse(data));
    } else {
      setError("No active invoice found. Please start over.");
    }
  }, [id]);

  const shell = (content: React.ReactNode) => (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 px-6 pb-16 pt-28">
        <main className="mx-auto max-w-sm rounded-[2rem] border border-gray-100 bg-white p-8 text-center shadow-xl">
          {content}
        </main>
      </div>
    </>
  );

  if (error) {
    return shell(
      <div className="py-10">
        <p className="text-red-500 font-bold mb-4">{error}</p>
        <Link href={`/donate/${id}`} className="text-blue-950 font-bold underline">Go back</Link>
      </div>
    );
  }

  if (!invoiceData || !invoiceData.invoice) {
     return shell(<div className="py-10 animate-pulse text-gray-400 font-bold text-sm">Generating Lightning Invoice...</div>);
  }

  return shell(
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-extrabold text-blue-950 mb-2">Scan to Pay</h1>
      <p className="text-sm text-gray-500 mb-6">Use any Lightning wallet (e.g., Strike, CashApp, Wallet of Satoshi) to scan this code.</p>
      
      {/* Bitnob QR Code Generation */}
      <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-100 mb-6">
        <QRCodeSVG value={invoiceData.invoice} size={220} />
      </div>
      
      <p className="text-[10px] text-slate-400 break-all w-full mb-6 font-mono bg-slate-50 p-3 rounded-lg border border-slate-100 line-clamp-3">
        {invoiceData.invoice}
      </p>
      
      <a 
        href={`lightning:${invoiceData.invoice}`}
        className="w-full bg-blue-950 text-white py-4 rounded-full font-bold shadow-md hover:bg-slate-800 transition-colors block text-center"
      >
        Open in Wallet
      </a>
    </div>
  );
}