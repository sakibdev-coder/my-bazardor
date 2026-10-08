# বাজার দর / BazarDor

বাজার দর বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দৈনিক বাজারদর দেখার একটি responsive web app। পণ্য, ক্যাটাগরি ও বাজারভেদে দাম দ্রুত দেখা যায়, যাতে কেনাকাটার সিদ্ধান্ত আরও সহজ হয়।

## Technologies

- Next.js 16 App Router and React 19
- TypeScript
- Tailwind CSS 4 with custom responsive CSS
- BazarDor Products API with alternative endpoint and resilient local fallback data
- Browser-based authentication flow with protected routes and toast feedback

## Features

1. বাংলা নেভিগেশন, লাইভ price ticker এবং responsive hero section
2. আজ দাম বেড়েছে / কমেছে এবং সব পণ্যের responsive product grid
3. Numeric Bengali-safe category sorting এবং skeleton loading states
4. Dynamic product detail pages with minimum, maximum, average এবং বাজারভিত্তিক দাম
5. Sign in, sign up, protected profile এবং profile information update flow
6. Friendly 404 page এবং invalid category/product handling

## API

The app reads products from the primary endpoint and falls back to the alternative when necessary:

- `https://api.api-store.workers.dev/api/bazardor`
- `https://api.abcz.workers.dev/api/bazardor`

Supported resources include `/products`, `/products?category=chal`, `/products/1`, `/categories`, and `/categories/chal`.

## Project highlights

- Mobile-first responsive navigation, ticker, hero and product grids
- Bengali numeral formatting for prices, percentages and market summaries
- Dynamic product and category routes with loading states and friendly 404 handling
- Login, registration, protected product details, profile and profile update journeys
- Live API normalization with a local fallback so the UI remains usable during outages

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.