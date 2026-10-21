/**
 * Visual page builder — document model.
 *
 * Every public page is an ordered list of structured blocks. Blocks carry typed props
 * and a shared layout object. Content is strictly decoupled from presentation: no raw
 * HTML/CSS/JS is stored, guaranteeing type safety, XSS protection and crash-proof rendering.
 */
import seedBlueprint from "../../content/seed.json";
import type { StorySlide } from "../../components/site/story-carousel";
import type { InvoiceExampleRow } from "../../components/site/invoice-example";

export interface ButtonItem {
  id: string;
  label: string;
  /** "/page", "#section", "whatsapp", "phone", "email" or "https://…" */
  href: string;
  style: "solid" | "outline" | "text";
  size: "sm" | "md" | "lg";
}

export interface CardItem {
  id: string;
  title: string;
  text: string;
  image?: string;
  href?: string;
}

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

export interface LinkItem {
  id: string;
  label: string;
  href: string;
}

export type Background = "none" | "muted" | "card" | "primary" | "accent";

export interface BlockLayout {
  align: "left" | "center" | "right";
  width: "narrow" | "normal" | "full";
  spaceTop: number; // 0-6
  spaceBottom: number; // 0-6
  background: Background;
  hideMobile: boolean;
  hideDesktop: boolean;
}

interface BaseBlock<T extends string, P> {
  id: string;
  type: T;
  props: P;
  layout: BlockLayout;
  hidden?: boolean;
  locked?: boolean;
  anchor?: string;
}

/* ============================================================================
   UNIVERSAL 12-BLOCK CATALOG INTERFACES
   ============================================================================ */

export interface HeroBlockProps {
  eyebrow?: string;
  title: string;
  accent?: string;
  text: string;
  buttons: ButtonItem[];
  image?: string;
  imageAlt?: string;
  imageSide?: "left" | "right";
  variant?: "split" | "center" | "minimal";
  badge?: string;
}

export interface FeatureItem {
  id: string;
  icon?: string;
  title: string;
  description: string;
  badge?: string;
  href?: string;
}

export interface FeatureGridBlockProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  columns: 2 | 3 | 4;
  items: FeatureItem[];
}

export interface ProcessStep {
  id: string;
  step: number;
  title: string;
  description: string;
  icon?: string;
}

export interface ProcessFlowBlockProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  steps: ProcessStep[];
}

export interface CatalogServiceItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  price?: string;
  duration?: string;
  features: string[];
  href: string;
  badge?: string;
}

export interface ServiceCatalogBlockProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  categories: string[];
  services: CatalogServiceItem[];
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  badge?: string;
  description: string;
  highlighted: boolean;
  features: string[];
  cta: {
    label: string;
    href: string;
  };
}

export interface PricingTableBlockProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  billingNote?: string;
  tiers: PricingTier[];
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;
}

export interface TestimonialsBlockProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  layout: "grid" | "carousel";
  items: TestimonialItem[];
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  description?: string;
}

export interface StatsBannerBlockProps {
  eyebrow?: string;
  title?: string;
  stats: StatItem[];
}

export interface AccordionFaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface AccordionFaqBlockProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  items: AccordionFaqItem[];
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select";
  required: boolean;
  placeholder?: string;
}

export interface LeadCaptureBlockProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  fields: FormField[];
  submitLabel: string;
  dispatchTarget: "whatsapp" | "email" | "api";
  successMessage?: string;
}

export interface ContentSectionBlockProps {
  eyebrow?: string;
  title: string;
  text: string;
  layout: "mediaLeft" | "mediaRight" | "centered" | "prose";
  mediaType: "image" | "video";
  mediaUrl?: string;
  mediaAlt?: string;
  buttons: ButtonItem[];
}

export interface CtaBannerBlockProps {
  eyebrow?: string;
  title: string;
  text: string;
  background: "primary" | "accent" | "card" | "muted";
  buttons: ButtonItem[];
}

export interface LogoItem {
  id: string;
  name: string;
  logoUrl: string;
  href?: string;
}

export interface LogoCloudBlockProps {
  eyebrow?: string;
  title?: string;
  logos: LogoItem[];
}

/* ============================================================================
   BLOCK UNION
   ============================================================================ */

