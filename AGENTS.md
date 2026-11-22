# ShopLedger

## Stack
- Node.js application using Express and `body-parser`.
- Static browser UI in `public/`.
- File-backed data store at `data/db.json`.
- Configuration, including shop data, GST slabs, and coupons, is in `config.js`.

## Module map
- `routes/products.js` — product and active-coupon API routes.
- `routes/orders.js` — order listing, creation, and cancellation routes.
- `routes/customers.js` — customer listing and Khata settlement route.
- `routes/reports.js` — dashboard, GST reconciliation, pricing preview, and export routes.
- `lib/coupons.js` — normalizes, validates, calculates, and lists coupons.
- `lib/dates.js` — creates and normalizes date keys and fiscal years.
- `lib/inventory.js` — finds products and checks, reserves, releases, and summarizes inventory.
- `lib/invoice.js` — computes and renders the printable HTML invoice.
- `lib/ledger.js` — manages customer balances, Khata charges, reversals, and settlements.
- `lib/orders.js` — adds, gets, cancels, and lists orders.
- `lib/pricing.js` — calculates subtotals, discounts, taxes, and order totals.
- `lib/reports.js` — builds dashboard and GST reconciliation data.
- `lib/store.js` — reads, writes, and audits the JSON database.
- `lib/tax.js` — resolves GST rates and splits CGST and SGST.

## Commands
- Start the app: `node server.js`
- Run tests: `node --test`

## Rules
1. Write characterization tests before changing behaviour.
2. Change only the module(s) the ticket is about.
3. Tests never read or write `data/db.json`; use in-memory data.
4. Add no dependencies.
5. Make the smallest fix that works.

## Current ticket
Invoice total and GST breakdown do not match what the customer was billed.

Allowed files: `lib/invoice.js`; use `lib/tax.js` only if truly needed.
