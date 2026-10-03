"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"] as const;
const DEFAULT_CODE = "*384*99#";
const DEMO_PHONE = "+254700000001";

type Mode = "dialer" | "session" | "ended";

function stripPrefix(raw: string) {
  if (raw.startsWith("CON ")) return { continuing: true, body: raw.slice(4) };
  if (raw.startsWith("END ")) return { continuing: false, body: raw.slice(4) };
  return { continuing: false, body: raw };
}

function extractDonatePath(endBody: string) {
  const m = endBody.match(/\/donate\/(BB-[\w-]+)/i);
  if (m) return `/donate/${m[1]}`;
  const id = endBody.match(/Campaign\s+(BB-[\w-]+)/i);
  if (id) return `/donate/${id[1]}`;
  return null;
}

export default function UssdSimulator() {
  const [mode, setMode] = useState<Mode>("dialer");
  const [dial, setDial] = useState(DEFAULT_CODE);
  const [sessionText, setSessionText] = useState("");
  const [input, setInput] = useState("");
  const [screen, setScreen] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [donatePath, setDonatePath] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const display = useMemo(() => {
    if (mode === "dialer") return dial || " ";
    if (mode === "session") return input || " ";
    return "";
  }, [mode, dial, input]);

  function pressKey(key: string) {
    if (busy) return;
    setError("");
    if (mode === "dialer") setDial((d) => (d + key).slice(0, 20));
    else if (mode === "session") setInput((v) => (v + key).slice(0, 32));
  }

  function backspace() {
    if (busy) return;
    if (mode === "dialer") setDial((d) => d.slice(0, -1));
    else if (mode === "session") setInput((v) => v.slice(0, -1));
  }

  function reset() {
    setMode("dialer");
    setDial(DEFAULT_CODE);
    setSessionText("");
    setInput("");
    setScreen("");
    setError("");
    setBusy(false);
    setDonatePath(null);
    setCopied(false);
  }

  async function callApi(nextText: string) {
    setBusy(true);
    setError("");
    setCopied(false);
    try {
      const body = new URLSearchParams({
        phoneNumber: DEMO_PHONE,
        serviceCode: "*384*99#",
        text: nextText,
        sessionId: "web-demo",
      });
      const r = await fetch("/api/ussd", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      const raw = await r.text();
      const { continuing, body: msg } = stripPrefix(raw);
      setScreen(msg);
      if (continuing) {
        setMode("session");
        setSessionText(nextText);
        setInput("");
        setDonatePath(null);
      } else {
        setMode("ended");
        setInput("");
        setDonatePath(extractDonatePath(msg));
      }
    } catch {
      setError("Could not reach USSD. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function onCall() {
    if (busy) return;
    if (mode === "dialer") {
      const code = dial.trim() || DEFAULT_CODE;
      if (!code.includes("384")) {
        setError("Dial *384*99# to start BillBridge.");
        return;
      }
      await callApi("");
      return;
    }
    if (mode === "session") {
      const step = input.trim();
      if (!step) {
        setError("Enter a reply, then press the green button.");
        return;
      }
      const next = sessionText ? `${sessionText}*${step}` : step;
      await callApi(next);
    }
  }

  async function copyLink() {
    if (!donatePath) return;
    const url = `${window.location.origin}${donatePath}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setError("Could not copy. Use Open campaign instead.");
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-3 w-[260px] overflow-hidden rounded-[3rem] border-[10px] border-gray-900 bg-white shadow-xl">
        <div className="absolute inset-x-0 top-0 mx-auto h-5 w-32 rounded-b-2xl bg-gray-900" />

        <div className="flex h-[500px] flex-col bg-gray-50 pt-8">
          {mode === "ended" ? (
            <div className="flex flex-1 flex-col px-4 pb-4">
              <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                BillBridge USSD
              </p>
              <div className="mb-3 flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 text-sm leading-relaxed whitespace-pre-wrap text-blue-950">
                {screen}
              </div>
              {donatePath && (
                <div className="mb-2 space-y-2">
                  <Link
                    href={donatePath}
                    className="block rounded-full bg-[#D4AF37] px-4 py-2.5 text-center text-sm font-bold text-blue-950"
                  >
                    Open campaign
                  </Link>
                  <button
                    type="button"
                    onClick={copyLink}
                    className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-blue-950"
                  >
                    {copied ? "Link copied" : "Copy donate link"}
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={reset}
                className="rounded-full bg-blue-950 px-4 py-2.5 text-sm font-bold text-white"
              >
                Dial again
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-1 flex-col px-4 pb-2">
                <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  {mode === "dialer" ? "BillBridge" : "BillBridge USSD"}
                </p>

                {mode === "session" && (
                  <div className="mb-3 max-h-28 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 text-xs leading-relaxed whitespace-pre-wrap text-blue-950">
                    {screen || "…"}
                  </div>
                )}

                <div
                  className={`text-center font-light tracking-wider text-slate-800 ${
                    mode === "dialer" ? "mb-6 text-3xl" : "mb-3 text-xl"
                  }`}
                >
                  {display}
                </div>

                {error && <p className="mb-2 text-center text-xs text-red-600">{error}</p>}
                {busy && <p className="mb-2 text-center text-xs text-slate-400">Connecting…</p>}
              </div>

              <div className="grid grid-cols-3 gap-y-5 px-6 text-center text-2xl font-light text-slate-600">
                {KEYS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => pressKey(k)}
                    disabled={busy}
                    className="rounded-full py-1 hover:bg-slate-200/70 active:bg-slate-300/80 disabled:opacity-50"
                  >
                    {k}
                  </button>
                ))}
              </div>

              <div className="mt-4 mb-5 flex items-center justify-center gap-8 px-6">
                <button
                  type="button"
                  onClick={backspace}
                  disabled={busy}
                  className="text-xs font-bold uppercase tracking-wide text-slate-400 hover:text-slate-600 disabled:opacity-50"
                >
                  Del
                </button>

                <div className="relative">
                  {mode === "dialer" && !busy && (
                    <div className="absolute inset-0 mx-auto h-14 w-14 animate-ping rounded-full bg-green-400 opacity-60" />
                  )}
                  <button
                    type="button"
                    onClick={onCall}
                    disabled={busy}
                    aria-label={mode === "dialer" ? "Call" : "Send USSD reply"}
                    className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 disabled:opacity-60"
                  >
                    {mode === "dialer" ? (
                      <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                    ) : (
                      <span className="text-xs font-extrabold tracking-wide">OK</span>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={reset}
                  disabled={busy}
                  className="text-xs font-bold uppercase tracking-wide text-slate-400 hover:text-slate-600 disabled:opacity-50"
                >
                  Reset
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="max-w-[260px] text-center text-xs text-slate-500">
        Try it: Call → <span className="font-semibold text-blue-950">1</span> → PayBill{" "}
        <span className="font-semibold text-blue-950">400200</span> → account → amount → confirm{" "}
        <span className="font-semibold text-blue-950">1</span>
      </p>
    </div>
  );
}
