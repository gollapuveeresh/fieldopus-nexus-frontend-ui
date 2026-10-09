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
  Filter,
  Layers3,
  Database,
  Radio,
  FileCheck2,
  CircleCheck,
  ArrowUpRight,
  BookOpen,
  HelpCircle,
  Sparkles,
  ChevronDown,
  Globe,
  Cpu,
  Lock,
  Workflow,
  Check
} from "lucide-react"
import type { Page } from "../types"

type Icon = ElementType

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

// ─── Shared UI Window Chrome ────────────────────────────────────────────────
function UIWindow({ children, title = "FieldOps Nexus Platform" }: { children: ReactNode, title?: string }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-white text-left shadow-2xl shadow-navy-950/15">
      <div className="flex h-10 items-center justify-between border-b border-border bg-white px-4">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-3 text-[11px] font-bold tracking-tight text-navy-900">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live System
          </span>
        </div>
      </div>
      <div className="p-4 sm:p-5 bg-surface/30">
        {children}
      </div>
    </div>
  )
}

// ============================================================================
// 1. DEDICATED FEATURES PAGE
// ============================================================================
function FeaturesPageContent({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [activeStep, setActiveStep] = useState(0)

  const featureCards = [
    {
      title: "Asset Management",
      page: "asset-management" as Page,
      icon: Boxes,
      description: "Know the condition, maintenance history, telemetry, and lifecycle status of every critical asset in real time.",
      tag: "Asset Tracking",
      stat: "2,846 Active Assets",
    },
    {
      title: "Service Management",
      page: "service-management" as Page,
      icon: Wrench,
      description: "Deliver predictable, high-touch field service from automated ticket intake to rapid first-time resolution.",
      tag: "SLA Assurance",
      stat: "99.4% SLA Compliance",
    },
    {
      title: "Work Order Management",
      page: "work-order-management" as Page,
      icon: ClipboardList,
      description: "Plan, prioritize, assign, and track complex work orders with end-to-end task checklists and parts staging.",
      tag: "Dispatch & Ops",
      stat: "142 Active Orders",
    },
    {
      title: "Inventory Management",
      page: "inventory-management" as Page,
      icon: Package,
      description: "Keep essential spare parts, tooling, and consumables synchronized across central warehouses and technician vans.",
      tag: "Parts & Stock",
      stat: "99.8% Accuracy",
    },
    {
      title: "Maintenance Management",
      page: "maintenance-management" as Page,
      icon: Settings2,
      description: "Prevent unexpected equipment downtime through automated PM schedules, inspection triggers, and calibration cycles.",
      tag: "Preventive Ops",
      stat: "42% Less Downtime",
    },
    {
      title: "Workforce Management",
      page: "workforce-management" as Page,
      icon: Users,
      description: "Equip mobile technicians and supervisors with skill-based scheduling, real-time routing, and job telemetry.",
      tag: "Technicians",
      stat: "68 Field Techs",
    },
    {
      title: "Analytics & Reporting",
      page: "analytics-reporting" as Page,
      icon: BarChart3,
      description: "Convert telemetry and operational logs into actionable executive dashboards, MTTR trends, and cost metrics.",
      tag: "Intelligence",
      stat: "18 Executive Reports",
    },
    {
      title: "Audit & Traceability",
      page: "audit-traceability" as Page,
      icon: ShieldCheck,
      description: "Maintain an immutable, timestamped audit trail of every signature, part consumption, and compliance sign-off.",
      tag: "Compliance",
      stat: "100% Traceability",
    },
  ]

  const workflowSteps = [
    { title: "Asset Monitored", icon: Boxes, role: "Telemetry / Sensor", desc: "Sensors or operators trigger an operational alert or scheduled maintenance event." },
    { title: "Service Request", icon: FileCheck2, role: "Client / Dispatch", desc: "Ticket automatically prioritized with SLA tracking and equipment history attached." },
    { title: "Work Order", icon: ClipboardList, role: "Maintenance Planner", desc: "Job scope formulated with required skills, SOP checklists, and estimated hours." },
    { title: "Technician Dispatch", icon: Users, role: "Field Technician", desc: "Nearest certified technician is assigned via geo-routing and mobile app notification." },
    { title: "Spare Parts Allocated", icon: Package, role: "Warehouse / Van Stock", desc: "Components verified and reserved from central inventory or vehicle stock." },
    { title: "Supervisor Review", icon: ShieldCheck, role: "Field Supervisor", desc: "Completed checklist, photo evidence, and test measurements verified." },
    { title: "Client Confirmation", icon: CircleCheck, role: "Client Representative", desc: "Digital sign-off captured on mobile device with automated service receipt." },
    { title: "Closure & Audit", icon: Activity, role: "Compliance & Ledger", desc: "Work order closed, equipment health index updated, and audit log preserved." },
  ]

  return (
    <div className="w-full bg-white">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B1F3B] via-[#0D2444] to-[#0B1F3B] text-white pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
        <div className="absolute -top-40 -right-40 size-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 flex flex-col items-center text-center">
          <div className="max-w-4xl flex flex-col items-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-400 mb-6">
                <Sparkles size={13} className="text-gold-400" />
                FIELDOPS NEXUS FEATURES
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
                Everything your field operations need.{" "}
                <span className="text-[#F5C451]">
                  Connected in one platform.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-white/75 leading-relaxed">
                Bridge the gap between assets, technicians, work orders, inventory, and analytics. 
                FieldOps Nexus delivers connected operational execution with enterprise-grade traceability and zero workflow fragmentation.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => {
                    const el = document.getElementById("feature-grid")
                    el?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3.5 text-sm font-bold text-navy-950 transition-all hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/20"
                >
                  Explore Features <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => onNavigate("login")}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  Live Platform Demo
                </button>
              </div>

              {/* Quick stats strip */}
              <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/10 pt-8 max-w-lg mx-auto">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gold-400">99.4%</p>
                  <p className="text-xs text-white/60 mt-0.5">SLA Adherence</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">42%</p>
                  <p className="text-xs text-white/60 mt-0.5">Faster MTTR</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gold-400">100%</p>
                  <p className="text-xs text-white/60 mt-0.5">Audit Compliance</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Feature Cards Grid Section ── */}
      <section id="feature-grid" className="py-20 lg:py-28 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">
              CONNECTED CAPABILITIES
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Enterprise features engineered for operational precision
            </h2>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              Every feature in FieldOps Nexus is tightly integrated to eliminate silos between office planners, warehouse staff, and field technicians.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((feat, idx) => {
              const FeatIcon = feat.icon
              return (
                <Reveal key={feat.title} delay={idx * 50}>
                  <div
                    onClick={() => onNavigate(feat.page)}
                    className="group relative flex flex-col justify-between h-full rounded-xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400 hover:shadow-xl hover:shadow-navy-950/10 cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-navy-800 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-navy-950">
                          <FeatIcon size={22} />
                        </div>
                        <span className="rounded-full bg-surface px-2.5 py-1 text-[10px] font-semibold text-navy-800 border border-border/80">
                          {feat.tag}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                        {feat.title}
                      </h3>
                      <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                        {feat.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                      <span className="font-semibold text-navy-800">{feat.stat}</span>
                      <span className="inline-flex items-center gap-1 font-bold text-gold-600 transition-transform group-hover:translate-x-1">
                        Explore <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Interactive Workflow Visual: CONNECTED OPERATIONS ── */}
      <section className="py-20 lg:py-28 bg-white border-y border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-navy-800/10 bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy-800 mb-3">
              <Workflow size={13} className="text-gold-600" />
              CONNECTED OPERATIONS WORKFLOW
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              From incident to verified closure without breaking context
            </h2>
            <p className="mt-4 text-base text-text-secondary">
              Click through each phase of the connected FieldOps Nexus workflow to see how data, roles, and assets stay synchronized.
            </p>
          </Reveal>

          {/* Stepper Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
            {workflowSteps.map((step, idx) => {
              const StepIcon = step.icon
              const isSelected = activeStep === idx
              return (
                <button
                  key={step.title}
                  onClick={() => setActiveStep(idx)}
                  className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all ${
                    isSelected
                      ? "border-gold-500 bg-navy-900 text-white shadow-md shadow-navy-900/20"
                      : "border-border bg-white text-navy-900 hover:bg-surface"
                  }`}
                >
                  <div className={`flex size-8 items-center justify-center rounded-lg mb-2 ${
                    isSelected ? "bg-gold-500 text-navy-950" : "bg-surface text-navy-800"
                  }`}>
                    <StepIcon size={16} />
                  </div>
                  <span className="text-[10px] font-bold line-clamp-1">{step.title}</span>
                  <span className={`text-[9px] mt-0.5 ${isSelected ? "text-gold-300" : "text-text-secondary"}`}>
                    Step {idx + 1}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Active Step Showcase Card */}
          <div className="rounded-2xl border border-border bg-gradient-to-r from-navy-900 to-navy-800 p-6 sm:p-10 text-white shadow-xl">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-6">
                <div className="inline-flex items-center gap-2 rounded-md bg-gold-500/20 px-2.5 py-1 text-xs font-bold text-gold-400 mb-3">
                  Step 0{activeStep + 1} • {workflowSteps[activeStep].role}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {workflowSteps[activeStep].title}
                </h3>
                <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed">
                  {workflowSteps[activeStep].desc}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : workflowSteps.length - 1))}
                    className="rounded-lg border border-white/20 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/10"
                  >
                    Previous Step
                  </button>
                  <button
                    onClick={() => setActiveStep((prev) => (prev < workflowSteps.length - 1 ? prev + 1 : 0))}
                    className="rounded-lg bg-gold-500 px-4 py-2 text-xs font-bold text-navy-950 hover:bg-gold-400"
                  >
                    Next Workflow Step →
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-bold text-gold-400">
                    <span>Active Telemetry Payload</span>
                    <span>Status: Verified</span>
                  </div>
                  <div className="mt-4 space-y-2.5 text-xs">
                    <div className="flex justify-between text-white/80">
                      <span className="text-white/50">Current Entity:</span>
                      <span className="font-mono font-semibold">REF-PUMP-04 • Site Bravo</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span className="text-white/50">Action Owner:</span>
                      <span className="font-mono font-semibold">{workflowSteps[activeStep].role}</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span className="text-white/50">SLA Timer:</span>
                      <span className="font-mono font-semibold text-emerald-400">01:42:15 remaining (On Track)</span>
                    </div>
                    <div className="flex justify-between text-white/80">
                      <span className="text-white/50">Audit State:</span>
                      <span className="font-mono font-semibold text-gold-300">Cryptographically Signed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Alternating Large Feature Showcases ── */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 space-y-24">
          
          {/* Showcase 1: Asset Lifecycle (Text Left, Visual Right) */}
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <Reveal>
                <div className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">
                  01 / ASSET & TELEMETRY INTELLIGENCE
                </div>
                <h3 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                  Complete operational visibility into every critical asset
                </h3>
                <p className="mt-4 text-base text-text-secondary leading-relaxed">
                  Track full asset hierarchies across parent-child structures, view real-time operating metrics, and inspect historical maintenance logs with one click.
                </p>
                <ul className="mt-6 space-y-3 text-sm font-medium text-navy-900">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    Multi-level parent/child asset hierarchies with location tags
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    Automated MTBF and MTTR metrics calculation
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    QR-code asset tagging and mobile scanner integration
                  </li>
                </ul>
                <div className="mt-8">
                  <button
                    onClick={() => onNavigate("asset-management")}
                    className="inline-flex items-center gap-2 text-sm font-bold text-navy-900 hover:text-gold-600 transition-colors"
                  >
                    Learn more about Asset Management <ArrowRight size={16} />
                  </button>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-6">
              <Reveal direction="left">
                <UIWindow title="Asset Profile • CNC Mill Alpha-01">
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-border">
                      <div>
                        <p className="font-bold text-navy-900">CNC Precision Mill 5-Axis</p>
                        <p className="text-[10px] text-text-secondary">Serial: #CNC-9904 • Location: Bay 4B</p>
                      </div>
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                        Operational
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white p-2.5 rounded border border-border text-center">
                        <p className="text-[10px] text-text-secondary">Uptime</p>
                        <p className="text-base font-bold text-navy-900">99.2%</p>
                      </div>
                      <div className="bg-white p-2.5 rounded border border-border text-center">
                        <p className="text-[10px] text-text-secondary">Next PM</p>
                        <p className="text-base font-bold text-gold-600">14 Days</p>
                      </div>
                      <div className="bg-white p-2.5 rounded border border-border text-center">
                        <p className="text-[10px] text-text-secondary">Total WOs</p>
                        <p className="text-base font-bold text-navy-900">38</p>
                      </div>
                    </div>
                  </div>
                </UIWindow>
              </Reveal>
            </div>
          </div>

          {/* Showcase 2: Dispatch & Work Orders (Visual Left, Text Right) */}
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <Reveal direction="left">
                <UIWindow title="Work Order Dispatch Board">
                  <div className="space-y-2 text-xs">
                    {[
                      { id: "WO-9021", desc: "Emergency Hydraulic Leak", tech: "Elena Rostova", status: "In Transit", priority: "Critical" },
                      { id: "WO-9022", desc: "Quarterly HVAC Calibration", tech: "Marcus Chen", status: "In Progress", priority: "Medium" },
                      { id: "WO-9023", desc: "Generator Load Test", tech: "David Vance", status: "Scheduled", priority: "High" },
                    ].map((wo) => (
                      <div key={wo.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-border shadow-sm">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-navy-900">{wo.id}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              wo.priority === "Critical" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"
                            }`}>{wo.priority}</span>
                          </div>
                          <p className="text-[10px] text-text-secondary mt-0.5">{wo.desc}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-semibold text-navy-800">{wo.tech}</p>
                          <p className="text-[9px] text-gold-600 font-bold">{wo.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </UIWindow>
              </Reveal>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2">
              <Reveal>
                <div className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">
                  02 / WORK ORDER ORCHESTRATION
                </div>
                <h3 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                  Intelligent dispatching, digital SOPs, and field execution
                </h3>
                <p className="mt-4 text-base text-text-secondary leading-relaxed">
                  Eliminate paperwork and missing details. Field technicians receive structured digital work orders with step-by-step safety SOPs, required tools, and parts reservations on mobile.
                </p>
                <ul className="mt-6 space-y-3 text-sm font-medium text-navy-900">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    Automated technician dispatch matched to certified skills & proximity
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    Real-time digital checklists with mandatory photo validation
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    Instant customer signature and supervisor electronic sign-off
                  </li>
                </ul>
                <div className="mt-8">
                  <button
                    onClick={() => onNavigate("work-order-management")}
                    className="inline-flex items-center gap-2 text-sm font-bold text-navy-900 hover:text-gold-600 transition-colors"
                  >
                    Explore Work Order Management <ArrowRight size={16} />
                  </button>
                </div>
              </Reveal>
            </div>
          </div>

        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 bg-[#0B1F3B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
        <Reveal className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Connect your operations with FieldOps Nexus
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed">
            Standardize your assets, service delivery, maintenance schedules, and field workforce under one enterprise cloud platform.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate("login")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-8 py-4 text-sm font-bold text-navy-950 transition-colors hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/20"
            >
              Explore Platform <ArrowRight size={16} />
            </button>
            <button
              onClick={() => window.location.href = "mailto:hello@fieldopsnexus.com?subject=FieldOps%20Nexus%20Demo"}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              Get Started
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

// ============================================================================
// 2. DEDICATED RESOURCES PAGE
// ============================================================================
function ResourcesPageContent({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const categories = ["All", "Product Guides", "Documentation", "Industry Insights", "Operational Playbooks"]

  const resourceArticles = [
    {
      category: "Operational Playbooks",
      title: "Enterprise Asset Lifecycle & Preventive Maintenance Playbook",
      desc: "A comprehensive framework for structuring asset hierarchies, calculating true MTBF/MTTR, and designing predictive maintenance cycles.",
      readTime: "8 min read",
      date: "October 2026",
      featured: true,
      tag: "Best Practice",
    },
    {
      category: "Product Guides",
      title: "Optimizing Mobile Technician Dispatch & Route Scheduling",
      desc: "How modern operations teams reduce travel time and elevate first-time fix rates using skills-based dispatch algorithms.",
      readTime: "6 min read",
      date: "September 2026",
      tag: "Field Workforce",
    },
    {
      category: "Documentation",
      title: "FieldOps Nexus API & ERP Integration Architecture",
      desc: "Technical blueprint for synchronizing spare parts, inventory ledger, and work order costs with enterprise ERP backbones.",
      readTime: "12 min read",
      date: "August 2026",
      tag: "Architecture",
    },
    {
      category: "Industry Insights",
      title: "Continuous Audit Readiness: Eliminating Paper Compliance Gaps",
      desc: "Why cryptographic timestamps and immutable operational ledgers protect heavy industrial and facilities operators during audits.",
      readTime: "5 min read",
      date: "July 2026",
      tag: "Compliance",
    },
    {
      category: "Operational Playbooks",
      title: "Spare Parts Inventory Control & Van Stock Optimization",
      desc: "Strategies to prevent costly job delays by automating min/max threshold replenishment across mobile field units and central hubs.",
      readTime: "7 min read",
      date: "June 2026",
      tag: "Inventory",
    },
    {
      category: "Product Guides",
      title: "Setting Up Multi-Site Organization Structures in FieldOps Nexus",
      desc: "Step-by-step guidance on structuring complex enterprise entities, role-based access permissions, and regional reporting zones.",
      readTime: "10 min read",
      date: "May 2026",
      tag: "Enterprise Config",
    },
  ]

  const faqs = [
    {
      q: "How does FieldOps Nexus integrate with existing ERP systems?",
      a: "FieldOps Nexus provides bi-directional REST APIs and webhooks that synchronize inventory levels, purchase requests, asset cost ledgers, and workforce timesheets with SAP, Oracle, NetSuite, and Microsoft Dynamics.",
    },
    {
      q: "Can field technicians work offline without internet connectivity?",
      a: "Yes. The FieldOps mobile interface stores assigned work orders, asset documentation, and inspection forms locally. All signatures, photos, and status updates automatically sync when network access is restored.",
    },
    {
      q: "How is Role-Based Access Control (RBAC) enforced?",
      a: "FieldOps Nexus features granular role definitions for Super Admins, Asset Managers, Maintenance Planners, Technicians, Storekeepers, Auditors, and Clients, ensuring users only access verified data within their operational scope.",
    },
    {
      q: "What level of audit traceability is maintained?",
      a: "Every work order update, status transition, part allocation, signature, and checklist entry is permanently logged with an immutable timestamp and user identifier.",
    },
  ]

  const filteredArticles = resourceArticles.filter((art) => {
    const matchesCat = activeCategory === "All" || art.category === activeCategory
    const matchesQuery = searchQuery === "" || art.title.toLowerCase().includes(searchQuery.toLowerCase()) || art.desc.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesQuery
  })

  return (
    <div className="w-full bg-white">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-[#0B1F3B] text-white pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-400 mb-6">
              <BookOpen size={13} className="text-gold-400" />
              FIELDOPS NEXUS RESOURCES
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
              Insights and resources for modern field operations.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-white/75 leading-relaxed">
              Explore enterprise operational guides, technical documentation, architectural blueprints, and industry best practices designed to optimize field reliability.
            </p>

            {/* Quick Search */}
            <div className="mt-8 max-w-md mx-auto relative">
              <input
                type="text"
                placeholder="Search guides, docs, or playbooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 pl-11 text-sm text-white placeholder:text-white/50 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400 backdrop-blur-md"
              />
              <Search size={18} className="absolute left-3.5 top-4 text-white/50" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Featured Resource Section ── */}
      <section className="py-16 bg-[#F8FAFC] border-b border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="rounded-2xl border border-border bg-white p-6 sm:p-10 shadow-sm">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5">
                <div className="rounded-xl bg-navy-900 p-6 text-white border border-border shadow-inner">
                  <div className="flex items-center justify-between text-xs text-gold-400 mb-4">
                    <span className="font-bold uppercase tracking-wider">FEATURED PLAYBOOK</span>
                    <span>8 Min Read</span>
                  </div>
                  <div className="size-12 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center mb-4">
                    <Boxes size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    Enterprise Asset Lifecycle & Preventive Maintenance Playbook
                  </h4>
                  <p className="mt-3 text-xs text-white/70 leading-relaxed">
                    Key chapters: Structuring Parent-Child Hierarchies, Dynamic PM Triggers, MTBF Optimization, and Inventory Safety Buffers.
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-gold-400">
                    <span>FieldOps Operations Team</span> • <span>Updated Oct 2026</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <span className="rounded bg-gold-50 text-gold-700 px-2.5 py-1 text-xs font-bold uppercase tracking-wider border border-gold-200">
                  Featured Resource
                </span>
                <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-navy-900">
                  The Blueprint for Connected Enterprise Maintenance
                </h3>
                <p className="mt-4 text-sm sm:text-base text-text-secondary leading-relaxed">
                  Discover how top industrial and facilities management organizations eliminate unplanned downtime by transitioning from reactive firefighting to precision, data-driven preventive maintenance.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 text-xs font-medium text-navy-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Asset hierarchy standards
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Predictive telemetry setup
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Technician SLA benchmarks
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    Audit checklist models
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => onNavigate("maintenance-management")}
                    className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-6 py-3 text-xs font-bold text-white transition-colors hover:bg-navy-800"
                  >
                    Read Resource <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Filter & Grid ── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-navy-900 text-gold-400 shadow-sm"
                    : "bg-surface text-navy-800 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((art, idx) => (
              <Reveal key={art.title} delay={idx * 60}>
                <div className="group flex flex-col justify-between h-full rounded-xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400 hover:shadow-xl hover:shadow-navy-950/10">
                  <div>
                    <div className="flex items-center justify-between mb-3 text-[11px]">
                      <span className="font-bold text-gold-600 uppercase tracking-wider">{art.category}</span>
                      <span className="text-text-secondary">{art.readTime}</span>
                    </div>
                    <h4 className="text-base font-bold text-navy-900 group-hover:text-gold-600 transition-colors leading-snug">
                      {art.title}
                    </h4>
                    <p className="mt-3 text-xs text-text-secondary leading-relaxed line-clamp-3">
                      {art.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-text-secondary text-[11px]">{art.date}</span>
                    <button
                      onClick={() => onNavigate("asset-management")}
                      className="inline-flex items-center gap-1 font-bold text-navy-900 group-hover:text-gold-600 group-hover:translate-x-1 transition-all"
                    >
                      Read Article <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Operational FAQ Section ── */}
      <section className="py-20 lg:py-24 bg-[#F8FAFC] border-t border-border">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <Reveal className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy-800 mb-2">
              <HelpCircle size={13} className="text-gold-600" />
              ENTERPRISE PLATFORM FAQ
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900">
              Frequently Asked Operational Questions
            </h2>
          </Reveal>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Reveal key={idx} delay={idx * 80}>
                <div className="rounded-xl border border-border bg-white p-5 sm:p-6 shadow-sm">
                  <h4 className="text-base font-bold text-navy-900 flex items-start gap-3">
                    <span className="text-gold-600 font-extrabold">Q:</span>
                    {faq.q}
                  </h4>
                  <p className="mt-3 text-sm text-text-secondary pl-7 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Resources CTA ── */}
      <section className="py-24 bg-[#0B1F3B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
        <Reveal className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Empower your operations with FieldOps Nexus
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed">
            Ready to deploy enterprise best practices across your field teams and asset footprint?
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate("login")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-8 py-4 text-sm font-bold text-navy-950 transition-colors hover:bg-gold-400"
            >
              Explore Platform <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate("features")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              View Features
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

// ============================================================================
// 3. DEDICATED ABOUT PAGE
// ============================================================================
function AboutPageContent({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const principles = [
    {
      title: "Connected Operations",
      icon: Layers3,
      desc: "We eliminate isolated tool silos by binding assets, work orders, technician dispatch, and spare parts into one unified operational loop.",
    },
    {
      title: "Operational Visibility",
      icon: Activity,
      desc: "Every stakeholder, from the shop floor technician to executive leadership, sees accurate, real-time status without waiting on manual reports.",
    },
    {
      title: "Traceability & Compliance",
      icon: ShieldCheck,
      desc: "Complete audit trails, cryptographic timestamps, and mandatory photo verification protect operational integrity at scale.",
    },
    {
      title: "Workflow Precision",
      icon: Settings2,
      desc: "Standardized digital SOPs ensure every service ticket and maintenance plan is executed with consistent high quality.",
    },
    {
      title: "Data-Driven Decisions",
      icon: BarChart3,
      desc: "Turn live sensor readings, MTTR metrics, and inventory turnover data into proactive maintenance and budgeting intelligence.",
    },
  ]

  const ecosystemEntities = [
    { label: "Organizations", desc: "Multi-site enterprise hierarchy", icon: Building2 },
    { label: "Assets", desc: "Critical machinery & components", icon: Boxes },
    { label: "Technicians", desc: "Certified mobile field workforce", icon: Users },
    { label: "Service Requests", desc: "Client & sensor intake channel", icon: FileCheck2 },
    { label: "Work Orders", desc: "Structured dispatch & execution", icon: ClipboardList },
    { label: "Inventory", desc: "Warehouses & van stock ledger", icon: Package },
    { label: "Analytics", desc: "Real-time MTTR & SLA reports", icon: BarChart3 },
    { label: "Audit Trail", desc: "Immutable compliance history", icon: ShieldCheck },
  ]

  return (
    <div className="w-full bg-white">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-[#0B1F3B] text-white pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-400 mb-6">
                  <Globe size={13} className="text-gold-400" />
                  ABOUT FIELDOPS NEXUS
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
                  Connected operations.{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
                    Clearer execution.
                  </span>
                </h1>
                <p className="mt-6 max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed">
                  FieldOps Nexus is the enterprise platform purpose-built for the teams who maintain critical infrastructure, manufacture essential goods, and manage complex physical operations every day.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={() => onNavigate("login")}
                    className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3.5 text-sm font-bold text-navy-950 transition-all hover:bg-gold-400"
                  >
                    Explore Platform <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => onNavigate("features")}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
                  >
                    View Platform Capabilities
                  </button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal direction="left" delay={200}>
                <UIWindow title="FieldOps Nexus • Mission & Architecture">
                  <div className="p-4 space-y-3 text-xs bg-white rounded-lg border border-border">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gold-600">
                      OPERATIONAL FOCUS
                    </p>
                    <p className="text-sm font-bold text-navy-900 leading-snug">
                      Built for the physical work that cannot fail.
                    </p>
                    <p className="text-text-secondary text-xs leading-relaxed">
                      We unify asset health, field dispatch, parts availability, and compliance sign-offs into a single real-time truth.
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                      <div className="p-2 rounded bg-surface text-center">
                        <p className="text-[9px] text-text-secondary">Core Platform</p>
                        <p className="font-bold text-navy-900">Field ERP</p>
                      </div>
                      <div className="p-2 rounded bg-surface text-center">
                        <p className="text-[9px] text-text-secondary">Availability</p>
                        <p className="font-bold text-emerald-600">Enterprise Cloud</p>
                      </div>
                    </div>
                  </div>
                </UIWindow>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Platform Story Section ── */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC] border-b border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">
              THE PLATFORM CONCEPT
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              How FieldOps Nexus unifies physical operations
            </h2>
            <p className="mt-4 text-base text-text-secondary">
              Physical operations rely on interconnected elements. When any link is broken, downtime strikes.
            </p>
          </Reveal>

          {/* Connected Sequence Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {[
              { num: "01", name: "Organizations", desc: "Multi-site enterprise governance" },
              { num: "02", name: "Assets", desc: "Equipment condition & telemetry" },
              { num: "03", name: "People", desc: "Technicians, planners & auditors" },
              { num: "04", name: "Service", desc: "Automated ticket triage & SLA" },
              { num: "05", name: "Workflows", desc: "Standardized SOP checklists" },
              { num: "06", name: "Insights", desc: "Actionable executive intelligence" },
            ].map((node, i) => (
              <Reveal key={node.num} delay={i * 70}>
                <div className="relative flex flex-col justify-between h-full rounded-xl border border-border bg-white p-5 shadow-sm">
                  <div>
                    <span className="text-xs font-black text-gold-500">{node.num}</span>
                    <h4 className="text-base font-bold text-navy-900 mt-2">{node.name}</h4>
                    <p className="text-xs text-text-secondary mt-1">{node.desc}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-border/60 flex items-center text-emerald-600 text-[10px] font-bold">
                    <Check size={12} className="mr-1" /> Connected
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform Principles Section ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">
              CORE PRINCIPLES
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Built on uncompromising operational foundations
            </h2>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((pr, idx) => {
              const PrIcon = pr.icon
              return (
                <Reveal key={pr.title} delay={idx * 70}>
                  <div className="group flex flex-col justify-between h-full rounded-xl border border-border bg-[#F8FAFC] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400 hover:bg-white hover:shadow-xl hover:shadow-navy-950/5">
                    <div>
                      <div className="flex size-12 items-center justify-center rounded-lg bg-navy-800 text-gold-400 group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors mb-5">
                        <PrIcon size={22} />
                      </div>
                      <h3 className="text-lg font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                        {pr.title}
                      </h3>
                      <p className="mt-3 text-xs text-text-secondary leading-relaxed">
                        {pr.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Platform Ecosystem Section ── */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC] border-t border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">
              ECOSYSTEM ARCHITECTURE
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              One interconnected platform for every operational role
            </h2>
            <p className="mt-4 text-base text-text-secondary">
              FieldOps Nexus links roles and data across the entire physical operational lifecycle.
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ecosystemEntities.map((ent, idx) => {
              const EntIcon = ent.icon
              return (
                <Reveal key={ent.label} delay={idx * 50}>
                  <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-5 shadow-sm hover:border-gold-400 transition-all">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-navy-800 text-gold-400">
                      <EntIcon size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy-900">{ent.label}</h4>
                      <p className="text-[11px] text-text-secondary mt-0.5">{ent.desc}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── About CTA ── */}
      <section className="py-24 bg-[#0B1F3B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
        <Reveal className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Discover FieldOps Nexus
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed">
            Experience how connected operational execution transforms equipment uptime, workforce productivity, and audit compliance.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate("login")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-8 py-4 text-sm font-bold text-navy-950 transition-colors hover:bg-gold-400"
            >
              Explore Platform <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate("features")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              View All Features
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

// ============================================================================
// 4. MODULE & SOLUTION MARKETING PAGES
// ============================================================================
interface PageMeta {
  title: string
  subtitle: string
  tagline: string
  description: string
  metrics: [string, string, string][]
  features: { title: string; desc: string; icon: Icon }[]
  heroVisual: () => ReactNode
}

const PAGE_DATA: Record<string, PageMeta> = {
  "asset-management": {
    title: "Asset Management",
    subtitle: "Enterprise Asset Tracking & Hierarchy",
    tagline: "Know the condition, history, and location of every critical asset.",
    description: "Track physical assets across complex enterprise sites, maintain granular parent-child hierarchies, and monitor live operational telemetry with zero blind spots.",
    metrics: [
      ["2,846", "Active Assets Monitored", "Across 14 facilities"],
      ["99.4%", "Asset Uptime", "+2.4% vs last quarter"],
      ["$1.4M", "Downtime Prevented", "Estimated annual savings"],
    ],
    features: [
      { title: "Parent-Child Hierarchy", desc: "Build multi-tier asset trees from regional sites down to individual components.", icon: Boxes },
      { title: "QR & Barcode Tagging", desc: "Instant mobile lookup by scanning physical tags on machinery and field hardware.", icon: Search },
      { title: "Telemetry & Logs", desc: "Real-time vibration, temperature, and operating hours tracking with automated alerts.", icon: Activity },
      { title: "Lifecycle & Depreciation", desc: "Calculate depreciation schedules, track replacement warranties, and budget renewals.", icon: TrendingUp },
    ],
    heroVisual: () => (
      <UIWindow title="Asset Management Console">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-white p-3 border border-border">
            <div>
              <p className="text-xs font-bold text-navy-800">Primary HVAC Chiller #CH-01</p>
              <p className="text-[10px] text-text-secondary">Building 4 • Central Plant • Critical Class A</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Healthy</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded border border-border bg-white p-2">
              <span className="text-[9px] text-text-secondary">Runtime</span>
              <p className="font-bold text-navy-800">4,120 hrs</p>
            </div>
            <div className="rounded border border-border bg-white p-2">
              <span className="text-[9px] text-text-secondary">Temp</span>
              <p className="font-bold text-navy-800">42.4 °F</p>
            </div>
            <div className="rounded border border-border bg-white p-2">
              <span className="text-[9px] text-text-secondary">Next PM</span>
              <p className="font-bold text-gold-600">8 Days</p>
            </div>
          </div>
        </div>
      </UIWindow>
    ),
  },
  "service-management": {
    title: "Service Management",
    subtitle: "Customer Intake & SLA Triage",
    tagline: "Deliver responsive, predictable service from intake to resolution.",
    description: "Streamline client service requests, enforce strict contractual SLAs, and route tickets intelligently to eliminate operational bottlenecks.",
    metrics: [
      ["14 min", "Average First Response", "Down from 45 min"],
      ["98.7%", "SLA Compliance", "Exceeding enterprise commitments"],
      ["4.9 / 5", "Client Satisfaction", "Across 1,200+ service closures"],
    ],
    features: [
      { title: "Multi-Channel Intake", desc: "Receive tickets via client portal, email triggers, or automated sensor thresholds.", icon: FileText },
      { title: "Dynamic SLA Timers", desc: "Automated prioritization countdowns with escalation warnings before breaches occur.", icon: Clock },
      { title: "Client Portal Access", desc: "Real-time tracking for external stakeholders with digital sign-off and approvals.", icon: Users },
      { title: "First-Time Fix Analytics", desc: "Measure technician efficiency, diagnostic accuracy, and resolution time.", icon: CheckCircle2 },
    ],
    heroVisual: () => (
      <UIWindow title="Service Request Queue">
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between rounded bg-white p-2.5 border border-border">
            <div>
              <span className="font-bold text-navy-800">SR-4091: Hydraulic Pressure Drop</span>
              <p className="text-[10px] text-text-secondary">Client: Precision Logistics Inc.</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">SLA: 2h 14m left</span>
          </div>
          <div className="flex items-center justify-between rounded bg-white p-2.5 border border-border">
            <div>
              <span className="font-bold text-navy-800">SR-4092: Conveyor Belt Sensor Alert</span>
              <p className="text-[10px] text-text-secondary">Client: Apex Manufacturing</p>
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Triage Stage</span>
          </div>
        </div>
      </UIWindow>
    ),
  },
  "work-order-management": {
    title: "Work Order Management",
    subtitle: "End-to-End Task Orchestration",
    tagline: "Plan, assign, and track work orders with absolute clarity.",
    description: "Equip planners and technicians with clear digital work orders, parts staging, safety checklists, and audit-ready digital signatures.",
    metrics: [
      ["142", "Active Work Orders", "88% on schedule"],
      ["3.2 hrs", "Average Turnaround", "38% improvement"],
      ["100%", "Checklist Compliance", "Mandatory safety verification"],
    ],
    features: [
      { title: "Digital Work Packages", desc: "Complete job instructions, required tools, parts list, and hazard notes.", icon: ClipboardList },
      { title: "Skills-Based Dispatch", desc: "Match orders to technician certifications, vehicle loadout, and GPS location.", icon: Radio },
      { title: "Mobile Execution", desc: "Native field experience with offline mode, voice-to-text, and camera photo capture.", icon: HardHat },
      { title: "Digital Sign-Off", desc: "Secure electronic sign-offs from supervisors and clients upon completion.", icon: ShieldCheck },
    ],
    heroVisual: () => (
      <UIWindow title="Work Order #WO-8820">
        <div className="space-y-2 text-xs bg-white p-3 rounded-lg border border-border">
          <div className="flex justify-between items-center border-b border-border pb-2">
            <span className="font-bold text-navy-800">Compressor Bearing Replacement</span>
            <span className="bg-gold-500 text-navy-950 font-bold px-2 py-0.5 rounded text-[10px]">In Progress</span>
          </div>
          <div className="text-[11px] space-y-1 text-text-secondary">
            <p>Technician: Marcus Chen (Certified Tier 3)</p>
            <p>Parts: Bearings Kit #BK-400 (Allocated from Van 2)</p>
            <p className="text-emerald-600 font-semibold">✓ Safety Lockout Tagout Verified</p>
          </div>
        </div>
      </UIWindow>
    ),
  },
  "inventory-management": {
    title: "Inventory & Spare Parts",
    subtitle: "Multi-Warehouse & Van Stock Control",
    tagline: "Keep essential parts moving without overstocking.",
    description: "Eliminate stockouts and delays with multi-location inventory tracking, automated min/max reordering, and barcode scanning.",
    metrics: [
      ["99.8%", "Inventory Accuracy", "Verified by cycle counts"],
      ["0", "Stockout Delays", "Across critical Tier 1 components"],
      ["$450K", "Working Capital Saved", "Optimized reorder points"],
    ],
    features: [
      { title: "Multi-Site Warehousing", desc: "Track central warehouses, regional distribution hubs, and mobile van inventories.", icon: Package },
      { title: "Automated Reordering", desc: "Trigger purchase orders automatically when stock hits safety thresholds.", icon: TrendingUp },
      { title: "Part Reservation", desc: "Reserve parts automatically when work orders are scheduled.", icon: CheckCircle2 },
      { title: "Cycle Counting", desc: "Continuous verification workflows with mobile barcode and RFID scanning.", icon: Search },
    ],
    heroVisual: () => (
      <UIWindow title="Inventory Hub">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center bg-white p-2.5 rounded border border-border">
            <div>
              <p className="font-bold text-navy-800">Hydraulic Seal Kit (SKU: HSK-901)</p>
              <p className="text-[10px] text-text-secondary">Central Warehouse • Bin C-14</p>
            </div>
            <span className="font-bold text-navy-800">42 in stock</span>
          </div>
          <div className="flex justify-between items-center bg-white p-2.5 rounded border border-border">
            <div>
              <p className="font-bold text-navy-800">Filter Cartridge (SKU: FC-220)</p>
              <p className="text-[10px] text-text-secondary">Van 04 Stock • Assigned to E. Rostova</p>
            </div>
            <span className="font-bold text-gold-600">4 left (Reorder)</span>
          </div>
        </div>
      </UIWindow>
    ),
  },
  "maintenance-management": {
    title: "Maintenance Management",
    subtitle: "Preventive & Predictive Scheduling",
    tagline: "Stay ahead of equipment downtime with proactive maintenance.",
    description: "Automate preventive maintenance schedules, track equipment health degradation, and shift from reactive firefighting to predictive reliability.",
    metrics: [
      ["42%", "Reduction in Downtime", "Over 12-month deployment"],
      ["94%", "PM Completion Rate", "On-time maintenance execution"],
      ["3.5x", "Equipment Life Extension", "Calculated on rotating assets"],
    ],
    features: [
      { title: "Calendar & Meter PMs", desc: "Trigger maintenance based on calendar intervals, operating hours, or cycle counts.", icon: Settings2 },
      { title: "Inspection Checklists", desc: "Standardized pass/fail criteria with mandatory measurements and tolerances.", icon: ClipboardList },
      { title: "Condition Monitoring", desc: "Automate work orders when sensor vibration or thermal readings exceed thresholds.", icon: Activity },
      { title: "Compliance Audits", desc: "Ensure statutory safety and regulatory maintenance requirements are met.", icon: ShieldCheck },
    ],
    heroVisual: () => (
      <UIWindow title="Preventive Maintenance Calendar">
        <div className="space-y-2 text-xs bg-white p-3 rounded-lg border border-border">
          <div className="flex justify-between items-center">
            <span className="font-bold text-navy-800">Weekly Turbine Lube Schedule</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Every 168 hrs</span>
          </div>
          <p className="text-[11px] text-text-secondary">Target: Turbine Pump 01-04 • Est. Time: 1.5 hrs</p>
          <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
            <div className="h-full bg-gold-500 rounded-full w-[85%]" />
          </div>
          <p className="text-[10px] text-gold-600 font-medium">85% of monthly scheduled PMs completed</p>
        </div>
      </UIWindow>
    ),
  },
  "workforce-management": {
    title: "Workforce Management",
    subtitle: "Technician Dispatch & Skill Matrices",
    tagline: "Give every field team member the context to do their best work.",
    description: "Coordinate technician schedules, track real-time job progression, and empower field teams with intuitive mobile tools.",
    metrics: [
      ["68", "Field Technicians", "Fully coordinated via mobile app"],
      ["28%", "Increase in Capacity", "More jobs completed per technician"],
      ["99.2%", "Time Card Accuracy", "Automated GPS geofence clock-in"],
    ],
    features: [
      { title: "Skill & Certification Matrix", desc: "Ensure high-voltage or confined-space jobs are only assigned to certified techs.", icon: Users },
      { title: "Live Dispatch Map", desc: "Visualize technician locations, active routes, and nearest emergencies in real time.", icon: Radio },
      { title: "Mobile First Design", desc: "Zero-clutter interface tailored for outdoor tablets and smartphones.", icon: HardHat },
      { title: "Performance Scorecards", desc: "Track first-time fix rates, average completion time, and client feedback.", icon: BarChart3 },
    ],
    heroVisual: () => (
      <UIWindow title="Field Dispatch Radar">
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between bg-white p-2.5 rounded border border-border">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-navy-800">Marcus K. (HVAC Specialist)</span>
            </div>
            <span className="text-[10px] text-text-secondary">Bay Area North • On Job</span>
          </div>
          <div className="flex items-center justify-between bg-white p-2.5 rounded border border-border">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-gold-500" />
              <span className="font-bold text-navy-800">Elena R. (Electrical Tier 3)</span>
            </div>
            <span className="text-[10px] text-text-secondary">En Route to WO-8841</span>
          </div>
        </div>
      </UIWindow>
    ),
  },
  "analytics-reporting": {
    title: "Analytics & Reporting",
    subtitle: "Executive Operational Intelligence",
    tagline: "Turn operational data into confident decisions.",
    description: "Gain full executive visibility into equipment MTTR, technician utilization, parts spend, and SLA performance across all enterprise locations.",
    metrics: [
      ["18", "Pre-Built Dashboards", "Executive, operational, and audit"],
      ["100%", "Real-Time Data", "No manual batch exports required"],
      ["360°", "Operational View", "Assets, service, inventory, and cost"],
    ],
    features: [
      { title: "MTTR & MTBF Trends", desc: "Pinpoint deteriorating assets before catastrophic failure happens.", icon: TrendingUp },
      { title: "Cost & Budget Analytics", desc: "Track parts consumption, contractor hours, and total cost of asset ownership.", icon: BarChart3 },
      { title: "SLA Adherence Reports", desc: "Automate weekly and monthly compliance reports for enterprise clients.", icon: Clock },
      { title: "Custom BI Exports", desc: "Export clean CSV, PDF, and scheduled email reports to leadership.", icon: FileText },
    ],
    heroVisual: () => (
      <UIWindow title="Executive KPI Dashboard">
        <div className="space-y-2 text-xs bg-white p-3 rounded border border-border">
          <div className="flex justify-between text-navy-800 font-bold">
            <span>Overall Fleet MTBF</span>
            <span className="text-emerald-600">842 hrs (+12%)</span>
          </div>
          <div className="flex items-end gap-1.5 h-16 pt-2">
            {[45, 60, 50, 75, 65, 90, 85, 95].map((h, i) => (
              <span key={i} className={`flex-1 rounded-t ${i === 7 ? "bg-gold-500" : "bg-navy-800/20"}`} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </UIWindow>
    ),
  },
  "audit-traceability": {
    title: "Audit & Traceability",
    subtitle: "Immutable Operational Records",
    tagline: "Maintain a complete history of all operational activities.",
    description: "Satisfy rigorous regulatory audits and ISO compliance with tamper-evident digital records, photo proof, and timestamped supervisor sign-offs.",
    metrics: [
      ["100%", "Audit Readiness", "Instant electronic log generation"],
      ["Zero", "Missing Sign-Offs", "Enforced digital gatekeeper rules"],
      ["ISO 55000", "Aligned Architecture", "Physical asset management ready"],
    ],
    features: [
      { title: "Immutable Audit Log", desc: "Every status change, technician note, and part consumed is permanently recorded.", icon: ShieldCheck },
      { title: "Digital Signature Capture", desc: "Touchscreen sign-offs with GPS location and cryptographic hash.", icon: CheckCircle2 },
      { title: "Regulatory Compliance", desc: "Pre-configured templates for OSHA, EPA, and ISO facility audits.", icon: FileText },
      { title: "Photo & Document Archive", desc: "Attach before-and-after work photos with immutable timestamps.", icon: Boxes },
    ],
    heroVisual: () => (
      <UIWindow title="Audit Trail Ledger">
        <div className="space-y-2 text-xs bg-white p-3 rounded border border-border">
          <div className="flex items-center justify-between text-[11px] border-b border-border pb-1.5">
            <span className="font-bold text-navy-800">WO-8820 Completed & Signed</span>
            <span className="text-emerald-600 font-mono text-[10px]">Verified ✓</span>
          </div>
          <p className="text-[10px] text-text-secondary font-mono">Timestamp: 2026-10-04T05:14:22Z</p>
          <p className="text-[10px] text-text-secondary font-mono">Supervisor: Sarah Jenkins (ID #882)</p>
          <p className="text-[10px] text-gold-600 font-mono">Hash: 8f4a9b2c...09e1</p>
        </div>
      </UIWindow>
    ),
  },
  "manufacturing": {
    title: "Manufacturing Solutions",
    subtitle: "Heavy Industry & Production Uptime",
    tagline: "Keep production-critical assets and lines running without downtime.",
    description: "Maintain assembly lines, stamping presses, and robotic cells with precision preventive maintenance schedules and rapid breakdown dispatch.",
    metrics: [
      ["$2.1M", "Downtime Prevented", "Average per plant deployment"],
      ["99.6%", "Line Availability", "Production output protected"],
      ["15 min", "First Response to Fault", "Automated PLC alert routing"],
    ],
    features: [
      { title: "Line Stoppage Alarms", desc: "Integrate SCADA/PLC alarms to trigger emergency work orders automatically.", icon: Factory },
      { title: "Tooling & Die Tracking", desc: "Track tooling wear cycles, refurbishments, and storage locations.", icon: Settings2 },
      { title: "Shift Handover Notes", desc: "Structured shift logs ensure incoming maintenance teams have full context.", icon: ClipboardList },
      { title: "Total Productive Maintenance", desc: "Empower line operators to perform autonomous first-level inspections.", icon: CheckCircle2 },
    ],
    heroVisual: () => (
      <UIWindow title="Manufacturing Line Monitor">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center bg-white p-2.5 rounded border border-border">
            <span className="font-bold text-navy-800">Assembly Cell 04: Robotic Welder</span>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Running • 100% Speed</span>
          </div>
          <div className="flex justify-between items-center bg-white p-2.5 rounded border border-border">
            <span className="font-bold text-navy-800">Stamping Press Beta</span>
            <span className="text-gold-600 font-bold bg-amber-50 px-2 py-0.5 rounded">PM Due in 4 hrs</span>
          </div>
        </div>
      </UIWindow>
    ),
  },
  "facilities": {
    title: "Facilities Management",
    subtitle: "Commercial & Corporate Infrastructure",
    tagline: "Coordinate spaces, people, and tenant service delivery.",
    description: "Manage HVAC chillers, elevators, fire suppression systems, and occupant work requests across multi-tenant commercial real estate.",
    metrics: [
      ["12M+", "Sq. Ft. Managed", "Across corporate campuses"],
      ["35%", "Faster Work Order Closure", "Tenant request satisfaction"],
      ["18%", "Energy Reduction", "Optimized HVAC maintenance cycles"],
    ],
    features: [
      { title: "Tenant Request Portal", desc: "Simple web portal for building tenants to submit and track maintenance requests.", icon: Building2 },
      { title: "Life Safety & Compliance", desc: "Automate periodic inspections for fire doors, extinguishers, and emergency power.", icon: ShieldCheck },
      { title: "Vendor & Contractor Control", desc: "Issue electronic work permits and verify vendor insurance certificates.", icon: Users },
      { title: "Space & Asset Hierarchy", desc: "Map assets by building, floor, zone, and room for instant navigation.", icon: Boxes },
    ],
    heroVisual: () => (
      <UIWindow title="Facilities Central Hub">
        <div className="space-y-2 text-xs bg-white p-3 rounded border border-border">
          <div className="flex justify-between text-navy-800 font-bold">
            <span>Tower Alpha: 32 Floors</span>
            <span className="text-emerald-600">All Systems Nominal</span>
          </div>
          <p className="text-[10px] text-text-secondary">Open Tenant Requests: 3 • Scheduled PMs: 6</p>
        </div>
      </UIWindow>
    ),
  },
  "enterprise-operations": {
    title: "Enterprise Operations",
    subtitle: "Scalable Multi-Site Infrastructure",
    tagline: "Unify complex operations across your organization.",
    description: "Standardize field operations across multi-country facilities with unified data governance, consolidated inventory, and executive dashboards.",
    metrics: [
      ["100+", "Sites Synchronized", "Under one enterprise tenant"],
      ["Global", "Role-Based Security", "Enterprise SSO & Active Directory"],
      ["24/7", "High Availability", "99.99% cloud uptime SLA"],
    ],
    features: [
      { title: "Multi-Entity Architecture", desc: "Segregate business units while maintaining corporate roll-up reporting.", icon: Building2 },
      { title: "Custom Integrations", desc: "Connect with SAP, Oracle, NetSuite, and existing IoT sensor streams.", icon: Database },
      { title: "Enterprise SLA SLAs", desc: "Define tiered SLA matrix contracts for different facilities and regions.", icon: Clock },
      { title: "Security & Compliance", desc: "SOC 2 Type II certified infrastructure with full cryptographic audit trails.", icon: ShieldCheck },
    ],
    heroVisual: () => (
      <UIWindow title="Enterprise Multi-Site Map">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center bg-white p-2.5 rounded border border-border">
            <span className="font-bold text-navy-800">North America Region (12 Sites)</span>
            <span className="text-emerald-600 font-bold">99.8% SLA</span>
          </div>
          <div className="flex justify-between items-center bg-white p-2.5 rounded border border-border">
            <span className="font-bold text-navy-800">EMEA Operations (8 Sites)</span>
            <span className="text-emerald-600 font-bold">99.5% SLA</span>
          </div>
        </div>
      </UIWindow>
    ),
  },
}

// ─── Generic Module Page Component ──────────────────────────────────────────
function ModulePageContent({ page, onNavigate }: { page: string; onNavigate: (page: Page) => void }) {
  const data = PAGE_DATA[page] || PAGE_DATA["asset-management"]

  return (
    <div className="w-full bg-white">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-[#0B1F3B] text-white pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-400 mb-6">
                  <Sparkles size={13} className="text-gold-400" />
                  {data.subtitle}
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
                  {data.title}
                </h1>
                <p className="mt-4 text-xl font-medium text-gold-400">
                  {data.tagline}
                </p>
                <p className="mt-4 max-w-2xl text-base text-white/75 leading-relaxed">
                  {data.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    onClick={() => onNavigate("login")}
                    className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-6 py-3.5 text-sm font-bold text-navy-950 transition-all hover:bg-gold-400"
                  >
                    Explore Module <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => onNavigate("features")}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
                  >
                    All Features
                  </button>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal direction="left" delay={200}>
                {data.heroVisual()}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Metrics Strip ── */}
      <section className="border-b border-border bg-[#F8FAFC] py-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {data.metrics.map(([val, label, note], i) => (
              <Reveal key={i} delay={i * 100} className="border-l-2 border-gold-500 pl-4">
                <p className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">{val}</p>
                <p className="text-sm font-bold text-navy-800 mt-1">{label}</p>
                <p className="text-xs text-text-secondary mt-0.5">{note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">CAPABILITIES</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Engineered for Enterprise Scale
            </h2>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.features.map((feat, i) => {
              const FeatIcon = feat.icon
              return (
                <Reveal key={i} delay={i * 80}>
                  <div className="group flex flex-col justify-between h-full rounded-xl border border-border bg-[#F8FAFC] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400 hover:bg-white hover:shadow-lg">
                    <div>
                      <div className="flex size-12 items-center justify-center rounded-lg bg-navy-800 text-gold-400 group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors mb-4">
                        <FeatIcon size={22} />
                      </div>
                      <h3 className="text-lg font-bold text-navy-900 group-hover:text-gold-600 transition-colors">{feat.title}</h3>
                      <p className="mt-2 text-xs text-text-secondary leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Module CTA ── */}
      <section className="py-24 bg-[#0B1F3B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
        <Reveal className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Ready to deploy {data.title}?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-white/70">
            Connect this capability with your entire operational ecosystem in FieldOps Nexus.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate("login")}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-8 py-4 text-sm font-bold text-navy-950 transition-colors hover:bg-gold-400"
            >
              Explore Platform <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigate("features")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              All Features
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

// ============================================================================
// MAIN MARKETING PAGES DISPATCHER
// ============================================================================
export default function MarketingPages({ page, onNavigate }: { page: Page; onNavigate: (page: Page) => void }) {
  if (page === "features") {
    return <FeaturesPageContent onNavigate={onNavigate} />
  }

  if (page === "resources") {
    return <ResourcesPageContent onNavigate={onNavigate} />
  }

  if (page === "about") {
    return <AboutPageContent onNavigate={onNavigate} />
  }

  // Fallback / standard module & solution pages
  return <ModulePageContent page={page} onNavigate={onNavigate} />
}
