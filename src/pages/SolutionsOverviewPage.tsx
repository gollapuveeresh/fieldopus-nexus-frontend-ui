import { ElementType, useEffect, useRef, useState, ReactNode } from "react"
import {
  Sparkles,
  ChevronRight,
  Factory,
  Building2,
  Wrench,
  HardHat,
  Warehouse,
  Gauge,
  Layers3,
  Database,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Globe,
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

export default function SolutionsOverviewPage({ onNavigate }: Props) {
  const industrySolutions = [
    {
      title: "Manufacturing",
      page: "manufacturing" as Page,
      icon: Factory,
      tag: "Heavy Industry",
      description: "Keep production-critical assets, robotics cells, and assembly lines moving without unscheduled downtime.",
      stat: "99.6% Line Availability",
      image: "/about-hero-control-room.jpg",
    },
    {
      title: "Facilities Management",
      page: "facilities" as Page,
      icon: Building2,
      tag: "Commercial Campuses",
      description: "Coordinate spaces, tenant request dispatching, chillers, and building lifecycle compliance across properties.",
      stat: "12M+ Sq. Ft. Managed",
      image: "/hero-facilities-management.jpg",
    },
    {
      title: "Service & Maintenance",
      page: "service-maintenance" as Page,
      icon: Wrench,
      tag: "Field Service",
      description: "Deliver responsive service, scheduled PM execution, and technician routing wherever critical equipment lives.",
      stat: "99.4% SLA Adherence",
      image: "/featured-maintenance-technician.jpg",
    },
    {
      title: "Infrastructure & Utilities",
      page: "infrastructure" as Page,
      icon: HardHat,
      tag: "Critical Infrastructure",
      description: "Maintain the public systems, energy assets, water networks, and utility infrastructure that communities depend on.",
      stat: "24/7 Continuous Reliability",
      image: "/about-hero-industrial.jpg",
    },
  ]

  const useCaseSolutions = [
    {
      title: "Enterprise Operations",
      page: "enterprise-operations" as Page,
      icon: Warehouse,
      tag: "Multi-Entity Platform",
      description: "Unify complex operational workflows, assets, teams, and service activities within a connected operational environment.",
      stat: "100+ Sites Synchronized",
      image: "/hero-enterprise-operations.jpg",
    },
    {
      title: "SLA Management",
      page: "sla-management" as Page,
      icon: Gauge,
      tag: "Contract Assurance",
      description: "Monitor service-level commitments, track response and resolution performance, and maintain visibility into operational service obligations.",
      stat: "42 min Mean MTTR",
      image: "/hero-sla-management.jpg",
    },
    {
      title: "Multi-Site Management",
      page: "multi-site-management" as Page,
      icon: Layers3,
      tag: "Distributed Governance",
      description: "Bring sites, teams, assets, and service operations into one connected operational view.",
      stat: "14 Campuses Synchronized",
      image: "/hero-multisite-management.jpg",
    },
    {
      title: "Connected Data",
      page: "connected-data" as Page,
      icon: Database,
      tag: "Unified Data Model",
      description: "Connect operational information across teams, locations, assets, service requests, and work orders to support a consistent view of service operations.",
      stat: "0 Data Silos",
      image: "/hero-connected-data.jpg",
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
            <span className="text-white/90 font-semibold">Solutions</span>
          </nav>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 text-center max-w-4xl">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-400 mb-6">
              <Sparkles size={13} className="text-gold-400" />
              FIELDOPS NEXUS SOLUTIONS
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1] text-[#F8FAFC]">
              Enterprise Solutions
            </h1>
            <p className="mt-4 text-xl font-medium text-gold-400">
              Purpose-built flexibility for environments where reliability matters most.
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-base text-white/75 leading-relaxed">
              Explore purpose-built solutions designed for asset-intensive enterprises, multi-plant manufacturing environments, mission-critical commercial facilities, and complex service operations.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Section 1: By Use Case ── */}
      <section className="py-20 lg:py-24 bg-[#F8FAFC] border-b border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-1">
              OPERATIONAL USE CASES
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Solutions by Operational Focus
            </h2>
            <p className="mt-3 text-base text-text-secondary max-w-2xl leading-relaxed">
              Standardize governance, response commitments, multi-facility coordination, and information flow across your enterprise.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {useCaseSolutions.map((sol, idx) => {
              const SolIcon = sol.icon
              return (
                <Reveal key={sol.title} delay={idx * 70}>
                  <div
                    onClick={() => onNavigate(sol.page)}
                    className="group flex flex-col justify-between h-full rounded-xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400 hover:shadow-xl cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-[#0B1F3B] text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-navy-950">
                          <SolIcon size={22} />
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-navy-800">
                          {sol.tag}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                        {sol.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                        {sol.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                      <span className="font-semibold text-navy-800">{sol.stat}</span>
                      <span className="inline-flex items-center gap-1 font-bold text-gold-600 transition-transform group-hover:translate-x-1">
                        View Solution <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Section 2: By Industry ── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-600 block mb-1">
              INDUSTRY VERTICALS
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Solutions Tailored to Your Industry
            </h2>
            <p className="mt-3 text-base text-text-secondary max-w-2xl leading-relaxed">
              Every industry faces unique equipment constraints, compliance mandates, and service rhythms. Explore solutions built for your operational environment.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {industrySolutions.map((sol, idx) => {
              const SolIcon = sol.icon
              return (
                <Reveal key={sol.title} delay={idx * 70}>
                  <div
                    onClick={() => onNavigate(sol.page)}
                    className="group flex flex-col justify-between h-full rounded-xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400 hover:shadow-xl cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-[#0B1F3B] text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-navy-950">
                          <SolIcon size={22} />
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-navy-800">
                          {sol.tag}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                        {sol.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                        {sol.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                      <span className="font-semibold text-navy-800">{sol.stat}</span>
                      <span className="inline-flex items-center gap-1 font-bold text-gold-600 transition-transform group-hover:translate-x-1">
                        View Solution <ChevronRight size={14} />
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
