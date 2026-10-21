import { createFileRoute, notFound } from "@tanstack/react-router";
import { PublishedOr } from "../components/page-builder/published-page";
import { loadPublishedPage } from "../lib/page-builder/published-state";
import { site } from "../content/site";

export const Route = createFileRoute("/")({
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.publishedDocument?.metadata?.seo.title ?? `${site.brand.name} — ${site.brand.tagline}` },
      { name: "description", content: loaderData?.publishedDocument?.metadata?.seo.description ?? site.brand.description },
      { property: "og:title", content: loaderData?.publishedDocument?.metadata?.seo.title ?? site.brand.name },
      { property: "og:description", content: loaderData?.publishedDocument?.metadata?.seo.description ?? site.brand.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: loaderData?.publishedDocument?.metadata?.path ?? "/" }],
  }),
  loader: async () => {
    const publishedPage = await loadPublishedPage("home");
    if (publishedPage.publishedDocumentStatus === "unpublished") throw notFound();
    return publishedPage;
  },
  component: LandingPageRoute,
});

function FallbackLandingPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4 py-16 text-center text-foreground">
      <div className="max-w-md">
        <h2 className="font-display text-2xl font-bold">{site.brand.name}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{site.brand.description}</p>
      </div>
    </div>
  );
}

function LandingPageRoute() {
  const { publishedDocument, publishedDocumentStatus, siteConfigContent, globalDocument, usesSeedFallback } =
    Route.useLoaderData();
  return (
    <PublishedOr
      page="home"
      pageName="home"
      initialDocument={publishedDocument}
      status={publishedDocumentStatus}
      siteConfigContent={siteConfigContent}
      globalDocument={globalDocument}
      usesSeedFallback={usesSeedFallback}
    >
      <FallbackLandingPage />
    </PublishedOr>
  );
}
