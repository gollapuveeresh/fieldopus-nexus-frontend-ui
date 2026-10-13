import { ElementType, useEffect, useRef, useState, ReactNode } from "react"
import {
  Sparkles,
  ChevronRight,
  Building2,
  Globe,
  ShieldCheck,
  Activity,
  Layers3,
  Clock,
  Database,
  Users,
  Lock,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Workflow,
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
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> Multi-Entity Synced
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

export default function EnterpriseOperationsPage({ onNavigate }: Props) {
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
            <span className="text-white/90 font-semibold">Enterprise Operations</span>
          </nav>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left text column */}
            <div className="lg:col-span-6">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-400 mb-6">
                  <Sparkles size={13} className="text-gold-400" />
                  SCALABLE ENTERPRISE INFRASTRUCTURE
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1] text-[#F8FAFC]">
                  Enterprise Operations
                </h1>
                <p className="mt-4 text-xl font-medium text-gold-400">
                  Unify complex operational workflows, assets, teams, and service activities within a connected operational environment.
                </p>
                <p className="mt-4 max-w-xl text-base text-white/75 leading-relaxed">
                  Unify complex operational workflows, assets, teams, and service activities within a connected operational environment.
                </p>

                {/* Capability Badges */}
                <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/85">
                    <Building2 size={14} className="text-gold-400" />
                    <span>Multi-Entity Architecture</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/85">
                    <Globe size={14} className="text-emerald-400" />
                    <span>Corporate Roll-Up Analytics</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/85">
                    <Lock size={14} className="text-amber-400" />
                    <span>SOC 2 Type II Certified</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right visual column: Industrial Enterprise Hero & UI Window */}
            <div className="lg:col-span-6">
              <Reveal direction="left" delay={200}>
                <div className="relative space-y-4">
                  <div className="relative overflow-hidden rounded-xl border border-white/15 shadow-2xl shadow-black/50">
                    <img
                      src="/hero-enterprise-operations.jpg"
                      alt="FieldOps Nexus Enterprise Operations management command center"
                      loading="lazy"
                      className="w-full h-[260px] sm:h-[300px] object-cover object-center block"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3B] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                      <span className="font-semibold text-white/90 flex items-center gap-1.5">
                        <Activity size={14} className="text-emerald-400 animate-pulse" />
                        Enterprise Operations Command
                      </span>
                      <span className="rounded-full bg-gold-400/20 border border-gold-400/40 px-2.5 py-0.5 font-bold text-gold-300">
                        100+ Sites Synchronized
                      </span>
                    </div>
                  </div>

                  {/* UI Window Preview */}
                  <UIWindow title="Enterprise Multi-Site Operations Matrix">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-white/60">
                        <span>Regional Business Unit</span>
                        <span>SLA Adherence • Availability</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-[#162A4B] p-2.5 text-white">
                        <div>
                          <p className="font-bold text-white/95">North America Manufacturing Division</p>
                          <p className="text-[10px] text-white/60">12 Facilities • 2,840 Assets • 18 Open WOs</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-emerald-400">99.8% SLA</span>
                          <span className="block text-[9px] text-white/60 font-semibold">99.4% Uptime</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-[#162A4B] p-2.5 text-white">
                        <div>
                          <p className="font-bold text-white/95">EMEA Technology & Logistics Hubs</p>
                          <p className="text-[10px] text-white/60">8 Facilities • 1,920 Assets • 9 Open WOs</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-emerald-400">99.5% SLA</span>
                          <span className="block text-[9px] text-white/60 font-semibold">99.1% Uptime</span>
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
              <p className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">100+ Sites</p>
              <p className="text-sm font-bold text-navy-800 mt-1">Synchronized Under Single Tenant</p>
              <p className="text-xs text-text-secondary mt-0.5">Global facilities unified with role-based access control</p>
            </Reveal>
            <Reveal delay={100} className="border-l-2 border-gold-500 pl-5">
              <p className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">Global SSO</p>
              <p className="text-sm font-bold text-navy-800 mt-1">Enterprise Identity & Governance</p>
              <p className="text-xs text-text-secondary mt-0.5">SAML 2.0, Okta, Azure AD, and Active Directory federation</p>
            </Reveal>
            <Reveal delay={200} className="border-l-2 border-gold-500 pl-5">
              <p className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">99.99%</p>
              <p className="text-sm font-bold text-navy-800 mt-1">High Availability Cloud SLA</p>
              <p className="text-xs text-text-secondary mt-0.5">Multi-region redundancy with disaster recovery guaranteed</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 3. Multi-Entity Architecture & Unified Governance ── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">
              ENTERPRISE GOVERNANCE
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Multi-Entity Business Architecture
            </h2>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              Maintain autonomous operational control for subsidiary companies and regional divisions while aggregating performance metrics into corporate executive boards.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Building2,
                title: "Entity Segregation",
                desc: "Isolate customer data, work orders, and inventories between legal business units with secure tenancy boundaries.",
              },
              {
                icon: Database,
                title: "Custom ERP Integrations",
                desc: "Direct bi-directional connectivity with SAP S/4HANA, Oracle NetSuite, Microsoft Dynamics 365, and SCADA systems.",
              },
              {
                icon: Clock,
                title: "Enterprise SLA Matrices",
                desc: "Establish customized service-level contracts for different corporate clients, geographical regions, and equipment tiers.",
              },
              {
                icon: ShieldCheck,
                title: "SOC 2 Type II Security",
                desc: "Complete cryptographic audit logs, encrypted data at rest and in transit, and immutable compliance records.",
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

      {/* ── 4. Cross-Functional Workflow Orchestration ── */}
      <section className="py-20 lg:py-24 bg-[#F8FAFC] border-y border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-navy-800/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy-800 mb-4 shadow-sm">
                <Workflow size={13} className="text-gold-600" />
                INTEGRATED SERVICE ECOSYSTEM
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                Unbroken Orchestration Across Operations
              </h2>
              <p className="mt-4 text-base text-text-secondary leading-relaxed">
                FieldOps Nexus unifies assets, field technicians, warehouse stock, customer portals, and corporate billing into one synchronized operational rhythm.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    title: "Asset Lifecycle & Capital Planning",
                    desc: "Track total cost of ownership (TCO), operational depreciation, and warranty recovery across all physical machinery.",
                  },
                  {
                    title: "Centralized Procurement & Spares Pooling",
                    desc: "Consolidate purchasing across global facilities to unlock volume OEM discounts and prevent emergency stockouts.",
                  },
                  {
                    title: "Executive Visibility & Cross-Site Benchmarking",
                    desc: "Compare maintenance efficiency and equipment uptime across facilities using standardized enterprise KPIs.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-700 font-bold text-xs mt-0.5">
                      ✓
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-navy-900">{item.title}</h3>
                      <p className="text-xs text-text-secondary leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal direction="left" delay={150}>
              <div className="rounded-2xl border border-border bg-[#0B1F3B] p-6 sm:p-8 text-white shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={18} className="text-gold-400" />
                    <h3 className="text-base font-bold text-[#F8FAFC]">Corporate Executive Radar</h3>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    Live Roll-Up
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-xs">
                  <div className="rounded-lg bg-[#162A4B] p-3 border border-white/10 space-y-1.5">
                    <div className="flex justify-between items-center text-white/90">
                      <span className="font-bold">Global Plant Availability</span>
                      <span className="text-emerald-400 font-bold">99.6%</span>
                    </div>
                    <div className="w-full bg-navy-900 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full rounded-full w-[99.6%]" />
                    </div>
                    <p className="text-[10px] text-white/50">Target: 99.0% • 14 of 14 facilities above threshold</p>
                  </div>

                  <div className="rounded-lg bg-[#162A4B] p-3 border border-white/10 space-y-1.5">
                    <div className="flex justify-between items-center text-white/90">
                      <span className="font-bold">Enterprise Preventive Maintenance Compliance</span>
                      <span className="text-gold-400 font-bold">99.2%</span>
                    </div>
                    <div className="w-full bg-navy-900 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gold-400 h-full rounded-full w-[99.2%]" />
                    </div>
                    <p className="text-[10px] text-white/50">842 PM work orders completed on schedule this month</p>
                  </div>

                  <div className="rounded-lg bg-[#162A4B] p-3 border border-white/10 space-y-1.5">
                    <div className="flex justify-between items-center text-white/90">
                      <span className="font-bold">First-Time Fix Rate (FTFR)</span>
                      <span className="text-white font-bold">91.8%</span>
                    </div>
                    <div className="w-full bg-navy-900 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full rounded-full w-[91.8%]" />
                    </div>
                    <p className="text-[10px] text-white/50">+4.2% vs previous quarter across mobile field crews</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 5. Standardized Bottom CTA (NO BUTTONS) ── */}
      <StandardizedPageCTA />
    </div>
  )
}
