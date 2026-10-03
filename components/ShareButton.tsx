"use client";

import { useEffect, useState, type ReactNode } from "react";

// Opens WhatsApp with a message that ends in a real link.
// Set NEXT_PUBLIC_APP_URL to your deployed URL; otherwise we use the browser origin after mount.
export default function ShareButton({
  text,
  path,
  className,
  children,
}: {
  text: string;
  path: string;
  className?: string;
  children: ReactNode;
}) {
  const envBase = process.env.NEXT_PUBLIC_APP_URL?.trim() || "";
  const [base, setBase] = useState(envBase || "http://localhost:3000");

  useEffect(() => {
    if (!envBase && typeof window !== "undefined") {
      setBase(window.location.origin);
    }
  }, [envBase]);

  const href = "https://wa.me/?text=" + encodeURIComponent(`${text} ${base}${path}`);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
