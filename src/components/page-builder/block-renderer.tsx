import {
  createContext,
  useContext,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  Code,
  Globe,
  Headphones,
  ImageIcon,
  Layers,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Send,
  Settings,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";

import { useSiteContact } from "../../hooks/use-site-contact";
import { buildMailUrl, buildTelUrl, buildWhatsAppUrl } from "../../lib/whatsapp/url-builder";
import { generalEnquiryMessage } from "../../lib/whatsapp/templates";
import { submitWebsiteEnquiry } from "../../lib/website-capture";
import { track } from "../../lib/analytics";
import type {
  AccordionFaqBlockProps,
  Block,
  BlockLayout,
  ButtonItem,
  ContentSectionBlockProps,
  CtaBannerBlockProps,
  FeatureGridBlockProps,
  HeroBlockProps,
  LeadCaptureBlockProps,
  LogoCloudBlockProps,
  PricingTableBlockProps,
  ProcessFlowBlockProps,
  ServiceCatalogBlockProps,
  StatsBannerBlockProps,
  TestimonialsBlockProps,
} from "../../lib/page-builder/model";
import { isSafeHref } from "../../lib/page-builder/safe-url";
import { cn } from "../../lib/utils";
import { StoryCarousel } from "../site/story-carousel";
import { InvoiceExample } from "../site/invoice-example";
import { ServiceFilm } from "../site/service-film";

/* ============================================================================
   ICON RESOLVER
   ============================================================================ */

const ICON_MAP: Record<string, ElementType> = {
  Zap,
  Shield,
  Smartphone,
  RefreshCw,
  Code,
  Headphones,
  Sparkles,
  CheckCircle2,
  BarChart: BarChart3,
  BarChart3,
  Star,
  Globe,
  Users,
  Layers,
  Lock,
  Settings,
  ArrowRight,
  Send,
  MessageCircle,
  Mail,
  Phone,
};

function resolveIcon(name?: string): ElementType {
  if (!name) return Sparkles;
  return ICON_MAP[name] || Sparkles;
}

/* ============================================================================
   EDITING CONTEXT
   ============================================================================ */

interface EditApi {
  editing: boolean;
  /** Patch a single prop path on a block, e.g. ("title", "x") or ("items.2.title", "x"). */
  setProp: (blockId: string, path: string, value: string) => void;
}
const EditCtx = createContext<EditApi>({ editing: false, setProp: () => undefined });
export const EditProvider = EditCtx.Provider;
const BlockIdCtx = createContext<string>("");

/** Text that is plain on the live site and click-to-type in the editor. */
export function Editable({
  path,
  value,
  as: Tag = "span",
  className,
  placeholder = "Type here…",
  multiline = false,
}: {
  path: string;
  value?: string | undefined;
  as?: ElementType | undefined;
  className?: string | undefined;
  placeholder?: string | undefined;
  multiline?: boolean | undefined;
}) {
  const { editing, setProp } = useContext(EditCtx);
  const blockId = useContext(BlockIdCtx);
  if (!editing) {
    if (!value) return null;
    return <Tag className={cn(multiline && "whitespace-pre-line", className)}>{value}</Tag>;
  }
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      onPointerDown={(e: React.PointerEvent) => e.stopPropagation()}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !multiline) {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
      }}
      onBlur={(e: React.FocusEvent<HTMLElement>) => {
        setProp(blockId, path, e.currentTarget.innerText.trim());
      }}
      className={cn(
        "cursor-text outline-dashed outline-1 outline-primary/40 hover:outline-primary focus:outline-solid focus:outline-2 focus:outline-primary",
        multiline && "whitespace-pre-line",
        className,
      )}
    >
      {value || ""}
    </Tag>
  );
}

/* ============================================================================
   SHARED ATOMIC PRIMITIVES
   ============================================================================ */

