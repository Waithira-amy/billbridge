# BillBridge
**Transparent fundraising, borderless contributions.**

BillBridge lets families, friends and the diaspora fund **verified institutional bills** (school fees, hospital bills, community projects). Donors pay over **Bitcoin Lightning**; funds are held in **escrow** and released to the institution's PayBill in shillings. Nobody needs to understand Bitcoin.

> Prototype status: verification and the user flow are real. In demo mode the Lightning payment, conversion and final payout are **simulated**.

## Features
- Campaign cards with category filters, currency selector and **donation modal** (Lightning QR + copyable invoice + live KES/USD/NGN/ZAR/GHS... to sats converter, simulated M-Pesa/card, receipt)
- **Registration**: web form (`/start`) and **USSD** (`*384*99#` example) with instant PayBill verification; unknown PayBills and personal wallets are rejected
- **Interactive USSD simulator** on the landing page
- **Escrow engine**: payments held until the goal is met, then released to the verified institution
- Public **Verified Institutions** page, institution dashboard, guided **/demo**, **/lightning** (Lightning to M-Pesa via bitcoin.co.ke)
- **AI help chatbot** that explains Lightning, financial freedom, PayBill and more; **feedback form**; WhatsApp sharing with real links
- Multi-currency + sats **FX service** (cached), African campaign illustrations

## Tech stack
Next.js 16 (App Router) · React · TypeScript · Tailwind CSS · Next.js route handlers · LNbits (Lightning invoices) · bitcoin.co.ke LNURL API · Africa's Talking (USSD/SMS) · Anthropic Claude API (optional chatbot) · qrcode.react · PostgreSQL + Prisma schema (`prisma/schema.prisma`, not yet wired)

## Quick start
```bash
cp .env.example .env.local      # Windows: copy .env.example .env.local
npm install
npm run dev                     # http://localhost:3000
```
Demo path: Landing > **Donate Now** > Lightning > *simulate wallet payment* > receipt. Also try `/demo`, the USSD simulator (PayBill `400200`), `/lightning`, `/institutions`.

## Environment variables (`.env.example`)
| Variable | Purpose |
|---|---|
| `LNBITS_URL`, `LNBITS_INVOICE_KEY` | Real Lightning invoices. Empty = demo mode |
| `APP_URL`, `NEXT_PUBLIC_APP_URL` | Public URL used in SMS and WhatsApp links |
| `AT_USERNAME`, `AT_API_KEY` | Africa's Talking SMS (empty = logged to console) |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | AI chatbot (empty = built-in glossary answers) |
| `BITCOINKE_LIVE` | `true` = REAL mainnet Lightning-to-M-Pesa payments. Leave empty for demo |
| `FALLBACK_BTC_USD` | Fallback BTC price if live rates are unreachable |
| `FEEDBACK_WEBHOOK_URL`, `FEEDBACK_ADMIN_KEY` | Forward / read feedback submissions |

## Project structure
`app/` pages and `app/api/` routes · `components/` UI (DonateModal, UssdSimulator, Chat...) · `lib/` logic (store, lightning, settle, fx, mpesaln, knowledge) · `prisma/` target schema

## Real vs simulated
| Real | Simulated / not built |
|---|---|
| PayBill verification, flows, USSD handler, escrow logic, FX service, chatbot | Lightning payment and sats-to-KES conversion (demo mode), final PayBill payout, registry (demo data) |
| Lightning invoices with an LNbits key; M-Pesa leg with `BITCOINKE_LIVE` | Auth/roles, database persistence, donor dashboard, document upload, refunds |

## Roadmap
Wire Postgres + Prisma and Auth.js roles; real registry (KYB) checks; Daraja PayBill payouts and STK push; mainnet pilot with 2-3 institutions; escrow refunds on deadline.

## H.A.U.T.E.
Human first (harambee, verified payee) · Accessible (USSD + web + chatbot) · Useful now (pays existing PayBills in KES) · Trustworthy (registry, escrow, receipts) · Easy (one link, QR, 4-click demo).

## Team
Dee · Lucy · Amy · Beth · Tina · Jael
