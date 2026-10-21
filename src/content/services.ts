/**
 * Service catalogue derived dynamically from the seed's `service:*` pages.
 */
import { services as blueprintServices, type ServiceSummary } from "../lib/site/blueprint";

export { type ServiceSummary };

export interface ServiceDefinition {
  id: string;
  slug: string;
  path: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  features: string[];
  deliverables: string[];
  process: Array<{ step: number; title: string; description: string }>;
  pricingNote: string;
  seo: {
    title: string;
    description: string;
  };
}

export const services: ServiceDefinition[] = blueprintServices.map((s) => ({
  id: s.id,
  slug: s.slug,
  path: s.path || `/services/${s.slug}`,
  title: s.title,
  shortDescription: s.shortDescription,
  description: s.description,
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
    title: s.title,
    description: s.shortDescription,
  },
}));

export function findService(slug: string): ServiceDefinition | undefined {
  return services.find((s) => s.slug === slug);
}