function ActionButton({
  item,
  path,
}: {
  item: ButtonItem;
  path: string;
}) {
  const { editing } = useContext(EditCtx);
  const contact = useSiteContact();

  const rawHref = item.href?.trim() ?? "";
  let href: string | null = null;
  let external = false;

  if (rawHref === "whatsapp") {
    href = contact.whatsapp ? buildWhatsAppUrl(contact.whatsapp, generalEnquiryMessage()) : null;
    external = true;
  } else if (rawHref === "phone") {
    href = contact.phone ? buildTelUrl(contact.phone) : null;
  } else if (rawHref === "email") {
    href = contact.email ? buildMailUrl(contact.email, "General Enquiry") : null;
  } else if (isSafeHref(rawHref)) {
    href = rawHref;
    external = rawHref.toLowerCase().startsWith("http://") || rawHref.toLowerCase().startsWith("https://");
  }

  const baseClass =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98]";
  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-6 py-3.5 text-base rounded-2xl gap-2.5 shadow-sm hover:shadow-md",
  };
  const styleClasses = {
    solid: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    outline: "border-2 border-border bg-background text-foreground hover:bg-muted hover:border-foreground/20",
    text: "text-foreground hover:text-primary hover:bg-muted/50",
  };

  const className = cn(baseClass, sizeClasses[item.size ?? "md"], styleClasses[item.style ?? "solid"]);

  if (editing || !href) {
    return (
      <span className={className}>
        <Editable path={`${path}.label`} value={item.label} />
      </span>
    );
  }

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={() => track("cta.clicked", { label: item.label, href })}
      className={className}
    >
      <Editable path={`${path}.label`} value={item.label} />
    </a>
  );
}

function Buttons({
  items,
  basePath,
  align = "left",
}: {
  items?: ButtonItem[];
  basePath: string;
  align?: BlockLayout["align"];
}) {
  if (!items || items.length === 0) return null;
  return (
    <div
      className={cn(
        "mt-6 flex flex-wrap gap-3",
        align === "center" && "justify-center",
        align === "right" && "justify-end",
      )}
    >
      {items.map((it, i) => (
        <ActionButton key={it.id || i} item={it} path={`${basePath}.${i}`} />
      ))}
    </div>
  );
}

/* ============================================================================
   BLOCK WRAPPER FRAME
   ============================================================================ */

function Frame({
  block,
  children,
}: {
  block: Block;
  children: ReactNode;
}) {
  const { align, width, spaceTop, spaceBottom, background, hideMobile, hideDesktop } = block.layout;

  const bgClasses: Record<BlockLayout["background"], string> = {
    none: "bg-transparent",
    muted: "bg-muted/40 text-foreground",
    card: "bg-card text-card-foreground border-y border-border/40",
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
  };

  const widthClasses: Record<BlockLayout["width"], string> = {
    narrow: "max-w-3xl mx-auto px-4 sm:px-6",
    normal: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
    full: "w-full px-4 sm:px-6 lg:px-10",
  };

  const alignClasses: Record<BlockLayout["align"], string> = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  };

  const paddingStyle: CSSProperties = {
    paddingTop: `${spaceTop * 1}rem`,
    paddingBottom: `${spaceBottom * 1}rem`,
  };

  return (
    <section
      id={block.anchor || undefined}
      style={paddingStyle}
      className={cn(
        "relative transition-colors duration-150",
        bgClasses[background],
        hideMobile && "hidden sm:block",
        hideDesktop && "sm:hidden",
      )}
    >
      <div className={cn(widthClasses[width], alignClasses[align])}>{children}</div>
    </section>
  );
}

/* ============================================================================
   12 UNIVERSAL BLOCK RENDERERS
   ============================================================================ */

