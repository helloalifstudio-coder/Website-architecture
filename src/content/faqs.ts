/**
 * Questions derived from the seed's FAQ page via the business blueprint.
 */
import { faqs as blueprintFaqs, type FaqSummary } from "../lib/site/blueprint";
import type { FaqItem } from "../types/content";

export { type FaqSummary };

export const faqs: FaqItem[] = blueprintFaqs.map((f) => ({
  id: f.id,
  category: "process",
  question: f.question,
  answer: f.answer,
}));
