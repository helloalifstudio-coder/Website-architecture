# website-editor Roadmap

## Core Capabilities Delivered (v1.0.0)

- [x] Universal service-business architecture supporting any service niche (agencies, legal, medical, trades, consulting).
- [x] Single-file business "DNA" engine (`src/content/seed.json`) governing branding, contact info, and initial routes.
- [x] Puck visual editor with 12 universal blocks (Hero, Features, Process, Services, Pricing, Testimonials, FAQ, Lead Form, CTA, Stats, Logos, Content).
- [x] Shared component registry ensuring 1:1 pixel-perfect parity between builder canvas and public live site.
- [x] Runtime Zod schema enforcement with strict block validation, array bounding, and URL protocol allow-lists.
- [x] Supabase PostgreSQL database architecture with Row Level Security (RLS) protecting drafts and revisions.
- [x] Atomic publishing RPC (`publish_page_document`) with expected-version conflict prevention.
- [x] Dynamic CSS variable generator injecting hex/hsl theme tokens at runtime.
- [x] 1-Click consolidated migration script (`supabase/setup-all.sql`) for online zero-clone onboarding.
- [x] 100% online zero-clone deployment workflow via GitHub Web Editor, Supabase Dashboard, and Vercel.
- [x] Dual-deployment option: Full Studio (Nitro SSR) and Public Standalone Edge Shell (`apps/public`).
- [x] High-coverage automated test suite running via Bun (`bun test`).

---

## Production Launch Validation Checklist

- [ ] Run `supabase/setup-all.sql` in target Supabase project's SQL Editor.
- [ ] Verify Supabase Realtime is enabled for `cms_sections` and `cms_site_config`.
- [ ] Confirm automatic owner assignment or manually grant `{"cms_role": "owner"}` in `raw_app_meta_data`.
- [ ] Verify anonymous visitors can only view published documents via `get_published_page_document`.
- [ ] Perform visual draft edit, live save, and atomic publish in the Puck editor.
- [ ] Confirm instant live sync on the public URL within 500ms.
- [ ] Verify passing CI build status on Vercel.

---

## Future Increments (v1.1+)

- [ ] Visual revision history browser with one-click restore in the Studio.
- [ ] Direct media asset upload manager directly integrated with Supabase Storage buckets.
- [ ] Granular role permissions (Reviewer vs. Editor vs. Admin).
- [ ] Native multi-language / i18n support driven by locale-keyed seed JSON.
- [ ] Built-in A/B testing block variant switcher.
- [ ] Webhook triggers on publication (instant CDN cache purge / Edge invalidation).
