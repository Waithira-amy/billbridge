"use client";

import Navbar from "@/components/Navbar";
import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input";
import { getCountryCallingCode, type Country } from "react-phone-number-input";
import { allPlatformCurrencies } from "@/lib/currencies";
import { isValidDonorEmail, isValidDonorName, isValidDonorPhone } from "@/lib/donor-validation";

const kes = (n: number) => "KES " + n.toLocaleString();
const SUGGESTED_AMOUNTS = [500, 1000, 2500, 5000, 10000];
const formatCurrency = (amountKes: number, rate: number, symbol: string) =>
  `${symbol}${(amountKes * rate).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

type CountryOption = { value?: Country; label: string; divider?: boolean };

function SearchableCountrySelect({
  value,
  onChange,
  options,
  disabled,
  readOnly,
  onFocus,
  onBlur,
  className,
  "aria-label": ariaLabel,
}: {
  value?: Country;
  onChange: (country?: Country) => void;
  options: CountryOption[];
  disabled?: boolean;
  readOnly?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  "aria-label"?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const countryOptions = options.filter(
    (option): option is { value: Country; label: string } => Boolean(option.value) && !option.divider
  );
  const selectedCountry = countryOptions.find((option) => option.value === value);
  const normalizedSearch = search.trim().toLowerCase().replace(/^\+/, "");
  const filteredOptions = countryOptions.filter((option) =>
    option.label.toLowerCase().includes(normalizedSearch) ||
    option.value.toLowerCase().includes(normalizedSearch) ||
    getCountryCallingCode(option.value).includes(normalizedSearch)
  );

  return (
    <div
      ref={containerRef}
      className={`PhoneInputCountry ${className ?? ""}`}
      onFocusCapture={onFocus}
      onBlurCapture={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node | null)) onBlur?.();
      }}
    >
      <button
        type="button"
        disabled={disabled || readOnly}
        aria-label={ariaLabel ?? "Select country"}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex min-w-0 items-center gap-2 text-sm font-medium text-blue-950"
      >
        <span className="truncate">{selectedCountry?.label ?? "Select country"}</span>
        {selectedCountry && (
          <span className="shrink-0 text-gray-500">
            +{getCountryCallingCode(selectedCountry.value)}
          </span>
        )}
        <svg className="h-3 w-3 shrink-0" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="m2 4 4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 max-w-[80vw] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          <input
            autoFocus
            type="search"
            aria-label="Search countries"
            placeholder="Search country or code"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setIsOpen(false);
            }}
            className="w-full border-b border-gray-100 bg-slate-50 px-3 py-3 text-sm text-blue-950 outline-none"
          />
          <div role="listbox" className="max-h-60 overflow-y-auto p-1">
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setSearch("");
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-blue-950 hover:bg-slate-100"
              >
                <span>{option.label}</span>
                <span className="ml-3 shrink-0 text-xs text-gray-500">
                  +{getCountryCallingCode(option.value)}
                </span>
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <p className="px-3 py-4 text-center text-sm text-gray-500">No countries found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Donate({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [bill, setBill] = useState<any>(null);
  const [amt, setAmt] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState<string | undefined>();
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [err, setErr] = useState("");
  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const currency = allPlatformCurrencies.find(({ code }) => code === currencyCode) ?? allPlatformCurrencies[0];
  const donorNameError = donorName.trim() && !isValidDonorName(donorName)
    ? "Use letters and spaces only."
    : "";
  const donorEmailError = donorEmail.trim() && !isValidDonorEmail(donorEmail)
    ? "Enter a valid email address."
    : "";
  const donorPhoneError = donorPhone && !isValidDonorPhone(donorPhone)
    ? "Enter a valid phone number for the selected country."
    : "";

  useEffect(() => {
    async function loadBill() {
      try {
        const response = await fetch(`/api/campaigns/${id}`);
        const data = await response.json();
        setBill(data);
      } catch {
        setErr("Unable to load this campaign. Please try again.");
      }
    }

    loadBill();
  }, [id]);

  useEffect(() => {
    const requestedCurrency = new URLSearchParams(window.location.search).get("currency");
    const savedCurrency = sessionStorage.getItem("billbridge_currency");
    const selectedCurrency = requestedCurrency || savedCurrency;

    if (allPlatformCurrencies.some(({ code }) => code === selectedCurrency)) {
      setCurrencyCode(selectedCurrency!);
      sessionStorage.setItem("billbridge_currency", selectedCurrency!);
    }
  }, [id]);

  async function submit() {
    setErr("");

    const invalidDonorDetails =
      Boolean(donorName.trim() && !isValidDonorName(donorName)) ||
      Boolean(donorEmail.trim() && !isValidDonorEmail(donorEmail)) ||
      Boolean(donorPhone && !isValidDonorPhone(donorPhone));
    if (invalidDonorDetails) return;

    const amount = Number(amt);
    if (!Number.isFinite(amount) || amount <= 0) {
      setErr("Please enter a valid contribution amount.");
      return;
    }

    const amountKes = Math.round(amount / currency.rate);
    if (amountKes <= 0) {
      setErr("The contribution must be at least KES 1 equivalent.");
      return;
    }

    if (bill && amountKes > bill.remainingKes) {
      setErr(
        `The remaining bill is ${formatCurrency(bill.remainingKes, currency.rate, currency.symbol)}. Please enter a smaller amount.`
      );
      return;
    }

    setCreatingInvoice(true);

    try {
      // Calls your existing backend route, passing the required Bitnob parameters
      const response = await fetch(`/api/campaigns/${id}/invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amountKes,
          customerEmail: donorEmail.trim() || "donor@billbridge.io", // Fallback email for Bitnob
          description: `Donation to ${bill?.institution || 'Institution'}`, // Required by Bitnob
          donorDetails: {
            name: donorName,
            email: donorEmail,
            phone: donorPhone,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErr(data.error || "Unable to create the payment request.");
        return;
      }

      sessionStorage.setItem(
        `billbridge_invoice_${id}`,
        JSON.stringify({ ...data, currencyCode, currencyAmount: amount })
      );
      router.push(`/pay/${id}`);
    } catch {
      setErr("Something went wrong while creating the payment.");
    } finally {
      setCreatingInvoice(false);
    }
  }

  const shell = (content: React.ReactNode) => (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 px-6 pb-16 pt-28">
        <main className="mx-auto max-w-md rounded-[2rem] border border-gray-100 bg-white p-8 text-blue-950 shadow-xl">
          {content}
        </main>
      </div>
    </>
  );

  if (!bill) {
    return shell(
      <div className="py-10 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-950" />
        <p className="text-gray-500">Loading campaign...</p>
      </div>
    );
  }

  if (bill.error) {
    return shell(
      <div className="py-10 text-center">
        <p className="mb-2 text-4xl">😕</p>
        <h1 className="mb-2 text-xl font-bold text-blue-950">Campaign not found</h1>
        <p className="text-sm text-gray-500">
          This campaign may have been removed or the link may be incorrect.
        </p>
      </div>
    );
  }

  return shell(
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
          Make a contribution
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-blue-950">
          {bill.title}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Verified payee: {bill.institution} · PayBill {bill.paybill}
        </p>
      </div>

      <div>
        <label htmlFor="amount" className="mb-2 block text-sm font-semibold text-blue-950">
          Contribution amount
        </label>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
            {currency.symbol}
          </span>

          <input
            id="amount"
            list="quick-amounts"
            className="w-full rounded-xl border border-gray-200 bg-slate-50 py-4 pl-14 pr-4 text-blue-950 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
            type="text"
            inputMode="decimal"
            placeholder="Select or Type amount"
            value={amt}
            onChange={(e) => {
              setAmt(e.target.value);
              setErr("");
            }}
          />
        </div>

        <datalist id="quick-amounts">
          {SUGGESTED_AMOUNTS.filter((amount) => amount <= bill.remainingKes).map((amount) => (
            <option
              key={amount}
              value={String(Number((amount * currency.rate).toFixed(2)))}
            />
          ))}
        </datalist>

        <p className="mt-2 text-xs text-gray-400">
          Remaining bill: {formatCurrency(bill.remainingKes, currency.rate, currency.symbol)}
          {currency.code !== "KES" && ` (approximately ${kes(bill.remainingKes)})`}
        </p>
        {amt && Number(amt) > 0 && (
          <p className="mt-1 text-xs text-gray-400">
            Approximate invoice amount: {kes(Math.round(Number(amt) / currency.rate))}
          </p>
        )}
      </div>

      <fieldset className="space-y-3 border-t border-gray-100 pt-5">
        <legend className="text-sm font-semibold text-blue-950">Thank-you details (optional)</legend>
        <p className="text-xs text-gray-500">
          Used only to send a thank-you after your payment is confirmed.
        </p>
        <label className="block">
          <span className="mb-1 block text-sm text-gray-600">Name</span>
          <input
            autoComplete="name"
            maxLength={100}
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            aria-invalid={Boolean(donorNameError)}
            aria-describedby="donor-name-error"
            className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-blue-950 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
          />
          {donorNameError && (
            <p id="donor-name-error" className="mt-1 text-xs text-red-600">{donorNameError}</p>
          )}
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-gray-600">Email address</span>
          <input
            type="email"
            autoComplete="email"
            maxLength={254}
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            aria-invalid={Boolean(donorEmailError)}
            aria-describedby="donor-email-error"
            className="w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-blue-950 outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
          />
          {donorEmailError && (
            <p id="donor-email-error" className="mt-1 text-xs text-red-600">{donorEmailError}</p>
          )}
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-gray-600">Phone number</span>
          <PhoneInput
            defaultCountry="KE"
            value={donorPhone}
            onChange={setDonorPhone}
            type="tel"
            autoComplete="tel"
            placeholder="Phone number"
            countrySelectComponent={SearchableCountrySelect}
            countrySelectProps={{ "aria-label": "Select country" }}
            aria-invalid={Boolean(donorPhoneError)}
            aria-describedby="donor-phone-error"
            className="donor-phone-input"
          />
          {donorPhoneError && (
            <p id="donor-phone-error" className="mt-1 text-xs text-red-600">{donorPhoneError}</p>
          )}
        </label>
      </fieldset>

      {err && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {err}
        </div>
      )}

      <button
        type="button"
        disabled={creatingInvoice || !amt}
        onClick={submit}
        className="w-full rounded-full bg-gradient-to-r from-[#D4AF37] to-amber-400 py-4 font-bold text-blue-950 shadow-md transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {creatingInvoice ? "Creating payment..." : "Generate Lightning payment"}
      </button>
    </div>
  );
}