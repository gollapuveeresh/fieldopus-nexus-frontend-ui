import { ElementType, useEffect, useRef, useState, ReactNode } from "react"
import {
  ArrowRight,
  Boxes,
  Wrench,
  ClipboardList,
  Package,
  Settings2,
  Users,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Activity,
  AlertCircle,
  TrendingUp,
  Factory,
  Building2,
  HardHat,
  ChevronRight,
  FileText,
  Search,
  Filter
} from "lucide-react"
import type { Page } from "../types"

// ─── Animation Utility ──────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !("IntersectionObserver" in window)) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold, rootMargin: "0px 0px -50px 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

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
  const base = "transition-all duration-700 ease-out"
  const hidden = {
    up: "opacity-0 translate-y-8",
    left: "opacity-0 -translate-x-8",
    scale: "opacity-0 scale-95",
  }[direction]
  const visibleClass = "opacity-100 translate-y-0 translate-x-0 scale-100"

  return (
    <div
      ref={ref}
      className={`${className} ${base} ${visible ? visibleClass : hidden}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// ─── Shared Illustrative Components ─────────────────────────────────────────

function UIWindow({ children, title = "FieldOps Nexus" }: { children: ReactNode, title?: string }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-white text-left shadow-2xl shadow-navy-950/20">
      <div className="flex h-10 items-center justify-between border-b border-border bg-white px-4">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
          <span className="size-2 rounded-full bg-border" />
          <span className="ml-3 text-[10px] font-bold tracking-tight text-navy-800">
            {title}
          </span>
        </div>
      </div>
      <div className="p-4 bg-surface/30">
        {children}
      </div>
    </div>
  )
}

// ─── Page Configurations ────────────────────────────────────────────────────

interface SectionDef {
  title: string
  description: string
  icon: ElementType
}

interface PageDef {
  eyebrow: string
  title: string
  description: string
  sections: SectionDef[]
  heroVisual: () => ReactNode
}

const pageData: Record<string, PageDef> = {
  "asset-management": {
    eyebrow: "ASSET MANAGEMENT",
    title: "Know every asset. Control every lifecycle.",
    description: "Connected asset intelligence for enterprise field operations. Maintain visibility, track history, and optimize the lifecycle of every critical asset.",
    heroVisual: () => (
      <UIWindow title="Asset Management">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-navy-800">Asset Hierarchy</h4>
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">Healthy</span>
          </div>
          <div className="flex gap-3">
            <div className="h-24 w-1/3 rounded-lg border border-border bg-white p-3 shadow-sm">
              <Boxes className="mb-2 text-gold-500" size={16} />
              <p className="text-[10px] font-semibold text-navy-800">HVAC System A</p>
              <p className="mt-1 text-[9px] text-text-secondary">Uptime: 99.8%</p>
            </div>
            <div className="h-24 w-1/3 rounded-lg border border-border bg-white p-3 shadow-sm">
              <Activity className="mb-2 text-blue-500" size={16} />
              <p className="text-[10px] font-semibold text-navy-800">Pump Station 4</p>
              <p className="mt-1 text-[9px] text-text-secondary">Maintenance due</p>
            </div>
            <div className="h-24 w-1/3 rounded-lg border border-border bg-white p-3 shadow-sm">
              <AlertCircle className="mb-2 text-orange-500" size={16} />
              <p className="text-[10px] font-semibold text-navy-800">Generator B</p>
              <p className="mt-1 text-[9px] text-text-secondary">Needs inspection</p>
            </div>
          </div>
        </div>
      </UIWindow>
    ),
    sections: [
      { title: "Asset Hierarchy", description: "Map complex nested assets effortlessly.", icon: Boxes },
      { title: "Asset Health", description: "Real-time visibility into operational status.", icon: Activity },
      { title: "Service History", description: "Complete context for every repair.", icon: Clock },
    ]
  },
  "service-management": {
    eyebrow: "SERVICE MANAGEMENT",
    title: "Deliver consistent service from intake to resolution.",
    description: "Unify service requests, triage efficiently, and dispatch the right team every time. A complete request-to-resolution workflow.",
    heroVisual: () => (
      <UIWindow title="Service Workflow">
        <div className="flex flex-col gap-2">
          {["Triage Request", "Assign Work Order", "Technician Execution", "Supervisor Review"].map((step, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-white p-2.5 shadow-sm">
              <div className="flex size-6 items-center justify-center rounded-full bg-navy-50 text-[10px] font-bold text-navy-800">
                {i + 1}
              </div>
              <p className="text-[11px] font-semibold text-navy-800">{step}</p>
              {i < 2 && <CheckCircle2 size={14} className="ml-auto text-green-500" />}
              {i === 2 && <span className="ml-auto rounded-full bg-gold-100 px-2 py-0.5 text-[9px] font-bold text-gold-700">In Progress</span>}
            </div>
          ))}
        </div>
      </UIWindow>
    ),
    sections: [
      { title: "Service Intake", description: "Centralized channel for all requests.", icon: FileText },
      { title: "Automated Triage", description: "Route work intelligently by priority.", icon: Filter },
      { title: "Execution Tracking", description: "Live visibility from start to finish.", icon: CheckCircle2 },
    ]
  },
  "work-order-management": {
    eyebrow: "WORK ORDER MANAGEMENT",
    title: "Plan, assign, and track work with complete clarity.",
    description: "Empower your teams with all the context they need. Track labor, parts, evidence, and compliance on a single digital work order.",
    heroVisual: () => (
      <UIWindow title="Work Order #WO-842">
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <div>
              <p className="text-[10px] font-bold text-gold-600">PREVENTIVE MAINTENANCE</p>
              <p className="text-xs font-bold text-navy-800">Annual HVAC Inspection</p>
            </div>
            <span className="rounded bg-navy-800 px-2 py-1 text-[9px] font-bold text-white">Assigned</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-text-secondary"><Clock size={12}/> Due Today, 4:00 PM</div>
            <div className="flex items-center gap-2 text-[10px] text-text-secondary"><Users size={12}/> Technician: John D.</div>
            <div className="flex items-center gap-2 text-[10px] text-text-secondary"><Boxes size={12}/> Parts Required: 2 items</div>
          </div>
        </div>
      </UIWindow>
    ),
    sections: [
      { title: "Digital Execution", description: "No more paper trails or lost context.", icon: ClipboardList },
      { title: "Labor Tracking", description: "Accurate time logs for better costing.", icon: Clock },
      { title: "Field Evidence", description: "Capture photos and signatures easily.", icon: ShieldCheck },
    ]
  },
  "inventory-management": {
    eyebrow: "INVENTORY MANAGEMENT",
    title: "Keep essential parts and stock moving efficiently.",
    description: "Prevent delays with real-time stock visibility. Manage material requests, warehouse operations, and work order consumption seamlessly.",
    heroVisual: () => (
      <UIWindow title="Inventory Dashboard">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-white p-3 border border-border shadow-sm">
            <p className="text-[9px] text-text-secondary">Low Stock Alerts</p>
            <p className="text-xl font-bold text-red-500">14</p>
          </div>
          <div className="rounded-lg bg-white p-3 border border-border shadow-sm">
            <p className="text-[9px] text-text-secondary">Pending Requests</p>
            <p className="text-xl font-bold text-navy-800">28</p>
          </div>
          <div className="col-span-2 mt-1 rounded-lg bg-white p-3 border border-border shadow-sm space-y-2">
            <p className="text-[10px] font-bold text-navy-800">Recent Movements</p>
            <div className="flex justify-between text-[9px] border-b border-border pb-1"><span className="text-navy-800">Bearing X-2</span><span className="text-red-500">-4 (Issued)</span></div>
            <div className="flex justify-between text-[9px]"><span className="text-navy-800">Filter Cartridge</span><span className="text-green-600">+12 (Received)</span></div>
          </div>
        </div>
      </UIWindow>
    ),
    sections: [
      { title: "Stock Visibility", description: "Know exactly what's in the warehouse.", icon: Package },
      { title: "Material Requests", description: "Streamlined workflow for technician needs.", icon: Wrench },
      { title: "Consumption Tracking", description: "Tie every part directly to a work order.", icon: Activity },
    ]
  },
  "maintenance-management": {
    eyebrow: "MAINTENANCE MANAGEMENT",
    title: "Stay ahead of downtime with proactive maintenance.",
    description: "Shift from reactive to preventive. Schedule routine work, track asset health, and ensure compliance with automated maintenance plans.",
    heroVisual: () => (
      <UIWindow title="Maintenance Schedule">
        <div className="space-y-2">
          {[1,2,3].map((i) => (
             <div key={i} className="flex gap-3 items-center bg-white p-2 border border-border rounded shadow-sm">
               <div className="bg-surface rounded px-2 py-1 text-center min-w-[40px]">
                 <span className="block text-[8px] uppercase text-text-secondary">Oct</span>
                 <span className="block text-xs font-bold text-navy-800">{14 + i}</span>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-navy-800">Monthly Inspection - Unit {i}</p>
                 <p className="text-[9px] text-text-secondary">Preventive • High Priority</p>
               </div>
             </div>
          ))}
        </div>
      </UIWindow>
    ),
    sections: [
      { title: "Preventive Plans", description: "Automated scheduling based on time or usage.", icon: Settings2 },
      { title: "Calendar View", description: "Visualize team workload and upcoming tasks.", icon: Clock },
      { title: "Compliance", description: "Ensure regulatory tasks are never missed.", icon: ShieldCheck },
    ]
  },
  "workforce-management": {
    eyebrow: "WORKFORCE MANAGEMENT",
    title: "Give every team the context to do their best work.",
    description: "Optimize assignments based on skills and availability. Empower field teams with a digital workspace designed for operational excellence.",
    heroVisual: () => (
      <UIWindow title="Technician Roster">
        <div className="space-y-2">
          {["Sarah Jenkins", "Michael Chang", "David Miller"].map((name, i) => (
            <div key={i} className="flex items-center justify-between bg-white p-2 border border-border rounded shadow-sm">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-navy-100 flex items-center justify-center text-[10px] font-bold text-navy-800">
                  {name.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-navy-800">{name}</p>
                  <p className="text-[8px] text-text-secondary">Senior Technician</p>
                </div>
              </div>
              <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold ${i===0 ? 'bg-green-100 text-green-700' : 'bg-gold-100 text-gold-700'}`}>
                {i === 0 ? 'Available' : 'On Job'}
              </span>
            </div>
          ))}
        </div>
      </UIWindow>
    ),
    sections: [
      { title: "Skills Routing", description: "Assign the right person to the right job.", icon: Users },
      { title: "Workload Balancing", description: "Prevent burnout and optimize efficiency.", icon: Activity },
      { title: "Mobile Execution", description: "Everything a technician needs on their device.", icon: Wrench },
    ]
  },
  "analytics-reporting": {
    eyebrow: "ANALYTICS & REPORTING",
    title: "Turn operational data into confident decisions.",
    description: "Enterprise-grade visibility into SLA performance, asset reliability, and team productivity. Stop guessing and start optimizing.",
    heroVisual: () => (
      <UIWindow title="Operations Analytics">
        <div className="flex items-end gap-1 h-24 mt-4 px-2 pb-2 border-b border-border">
          {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
            <div key={i} className="flex-1 bg-navy-800/10 rounded-t relative group transition-all duration-300 hover:bg-gold-500" style={{ height: `${h}%` }}>
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-navy-900 text-white text-[8px] px-1 py-0.5 rounded transition-opacity">
                 {h}
               </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 px-2">
           <span className="text-[9px] text-text-secondary">Mon</span>
           <span className="text-[9px] text-text-secondary">Sun</span>
        </div>
      </UIWindow>
    ),
    sections: [
      { title: "SLA Tracking", description: "Ensure commitments are met consistently.", icon: ShieldCheck },
      { title: "Performance Trends", description: "Identify bottlenecks before they escalate.", icon: TrendingUp },
      { title: "Custom Dashboards", description: "Views tailored to your operational KPIs.", icon: BarChart3 },
    ]
  },
  "audit-traceability": {
    eyebrow: "AUDIT & TRACEABILITY",
    title: "Maintain a complete history of all operational activities.",
    description: "Accountability built-in. Track every state change, approval, and action across your organization to ensure compliance and quality.",
    heroVisual: () => (
      <UIWindow title="Audit Log">
        <div className="space-y-0 relative before:absolute before:inset-0 before:ml-3 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {["Work Order Created", "Assigned to Tech", "Status: In Progress", "Evidence Uploaded"].map((event, i) => (
             <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-2">
               <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-navy-800 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
               <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-2 rounded border border-border bg-white shadow-sm">
                 <p className="text-[9px] font-bold text-navy-800">{event}</p>
                 <p className="text-[8px] text-text-secondary">System • Today</p>
               </div>
             </div>
          ))}
        </div>
      </UIWindow>
    ),
    sections: [
      { title: "Immutable History", description: "A secure log of who did what and when.", icon: ShieldCheck },
      { title: "Approval Workflows", description: "Digital sign-offs for critical processes.", icon: CheckCircle2 },
      { title: "Evidence Capture", description: "Attach photos and documents securely.", icon: FileText },
    ]
  },
  // Industries
  "manufacturing": {
    eyebrow: "INDUSTRY: MANUFACTURING",
    title: "Keep production-critical assets and operations moving.",
    description: "Minimize downtime and maximize output. FieldOps Nexus provides the asset intelligence and maintenance scheduling manufacturing needs.",
    heroVisual: () => (
      <UIWindow title="Production Floor Overview">
         <div className="flex items-center justify-center h-32 bg-surface rounded-lg border border-border">
            <Factory size={48} className="text-navy-800/20" />
         </div>
      </UIWindow>
    ),
    sections: [
      { title: "Asset Reliability", description: "Ensure machines stay online.", icon: Activity },
      { title: "Preventive Care", description: "Schedule maintenance during off-hours.", icon: Settings2 },
      { title: "Parts Inventory", description: "Never run out of critical spares.", icon: Package },
    ]
  },
  "facilities": {
    eyebrow: "INDUSTRY: FACILITIES MANAGEMENT",
    title: "Coordinate spaces, people, and service delivery.",
    description: "From routine cleaning to complex HVAC repairs, unify your facility operations onto a single platform.",
    heroVisual: () => (
      <UIWindow title="Facility Portfolio">
         <div className="flex items-center justify-center h-32 bg-surface rounded-lg border border-border">
            <Building2 size={48} className="text-navy-800/20" />
         </div>
      </UIWindow>
    ),
    sections: [
      { title: "Space Management", description: "Track service history by location.", icon: Building2 },
      { title: "Vendor Coordination", description: "Assign work to internal or external teams.", icon: Users },
      { title: "Service SLAs", description: "Meet tenant expectations consistently.", icon: Clock },
    ]
  },
  "enterprise-operations": {
    eyebrow: "INDUSTRY: ENTERPRISE OPERATIONS",
    title: "Maintain the systems that communities depend on.",
    description: "Scale your operational footprint securely. FieldOps Nexus offers the hierarchy, roles, and traceability required by large organizations.",
    heroVisual: () => (
      <UIWindow title="Enterprise Dashboard">
         <div className="flex items-center justify-center h-32 bg-surface rounded-lg border border-border">
            <HardHat size={48} className="text-navy-800/20" />
         </div>
      </UIWindow>
    ),
    sections: [
      { title: "Complex Hierarchies", description: "Support multi-site organizational structures.", icon: Boxes },
      { title: "Audit Readiness", description: "Always prepared for compliance checks.", icon: ShieldCheck },
      { title: "Global Visibility", description: "Roll-up reporting across all sites.", icon: BarChart3 },
    ]
  }
}