export type UniversalBlockType =
  | "hero"
  | "featureGrid"
  | "processFlow"
  | "serviceCatalog"
  | "pricingTable"
  | "testimonials"
  | "statsBanner"
  | "accordionFaq"
  | "leadCapture"
  | "contentSection"
  | "ctaBanner"
  | "logoCloud";

export type PrimitiveBlockType =
  | "heading"
  | "text"
  | "image"
  | "buttons"
  | "imageText"
  | "cards"
  | "faq"
  | "contactStrip"
  | "enquiryForm"
  | "video"
  | "spacer"
  | "divider"
  | "navigation";

export type LegacyBlockType =
  | "cinematicHero"
  | "careJourney"
  | "serviceStory"
  | "trustDossier"
  | "proofReturn"
  | "serviceFilm"
  | "storyCarousel"
  | "invoiceExample";

export type BlockType = UniversalBlockType | PrimitiveBlockType | LegacyBlockType;

export type Block =
  // Universal 12-block catalog
  | BaseBlock<"hero", HeroBlockProps>
  | BaseBlock<"featureGrid", FeatureGridBlockProps>
  | BaseBlock<"processFlow", ProcessFlowBlockProps>
  | BaseBlock<"serviceCatalog", ServiceCatalogBlockProps>
  | BaseBlock<"pricingTable", PricingTableBlockProps>
  | BaseBlock<"testimonials", TestimonialsBlockProps>
  | BaseBlock<"statsBanner", StatsBannerBlockProps>
  | BaseBlock<"accordionFaq", AccordionFaqBlockProps>
  | BaseBlock<"leadCapture", LeadCaptureBlockProps>
  | BaseBlock<"contentSection", ContentSectionBlockProps>
  | BaseBlock<"ctaBanner", CtaBannerBlockProps>
  | BaseBlock<"logoCloud", LogoCloudBlockProps>

  // Primitive blocks
  | BaseBlock<"heading", { eyebrow: string; text: string; level: "h1" | "h2" | "h3" }>
  | BaseBlock<"text", { text: string }>
  | BaseBlock<"image", { src: string; alt: string; caption: string }>
  | BaseBlock<"buttons", { items: ButtonItem[] }>
  | BaseBlock<"imageText", { eyebrow: string; title: string; text: string; image: string; imageAlt: string; imageSide: "left" | "right"; buttons: ButtonItem[] }>
  | BaseBlock<"cards", { title: string; subtitle: string; columns: 1 | 2 | 3 | 4; items: CardItem[] }>
  | BaseBlock<"faq", { title: string; items: FaqEntry[] }>
  | BaseBlock<"contactStrip", { title: string; text: string; buttons: ButtonItem[] }>
  | BaseBlock<"enquiryForm", { title: string; text: string; submitLabel: string }>
  | BaseBlock<"video", { url: string; caption: string }>
  | BaseBlock<"spacer", { size: number }>
  | BaseBlock<"divider", Record<string, never>>
  | BaseBlock<"navigation", { links: LinkItem[] }>

  // Legacy blocks
  | BaseBlock<"cinematicHero", { eyebrow: string; title: string; accent: string; text: string; image: string; imageAlt: string; buttons: ButtonItem[] }>
  | BaseBlock<"careJourney", { eyebrow: string; title: string; text: string; items: CardItem[] }>
  | BaseBlock<"serviceStory", { eyebrow: string; title: string; text: string; items: CardItem[] }>
  | BaseBlock<"trustDossier", { eyebrow: string; title: string; text: string; items: CardItem[] }>
  | BaseBlock<"proofReturn", { eyebrow: string; title: string; text: string; image: string; imageAlt: string; items: CardItem[] }>
  | BaseBlock<"serviceFilm", { eyebrow: string; title: string; text: string; src: string; poster: string; items: CardItem[] }>
  | BaseBlock<"storyCarousel", { title: string; text: string; items: StorySlide[] }>
  | BaseBlock<"invoiceExample", { title: string; text: string; items: InvoiceExampleRow[] }>;

export interface PageSeoMetadata {
  title: string;
  description: string;
}

export interface PageMetadata {
  label: string;
  /** Canonical route path for the public site. */
  path: string;
  seo: PageSeoMetadata;
}

export interface PageDocument {
  /** Persisted document format version; absent in legacy documents means v1. */
  schemaVersion?: number;
  page: string;
  /** Route/SEO metadata from the seed is preserved across visual edits. */
  metadata?: PageMetadata;
  blocks: Block[];
  updatedAt?: string;
}

export const uid = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);

