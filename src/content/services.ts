import seedBlueprint from "./seed.json";
import type { ServiceDefinition } from "../types/service";

const seedPages = (seedBlueprint as unknown as { pages: Record<string, { label: string; seo?: { title: string; description: string } }> }).pages || {};

/**
 * Derived dynamically from src/content/seed.json service:* pages.
 * No hardcoded service data is stored here.
 */
export const services: ServiceDefinition[] = Object.entries(seedPages)
  .filter(([key]) => key.startsWith("service:"))
  .map(([key, page]) => {
    const slug = key.replace(/^service:/, "");
    const title = page.label ? page.label.replace(/^Service · /, "") : slug;
    const desc = page.seo?.description || "Tailored business service.";
    return {
      id: slug,
      slug,
      title,
      shortDescription: desc,
      description: desc,
      icon: "Sparkles",
      features: [],
      deliverables: [],
      process: [
        { step: 1, title: "Consultation", description: "Define requirements and specifications." },
        { step: 2, title: "Execution", description: "Our team implements the agreed solution." },
        { step: 3, title: "Delivery", description: "Review and deployment with ongoing support." },
      ],
      pricingNote: "Custom quote based on your specific requirements.",
      seo: {
        title: page.seo?.title || title,
        description: desc,
      },
    };
  });

export function findService(slug: string): ServiceDefinition | undefined {
  return services.find((s) => s.slug === slug);
}
