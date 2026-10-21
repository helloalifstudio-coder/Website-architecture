import seedBlueprint from "./seed.json";
import type { SiteConfig } from "../types/site";

const siteData = (seedBlueprint as unknown as { site: SiteConfig }).site;

/**
 * Derived dynamically from src/content/seed.json.
 * The seed file is the single canonical source of truth for all business facts.
 */
export const site: SiteConfig = {
  brand: {
    name: siteData.brand?.name || "Business Portal",
    tagline: siteData.brand?.tagline || "",
    description: siteData.brand?.description || "",
    motto: siteData.brand?.motto || "",
  },
  contact: {
    whatsapp: siteData.contact?.whatsapp || "",
    phone: siteData.contact?.phone || "",
    email: siteData.contact?.email || "",
    location: siteData.contact?.location || "",
  },
  location: siteData.location || { city: "", region: "", country: "" },
  serviceAreas: siteData.serviceAreas || [],
  hours: siteData.hours || "",
  navigation: siteData.navigation || [],
  legalLinks: siteData.legalLinks || [],
  cta: siteData.cta || {
    primary: "Get Started",
    whatsapp: "Message on WhatsApp",
    call: "Call Us",
  },
};
