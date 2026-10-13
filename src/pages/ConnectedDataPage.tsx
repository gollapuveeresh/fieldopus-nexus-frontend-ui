import { ElementType, useEffect, useRef, useState, ReactNode } from "react"
import {
  Sparkles,
  ChevronRight,
  Database,
  Boxes,
  ClipboardList,
  Package,
  ShieldCheck,
  Activity,
  Workflow,
  Radio,
  FileCheck2,
  Users,
  Building2,
  Check,
  CheckCircle2,
  Layers3,
  Search,
  ArrowRight,
  Lock,
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
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Unified Graph Active
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

export default function ConnectedDataPage({ onNavigate }: Props) {
  const [activeStep, setActiveStep] = useState<number>(0)

  const lifecycleSteps = [
    {
      step: "01",
      name: "Asset Telemetry & Intake",
      entity: "Asset Record & IoT Trigger",
      desc: "Anomalous temperature or vibration telemetry automatically generates an operational incident without manual data entry.",
      dataCaptured: "Vibration Index (11.4 mm/s), Operating Hours (4,820 hrs), Machine ID #CH-04",
      icon: Activity,
    },
    {
      step: "02",
      name: "Service Request & SLA Triage",
      entity: "Service Request #SR-1092",
      desc: "Incident matched against the site's contractual SLA profile. Countdown timers and priority thresholds are established immediately.",
      dataCaptured: "P1 Severity, Contract SLA Target (2.0 hrs), Customer Facility ID #US-CHI-01",
      icon: FileCheck2,
    },
    {
      step: "03",
      name: "Work Order Formulation & SOP",
      entity: "Work Order #WO-8840",
      desc: "Planner attaches OEM maintenance checklists, required safety lock-out procedures, and stages needed replacement components.",
      dataCaptured: "Assigned Tech (D. Miller), Estimated Labor (1.5 hrs), Lock-Out Tag-Out SOP #E-22",
      icon: ClipboardList,
    },
    {
      step: "04",
      name: "Spare Parts Allocation & Execution",
      entity: "Inventory & Mobile App",
      desc: "Field technician receives job on mobile device. Required bearing kit is reserved from Central Warehouse and deducted from van stock upon installation.",
      dataCaptured: "Parts Deducted: 2x SKU #BEAR-9400 (Bin 4B), Barcode Scan Verified",
      icon: Package,
    },
    {
      step: "05",
      name: "Supervisor Verification & Audit Ledger",
      entity: "Cryptographic Audit Ledger",
      desc: "Supervisor validates photo evidence, sign-off signature is captured, and the immutable audit record is permanently written to the ledger.",
      dataCaptured: "SHA-256 Hash #8f4a9b2c...09e1, GPS Coordinates, Digital Signature Verified",
      icon: ShieldCheck,
    },
  ]

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
              onClick={() => onNavigate("landing")}
              className="hover:text-white/80 transition-colors"
            >
              Solutions
            </button>
            <ChevronRight size={11} className="text-white/30 shrink-0" />
            <span className="text-white/90 font-semibold">Connected Data</span>
          </nav>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left text column */}
            <div className="lg:col-span-6">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-400 mb-6">
                  <Sparkles size={13} className="text-gold-400" />
                  UNIFIED SERVICE & OPERATIONAL INFORMATION
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1] text-[#F8FAFC]">
                  Connected Data
                </h1>
                <p className="mt-4 text-xl font-medium text-gold-400">
                  Unify operational information across teams, locations, assets, service requests, and work orders to support a consistent view of service operations.
                </p>
                <p className="mt-4 max-w-xl text-base text-white/75 leading-relaxed">
                  Connect operational information across teams, locations, assets, service requests, and work orders to support a consistent view of service operations.
                </p>

                {/* Core capability pills */}
                <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/85">
                    <Database size={14} className="text-gold-400" />
                    <span>Single Operational Schema</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/85">
                    <Workflow size={14} className="text-emerald-400" />
                    <span>End-to-End Traceability</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/85">
                    <Lock size={14} className="text-amber-400" />
                    <span>Immutable Audit Trails</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right visual column: Industrial Connected Data Hero & Data Thread Explorer */}
            <div className="lg:col-span-6">
              <Reveal direction="left" delay={200}>
                <div className="relative space-y-4">
                  <div className="relative overflow-hidden rounded-xl border border-white/15 shadow-2xl shadow-black/50">
                    <img
                      src="/hero-connected-data.jpg"
                      alt="FieldOps Nexus Connected Data industrial operations command center"
                      loading="lazy"
                      className="w-full h-[260px] sm:h-[300px] object-cover object-center block"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3B] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                      <span className="font-semibold text-white/90 flex items-center gap-1.5">
                        <Activity size={14} className="text-emerald-400 animate-pulse" />
                        Live Industrial IoT Pipeline
                      </span>
                      <span className="rounded-full bg-gold-400/20 border border-gold-400/40 px-2.5 py-0.5 font-bold text-gold-300">
                        Zero Fragmented Silos
                      </span>
                    </div>
                  </div>

                  {/* UI Window Preview */}
                  <UIWindow title="Operational Data Thread Explorer">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-white/60">
                        <span>Incident Lifecycle Thread</span>
                        <span className="text-emerald-400 font-mono">Trace: Complete</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded bg-[#162A4B] p-2 border border-white/10">
                          <span className="text-[10px] text-white/60 block">Asset Node</span>
                          <span className="font-bold text-white/95">Chiller #CH-04</span>
                        </div>
                        <div className="rounded bg-[#162A4B] p-2 border border-white/10">
                          <span className="text-[10px] text-white/60 block">Service Request</span>
                          <span className="font-mono font-bold text-gold-400">SR-1092</span>
                        </div>
                        <div className="rounded bg-[#162A4B] p-2 border border-white/10">
                          <span className="text-[10px] text-white/60 block">Work Order</span>
                          <span className="font-mono font-bold text-white/95">WO-8840</span>
                        </div>
                        <div className="rounded bg-[#162A4B] p-2 border border-white/10">
                          <span className="text-[10px] text-white/60 block">Part Deducted</span>
                          <span className="font-bold text-emerald-400">SKU #BEAR-9400</span>
                        </div>
                      </div>
                      <div className="rounded bg-black/30 p-2 text-[10px] font-mono text-gold-300/90 flex items-center justify-between">
                        <span>Ledger Hash: 0x9a8f...4e1b</span>
                        <span className="text-emerald-400">Verified ✓</span>
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
              <p className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">0 Silos</p>
              <p className="text-sm font-bold text-navy-800 mt-1">Unified Operational Model</p>
              <p className="text-xs text-text-secondary mt-0.5">Assets, work orders, inventory, and audit unified into one relational graph</p>
            </Reveal>
            <Reveal delay={100} className="border-l-2 border-gold-500 pl-5">
              <p className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">100%</p>
              <p className="text-sm font-bold text-navy-800 mt-1">End-to-End Traceability</p>
              <p className="text-xs text-text-secondary mt-0.5">Every technician note, timestamp, and replacement part cryptographically linked</p>
            </Reveal>
            <Reveal delay={200} className="border-l-2 border-gold-500 pl-5">
              <p className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">3.4x</p>
              <p className="text-sm font-bold text-navy-800 mt-1">Faster Context Lookup</p>
              <p className="text-xs text-text-secondary mt-0.5">Field technicians instantly access full equipment history on their mobile device</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 3. Unified Operational Information Overview ── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">
              BREAK DOWN OPERATIONAL SILOS
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              One Continuous Thread for Field Operations
            </h2>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              In disconnected legacy environments, service data is scattered across paper logs, separate maintenance tools, spreadsheets, and emails. FieldOps Nexus binds every event into a single cohesive data thread.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Database,
                title: "Unified Relational Data Schema",
                desc: "Every record shares common entity relationships. A service request natively points to an asset record, which links to its physical site hierarchy, spare parts BOM, and past work orders.",
              },
              {
                icon: Workflow,
                title: "Zero Double-Entry of Data",
                desc: "Diagnostic notes entered by the intake dispatcher automatically populate the planner's work order, the technician's mobile checklist, and the customer's completed service report.",
              },
              {
                icon: ShieldCheck,
                title: "Immutable Compliance Traceability",
                desc: "Satisfy rigorous regulatory audits for ISO 55000, OSHA, and EPA with an unbroken electronic paper trail of every maintenance action and supervisor verification.",
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

      {/* ── 4. Interactive Visual Representation of Service Lifecycle ── */}
      <section className="py-20 lg:py-24 bg-[#F8FAFC] border-y border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">
              INFORMATION FLOW PIPELINE
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Visual Representation of the Service Lifecycle
            </h2>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              Explore how operational context flows seamlessly across every organizational handoff without loss of detail.
            </p>
          </Reveal>

          {/* Stepper Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
            {lifecycleSteps.map((s, idx) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-lg text-left transition-all border ${
                  activeStep === idx
                    ? "bg-[#0B1F3B] text-white border-gold-400 shadow-md"
                    : "bg-white text-navy-800 border-border hover:bg-slate-50"
                }`}
              >
                <span className={`text-[10px] font-bold block ${
                  activeStep === idx ? "text-gold-400" : "text-text-secondary"
                }`}>
                  STEP {s.step}
                </span>
                <span className="text-xs font-bold mt-1 line-clamp-1">{s.name}</span>
              </button>
            ))}
          </div>

          {/* Active Step Detail Card */}
          <div className="overflow-hidden rounded-xl border border-border bg-white p-6 sm:p-8 shadow-sm">
            {(() => {
              const cur = lifecycleSteps[activeStep]
              const StepIcon = cur.icon
              return (
                <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-8 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-lg bg-[#0B1F3B] text-gold-400">
                        <StepIcon size={20} />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase text-gold-600 tracking-wider">
                          Phase {cur.step} of 05
                        </span>
                        <h3 className="text-xl font-bold text-navy-900">{cur.name}</h3>
                      </div>
                    </div>

                    <p className="text-sm text-text-secondary leading-relaxed pt-2">
                      {cur.desc}
                    </p>

                    <div className="rounded-lg bg-[#F8FAFC] border border-border p-4 mt-4">
                      <p className="text-xs font-bold uppercase text-navy-800">Operational Data Artifact Produced:</p>
                      <p className="text-xs sm:text-sm font-mono text-navy-900 font-semibold mt-1 bg-white p-2.5 rounded border border-border">
                        {cur.dataCaptured}
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-4 rounded-xl bg-[#0B1F3B] p-5 text-white space-y-3">
                    <p className="text-xs font-bold uppercase text-gold-400">Primary Linked Entity</p>
                    <p className="text-base font-bold text-[#F8FAFC]">{cur.entity}</p>
                    <div className="border-t border-white/10 pt-3 text-xs text-white/70 space-y-1">
                      <p>• Referential integrity verified</p>
                      <p>• Mobile device synchronized</p>
                      <p>• Real-time webhook dispatched</p>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </section>

      {/* ── 5. Connected Information Across Modules ── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">
              MODULE ECOSYSTEM
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Connected Information Across Modules
            </h2>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              Every specialized FieldOps Nexus module queries and enriches the same operational core, eliminating synchronization lag and data discrepancies.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Assets & Telemetry",
                desc: "Live IoT sensor feeds update running hours and health indices, triggering automated preventive work orders.",
                icon: Boxes,
              },
              {
                title: "Work Orders & SOPs",
                desc: "Plan jobs with required skills, digital safety checklists, and expected parts consumption.",
                icon: ClipboardList,
              },
              {
                title: "Inventory & Spare Parts",
                desc: "Parts allocated to a work order are automatically decremented from local warehouse bins with reorder alerts.",
                icon: Package,
              },
              {
                title: "Contracts & SLA Profiles",
                desc: "Service commitments automatically govern dispatch priority, escalation notifications, and billing reconciliation.",
                icon: ShieldCheck,
              },
            ].map((m, i) => {
              const MIcon = m.icon
              return (
                <Reveal key={m.title} delay={i * 70}>
                  <div className="rounded-xl border border-border bg-[#F8FAFC] p-5 h-full transition-all duration-300 hover:-translate-y-1 hover:border-gold-400 hover:bg-white hover:shadow-md">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#0B1F3B] text-gold-400 mb-3">
                      <MIcon size={20} />
                    </div>
                    <h3 className="text-base font-bold text-navy-900">{m.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed mt-2">{m.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 6. Standardized FieldOps Nexus CTA (NO BUTTONS) ── */}
      <StandardizedPageCTA />
    </div>
  )
}
