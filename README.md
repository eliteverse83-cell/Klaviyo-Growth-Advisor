# GrowthPilot AI

AI-powered revenue audits for Shopify and Klaviyo store owners. A manual
audit is scored with a rule-based engine, then Claude generates a
personalized, consultant-voiced narrative on top of it.

## Stack

- React 19 + Vite (frontend)
- Tailwind CSS v4
- React Router v7
- Express + `@anthropic-ai/sdk` (backend, for AI recommendations)
- lucide-react icons

## Getting started

```bash
npm install
cp .env.example .env   # then set ANTHROPIC_API_KEY
npm run dev            # runs the Vite dev server + Express API together
```

Without `ANTHROPIC_API_KEY` set, the app still works — the Results page
falls back to a clear "AI recommendations are unavailable" message and the
rule-based score/report render normally.

## Project structure

```
server/
  index.js                    Express app, POST /api/ai-recommendations
  services/consultantReport.js  Prompt + Zod schema + Claude call

src/
  pages/         Route-level pages (Landing, Audit, Results, About)
  components/
    layout/      Navbar, Footer
    landing/     Hero, FeatureCards
    audit/       InputMethodTabs, AuditForm, ProgressIndicator, CsvUploadPanel, ConnectPanel
    results/     ScoreCard, RecommendationCard, SectionHeading, HealthRatingPanel,
                 StrengthWeaknessList, MissedOpportunitiesPanel, RevenueOpportunityPanel,
                 NextStepsTimeline, AIConsultantSection
    ui/          Shared primitives (Button, Container)
  data/          Audit question schema + sample audit response (Results fallback demo)
  utils/
    scoringEngine.js   Pure 0-100 category scoring + Excellent/Strong/Needs
                        Improvement/Critical Opportunities classification
    auditReport.js     Deterministic strengths/weaknesses/recommended flows/
                        priority tasks/revenue estimate/next steps, built on
                        top of scoringEngine.js
  services/
    aiRecommendations.js   Client for the backend's AI recommendations endpoint
```

## Input methods (Audit page)

1. **Manual Audit** — fully functional multi-step form, scored on submit
2. **CSV Upload** — placeholder UI, no parsing yet
3. **Connect Shopify/Klaviyo** — "Coming Soon" panel

## How scoring + AI recommendations fit together

1. `AuditForm` collects answers and navigates to `/results` with the raw form data.
2. `ResultsPage` runs `generateAuditReport()` (client-side, instant) for the
   score, health rating, and every deterministic section.
3. In parallel, it calls the backend, which **recomputes the score
   server-side** (never trusts client-submitted numbers) and asks Claude for
   a personalized executive summary + 4-6 recommendations grounded in that
   client's actual answers — shown in the "AI Consultant Take" section.

## Scripts

- `npm run dev` — Vite + Express together (recommended)
- `npm run dev:client` — Vite only
- `npm run dev:server` — Express only
- `npm run build` — production build (frontend only — deploy `server/` separately)
- `npm run lint` — run Oxlint
- `npm run preview` — preview the production build
