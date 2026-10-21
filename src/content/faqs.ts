import seedBlueprint from "./seed.json";
import type { FaqItem } from "../types/content";

interface FaqBlock {
  type: string;
  props?: {
    items?: Array<{ id: string; question: string; answer: string; category?: string }>;
  };
}

const faqPage = (seedBlueprint as unknown as { pages: Record<string, { blocks?: FaqBlock[] }> }).pages?.["faq"];
const faqBlock = faqPage?.blocks?.find((b) => b.type === "faq" || b.type === "accordionFaq");

/**
 * Derived dynamically from src/content/seed.json (pages.faq).
 * Consumed by legacy route fallbacks and JSON-LD schema generators.
 */
export const faqs: FaqItem[] = (faqBlock?.props?.items ?? []).map((it) => ({
  id: it.id,
  category: (it.category as FaqItem["category"]) || "process",
  question: it.question,
  answer: it.answer,
}));
