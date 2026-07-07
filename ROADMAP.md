# ReduceCO2Now — Product Roadmap

> Privacy-first, offline-capable CO2 and nutrition tracking.  
> Stack: Next.js 16 · React 19 · TypeScript · Tailwind CSS 4

---

## Vision

Help people understand the climate impact of their food choices without sacrificing privacy. Data stays on-device by default; cloud and AI features are opt-in and transparent.

---

## Architecture Overview

```
src/
├── app/              # Next.js App Router (pages, layouts, API routes)
├── components/       # UI — dashboard widgets, logging forms, charts
├── hooks/            # Client state, localStorage / IndexedDB sync
├── lib/              # CO₂ models, nutrition math, privacy utilities
└── types/            # Shared TypeScript contracts
```

**Principles**
- Offline-first: core logging and dashboard work without network
- Privacy by default: no account required for MVP; minimal telemetry
- Separation of concerns: UI in `components/`, domain logic in `lib/`

---

## Phase 1 — MVP Dashboard & Fast Logging Utility

**Goal:** Ship a usable daily tracker in ~4–6 weeks.

### Deliverables

| Area | Features |
|------|----------|
| **Dashboard** | Daily CO₂ total, weekly trend, nutrition summary (calories, protein) |
| **Fast logging** | Quick-add meals/snacks; recent foods; portion presets |
| **Local persistence** | `localStorage` or IndexedDB via custom hooks; export JSON |
| **CO₂ estimation** | Rule-based model from food category + weight (Poore & Nemecek baseline dataset) |
| **UX** | Mobile-first layout, dark mode, <3 taps to log a common item |

### Technical milestones

- [ ] Define core types (`Food`, `MealLog`, `Co2Impact`, `UserProfile`)
- [ ] Implement `estimateCo2()` in `src/lib/co2/`
- [ ] Build `useMealLogs()` + `useLocalStorage()` hooks
- [ ] Dashboard widgets: `DailyCo2Card`, `WeeklyTrendChart`, `NutritionSummary`
- [ ] Logging flow: `QuickLogForm`, `FoodSearch` (static seed list)
- [ ] Replace default `app/page.tsx` with dashboard shell
- [ ] PWA basics: manifest + service worker stub (optional stretch)

### Success criteria

- User can log 3 meals offline and see updated CO₂ on dashboard
- No network calls required for core loop
- Lighthouse performance ≥ 90 on mobile

### Out of scope (Phase 1)

- User accounts, sync, third-party food APIs
- AI meal recognition
- GDPR export/delete flows (Phase 2)

---

## Phase 2 — Data Integration & Privacy / Compliance Hub

**Goal:** Connect external data sources while keeping users in control (~6–8 weeks).

### Deliverables

| Area | Features |
|------|----------|
| **Food database** | Integrate open datasets (e.g. Open Food Facts) with offline cache |
| **Import / export** | CSV, JSON; full data portability |
| **Privacy hub** | Settings page: data retention, analytics toggle, consent log |
| **Compliance** | GDPR-oriented flows: access, rectification, erasure, portability |
| **Optional sync** | End-to-end encrypted backup (user-held keys) |
| **Barcode scan** | Camera lookup against cached product DB |

### Technical milestones

- [ ] IndexedDB layer with versioned schema migrations
- [ ] API routes or edge functions for proxying external food APIs (no PII)
- [ ] `PrivacySettings` + `DataExportPanel` components
- [ ] Audit trail for consent changes (local-only)
- [ ] Background sync when online (opt-in)

### Success criteria

- User can export all data in machine-readable format in one click
- Clear documentation of what leaves the device
- Barcode lookup works offline for previously cached products

---

## Phase 3 — Advanced Sustainability Insights & AI Features

**Goal:** Actionable insights and intelligent assistance (~8–12 weeks).

### Deliverables

| Area | Features |
|------|----------|
| **Insights** | Weekly reports, category breakdowns, "swap suggestions" (lower-CO₂ alternatives) |
| **Goals** | Personal CO₂ budgets, streaks, progress vs. national averages |
| **AI (opt-in)** | Meal photo → food estimate; natural-language logging |
| **Context** | Seasonality, local vs. imported, organic flags where data exists |
| **Sharing** | Anonymous aggregate stats (explicit opt-in only) |

### Technical milestones

- [ ] Insight engine in `src/lib/insights/`
- [ ] On-device or API-backed vision model (privacy-reviewed)
- [ ] Prompt templates with no PII leakage; local redaction layer
- [ ] A/B-friendly feature flags for AI rollout
- [ ] Advanced charts: category treemap, time-series comparisons

### Success criteria

- Swap suggestions reduce modeled weekly CO₂ for test cohort
- AI features clearly labeled, disableable, and documented
- All Phase 2 privacy guarantees preserved

---

## Suggested folder map (by phase)

| Phase | Primary locations |
|-------|-------------------|
| 1 | `components/dashboard`, `components/logging`, `lib/co2`, `hooks/` |
| 2 | `lib/db`, `lib/import-export`, `components/privacy`, `app/settings` |
| 3 | `lib/insights`, `lib/ai`, `components/charts` (advanced) |

---

## Team kick-off checklist (Wednesday)

1. **Align on Phase 1 scope** — agree on MVP food list size and CO₂ data source
2. **Assign ownership** — UI (`components/`), domain (`lib/`), types (`types/`), persistence (`hooks/`)
3. **Decide storage** — `localStorage` for MVP vs. IndexedDB from day one
4. **Move `app/` → `src/app/`** (recommended) and set `"@/*": ["./src/*"]` in `tsconfig.json`
5. **Branch strategy** — `main` + `develop` + feature branches per milestone
6. **Definition of done** — offline test, TypeScript strict, no `any` in `lib/`

---

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| CO₂ data accuracy disputes | Cite sources; show ranges; allow manual override |
| Scope creep into sync/accounts | Hard Phase 1 boundary in this doc |
| AI privacy concerns | Opt-in only; on-device where possible; Phase 3 gate |
| Offline complexity | Start simple (`localStorage`); migrate schema in Phase 2 |

---

## References

- [Poore & Nemecek (2018)](https://science.org/doi/10.1126/science.aaq0216) — food LCA meta-analysis
- [Open Food Facts](https://world.openfoodfacts.org/) — product data (Phase 2)
- [Next.js 16 docs](https://nextjs.org/docs) — see also `node_modules/next/dist/docs/` (project-specific APIs)

---

*Last updated: July 2026 · ReduceCO2Now prototype*
