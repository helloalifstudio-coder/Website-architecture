import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PublishedOr } from "../components/page-builder/published-page";
import { loadPublishedPage } from "../lib/page-builder/published-state";

import { PageShell } from "../components/layout/page-shell";
import { PageIntro } from "../components/layout/page-intro";
import { Reveal } from "../components/motion/primitives";
import { site } from "../content/site";
import { breadcrumbSchema } from "../lib/seo/json-ld";

const TITLE = "Why we started, and how we work";
const DESCRIPTION =
  "We exist to provide businesses with modern, scalable software, automated operations, and dedicated technical partnership.";

const PRINCIPLES = [
  {
    title: "Transparent Pricing Upfront",
    description: "Before any commitment is made, you know exactly what it will cost. No hidden fees or unexpected invoices.",
  },
  {
    title: "Dedicated Technical Oversight",
    description: "Every deployment and update is monitored by our dedicated engineering team with 99.9% uptime SLAs.",
  },
  {
    title: "Verified Realtime Sync",
    description: "Every change made in your visual studio publishes instantly to production edge networks worldwide.",
  },
  {
    title: "Zero Vendor Lock-In",
    description: "Your data, customer pipelines, and codebase remain 100% yours with open standard architectures.",
  },
  {
    title: "Enterprise Grade Security",
    description: "Built on battle-tested PostgreSQL, end-to-end type safety, and automated daily backups.",
  },
  {
    title: "Continuous Optimization",
    description: "We proactively refine speed, mobile responsiveness, and conversion performance for your business.",
  },
];

export const Route = createFileRoute("/about")({
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.publishedDocument?.metadata?.seo.title ?? `${TITLE} — ${site.brand.name}` },
      { name: "description", content: loaderData?.publishedDocument?.metadata?.seo.description ?? DESCRIPTION },
      { property: "og:title", content: loaderData?.publishedDocument?.metadata?.seo.title ?? TITLE },
      { property: "og:description", content: loaderData?.publishedDocument?.metadata?.seo.description ?? DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: loaderData?.publishedDocument?.metadata?.path ?? "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: loaderData?.publishedDocument?.metadata?.path ?? "/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "About", url: "/about" },
          ]),
        ),
      },
    ],
  }),
  loader: async () => {
    const publishedPage = await loadPublishedPage("about");
    if (publishedPage.publishedDocumentStatus === "unpublished") throw notFound();
    return publishedPage;
  },
  component: AboutPageRoute,
});

function AboutPage() {
  return (
    <PageShell pageName="about">
      <PageIntro
        eyebrow="Our story"
        title={TITLE}
        lead={DESCRIPTION}
        trail={[
          { label: "Home", href: "/" },
          { label: "How it works", href: "/about" },
        ]}
      />

      <section className="mx-auto max-w-6xl px-5 py-14">
        <Reveal>
          <div className="rounded-3xl border border-border bg-card p-8 md:p-12">
            <h2 className="font-display text-2xl font-bold md:text-3xl">The vision behind our platform</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Growing service enterprises often struggle with fragmented software: complex content management systems,
              disconnected invoicing tools, and slow websites that require a developer for the simplest text edit.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              We built this universal operating engine to unify your digital storefront, customer inquiries, and visual
              page builder into a single, high-performance platform. You get complete creative control with sub-second
              publishing.
            </p>
            <p className="mt-6 font-display text-lg font-bold text-primary">{site.brand.motto}</p>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-border bg-card py-14">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-2xl font-bold">How we work</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((principle, index) => (
              <Reveal as="li" key={principle.title} delay={index * 60}>
                <div className="h-full rounded-2xl border border-border bg-background p-6">
                  <h3 className="font-display font-bold">{principle.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{principle.description}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14 text-center">
        <Reveal>
          <h2 className="font-display text-2xl font-bold">Ready when you are</h2>
          <p className="mt-2 text-muted-foreground">
            Tell us about your business goals. We will reply with a complete architectural plan and transparent timeline.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex min-h-[48px] items-center rounded-full bg-primary px-6 font-semibold text-primary-foreground"
          >
            {site.cta.primary}
          </Link>
        </Reveal>
      </section>
    </PageShell>
  );
}

function AboutPageRoute() {
  const { publishedDocument, publishedDocumentStatus, siteConfigContent, globalDocument, usesSeedFallback } =
    Route.useLoaderData();
  return (
    <PublishedOr
      page="about"
      pageName="about"
      initialDocument={publishedDocument}
      status={publishedDocumentStatus}
      siteConfigContent={siteConfigContent}
      globalDocument={globalDocument}
      usesSeedFallback={usesSeedFallback}
    >
      <AboutPage />
    </PublishedOr>
  );
}
