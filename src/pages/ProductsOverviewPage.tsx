import { ElementType, useEffect, useRef, useState, ReactNode } from "react"
import {
  Sparkles,
  ChevronRight,
  Boxes,
  Wrench,
  ClipboardList,
  Package,
  Settings2,
  Users,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Workflow,
  Activity,
  Layers3,
} from "lucide-react"
import type { Page } from "../types"
import StandardizedPageCTA from "../components/ui/StandardizedPageCTA"

type Icon = ElementType

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
      { threshold, rootMargin: "0px 0px -40px 0px" }
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

interface Props {
  onNavigate: (page: Page) => void
}

export default function ProductsOverviewPage({ onNavigate }: Props) {
  const productCapabilities = [
    {
      title: "Asset Management",
      page: "asset-management" as Page,
      icon: Boxes,
      tag: "Asset Intelligence",
      description: "Know the condition, maintenance history, telemetry, and lifecycle status of every critical asset in real time.",
      stat: "2,846 Active Assets",
    },
    {
      title: "Service Management",
      page: "service-management" as Page,
      icon: Wrench,
      tag: "Field Service",
      description: "Deliver predictable, high-touch field service from automated ticket intake to rapid first-time resolution.",
      stat: "99.4% SLA Adherence",
    },
    {
      title: "Work Order Management",
      page: "work-order-management" as Page,
      icon: ClipboardList,
      tag: "Work Execution",
      description: "Plan, prioritize, assign, and track complex work orders with task checklists, safety permits, and parts staging.",
      stat: "142 Active Orders",
    },
    {
      title: "Inventory Management",
      page: "inventory-management" as Page,
      icon: Package,
      tag: "Parts & Materials",
      description: "Keep essential spare parts, tooling, and consumables synchronized across central warehouses and technician vans.",
      stat: "99.8% Accuracy",
    },
    {
      title: "Maintenance Management",
      page: "maintenance-management" as Page,
      icon: Settings2,
      tag: "Preventive Care",
      description: "Prevent unexpected equipment downtime through automated PM schedules, inspection triggers, and calibration cycles.",
      stat: "42% Less Downtime",
    },
    {
      title: "Workforce Management",
      page: "workforce-management" as Page,
      icon: Users,
      tag: "Field Crews",
      description: "Equip mobile technicians and supervisors with skill-based scheduling, real-time routing, and job telemetry.",
      stat: "68 Field Techs",
    },
    {
      title: "Analytics & Reporting",
      page: "analytics-reporting" as Page,
      icon: BarChart3,
      tag: "Intelligence",
      description: "Convert telemetry and operational logs into actionable executive dashboards, MTTR trends, and cost metrics.",
      stat: "18 Executive Reports",
    },
    {
      title: "Audit & Traceability",
      page: "audit-traceability" as Page,
      icon: ShieldCheck,
      tag: "Compliance",
      description: "Maintain an immutable, timestamped audit trail of every signature, part consumption, and compliance sign-off.",
      stat: "100% Traceability",
    },
  ]

  return (
    <div className="w-full bg-white">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-[#0B1F3B] text-white pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -top-32 right-1/4 size-[420px] rounded-full bg-[#F5C451]/[0.06] blur-3xl"
          aria-hidden="true"
        />

        {/* Breadcrumb */}
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pb-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-medium text-white/50">
            <button
              type="button"
              onClick={() => onNavigate("landing")}
              className="hover:text-white/80 transition-colors"
            >
              Home
            </button>
            <ChevronRight size={11} className="text-white/30 shrink-0" />
            <span className="text-white/90 font-semibold">Product Platform</span>
          </nav>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 text-center max-w-4xl">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-400 mb-6">
              <Sparkles size={13} className="text-gold-400" />
              FIELDOPS NEXUS PLATFORM
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1] text-[#F8FAFC]">
              Enterprise Operations Platform
            </h1>
            <p className="mt-4 text-xl font-medium text-gold-400">
              Connected service, asset, and field operations in one enterprise platform.
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-base text-white/75 leading-relaxed">
              Bridge the gap between physical machinery, frontline mobile crews, inventory staging, and executive governance with zero workflow fragmentation.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Product Capabilities Grid ── */}
      <section className="py-20 lg:py-24 bg-[#F8FAFC] border-b border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-1">
              PLATFORM SUITE
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Complete Operational Capabilities
            </h2>
            <p className="mt-3 text-base text-text-secondary max-w-2xl leading-relaxed">
              Every capability is natively unified on the FieldOps Nexus graph, providing unbroken operational traceability.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {productCapabilities.map((cap, idx) => {
              const CapIcon = cap.icon
              return (
                <Reveal key={cap.title} delay={idx * 60}>
                  <div
                    onClick={() => onNavigate(cap.page)}
                    className="group flex flex-col justify-between h-full rounded-xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400 hover:shadow-xl cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-[#0B1F3B] text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-navy-950">
                          <CapIcon size={22} />
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-navy-800">
                          {cap.tag}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                        {cap.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                        {cap.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                      <span className="font-semibold text-navy-800">{cap.stat}</span>
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

      {/* ── Standardized Bottom CTA (NO BUTTONS) ── */}
      <StandardizedPageCTA />
    </div>
  )
}