function UniversalHero({ props }: { props: HeroBlockProps }) {
  const align = props.variant === "center" ? "center" : "left";
  return (
    <div
      className={cn(
        "grid items-center gap-10 lg:gap-14",
        props.variant === "split" && "lg:grid-cols-2",
        props.variant === "center" && "mx-auto max-w-4xl text-center",
      )}
    >
      <div className={props.imageSide === "left" && props.variant === "split" ? "lg:order-2" : ""}>
        {props.badge ? (
          <div className={cn("inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold tracking-wide uppercase text-primary", align === "center" && "mx-auto")}>
            <Sparkles className="h-3.5 w-3.5" />
            <Editable path="badge" value={props.badge} />
          </div>
        ) : null}

        <Editable
          as="span"
          path="eyebrow"
          value={props.eyebrow}
          className="mt-3 block text-xs font-bold tracking-widest uppercase text-muted-foreground"
        />

        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          <Editable path="title" value={props.title} />{" "}
          {props.accent ? (
            <span className="text-primary">
              <Editable path="accent" value={props.accent} />
            </span>
          ) : null}
        </h1>

        <Editable
          as="p"
          multiline
          path="text"
          value={props.text}
          className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl"
        />

        <Buttons items={props.buttons} basePath="buttons" align={align} />
      </div>

      {props.variant === "split" ? (
        <div className={props.imageSide === "left" ? "lg:order-1" : ""}>
          {props.image ? (
            <div className="relative overflow-hidden rounded-3xl border border-border/60 shadow-xl">
              <img src={props.image} alt={props.imageAlt || ""} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center rounded-3xl border-2 border-dashed border-border bg-muted/20 text-muted-foreground">
              <ImageIcon className="h-10 w-10 opacity-40" />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function UniversalFeatureGrid({ props }: { props: FeatureGridBlockProps }) {
  const { editing } = useContext(EditCtx);
  const colClasses = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div>
      <div className="max-w-3xl">
        <Editable as="span" path="eyebrow" value={props.eyebrow} className="block text-xs font-bold tracking-widest uppercase text-primary" />
        <Editable as="h2" path="title" value={props.title} className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl" />
        <Editable as="p" multiline path="subtitle" value={props.subtitle} className="mt-3 text-lg text-muted-foreground" />
      </div>

      <div className={cn("mt-10 grid gap-6", colClasses[props.columns ?? 3])}>
        {props.items.map((it, i) => {
          const IconComponent = resolveIcon(it.icon);
          const href = it.href?.trim();
          const isLink = Boolean(href && isSafeHref(href) && !editing);

          const inner = (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <IconComponent className="h-6 w-6" />
              </div>
              {it.badge ? (
                <span className="mt-4 inline-block rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                  <Editable path={`items.${i}.badge`} value={it.badge} />
                </span>
              ) : null}
              <Editable as="h3" path={`items.${i}.title`} value={it.title} className="mt-4 font-display text-xl font-bold" />
              <Editable as="p" multiline path={`items.${i}.description`} value={it.description} className="mt-2 text-sm leading-relaxed text-muted-foreground" />
            </>
          );

          return isLink ? (
            <a
              key={it.id || i}
              href={href}
              className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              {inner}
            </a>
          ) : (
            <div key={it.id || i} className="relative rounded-2xl border border-border bg-card p-6 shadow-sm">
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UniversalProcessFlow({ props }: { props: ProcessFlowBlockProps }) {
  return (
    <div>
      <div className="max-w-3xl">
        <Editable as="span" path="eyebrow" value={props.eyebrow} className="block text-xs font-bold tracking-widest uppercase text-primary" />
        <Editable as="h2" path="title" value={props.title} className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl" />
        <Editable as="p" multiline path="subtitle" value={props.subtitle} className="mt-3 text-lg text-muted-foreground" />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {props.steps.map((st, i) => (
          <div key={st.id || i} className="relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground">
              {String(st.step ?? i + 1).padStart(2, "0")}
            </span>
            <Editable as="h3" path={`steps.${i}.title`} value={st.title} className="mt-5 font-display text-lg font-bold" />
            <Editable as="p" multiline path={`steps.${i}.description`} value={st.description} className="mt-2 text-sm leading-relaxed text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}

function UniversalServiceCatalog({ props }: { props: ServiceCatalogBlockProps }) {
  const { editing } = useContext(EditCtx);
  const [selectedCat, setSelectedCat] = useState("All");

  const filtered = selectedCat === "All"
    ? props.services
    : props.services.filter((s) => s.badge === selectedCat || s.slug.includes(selectedCat.toLowerCase()));

  return (
    <div>
      <div className="max-w-3xl">
        <Editable as="span" path="eyebrow" value={props.eyebrow} className="block text-xs font-bold tracking-widest uppercase text-primary" />
        <Editable as="h2" path="title" value={props.title} className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl" />
        <Editable as="p" multiline path="subtitle" value={props.subtitle} className="mt-3 text-lg text-muted-foreground" />
      </div>

      {props.categories && props.categories.length > 1 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {props.categories.map((cat) => (
            <button
              key={typeof cat === "string" ? cat : (cat as { item?: string })?.item ?? String(cat)}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition",
                selectedCat === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((svc, i) => (
          <div key={svc.id || i} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                {svc.badge ? (
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                    <Editable path={`services.${i}.badge`} value={svc.badge} />
                  </span>
                ) : <span />}
                {svc.price ? (
                  <span className="font-mono text-xs font-semibold text-muted-foreground">
                    <Editable path={`services.${i}.price`} value={svc.price} />
                  </span>
                ) : null}
              </div>
              <Editable as="h3" path={`services.${i}.title`} value={svc.title} className="mt-4 font-display text-xl font-bold" />
              <Editable as="p" multiline path={`services.${i}.summary`} value={svc.summary} className="mt-2 text-sm leading-relaxed text-muted-foreground" />
              {svc.features && svc.features.length > 0 ? (
                <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                  {svc.features.map((feat, fi) => (
                    <li key={fi} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary" />
                      <span>{typeof feat === "string" ? feat : (feat as { item?: string })?.item ?? String(feat)}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="mt-6 pt-4 border-t border-border/50">
              {editing ? (
                <span className="text-xs font-bold text-primary">Button link in settings</span>
              ) : (
                <a
                  href={svc.href || "/contact"}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  Book / Learn More <ArrowRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UniversalPricingTable({ props }: { props: PricingTableBlockProps }) {
  const { editing } = useContext(EditCtx);

  return (
    <div>
      <div className="mx-auto max-w-3xl text-center">
        <Editable as="span" path="eyebrow" value={props.eyebrow} className="block text-xs font-bold tracking-widest uppercase text-primary" />
        <Editable as="h2" path="title" value={props.title} className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl" />
        <Editable as="p" multiline path="subtitle" value={props.subtitle} className="mt-3 text-lg text-muted-foreground" />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {props.tiers.map((tier, i) => (
          <div
            key={tier.id || i}
            className={cn(
              "relative flex flex-col justify-between rounded-3xl border p-8 shadow-sm transition duration-200",
              tier.highlighted
                ? "border-primary bg-card shadow-xl ring-2 ring-primary"
                : "border-border bg-card",
            )}
          >
            <div>
              {tier.badge ? (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  <Editable path={`tiers.${i}.badge`} value={tier.badge} />
                </span>
              ) : null}
              <Editable as="h3" path={`tiers.${i}.name`} value={tier.name} className="mt-4 font-display text-2xl font-bold" />
              <div className="mt-3 font-display text-4xl font-extrabold">
                <Editable path={`tiers.${i}.price`} value={tier.price} />
              </div>
              <Editable as="p" multiline path={`tiers.${i}.description`} value={tier.description} className="mt-3 text-sm text-muted-foreground" />

              <ul className="mt-6 space-y-3 border-t border-border/60 pt-6 text-sm">
                {tier.features.map((feat, fi) => (
                  <li key={fi} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    <span>{typeof feat === "string" ? feat : (feat as { item?: string })?.item ?? String(feat)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              {editing ? (
                <span className="block w-full rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-bold text-primary-foreground">
                  {tier.cta.label}
                </span>
              ) : (
                <a
                  href={tier.cta.href || "/contact"}
                  className={cn(
                    "block w-full rounded-xl px-4 py-2.5 text-center text-sm font-bold transition",
                    tier.highlighted
                      ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
                      : "border border-border bg-background text-foreground hover:bg-muted",
                  )}
                >
                  {tier.cta.label}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {props.billingNote ? (
        <Editable as="p" path="billingNote" value={props.billingNote} className="mt-8 text-center text-xs text-muted-foreground" />
      ) : null}
    </div>
  );
}

function UniversalTestimonials({ props }: { props: TestimonialsBlockProps }) {
  return (
    <div>
      <div className="mx-auto max-w-3xl text-center">
        <Editable as="span" path="eyebrow" value={props.eyebrow} className="block text-xs font-bold tracking-widest uppercase text-primary" />
        <Editable as="h2" path="title" value={props.title} className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl" />
        <Editable as="p" multiline path="subtitle" value={props.subtitle} className="mt-3 text-lg text-muted-foreground" />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {props.items.map((it, i) => (
          <div key={it.id || i} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div>
              <div className="flex gap-1 text-amber-500">
                {Array.from({ length: it.rating || 5 }).map((_, si) => (
                  <Star key={si} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <Editable as="p" multiline path={`items.${i}.quote`} value={`"${it.quote}"`} className="mt-4 text-base italic leading-relaxed text-foreground" />
            </div>

            <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                {it.author ? it.author.charAt(0) : "U"}
              </div>
              <div>
                <Editable as="h4" path={`items.${i}.author`} value={it.author} className="font-display text-sm font-bold" />
                <p className="text-xs text-muted-foreground">
                  <Editable path={`items.${i}.role`} value={it.role} />
                  {it.company ? <span> · <Editable path={`items.${i}.company`} value={it.company} /></span> : null}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UniversalStatsBanner({ props }: { props: StatsBannerBlockProps }) {
  return (
    <div>
      {props.title ? (
        <div className="mx-auto max-w-2xl text-center">
          <Editable as="span" path="eyebrow" value={props.eyebrow} className="block text-xs font-bold tracking-widest uppercase text-primary" />
          <Editable as="h2" path="title" value={props.title} className="mt-2 font-display text-3xl font-bold" />
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {props.stats.map((st, i) => (
          <div key={st.id || i} className="text-center">
            <div className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl text-primary">
              {st.prefix ? <span>{st.prefix}</span> : null}
              <Editable path={`stats.${i}.value`} value={st.value} />
              {st.suffix ? <span>{st.suffix}</span> : null}
            </div>
            <Editable as="h3" path={`stats.${i}.label`} value={st.label} className="mt-2 font-display text-sm font-bold text-foreground" />
            {st.description ? (
              <Editable as="p" path={`stats.${i}.description`} value={st.description} className="mt-1 text-xs text-muted-foreground" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function UniversalAccordionFaq({ props }: { props: AccordionFaqBlockProps }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      <div className="mx-auto max-w-3xl text-center">
        <Editable as="span" path="eyebrow" value={props.eyebrow} className="block text-xs font-bold tracking-widest uppercase text-primary" />
        <Editable as="h2" path="title" value={props.title} className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl" />
        <Editable as="p" multiline path="subtitle" value={props.subtitle} className="mt-3 text-lg text-muted-foreground" />
      </div>

      <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
        {props.items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.id || i} className="p-5">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 text-left font-display text-lg font-semibold"
              >
                <Editable path={`items.${i}.question`} value={item.question} />
                <ChevronDown className={cn("h-5 w-5 shrink-0 transition-transform duration-200", isOpen && "rotate-180")} />
              </button>
              {isOpen ? (
                <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  <Editable multiline path={`items.${i}.answer`} value={item.answer} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UniversalLeadCapture({ props }: { props: LeadCaptureBlockProps }) {
  const contact = useSiteContact();
  const [form, setForm] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (props.dispatchTarget === "whatsapp" && contact.whatsapp) {
      const text = Object.entries(form).map(([k, v]) => `${k}: ${v}`).join("\n");
      const url = buildWhatsAppUrl(contact.whatsapp, text);
      if (url) window.open(url, "_blank", "noopener");
    }
    setSent(true);
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
      <Editable as="span" path="eyebrow" value={props.eyebrow} className="block text-xs font-bold tracking-widest uppercase text-primary" />
      <Editable as="h2" path="title" value={props.title} className="mt-2 font-display text-3xl font-bold" />
      <Editable as="p" multiline path="subtitle" value={props.subtitle} className="mt-2 text-sm text-muted-foreground" />

      {sent ? (
        <div className="mt-6 rounded-xl bg-primary/10 p-4 text-sm font-semibold text-primary">
          {props.successMessage || "Thank you! We will get back to you shortly."}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {props.fields.map((f) => (
            <div key={f.id}>
              <label className="block text-xs font-semibold text-foreground">
                {f.label} {f.required ? <span className="text-destructive">*</span> : null}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  required={f.required}
                  placeholder={f.placeholder}
                  rows={3}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              ) : (
                <input
                  type={f.type}
                  required={f.required}
                  placeholder={f.placeholder}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90"
          >
            {props.submitLabel || "Send Request"}
          </button>
        </form>
      )}
    </div>
  );
}

function UniversalContentSection({ props }: { props: ContentSectionBlockProps }) {
  return (
    <div className={cn("grid gap-10 items-center", props.layout !== "prose" && "lg:grid-cols-2")}>
      <div className={props.layout === "mediaLeft" ? "lg:order-2" : ""}>
        <Editable as="span" path="eyebrow" value={props.eyebrow} className="block text-xs font-bold tracking-widest uppercase text-primary" />
        <Editable as="h2" path="title" value={props.title} className="mt-2 font-display text-3xl font-bold sm:text-4xl" />
        <Editable as="p" multiline path="text" value={props.text} className="mt-4 text-base leading-relaxed text-muted-foreground" />
        <Buttons items={props.buttons} basePath="buttons" />
      </div>

      {props.layout !== "prose" ? (
        <div className={props.layout === "mediaLeft" ? "lg:order-1" : ""}>
          {props.mediaUrl ? (
            <img src={props.mediaUrl} alt={props.mediaAlt || ""} className="rounded-3xl border border-border shadow-lg" />
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border-2 border-dashed border-border bg-muted/20 text-muted-foreground">
              <ImageIcon className="h-10 w-10 opacity-40" />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function UniversalCtaBanner({ props }: { props: CtaBannerBlockProps }) {
  return (
    <div className="rounded-3xl border border-border/40 bg-primary px-8 py-16 text-center text-primary-foreground shadow-xl sm:px-12">
      <Editable as="span" path="eyebrow" value={props.eyebrow} className="block text-xs font-bold tracking-widest uppercase opacity-80" />
      <Editable as="h2" path="title" value={props.title} className="mt-3 font-display text-3xl font-extrabold sm:text-5xl" />
      <Editable as="p" multiline path="text" value={props.text} className="mx-auto mt-4 max-w-2xl text-base opacity-90 sm:text-lg" />
      <div className="mt-8 flex justify-center">
        <Buttons items={props.buttons} basePath="buttons" align="center" />
      </div>
    </div>
  );
}

function UniversalLogoCloud({ props }: { props: LogoCloudBlockProps }) {
  return (
    <div className="text-center">
      {props.eyebrow ? (
        <Editable as="span" path="eyebrow" value={props.eyebrow} className="block text-xs font-bold tracking-widest uppercase text-muted-foreground" />
      ) : null}
      {props.title ? (
        <Editable as="h3" path="title" value={props.title} className="mt-1 font-display text-lg font-bold" />
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
        {props.logos.map((lg, i) => (
          <div key={lg.id || i} className="flex items-center gap-2 font-display text-sm font-bold opacity-60 transition hover:opacity-100">
            {lg.logoUrl ? (
              <img src={lg.logoUrl} alt={lg.name} className="h-8 object-contain" />
            ) : (
              <span className="rounded-lg bg-muted px-3 py-1.5">{lg.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   ROOT BLOCK BODY ROUTER
   ============================================================================ */

function BlockBody({ block }: { block: Block }) {
  const { editing } = useContext(EditCtx);
  const align = block.layout.align;

  switch (block.type) {
    // 12 Universal Blocks
    case "hero":
      return <UniversalHero props={block.props} />;
    case "featureGrid":
      return <UniversalFeatureGrid props={block.props} />;
    case "processFlow":
      return <UniversalProcessFlow props={block.props} />;
    case "serviceCatalog":
      return <UniversalServiceCatalog props={block.props} />;
    case "pricingTable":
      return <UniversalPricingTable props={block.props} />;
    case "testimonials":
      return <UniversalTestimonials props={block.props} />;
    case "statsBanner":
      return <UniversalStatsBanner props={block.props} />;
    case "accordionFaq":
      return <UniversalAccordionFaq props={block.props} />;
    case "leadCapture":
      return <UniversalLeadCapture props={block.props} />;
    case "contentSection":
      return <UniversalContentSection props={block.props} />;
    case "ctaBanner":
      return <UniversalCtaBanner props={block.props} />;
    case "logoCloud":
      return <UniversalLogoCloud props={block.props} />;

    // Primitive Blocks
    case "heading": {
      const Tag = block.props.level;
      const sizeClasses = {
        h1: "text-4xl sm:text-5xl font-extrabold tracking-tight",
        h2: "text-3xl sm:text-4xl font-bold tracking-tight",
        h3: "text-2xl sm:text-3xl font-semibold",
      };
      return (
        <div>
          <Editable as="span" path="eyebrow" value={block.props.eyebrow} className="block text-xs font-bold tracking-widest uppercase text-primary" />
          <Editable as={Tag} path="text" value={block.props.text} className={cn("mt-2 font-display", sizeClasses[Tag])} />
        </div>
      );
    }
    case "text":
      return <Editable as="div" multiline path="text" value={block.props.text} className="prose prose-neutral max-w-none text-base leading-relaxed text-muted-foreground" />;
    case "image":
      return (
        <figure>
          {block.props.src ? (
            <img src={block.props.src} alt={block.props.alt || ""} className="w-full rounded-2xl object-cover shadow" />
          ) : (
            <div className="flex aspect-[16/9] items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 text-muted-foreground">
              <ImageIcon className="h-10 w-10 opacity-40" />
            </div>
          )}
          <Editable as="figcaption" path="caption" value={block.props.caption} className="mt-2 text-center text-xs text-muted-foreground" />
        </figure>
      );
    case "buttons":
      return <Buttons items={block.props.items} basePath="items" align={align} />;
    case "imageText":
      return (
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className={block.props.imageSide === "left" ? "lg:order-2" : ""}>
            <Editable as="span" path="eyebrow" value={block.props.eyebrow} className="block text-xs font-bold uppercase tracking-wider text-primary" />
            <Editable as="h2" path="title" value={block.props.title} className="mt-2 font-display text-3xl font-bold" />
            <Editable as="p" multiline path="text" value={block.props.text} className="mt-4 leading-relaxed text-muted-foreground" />
            <Buttons items={block.props.buttons} basePath="buttons" />
          </div>
          <div className={block.props.imageSide === "left" ? "lg:order-1" : ""}>
            {block.props.image ? (
              <img src={block.props.image} alt={block.props.imageAlt || ""} className="rounded-2xl object-cover shadow" />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 text-muted-foreground">
                <ImageIcon className="h-8 w-8 opacity-40" />
              </div>
            )}
          </div>
        </div>
      );
    case "cards": {
      const cols = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      };
      return (
        <div>
          {block.props.title ? <Editable as="h2" path="title" value={block.props.title} className="font-display text-3xl font-bold" /> : null}
          {block.props.subtitle ? <Editable as="p" multiline path="subtitle" value={block.props.subtitle} className="mt-2 text-muted-foreground" /> : null}
          <div className={cn("mt-8 grid gap-6", cols[block.props.columns || 3])}>
            {block.props.items.map((c, i) => (
              <div key={c.id || i} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {c.image ? <img src={c.image} alt="" className="mb-4 aspect-[4/3] w-full rounded-xl object-cover" /> : null}
                <Editable as="h3" path={`items.${i}.title`} value={c.title} className="font-display text-xl font-bold" />
                <Editable as="p" multiline path={`items.${i}.text`} value={c.text} className="mt-2 text-sm text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      );
    }
    case "faq":
      return (
        <div>
          <Editable as="h2" path="title" value={block.props.title} className="font-display text-3xl font-bold" />
          <div className="mt-6 space-y-4">
            {block.props.items.map((item, i) => (
              <div key={item.id || i} className="rounded-xl border border-border bg-card p-5">
                <Editable as="h3" path={`items.${i}.question`} value={item.question} className="font-display font-semibold" />
                <Editable as="p" multiline path={`items.${i}.answer`} value={item.answer} className="mt-2 text-sm text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      );
    case "contactStrip":
      return (
        <div className="rounded-3xl bg-primary px-8 py-12 text-center text-primary-foreground shadow-lg">
          <Editable as="h2" path="title" value={block.props.title} className="font-display text-3xl font-bold" />
          <Editable as="p" multiline path="text" value={block.props.text} className="mt-3 opacity-90" />
          <div className="mt-6 flex justify-center">
            <Buttons items={block.props.buttons} basePath="buttons" align="center" />
          </div>
        </div>
      );
    case "enquiryForm":
      return (
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <Editable as="h2" path="title" value={block.props.title} className="font-display text-2xl font-bold" />
          <Editable as="p" multiline path="text" value={block.props.text} className="mt-1 text-sm text-muted-foreground" />
          <form className="mt-6 space-y-4">
            <input type="text" placeholder="Your name" className="w-full rounded-xl border border-input bg-background p-3 text-sm" />
            <input type="tel" placeholder="WhatsApp / Phone" className="w-full rounded-xl border border-input bg-background p-3 text-sm" />
            <textarea placeholder="Your message" rows={3} className="w-full rounded-xl border border-input bg-background p-3 text-sm" />
            <button type="button" className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground">
              {block.props.submitLabel || "Send"}
            </button>
          </form>
        </div>
      );
    case "video":
      return (
        <figure>
          {block.props.url ? (
            <div className="aspect-video overflow-hidden rounded-2xl border border-border shadow-md">
              <iframe src={block.props.url} title={block.props.caption || "Video"} className="h-full w-full" allowFullScreen loading="lazy" />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 text-muted-foreground">
              Video Player
            </div>
          )}
          <Editable as="figcaption" path="caption" value={block.props.caption} className="mt-2 text-center text-xs text-muted-foreground" />
        </figure>
      );
    case "spacer":
      return <div style={{ height: `${block.props.size * 1}rem` }} aria-hidden />;
    case "divider":
      return <hr className="border-border" />;
    case "navigation":
      return null;

    // Legacy fallbacks
    case "cinematicHero":
      return (
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <Editable as="span" path="eyebrow" value={block.props.eyebrow} className="block text-xs font-bold uppercase text-primary" />
            <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">
              <Editable path="title" value={block.props.title} /> <span className="text-primary"><Editable path="accent" value={block.props.accent} /></span>
            </h1>
            <Editable as="p" multiline path="text" value={block.props.text} className="mt-4 text-lg text-muted-foreground" />
            <Buttons items={block.props.buttons} basePath="buttons" />
          </div>
          {block.props.image ? <img src={block.props.image} alt="" className="rounded-3xl shadow-lg" /> : null}
        </div>
      );
    case "careJourney":
    case "serviceStory":
    case "trustDossier":
    case "proofReturn":
      return (
        <div>
          <Editable as="span" path="eyebrow" value={block.props.eyebrow} className="block text-xs font-bold uppercase text-primary" />
          <Editable as="h2" path="title" value={block.props.title} className="mt-2 font-display text-3xl font-bold" />
          <Editable as="p" multiline path="text" value={block.props.text} className="mt-2 text-muted-foreground" />
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {block.props.items.map((it, i) => (
              <div key={it.id || i} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <Editable as="h3" path={`items.${i}.title`} value={it.title} className="font-display text-lg font-bold" />
                <Editable as="p" multiline path={`items.${i}.text`} value={it.text} className="mt-2 text-sm text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      );
    case "storyCarousel":
      return <StoryCarousel slides={block.props.items} editing={editing} />;
    case "invoiceExample":
      return <InvoiceExample title={block.props.title} text={block.props.text} rows={block.props.items} />;
    case "serviceFilm":
      return <ServiceFilm eyebrow={block.props.eyebrow} title={block.props.title} text={block.props.text} src={block.props.src} poster={block.props.poster} />;
  }
}

export function RenderBlock({ block }: { block: Block }) {
  return (
    <BlockIdCtx.Provider value={block.id}>
      <Frame block={block}>
        <BlockBody block={block} />
      </Frame>
    </BlockIdCtx.Provider>
  );
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="@container space-y-2">
      {blocks
        .filter((b) => !b.hidden && b.type !== "navigation")
        .map((b) => (
          <RenderBlock key={b.id} block={b} />
        ))}
    </div>
  );
}
