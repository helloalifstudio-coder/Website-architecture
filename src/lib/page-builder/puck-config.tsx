/**
 * Universal Puck registry for the Website Studio.
 *
 * Every block type from the document model becomes a Puck component. Fields
 * are inferred from each block's starting props, so adding a block to the
 * model makes it draggable and editable here with no extra form code.
 * Rendering reuses the same RenderBlock the public site uses.
 */
import type React from "react";
import type { ComponentConfig, Config, Data, Field, Fields } from "@puckeditor/core";

import { RenderBlock } from "../../components/page-builder/block-renderer";
import {
  BLOCK_LIBRARY,
  createBlock,
  defaultLayout,
  uid,
  type Block,
  type BlockLayout,
  type BlockType,
  type PageDocument,
} from "./model";

const ENUMS: Record<string, string[]> = {
  imageSide: ["left", "right"],
  level: ["h1", "h2", "h3"],
  style: ["solid", "outline", "text"],
  size: ["sm", "md", "lg"],
  variant: [
    "default",
    "compact",
    "split",
    "cards",
    "horizontal",
    "vertical",
    "grid",
    "carousel",
    "minimal",
    "centered",
    "single",
    "two-column",
    "card",
    "inline",
  ],
  theme: ["card", "primary", "outline", "dark", "muted", "accent"],
};

const LABELS: Record<string, string> = {
  href: "Link (/page, whatsapp, phone, email or https://…)",
  imageAlt: "Picture description",
  src: "Media file URL or site path",
  image: "Picture",
  poster: "Video poster image",
  ctaText: "Button Text",
  ctaHref: "Button Link",
  primaryCta: "Primary Button",
  secondaryCta: "Secondary Button",
  cta: "Call to Action",
  stats: "Metrics / Highlights",
  features: "Features / Benefits",
  services: "Services",
  tiers: "Pricing Tiers",
  testimonials: "Client Reviews",
  steps: "Process Steps",
  logos: "Client / Partner Logos",
  items: "Items",
  faqs: "Frequently Asked Questions",
  billingNote: "Billing Guarantee / Note",
  eyebrow: "Eyebrow Badge",
  subtitle: "Subtitle / Supporting Text",
};

const human = (key: string) =>
  LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

function inferField(key: string, value: unknown): Field | null {
  if (key === "id") return null;
  if (key === "columns") {
    return { type: "select", label: "Columns", options: [1, 2, 3, 4].map((n) => ({ label: String(n), value: n })) };
  }
  if (ENUMS[key]) {
    return { type: "select", label: human(key), options: ENUMS[key].map((v) => ({ label: v, value: v })) };
  }
  if (typeof value === "number") return { type: "number", label: human(key), min: 0 };
  if (typeof value === "boolean") {
    return { type: "radio", label: human(key), options: [{ label: "Yes", value: true }, { label: "No", value: false }] };
  }
  if (typeof value === "string") {
    return value.length > 60 || key === "text" || key === "answer" || key === "quote" || key === "summary" || key === "description"
      ? { type: "textarea", label: human(key) }
      : { type: "text", label: human(key) };
  }
  if (Array.isArray(value)) {
    const sample = (value[0] ?? {}) as unknown;
    if (typeof sample === "string") {
      return {
        type: "array",
        label: human(key),
        arrayFields: { item: { type: "text", label: "Value" } },
        defaultItemProps: { item: "" },
        getItemSummary: (it: Record<string, unknown>, i?: number) => String(it["item"] || `Item ${(i ?? 0) + 1}`),
      } as Field;
    }
    const sampleObj = (sample ?? {}) as Record<string, unknown>;
    const arrayFields: Fields = {};
    for (const [k, v] of Object.entries(sampleObj)) {
      const f = inferField(k, v);
      if (f) arrayFields[k] = f;
    }
    if (key === "items" && !("image" in sampleObj) && !("question" in sampleObj)) {
      arrayFields["image"] = { type: "text", label: "Picture" };
    }
    const titleKey = ["title", "label", "question", "name", "author", "value"].find((k) => k in sampleObj);
    return {
      type: "array",
      label: human(key),
      arrayFields,
      defaultItemProps: Object.fromEntries(Object.keys(arrayFields).map((k) => [k, typeof sampleObj[k] === "number" ? 0 : ""])),
      getItemSummary: (item: Record<string, unknown>, i?: number) =>
        String((titleKey && item[titleKey]) || `Item ${(i ?? 0) + 1}`),
    } as Field;
  }
  if (typeof value === "object" && value !== null) {
    const objectFields: Fields = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const f = inferField(k, v);
      if (f) objectFields[k] = f;
    }
    if (Object.keys(objectFields).length > 0) {
      return {
        type: "object",
        label: human(key),
        objectFields,
      } as Field;
    }
  }
  return null;
}

