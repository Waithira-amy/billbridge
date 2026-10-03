"use client";
import type { ReactNode } from "react";
// Opens WhatsApp with a message that ends in a real link. Set NEXT_PUBLIC_APP_URL to your deployed URL (falls back to the current site).
export default function ShareButton({ text, path, className, children }: { text: string; path: string; className?: string; children: ReactNode }) {
  const base = (process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")).replace(/\/+$/, "");
  const campaignUrl = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const href = "https://wa.me/?text=" + encodeURIComponent(`${text} ${campaignUrl}`);
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}
