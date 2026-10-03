import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react"
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleCheck,
  ClipboardList,
  Database,
  Factory,
  FileCheck2,
  Gauge,
  HardHat,
  Layers3,
  Menu,
  Package,
  Radio,
  Settings2,
  ShieldCheck,
  Users,
  Warehouse,
  Wrench,
  X,
} from "lucide-react"
import type { Page } from "../types"

interface Props {
  onNavigate: (page: Page) => void
}

type Icon = ElementType

// ─── Mega-menu data ────────────────────────────────────────────────────────
interface MegaMenuItem {
  icon: Icon
  title: string
  description: string
  href: string
}
interface MegaMenuColumn {
  heading: string
  items: MegaMenuItem[]
}
interface MegaMenuFeatured {
  title: string
  subtitle: string
  description: string
  cta: string
  ctaHref: string
}
interface MegaMenuDef {
  columns: MegaMenuColumn[]
  featured: MegaMenuFeatured
}

const megaMenus: Record<string, MegaMenuDef> = {
  Product: {
    columns: [
      {
        heading: "Overview",
        items: [
          {
            icon: Boxes,
            title: "Asset Management",
            description: "Know the condition and history of every critical asset.",
            href: "#modules",
          },
          {
            icon: Wrench,
            title: "Service Management",
            description: "Deliver consistent service from intake to resolution.",
            href: "#modules",
          },
          {
            icon: ClipboardList,
            title: "Work Order Management",
            description: "Plan, assign, and track work with complete clarity.",
            href: "#modules",
          },
          {
            icon: Package,
            title: "Inventory Management",
            description: "Keep essential parts and stock moving efficiently.",
            href: "#modules",
          },
        ],
      },
      {
        heading: "Capabilities",
        items: [
          {
            icon: Settings2,
            title: "Maintenance Management",
            description: "Stay ahead of downtime with proactive maintenance.",
            href: "#modules",
          },
          {
            icon: Users,
            title: "Workforce Management",
            description: "Give every team the context to do their best work.",
            href: "#modules",
          },
          {
            icon: BarChart3,
            title: "Analytics & Reporting",
            description: "Turn operational data into confident decisions.",
            href: "#modules",
          },
          {
            icon: ShieldCheck,
            title: "Audit & Traceability",
            description: "Maintain a complete history of all operational activities.",
            href: "#modules",
          },
        ],
      },
    ],
    featured: {
      title: "FieldOps Nexus Platform",
      subtitle: "Enterprise ERP",
      description: "Connected service, asset, and field operations in one enterprise platform.",
      cta: "Explore Platform",
      ctaHref: "#product",
    },
  },
  Solutions: {
    columns: [
      {
        heading: "By Industry",
        items: [
          {
            icon: Factory,
            title: "Manufacturing",
            description: "Keep production-critical assets and operations moving.",
            href: "#solutions",
          },
          {
            icon: Building2,
            title: "Facilities Management",
            description: "Coordinate spaces, people, and service delivery.",
            href: "#solutions",
          },
          {
            icon: Wrench,
            title: "Service & Maintenance",
            description: "Deliver responsive service wherever work happens.",
            href: "#solutions",
          },
          {
            icon: HardHat,
            title: "Infrastructure",
            description: "Maintain the systems that communities depend on.",
            href: "#solutions",
          },
        ],
      },
      {
        heading: "By Use Case",
        items: [
          {
            icon: Warehouse,
            title: "Enterprise Operations",
            description: "Unify complex operations across your organization.",
            href: "#solutions",
          },
          {
            icon: Gauge,
            title: "SLA Management",
            description: "Monitor and enforce service level agreements at scale.",
            href: "#solutions",
          },
          {
            icon: Layers3,
            title: "Multi-Site Management",
            description: "Bring sites, teams, and structures into one connected view.",
            href: "#solutions",
          },
          {
            icon: Database,
            title: "Connected Data",
            description: "Connect operational information across teams and locations.",
            href: "#solutions",
          },
        ],
      },
    ],
    featured: {
      title: "Built for Complex Operations",
      subtitle: "Enterprise Solutions",
      description: "Purpose-built flexibility for the environments where reliability matters most.",
      cta: "View All Solutions",
      ctaHref: "#solutions",
    },
  },
  Modules: {
    columns: [
      {
        heading: "Core Modules",
        items: [
          {
            icon: Building2,
            title: "Organization Management",
            description: "Bring sites, teams, and structures into one connected view.",
            href: "#modules",
          },
          {
            icon: Boxes,
            title: "Asset Management",
            description: "Know the condition and history of every critical asset.",
            href: "#modules",
          },
          {
            icon: ClipboardList,
            title: "Work Order Management",
            description: "Plan, assign, and track work with complete clarity.",
            href: "#modules",
          },
          {
            icon: FileCheck2,
            title: "Service Requests",
            description: "Structured intake and triage for every service request.",
            href: "#modules",
          },
        ],
      },
      {
        heading: "Operations",
        items: [
          {
            icon: Settings2,
            title: "Maintenance Planning",
            description: "Stay ahead of downtime with proactive maintenance.",
            href: "#modules",
          },
          {
            icon: Package,
            title: "Inventory & Spare Parts",
            description: "Keep essential parts and stock moving efficiently.",
            href: "#modules",
          },
          {
            icon: Radio,
            title: "Technician Dispatch",
            description: "Assign and track technicians in real time.",
            href: "#modules",
          },
          {
            icon: BarChart3,
            title: "Analytics & Reporting",
            description: "Turn operational data into confident decisions.",
            href: "#modules",
          },
        ],
      },
    ],
    featured: {
      title: "Everything Your Enterprise Needs",
      subtitle: "8 Connected Modules",
      description: "Manage your organization's operational lifecycle through connected modules built for modern enterprise teams.",
      cta: "See All Modules",
      ctaHref: "#modules",
    },
  },
}