const layoutField: Field = {
  type: "object",
  label: "Layout",
  objectFields: {
    align: { type: "select", label: "Align", options: ["left", "center", "right"].map((v) => ({ label: v, value: v })) },
    width: { type: "select", label: "Width", options: ["narrow", "normal", "full"].map((v) => ({ label: v, value: v })) },
    background: {
      type: "select",
      label: "Background",
      options: ["none", "muted", "card", "primary", "accent"].map((v) => ({ label: v, value: v })),
    },
    spaceTop: { type: "number", label: "Space above (0–6)", min: 0, max: 6 },
    spaceBottom: { type: "number", label: "Space below (0–6)", min: 0, max: 6 },
    hideMobile: { type: "radio", label: "Hide on phones", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
    hideDesktop: { type: "radio", label: "Hide on computers", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
  },
};

type PuckProps = Record<string, unknown> & {
  id: string;
  layout?: BlockLayout;
  anchor?: string;
  hidden?: boolean;
};

/** Puck props → document block. */
export function propsToBlock(type: BlockType, raw: Record<string, unknown>): Block {
  const { id, layout, anchor, hidden, puck: _puck, editMode: _e, ...props } = raw as PuckProps & {
    puck?: unknown;
    editMode?: unknown;
  };
  const normalize = (v: unknown): unknown => {
    if (Array.isArray(v)) {
      return v.map((it) => {
        if (it && typeof it === "object") {
          if ("item" in it && Object.keys(it).length === 1 && typeof (it as { item: unknown }).item === "string") {
            return (it as { item: string }).item;
          }
          if (!("id" in it)) {
            return { id: uid(), ...it };
          }
        }
        return it;
      });
    }
    return v;
  };
  const withIds = Object.fromEntries(Object.entries(props).map(([k, v]) => [k, normalize(v)]));
  return {
    id: String(id ?? uid()),
    type,
    props: withIds,
    layout: { ...defaultLayout(), ...(layout ?? {}) },
    ...(typeof hidden === "boolean" ? { hidden } : {}),
    ...(anchor ? { anchor: String(anchor) } : {}),
  } as Block;
}

function componentFor(type: BlockType, label: string): ComponentConfig<PuckProps> {
  const sample = createBlock(type);
  const fields: Fields = {};
  for (const [k, v] of Object.entries(sample.props)) {
    const f = inferField(k, v);
    if (f) fields[k] = f;
  }
  fields["anchor"] = { type: "text", label: "Section link name (optional)" };
  fields["hidden"] = {
    type: "radio",
    label: "Hide from public website",
    options: [{ label: "Visible", value: false }, { label: "Hidden", value: true }],
  };
  fields["layout"] = layoutField;
  return {
    label,
    fields: fields as NonNullable<ComponentConfig<PuckProps>["fields"]>,
    defaultProps: { ...(sample.props as Record<string, unknown>), hidden: false, layout: sample.layout } as PuckProps,
    render: (props) => <RenderBlock block={propsToBlock(type, props as Record<string, unknown>)} />,
  };
}

const LIBRARY = [...BLOCK_LIBRARY, { type: "navigation" as BlockType, label: "Header menu", description: "" }];

export const universalPuckConfig: Config = {
  components: Object.fromEntries(LIBRARY.map((b) => [b.type, componentFor(b.type, b.label)])),
  categories: {
    universal: {
      title: "Universal Blocks",
      components: [
        "hero",
        "featureGrid",
        "processFlow",
        "serviceCatalog",
        "pricingTable",
        "testimonials",
        "statsBanner",
        "accordionFaq",
        "leadCapture",
        "contentSection",
        "ctaBanner",
        "logoCloud",
      ],
    },
    content: {
      title: "Content & Typography",
      components: ["heading", "text", "image", "imageText", "cards", "faq", "video", "buttons"],
    },
    story: {
      title: "Story & Showcase",
      components: [
        "cinematicHero",
        "serviceFilm",
        "careJourney",
        "serviceStory",
        "trustDossier",
        "proofReturn",
        "storyCarousel",
        "invoiceExample",
      ],
    },
    action: {
      title: "Forms & Contacts",
      components: ["contactStrip", "enquiryForm"],
    },
    layout: {
      title: "Layout",
      components: ["spacer", "divider", "navigation"],
    },
  },
  root: { render: ({ children }: { children?: React.ReactNode }) => <div className="@container bg-background text-foreground">{children}</div> },
} as Config;

/** Backward-compatibility alias */
export const safarPuckConfig = universalPuckConfig;

export function documentToPuck(doc: PageDocument): Data {
  return {
    root: { props: {} },
    content: doc.blocks.map((b) => ({
      type: b.type,
      props: {
        ...(b.props as Record<string, unknown>),
        id: b.id,
        layout: b.layout,
        hidden: b.hidden ?? false,
        ...(b.anchor ? { anchor: b.anchor } : {}),
      },
    })),
  } as Data;
}

export function puckToDocument(
  page: string,
  data: Data,
  metadata?: PageDocument["metadata"],
): PageDocument {
  return {
    page,
    ...(metadata ? { metadata } : {}),
    blocks: data.content.map((c) => propsToBlock(c.type as BlockType, c.props as Record<string, unknown>)),
  };
}
