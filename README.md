# GrowthPilot AI

AI-powered revenue audits for Shopify and Klaviyo store owners. This is the
V1 project scaffold: architecture, pages, and reusable components with
mock data. No audit logic or API integrations yet.

## Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- lucide-react icons

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```
src/
  pages/         Route-level pages (Landing, Audit, Results, About)
  components/
    layout/      Navbar, Footer
    landing/     Hero, FeatureCards
    audit/       InputMethodTabs, AuditForm, ProgressIndicator, CsvUploadPanel, ConnectPanel
    results/     ScoreCard, RecommendationCard
    ui/          Shared primitives (Button, Container)
  data/          Static/mock data (audit questions, mock results)
```

## Input methods (Audit page)

1. **Manual Audit** — fully functional multi-step form (local state only)
2. **CSV Upload** — placeholder UI, no parsing yet
3. **Connect Shopify/Klaviyo** — "Coming Soon" panel

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run lint` — run Oxlint
- `npm run preview` — preview the production build
