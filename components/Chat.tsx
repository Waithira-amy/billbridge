"use client";
import { useState } from "react";
type M = { role: "user" | "assistant"; content: string };
export default function Chat() {
  const [open, setOpen] = useState(false), [msgs, setMsgs] = useState<M[]>([{ role: "assistant", content: "Hi! I'm the BillBridge helper. Ask me how to start a fundraiser, donate, or how verification works." }]), [q, setQ] = useState(""), [busy, setBusy] = useState(false);
  async function send(text = q) {
    if (!text.trim() || busy) return; const next = [...msgs, { role: "user", content: text } as M]; setMsgs(next); setQ(""); setBusy(true);
    const r = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ messages: next.slice(1) }) }); const d = await r.json();
    setMsgs([...next, { role: "assistant", content: d.reply }]); setBusy(false);
  }
  if (!open) return <button onClick={() => setOpen(true)} className="fixed bottom-4 right-4 rounded-full bg-blue-950 px-5 py-3 font-bold text-white shadow-lg hover:bg-blue-900">💬 Help</button>;
  return (
    <div style={{ color: "#172554", backgroundColor: "#ffffff" }} className="fixed bottom-4 right-4 flex h-96 w-80 flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white text-blue-950 shadow-2xl">
      <div className="flex justify-between bg-blue-950 p-3 text-white"><b>BillBridge <span className="text-[#D4AF37]">Help</span></b><button onClick={() => setOpen(false)}>✕</button></div>
      <div className="flex-1 space-y-2 overflow-y-auto p-2 text-sm">{msgs.map((m, i) => <p key={i} style={{ color: "#172554" }} className={`rounded-2xl p-2 ${m.role === "user" ? "ml-8 bg-amber-100/60 text-blue-950" : "mr-8 bg-slate-100 text-blue-950"}`}>{m.content}</p>)}{busy && <p className="text-zinc-400">…</p>}
        {msgs.length === 1 && ["How do I start a fundraiser?", "Is my money safe?", "What are the fees?"].map(s => <button key={s} style={{ color: "#172554" }} onClick={() => send(s)} className="block rounded-full border border-gray-200 px-3 py-1 text-left text-xs text-blue-950">{s}</button>)}</div>
      <div className="flex gap-1 border-t p-2"><input style={{ color: "#172554", backgroundColor: "#ffffff" }} className="flex-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-blue-950 placeholder:text-gray-400" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask a question…" /><button onClick={() => send()} className="rounded-full bg-[#D4AF37] px-4 font-bold text-blue-950">Send</button></div>
    </div>
  );
}
