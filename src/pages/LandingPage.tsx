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
  ChevronDown,
  CircleCheck,
  ClipboardList,
  Database,
  Factory,
  FileCheck2,
  Gauge,
  HardHat,
  Layers3,
  MapPin,
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
import MarketingPages from "./MarketingPages"
import fieldNexusVideo from "../assets/Fieldopusneuxs2.mp4"
import serviceRequestInspection from "../assets/left.jpg"
import fieldOpsCommandDashboard from "../assets/center.jpg"
import workOrderSupervisorReview from "../assets/right.jpg"
import workflowServiceRequests from "../assets/workflow-service-requests.jpg"
import workflowAssetManagement from "../assets/workflow-asset-management.jpg"
import workflowFieldOperations from "../assets/workflow-field-operations.jpg"
import workflowInventoryManagement from "../assets/workflow-inventory-management.jpg"
import workflowApproval from "../assets/workflow-approval.jpg"
import workflowInsights from "../assets/workflow-insights.jpg"
import connectedDataImg from "../assets/connected-data.jpg"
import smarterWorkflowsImg from "../assets/smarter-workflows.jpg"
import operationalVisibilityImg from "../assets/operational-visibility.jpg"
import auditTraceabilityImg from "../assets/audit-traceability.jpg"
import moduleOrgImg from "../assets/module-organization.jpg"
import moduleAssetImg from "../assets/module-assets.jpg"
import moduleServiceImg from "../assets/module-service.jpg"
import moduleWorkOrdersImg from "../assets/module-work-orders.jpg"
import moduleInventoryImg from "../assets/module-inventory.jpg"
import moduleWorkforceImg from "../assets/module-workforce.jpg"
import moduleMaintenanceImg from "../assets/module-maintenance.jpg"
import moduleAnalyticsImg from "../assets/module-analytics.jpg"
import NexusScrollFlow from "../components/NexusScrollFlow"


interface Props {
  onNavigate: (page: Page) => void
  page?: Page
}

type Icon = ElementType

interface ConnectedOpItem {
  title: string
  icon: Icon
  desc: string
}

const connectedOperations: ConnectedOpItem[] = [
  {
    title: "Organizations",
    icon: Building2,
    desc: "Enterprise hierarchy & business units",
  },
  {
    title: "Sites",
    icon: MapPin,
    desc: "Multi-facility & plant locations",
  },
  {
    title: "Assets",
    icon: Boxes,
    desc: "Equipment registry & lifecycle",
  },
  {
    title: "Work Orders",
    icon: ClipboardList,
    desc: "Job dispatch & execution tracking",
  },
  {
    title: "Service Requests",
    icon: Settings2,
    desc: "Intake routing & SLA triage",
  },
  {
    title: "Maintenance",
    icon: Wrench,
    desc: "Preventive & corrective schedules",
  },
  {
    title: "Inventory",
    icon: Package,
    desc: "Parts catalog & stock management",
  },
  {
    title: "Reports",
    icon: BarChart3,
    desc: "Operational BI & audit analytics",
  },
]

// ─── Mega-menu data ────────────────────────────────────────────────────────
interface MegaMenuItem {
  icon: Icon
  title: string
  description: string
  href: string
  page?: Page
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
  page?: Page
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
            href: "/products/asset-management",
            page: "asset-management",
          },
          {
            icon: Wrench,
            title: "Service Management",
            description: "Deliver consistent service from intake to resolution.",
            href: "/products/service-management",
            page: "service-management",
          },
          {
            icon: ClipboardList,
            title: "Work Order Management",
            description: "Plan, assign, and track work with complete clarity.",
            href: "/products/work-order-management",
            page: "work-order-management",
          },
          {
            icon: Package,
            title: "Inventory Management",
            description: "Keep essential parts and stock moving efficiently.",
            href: "/products/inventory-management",
            page: "inventory-management",
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
            href: "/products/maintenance-management",
            page: "maintenance-management",
          },
          {
            icon: Users,
            title: "Workforce Management",
            description: "Give every team the context to do their best work.",
            href: "/products/workforce-management",
            page: "workforce-management",
          },
          {
            icon: BarChart3,
            title: "Analytics & Reporting",
            description: "Turn operational data into confident decisions.",
            href: "/products/analytics-reporting",
            page: "analytics-reporting",
          },
          {
            icon: ShieldCheck,
            title: "Audit & Traceability",
            description: "Maintain a complete history of all operational activities.",
            href: "/products/audit-traceability",
            page: "audit-traceability",
          },
        ],
      },
    ],
    featured: {
      title: "FieldOps Nexus Platform",
      subtitle: "Enterprise ERP",
      description: "Connected service, asset, and field operations in one enterprise platform.",
      cta: "Explore Platform",
      ctaHref: "/products",
      page: "products-overview",
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
            href: "/solutions/manufacturing",
            page: "manufacturing",
          },
          {
            icon: Building2,
            title: "Facilities Management",
            description: "Coordinate spaces, people, and service delivery.",
            href: "/solutions/facilities",
            page: "facilities",
          },
          {
            icon: Wrench,
            title: "Service & Maintenance",
            description: "Deliver responsive service wherever work happens.",
            href: "/solutions/service-maintenance",
            page: "service-maintenance",
          },
          {
            icon: HardHat,
            title: "Infrastructure & Utilities",
            description: "Maintain the systems that communities depend on.",
            href: "/solutions/infrastructure",
            page: "infrastructure",
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
            href: "/solutions/enterprise-operations",
            page: "enterprise-operations",
          },
          {
            icon: Gauge,
            title: "SLA Management",
            description: "Monitor and enforce service level agreements at scale.",
            href: "/solutions/sla-management",
            page: "sla-management",
          },
          {
            icon: Layers3,
            title: "Multi-Site Management",
            description: "Bring sites, teams, and structures into one connected view.",
            href: "/solutions/multi-site-management",
            page: "multi-site-management",
          },
          {
            icon: Database,
            title: "Connected Data",
            description: "Connect operational information across teams and locations.",
            href: "/solutions/connected-data",
            page: "connected-data",
          },
        ],
      },
    ],
    featured: {
      title: "Built for Complex Operations",
      subtitle: "Enterprise Solutions",
      description: "Purpose-built flexibility for the environments where reliability matters most.",
      cta: "View All Solutions",
      ctaHref: "/solutions",
      page: "solutions-overview",
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
            href: "/modules/organization-management",
            page: "organization-management",
          },
          {
            icon: Boxes,
            title: "Asset Management",
            description: "Know the condition and history of every critical asset.",
            href: "/modules/asset-management",
            page: "asset-management",
          },
          {
            icon: ClipboardList,
            title: "Work Order Management",
            description: "Plan, assign, and track work with complete clarity.",
            href: "/modules/work-order-management",
            page: "work-order-management",
          },
          {
            icon: FileCheck2,
            title: "Service Requests",
            description: "Structured intake and triage for every service request.",
            href: "/modules/service-management",
            page: "service-management",
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
            href: "/modules/maintenance-management",
            page: "maintenance-management",
          },
          {
            icon: Package,
            title: "Inventory & Spare Parts",
            description: "Keep essential parts and stock moving efficiently.",
            href: "/modules/inventory-management",
            page: "inventory-management",
          },
          {
            icon: Radio,
            title: "Technician Dispatch",
            description: "Assign and track technicians in real time.",
            href: "/modules/workforce-management",
            page: "workforce-management",
          },
          {
            icon: BarChart3,
            title: "Analytics & Reporting",
            description: "Turn operational data into confident decisions.",
            href: "/modules/analytics-reporting",
            page: "analytics-reporting",
          },
        ],
      },
    ],
    featured: {
      title: "Everything Your Enterprise Needs",
      subtitle: "8 Connected Modules",
      description: "Manage your organization's operational lifecycle through connected modules built for modern enterprise teams.",
      cta: "See All Modules",
      ctaHref: "/modules",
      page: "modules-overview",
    },
  },
}



