/**
 * Business facts for the public website, derived from `seed.json`.
 * Every field is derived dynamically via the business blueprint helper.
 */
import { blueprint } from "../lib/site/blueprint";
import type { SiteConfig } from "../types/site";

export const site: SiteConfig = {
  brand: {
    name: blueprint.brand.name,
    tagline: blueprint.brand.tagline,
    description: blueprint.brand.description,
    motto: blueprint.brand.motto,
  },
  contact: { ...blueprint.contact },
  location: { ...blueprint.location },
  serviceAreas: [...blueprint.serviceAreas],
  hours: blueprint.hours,
  navigation: [...blueprint.navigation],
  legalLinks: [...blueprint.legalLinks],
  cta: { ...blueprint.cta },
};