export const defaultLayout = (patch: Partial<BlockLayout> = {}): BlockLayout => ({
  align: "left",
  width: "normal",
  spaceTop: 3,
  spaceBottom: 3,
  background: "none",
  hideMobile: false,
  hideDesktop: false,
  ...patch,
});

export const btn = (label: string, href: string, style: ButtonItem["style"] = "solid"): ButtonItem => ({
  id: uid(),
  label,
  href,
  style,
  size: "md",
});

/** Block library shown in the editor's "Add block" menu. */
export const BLOCK_LIBRARY: { type: BlockType; label: string; group: string; description: string }[] = [
  // 1. Hero & Header
  { type: "hero", label: "Hero Banner", group: "Hero & Header", description: "Headline, accent, supporting copy, CTA buttons and media" },
  { type: "heading", label: "Heading", group: "Hero & Header", description: "H1, H2, or H3 section title with optional eyebrow" },
  { type: "cinematicHero", label: "Cinematic Hero", group: "Hero & Header", description: "Full-width visual opening with badge and image" },

  // 2. Services & Features
  { type: "featureGrid", label: "Feature Grid", group: "Services & Features", description: "2, 3 or 4 column feature cards with icons and badges" },
  { type: "serviceCatalog", label: "Service Catalog", group: "Services & Features", description: "Filterable services with pricing, duration and booking triggers" },
  { type: "cards", label: "Cards Grid", group: "Services & Features", description: "Multi-column structured content cards" },
  { type: "contentSection", label: "Content Section", group: "Services & Features", description: "Rich editorial section with media-left, media-right or prose layout" },
  { type: "imageText", label: "Side-by-Side Story", group: "Services & Features", description: "Text narrative paired with an image" },

  // 3. Process & Workflow
  { type: "processFlow", label: "Process Flow", group: "Process & Workflow", description: "Numbered step-by-step onboarding or fulfillment timeline" },
  { type: "careJourney", label: "Journey Steps", group: "Process & Workflow", description: "Numbered step cards with descriptions" },

  // 4. Social Proof & Trust
  { type: "testimonials", label: "Testimonials", group: "Social Proof & Trust", description: "5-star rating reviews, client quotes and author attribution" },
  { type: "statsBanner", label: "Stats Banner", group: "Social Proof & Trust", description: "High-impact key numerical metrics and trust indicators" },
  { type: "logoCloud", label: "Logo Cloud", group: "Social Proof & Trust", description: "Client, partner or certification brand logo strip" },
  { type: "trustDossier", label: "Trust Dossier", group: "Social Proof & Trust", description: "Detailed trust and credential proof cards" },
  { type: "storyCarousel", label: "Story Carousel", group: "Social Proof & Trust", description: "Interactive slide carousel" },

  // 5. Pricing & Packages
  { type: "pricingTable", label: "Pricing Table", group: "Pricing & Packages", description: "Tiered pricing comparison with highlighted popular plan" },
  { type: "invoiceExample", label: "Pricing Breakdown", group: "Pricing & Packages", description: "Transparent line-item cost example" },

  // 6. Lead Capture & Contact
  { type: "leadCapture", label: "Lead Capture Form", group: "Lead Capture & Contact", description: "Configurable inquiry form with WhatsApp/email triggers" },
  { type: "ctaBanner", label: "CTA Conversion Banner", group: "Lead Capture & Contact", description: "Full-width conversion banner with primary/accent background" },
  { type: "contactStrip", label: "Contact Strip", group: "Lead Capture & Contact", description: "Quick action bar with direct contact buttons" },
  { type: "enquiryForm", label: "Simple Enquiry", group: "Lead Capture & Contact", description: "Basic message enquiry form" },
  { type: "buttons", label: "Button Row", group: "Lead Capture & Contact", description: "Group of call-to-action buttons" },

  // 7. FAQ & Support
  { type: "accordionFaq", label: "Accordion FAQ", group: "FAQ & Support", description: "Clean collapsible question and answer accordion" },
  { type: "faq", label: "FAQ List", group: "FAQ & Support", description: "Question and answer list" },

  // 8. Layout & Media
  { type: "text", label: "Text Block", group: "Layout & Media", description: "Plain rich-text paragraph container" },
  { type: "image", label: "Image", group: "Layout & Media", description: "Full-width or centered picture with caption" },
  { type: "video", label: "Video Player", group: "Layout & Media", description: "Embedded video player" },
  { type: "serviceFilm", label: "Brand Video", group: "Layout & Media", description: "Full-width video player with poster" },
  { type: "spacer", label: "Vertical Spacer", group: "Layout & Media", description: "Configurable spacing gap between sections" },
  { type: "divider", label: "Divider Line", group: "Layout & Media", description: "Horizontal rule separator" },
  { type: "navigation", label: "Navigation Bar", group: "Layout & Media", description: "Global header navigation menu" },
];

