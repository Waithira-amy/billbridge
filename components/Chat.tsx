"use client";

import { useEffect, useRef, useState } from "react";

type M = { role: "user" | "assistant"; content: string };

function Avatar({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-7 w-7 text-[11px]" : "h-8 w-8 text-xs";
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 border-[#D4AF37] bg-blue-950 font-extrabold tracking-tight text-[#D4AF37] ${dim}`}
    >
      B
    </span>
  );
}

function ThinkingDots() {
  return (
    <div
      style={{ color: "#172554" }}
      className="mr-8 flex items-center gap-1.5 rounded-2xl bg-slate-100 px-3 py-2"
      aria-live="polite"
      aria-label="Thinking"
    >
      <span className="bb-dot h-2 w-2 rounded-full bg-blue-950/70" />
      <span className="bb-dot h-2 w-2 rounded-full bg-blue-950/70" style={{ animationDelay: "0.2s" }} />
      <span className="bb-dot h-2 w-2 rounded-full bg-blue-950/70" style={{ animationDelay: "0.4s" }} />
      <style>{`
        .bb-dot {
          display: inline-block;
          animation: bb-bounce 1s ease-in-out infinite;
        }
        @keyframes bb-bounce {
          0%, 80%, 100% { opacity: 0.35; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}

export default function Chat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<M[]>([
    {
      role: "assistant",
      content: "Hi! I'm Ask BillBridge. Ask me how to start a fundraiser, donate, or how verification works.",
    },
  ]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy, open]);

  async function send(text = q) {
    const content = text.trim();
    if (!content || busy) return;

    const next: M[] = [...msgs, { role: "user", content }];
    setMsgs(next);
    setQ("");
    setBusy(true);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      const d = await r.json().catch(() => ({}));
      const reply =
        typeof d?.reply === "string" && d.reply.trim()
          ? d.reply.trim()
          : "Sorry — I couldn't get an answer just now. Please try again in a moment.";
      setMsgs([...next, { role: "assistant", content: reply }]);
    } catch {
      setMsgs([
        ...next,
        {
          role: "assistant",
          content: "Something went wrong reaching Ask BillBridge. Please try again.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ask BillBridge"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 rounded-full bg-blue-950 py-3 pl-3 pr-5 font-bold text-white shadow-lg hover:bg-blue-900"
      >
        <Avatar />
        <span>Ask BillBridge</span>
      </button>
    );
  }

  return (
    <div
      style={{ color: "#172554", backgroundColor: "#ffffff" }}
      className="fixed bottom-4 right-4 z-50 flex h-96 w-80 flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white text-blue-950 shadow-2xl"
    >
      <div className="flex items-center justify-between bg-blue-950 p-3 text-white">
        <div className="flex items-center gap-2">
          <Avatar size="sm" />
          <b>Ask BillBridge</b>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
          ✕
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-2 text-sm">
        {msgs.map((m, i) => (
          <p
            key={i}
            style={{ color: "#172554" }}
            className={`rounded-2xl p-2 ${
              m.role === "user" ? "ml-8 bg-amber-100/60 text-blue-950" : "mr-8 bg-slate-100 text-blue-950"
            }`}
          >
            {m.content}
          </p>
        ))}

        {busy && <ThinkingDots />}

        {msgs.length === 1 &&
          !busy &&
          ["How do I start a fundraiser?", "Is my money safe?", "What are the fees?"].map((s) => (
            <button
              key={s}
              type="button"
              style={{ color: "#172554" }}
              onClick={() => send(s)}
              className="block rounded-full border border-gray-200 px-3 py-1 text-left text-xs text-blue-950"
            >
              {s}
            </button>
          ))}
        <div ref={endRef} />
      </div>

      <div className="flex gap-1 border-t p-2">
        <input
          style={{ color: "#172554", backgroundColor: "#ffffff" }}
          className="flex-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-blue-950 placeholder:text-gray-400 disabled:opacity-60"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={busy ? "Thinking…" : "Ask a question…"}
          disabled={busy}
        />
        <button
          type="button"
          onClick={() => send()}
          disabled={busy || !q.trim()}
          className="rounded-full bg-[#D4AF37] px-4 font-bold text-blue-950 disabled:opacity-60"
        >
          {busy ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