// All nav items in order.
// hasMega: true  → opens a mega menu panel on hover.
// sectionId: the landing-page section id to scroll to when clicked.
// page: navigate to this App page (replaces landing page view).
const allNavItems: { label: string; hasMega: boolean; href: string; sectionId?: string; page?: Page }[] = [
  { label: "Product",   hasMega: true,  href: "#product",   sectionId: "product" },
  { label: "Solutions", hasMega: true,  href: "#solutions", sectionId: "solutions" },
  { label: "Modules",   hasMega: true,  href: "#modules",   sectionId: "modules" },
  { label: "Features",  hasMega: false, href: "#features",  page: "features" },
  { label: "Resources", hasMega: false, href: "#resources", page: "resources" },
  { label: "About",     hasMega: false, href: "#about",     page: "about" },
]

const modules: {
  title: string
  description: string
  icon: Icon
  page: Page
  image: string
}[] = [
  {
    title: "Organization Management",
    description: "Bring sites, teams, and structures into one connected view.",
    icon: Building2,
    page: "organization-management",
    image: moduleOrgImg,
  },
  {
    title: "Asset Management",
    description: "Know the condition and history of every critical asset.",
    icon: Boxes,
    page: "asset-management",
    image: moduleAssetImg,
  },
  {
    title: "Service Management",
    description: "Deliver consistent service from intake to resolution.",
    icon: Wrench,
    page: "service-management",
    image: moduleServiceImg,
  },
  {
    title: "Work Order Management",
    description: "Plan, assign, and track work with complete clarity.",
    icon: ClipboardList,
    page: "work-order-management",
    image: moduleWorkOrdersImg,
  },
  {
    title: "Inventory Management",
    description: "Keep essential parts and stock moving efficiently.",
    icon: Package,
    page: "inventory-management",
    image: moduleInventoryImg,
  },
  {
    title: "Workforce Management",
    description: "Give every team the context to do their best work.",
    icon: Users,
    page: "workforce-management",
    image: moduleWorkforceImg,
  },
  {
    title: "Maintenance Management",
    description: "Stay ahead of downtime with proactive maintenance.",
    icon: Settings2,
    page: "maintenance-management",
    image: moduleMaintenanceImg,
  },
  {
    title: "Analytics & Reporting",
    description: "Turn operational data into confident decisions.",
    icon: BarChart3,
    page: "analytics-reporting",
    image: moduleAnalyticsImg,
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
  image: string
}[] = [
  {
    title: "Connected Data",
    description: "Connect operational information across teams and locations.",
    icon: Database,
    number: "01",
    image: connectedDataImg,
  },
  {
    title: "Smarter Workflows",
    description:
      "Reduce manual processes through structured workflows and automation.",
    icon: Layers3,
    number: "02",
    image: smarterWorkflowsImg,
  },
  {
    title: "Operational Visibility",
    description:
      "Understand what is happening across assets, teams, and service operations.",
    icon: Gauge,
    number: "03",
    image: operationalVisibilityImg,
  },
  {
    title: "Audit & Traceability",
    description:
      "Maintain a complete history of operational activities and decisions.",
    icon: ShieldCheck,
    number: "04",
    image: auditTraceabilityImg,
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

interface WorkflowCard {
  id: string
  tag: string
  title: string
  desc: string
  badgeTitle: string
  badgeSubtitle?: string
  image: string
  fallback: string
}

const leftColumnCards: WorkflowCard[] = [
  {
    id: "service-requests",
    tag: "SERVICE REQUESTS",
    title: "From Request to Resolution",
    desc: "Raise, track and resolve service requests seamlessly",
    badgeTitle: "WO #14872",
    badgeSubtitle: "Completed",
    image: workflowServiceRequests,
    fallback: "/workflow-service-requests.jpg",
  },
  {
    id: "field-operations",
    tag: "FIELD OPERATIONS",
    title: "Empower Field Technicians",
    desc: "On-site execution with real-time updates",
    badgeTitle: "Site Visit • Checklist",
    badgeSubtitle: "Evidence",
    image: workflowFieldOperations,
    fallback: "/workflow-field-operations.jpg",
  },
  {
    id: "approval-workflow",
    tag: "APPROVAL WORKFLOW",
    title: "Review & Approve",
    desc: "Supervisor verification and compliance",
    badgeTitle: "Supervisor Review",
    badgeSubtitle: "Approved",
    image: workflowApproval,
    fallback: "/workflow-approval.jpg",
  },
]

const rightColumnCards: WorkflowCard[] = [
  {
    id: "asset-management",
    tag: "ASSET MANAGEMENT",
    title: "Complete Asset Visibility",
    desc: "Monitor asset health, uptime and history",
    badgeTitle: "Asset Health 92%",
    badgeSubtitle: "Operational",
    image: workflowAssetManagement,
    fallback: "/workflow-asset-management.jpg",
  },
  {
    id: "inventory-management",
    tag: "INVENTORY MANAGEMENT",
    title: "Spare Parts & Stock Control",
    desc: "Track inventory and material consumption",
    badgeTitle: "Spare Parts: 124",
    badgeSubtitle: "In Stock",
    image: workflowInventoryManagement,
    fallback: "/workflow-inventory-management.jpg",
  },
  {
    id: "operational-insights",
    tag: "OPERATIONAL INSIGHTS",
    title: "Real-Time Analytics",
    desc: "Data-driven decisions for better operations",
    badgeTitle: "System Uptime",
    badgeSubtitle: "98.2% Live",
    image: workflowInsights,
    fallback: "/workflow-insights.jpg",
  },
]


function useInView(options?: IntersectionObserverInit) {
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
      options || { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return { ref, visible }
}

// ─── Assets Video Section ─────────────────────────────────────────────────
function AssetsVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    // Attempt autoplay — muted is required for autoplay in modern browsers.
    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay was prevented — video stays paused on its first frame.
      })
    }
  }, [])

  return (
    <section
      aria-label="Asset Management video showcase"
      className="w-full max-w-none p-0 m-0 bg-[#0B1F3B] assets-video-section-enter"
      style={{
        width: "100%",
        maxWidth: "none",
        margin: 0,
        padding: 0,
      }}
    >
      {!hasError ? (
        <video
          ref={videoRef}
          src={fieldNexusVideo}
          autoPlay
          muted
          loop
          playsInline
          aria-label="FieldOps Nexus Asset Management product showcase"
          className="block w-full h-auto"
          style={{
            width: "100%",
            maxWidth: "none",
            height: "auto",
            display: "block",
            borderRadius: 0,
            margin: 0,
            padding: 0,
          }}
          preload="metadata"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex w-full aspect-video flex-col items-center justify-center bg-[#071426] px-6 py-12 text-center text-white">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-400 mb-4">
            <Activity size={28} strokeWidth={2.2} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Asset Management <span className="text-gold-400">Operations</span>
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/60">
            Real-time telemetry, preventive maintenance, and lifecycle traceability for enterprise equipment.
          </p>
        </div>
      )}
    </section>
  )
}