export default function MarketingPages({ page, onNavigate }: { page: Page, onNavigate: (p: Page) => void }) {
  const data = pageData[page]

  // Fallback if page not found (should not happen if routed correctly)
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
         <p className="text-navy-800">Page not found.</p>
      </div>
    )
  }

  return (
    <main className="bg-white" id="top">
      {/* ── Hero Section ── */}
      <section className="relative isolate overflow-hidden bg-navy-900 text-white pb-24 pt-20 lg:pt-32 lg:pb-32">
        <div className="pointer-events-none absolute -right-40 -top-64 size-[700px] rounded-full border border-white/5" />
        <div className="pointer-events-none absolute -bottom-60 left-1/4 size-[500px] rounded-full bg-navy-500/15 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 grid gap-12 lg:grid-cols-2 items-center">
          <div className="max-w-2xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold-400 mb-6">
                <span className="size-1.5 rounded-full bg-gold-500" />
                {data.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-white">
                {data.title}
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 text-lg leading-relaxed text-white/70 max-w-xl">
                {data.description}
              </p>
            </Reveal>
            <Reveal delay={300} className="mt-10 flex flex-wrap gap-4">
              <button 
                onClick={() => onNavigate("login")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-6 py-3.5 text-sm font-bold text-navy-950 transition-colors hover:bg-gold-400"
              >
                Explore Platform <ArrowRight size={16} />
              </button>
              <button 
                onClick={() => window.location.href = "mailto:sales@fieldopsnexus.com"}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                Talk to Us
              </button>
            </Reveal>
          </div>
          <Reveal delay={400} direction="left" className="relative hidden lg:block">
            {data.heroVisual()}
          </Reveal>
        </div>
      </section>

      {/* ── Feature Highlights ── */}
      <section className="py-24 bg-surface">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-navy-800">Capabilities built for scale</h2>
              <p className="mt-4 text-text-secondary">Everything you need to manage your operations efficiently, integrated into a single seamless platform.</p>
            </div>
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.sections.map((section, i) => {
              const Icon = section.icon
              return (
                <Reveal key={section.title} delay={i * 100} className="rounded-xl border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-navy-50 text-navy-800">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-navy-800">{section.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{section.description}</p>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Workflow Preview (Static Visual) ── */}
      <section className="py-24 bg-white border-t border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <Reveal>
               <h2 className="text-3xl font-bold text-navy-800 mb-6">Designed for real-world operations</h2>
               <p className="text-text-secondary mb-8 leading-relaxed text-lg">
                 Unlike traditional rigid systems, FieldOps Nexus adapts to how your teams actually work. The interface is intuitive, the workflows are logical, and the data is always where you need it.
               </p>
               <ul className="space-y-4">
                 {[
                   "Enterprise-grade security and role-based access",
                   "Cloud-native architecture for high availability",
                   "Seamless integration capabilities",
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-navy-800 font-medium">
                     <CheckCircle2 size={18} className="text-gold-600" />
                     {item}
                   </li>
                 ))}
               </ul>
             </Reveal>
             <Reveal direction="left" className="relative">
                {/* Mobile visualization of hero */}
                <div className="lg:hidden">
                   {data.heroVisual()}
                </div>
                {/* Abstract graphic for desktop */}
                <div className="hidden lg:flex items-center justify-center h-80 bg-surface rounded-2xl border border-border relative overflow-hidden">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(11,31,58,0.05)_0,transparent_100%)]" />
                   <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="flex gap-4">
                         <div className="size-16 rounded-2xl bg-white shadow-lg border border-border flex items-center justify-center animate-bounce" style={{animationDuration: '3s'}}><Search className="text-navy-800" /></div>
                         <div className="size-16 rounded-2xl bg-navy-800 shadow-lg flex items-center justify-center animate-bounce" style={{animationDuration: '3.5s', animationDelay: '0.2s'}}><Settings2 className="text-white" /></div>
                      </div>
                      <div className="flex gap-4">
                         <div className="size-16 rounded-2xl bg-gold-500 shadow-lg flex items-center justify-center animate-bounce" style={{animationDuration: '2.8s', animationDelay: '0.5s'}}><Activity className="text-navy-900" /></div>
                         <div className="size-16 rounded-2xl bg-white shadow-lg border border-border flex items-center justify-center animate-bounce" style={{animationDuration: '3.2s', animationDelay: '0.1s'}}><CheckCircle2 className="text-green-600" /></div>
                      </div>
                   </div>
                </div>
             </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 bg-navy-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <Reveal className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Ready to connect your operations?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            Join the organizations using FieldOps Nexus to streamline their service, assets, and teams into one unified workflow.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => onNavigate("login")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-8 py-4 text-sm font-bold text-navy-950 transition-colors hover:bg-gold-400"
            >
              Explore Platform <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => window.location.href = "mailto:sales@fieldopsnexus.com"}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              Contact Sales
            </button>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
