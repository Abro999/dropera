# DropEra — premium curated storefront

"Objects worth finding." A Next.js 14 (App Router) + TypeScript + Tailwind storefront, with:

- A swappable commerce backend (Mock / Shopify / Odoo) behind one `CommerceProvider` interface
- Razorpay checkout, with payment verification done server-side
- An `/admin` panel to add, edit, and delete products (photos included) directly from your phone — no code editing required
- Optional CJ Dropshipping order auto-forwarding after a successful payment

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. The site runs entirely on mock data out of the box — no API keys needed to browse, filter, or add to cart.

## How to add your own products

Open `/admin` on your deployed site (e.g. `your-site.vercel.app/admin`), enter your admin password, and fill in the
form — title, photos, price, variants, etc. Submitting commits a new entry straight into `src/data/products.ts` on
GitHub, which triggers a new deployment automatically.

To edit or delete a product later, go to `/admin/products`.

## Environment variables

Copy `.env.example` to `.env.local` for local development, or set these in your hosting provider's dashboard
(e.g. Vercel → Project → Settings → Environment Variables):

| Variable | Purpose |
|---|---|
| `COMMERCE_PROVIDER` | `mock` (default), `shopify`, or `odoo` |
| `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_TOKEN` | Only needed if `COMMERCE_PROVIDER=shopify` |
| `ODOO_URL`, `ODOO_DB`, `ODOO_API_KEY` | Only needed if `COMMERCE_PROVIDER=odoo` |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Required for checkout to work |
| `ADMIN_PASSWORD` | Password that gates the `/admin` pages |
| `GITHUB_TOKEN` | A fine-grained GitHub personal access token with **Contents: Read and write** on this one repo — lets `/admin` commit product changes |
| `GITHUB_OWNER`, `GITHUB_REPO` | Your GitHub username and this repo's name |
| `CJ_EMAIL`, `CJ_API_KEY` | Optional — enables auto-forwarding paid orders to CJ Dropshipping for fulfillment |

**Never commit real secrets to the repo or paste them into a chat.** Set them directly in your hosting provider's
environment variables panel.

## Connecting a dropshipping fulfillment supplier (CJ Dropshipping)

1. Set `CJ_EMAIL` and `CJ_API_KEY` as environment variables.
2. For each product variant you want auto-fulfilled, add that variant's CJ `vid` (variant ID) as its **Supplier SKU**
   in the `/admin` form when adding or editing the product.
3. On checkout, the customer's shipping address is collected before payment. Once a payment is verified, any cart
   line whose variant has a Supplier SKU is automatically forwarded to CJ Dropshipping via `createOrderV2`.
4. Lines without a Supplier SKU are skipped and reported back — fulfill those manually until you've mapped every
   product.

This same pattern (a `supplierSku` field + a small `src/lib/*.ts` integration file) is how you'd wire up Printful,
Printify, or any other fulfillment API later — ask for help extending `src/lib/cj.ts` into a second provider when
you're ready.

## Architecture

```
src/
  app/            Pages (App Router) + API routes
  components/     UI building blocks, grouped by area
  lib/            Types, the commerce provider interface + implementations, currency formatting, admin/GitHub helpers
  services/       Thin use-case wrappers around the active commerce provider
  context/        Client-side cart state
  data/           Mock product/category/review data (also the live product database when COMMERCE_PROVIDER=mock)
```

Switching `COMMERCE_PROVIDER` to `shopify` or `odoo` later requires no UI changes — only filling in the stub methods
in `src/lib/commerce/ShopifyProvider.ts` / `OdooProvider.ts`.

## Deploying

Push to GitHub, then import the repo in Vercel. Vercel auto-detects Next.js — no extra configuration needed beyond
the environment variables above.