// All nav items in order
const allNavItems = [
  { label: "Product", hasMega: true, href: "#product" },
  { label: "Solutions", hasMega: true, href: "#solutions" },
  { label: "Modules", hasMega: true, href: "#modules" },
  { label: "Features", hasMega: false, href: "#features" },
  { label: "Resources", hasMega: false, href: "#workflow" },
  { label: "About", hasMega: false, href: "#about" },
]

// For section-active tracking (legacy compat)
const navigation = allNavItems.map(n => ({ label: n.label, href: n.href }))
const modules: {
  title: string
  description: string
  icon: Icon
}[] = [
  {
    title: "Organization Management",
    description: "Bring sites, teams, and structures into one connected view.",
    icon: Building2,
  },
  {
    title: "Asset Management",
    description: "Know the condition and history of every critical asset.",
    icon: Boxes,
  },
  {
    title: "Service Management",
    description: "Deliver consistent service from intake to resolution.",
    icon: Wrench,
  },
  {
    title: "Work Order Management",
    description: "Plan, assign, and track work with complete clarity.",
    icon: ClipboardList,
  },
  {
    title: "Inventory Management",
    description: "Keep essential parts and stock moving efficiently.",
    icon: Package,
  },
  {
    title: "Workforce Management",
    description: "Give every team the context to do their best work.",
    icon: Users,
  },
  {
    title: "Maintenance Management",
    description: "Stay ahead of downtime with proactive maintenance.",
    icon: Settings2,
  },
  {
    title: "Analytics & Reporting",
    description: "Turn operational data into confident decisions.",
    icon: BarChart3,
  },
]
const steps: {
  title: string
  icon: Icon
}[] = [
  { title: "Request Raised", icon: FileCheck2 },
  { title: "Triage", icon: Radio },
  { title: "Work Order", icon: ClipboardList },
  { title: "Technician Assignment", icon: Users },
  { title: "Execution", icon: Wrench },
  { title: "Supervisor Approval", icon: ShieldCheck },
  { title: "Closure", icon: CircleCheck },
]
const benefits: {
  title: string
  description: string
  icon: Icon
  number: string
}[] = [
  {
    title: "Connected Data",
    description: "Connect operational information across teams and locations.",
    icon: Database,
    number: "01",
  },
  {
    title: "Smarter Workflows",
    description:
      "Reduce manual processes through structured workflows and automation.",
    icon: Layers3,
    number: "02",
  },
  {
    title: "Operational Visibility",
    description:
      "Understand what is happening across assets, teams, and service operations.",
    icon: Gauge,
    number: "03",
  },
  {
    title: "Audit & Traceability",
    description:
      "Maintain a complete history of operational activities and decisions.",
    icon: ShieldCheck,
    number: "04",
  },
]
const industries: {
  title: string
  description: string
  icon: Icon
  image: string
}[] = [
  {
    title: "Manufacturing",
    description: "Keep production-critical assets and operations moving.",
    icon: Factory,
    image:
      "https://images.unsplash.com/photo-1568561586426-10f4ce2dafc5?w=900&q=80",
  },
  {
    title: "Facilities Management",
    description: "Coordinate spaces, people, and service delivery.",
    icon: Building2,
    image:
      "https://images.unsplash.com/photo-1771530789155-b1f03fbf82b5?w=900&q=80",
  },
  {
    title: "Service & Maintenance",
    description: "Deliver responsive service wherever work happens.",
    icon: Wrench,
    image:
      "https://images.unsplash.com/photo-1742967421528-a4c50b314efb?w=900&q=80",
  },
  {
    title: "Infrastructure",
    description: "Maintain the systems that communities depend on.",
    icon: HardHat,
    image:
      "https://images.unsplash.com/photo-1707796791706-51d942b879d9?w=900&q=80",
  },
  {
    title: "Enterprise Operations",
    description: "Unify complex operations across your organization.",
    icon: Warehouse,
    image:
      "https://images.unsplash.com/photo-1513257805917-a0da1146eb15?w=900&q=80",
  },
]
const demoLink =
  "mailto:hello@fieldopsnexus.com?subject=FieldOps%20Nexus%20demo%20request"
const contactLink =
  "mailto:hello@fieldopsnexus.com?subject=FieldOps%20Nexus%20inquiry"
const careersLink =
  "mailto:hello@fieldopsnexus.com?subject=FieldOps%20Nexus%20careers"