/** Factory for every block type in the catalog with sensible, professional defaults. */
export function createBlock(type: BlockType): Block {
  const id = uid();
  const layout = defaultLayout();

  switch (type) {
    // Universal 12 blocks
    case "hero":
      return {
        id,
        type,
        layout: defaultLayout({ width: "full", spaceTop: 4, spaceBottom: 4 }),
        props: {
          eyebrow: "WORLD-CLASS SOLUTIONS",
          title: "Custom Software & Operating Systems",
          accent: "Built to Scale.",
          text: "We partner with ambitious service enterprises to deliver high-performance digital storefronts, automated customer pipelines, and reliable cloud operations.",
          buttons: [btn("Get Started Today", "/contact", "solid"), btn("Explore Capabilities", "#features", "outline")],
          image: "",
          imageAlt: "Platform dashboard preview",
          variant: "split",
          imageSide: "right",
          badge: "ZERO UPFRONT PILOT",
        },
      };

    case "featureGrid":
      return {
        id,
        type,
        layout: defaultLayout({ width: "normal", spaceTop: 4, spaceBottom: 4 }),
        props: {
          eyebrow: "CORE ADVANTAGES",
          title: "Engineered for Reliability & Scale",
          subtitle: "Everything you need to streamline client acquisition and business operations.",
          columns: 3,
          items: [
            { id: uid(), icon: "Zap", title: "Instant Deployment", description: "Launch your custom platform in seconds with zero downtime or complex setups." },
            { id: uid(), icon: "Shield", title: "Enterprise Security", description: "Row-Level Security, automated backups and encrypted credentials at rest." },
            { id: uid(), icon: "Smartphone", title: "Mobile Optimized", description: "Ultra-responsive layouts designed for flawless performance on all devices." },
            { id: uid(), icon: "RefreshCw", title: "Realtime Synchronization", description: "Publish visual edits from the studio that appear on live sites in milliseconds." },
            { id: uid(), icon: "Code", title: "100% Code Ownership", description: "You own all code repositories, database instances and domain registrations." },
            { id: uid(), icon: "Headphones", title: "Dedicated Tech Partner", description: "Direct WhatsApp access to senior engineers for continuous system monitoring." },
          ],
        },
      };

    case "processFlow":
      return {
        id,
        type,
        layout: defaultLayout({ width: "normal", spaceTop: 4, spaceBottom: 4 }),
        props: {
          eyebrow: "HOW IT WORKS",
          title: "A Transparent 4-Step Journey",
          subtitle: "From your initial request to delivered results, you always know what happens next.",
          steps: [
            { id: uid(), step: 1, title: "Discovery & Plan", description: "We outline scope, deliverables and pricing transparently before any work begins." },
            { id: uid(), step: 2, title: "Rapid Build", description: "Our engineering team scaffolds your tailored cloud platform and visual editor." },
            { id: uid(), step: 3, title: "Review & Refine", description: "You inspect the live preview, make visual adjustments, and approve deployment." },
            { id: uid(), step: 4, title: "Launch & Support", description: "Your platform goes live with continuous uptime monitoring and feature enhancements." },
          ],
        },
      };

    case "serviceCatalog":
      return {
        id,
        type,
        layout: defaultLayout({ width: "normal", spaceTop: 4, spaceBottom: 4 }),
        props: {
          eyebrow: "OUR CAPABILITIES",
          title: "Comprehensive Business Services",
          subtitle: "Tailored software and operational systems designed for your industry.",
          categories: ["All", "Core", "Advanced"],
          services: [
            { id: uid(), title: "Digital Platform Setup", slug: "platform-setup", summary: "Complete cloud website and visual CMS deployment.", price: "Custom Quote", duration: "1-2 Weeks", features: ["Custom Domain & SSL", "Visual CMS Studio", "PostgreSQL Database"], href: "/contact", badge: "POPULAR" },
            { id: uid(), title: "Operational Automation", slug: "automation", summary: "Automate leads, invoices and customer communication channels.", price: "Custom Quote", duration: "Ongoing", features: ["WhatsApp Notifications", "CRM Pipeline", "Automated Billing"], href: "/contact" },
            { id: uid(), title: "Dedicated Maintenance", slug: "maintenance", summary: "24/7 technical monitoring, database backups and speed optimization.", price: "Monthly Retainer", duration: "Continuous", features: ["SLA Guarantee", "Zero-Downtime Updates", "Security Hardening"], href: "/contact" },
          ],
        },
      };

    case "pricingTable":
      return {
        id,
        type,
        layout: defaultLayout({ width: "normal", spaceTop: 4, spaceBottom: 4 }),
        props: {
          eyebrow: "TRANSPARENT INVESTMENT",
          title: "Simple, Predictable Plans",
          subtitle: "No hidden charges. Upgrade, downgrade, or cancel anytime.",
          billingNote: "All plans include 24/7 uptime monitoring and automated daily backups.",
          tiers: [
            { id: uid(), name: "Starter Pilot", price: "$0 Upfront", badge: "PILOT", description: "Experience the system before entering a commercial partnership.", highlighted: false, features: ["Complete Website Skeleton", "Visual CMS Editor", "Basic Lead Capture", "Community Support"], cta: { label: "Start Pilot", href: "/contact" } },
            { id: uid(), name: "Growth Engine", price: "$499 /mo", badge: "POPULAR", description: "Full operational suite for active, growing service businesses.", highlighted: true, features: ["Custom Domain & SSL", "Realtime WhatsApp Dispatch", "CRM & Invoicing Hub", "Priority 24/7 Support", "Unlimited Visual Edits"], cta: { label: "Get Started", href: "/contact" } },
            { id: uid(), name: "Enterprise Hub", price: "Custom", badge: "ENTERPRISE", description: "Tailored multi-location architecture and custom integrations.", highlighted: false, features: ["Dedicated Cloud Cluster", "Multi-Tenant Workspaces", "Custom API Integrations", "Dedicated Account Manager", "Custom SLA"], cta: { label: "Contact Sales", href: "/contact" } },
          ],
        },
      };

    case "testimonials":
      return {
        id,
        type,
        layout: defaultLayout({ width: "normal", spaceTop: 4, spaceBottom: 4 }),
        props: {
          eyebrow: "VERIFIED REVIEWS",
          title: "Trusted by Growing Businesses",
          subtitle: "See how our platform has transformed operations for our partners.",
          layout: "grid",
          items: [
            { id: uid(), quote: "The visual editor transformed how we run our company. We update our services and prices in seconds without needing a developer.", author: "Mohammed Al-Rashid", role: "Managing Director", company: "Prime Logistics", rating: 5 },
            { id: uid(), quote: "Uptime has been 100% and the WhatsApp integration has doubled our customer inquiry conversion rate in 30 days.", author: "Sarah Jenkins", role: "Founder", company: "Apex Health Group", rating: 5 },
            { id: uid(), quote: "Having our database, CRM, and website all synchronized in real time eliminated hours of manual paperwork each week.", author: "David Vance", role: "Operations Lead", company: "Vance Home Services", rating: 5 },
          ],
        },
      };

    case "statsBanner":
      return {
        id,
        type,
        layout: defaultLayout({ background: "card", width: "normal", align: "center", spaceTop: 4, spaceBottom: 4 }),
        props: {
          eyebrow: "PROVEN IMPACT",
          title: "Results You Can Measure",
          stats: [
            { id: uid(), value: "99.9", suffix: "%", label: "Uptime Reliability", description: "Monitored 24/7 at edge" },
            { id: uid(), value: "< 100", suffix: "ms", label: "Realtime Sync", description: "Instant content propagation" },
            { id: uid(), value: "100", suffix: "%", label: "Client Code Ownership", description: "Zero vendor lock-in" },
            { id: uid(), value: "12", suffix: "+", label: "Service Industries", description: "Customized solutions" },
          ],
        },
      };

    case "accordionFaq":
      return {
        id,
        type,
        layout: defaultLayout({ width: "narrow", spaceTop: 4, spaceBottom: 4 }),
        props: {
          eyebrow: "HAVE QUESTIONS?",
          title: "Frequently Asked Questions",
          subtitle: "Clear, straightforward answers about our technology and partnership model.",
          items: [
            { id: uid(), question: "How does the zero-upfront pilot program work?", answer: "We partner with selected businesses to deploy the platform at zero upfront cost. You experience live operational value first before entering a commercial partnership." },
            { id: uid(), question: "Can I update the website without knowing how to code?", answer: "Yes. Our visual studio allows you to click on any element, change text or photos, and publish live in milliseconds." },
            { id: uid(), question: "Who owns the platform, database, and domain?", answer: "You own 100% of your platform, database, and domain from day one. There is zero proprietary lock-in." },
            { id: uid(), question: "How do customer inquiries reach our team?", answer: "Inquiries dispatch directly to your WhatsApp or email in real time, formatted clearly with all customer details." },
          ],
        },
      };

    case "leadCapture":
      return {
        id,
        type,
        layout: defaultLayout({ width: "narrow", spaceTop: 4, spaceBottom: 4 }),
        props: {
          eyebrow: "GET IN TOUCH",
          title: "Start Your Pilot Project",
          subtitle: "Fill out the short form below and our team will get in touch with you today.",
          fields: [
            { id: uid(), name: "name", label: "Your Name", type: "text", required: true, placeholder: "John Doe" },
            { id: uid(), name: "phone", label: "Phone / WhatsApp", type: "tel", required: true, placeholder: "+1 234 567 8900" },
            { id: uid(), name: "email", label: "Email Address", type: "email", required: false, placeholder: "john@example.com" },
            { id: uid(), name: "message", label: "Tell us about your requirements", type: "textarea", required: true, placeholder: "Describe what your business needs..." },
          ],
          submitLabel: "Send Inquiry",
          dispatchTarget: "whatsapp",
          successMessage: "Thank you! Your message has been sent.",
        },
      };

    case "contentSection":
      return {
        id,
        type,
        layout: defaultLayout({ width: "normal", spaceTop: 4, spaceBottom: 4 }),
        props: {
          eyebrow: "ABOUT OUR APPROACH",
          title: "A Dedicated Long-Term Technology Partner",
          text: "We do not simply build websites and walk away. We operate as your internal technology department, continuously maintaining infrastructure, monitoring performance, and automating operations.",
          layout: "mediaRight",
          mediaType: "image",
          mediaUrl: "",
          mediaAlt: "Technology partnership illustration",
          buttons: [btn("Learn More About Us", "/about", "outline")],
        },
      };

    case "ctaBanner":
      return {
        id,
        type,
        layout: defaultLayout({ background: "primary", width: "full", align: "center", spaceTop: 5, spaceBottom: 5 }),
        props: {
          eyebrow: "READY TO ELEVATE YOUR OPERATIONS?",
          title: "Let's Build Something Exceptional Together",
          text: "Join forward-thinking service businesses that run on our high-performance architecture.",
          background: "primary",
          buttons: [btn("Start Your Free Pilot", "/contact", "solid")],
        },
      };

    case "logoCloud":
      return {
        id,
        type,
        layout: defaultLayout({ align: "center", spaceTop: 3, spaceBottom: 3 }),
        props: {
          eyebrow: "TRUSTED BY LEADING ENTERPRISES",
          title: "Powering Modern Service Businesses",
          logos: [
            { id: uid(), name: "Apex Group", logoUrl: "" },
            { id: uid(), name: "Prime Legal", logoUrl: "" },
            { id: uid(), name: "Metro Health", logoUrl: "" },
            { id: uid(), name: "Vance Services", logoUrl: "" },
          ],
        },
      };

    // Primitive & legacy blocks
    case "heading":
      return { id, type, layout, props: { eyebrow: "", text: "Section Heading", level: "h2" } };
    case "text":
      return { id, type, layout, props: { text: "Write your section paragraph here." } };
    case "image":
      return { id, type, layout, props: { src: "", alt: "", caption: "" } };
    case "buttons":
      return { id, type, layout, props: { items: [btn("Action Button", "/contact")] } };
    case "imageText":
      return { id, type, layout, props: { eyebrow: "", title: "Featured Story", text: "Narrative description goes here.", image: "", imageAlt: "", imageSide: "left", buttons: [] } };
    case "cards":
      return { id, type, layout, props: { title: "Featured Highlights", subtitle: "", columns: 3, items: [1, 2, 3].map((n) => ({ id: uid(), title: `Feature ${n}`, text: "Concise benefit description." })) } };
    case "faq":
      return { id, type, layout, props: { title: "Frequently Asked Questions", items: [{ id: uid(), question: "How do we get started?", answer: "Reach out via our contact form or WhatsApp." }] } };
    case "contactStrip":
      return { id, type, layout: defaultLayout({ background: "primary", align: "center" }), props: { title: "Need immediate assistance?", text: "Send us a message and we reply the same day.", buttons: [btn("Message on WhatsApp", "whatsapp", "outline")] } };
    case "enquiryForm":
      return { id, type, layout, props: { title: "Tell us what you need", text: "We reply directly on WhatsApp.", submitLabel: "Send request" } };
    case "video":
      return { id, type, layout, props: { url: "", caption: "" } };
    case "spacer":
      return { id, type, layout: defaultLayout({ spaceTop: 0, spaceBottom: 0 }), props: { size: 3 } };
    case "divider":
      return { id, type, layout, props: {} };
    case "navigation":
      return { id, type, layout, props: { links: (seedBlueprint.site.navigation ?? []).map((n) => ({ id: uid(), label: n.label, href: n.href })) } };

    // Legacy fallbacks
    case "cinematicHero":
      return { id, type, layout: defaultLayout({ width: "full", spaceTop: 0, spaceBottom: 2 }), props: { eyebrow: "WORLD-CLASS SOLUTIONS", title: "Enterprise Operations,", accent: "Built to Scale.", text: "High-performance software and cloud systems for service businesses.", image: "", imageAlt: "Platform visual", buttons: [btn("Get Started", "/contact"), btn("Learn More", "/about", "outline")] } };
    case "careJourney":
      return { id, type, layout: defaultLayout({ width: "normal", spaceTop: 4, spaceBottom: 4 }), props: { eyebrow: "HOW IT WORKS", title: "A Clear, Reliable Process", text: "Transparent steps from start to finish.", items: [1, 2, 3].map((n) => ({ id: uid(), title: `Step ${n}`, text: "Step explanation." })) } };
    case "serviceStory":
      return { id, type, layout: defaultLayout({ width: "normal", spaceTop: 4, spaceBottom: 4 }), props: { eyebrow: "SERVICES", title: "Solutions Tailored to Real Needs", text: "Explore what we do.", items: [1, 2, 3].map((n) => ({ id: uid(), title: `Service ${n}`, text: "Description of service." })) } };
    case "trustDossier":
      return { id, type, layout, props: { eyebrow: "TRUST & PROOF", title: "Why Businesses Trust Us", text: "Built on transparency.", items: [] } };
    case "proofReturn":
      return { id, type, layout, props: { eyebrow: "VERIFICATION", title: "Full Visibility", text: "Realtime reporting.", image: "", imageAlt: "", items: [] } };
    case "serviceFilm":
      return { id, type, layout, props: { eyebrow: "VIDEO OVERVIEW", title: "Our System in Action", text: "A 2-minute overview.", src: "", poster: "", items: [] } };
    case "storyCarousel":
      return { id, type, layout, props: { title: "Featured Stories", text: "Explore client highlights.", items: [] } };
    case "invoiceExample":
      return { id, type, layout, props: { title: "Transparent Pricing", text: "Sample line-item breakdown.", items: [] } };
  }
}

/** Every page available in the visual studio dropdown, derived dynamically from seed.json. */
export const BUILDER_PAGES: { id: string; label: string; path: string }[] = Object.entries(
  (seedBlueprint as unknown as { pages: Record<string, { label: string; path: string }> }).pages || {}
).map(([id, page]) => ({
  id,
  label: page.label,
  path: page.path,
}));

/** Resolves the starting document for a page from seed.json. */
export function defaultDocument(page: string): PageDocument {
  const seedPages = (seedBlueprint as unknown as { pages: Record<string, { label: string; path: string; seo?: PageSeoMetadata; blocks?: Block[] }> }).pages || {};
  const found = seedPages[page];

  if (found && Array.isArray(found.blocks)) {
    return {
      schemaVersion: 1,
      page,
      metadata: {
        label: found.label,
        path: found.path,
        seo: found.seo ?? { title: found.label, description: "" },
      },
      blocks: found.blocks,
    };
  }

  return {
    schemaVersion: 1,
    page,
    metadata: {
      label: page,
      path: page === "home" ? "/" : "/" + page,
      seo: { title: page, description: "" },
    },
    blocks: [createBlock("hero")],
  };
}
