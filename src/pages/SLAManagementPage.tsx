import { ElementType, useEffect, useRef, useState, ReactNode } from "react"
import {
  Sparkles,
  ChevronRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Activity,
  Layers3,
  FileCheck2,
  Users,
  Building2,
  Gauge,
  ArrowRight,
  Filter,
  Check,
  Zap,
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
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live SLA Telemetry
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

export default function SLAManagementPage({ onNavigate }: Props) {
  const [activeTier, setActiveTier] = useState<number>(0)

  const priorityTiers = [
    {
      level: "P1",
      name: "Critical Breakdown",
      scope: "Assembly line halt, primary chiller failure, safety hazard",
      responseTarget: "15 min",
      responseActual: "8.4 min avg",
      resolutionTarget: "2 hrs",
      resolutionActual: "1.4 hrs avg",
      coverage: "24/7/365 Continuous",
      escalation: "Instant supervisor & operations director SMS",
      compliance: "99.8%",
      badgeColor: "bg-red-500/15 text-red-400 border-red-500/30",
    },
    {
      level: "P2",
      name: "Degraded Production",
      scope: "Sub-assembly slowdown, secondary HVAC loop, redundant pump trip",
      responseTarget: "30 min",
      responseActual: "19 min avg",
      resolutionTarget: "4 hrs",
      resolutionActual: "2.8 hrs avg",
      coverage: "16/7 Extended Coverage",
      escalation: "Escalate to lead technician at 25 min",
      compliance: "99.2%",
      badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    },
    {
      level: "P3",
      name: "Standard Maintenance",
      scope: "Preventive maintenance due, minor vibration anomaly, sensor drift",
      responseTarget: "2 hrs",
      responseActual: "1.1 hrs avg",
      resolutionTarget: "24 hrs",
      resolutionActual: "16.2 hrs avg",
      coverage: "8/5 Standard Business Hours",
      escalation: "Daily dispatch morning review",
      compliance: "99.6%",
      badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    },
    {
      level: "P4",
      name: "General Service Request",
      scope: "Filter replacements, seasonal calibration, non-urgent inspection",
      responseTarget: "4 hrs",
      responseActual: "2.3 hrs avg",
      resolutionTarget: "72 hrs",
      resolutionActual: "44.5 hrs avg",
      coverage: "8/5 Standard Business Hours",
      escalation: "Weekly planner backlog review",
      compliance: "99.9%",
      badgeColor: "bg-slate-500/15 text-slate-300 border-slate-500/30",
    },
  ]

  const liveTickets = [
    {
      id: "SR-4921",
      title: "Primary Air Compressor Stage 2 Pressure Trip",
      facility: "Chicago Plant • Bldg 3 Bay B",
      priority: "P1",
      timeLeft: "42m 18s",
      percentUsed: 65,
      status: "Within SLA",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      technician: "Marcus Vance (On-Site)",
    },
    {
      id: "SR-4928",
      title: "Chiller Loop Low Delta-T Exchanger Alert",
      facility: "Munich Campus • Data Center West",
      priority: "P2",
      timeLeft: "14m 02s",
      percentUsed: 88,
      status: "Warning (<15% buffer)",
      statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      technician: "Elena Rostova (En Route)",
    },
    {
      id: "SR-4933",
      title: "Hydraulic Press Filter Cartridge Replacement",
      facility: "Frankfurt Facility • Cell 04",
      priority: "P3",
      timeLeft: "3h 12m",
      percentUsed: 32,
      status: "Within SLA",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      technician: "Jens Weber (Dispatched)",
    },
  ]

  return (
    <div className="w-full bg-white">
      {/* ── 1. Hero Section ── */}
      <section className="relative overflow-hidden bg-[#0B1F3B] text-white pt-24 pb-20 lg:pt-32 lg:pb-28">
        {/* Subtle grid background texture */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]"
          aria-hidden="true"
        />
        {/* Ambient gold illumination */}
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
              onClick={() => onNavigate("landing")}
              className="hover:text-white/80 transition-colors"
            >
              Solutions
            </button>
            <ChevronRight size={11} className="text-white/30 shrink-0" />
            <span className="text-white/90 font-semibold">SLA Management</span>
          </nav>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left text column */}
            <div className="lg:col-span-6">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-400 mb-6">
                  <Sparkles size={13} className="text-gold-400" />
                  SERVICE-LEVEL OBLIGATIONS & COMPLIANCE
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1] text-[#F8FAFC]">
                  SLA Management
                </h1>
                <p className="mt-4 text-xl font-medium text-gold-400">
                  Enforce service commitments, eliminate response bottlenecks, and maintain audit-ready visibility.
                </p>
                <p className="mt-4 max-w-xl text-base text-white/75 leading-relaxed">
                  Monitor service-level commitments, track response and resolution performance, and maintain visibility into operational service obligations.
                </p>
                
                {/* Summary badges */}
                <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/85">
                    <Clock size={14} className="text-gold-400" />
                    <span>Real-Time Countdown Timers</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/85">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span>Multi-Tier Matrix Policies</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/85">
                    <AlertTriangle size={14} className="text-amber-400" />
                    <span>Predictive Breach Alerts</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right visual column: Industrial Hero Graphic & Live Telemetry UI */}
            <div className="lg:col-span-6">
              <Reveal direction="left" delay={200}>
                <div className="relative space-y-4">
                  <div className="relative overflow-hidden rounded-xl border border-white/15 shadow-2xl shadow-black/50">
                    <img
                      src="/hero-sla-management.jpg"
                      alt="FieldOps Nexus SLA Management industrial operations control room"
                      loading="lazy"
                      className="w-full h-[260px] sm:h-[300px] object-cover object-center block"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3B] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                      <span className="font-semibold text-white/90 flex items-center gap-1.5">
                        <Activity size={14} className="text-emerald-400 animate-pulse" />
                        Live Industrial Response Telemetry
                      </span>
                      <span className="rounded-full bg-gold-400/20 border border-gold-400/40 px-2.5 py-0.5 font-bold text-gold-300">
                        99.4% Contract Adherence
                      </span>
                    </div>
                  </div>

                  {/* UI Window Preview */}
                  <UIWindow title="Live SLA Command Center">
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-white/60">
                        <span>Active Incident Queue</span>
                        <span>SLA Threshold Margin</span>
                      </div>
                      {liveTickets.slice(0, 2).map((ticket) => (
                        <div
                          key={ticket.id}
                          className="rounded-lg border border-white/10 bg-[#162A4B]/80 p-3 space-y-2 text-white"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-gold-400">{ticket.id}</span>
                              <span className="font-semibold text-white/90 truncate max-w-[200px] sm:max-w-none">
                                {ticket.title}
                              </span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${ticket.statusColor}`}>
                              {ticket.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-white/60">
                            <span>{ticket.facility}</span>
                            <span className="font-mono text-gold-300 font-bold">{ticket.timeLeft} remaining</span>
                          </div>
                        </div>
                      ))}
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
              <p className="text-sm font-bold text-navy-800 mt-1">First-Response Adherence</p>
              <p className="text-xs text-text-secondary mt-0.5">Across critical P1 and P2 breakdown incidents</p>
            </Reveal>
            <Reveal delay={100} className="border-l-2 border-gold-500 pl-5">
              <p className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">42 min</p>
              <p className="text-sm font-bold text-navy-800 mt-1">Mean Time to Resolution (MTTR)</p>
              <p className="text-xs text-text-secondary mt-0.5">18% reduction achieved over 90 days across facilities</p>
            </Reveal>
            <Reveal delay={200} className="border-l-2 border-gold-500 pl-5">
              <p className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">0.4%</p>
              <p className="text-sm font-bold text-navy-800 mt-1">Breach Exception Rate</p>
              <p className="text-xs text-text-secondary mt-0.5">Automated root-cause logging with supervisor audit trail</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 3. SLA Monitoring & Compliance Overview ── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">
              POLICY GOVERNANCE & COMPLIANCE
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Continuous Service-Level Monitoring Across Every Contract
            </h2>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              Eliminate contractual ambiguity. FieldOps Nexus continuously evaluates active tickets against defined coverage calendars, automated clock pauses, and multi-tier priority obligations.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Tiered Contract SLA Policies",
                desc: "Configure granular response and resolution commitments per client contract, facility type, or equipment tier. Support 24/7/365 mission-critical, extended 16/7, or standard business hours.",
              },
              {
                icon: Clock,
                title: "Automated SLA Clock Management",
                desc: "Intelligently pause or resume the compliance clock during legitimate operational holds—such as waiting for client site access approval, third-party parts delivery, or scheduled plant shutdowns.",
              },
              {
                icon: FileCheck2,
                title: "Subcontractor & Vendor SLA Audits",
                desc: "Enforce the same rigorous SLA tracking for external contractors, OEM service providers, and warranty AMC vendors, ensuring full accountability across your entire supply network.",
              },
            ].map((card, i) => {
              const CardIcon = card.icon
              return (
                <Reveal key={card.title} delay={i * 90}>
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

      {/* ── 4. Response Time & Resolution Time Tracking ── */}
      <section className="py-20 lg:py-24 bg-[#F8FAFC] border-y border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">
              TIMELINE PRECISION
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Response Time vs. Resolution Time Matrix
            </h2>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              Every incident is evaluated through dual-stage tracking: First-Response Time (initial triage and technician dispatch) and Total Resolution Time (verified restoration of operational service).
            </p>
          </Reveal>

          {/* Interactive Priority Matrix */}
          <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border bg-slate-50 p-2 gap-2">
              {priorityTiers.map((tier, idx) => (
                <button
                  key={tier.level}
                  type="button"
                  onClick={() => setActiveTier(idx)}
                  className={`flex flex-col items-center justify-center rounded-lg p-3 text-center transition-all ${
                    activeTier === idx
                      ? "bg-[#0B1F3B] text-white shadow-md"
                      : "bg-white text-navy-800 hover:bg-slate-100"
                  }`}
                >
                  <span className={`text-xs font-black px-2 py-0.5 rounded ${
                    activeTier === idx ? "bg-gold-400 text-navy-950" : "bg-slate-100 text-navy-700"
                  }`}>
                    {tier.level}
                  </span>
                  <span className="text-xs font-bold mt-1">{tier.name}</span>
                </button>
              ))}
            </div>

            <div className="p-6 sm:p-8">
              {(() => {
                const cur = priorityTiers[activeTier]
                return (
                  <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold border ${cur.badgeColor}`}>
                          Tier {cur.level}
                        </span>
                        <h3 className="text-xl font-bold text-navy-900">{cur.name}</h3>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        <strong className="text-navy-800">Operational Scope: </strong>
                        {cur.scope}
                      </p>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                        <div className="rounded-lg bg-[#F8FAFC] p-4 border border-border">
                          <p className="text-xs font-bold uppercase text-text-secondary">First-Response SLA Target</p>
                          <p className="text-2xl font-extrabold text-navy-900 mt-1">{cur.responseTarget}</p>
                          <p className="text-xs text-emerald-600 font-semibold mt-0.5">Field Actual: {cur.responseActual}</p>
                        </div>
                        <div className="rounded-lg bg-[#F8FAFC] p-4 border border-border">
                          <p className="text-xs font-bold uppercase text-text-secondary">Resolution SLA Target</p>
                          <p className="text-2xl font-extrabold text-navy-900 mt-1">{cur.resolutionTarget}</p>
                          <p className="text-xs text-emerald-600 font-semibold mt-0.5">Field Actual: {cur.resolutionActual}</p>
                        </div>
                      </div>

                      <div className="pt-2 text-xs text-text-secondary space-y-1">
                        <p><strong className="text-navy-800">Coverage Window: </strong>{cur.coverage}</p>
                        <p><strong className="text-navy-800">Escalation Protocol: </strong>{cur.escalation}</p>
                      </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col items-center justify-center rounded-xl bg-[#0B1F3B] p-6 text-white text-center">
                      <p className="text-xs font-bold uppercase tracking-widest text-gold-400">Compliance Benchmark</p>
                      <p className="text-5xl font-black text-[#F8FAFC] mt-2">{cur.compliance}</p>
                      <p className="text-xs text-white/70 mt-1">Contractual Adherence Rate</p>
                      <div className="mt-4 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                        <div className="bg-gold-400 h-full rounded-full" style={{ width: cur.compliance }} />
                      </div>
                      <span className="mt-3 inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <Check size={12} /> Target Exceeded (Quarter-to-Date)
                      </span>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SLA Status & Breach Visibility ── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">
              PROACTIVE VISIBILITY
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              SLA Status & Early Breach Warning System
            </h2>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              Never get caught off guard by an unexpected breach. Dynamic threshold alerts trigger automated notifications well before contractual deadlines lapse.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                status: "Normal Progress",
                window: "0% – 70% Elapsed",
                icon: CheckCircle2,
                color: "border-emerald-500/30 bg-emerald-50/50 text-emerald-700",
                badge: "Healthy",
                desc: "Work order progressing within standard buffer. Technician en-route or actively executing job SOPs.",
              },
              {
                status: "Warning Buffer",
                window: "70% – 85% Elapsed",
                icon: AlertTriangle,
                color: "border-amber-500/30 bg-amber-50/50 text-amber-700",
                badge: "At Risk",
                desc: "Automatic push notification dispatched to lead dispatcher. Secondary technician placed on warm standby.",
              },
              {
                status: "Supervisor Escalation",
                window: "85% – 99% Elapsed",
                icon: Zap,
                color: "border-orange-500/30 bg-orange-50/50 text-orange-700",
                badge: "Escalated",
                desc: "Priority override sent to regional maintenance supervisor. Direct communication established with on-site crew.",
              },
              {
                status: "Breach Documentation",
                window: "100% Exceeded",
                icon: AlertCircle,
                color: "border-red-500/30 bg-red-50/50 text-red-700",
                badge: "Breached",
                desc: "Mandatory root-cause logging enforced. Automatic incident report generated for monthly client reconciliation.",
              },
            ].map((card, i) => {
              const CardIcon = card.icon
              return (
                <Reveal key={card.status} delay={i * 80}>
                  <div className={`h-full rounded-xl border p-5 transition-all duration-200 hover:-translate-y-1 ${card.color}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider">{card.window}</span>
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-extrabold bg-white border border-current">
                        {card.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardIcon size={18} />
                      <h3 className="text-base font-bold text-navy-900">{card.status}</h3>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 6. Operational Workflow & Dashboard Preview ── */}
      <section className="py-20 lg:py-24 bg-[#0B1F3B] text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-400 mb-4">
                  <Gauge size={13} className="text-gold-400" />
                  REAL-TIME DISPATCH QUEUE
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[#F8FAFC]">
                  Centralized SLA Dispatch Ticker
                </h2>
                <p className="mt-4 text-sm text-white/75 leading-relaxed">
                  Dispatchers and site managers gain second-by-second visibility into every active work order across multiple plants, ensuring zero tickets slip through the cracks.
                </p>
                
                <div className="mt-6 space-y-3 text-xs text-white/80">
                  <div className="flex items-start gap-2.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-gold-400 font-bold text-[10px]">1</span>
                    <span>Automated prioritization based on contract severity and financial penalties.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-gold-400 font-bold text-[10px]">2</span>
                    <span>Dynamic timer recalculation when external pause conditions are logged.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-gold-400 font-bold text-[10px]">3</span>
                    <span>Export audit-ready CSV & PDF SLA compliance certificates with one click.</span>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal direction="left" delay={150}>
                <UIWindow title="Operational SLA Monitor — All Facilities">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs text-white/70">
                      <span className="font-semibold">Live Ticket Stream (3 Active)</span>
                      <span className="text-emerald-400 font-mono">Status: Optimal</span>
                    </div>

                    {liveTickets.map((t) => (
                      <div
                        key={t.id}
                        className="rounded-lg border border-white/10 bg-[#162A4B] p-3.5 space-y-2 text-white"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-navy-950 px-2 py-0.5 font-mono text-[11px] font-bold text-gold-400 border border-gold-400/20">
                              {t.id}
                            </span>
                            <span className="font-bold text-sm text-white/95">{t.title}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${t.statusColor}`}>
                            {t.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/70 pt-1 border-t border-white/5">
                          <span className="flex items-center gap-1.5">
                            <Building2 size={13} className="text-white/50" /> {t.facility}
                          </span>
                          <span className="flex items-center gap-1.5 font-mono text-gold-300">
                            <Clock size={13} className="text-gold-400" /> Time Left: {t.timeLeft}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </UIWindow>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Standardized FieldOps Nexus CTA (NO BUTTONS) ── */}
      <StandardizedPageCTA />
    </div>
  )
}
