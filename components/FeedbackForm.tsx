"use client";

import { FormEvent, useState } from "react";

export default function FeedbackForm() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
        }),
      });
      const result: { error?: string } = await response.json();
      if (!response.ok) {
        setError(result.error ?? "We couldn't send your message. Please try again.");
        return;
      }
      form.reset();
      setSubmitted(true);
    } catch (requestError) {
      console.error("Unable to submit feedback:", requestError);
      setError("We couldn't send your message. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {submitted && (
        <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          Thanks for your feedback. Your message has been received.
        </p>
      )}

      <label className="block text-sm font-semibold text-blue-950">
        Name
        <input
          name="name"
          required
          maxLength={100}
          autoComplete="name"
          className="mt-2 w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-blue-950"
        />
      </label>

      <label className="block text-sm font-semibold text-blue-950">
        Email address
        <input
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          className="mt-2 w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-blue-950"
        />
      </label>

      <label className="block text-sm font-semibold text-blue-950">
        Subject <span className="font-normal text-gray-500">(optional)</span>
        <input
          name="subject"
          maxLength={150}
          className="mt-2 w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-blue-950"
        />
      </label>

      <label className="block text-sm font-semibold text-blue-950">
        Message
        <textarea
          name="message"
          required
          maxLength={5000}
          rows={6}
          className="mt-2 w-full resize-y rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-blue-950"
        />
      </label>

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-blue-950 px-6 py-4 font-bold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Send feedback"}
      </button>
    </form>
  );
}
