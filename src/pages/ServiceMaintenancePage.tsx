import { ElementType, useEffect, useRef, useState, ReactNode } from "react"
import {
  Sparkles,
  ChevronRight,
  Wrench,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  Package,
  Activity,
  ClipboardList,
  ArrowRight,
  Radio,
  Check,
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

function UIWindow({
  children,
  title = "FieldOps Nexus Platform",
}: {
  children: ReactNode
  title?: string
}) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-[#0B1F3B] text-left shadow-2xl shadow-navy-950/40">
      <div className="flex h-10 items-center justify-between border-b border-white/10 bg-[#07152A] px-4">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-3 text-[11px] font-bold tracking-tight text-white/90">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[9px] font-semibold text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Dispatch Stream
          </span>
        </div>
      </div>
      <div className="p-4 sm:p-5 bg-[#0B1F3B]">
        {children}
      </div>
    </div>
  )
}

interface Props {
  onNavigate: (page: Page) => void
}

export default function ServiceMaintenancePage({ onNavigate }: Props) {
  return (
    <div className="w-full bg-white">
      {/* ── 1. Hero Section ── */}
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
            <button
              type="button"
              onClick={() => onNavigate("solutions-overview")}
              className="hover:text-white/80 transition-colors"
            >
              Solutions
            </button>
            <ChevronRight size={11} className="text-white/30 shrink-0" />
            <span className="text-white/90 font-semibold">Service & Maintenance</span>
          </nav>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left text column */}
            <div className="lg:col-span-6">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-400 mb-6">
                  <Sparkles size={13} className="text-gold-400" />
                  RESPONSIVE FIELD EXECUTION
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1] text-[#F8FAFC]">
                  Service & Maintenance
                </h1>
                <p className="mt-4 text-xl font-medium text-gold-400">
                  Deliver responsive service, proactive maintenance execution, and asset reliability wherever work happens.
                </p>
                <p className="mt-4 max-w-xl text-base text-white/75 leading-relaxed">
                  Bridge the gap between work order intake, technician dispatch, van inventory, and verified completion with zero downtime surprises.
                </p>

                {/* Capability Badges */}
                <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/85">
                    <Wrench size={14} className="text-gold-400" />
                    <span>Predictive & Routine PM</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/85">
                    <Users size={14} className="text-emerald-400" />
                    <span>Smart Route Scheduling</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/85">
                    <ShieldCheck size={14} className="text-amber-400" />
                    <span>First-Time Resolution</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right visual column */}
            <div className="lg:col-span-6">
              <Reveal direction="left" delay={200}>
                <div className="relative space-y-4">
                  <div className="relative overflow-hidden rounded-xl border border-white/15 shadow-2xl shadow-black/50">
                    <img
                      src="/work-order-technician.jpg"
                      alt="FieldOps Nexus Service and Maintenance operations technician"
                      loading="lazy"
                      className="w-full h-[260px] sm:h-[300px] object-cover object-center block"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3B] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                      <span className="font-semibold text-white/90 flex items-center gap-1.5">
                        <Activity size={14} className="text-emerald-400 animate-pulse" />
                        Live Field Service Dispatch
                      </span>
                      <span className="rounded-full bg-gold-400/20 border border-gold-400/40 px-2.5 py-0.5 font-bold text-gold-300">
                        99.4% SLA Adherence
                      </span>
                    </div>
                  </div>

                  {/* UI Window Preview */}
                  <UIWindow title="Field Service & Maintenance Command">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-white/60">
                        <span>Active Field Job</span>
                        <span>SOP Checklist • Tech</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-[#162A4B] p-2.5 text-white">
                        <div>
                          <p className="font-bold text-white/95">Chiller Bearing Replacement & Vibration Test</p>
                          <p className="text-[10px] text-white/60">WO #14872 • Site: Central Plant • Bay 2</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-emerald-400">Step 4 of 5 (80%)</span>
                          <span className="block text-[9px] text-gold-300 font-semibold">Tech: D. Miller</span>
                        </div>
                      </div>
                    </div>
                  </UIWindow>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Key Operational Metrics Strip ── */}
      <section className="border-b border-border bg-[#F8FAFC] py-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <Reveal delay={0} className="border-l-2 border-gold-500 pl-5">
              <p className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">99.4%</p>
              <p className="text-sm font-bold text-navy-800 mt-1">SLA Contract Adherence</p>
              <p className="text-xs text-text-secondary mt-0.5">Across critical emergency repairs and scheduled servicing</p>
            </Reveal>
            <Reveal delay={100} className="border-l-2 border-gold-500 pl-5">
              <p className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">32% Faster</p>
              <p className="text-sm font-bold text-navy-800 mt-1">First-Time Fix Rate (FTFR)</p>
              <p className="text-xs text-text-secondary mt-0.5">Pre-staged spare parts and digital mobile manuals</p>
            </Reveal>
            <Reveal delay={200} className="border-l-2 border-gold-500 pl-5">
              <p className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">42 min</p>
              <p className="text-sm font-bold text-navy-800 mt-1">Average Incident MTTR</p>
              <p className="text-xs text-text-secondary mt-0.5">Smart technician geo-routing and rapid intake triage</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 3. Core Capabilities ── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">
              FIELD SERVICE CAPABILITIES
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Engineered for Service Excellence
            </h2>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              Combine proactive preventive maintenance routines with high-speed emergency response capabilities.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Wrench,
                title: "Preventive & Corrective Schedules",
                desc: "Automate recurring maintenance tasks based on operating run-hours, sensor telemetry thresholds, or calendar intervals.",
              },
              {
                icon: Users,
                title: "Skill-Based Dispatching",
                desc: "Match service requests with certified technicians holding the right manufacturer clearances and safety badges.",
              },
              {
                icon: Package,
                title: "Mobile Van Stock & Parts Staging",
                desc: "Verify spare parts availability in the technician's vehicle before dispatch to prevent unnecessary second visits.",
              },
              {
                icon: ShieldCheck,
                title: "Digital Sign-Off & Verification",
                desc: "Capture touchscreen customer sign-offs, before-and-after work photos, and GPS-stamped completion receipts.",
              },
            ].map((card, i) => {
              const CardIcon = card.icon
              return (
                <Reveal key={card.title} delay={i * 80}>
                  <div className="group h-full rounded-xl border border-border bg-[#F8FAFC] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400 hover:bg-white hover:shadow-lg">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-[#0B1F3B] text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-navy-950 mb-4">
                      <CardIcon size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {card.desc}
                    </p>
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