const previewViews = {
  Dashboard: {
    heading: "Operations at a glance",
    metrics: [
      ["Active assets", "2,846", "Across sites", Boxes],
      ["Open work orders", "128", "Awaiting action", ClipboardList],
      ["SLA performance", "98.2%", "On target", Gauge],
    ],
    chart: "Work order activity",
    status: "Asset status",
    summary: "Work order summary",
    summaryDetail: "In progress",
    activity: ["Inspection completed", "Work order assigned"],
  },
  Assets: {
    heading: "Asset overview",
    metrics: [
      ["Registered assets", "2,846", "Across sites", Boxes],
      ["Operational", "92%", "Current status", Gauge],
      ["Under maintenance", "64", "Scheduled work", Settings2],
    ],
    chart: "Asset activity",
    status: "Asset status",
    summary: "Maintenance summary",
    summaryDetail: "In progress",
    activity: ["Asset inspected", "Condition updated"],
  },
  "Work Orders": {
    heading: "Work order overview",
    metrics: [
      ["Open work orders", "128", "Awaiting action", ClipboardList],
      ["In progress", "64", "Assigned work", Wrench],
      ["SLA performance", "98.2%", "On target", Gauge],
    ],
    chart: "Work order activity",
    status: "Work status",
    summary: "Work order summary",
    summaryDetail: "In progress",
    activity: ["Work order assigned", "Supervisor review"],
  },
  "Service Requests": {
    heading: "Service request overview",
    metrics: [
      ["Requests received", "128", "Across sites", FileCheck2],
      ["In triage", "64", "Needs review", Radio],
      ["SLA performance", "98.2%", "On target", Gauge],
    ],
    chart: "Request activity",
    status: "Request status",
    summary: "Service summary",
    summaryDetail: "In progress",
    activity: ["Request received", "Triage completed"],
  },
  Maintenance: {
    heading: "Maintenance overview",
    metrics: [
      ["Maintained assets", "2,846", "Across sites", Boxes],
      ["Scheduled work", "128", "Upcoming", Settings2],
      ["Completed", "92%", "On schedule", CircleCheck],
    ],
    chart: "Maintenance activity",
    status: "Plan status",
    summary: "Schedule summary",
    summaryDetail: "In progress",
    activity: ["Inspection completed", "Plan reviewed"],
  },
} as const
type PreviewView = keyof typeof previewViews

function useInView() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (!("IntersectionObserver" in window)) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return { ref, visible }
}