// ─── Connected Operations Section ───────────────────────────────────────────
const CO_NODES = [
  {
    id: 'assets',
    label: 'ASSETS',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        <path d="M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
    // SVG canvas 1400×700 — positions as fraction of width/height
    cx: 0.09, cy: 0.31,
  },
  {
    id: 'service-requests',
    label: 'SERVICE\nREQUESTS',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
    ),
    cx: 0.25, cy: 0.52,
  },
  {
    id: 'work-orders',
    label: 'WORK\nORDERS',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    cx: 0.42, cy: 0.36,
  },
  {
    id: 'field-execution',
    label: 'FIELD\nEXECUTION',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    cx: 0.58, cy: 0.58,
  },
  {
    id: 'inventory',
    label: 'INVENTORY',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    cx: 0.74, cy: 0.44,
  },
  {
    id: 'approvals',
    label: 'APPROVALS',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9,12 11,14 15,10"/>
      </svg>
    ),
    cx: 0.91, cy: 0.32,
  },
]

function ConnectedOperationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { setVisible(true); return }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // SVG canvas dimensions (viewBox units)
  const VW = 1400
  const VH = 700

  // Compute node pixel coords from fractions
  const nodes = CO_NODES.map(n => ({
    ...n,
    px: n.cx * VW,
    py: n.cy * VH,
  }))

  // Build a smooth cubic bezier path through all 6 nodes
  const pathD = (() => {
    const pts = nodes.map(n => [n.px, n.py])
    if (pts.length < 2) return ''
    let d = `M ${pts[0][0]},${pts[0][1]}`
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i]
      const [x1, y1] = pts[i + 1]
      const cpx1 = x0 + (x1 - x0) * 0.5
      const cpy1 = y0
      const cpx2 = x0 + (x1 - x0) * 0.5
      const cpy2 = y1
      d += ` C ${cpx1},${cpy1} ${cpx2},${cpy2} ${x1},${y1}`
    }
    return d
  })()

  return (
    <section
      ref={sectionRef}
      aria-label="Connected Operations industrial network"
      className={`relative w-full overflow-hidden ${visible ? 'co-section-visible' : ''}`}
      style={{ height: 'clamp(520px, 70vw, 920px)', minHeight: 520, maxHeight: 920 }}
    >
      {/* ── Industrial background ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/connected-ops-industrial.jpg')` }}
        role="img"
        aria-label="Industrial refinery and manufacturing facility at dusk"
      />

      {/* ── Dark gradient overlay — preserves text readability ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(7,20,38,0.72) 0%, rgba(7,20,38,0.45) 45%, rgba(7,20,38,0.60) 100%)',
        }}
      />
      {/* Extra top gradient for text region */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56"
        style={{
          background: 'linear-gradient(to bottom, rgba(7,20,38,0.85) 0%, transparent 100%)',
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center pt-10 sm:pt-14 px-5">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-5">
          <span className="h-px w-8" style={{ background: '#F5C451' }} />
          <span
            className="text-xs font-bold tracking-[0.20em] uppercase"
            style={{ color: '#F5C451' }}
          >
            Connected Operations
          </span>
          <span className="h-px w-8" style={{ background: '#F5C451' }} />
        </div>

        {/* Main heading */}
        <h2
          className="text-center font-bold leading-[1.10] tracking-tight text-white mb-5"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', maxWidth: '780px' }}
        >
          One operational view.<br />
          Every{' '}
          <span style={{ color: '#F5C451' }}>critical connection.</span>
        </h2>

        {/* Supporting text */}
        <p
          className="text-center text-white/75 leading-relaxed"
          style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)', maxWidth: '560px' }}
        >
          Connect your people, assets, service operations, and business workflows
          across every site — in one unified ecosystem.
        </p>
      </div>

      {/* ── Gold Network SVG (full-width overlay over the photo) ── */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Network connection line */}
          <path
            d={pathD}
            fill="none"
            stroke="#F5C451"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.85"
            className="co-network-line"
          />
          {/* Glow duplicate */}
          <path
            d={pathD}
            fill="none"
            stroke="#F5C451"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.18"
            className="co-network-line"
            style={{ filter: 'blur(3px)' }}
          />

          {/* Nodes */}
          {nodes.map((node, i) => {
            const r = 28 // circle radius
            const delayBase = 0.5 + i * 0.28
            return (
              <g
                key={node.id}
                className="co-node"
                style={{ animationDelay: `${delayBase}s` }}
              >
                {/* Outer glow ring */}
                <circle
                  cx={node.px} cy={node.py}
                  r={r + 8}
                  fill="rgba(245,196,81,0.08)"
                  stroke="#F5C451"
                  strokeWidth="0.5"
                  opacity="0.6"
                />
                {/* Main circle */}
                <circle
                  cx={node.px} cy={node.py}
                  r={r}
                  fill="rgba(7,20,38,0.82)"
                  stroke="#F5C451"
                  strokeWidth="1.5"
                />
                {/* Icon — centered */}
                <foreignObject
                  x={node.px - 11} y={node.py - 11}
                  width="22" height="22"
                  style={{ color: '#F5C451', overflow: 'visible' }}
                >
                  <div
                    style={{ color: '#F5C451', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {node.icon}
                  </div>
                </foreignObject>

                {/* Connection dot on path */}
                <circle
                  cx={node.px} cy={node.py}
                  r="4"
                  fill="#F5C451"
                  className="co-glow-dot"
                  style={{ animationDelay: `${delayBase + 0.1}s` }}
                />

                {/* Label below node */}
                {node.label.split('\n').map((line, li) => (
                  <text
                    key={li}
                    x={node.px}
                    y={node.py + r + 18 + li * 14}
                    textAnchor="middle"
                    fill="white"
                    fontSize="11"
                    fontWeight="700"
                    letterSpacing="0.12em"
                    fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
                    className="co-label"
                    style={{ animationDelay: `${delayBase + 0.2}s` }}
                  >
                    {line}
                  </text>
                ))}
              </g>
            )
          })}
        </svg>
      </div>
    </section>
  )
}

export function Reveal({
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

function ConnectedOperationsHeading() {
  const { ref, visible } = useInView()
  return (
    <div
      ref={ref}
      className={`mb-6 transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-[#0B1F3B]">
        Connected Across{" "}
        <span
          className={`inline-block text-[#F5C451] transition-all duration-500 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5"
          }`}
          style={{ transitionDelay: "180ms" }}
        >
          Your Operation
        </span>
      </p>
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
  className = "",
}: {
  eyebrow: string
  title: string
  description: string
  centered?: boolean
  className?: string
}) {
  return (
    <Reveal
      className={`${
        className ? className : "mb-12 lg:mb-16"
      } ${
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

// ─── Mega Menu Panel ─────────────────────────────────────────────────────────
function MegaMenuPanel({
  menuKey,
  onClose,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
  onCtaClick,
}: {
  menuKey: string
  onClose: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  onNavigate: (page: Page) => void
  onCtaClick: (sectionId: string) => void
}) {
  const def = megaMenus[menuKey]
  if (!def) return null
  return (
    <div
      id={`mega-menu-${menuKey.toLowerCase()}`}
      role="dialog"
      aria-label={`${menuKey} mega menu`}
      aria-labelledby={`mega-trigger-${menuKey.toLowerCase()}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="mega-menu-panel absolute left-0 right-0 top-full z-50 border-b border-[rgba(248,250,252,0.10)] bg-[#061328] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.5)]"
    >
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr_280px]">
          {/* Columns */}
          {def.columns.map((col, ci) => (
            <div
              key={ci}
              className={ci < def.columns.length ? "lg:pr-8 lg:border-r lg:border-[rgba(248,250,252,0.10)]" : ""}
            >
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F5C451]">
                {col.heading}
              </p>
              <ul className="space-y-1" role="list">
                {col.items.map((item) => {
                  const ItemIcon = item.icon as Icon
                  return (
                    <li key={item.title}>
                      <a
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault()
                          onClose()
                          if (item.page) {
                            onNavigate(item.page)
                          } else if (item.href?.startsWith("#")) {
                            onCtaClick(item.href.replace("#", ""))
                          }
                        }}
                        className="mega-menu-item group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 hover:bg-[#162A4B]"
                      >
                        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-[rgba(248,250,252,0.10)] bg-[#162A4B] text-[#CBD5E1] transition-colors duration-150 group-hover:border-[#F5C451]/40 group-hover:text-[#F5C451]">
                          <ItemIcon size={17} strokeWidth={1.7} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[13.5px] font-semibold leading-snug text-[#F8FAFC]">
                            {item.title}
                          </span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-[#94A3B8]">
                            {item.description}
                          </span>
                        </span>
                        <span className="ml-auto mt-1 shrink-0 text-[#F5C451] opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100">
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
          <div className="flex flex-col justify-between rounded-xl border border-[rgba(248,250,252,0.12)] bg-[#162A4B] p-5">
            <div>
              <span className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F5C451]">
                <span className="h-px w-4 bg-[#F5C451]" />
                {def.featured.subtitle}
              </span>
              <h3 className="mt-2 text-base font-bold leading-snug text-[#F8FAFC]">
                {def.featured.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">
                {def.featured.description}
              </p>
            </div>
            {/* Mini platform preview */}
            <div className="my-4 overflow-hidden rounded-lg border border-[rgba(248,250,252,0.10)] bg-[#0B1F3B] p-3 shadow-inner">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-white/20" />
                <span className="size-1.5 rounded-full bg-white/20" />
                <span className="size-1.5 rounded-full bg-white/20" />
                <span className="ml-2 text-[9px] font-bold text-[#F8FAFC]">
                  FieldOps <span className="text-[#F5C451]">Nexus</span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[["Assets", "2,846"], ["Open WO", "128"], ["SLA", "98%"]].map(([lbl, val]) => (
                  <div key={lbl} className="rounded border border-[rgba(248,250,252,0.06)] bg-[#162A4B] p-1.5 text-center">
                    <p className="text-[8px] text-[#94A3B8]">{lbl}</p>
                    <p className="text-[10px] font-bold text-[#F8FAFC]">{val}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex h-8 items-end gap-0.5">
                {[40, 55, 45, 70, 60, 85, 65].map((h, i) => (
                  <span
                    key={i}
                    className={`flex-1 rounded-t-sm ${i === 5 ? "bg-[#F5C451]" : "bg-white/10"}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <a
              href={def.featured.ctaHref}
              onClick={(e) => {
                e.preventDefault()
                onClose()
                onCtaClick(def.featured.ctaHref.replace("#", ""))
              }}
              className="landing-button inline-flex items-center justify-center gap-2 rounded-lg bg-[#F5C451] px-4 py-2.5 text-xs font-bold text-[#0B1F3B] transition-colors hover:bg-gold-400"
            >
              {def.featured.cta} <ArrowRight size={13} className="text-[#0B1F3B]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage({ onNavigate, page }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)

  const [activeMega, setActiveMega] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const headerRef = useRef<HTMLElement>(null)
  // Timer ref for the delayed close — prevents flicker when cursor moves
  // from a trigger button into the mega panel (or between triggers).
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clickedMegaRef = useRef<string | null>(null)
  const [workflowProgress, setWorkflowProgress] = useState(0)
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0)
  const [isInWorkflow, setIsInWorkflow] = useState(false)
  const connectingLineFillRef = useRef<HTMLDivElement>(null)

  // Scroll-synchronized calculation relative to the workflow section
  useEffect(() => {
    let ticking = false

    const handleWorkflowScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const section = document.getElementById("workflow")
          if (!section) {
            ticking = false
            return
          }

          const rect = section.getBoundingClientRect()
          const vh = window.innerHeight

          // Progress calculated smoothly relative to the workflow section
          const startOffset = vh * 0.70
          const endOffset = vh * 0.25
          const totalDistance = rect.height + (startOffset - endOffset)
          const currentDistance = startOffset - rect.top

          const rawProgress = currentDistance / totalDistance
          const clamped = Math.min(Math.max(rawProgress, 0), 1)
          const inView = rect.top < vh * 0.90 && rect.bottom > vh * 0.10

          // Direct 60fps GPU transform for connecting line
          if (connectingLineFillRef.current) {
            const isDesktop = window.innerWidth >= 768
            connectingLineFillRef.current.style.transform = isDesktop
              ? `scaleX(${clamped})`
              : `scaleY(${clamped})`
          }

          setWorkflowProgress(clamped)
          setIsInWorkflow(inView)

          // 7 steps: indices 0 through 6, activated smoothly as the line arrives
          const stepIdx = Math.min(Math.max(Math.floor(clamped * 6 + 0.5), 0), 6)
          setActiveWorkflowStep(stepIdx)

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleWorkflowScroll, { passive: true })
    window.addEventListener("resize", handleWorkflowScroll, { passive: true })
    handleWorkflowScroll()

    return () => {
      window.removeEventListener("scroll", handleWorkflowScroll)
      window.removeEventListener("resize", handleWorkflowScroll)
    }
  }, [])

  // Scroll to top whenever page prop changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [page])

  // NOTE: There is intentionally NO IntersectionObserver or scroll-spy here.
  // The Home page is a single page — scrolling through its sections must never
  // change the global navbar active state. Active state is derived exclusively
  // from the `page` prop (i.e. an explicit user navigation action).

  // Scroll to a landing-page section, accounting for the sticky 76px navbar.
  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (!el) return
    const navH = 76
    const top = el.getBoundingClientRect().top + window.scrollY - navH
    window.scrollTo({ top, behavior: "smooth" })
  }, [])

  // Navigate to landing page then (after the React render + scroll-to-top
  // effect) smooth-scroll to the target section.
  const navigateToLandingSection = useCallback(
    (sectionId: string) => {
      if (!page || page === "landing") {
        // Already on landing page — just scroll.
        scrollToSection(sectionId)
      } else {
        // Go to landing; the useEffect below will fire the scroll once rendered.
        onNavigate("landing")
        // Schedule the scroll after the page transition and scroll-to-top settle.
        setTimeout(() => scrollToSection(sectionId), 120)
      }
    },
    [page, onNavigate, scrollToSection],
  )

  // Determine exactly ONE active navbar item — derived ONLY from the current
  // route (`page` prop). Scrolling the Home page must never affect this value.
  // The Home page itself has no dedicated nav item, so `null` is returned for
  // `page === 'landing'` (or undefined), keeping every nav item un-highlighted.
  const activeNavLabel = (() => {
    // Dedicated page routes — each maps to exactly one nav label.
    if (page === "features")   return "Features"
    if (page === "resources")  return "Resources"
    if (page === "about")      return "About"
    if (
      page === "organization-management" ||
      page === "asset-management"      ||
      page === "service-management"    ||
      page === "work-order-management" ||
      page === "inventory-management"  ||
      page === "maintenance-management" ||
      page === "workforce-management"  ||
      page === "analytics-reporting"   ||
      page === "audit-traceability"
    ) return "Product"
    if (
      page === "manufacturing"        ||
      page === "facilities"           ||
      page === "enterprise-operations" ||
      page === "sla-management"       ||
      page === "multi-site-management" ||
      page === "connected-data"
    ) return "Solutions"
    // Home page (landing) and any unrecognised page: nothing is active.
    return null
  })()

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
      clickedMegaRef.current = null
      setActiveMega(null)
      closeTimerRef.current = null
    }, 200)
  }, [cancelClose])

  // Hard close (ESC, link click, etc.) — immediate, no delay.
  const closeMega = useCallback(() => {
    cancelClose()
    clickedMegaRef.current = null
    setActiveMega(null)
  }, [cancelClose])

  // ESC key support: closes open mega dropdown or mobile navigation
  useEffect(() => {
    if (!activeMega && !menuOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMega()
        setMenuOpen(false)
        setMobileExpanded(null)
      }
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [activeMega, menuOpen, closeMega])

  // Click outside support: clicking outside active mega menu or mobile nav closes it
  useEffect(() => {
    if (!activeMega && !menuOpen) return

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      if (activeMega) {
        const insidePanel = target.closest(".mega-menu-panel")
        const insideTrigger = target.closest(".mega-trigger")
        if (!insidePanel && !insideTrigger) {
          closeMega()
        }
      }

      if (menuOpen && headerRef.current && !headerRef.current.contains(target)) {
        setMenuOpen(false)
        setMobileExpanded(null)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("touchstart", handlePointerDown)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("touchstart", handlePointerDown)
    }
  }, [activeMega, menuOpen, closeMega])

  // Clean up timer on unmount
  useEffect(() => () => { if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current) }, [])

  return (
    <div className="min-w-0 overflow-x-clip bg-white font-sans text-text-primary scroll-smooth">
      {/* ── Global Nexus Flow Operational Scroll Telemetry ── */}
      <NexusScrollFlow />

      <header
        ref={headerRef}
        className="sticky top-0 z-50 border-b border-border/70 bg-white/95 backdrop-blur-lg"
      >
        {/* ── Top Edge Gold Scroll Signal (synchronized with right-side rail) ── */}
        <div
          className="pointer-events-none absolute top-0 inset-x-0 h-[3.5px] bg-[#162A4B]/5 overflow-hidden z-50"
          aria-hidden="true"
        >
          <div
            id="nexus-nav-scroll-signal"
            className="h-full w-full origin-left bg-[#F5C451] shadow-[0_0_8px_rgba(245,196,81,0.25)] transition-none will-change-transform"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        <div className="relative mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
          <a
            href="#top"
            aria-label="FieldOps Nexus home"
            onClick={(e) => {
              e.preventDefault()
              closeMega()
              onNavigate("landing")
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          >
            <Brand />
          </a>

          {/* ── Desktop nav ── */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1.5 xl:flex"
          >
            {allNavItems.map((item) => {
              const isItemActive = activeNavLabel === item.label
              const isMegaOpen = activeMega === item.label

              if (item.hasMega) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    id={`mega-trigger-${item.label.toLowerCase()}`}
                    aria-expanded={isMegaOpen}
                    aria-haspopup="dialog"
                    aria-controls={isMegaOpen ? `mega-menu-${item.label.toLowerCase()}` : undefined}
                    // Hover → open; hover-leave → schedule close
                    onMouseEnter={() => openMega(item.label)}
                    onMouseLeave={scheduleClose}
                    // Click: toggle mega panel open/closed without navigating away
                    onClick={() => {
                      cancelClose()
                      if (clickedMegaRef.current === item.label) {
                        clickedMegaRef.current = null
                        setActiveMega(null)
                      } else {
                        clickedMegaRef.current = item.label
                        setActiveMega(item.label)
                      }
                    }}
                    className={`mega-trigger group relative inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[15px] transition-colors duration-180 ease-out ${
                      isItemActive || isMegaOpen
                        ? "font-semibold text-[#0B1F3B]"
                        : "font-medium text-[#162A4B] hover:text-[#B88A00]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      size={14}
                      className={`transition-all duration-180 ease-out ${
                        isMegaOpen
                          ? "rotate-180 text-[#B88A00]"
                          : isItemActive
                          ? "text-[#0B1F3B]"
                          : "text-[#162A4B] group-hover:text-[#B88A00]"
                      }`}
                    />
                    {/* Exactly ONE gold underline for active item / open trigger */}
                    {(isItemActive || isMegaOpen) && (
                      <span className="absolute bottom-0.5 left-2.5 right-2.5 h-[2px] rounded-[2px] bg-[#F5C451]" />
                    )}
                  </button>
                )
              }

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    closeMega()
                    if (item.page) {
                      if (page === item.page) {
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      } else {
                        onNavigate(item.page)
                      }
                    } else if (item.sectionId) {
                      navigateToLandingSection(item.sectionId)
                    }
                  }}
                  aria-current={isItemActive ? "page" : undefined}
                  className={`landing-nav-link relative inline-flex items-center justify-center rounded-lg px-3 py-2 text-[15px] transition-colors duration-180 ease-out ${
                    isItemActive
                      ? "font-semibold text-[#0B1F3B]"
                      : "font-medium text-[#162A4B] hover:text-[#B88A00]"
                  }`}
                >
                  <span>{item.label}</span>
                  {/* Exactly ONE gold underline for active item */}
                  {isItemActive && (
                    <span className="absolute bottom-0.5 left-2.5 right-2.5 h-[2px] rounded-[2px] bg-[#F5C451]" />
                  )}
                </button>
              )
            })}
          </nav>

          <div className="hidden items-center gap-5 xl:flex">
            <button
              type="button"
              onClick={() => { closeMega(); onNavigate("login") }}
              className="text-[15px] font-semibold text-[#0B1F3B] transition-colors duration-180 ease-out hover:text-[#B88A00]"
            >
              Sign In
            </button>
            <a
              href={demoLink}
              onClick={closeMega}
              className="group inline-flex items-center gap-2 rounded-lg border border-transparent bg-[#0B1F3B] px-5 py-2.5 text-[14px] font-semibold text-[#F8FAFC] transition-all duration-180 ease-out hover:bg-[#162A4B] hover:border-[rgba(245,196,81,0.45)] hover:text-[#F8FAFC]"
            >
              <span>Get Started</span>
              <ArrowUpRight size={15} className="text-[#F8FAFC] transition-colors duration-180 ease-out group-hover:text-[#F5C451]" />
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
            onNavigate={onNavigate}
            onCtaClick={(sectionId) => {
              closeMega()
              navigateToLandingSection(sectionId)
            }}
          />
        )}

        {/* ── Mobile nav ── */}
        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="border-t border-border bg-white px-5 pb-6 pt-3 shadow-xl xl:hidden"
          >
            {allNavItems.map((item) => {
              const isMobileActive = activeNavLabel === item.label
              return (
                <div key={item.label}>
                  {item.hasMega ? (
                    <>
                      <button
                        type="button"
                        id={`mobile-trigger-${item.label.toLowerCase()}`}
                        aria-expanded={mobileExpanded === item.label}
                        aria-controls={`mobile-menu-${item.label.toLowerCase()}`}
                        onClick={() =>
                          setMobileExpanded((prev) =>
                            prev === item.label ? null : item.label
                          )
                        }
                        className={`flex w-full items-center justify-between border-b border-border/60 py-3 text-sm font-medium transition-colors duration-180 ${
                          isMobileActive ? "text-[#0B1F3B] font-semibold" : "text-[#162A4B] hover:text-[#B88A00]"
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          size={15}
                          className={`transition-transform duration-200 ${
                            mobileExpanded === item.label ? "rotate-180 text-[#B88A00]" : "text-[#162A4B]"
                          }`}
                        />
                      </button>
                      {mobileExpanded === item.label && megaMenus[item.label] && (
                        <div
                          id={`mobile-menu-${item.label.toLowerCase()}`}
                          role="region"
                          aria-labelledby={`mobile-trigger-${item.label.toLowerCase()}`}
                          className="mb-2 ml-2 border-l-2 border-gold-500/30 pl-4"
                        >
                          {megaMenus[item.label].columns.map((col, ci) => (
                            <div key={ci} className="mt-3">
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#B88A00]">
                                {col.heading}
                              </p>
                              {col.items.map((mItem) => (
                                <a
                                  key={mItem.title}
                                  href={mItem.href}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setMenuOpen(false)
                                    setMobileExpanded(null)
                                    if (mItem.page) {
                                      onNavigate(mItem.page)
                                    } else {
                                      // No dedicated page — scroll to section on landing
                                      const sectionId = mItem.href.replace("#", "")
                                      navigateToLandingSection(sectionId)
                                    }
                                  }}
                                  className="flex items-center gap-2 py-1.5 text-sm text-[#162A4B] hover:text-[#B88A00] transition-colors duration-180"
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
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false)
                        if (item.page) {
                          if (page === item.page) {
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          } else {
                            onNavigate(item.page)
                          }
                        } else if (item.sectionId) {
                          navigateToLandingSection(item.sectionId)
                        }
                      }}
                      className={`flex w-full items-center justify-between border-b border-border/60 py-3 text-left text-sm font-medium transition-colors duration-180 ${
                        isMobileActive ? "text-[#0B1F3B] font-semibold" : "text-[#162A4B] hover:text-[#B88A00]"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowRight size={14} className="text-text-secondary" />
                    </button>
                  )}
                </div>
              )
            })}
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onNavigate("login")
                }}
                className="flex-1 rounded-lg border border-border px-4 py-3 text-sm font-semibold text-[#0B1F3B] transition-colors duration-180 hover:text-[#B88A00]"
              >
                Sign In
              </button>
              <a
                href={demoLink}
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-lg border border-transparent bg-[#0B1F3B] px-4 py-3 text-center text-sm font-semibold text-[#F8FAFC] transition-all duration-180 hover:bg-[#162A4B] hover:border-[rgba(245,196,81,0.45)]"
              >
                Get Started
              </a>
            </div>
          </nav>
        )}
      </header>

      {(!page || page === "landing") ? (
      <main id="top">
        {/* ── Assets Video Section ── */}
        <AssetsVideoSection />

        {/* ── Connected Operations — Full-Width Industrial Section ── */}
        <ConnectedOperationsSection />

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
            {/* ── Connected Operations Card Marquee (LEFT → RIGHT) ── */}
            <div className="mt-14 border-t border-border pt-8">
              <ConnectedOperationsHeading />

              {/* Overflow container with background connector line */}
              <div
                className="relative overflow-hidden py-4 -my-4"
                aria-label="Connected operations capability cards"
              >
                {/* Subtle continuous gold connector line running horizontally behind cards */}
                <div className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-[#F5C451]/25 z-0" />

                {/* Continuous LEFT → RIGHT moving card track */}
                <div className="ops-cards-marquee-ltr">
                  {/* SET A */}
                  <div className="flex gap-6 shrink-0 pr-6">
                    {connectedOperations.map((op, i) => {
                      const OpIcon = op.icon
                      return (
                        <div
                          key={`set-a-${op.title}`}
                          className="group/card relative z-10 flex h-[162px] w-[260px] sm:w-[280px] shrink-0 flex-col justify-between overflow-hidden rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-left shadow-[0_8px_24px_rgba(11,31,59,0.06)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] hover:border-[#F5C451]/50 hover:shadow-[0_16px_36px_rgba(11,31,59,0.12)] cursor-default select-none"
                        >
                          {/* Top: icon container & sequence index */}
                          <div className="flex items-center justify-between">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-[#0B1F3B] text-[#F8FAFC] shadow-sm transition-all duration-300 ease-out group-hover/card:bg-[#F5C451] group-hover/card:text-[#0B1F3B] group-hover/card:shadow-[0_4px_14px_rgba(245,196,81,0.30)]">
                              <OpIcon size={20} strokeWidth={1.8} className="transition-transform duration-300 ease-out group-hover/card:-translate-y-0.5" />
                            </div>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-[#162A4B]/40 transition-colors duration-300 group-hover/card:text-[#0B1F3B]">
                              0{i + 1}
                            </span>
                          </div>

                          {/* Middle: operation name & descriptor */}
                          <div>
                            <h3 className="text-base sm:text-[17px] font-bold tracking-tight text-[#0B1F3B] transition-colors duration-200 group-hover/card:text-[#040D1A]">
                              {op.title}
                            </h3>
                            <p className="mt-1 text-xs text-[#162A4B]/70 leading-snug line-clamp-1 transition-colors duration-200 group-hover/card:text-[#162A4B]/95">
                              {op.desc}
                            </p>
                          </div>

                          {/* Bottom: operational capability label + subtle gold indicator */}
                          <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-2.5">
                            <span className="text-[9.5px] font-semibold uppercase tracking-wider text-[#162A4B]/60 transition-colors duration-200 group-hover/card:text-[#0B1F3B]">
                              Operational Capability
                            </span>
                            <span className="size-1.5 rounded-full bg-[#E2E8F0] transition-colors duration-300 group-hover/card:bg-[#F5C451]" />
                          </div>

                          {/* Bottom gold accent line */}
                          <div className="absolute inset-x-6 bottom-0 h-[2px] rounded-full bg-[#F5C451] opacity-20 transition-all duration-300 ease-out group-hover/card:opacity-100" />
                        </div>
                      )
                    })}
                  </div>

                  {/* SET B — exact duplicate for seamless infinite loop */}
                  <div className="ops-marquee-clone flex gap-6 shrink-0 pr-6" aria-hidden="true">
                    {connectedOperations.map((op, i) => {
                      const OpIcon = op.icon
                      return (
                        <div
                          key={`set-b-${op.title}`}
                          className="group/card relative z-10 flex h-[162px] w-[260px] sm:w-[280px] shrink-0 flex-col justify-between overflow-hidden rounded-[18px] border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-left shadow-[0_8px_24px_rgba(11,31,59,0.06)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.015] hover:border-[#F5C451]/50 hover:shadow-[0_16px_36px_rgba(11,31,59,0.12)] cursor-default select-none"
                        >
                          {/* Top: icon container & sequence index */}
                          <div className="flex items-center justify-between">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-[#0B1F3B] text-[#F8FAFC] shadow-sm transition-all duration-300 ease-out group-hover/card:bg-[#F5C451] group-hover/card:text-[#0B1F3B] group-hover/card:shadow-[0_4px_14px_rgba(245,196,81,0.30)]">
                              <OpIcon size={20} strokeWidth={1.8} className="transition-transform duration-300 ease-out group-hover/card:-translate-y-0.5" />
                            </div>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-[#162A4B]/40 transition-colors duration-300 group-hover/card:text-[#0B1F3B]">
                              0{i + 1}
                            </span>
                          </div>

                          {/* Middle: operation name & descriptor */}
                          <div>
                            <h3 className="text-base sm:text-[17px] font-bold tracking-tight text-[#0B1F3B] transition-colors duration-200 group-hover/card:text-[#040D1A]">
                              {op.title}
                            </h3>
                            <p className="mt-1 text-xs text-[#162A4B]/70 leading-snug line-clamp-1 transition-colors duration-200 group-hover/card:text-[#162A4B]/95">
                              {op.desc}
                            </p>
                          </div>

                          {/* Bottom: operational capability label + subtle gold indicator */}
                          <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-2.5">
                            <span className="text-[9.5px] font-semibold uppercase tracking-wider text-[#162A4B]/60 transition-colors duration-200 group-hover/card:text-[#0B1F3B]">
                              Operational Capability
                            </span>
                            <span className="size-1.5 rounded-full bg-[#E2E8F0] transition-colors duration-300 group-hover/card:bg-[#F5C451]" />
                          </div>

                          {/* Bottom gold accent line */}
                          <div className="absolute inset-x-6 bottom-0 h-[2px] rounded-full bg-[#F5C451] opacity-20 transition-all duration-300 ease-out group-hover/card:opacity-100" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="modules"
          className="scroll-mt-24 bg-surface pt-16 pb-10 lg:pt-20 lg:pb-12"
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionHeading
              eyebrow="The platform"
              title="Everything Your Enterprise Needs"
              description="Manage your organization's operational lifecycle through connected modules built for modern enterprise teams."
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {modules.map((module, i) => (
                <Reveal
                  key={module.title}
                  delay={(i % 4) * 80}
                  className="h-full"
                >
                  <button
                    onClick={() => onNavigate(module.page)}
                    className="module-card group flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-white text-left shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-gold-500/50 hover:shadow-xl hover:shadow-navy-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                    aria-label={`View ${module.title} module`}
                  >
                    {/* Industrial Photograph Header */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-950">
                      <img
                        src={module.image}
                        alt={`${module.title} - FieldOps Nexus`}
                        loading="lazy"
                        className="module-card-img h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-navy-950/20 to-transparent" />

                      {/* Icon Badge */}
                      <span className="absolute bottom-3 left-4 flex size-9 items-center justify-center rounded-lg bg-white text-gold-600 shadow-md">
                        <module.icon size={19} strokeWidth={1.8} />
                      </span>

                      {/* Module Number Indicator */}
                      <span className="absolute top-3 right-4 rounded-md bg-navy-900/80 px-2 py-0.5 text-[11px] font-bold text-white/90 backdrop-blur-sm border border-white/10">
                        0{i + 1}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                      <div>
                        <h3 className="text-base font-bold text-navy-800 transition-colors duration-200 group-hover:text-gold-600">
                          {module.title}
                        </h3>
                        <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                          {module.description}
                        </p>
                      </div>

                      {/* View Module Action */}
                      <span className="mt-5 inline-flex items-center gap-1.5 border-t border-border/70 pt-3 text-xs font-bold text-gold-600 transition-colors duration-200 group-hover:text-gold-500">
                        View Module{" "}
                        <ArrowUpRight
                          size={14}
                          className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="scroll-mt-24 bg-white pt-10 pb-12 lg:pt-12 lg:pb-14">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionHeading
              eyebrow="How it works"
              title="From Request to Resolution"
              description="A clear, connected path from the first service request to the final sign-off. Every handoff accounted for."
              centered
              className="mb-8 lg:mb-10"
            />
            <div className="relative grid gap-0 pl-2 md:grid-cols-7 md:pl-0">
              {/* Horizontal (desktop) / Vertical (mobile) Gold Connecting Line precisely centered on icons */}
              <div className="landing-timeline-line absolute bottom-10 left-[27px] top-10 w-[2px] bg-[#E2E8F0] md:bottom-auto md:left-[calc(100%/14)] md:right-[calc(100%/14)] md:top-[31px] md:h-[2px] md:w-auto overflow-hidden">
                <div
                  ref={connectingLineFillRef}
                  className="h-full w-full bg-[#F5C451] origin-top md:origin-left will-change-transform"
                  style={{
                    transform: `scaleX(${workflowProgress})`,
                    transition: "none",
                  }}
                />
              </div>

              {steps.map((step, i) => {
                const isActive = activeWorkflowStep === i
                const isCompleted = i < activeWorkflowStep
                const isUpcoming = i > activeWorkflowStep

                return (
                  <div
                    key={step.title}
                    className="landing-step-item relative flex items-center gap-5 py-3 md:flex-col md:gap-0 md:py-0 md:text-center transition-all duration-300"
                  >
                    <span
                      className={`relative z-10 flex size-14 shrink-0 items-center justify-center rounded-xl border md:mx-auto md:size-16 transition-all duration-300 ${
                        isActive
                          ? "border-[#F5C451] bg-[#0B1F3B] text-[#F5C451] shadow-[0_0_24px_rgba(245,196,81,0.50)] ring-4 ring-[#F5C451]/30 scale-110 -translate-y-1"
                          : isCompleted
                          ? "border-[#F5C451] bg-white text-[#0B1F3B] shadow-sm scale-100 translate-y-0"
                          : "border-border bg-white text-navy-800/40 opacity-60 scale-100 translate-y-0"
                      }`}
                    >
                      <step.icon
                        size={isActive ? 25 : 23}
                        strokeWidth={isActive ? 2.2 : 1.7}
                        className={`transition-all duration-300 ${
                          isActive
                            ? "text-[#F5C451]"
                            : isCompleted
                            ? "text-[#0B1F3B]"
                            : "text-navy-800/40"
                        }`}
                      />
                    </span>
                    <div className="md:mt-5 transition-all duration-300">
                      <span
                        className={`text-[10px] tracking-widest transition-colors duration-200 ${
                          isActive
                            ? "text-[#F5C451] font-extrabold text-[11px]"
                            : isCompleted
                            ? "text-[#B88A00] font-semibold"
                            : "text-navy-800/35 font-medium"
                        }`}
                      >
                        0{i + 1}
                      </span>
                      <h3
                        className={`mt-1 max-w-[150px] text-sm leading-snug transition-all duration-200 md:mx-auto ${
                          isActive
                            ? "text-[#0B1F3B] font-bold"
                            : isCompleted
                            ? "text-[#162A4B] font-semibold"
                            : "text-navy-800/40 font-normal"
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                  </div>
                )
              })}
            </div>
            <div
              className={`landing-step-pill mx-auto mt-8 lg:mt-10 max-w-max rounded-full bg-gold-50 px-5 py-2 text-xs font-semibold text-gold-600 transition-all duration-300 ${
                workflowProgress >= 0.95 ? "ring-2 ring-gold-400/40 opacity-100" : "opacity-90"
              }`}
            >
              One continuous, traceable service lifecycle
            </div>
          </div>
        </section>

        <section
          id="product"
          className="relative pt-14 pb-18 lg:pt-16 lg:pb-24 bg-navy-800 text-white overflow-hidden"
        >
          <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 lg:grid-cols-[.85fr_1.15fr] lg:gap-14 lg:px-8">
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

            {/* ── Automatic Continuous Two-Column Vertical Marquee Workflow Gallery ── */}
            <div className="relative h-[600px] lg:h-[660px] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#061224]/50 p-3.5 shadow-2xl backdrop-blur-md">
              {/* Soft Ambient top and bottom fade masks for seamless endless conveyor */}
              <div className="pointer-events-none absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#0B1F3A] via-[#0B1F3A]/90 to-transparent z-10" />
              <div className="pointer-events-none absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/90 to-transparent z-10" />

              {/* Two-column vertical conveyor container */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full overflow-hidden">
                
                {/* Left Column Vertical Marquee (Set A + Set B seamless loop) */}
                <div className="nexus-workflow-col-marquee-left">
                  {[...leftColumnCards, ...leftColumnCards].map((card, idx) => (
                    <div
                      key={`${card.id}-${idx}`}
                      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.1] bg-[#162A4B]/75 p-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-[#F5C451]/50 hover:bg-[#162A4B]"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-[#061224]">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
                          onError={(e) => {
                            const target = e.currentTarget
                            if (!target.dataset.failed) {
                              target.dataset.failed = "true"
                              target.src = card.fallback
                            }
                          }}
                        />
                        {/* Floating glassmorphic telemetry pill */}
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between rounded border border-white/15 bg-[#0B1F3B]/90 px-2.5 py-1 backdrop-blur-md shadow-sm">
                          <span className="text-[9.5px] font-mono font-bold tracking-tight text-white truncate">
                            {card.badgeTitle}
                          </span>
                          {card.badgeSubtitle && (
                            <span className="ml-1 flex items-center gap-1 text-[8.5px] font-semibold text-[#F5C451]">
                              <span className="size-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
                              {card.badgeSubtitle}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#F5C451]">
                              {card.tag}
                            </span>
                          </div>
                          <h3 className="mt-1 text-sm sm:text-[15px] font-bold text-white leading-snug">
                            {card.title}
                          </h3>
                          <p className="mt-1 text-xs leading-relaxed text-white/65">
                            {card.desc}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/[0.07]">
                          <span className="text-[10px] font-medium text-white/50 group-hover:text-[#F5C451] transition-colors">
                            Explore workflow
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column Vertical Marquee (Staggered offset + seamless loop) */}
                <div className="nexus-workflow-col-marquee-right sm:pt-6">
                  {[...rightColumnCards, ...rightColumnCards].map((card, idx) => (
                    <div
                      key={`${card.id}-${idx}`}
                      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.1] bg-[#162A4B]/75 p-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-[#F5C451]/50 hover:bg-[#162A4B]"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-[#061224]">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
                          onError={(e) => {
                            const target = e.currentTarget
                            if (!target.dataset.failed) {
                              target.dataset.failed = "true"
                              target.src = card.fallback
                            }
                          }}
                        />
                        {/* Floating glassmorphic telemetry pill */}
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between rounded border border-white/15 bg-[#0B1F3B]/90 px-2.5 py-1 backdrop-blur-md shadow-sm">
                          <span className="text-[9.5px] font-mono font-bold tracking-tight text-white truncate">
                            {card.badgeTitle}
                          </span>
                          {card.badgeSubtitle && (
                            <span className="ml-1 flex items-center gap-1 text-[8.5px] font-semibold text-[#F5C451]">
                              <span className="size-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
                              {card.badgeSubtitle}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#F5C451]">
                              {card.tag}
                            </span>
                          </div>
                          <h3 className="mt-1 text-sm sm:text-[15px] font-bold text-white leading-snug">
                            {card.title}
                          </h3>
                          <p className="mt-1 text-xs leading-relaxed text-white/65">
                            {card.desc}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/[0.07]">
                          <span className="text-[10px] font-medium text-white/50 group-hover:text-[#F5C451] transition-colors">
                            Explore workflow
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </section>

        <section id="features" className="scroll-mt-24 bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionHeading
              eyebrow="Why FieldOps Nexus"
              title="Built for Modern Enterprise Operations"
              description="The intelligence and structure to make complex operations feel effortless."
            />
            <div className="grid gap-6 md:grid-cols-2">
              {benefits.map((item, i) => (
                <Reveal
                  key={item.title}
                  delay={i * 90}
                  className="h-full"
                >
                  <div className="benefit-card group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-gold-500/50 hover:shadow-xl hover:shadow-navy-900/5">
                    {/* Premium Photographic Card Header */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-navy-950">
                      <img
                        src={item.image}
                        alt={`${item.title} - FieldOps Nexus`}
                        loading="lazy"
                        className="benefit-card-img h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-navy-950/20 to-transparent" />

                      {/* Icon Badge */}
                      <span className="absolute bottom-3.5 left-5 flex size-11 items-center justify-center rounded-xl bg-white text-gold-600 shadow-md sm:left-6">
                        <item.icon size={22} strokeWidth={1.8} />
                      </span>

                      {/* Sequence Counter */}
                      <span className="absolute top-3.5 right-5 rounded-md bg-navy-900/80 px-2.5 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm border border-white/10 sm:right-6">
                        {item.number} <span className="text-white/40">/</span> <span className="text-gold-400">04</span>
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-navy-800 transition-colors duration-200 group-hover:text-gold-600">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                          {item.description}
                        </p>
                      </div>

                      {/* Enterprise Capability Accent */}
                      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-[10px] font-semibold uppercase tracking-wider text-text-secondary/60">
                        <span className="transition-colors duration-200 group-hover:text-navy-800">
                          Enterprise Capability
                        </span>
                        <span className="size-1.5 rounded-full bg-border transition-colors duration-200 group-hover:bg-gold-500" />
                      </div>
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
      ) : (
        <MarketingPages page={page} onNavigate={onNavigate} />
      )}

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
                  { label: "Features", page: "features" as Page },
                  { label: "Asset Management", page: "asset-management" as Page },
                  { label: "Service Management", page: "service-management" as Page },
                  { label: "Work Orders", page: "work-order-management" as Page },
                  { label: "Analytics", page: "analytics-reporting" as Page },
                ],
              },
              {
                title: "Solutions",
                links: [
                  { label: "Enterprise Operations", page: "enterprise-operations" as Page },
                  { label: "Manufacturing", page: "manufacturing" as Page },
                  { label: "Facilities Management", page: "facilities" as Page },
                  { label: "Maintenance", page: "maintenance-management" as Page },
                ],
              },
              {
                title: "Company",
                links: [
                  { label: "About Us", page: "about" as Page },
                  { label: "Resources", page: "resources" as Page },
                  { label: "Contact Sales", href: contactLink },
                  { label: "Careers", href: careersLink },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-white/80">
                  {col.title}
                </h3>
                <div className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    link.page ? (
                      <button
                        key={link.label}
                        type="button"
                        onClick={() => {
                          if (link.page) {
                            if (page === link.page) {
                              window.scrollTo({ top: 0, behavior: "smooth" })
                            } else {
                              onNavigate(link.page)
                            }
                          }
                        }}
                        className="w-fit text-left text-sm text-white/45 transition-colors hover:text-gold-400"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        key={link.label}
                        href={link.href}
                        className="w-fit text-sm text-white/45 transition-colors hover:text-gold-400"
                      >
                        {link.label}
                      </a>
                    )
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
