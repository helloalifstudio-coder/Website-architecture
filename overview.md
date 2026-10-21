# website-editor — Universal Service-Business Website Engine & Visual Studio

## 1. High-Level Summary
**website-editor** is our flagship, universal open-source web application designed specifically for service-based businesses (agencies, consultancies, healthcare, legal, professional services, home services, logistics). It combines two enterprise-grade capabilities into a unified, modular repository:

1. **Public Website Engine:** A high-speed, edge-rendered marketing website built on React 19 and TanStack Start, featuring 100/100 Lighthouse performance, uncrashable error boundaries, and dynamic CSS theme token injection.
2. **Visual CMS (Studio):** An authenticated, drag-and-drop page builder powered by **Puck** (`@puckeditor/core`), allowing non-technical business owners to edit text, imagery, pricing, and layout live with atomic database persistence.

---

## 2. The Problem We Are Solving

Service-based businesses have historically been trapped between three imperfect paradigms:

1. **Rigid Static Websites:**
   - Hand-coded React/Next.js sites deliver great speed and design, but require developer time for every headline edit, testimonial update, or price change.
   - Non-technical business owners cannot modify their own sites without risking syntax errors or opening GitHub PRs.

2. **Bloated Proprietary Builders (WordPress, Webflow, Wix):**
   - High monthly subscription fees, heavy asset bundles, slow page load times, and vendor lock-in.
   - Security vulnerabilities, fragile plugin ecosystems, and difficulty keeping content under developer version control.

3. **Disconnected Headless CMSs (Sanity, Contentful, Strapi):**
   - Disconnected dashboards that lack visual, in-context live previews.
   - Fragile schema mismatches where updating a field in the CMS crashes frontend components.
   - Expensive per-seat and bandwidth pricing tiers that scale unfavorably.

### The website-editor Solution:
- **Single-File "DNA" Brain (`seed.json`):** The complete service business identity—brand colors, typography, company metadata, navigation links, and default page layouts—is governed by a single schema.
- **Shared Block Registry:** The visual editor and the public site share the exact same 12 universal block components (Hero, Feature Grid, Process Flow, Service Catalog, Pricing Table, Testimonials, FAQ Accordion, Lead Capture, CTA Banner, Stats, Logo Cloud, Content Section).
- **Sub-Second Live Sync:** Backed by Supabase PostgreSQL and Realtime, changes made in the studio update the database atomically and stream to active visitors in milliseconds.
- **100% Zero-Clone Online Workflow:** An entire client website can be provisioned in under 5 minutes without ever running a local terminal command or installing Git.

---

## 3. Architecture & Core Principles

- **Modular Monolith:** A single repository containing both the public site engine and the visual studio, deployable as unified SSR on Vercel or as split edge projects.
- **Strict Data Contracts:** All page documents are validated at runtime via **Zod** (`src/lib/page-builder/schema.ts`). Content cannot inject arbitrary JavaScript, unverified styles, or broken external links.
- **Atomic Publishing & Conflict Detection:** Publishing utilizes PostgreSQL stored procedures with expected-version checks. If two editors collaborate simultaneously, stale overwrites are prevented.
- **PostgreSQL Row Level Security (RLS):** Security is enforced at the database level. Public anonymous visitors can only execute read RPCs for published documents; drafts and revisions are strictly restricted to authenticated users with `owner` or `editor` claims.

---

## 4. Tech Stack

- **Framework:** React 19 + TanStack Start (SSR) + TanStack Router
- **Visual Editing:** Puck (`@puckeditor/core`)
- **Styling:** Tailwind CSS (v4) + Radix UI Primitives + Dynamic CSS Variables
- **Validation:** Zod (Runtime document & block validation)
- **Database & Auth:** Supabase (PostgreSQL, Realtime, Row Level Security, Supabase Auth)
- **Build & Tooling:** Vite, Bun, TypeScript 5.8 (Strict Mode)
- **Deployment:** Vercel (Edge Functions / Serverless Node 24)

---

## 5. Repository Structure

```text
website-editor/
├── apps/
│   └── public/               # Lightweight public-facing site entry point & shell
├── docs/                     # Engineering documentation suite
│   ├── adr/                  # Architecture Decision Records
│   ├── architecture.md       # Runtime responsibilities and data flow
│   ├── database.md           # Supabase tables, RLS policies, and RPCs
│   ├── deployment.md         # Vercel dual-deployment and production runbooks
│   ├── integrations.md       # Supabase and webhook boundary documentation
│   ├── operations.md         # Publishing workflows and maintenance checklists
│   ├── security.md           # Threat model, token validation, and sanitization
│   └── troubleshooting.md    # Common errors and self-healing resolutions
├── src/
│   ├── components/           # 12 Universal Blocks & UI primitives
│   ├── content/
│   │   └── seed.json         # Master business "DNA" blueprint
│   ├── lib/
│   │   ├── page-builder/     # Puck registry, Zod schemas, and model defaults
│   │   └── site/             # Seed parser, CSS token generator, and safe defaults
│   └── routes/               # TanStack Router file routes (public & _authenticated)
├── supabase/
│   ├── setup-all.sql         # 1-Click consolidated migration script for Supabase
│   └── migrations/           # Tracked individual migration files
├── tests/                    # Bun test suite (Schemas, RLS, Webhooks, Seeds)
├── package.json              # Monorepo configuration (website-editor)
└── README.md                 # Master documentation and 100% online zero-clone guide
```