function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "left" | "scale"
}) {
  const { ref, visible } = useInView()
  return (
    <div
      ref={ref}
      className={`landing-reveal landing-reveal-${direction} ${
        visible ? "is-visible" : ""
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap">
      <span className="flex size-9 items-center justify-center rounded-lg bg-gold-500 text-navy-900">
        <Activity size={19} strokeWidth={2.4} />
      </span>
      <span
        className={`text-lg font-extrabold tracking-tight ${
          light ? "text-white" : "text-navy-800"
        }`}
      >
        FieldOps <span className="text-gold-500">Nexus</span>
      </span>
    </span>
  )
}
function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode
  light?: boolean
}) {
  return (
    <span
      className={`mb-5 inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.18em] ${
        light ? "text-gold-400" : "text-gold-600"
      }`}
    >
      <span className="h-px w-5 bg-current" />
      {children}
    </span>
  )
}
function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string
  title: string
  description: string
  centered?: boolean
}) {
  return (
    <Reveal
      className={`mb-12 lg:mb-16 ${
        centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"
      }`}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-3xl font-bold leading-tight tracking-tight text-navy-800 sm:text-4xl lg:text-[44px]">
        {title}
      </h2>
      <p className="mt-5 text-base leading-relaxed text-text-secondary lg:text-lg">
        {description}
      </p>
    </Reveal>
  )
}
function DashboardPreview({ view = "Dashboard" }: { view?: PreviewView }) {
  const content = previewViews[view]
  return (
    <div
      aria-label={`Illustrative FieldOps Nexus ${view} preview with sample data`}
      role="img"
      className="w-full overflow-hidden rounded-xl border border-border bg-white text-left shadow-2xl shadow-navy-950/20"
    >
      <div className="flex h-10 items-center justify-between border-b border-border bg-white px-4 sm:px-5">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
          <span className="ml-3 text-[10px] font-bold tracking-tight text-navy-800">
            FieldOps <span className="text-gold-600">Nexus</span>
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-[9px] text-text-secondary">
          <span className="size-1.5 rounded-full bg-gold-500" /> Product preview
        </span>
      </div>
      <div className="bg-surface p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-widest text-text-secondary">
              Workspace / {view}
            </p>
            <p className="mt-1 text-sm font-bold text-navy-800 sm:text-base">
              {content.heading}
            </p>
          </div>
          <span className="rounded-md border border-border bg-white px-2 py-1 text-[9px] text-text-secondary">
            Sample data
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {content.metrics.map(([label, value, note, IconComponent]) => {
            const MetricIcon = IconComponent as Icon
            return (
              <div
                key={label as string}
                className="min-w-0 rounded-lg border border-border bg-white p-2.5 sm:p-4"
              >
                <div className="mb-3 flex items-center justify-between text-text-secondary">
                  <span className="truncate text-[8px] font-medium sm:text-[10px]">
                    {label as string}
                  </span>
                  <MetricIcon
                    size={13}
                    className="hidden shrink-0 text-gold-600 sm:block"
                  />
                </div>
                <p className="text-lg font-bold tracking-tight text-navy-800 sm:text-2xl">
                  {value as string}
                </p>
                <p className="mt-1 truncate text-[8px] font-medium text-gold-600 sm:text-[9px]">
                  {note as string}
                </p>
              </div>
            )
          })}
        </div>
        <div className="mt-3 grid grid-cols-[1.35fr_1fr] gap-2 sm:gap-3">
          <div className="rounded-lg border border-border bg-white p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-navy-800 sm:text-xs">
                {content.chart}
              </span>
              <span className="text-[8px] text-text-secondary">
                Last 7 days
              </span>
            </div>
            <div className="mt-5 flex h-20 items-end gap-1.5 sm:h-28 sm:gap-2">
              {[38, 53, 44, 72, 60, 86, 68, 91, 76, 100, 82, 94].map(
                (height, i) => (
                  <span
                    key={i}
                    className={`min-w-0 flex-1 rounded-t-sm ${
                      i === 9 ? "bg-gold-500" : "bg-navy-800/15"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                ),
              )}
            </div>
            <div className="mt-2 flex justify-between text-[8px] text-text-secondary">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-white p-3 sm:p-4">
            <span className="text-[10px] font-bold text-navy-800 sm:text-xs">
              {content.status}
            </span>
            <div className="mx-auto my-3 flex size-16 items-center justify-center rounded-full border-[7px] border-navy-800 border-r-gold-500 border-b-gold-500 sm:size-24 sm:border-[10px]">
              <span className="text-xs font-bold text-navy-800 sm:text-lg">
                92%
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-[8px] text-text-secondary">
              <span className="size-1.5 rounded-full bg-navy-800" /> Operational{" "}
              <span className="size-1.5 rounded-full bg-gold-500" /> Attention
            </div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-3">
          <div className="rounded-lg border border-border bg-white p-3">
            <p className="mb-2 text-[10px] font-bold text-navy-800 sm:text-xs">
              {content.summary}
            </p>
            <div className="flex justify-between text-[9px] text-text-secondary">
              <span>{content.summaryDetail}</span>
              <span className="font-bold text-navy-800">64</span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-surface-2">
              <div className="h-full w-2/3 rounded-full bg-gold-500" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-white p-3">
            <p className="mb-2 text-[10px] font-bold text-navy-800 sm:text-xs">
              Recent activity
            </p>
            <p className="truncate text-[9px] text-text-secondary">
              <span className="mr-1 text-gold-600">●</span>{" "}
              {content.activity[0]}
            </p>
            <p className="mt-1 truncate text-[9px] text-text-secondary">
              <span className="mr-1 text-gold-600">●</span>{" "}
              {content.activity[1]}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Mega Menu Panel ─────────────────────────────────────────────────────────
