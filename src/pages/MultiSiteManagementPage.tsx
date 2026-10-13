import { ElementType, useEffect, useRef, useState, ReactNode } from "react"
import {
  Sparkles,
  ChevronRight,
  Building2,
  MapPin,
  Boxes,
  Users,
  Layers3,
  TrendingUp,
  Activity,
  Globe,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ClipboardList,
  Wrench,
  Check,
  Radio,
  ArrowRight,
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
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> 14 Campuses Online
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

export default function MultiSiteManagementPage({ onNavigate }: Props) {
  const [selectedRegion, setSelectedRegion] = useState<"all" | "na" | "emea" | "apac">("all")

  const facilities = [
    {
      id: "US-CHI-01",
      name: "Chicago Advanced Manufacturing Plant",
      region: "na",
      regionLabel: "North America",
      location: "Illinois, USA",
      assets: 412,
      openWOs: 6,
      uptime: "99.4%",
      techsOnDuty: 14,
      status: "Healthy",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      id: "US-DAL-02",
      name: "Dallas Logistics & Distribution Terminal",
      region: "na",
      regionLabel: "North America",
      location: "Texas, USA",
      assets: 318,
      openWOs: 3,
      uptime: "99.1%",
      techsOnDuty: 9,
      status: "Healthy",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      id: "EU-MUC-01",
      name: "Munich Technology & Precision Campus",
      region: "emea",
      regionLabel: "EMEA",
      location: "Bavaria, Germany",
      assets: 285,
      openWOs: 2,
      uptime: "99.8%",
      techsOnDuty: 11,
      status: "Healthy",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      id: "EU-FRA-02",
      name: "Frankfurt Industrial Automated Facility",
      region: "emea",
      regionLabel: "EMEA",
      location: "Hesse, Germany",
      assets: 350,
      openWOs: 8,
      uptime: "98.2%",
      techsOnDuty: 12,
      status: "Degraded Alarm",
      statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
    {
      id: "AP-SIN-01",
      name: "Singapore Port Automated Terminal",
      region: "apac",
      regionLabel: "Asia-Pacific",
      location: "Tuas, Singapore",
      assets: 340,
      openWOs: 4,
      uptime: "99.6%",
      techsOnDuty: 16,
      status: "Healthy",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      id: "AP-TOK-02",
      name: "Tokyo Robotics & Assembly Facility",
      region: "apac",
      regionLabel: "Asia-Pacific",
      location: "Kanagawa, Japan",
      assets: 290,
      openWOs: 1,
      uptime: "99.9%",
      techsOnDuty: 10,
      status: "Healthy",
      statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
  ]

  const filteredFacilities =
    selectedRegion === "all"
      ? facilities
      : facilities.filter((f) => f.region === selectedRegion)

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
            <span className="text-white/90 font-semibold">Multi-Site Management</span>
          </nav>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left text column */}
            <div className="lg:col-span-6">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-gold-400 mb-6">
                  <Sparkles size={13} className="text-gold-400" />
                  DISTRIBUTED OPERATIONS & FACILITY GOVERNANCE
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1] text-[#F8FAFC]">
                  Multi-Site Management
                </h1>
                <p className="mt-4 text-xl font-medium text-gold-400">
                  Bring sites, teams, assets, and service operations into one connected operational view.
                </p>
                <p className="mt-4 max-w-xl text-base text-white/75 leading-relaxed">
                  Bring sites, teams, assets, and service operations into one connected operational view.
                </p>

                {/* Core capability pills */}
                <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/85">
                    <Globe size={14} className="text-gold-400" />
                    <span>Global Fleet Telemetry</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/85">
                    <Layers3 size={14} className="text-emerald-400" />
                    <span>Hierarchical Site Master</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/85">
                    <Users size={14} className="text-amber-400" />
                    <span>Cross-Facility Workforce</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right visual column: Industrial Multi-Site Hero & Fleet Command Window */}
            <div className="lg:col-span-6">
              <Reveal direction="left" delay={200}>
                <div className="relative space-y-4">
                  <div className="relative overflow-hidden rounded-xl border border-white/15 shadow-2xl shadow-black/50">
                    <img
                      src="/hero-multisite-management.jpg"
                      alt="FieldOps Nexus Multi-Site Management enterprise facility operations"
                      loading="lazy"
                      className="w-full h-[260px] sm:h-[300px] object-cover object-center block"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3B] via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                      <span className="font-semibold text-white/90 flex items-center gap-1.5">
                        <Activity size={14} className="text-emerald-400 animate-pulse" />
                        14 Facilities Synchronized
                      </span>
                      <span className="rounded-full bg-gold-400/20 border border-gold-400/40 px-2.5 py-0.5 font-bold text-gold-300">
                        Fleet Health 96.8%
                      </span>
                    </div>
                  </div>

                  {/* UI Window Preview */}
                  <UIWindow title="Multi-Site Fleet Command Console">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-white/60">
                        <span>Facility Node</span>
                        <span>Uptime • Health Status</span>
                      </div>
                      {facilities.slice(0, 3).map((f) => (
                        <div
                          key={f.id}
                          className="flex items-center justify-between rounded-lg border border-white/10 bg-[#162A4B] p-2.5 text-white"
                        >
                          <div>
                            <p className="font-bold text-white/95">{f.name}</p>
                            <p className="text-[10px] text-white/60">
                              {f.location} • {f.assets} Assets • {f.openWOs} Open WOs
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-gold-400">{f.uptime}</span>
                            <span className={`block text-[9px] px-1.5 py-0.5 rounded font-semibold mt-0.5 border ${f.statusColor}`}>
                              {f.status}
                            </span>
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
              <p className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">14 Sites</p>
              <p className="text-sm font-bold text-navy-800 mt-1">Unified Under One Platform</p>
              <p className="text-xs text-text-secondary mt-0.5">Automated assembly plants, warehouses, and tech hubs</p>
            </Reveal>
            <Reveal delay={100} className="border-l-2 border-gold-500 pl-5">
              <p className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">100%</p>
              <p className="text-sm font-bold text-navy-800 mt-1">Standardized Governance</p>
              <p className="text-xs text-text-secondary mt-0.5">Enforced safety SOPs and maintenance policies across regions</p>
            </Reveal>
            <Reveal delay={200} className="border-l-2 border-gold-500 pl-5">
              <p className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">38%</p>
              <p className="text-sm font-bold text-navy-800 mt-1">Reduced Redundancy</p>
              <p className="text-xs text-text-secondary mt-0.5">Inter-site parts pooling and mobile technician capacity sharing</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 3. Site & Location Overview ── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">
              HIERARCHICAL ARCHITECTURE
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              From Corporate Enterprise to Physical Production Cell
            </h2>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              Model complex multi-facility enterprises into structured hierarchies. Group physical sites by geographic region, division, and operational criticality.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "Location Master Registry",
                desc: "Centralize facility profiles including physical address, operating schedules, timezone offsets, emergency protocols, and localized regulatory compliance boundaries.",
              },
              {
                icon: Layers3,
                title: "Building & Floor Zone Mapping",
                desc: "Drill down beneath the facility level into buildings, wings, production bays, cleanrooms, and maintenance utility vaults with instant asset geo-referencing.",
              },
              {
                icon: Globe,
                title: "Regional Aggregation & Roll-Ups",
                desc: "Roll up uptime metrics, maintenance costs, and SLA compliance figures across North America, EMEA, and APAC for executive leadership reporting.",
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

      {/* ── 4. Centralized Visibility Across Multiple Operational Sites ── */}
      <section className="py-20 lg:py-24 bg-[#F8FAFC] border-y border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">
              FLEET RADAR
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Centralized Operational Fleet Command
            </h2>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              Compare plant health, active maintenance backlogs, and on-duty workforce capacity across all facilities from a single unified control console.
            </p>
          </Reveal>

          {/* Region Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border border-border bg-white p-1 shadow-sm">
              {[
                { id: "all", label: "All Regions (14)" },
                { id: "na", label: "North America" },
                { id: "emea", label: "EMEA" },
                { id: "apac", label: "Asia-Pacific" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedRegion(tab.id as typeof selectedRegion)}
                  className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
                    selectedRegion === tab.id
                      ? "bg-[#0B1F3B] text-white shadow"
                      : "text-navy-700 hover:text-navy-950 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Facility Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFacilities.map((f, i) => (
              <Reveal key={f.id} delay={i * 60}>
                <div className="rounded-xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold-400 hover:shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-navy-800">
                        {f.id}
                      </span>
                      <h3 className="text-base font-bold text-navy-900 mt-2 leading-snug">
                        {f.name}
                      </h3>
                      <p className="text-xs text-text-secondary flex items-center gap-1 mt-1">
                        <MapPin size={12} className="text-gold-600 shrink-0" /> {f.location}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${f.statusColor}`}>
                      {f.status}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
                    <div className="rounded bg-[#F8FAFC] p-2">
                      <span className="text-[10px] text-text-secondary block">Assets</span>
                      <span className="text-sm font-extrabold text-navy-900">{f.assets}</span>
                    </div>
                    <div className="rounded bg-[#F8FAFC] p-2">
                      <span className="text-[10px] text-text-secondary block">Open WOs</span>
                      <span className="text-sm font-extrabold text-navy-900">{f.openWOs}</span>
                    </div>
                    <div className="rounded bg-[#F8FAFC] p-2">
                      <span className="text-[10px] text-text-secondary block">Uptime</span>
                      <span className="text-sm font-extrabold text-emerald-600">{f.uptime}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-text-secondary pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Users size={13} className="text-navy-700" />
                      <strong>{f.techsOnDuty}</strong> Technicians Active
                    </span>
                    <span className="font-semibold text-gold-600">Region: {f.regionLabel}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Site-Level Asset & Service Information + Team Visibility ── */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-navy-800/10 bg-[#F8FAFC] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy-800 mb-4">
                <Boxes size={13} className="text-gold-600" />
                LOCALIZED ASSET CONTROL
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                Site-Level Asset Registries with Enterprise Telemetry
              </h2>
              <p className="mt-4 text-base text-text-secondary leading-relaxed">
                Each operational site retains localized ownership over equipment maintenance logs, spare parts bins, and preventive maintenance calendars—while adhering to global safety SOPs.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  {
                    title: "Localized Preventive Maintenance Calendars",
                    desc: "Schedule repetitive servicing cycles around local plant production shutdowns, regional public holidays, and shift changes.",
                  },
                  {
                    title: "Cross-Site Parts Inventory Visibility",
                    desc: "When a critical pump blows at Plant A, instantly check spare motor inventory at Plant B and trigger an emergency inter-site transfer.",
                  },
                  {
                    title: "Unified Vendor AMC & Contractor Contracts",
                    desc: "Track local equipment warranties and third-party service agreements alongside corporate master service contracts.",
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
                    <Users size={18} className="text-gold-400" />
                    <h3 className="text-base font-bold text-[#F8FAFC]">Cross-Facility Workforce Deployment</h3>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    Live Roster Active
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-xs">
                  <p className="text-white/70 leading-relaxed">
                    Balance maintenance workload dynamically between neighboring sites. Re-allocate specialized electrical or robotics technicians during emergencies without administrative delay.
                  </p>

                  <div className="rounded-lg bg-[#162A4B] p-3 border border-white/10 space-y-2">
                    <div className="flex justify-between items-center text-white/90">
                      <span className="font-bold">North America Mobile Squad (6 Certified Techs)</span>
                      <span className="text-emerald-400 font-bold">Available</span>
                    </div>
                    <p className="text-[11px] text-white/60">
                      Primary: Chicago Plant • On Standby for Milwaukee & Detroit outages
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#162A4B] p-3 border border-white/10 space-y-2">
                    <div className="flex justify-between items-center text-white/90">
                      <span className="font-bold">Munich High-Voltage Diagnostic Team</span>
                      <span className="text-amber-300 font-bold">Dispatched</span>
                    </div>
                    <p className="text-[11px] text-white/60">
                      Currently deployed at Frankfurt Facility Cell 04 for emergency transformer overhaul
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 6. Cross-Site Operational Monitoring & Benchmarking ── */}
      <section className="py-20 lg:py-24 bg-[#F8FAFC] border-t border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-gold-600 mb-2">
              OPERATIONAL BENCHMARKING
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
              Cross-Site Performance Benchmarking
            </h2>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              Identify top-performing facilities and replicate their maintenance strategies across lower-performing plants to elevate organizational efficiency.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                metric: "MTBF Comparison",
                val: "420 hrs vs 280 hrs",
                note: "Munich plant leads enterprise in asset runtime between failures through predictive vibration testing.",
              },
              {
                metric: "PM Compliance Rate",
                val: "99.2% Average",
                note: "12 of 14 facilities maintained >98% preventive maintenance schedule adherence this quarter.",
              },
              {
                metric: "Parts Stockout Frequency",
                val: "-54% Reduction",
                note: "Cross-site inventory sharing prevented 18 potential production stoppages over the past 6 months.",
              },
            ].map((b, idx) => (
              <Reveal key={b.metric} delay={idx * 80}>
                <div className="h-full rounded-xl border border-border bg-white p-6 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-gold-600">{b.metric}</p>
                  <p className="text-2xl font-black text-navy-900 mt-2">{b.val}</p>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-2">{b.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Standardized FieldOps Nexus CTA (NO BUTTONS) ── */}
      <StandardizedPageCTA />
    </div>
  )
}
