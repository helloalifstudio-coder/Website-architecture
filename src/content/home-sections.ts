/**
 * Website CMS: structured sections for legacy page components.
 * Derived dynamically from src/content/seed.json.
 */
import seedBlueprint from "./seed.json";

export type FieldType = "text" | "textarea" | "tags" | "list";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  itemFields?: FieldDef[];
  itemLabel?: string;
}

export interface SectionDef {
  key: string;
  label: string;
  description: string;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
}

export type SectionContent = Record<string, unknown>;

interface SeedSiteBrand {
  name?: string;
  tagline?: string;
  description?: string;
  motto?: string;
  logoUrl?: string;
}
interface SeedSiteData {
  brand?: SeedSiteBrand;
}
const siteData = (seedBlueprint as unknown as { site?: SeedSiteData }).site || {};

export const SECTION_DEFS: SectionDef[] = [
  {
    key: "hero",
    label: "Hero banner",
    description: "The primary headline, proof points and primary action.",
    fields: [
      { key: "eyebrow", label: "Small line above the headline", type: "text" },
      { key: "title", label: "Headline", type: "text" },
      { key: "subtitle", label: "Supporting paragraph", type: "textarea" },
      { key: "primaryCtaLabel", label: "Main button label", type: "text" },
      { key: "primaryCtaHref", label: "Main button link", type: "text" },
      { key: "secondaryCtaLabel", label: "Secondary button label", type: "text" },
      { key: "secondaryCtaHref", label: "Secondary button link", type: "text" },
      { key: "imageUrl", label: "Hero image URL", type: "text" },
      { key: "imageAlt", label: "Hero image description", type: "text" },
      { key: "highlights", label: "Quick highlights", type: "tags" },
    ],
    defaults: {
      eyebrow: "WORLD-CLASS SOLUTIONS",
      title: siteData.brand?.tagline || "Custom Software & Operating Systems",
      subtitle: siteData.brand?.description || "High-performance software and cloud systems for growing service businesses.",
      primaryCtaLabel: "Get Started",
      primaryCtaHref: "/contact",
      secondaryCtaLabel: "Our Services",
      secondaryCtaHref: "/services",
      imageUrl: "",
      imageAlt: "Platform visual",
      highlights: ["Fast Setup", "Enterprise Security", "Realtime Updates"],
    },
  },
  {
    key: "footer",
    label: "Footer",
    description: "Closing band, quick links and portal entry.",
    fields: [
      { key: "tagline", label: "Tagline", type: "textarea" },
      { key: "legal", label: "Legal line", type: "text" },
    ],
    defaults: {
      tagline: siteData.brand?.tagline || "Custom Business Software, Visual CMS & Operating Solutions",
      legal: `© ${siteData.brand?.name || "Business Portal"}. All rights reserved.`,
    },
  },
];

export const SECTION_MAP = new Map(SECTION_DEFS.map((def) => [def.key, def]));

export function defaultContent(key: string): SectionContent {
  return structuredClone(SECTION_MAP.get(key)?.defaults ?? {}) as SectionContent;
}

export function defaultSections(): Record<string, SectionContent> {
  return Object.fromEntries(SECTION_DEFS.map((def) => [def.key, defaultContent(def.key)]));
}

/** Built-in home page content. Pages published from the builder replace it. */
export async function loadHomeSections(): Promise<Record<string, SectionContent>> {
  return defaultSections();
}