function MegaMenuPanel({
  menuKey,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: {
  menuKey: string
  onClose: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const def = megaMenus[menuKey]
  if (!def) return null
  return (
    <div
      role="dialog"
      aria-label={`${menuKey} mega menu`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="mega-menu-panel absolute left-0 right-0 top-full z-40 border-b border-border bg-white shadow-[0_16px_48px_-8px_rgba(11,31,58,0.14)]"
    >
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr_280px]">
          {/* Columns */}
          {def.columns.map((col, ci) => (
            <div key={ci}>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600">
                {col.heading}
              </p>
              <ul className="space-y-1" role="list">
                {col.items.map((item) => {
                  const ItemIcon = item.icon as Icon
                  return (
                    <li key={item.title}>
                      <a
                        href={item.href}
                        onClick={onClose}
                        className="mega-menu-item group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 hover:bg-surface"
                      >
                        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white text-text-secondary shadow-sm transition-colors duration-150 group-hover:border-gold-500/40 group-hover:bg-gold-50 group-hover:text-gold-600">
                          <ItemIcon size={17} strokeWidth={1.7} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[13.5px] font-semibold leading-snug text-navy-800 group-hover:text-navy-900">
                            {item.title}
                          </span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-text-secondary">
                            {item.description}
                          </span>
                        </span>
                        <span className="ml-auto mt-1 shrink-0 text-text-secondary opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100">
                          <ArrowRight size={13} />
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}

          {/* Featured */}
          <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5">
            <div>
              <span className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600">
                <span className="h-px w-4 bg-gold-500" />
                {def.featured.subtitle}
              </span>
              <h3 className="mt-2 text-base font-bold leading-snug text-navy-800">
                {def.featured.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {def.featured.description}
              </p>
            </div>
            {/* Mini platform preview */}
            <div className="my-4 overflow-hidden rounded-lg border border-border bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-border" />
                <span className="size-1.5 rounded-full bg-border" />
                <span className="size-1.5 rounded-full bg-border" />
                <span className="ml-2 text-[9px] font-bold text-navy-800">
                  FieldOps <span className="text-gold-600">Nexus</span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[["Assets", "2,846"], ["Open WO", "128"], ["SLA", "98%"]].map(([lbl, val]) => (
                  <div key={lbl} className="rounded bg-surface p-1.5 text-center">
                    <p className="text-[8px] text-text-secondary">{lbl}</p>
                    <p className="text-[10px] font-bold text-navy-800">{val}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex h-8 items-end gap-0.5">
                {[40, 55, 45, 70, 60, 85, 65].map((h, i) => (
                  <span
                    key={i}
                    className={`flex-1 rounded-t-sm ${i === 5 ? "bg-gold-500" : "bg-navy-800/15"}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <a
              href={def.featured.ctaHref}
              onClick={onClose}
              className="landing-button inline-flex items-center justify-center gap-2 rounded-lg bg-navy-800 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-navy-700"
            >
              {def.featured.cta} <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage({ onNavigate }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [previewView, setPreviewView] = useState<PreviewView>("Dashboard")
  const [activeSection, setActiveSection] = useState("")
  const [activeMega, setActiveMega] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const headerRef = useRef<HTMLElement>(null)
  // Timer ref for the delayed close — prevents flicker when cursor moves
  // from a trigger button into the mega panel (or between triggers).
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const workflow = useInView()

  // Section scroll tracking
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`)
        })
      },
      { rootMargin: "-25% 0px -60% 0px" },
    )
    navigation.forEach(({ href }) => {
      const section = document.querySelector(href)
      if (section) observer.observe(section)
    })
    return () => observer.disconnect()
  }, [])

  // ── Hover helpers ──────────────────────────────────────────────────────────
  // Cancel any pending close so moving cursor into the panel keeps it open.
  const cancelClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  // Open a specific menu immediately (also cancels any pending close).
  const openMega = useCallback((label: string) => {
    cancelClose()
    setActiveMega(label)
  }, [cancelClose])

  // Schedule a close after a short delay so the cursor can travel from the
  // trigger into the mega panel without the menu disappearing mid-flight.
  const scheduleClose = useCallback(() => {
    cancelClose()
    closeTimerRef.current = setTimeout(() => {
      setActiveMega(null)
      closeTimerRef.current = null
    }, 200)
  }, [cancelClose])

  // Hard close (ESC, link click, etc.) — immediate, no delay.
  const closeMega = useCallback(() => {
    cancelClose()
    setActiveMega(null)
  }, [cancelClose])

  // ESC key support
  useEffect(() => {
    if (!activeMega) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMega()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [activeMega, closeMega])

  // Clean up timer on unmount
  useEffect(() => () => { if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current) }, [])

  return (
    <div className="min-w-0 overflow-x-hidden bg-white font-sans text-text-primary scroll-smooth">
      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-border/70 bg-white/95 backdrop-blur-lg"
      >
        <div className="relative mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
          <a href="#top" aria-label="FieldOps Nexus home" onClick={closeMega}>
            <Brand />
          </a>

          {/* ── Desktop nav ── */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 xl:flex"
          >
            {allNavItems.map((item) => {
              const isActive = activeSection === item.href
              const isMegaOpen = activeMega === item.label
              if (item.hasMega) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    aria-expanded={isMegaOpen}
                    aria-haspopup="dialog"
                    // Hover → open; hover-leave → schedule close (cursor may travel into panel)
                    onMouseEnter={() => openMega(item.label)}
                    onMouseLeave={scheduleClose}
                    // Keyboard / click also works for accessibility
                    onClick={() => setActiveMega(prev => prev === item.label ? null : item.label)}
                    className={`mega-trigger inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${
                      isMegaOpen || isActive
                        ? "bg-surface text-navy-800"
                        : "text-text-secondary hover:bg-surface hover:text-navy-800"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        isMegaOpen ? "rotate-180 text-gold-600" : ""
                      }`}
                    />
                    {/* Gold underline for active section */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500" />
                    )}
                  </button>
                )
              }
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={closeMega}
                  aria-current={isActive ? "location" : undefined}
                  className={`landing-nav-link rounded-md px-3 py-2 text-[13px] font-medium transition-colors hover:bg-surface hover:text-navy-800 ${
                    isActive ? "is-active text-navy-800" : "text-text-secondary"
                  }`}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>

          <div className="hidden items-center gap-5 xl:flex">
            <button
              type="button"
              onClick={() => { closeMega(); onNavigate("login") }}
              className="text-[13px] font-semibold text-navy-800 hover:text-gold-600"
            >
              Sign In
            </button>
            <a
              href={demoLink}
              onClick={closeMega}
              className="landing-button inline-flex items-center gap-2 rounded-lg bg-navy-800 px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-navy-700"
            >
              Get Started <ArrowUpRight size={15} />
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-lg text-navy-800 xl:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>

        {/* ── Mega menu panel (desktop) — hover-driven ── */}
        {activeMega && megaMenus[activeMega] && (
          <MegaMenuPanel
            menuKey={activeMega}
            onClose={closeMega}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          />
        )}

        {/* ── Mobile nav ── */}
        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="border-t border-border bg-white px-5 pb-6 pt-3 shadow-xl xl:hidden"
          >
            {allNavItems.map((item) => (
              <div key={item.label}>
                {item.hasMega ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileExpanded((prev) =>
                          prev === item.label ? null : item.label
                        )
                      }
                      className="flex w-full items-center justify-between border-b border-border/60 py-3 text-sm font-medium text-navy-800"
                      aria-expanded={mobileExpanded === item.label}
                    >
                      {item.label}
                      <ChevronDown
                        size={15}
                        className={`transition-transform duration-200 ${
                          mobileExpanded === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileExpanded === item.label && megaMenus[item.label] && (
                      <div className="mb-2 ml-2 border-l-2 border-gold-500/30 pl-4">
                        {megaMenus[item.label].columns.map((col, ci) => (
                          <div key={ci} className="mt-3">
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gold-600">
                              {col.heading}
                            </p>
                            {col.items.map((mItem) => (
                              <a
                                key={mItem.title}
                                href={mItem.href}
                                onClick={() => {
                                  setMenuOpen(false)
                                  setMobileExpanded(null)
                                }}
                                className="flex items-center gap-2 py-1.5 text-sm text-navy-800 hover:text-gold-600"
                              >
                                <span className="text-text-secondary">
                                  <ArrowRight size={12} />
                                </span>
                                {mItem.title}
                              </a>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-border/60 py-3 text-sm font-medium text-navy-800"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onNavigate("login")
                }}
                className="flex-1 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-navy-800"
              >
                Sign In
              </button>
              <a
                href={demoLink}
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-lg bg-navy-800 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Get Started
              </a>
            </div>
          </nav>
        )}
      </header>

      <main id="top">
        <section
          className="relative isolate overflow-hidden bg-navy-900 text-white"
          aria-labelledby="hero-title"
        >
          <div className="pointer-events-none absolute -right-40 -top-64 size-[700px] rounded-full border border-white/5" />
          <div className="pointer-events-none absolute -right-24 -top-48 size-[550px] rounded-full border border-white/5" />
          <div className="pointer-events-none absolute -bottom-60 left-1/4 size-[500px] rounded-full bg-navy-500/15 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-20 lg:min-h-[690px] lg:grid-cols-[.94fr_1.06fr] lg:gap-10 lg:px-8 lg:py-24">
            <div className="max-w-xl">
              <div className="landing-hero-enter">
                <Eyebrow light>Enterprise operations platform</Eyebrow>
              </div>
              <h1
                id="hero-title"
                className="landing-hero-enter text-[clamp(2.7rem,5vw,4.6rem)] font-bold leading-[1.08] tracking-tight"
              >
                Enterprise Operations.
                <br />
                <span className="text-gold-400">Connected.</span> Simplified.
              </h1>
              <p className="landing-hero-enter landing-hero-delay-1 mt-7 max-w-lg text-base leading-relaxed text-white/65 lg:text-lg">
                A unified ERP platform designed to connect organizations,
                assets, people, service operations, and business workflows in
                one centralized system.
              </p>
              <div className="landing-hero-enter landing-hero-delay-2 mt-9 flex flex-wrap gap-3">
                <a
                  href="#modules"
                  className="landing-button inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 text-sm font-bold text-navy-900 transition-colors hover:bg-gold-400"
                >
                  Explore Platform <ArrowRight size={16} />
                </a>
                <a
                  href={demoLink}
                  className="landing-button inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Request a Demo <ArrowUpRight size={16} />
                </a>
              </div>
              <div className="landing-hero-enter landing-hero-delay-2 mt-12 flex items-center gap-3 border-t border-white/10 pt-6 text-xs text-white/45">
                <span className="flex size-7 items-center justify-center rounded-md border border-gold-500/30 text-gold-400">
                  <Check size={15} />
                </span>{" "}
                One connected view of your entire operation
              </div>
            </div>
            <div className="landing-hero-enter landing-hero-delay-3 relative mx-auto w-full max-w-[610px] lg:translate-x-5">
              <div className="absolute -inset-5 rounded-3xl bg-gold-500/10 blur-3xl" />
              <div className="relative rotate-[1deg] shadow-2xl shadow-black/30 transition-transform duration-500 hover:rotate-0">
                <DashboardPreview />
              </div>
              <div className="absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-xl sm:flex">
                <span className="flex size-9 items-center justify-center rounded-lg bg-gold-50 text-gold-600">
                  <CheckCircle2 size={19} />
                </span>
                <span>
                  <strong className="block text-xs text-navy-800">
                    Everything in sync
                  </strong>
                  <small className="text-[10px] text-text-secondary">
                    Across teams, assets & sites
                  </small>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="scroll-mt-24 border-b border-border bg-white py-20 lg:py-24"
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
              <div>
                <Eyebrow>The connected advantage</Eyebrow>
                <h2 className="text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
                  One Platform.
                  <br />
                  Every Operation.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-relaxed text-text-secondary lg:text-lg">
                Bring your organization's operational processes together through
                one connected enterprise platform.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [Building2, "Centralized Operations"],
                [Activity, "Real-Time Visibility"],
                [Settings2, "Workflow Automation"],
                [ShieldCheck, "Complete Traceability"],
              ].map(([IconComponent, label], i) => {
                const HighlightIcon = IconComponent as Icon
                return (
                  <Reveal delay={i * 75} key={label as string}>
                    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface/50 p-5">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white text-gold-600 shadow-sm">
                        <HighlightIcon size={21} strokeWidth={1.7} />
                      </span>
                      <span className="text-sm font-semibold text-navy-800">
                        {label as string}
                      </span>
                    </div>
                  </Reveal>
                )
              })}
            </div>
            <Reveal className="mt-12 border-t border-border pt-7">
              <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-text-secondary">
                Connected across your operation
              </p>
              <div className="flex flex-wrap gap-x-7 gap-y-4 text-sm font-medium text-navy-800">
                {[
                  "Organizations",
                  "Sites",
                  "Assets",
                  "Work Orders",
                  "Service Requests",
                  "Maintenance",
                  "Inventory",
                  "Reports",
                ].map((capability) => (
                  <span
                    key={capability}
                    className="inline-flex items-center gap-2"
                  >
                    <span className="size-1.5 rounded-full bg-gold-500" />
                    {capability}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section
          id="modules"
          className="scroll-mt-24 bg-surface py-20 lg:py-28"
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionHeading
              eyebrow="The platform"
              title="Everything Your Enterprise Needs"
              description="Manage your organization's operational lifecycle through connected modules built for modern enterprise teams."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {modules.map((module, i) => (
                <Reveal
                  key={module.title}
                  delay={(i % 4) * 70}
                  className="h-full"
                >
                  <a
                    href="#product"
                    className="group flex h-full min-h-[238px] flex-col rounded-xl border border-border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-lg hover:shadow-navy-800/5"
                  >
                    <div className="mb-7 flex items-start justify-between">
                      <span className="flex size-12 items-center justify-center rounded-lg bg-gold-50 text-gold-600 transition-transform duration-300 group-hover:-translate-y-0.5">
                        <module.icon size={23} strokeWidth={1.7} />
                      </span>
                      <span className="text-xs font-medium text-text-secondary/50">
                        0{i + 1}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-navy-800">
                      {module.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                      {module.description}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-xs font-bold text-gold-600">
                      View Module{" "}
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="scroll-mt-24 bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionHeading
              eyebrow="How it works"
              title="From Request to Resolution"
              description="A clear, connected path from the first service request to the final sign-off. Every handoff accounted for."
              centered
            />
            <div
              ref={workflow.ref}
              className={`relative grid gap-0 pl-2 md:grid-cols-7 md:pl-0 ${
                workflow.visible ? "is-visible" : ""
              }`}
            >
              <div className="landing-timeline-line absolute bottom-10 left-[29px] top-10 w-px bg-border md:bottom-auto md:left-[7%] md:right-[7%] md:top-8 md:h-px md:w-auto" />
              {steps.map((step, i) => (
                <Reveal
                  key={step.title}
                  delay={i * 75}
                  className="relative flex items-center gap-5 py-3 md:flex-col md:gap-0 md:py-0 md:text-center"
                >
                  <span
                    className={`relative z-10 flex size-14 shrink-0 items-center justify-center rounded-xl border shadow-sm md:mx-auto md:size-16 ${
                      i === 0 || i === 6
                        ? "border-navy-800 bg-navy-800 text-gold-400"
                        : "border-border bg-white text-navy-800"
                    }`}
                  >
                    <step.icon size={23} strokeWidth={1.7} />
                  </span>
                  <div className="md:mt-6">
                    <span className="text-[10px] font-bold tracking-widest text-gold-600">
                      0{i + 1}
                    </span>
                    <h3 className="mt-1 max-w-[150px] text-sm font-semibold leading-snug text-navy-800 md:mx-auto">
                      {step.title}
                    </h3>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mx-auto mt-14 max-w-max rounded-full bg-gold-50 px-5 py-2 text-xs font-semibold text-gold-600">
              One continuous, traceable service lifecycle
            </div>
          </div>
        </section>

        <section
          id="product"
          className="scroll-mt-24 overflow-hidden bg-navy-800 py-20 text-white lg:py-28"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[.75fr_1.25fr] lg:gap-16 lg:px-8">
            <Reveal direction="left">
              <Eyebrow light>The product experience</Eyebrow>
              <h2 className="max-w-md text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[44px]">
                Complete Operational Visibility
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/65">
                Monitor assets, work orders, service requests, workforce
                activity, SLA performance, and operational metrics from one
                platform. The full picture, without the complexity.
              </p>
              <div className="mt-9 space-y-4 text-sm text-white/80">
                {[
                  "See what matters, as it happens",
                  "Keep every team working from the same picture",
                  "Move from insight to action with confidence",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-3">
                    <span className="flex size-5 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                      <Check size={12} />
                    </span>
                    {text}
                  </div>
                ))}
              </div>
              <a
                href="#modules"
                className="mt-10 inline-flex items-center gap-2 border-b border-gold-500 pb-2 text-sm font-bold text-gold-400 transition-all hover:gap-3"
              >
                Explore the Platform <ArrowRight size={17} />
              </a>
            </Reveal>
            <Reveal direction="scale" className="relative">
              <div className="absolute -inset-8 rounded-full bg-white/5 blur-3xl" />
              <div className="relative lg:translate-y-1">
                <div
                  aria-label="Explore product previews"
                  className="mb-4 flex gap-1 overflow-x-auto rounded-lg border border-white/15 bg-white/5 p-1.5"
                >
                  {(Object.keys(previewViews) as PreviewView[]).map((view) => (
                    <button
                      key={view}
                      type="button"
                      aria-pressed={previewView === view}
                      onClick={() => setPreviewView(view)}
                      className={`shrink-0 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                        previewView === view
                          ? "bg-white text-navy-800 shadow-sm"
                          : "text-white/65 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
                <DashboardPreview view={previewView} />
              </div>
            </Reveal>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionHeading
              eyebrow="Why FieldOps Nexus"
              title="Built for Modern Enterprise Operations"
              description="The intelligence and structure to make complex operations feel effortless."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {benefits.map((item, i) => (
                <Reveal
                  key={item.title}
                  delay={(i % 2) * 90}
                  className="h-full"
                >
                  <div className="group flex h-full min-h-[210px] flex-col justify-between rounded-xl border border-border bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-lg hover:shadow-navy-800/5 sm:p-8">
                    <div className="flex items-start justify-between">
                      <span className="flex size-12 items-center justify-center rounded-lg bg-surface text-gold-600">
                        <item.icon size={23} strokeWidth={1.7} />
                      </span>
                      <span className="text-xs font-medium text-text-secondary/50">
                        {item.number} / 04
                      </span>
                    </div>
                    <div className="mt-7">
                      <h3 className="text-xl font-bold text-navy-800">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          id="solutions"
          className="scroll-mt-24 bg-surface py-20 lg:py-28"
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionHeading
              eyebrow="Industries & solutions"
              title="Designed for Complex Operations"
              description="Purpose-built flexibility for the environments where reliability matters most."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {industries.map((industry, i) => (
                <Reveal
                  key={industry.title}
                  delay={i * 65}
                  className="h-full"
                  direction="scale"
                >
                  <article className="group h-full overflow-hidden rounded-xl border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-xl hover:shadow-navy-800/10">
                    <div className="relative h-40 overflow-hidden bg-navy-800">
                      <img
                        src={industry.image}
                        alt={`${industry.title} operations`}
                        loading="lazy"
                        className="h-full w-full object-cover opacity-75 transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/55 to-transparent" />
                      <span className="absolute bottom-4 left-4 flex size-9 items-center justify-center rounded-lg border border-white/30 bg-navy-900/50 text-white backdrop-blur-sm">
                        <industry.icon size={19} strokeWidth={1.7} />
                      </span>
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] font-bold tracking-widest text-gold-600">
                        0{i + 1}
                      </span>
                      <h3 className="mt-2 text-base font-bold text-navy-800">
                        {industry.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                        {industry.description}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-navy-900 py-20 text-white lg:py-28">
          <div className="pointer-events-none absolute -right-32 -top-60 size-[550px] rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-14 -top-44 size-[430px] rounded-full border border-white/10" />
          <Reveal className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
            <Eyebrow light>Let's move forward</Eyebrow>
            <h2 className="mx-auto max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Bring Your Operations Together
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/65 lg:text-lg">
              Connect assets, people, service activities, and operational
              workflows through one centralized platform.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a
                href={demoLink}
                className="landing-button inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 text-sm font-bold text-navy-900 transition-colors hover:bg-gold-400"
              >
                Request a Demo <ArrowUpRight size={16} />
              </a>
              <a
                href={contactLink}
                className="landing-button inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Contact Us <ArrowRight size={16} />
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="bg-navy-950 text-white">
        <div className="mx-auto max-w-7xl px-5 pb-8 pt-16 lg:px-8">
          <div className="grid gap-12 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-[2fr_repeat(4,1fr)]">
            <div>
              <Brand light />
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/45">
                The connected enterprise platform for assets, service,
                maintenance, and the people behind it all.
              </p>
            </div>
            {[
              {
                title: "Platform",
                links: [
                  ["Organization", "#modules"],
                  ["Assets", "#modules"],
                  ["Service", "#modules"],
                  ["Work Orders", "#modules"],
                  ["Analytics", "#modules"],
                ],
              },
              {
                title: "Solutions",
                links: [
                  ["Enterprise", "#solutions"],
                  ["Manufacturing", "#solutions"],
                  ["Facilities", "#solutions"],
                  ["Maintenance", "#solutions"],
                ],
              },
              {
                title: "Company",
                links: [
                  ["About", "#about"],
                  ["Contact", contactLink],
                  ["Careers", careersLink],
                  ["Resources", "#workflow"],
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-white/80">
                  {col.title}
                </h3>
                <div className="flex flex-col gap-3">
                  {col.links.map(([label, href]) => (
                    <a
                      key={label}
                      href={href}
                      className="w-fit text-sm text-white/45 transition-colors hover:text-gold-400"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-white/80">
                Contact
              </h3>
              <div className="flex flex-col gap-3 text-sm text-white/45">
                <a href={contactLink} className="hover:text-gold-400">
                  Email our team
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 pt-7 text-xs text-white/35 sm:flex-row">
            <span>© 2026 FieldOps Nexus. All rights reserved.</span>
            <span>Built for the work that matters.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
