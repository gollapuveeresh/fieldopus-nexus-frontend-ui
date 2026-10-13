import { ElementType, useEffect, useRef, useState, ReactNode } from "react"
import {
  Sparkles,
  ChevronRight,
  Building2,
  MapPin,
  Boxes,
  Layers3,
  Globe,
  ClipboardList,
  Wrench,
  ArrowRight,
  FileText,
  CheckCheck,
} from "lucide-react"
import type { Page } from "../types"
import StandardizedPageCTA from "../components/ui/StandardizedPageCTA"

type Icon = ElementType

function useInView(threshold = 0.12) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !("IntersectionObserver" in window)) { setVisible(true); return }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function Reveal({
  children, className = "", delay = 0, direction = "up",
}: {
  children: ReactNode; className?: string; delay?: number
  direction?: "up" | "left" | "right" | "scale"
}) {
  const { ref, visible } = useInView()
  const base = "transition-all duration-700 ease-out"
  const hidden = { up: "opacity-0 translate-y-8", left: "opacity-0 -translate-x-8", right: "opacity-0 translate-x-8", scale: "opacity-0 scale-95" }[direction]
  return (
    <div ref={ref} className={`${className} ${base} ${visible ? "opacity-100 translate-y-0 translate-x-0 scale-100" : hidden}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function CapabilityPill({ Icon, label }: { Icon: Icon; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/85">
      <Icon size={13} className="text-[#F5C451] shrink-0" />
      <span>{label}</span>
    </div>
  )
}

function FeatureCard({ Icon, title, desc, delay = 0 }: { Icon: Icon; title: string; desc: string; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <div className="group h-full rounded-xl border border-slate-200 bg-[#F8FAFC] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#F5C451]/60 hover:bg-white hover:shadow-lg">
        <div className="flex size-11 items-center justify-center rounded-lg bg-[#0B1F3B] text-[#F5C451] transition-colors group-hover:bg-[#F5C451] group-hover:text-[#0B1F3B] mb-4">
          <Icon size={20} />
        </div>
        <h3 className="text-base font-bold text-[#0B1F3B] group-hover:text-[#c9993a] transition-colors">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</p>
      </div>
    </Reveal>
  )
}

interface Props { onNavigate: (page: Page) => void }

export default function MultiSiteManagementPage({ onNavigate }: Props) {
  return (
    <div className="w-full bg-white">

      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-[#0B1F3B] text-white pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-40 right-1/4 size-[480px] rounded-full bg-[#F5C451]/[0.055] blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pb-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-medium text-white/50">
            <button type="button" onClick={() => onNavigate("landing")} className="hover:text-white/80 transition-colors">Home</button>
            <ChevronRight size={11} className="text-white/30 shrink-0" />
            <button type="button" onClick={() => onNavigate("solutions-overview" as Page)} className="hover:text-white/80 transition-colors">Solutions</button>
            <ChevronRight size={11} className="text-white/30 shrink-0" />
            <span className="text-white/90 font-semibold">Multi-Site Management</span>
          </nav>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#F5C451]/30 bg-[#F5C451]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#F5C451] mb-6">
                <Sparkles size={13} className="text-[#F5C451]" />
                Enterprise Solutions
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[3.25rem] leading-[1.1] text-[#F8FAFC]">
                Multi-Site<br />Management
              </h1>
              <p className="mt-5 text-lg font-medium text-[#F5C451]/90 leading-relaxed max-w-lg">
                Bring sites, teams, assets, and service operations together in one connected operational view.
              </p>
              <p className="mt-3 max-w-xl text-base text-white/70 leading-relaxed">
                Maintain visibility across locations while keeping site-level activities organized, traceable, and consistently executed from a single unified platform.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-2.5 pt-6 border-t border-white/10">
                <CapabilityPill Icon={Globe} label="Centralized Site Visibility" />
                <CapabilityPill Icon={Boxes} label="Asset Visibility Across Sites" />
                <CapabilityPill Icon={ClipboardList} label="Site-Level Service Coordination" />
              </div>
            </Reveal>

            <Reveal direction="left" delay={200}>
              <div className="relative overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/50">
                <img
                  src="/hero-multisite-management.jpg"
                  alt="Multi-site industrial operations managed through FieldOps Nexus"
                  loading="lazy"
                  className="w-full h-[300px] sm:h-[360px] lg:h-[400px] object-cover object-center block"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3B]/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#0B1F3B]/80 border border-white/20 backdrop-blur-sm px-3.5 py-1.5 text-xs font-semibold text-white/90">
                    <MapPin size={12} className="text-[#F5C451]" />
                    Coordinated operations across multiple locations
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2. One Connected View */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#c9993a] mb-3">Centralized Site Visibility</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0B1F3B] sm:text-4xl">One Connected View Across Every Site</h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Multi-location operations generate complex, distributed information. FieldOps Nexus brings site records, asset data, service activities, and operational context together in a single organized environment so nothing is missed and nothing is isolated.
            </p>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard Icon={Building2} title="Site & Location Organization" desc="Structure your operational environment by site, building, floor, and zone. Maintain organized location profiles that give context to every record in the system." delay={0} />
            <FeatureCard Icon={Boxes} title="Asset Visibility Across Sites" desc="View the assets associated with each location, their records, service history, and current status, without switching between disconnected systems." delay={80} />
            <FeatureCard Icon={ClipboardList} title="Service Activity Coordination" desc="Service requests and work orders are linked to the sites and assets they concern. Teams across locations work from the same source of operational truth." delay={160} />
            <FeatureCard Icon={FileText} title="Operational Information Traceability" desc="Every service action, completion record, and site update is traceable. Understand what happened at each location and maintain an accurate operational history." delay={240} />
          </div>
        </div>
      </section>

      {/* 3. Coordinate Operations */}
      <section className="py-20 lg:py-28 bg-[#F8FAFC] border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal direction="right">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-xl">
                <img src="/about-hero-industrial.jpg" alt="Organized facilities and service operations at scale" loading="lazy" className="w-full h-[300px] sm:h-[360px] object-cover object-center block" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0B1F3B]/30 via-transparent to-transparent" />
              </div>
            </Reveal>
            <Reveal direction="left" delay={150}>
              <p className="text-xs font-bold uppercase tracking-widest text-[#c9993a] mb-3">Consistent Operations</p>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#0B1F3B] sm:text-4xl">Coordinate Operations With Greater Clarity</h2>
              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                Managing operations across multiple locations means keeping site information, assets, and service activities in clear relationship with one another. FieldOps Nexus provides the structure to do this consistently.
              </p>
              <ul className="mt-8 space-y-5">
                {[
                  { title: "Organized Site & Location Information", desc: "Maintain accurate, up-to-date profiles for each location so site context is always available to teams working across the platform." },
                  { title: "Assets Associated With Each Location", desc: "Assets are linked to the sites they belong to. Finding what equipment exists at a given location, and its current status, is straightforward and reliable." },
                  { title: "Service Requests in Site Context", desc: "Service requests and work orders are created and tracked in relation to the specific site and asset they concern, removing ambiguity from multi-location work." },
                  { title: "Consistent Processes Across Locations", desc: "Support the same operational workflows and standards across all locations, ensuring that teams everywhere follow a common, reliable approach." },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#F5C451]/20 mt-0.5">
                      <CheckCheck size={12} className="text-[#c9993a]" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#0B1F3B]">{item.title}</p>
                      <p className="mt-0.5 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. Workflow */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#c9993a] mb-3">Connected Operational Workflow</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0B1F3B] sm:text-4xl">From Site Information to Service Execution</h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Operational records in FieldOps Nexus relate to one another in a clear, logical flow. Understanding one step means understanding where it fits in the larger picture.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { step: 1, label: "Sites & Locations", desc: "Establish your multi-location structure with organized site and location records." },
              { step: 2, label: "Asset Records", desc: "Link equipment and assets to the relevant sites and location zones." },
              { step: 3, label: "Service Requests", desc: "Capture service needs in the context of the asset and location they concern." },
              { step: 4, label: "Work Orders", desc: "Issue and manage work orders that trace back to the originating request and site." },
              { step: 5, label: "Completion Records", desc: "Record and retain the outcome of every service activity at each location." },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 100}>
                <div className="flex flex-col items-center text-center">
                  <div className="flex size-12 items-center justify-center rounded-full border-2 border-[#F5C451] bg-[#0B1F3B] text-[#F5C451] font-extrabold text-base shadow-lg">
                    {s.step}
                  </div>
                  <p className="mt-3 text-sm font-bold text-[#0B1F3B]">{s.label}</p>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="flex justify-center mt-10 lg:hidden">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <ArrowRight size={14} className="text-[#F5C451]" />
              <span>Each step connects to the next across every site</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Platform Capabilities */}
      <section className="py-20 lg:py-28 bg-[#0B1F3B] text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#F5C451]/80 mb-3">Platform Capabilities</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-4xl">Designed for Multi-Location Operations</h2>
            <p className="mt-4 text-base text-white/65 leading-relaxed">
              FieldOps Nexus provides the building blocks that multi-site operations rely on, structured, connected, and consistent across every location you manage.
            </p>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { Icon: Layers3, title: "Hierarchical Location Structure", desc: "Organize sites, buildings, floors, and zones in a clear hierarchy that reflects how your operations are actually arranged." },
              { Icon: Boxes, title: "Site-Scoped Asset Management", desc: "Assets are registered against the locations they belong to, making it straightforward to understand what is where and what its current state is." },
              { Icon: Wrench, title: "Work Orders Linked to Locations", desc: "Every work order maintains a clear connection to the relevant asset, site, and originating service request, removing ambiguity from distributed work." },
              { Icon: MapPin, title: "Location-Aware Service Requests", desc: "Service requests capture the location context from the start, ensuring that the right team receives the right information for each site." },
              { Icon: ClipboardList, title: "Consistent Operational Records", desc: "Completion records, notes, and service history are retained against the correct location and asset, maintaining an accurate operational audit trail." },
              { Icon: Globe, title: "Single Platform for All Sites", desc: "Manage every location within the same environment, removing the need for location-specific tools or disconnected spreadsheets." },
            ].map((cap, i) => {
              const CapIcon = cap.Icon
              return (
                <Reveal key={cap.title} delay={i * 70}>
                  <div className="group h-full rounded-xl border border-white/10 bg-[#162A4B] p-6 transition-all duration-300 hover:border-[#F5C451]/40 hover:bg-[#1a3057]">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-[#0B1F3B] text-[#F5C451] mb-4 transition-colors group-hover:bg-[#F5C451]/10">
                      <CapIcon size={20} />
                    </div>
                    <h3 className="text-base font-bold text-[#F8FAFC]">{cap.title}</h3>
                    <p className="mt-2 text-sm text-white/60 leading-relaxed">{cap.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <StandardizedPageCTA />
    </div>
  )
}
