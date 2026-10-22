import { useState } from "react"
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  Cookie,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  CheckCircle2,
  ExternalLink,
  Info,
} from "lucide-react"
import type { Page } from "../types"

interface LegalSection {
  id: string
  title: string
  content: React.ReactNode
}

interface LegalPageLayoutProps {
  pageId: Page
  title: string
  badge: string
  icon: typeof ShieldCheck
  summary: string
  sections: LegalSection[]
  onNavigate: (page: Page) => void
}

function LegalPageLayout({
  title,
  badge,
  icon: IconComponent,
  summary,
  sections,
  onNavigate,
}: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "")

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const el = document.getElementById(id)
    if (el) {
      const navHeight = 84
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <div className="w-full bg-[#F8FAFC]">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-[#0B1F3B] pt-24 pb-16 lg:pt-28 lg:pb-20 text-white border-b border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
        
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-white/50">
            <button
              type="button"
              onClick={() => onNavigate("landing")}
              className="hover:text-white transition-colors"
            >
              Home
            </button>
            <ChevronRight size={12} className="text-white/30" />
            <span className="text-white/70">Legal & Compliance</span>
            <ChevronRight size={12} className="text-white/30" />
            <span className="text-[#F5C451] font-semibold">{title}</span>
          </nav>

          <div className="flex flex-col gap-4 max-w-3xl">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#F5C451]/30 bg-[#F5C451]/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#F5C451]">
              <IconComponent size={14} className="text-[#F5C451]" />
              <span>{badge}</span>
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            
            <p className="text-base text-white/75 leading-relaxed sm:text-lg">
              {summary}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-white/50">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#10B981]" />
                Version 2.4 (Enterprise Edition)
              </span>
              <span>Classification: Public Corporate Document</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Advisory Banner ── */}
      <section className="bg-[#162A4B]/10 border-b border-[#E2E8F0] px-5 py-3">
        <div className="mx-auto max-w-7xl flex items-center gap-3 text-xs text-[#0B1F3B] lg:px-8">
          <Info size={16} className="text-[#F5C451] shrink-0" />
          <p className="leading-snug text-slate-700">
            <strong>Enterprise Notice:</strong> This document is an enterprise draft for FieldOps Nexus. Parameters requiring verified business specifics prior to formal statutory filing are labeled as <code className="bg-[#E2E8F0] px-1 py-0.5 rounded text-[11px] font-semibold text-[#0B1F3B]">[PLACEHOLDER "” CONFIRM BEFORE PUBLICATION]</code>.
          </p>
        </div>
      </section>

      {/* ── Main Document Body ── */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[260px_1fr] items-start">
            {/* Sticky Table of Contents on Desktop */}
            <aside className="hidden lg:block sticky top-28 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[#0B1F3B]">
                Document Sections
              </p>
              <nav className="flex flex-col gap-1.5" aria-label="Table of contents">
                {sections.map((sec, idx) => {
                  const isActive = activeSection === sec.id
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollToSection(sec.id)}
                      className={`text-left text-xs py-2 px-2.5 rounded-lg transition-all ${
                        isActive
                          ? "bg-[#0B1F3B] font-semibold text-[#F5C451] shadow-sm"
                          : "text-slate-600 hover:bg-[#F1F5F9] hover:text-[#0B1F3B]"
                      }`}
                    >
                      <span className="mr-1.5 text-[10px] opacity-60">0{idx + 1}.</span>
                      {sec.title}
                    </button>
                  )
                })}
              </nav>

              <div className="mt-6 pt-5 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => onNavigate("landing")}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#0B1F3B] hover:text-[#C9A227] transition-colors"
                >
                  <ArrowLeft size={13} />
                  Return to Home
                </button>
              </div>
            </aside>

            {/* Document Content Card */}
            <main className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-10 shadow-sm">
              <div className="divide-y divide-[#E2E8F0] space-y-10">
                {sections.map((sec, idx) => (
                  <article key={sec.id} id={sec.id} className="pt-8 first:pt-0 scroll-mt-28">
                    <div className="mb-4 flex items-center gap-2.5">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-[#0B1F3B] text-[11px] font-bold text-[#F5C451]">
                        {idx + 1}
                      </span>
                      <h2 className="text-xl font-bold tracking-tight text-[#0B1F3B] sm:text-2xl">
                        {sec.title}
                      </h2>
                    </div>
                    <div className="text-sm leading-relaxed text-slate-700 space-y-4 font-normal">
                      {sec.content}
                    </div>
                  </article>
                ))}
              </div>

              {/* Bottom Navigation & Contact Card */}
              <div className="mt-14 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#0B1F3B]">Questions about this policy?</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Contact the FieldOps Nexus Compliance & Governance Office
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="mailto:compliance@fieldopsnexus.com"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#0B1F3B] bg-white px-3.5 py-2 text-xs font-semibold text-[#0B1F3B] hover:bg-slate-50 transition-colors"
                  >
                    <Mail size={13} />
                    compliance@fieldopsnexus.com
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#0B1F3B] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#162A4B] transition-colors"
                  >
                    Top
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  )
}

// ============================================================================
// 1. PRIVACY POLICY PAGE
// ============================================================================
export function PrivacyPolicyPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const sections: LegalSection[] = [
    {
      id: "scope",
      title: "Introduction and Scope",
      content: (
        <>
          <p>
            FieldOps Nexus ("FieldOps Nexus," "we," "us," or "our") provides enterprise-grade connected operations, asset registry, preventive maintenance scheduling, work order dispatch, and field telemetry solutions (collectively, the "Platform" or "Services").
          </p>
          <p>
            This Privacy Policy describes how we collect, store, process, protect, and disclose personal and operational data when customer organizations, authorized system administrators, field technicians, supervisors, and portal visitors access our web platform, mobile applications, and application programming interfaces (APIs).
          </p>
          <p>
            <strong>Data Controller Identity:</strong> For organizational data processed within a subscriber's tenant environment, the subscriber acts as the Data Controller, and FieldOps Nexus acts as a Data Processor under standard Enterprise Data Processing Agreements. For website visitors and billing contacts, FieldOps Nexus operating entity <span className="font-semibold text-[#0B1F3B]">[PLACEHOLDER "” CONFIRM BEFORE PUBLICATION: Legal Corporate Entity Name & Address]</span> serves as the Data Controller.
          </p>
        </>
      ),
    },
    {
      id: "collection",
      title: "Information Collected",
      content: (
        <>
          <p>We collect information strictly necessary to provide industrial operations and field dispatch management:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Account & Administrative Records:</strong> First and last name, business email address, phone number, enterprise organization identifier, job title, department, role tier (e.g., Super Admin, Maintenance Planner, Technician, Auditor), and hashed authentication credentials.
            </li>
            <li>
              <strong>Operational & Asset Data:</strong> Equipment serial numbers, asset hierarchy trees, maintenance schedules, work order descriptions, triage notes, inspection checklists, work logs, downtime incident records, and technician resolution sign-offs.
            </li>
            <li>
              <strong>Device, Telemetry & Network Logs:</strong> Internet Protocol (IP) addresses, browser user-agent strings, device operating systems, network latency telemetry, session timestamps, and audit event logs recorded for compliance verification.
            </li>
            <li>
              <strong>Geolocation Data:</strong> Real-time or checkpoint technician GPS coordinates transmitted through authorized mobile field applications solely during active work order dispatch, route optimization, and on-site check-in protocols when enabled by organizational tenant policy.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "usage",
      title: "How Information Is Used",
      content: (
        <>
          <p>Collected data is used strictly for legitimate enterprise business and operational purposes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Providing core work order lifecycle routing, automated triage, and dispatch execution.</li>
            <li>Calculating mean-time-to-repair (MTTR), service level agreement (SLA) conformance, and maintenance schedule compliance.</li>
            <li>Supporting tenant isolation, access boundaries, and credential authentication.</li>
            <li>Generating audit reports, regulatory compliance packages, and automated equipment telemetry insights.</li>
            <li>Transmitting transactional service alerts, SLA breach warnings, and work order assignment notifications.</li>
          </ul>
          <div className="rounded-lg border border-[#E2E8F0] bg-slate-50 p-4 text-xs">
            <strong>Commercial Data Policy:</strong> FieldOps Nexus does not sell or rent customer personal or operational data to third-party data brokers or advertising networks.
          </div>
        </>
      ),
    },
    {
      id: "security",
      title: "Data Storage and Security",
      content: (
        <>
          <p>
            FieldOps Nexus is designed with multi-layered technical and organizational controls to protect enterprise data:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Data Protection Measures:</strong> Production deployments are designed to utilize industry-standard storage controls and transport security (such as TLS).</li>
            <li><strong>Tenant Scoping:</strong> Logical boundaries designed to separate organizational tenant data.</li>
            <li><strong>Access Controls:</strong> Configurable role-based permissions and administrative activity logging.</li>
            <li><strong>Hosting Infrastructure:</strong> Production hosting infrastructure specifications are defined in applicable customer enterprise agreements and deployment documentation.</li>
          </ul>
        </>
      ),
    },
    {
      id: "sharing",
      title: "Data Sharing and Third-Party Sub-processors",
      content: (
        <>
          <p>
            We engage vetted third-party vendors (sub-processors) to perform specialized technical infrastructure and communications services:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Cloud Infrastructure & Databases:</strong> Managed cloud computing and database hosting providers under strict Data Processing Addenda (DPAs).</li>
            <li><strong>Transactional Messaging:</strong> SMS and email transport gateways used solely to deliver automated job dispatch notifications and authentication OTPs.</li>
            <li><strong>Regulatory & Legal Authorities:</strong> Disclosures made only when strictly mandated by valid subpoena, court order, or applicable statutory authority.</li>
          </ul>
        </>
      ),
    },
    {
      id: "cookies",
      title: "Cookies and Tracking Technologies",
      content: (
        <>
          <p>
            The Platform uses essential session tokens and minimal local storage keys necessary for authentication, CSRF defense, and user interface preferences (such as table view settings and navigation state). Detailed specifics are published in our dedicated <button type="button" onClick={() => onNavigate("cookie-policy")} className="text-[#0B1F3B] font-semibold underline hover:text-[#C9A227]">Cookie Policy</button>.
          </p>
        </>
      ),
    },
    {
      id: "retention",
      title: "Data Retention and User Rights",
      content: (
        <>
          <p>
            Operational work orders and audit log histories are retained throughout the active term of the customer's subscription agreement, plus an archival period of <span className="font-semibold text-[#0B1F3B]">[PLACEHOLDER "” CONFIRM BEFORE PUBLICATION: e.g., 90 days or statutory 7-year audit retention window]</span>.
          </p>
          <p>
            Depending on your governing jurisdiction (such as GDPR in the European Economic Area or CCPA/CPRA in California: <span className="font-semibold text-[#0B1F3B]">[PLACEHOLDER "” CONFIRM BEFORE PUBLICATION]</span>), users have the right to request access, correction, portability, or deletion of their personal information by submitting a verified inquiry to our Data Protection Officer.
          </p>
        </>
      ),
    },
    {
      id: "contact",
      title: "Contact Information and Policy Updates",
      content: (
        <>
          <p>
            We may amend this Privacy Policy periodically to reflect technological, operational, or legal developments. Material amendments will be notified via in-platform administrative notices or registered email.
          </p>
          <p>
            For privacy inquiries, Data Protection Officer contact, or compliance questions:
            <br />
            <strong>FieldOps Nexus Privacy Office</strong>
            <br />
            Email: <a href="mailto:privacy@fieldopsnexus.com" className="text-[#0B1F3B] font-semibold underline">privacy@fieldopsnexus.com</a>
            <br />
            Address: <span className="font-semibold text-[#0B1F3B]">[PLACEHOLDER "” CONFIRM BEFORE PUBLICATION: Legal Registered Headquarters Address]</span>
          </p>
        </>
      ),
    },
  ]

  return (
    <LegalPageLayout
      pageId="privacy-policy"
      title="Privacy Policy"
      badge="Data Privacy & Protection"
      icon={ShieldCheck}
      summary="How FieldOps Nexus collects, secures, and handles operational and personal data across our enterprise platform, mobile field tools, and infrastructure."
      sections={sections}
      onNavigate={onNavigate}
    />
  )
}

// ============================================================================
// 2. TERMS & CONDITIONS PAGE
// ============================================================================
export function TermsAndConditionsPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const sections: LegalSection[] = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      content: (
        <>
          <p>
            These Enterprise Terms & Conditions ("Terms") govern access to and use of the FieldOps Nexus software-as-a-service application, API suites, and related operational tools. By executing a Service Order Form, clicking an online acceptance box, or accessing the Services, your organization ("Subscriber" or "Customer") agrees to be legally bound by these Terms.
          </p>
          <p>
            If you are entering into these Terms on behalf of a company, governmental body, or other legal entity, you represent and warrant that you possess full corporate authority to bind that entity.
          </p>
        </>
      ),
    },
    {
      id: "services",
      title: "Scope of Services",
      content: (
        <>
          <p>
            FieldOps Nexus grants Customer a non-exclusive, non-transferable, subscription-based right to access and utilize our multi-tenant cloud platform for internal business operations, including asset lifecycle management, technician dispatch, maintenance planning, and operational intelligence.
          </p>
          <p>
            Service provision includes regular feature updates, technical maintenance, database infrastructure management, and technical support as defined in the applicable Service Level Agreement.
          </p>
        </>
      ),
    },
    {
      id: "responsibilities",
      title: "Account Responsibilities and Acceptable Use",
      content: (
        <>
          <p>Customer agrees to and shall ensure that all authorized users adhere to the following operational standards:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Maintain the confidentiality of administrative credentials and immediately notify FieldOps Nexus of any compromised accounts.</li>
            <li>Do not reverse engineer, decompile, disassemble, or attempt to derive source code from the Platform.</li>
            <li>Do not probe, scan, or test the vulnerability of Platform infrastructure without prior written authorization.</li>
            <li>Do not use the Services to transmit malicious software, unlawful content, or infringing intellectual property.</li>
            <li>Do not exceed agreed concurrent user counts or API throughput rate limits defined in the applicable subscription tier.</li>
          </ul>
        </>
      ),
    },
    {
      id: "ip",
      title: "Intellectual Property Rights",
      content: (
        <>
          <p>
            <strong>FieldOps Nexus Property:</strong> All software, patents, algorithms, user interfaces, documentation, trade secrets, and trademarks associated with the Platform remain the exclusive property of FieldOps Nexus and its licensors.
          </p>
          <p>
            <strong>Customer Data Ownership:</strong> Customer retains all right, title, and ownership in all industrial asset registries, work order records, facility telemetry, and proprietary operational data submitted to the Platform ("Customer Data").
          </p>
        </>
      ),
    },
    {
      id: "availability",
      title: "Service Availability and Limitations",
      content: (
        <>
          <p>
            Target service availability metrics, maintenance windows, and service credits (if any) are governed by the applicable enterprise Service Level Agreement (SLA) executed between the parties.
          </p>
          <p>
            FieldOps Nexus is not liable for service interruptions caused by third-party cellular outages, local hardware failures, or force majeure events beyond reasonable commercial control.
          </p>
        </>
      ),
    },
    {
      id: "liability",
      title: "Limitations of Liability",
      content: (
        <>
          <p>
            To the maximum extent permitted by applicable law, neither party shall be liable for indirect, incidental, punitive, special, or consequential damages, including loss of profits, downtime costs, or business disruption.
          </p>
          <p>
            Except for gross negligence or willful misconduct, either party's total aggregate liability arising out of or related to these Terms shall not exceed the total fees paid by Customer during the <span className="font-semibold text-[#0B1F3B]">[PLACEHOLDER "” CONFIRM BEFORE PUBLICATION: e.g., twelve (12) months preceding the incident]</span>.
          </p>
        </>
      ),
    },
    {
      id: "termination",
      title: "Suspension and Termination",
      content: (
        <>
          <p>
            FieldOps Nexus may suspend access with immediate written notice in the event of non-payment past grace periods, critical security threats, or severe violation of acceptable use provisions.
          </p>
          <p>
            Upon subscription termination, Customer will be provided a transition window of <span className="font-semibold text-[#0B1F3B]">[PLACEHOLDER "” CONFIRM BEFORE PUBLICATION: e.g., thirty (30) days]</span> to export all Customer Data in standard format (CSV/JSON/SQL dump).
          </p>
        </>
      ),
    },
    {
      id: "governing-law",
      title: "Governing Law and Dispute Resolution",
      content: (
        <>
          <p>
            These Terms shall be interpreted and governed by the laws of <span className="font-semibold text-[#0B1F3B]">[PLACEHOLDER "” CONFIRM BEFORE PUBLICATION: Governing State / Federal Jurisdiction, e.g., State of Delaware, USA]</span>, without giving effect to conflict-of-law principles.
          </p>
          <p>
            Disputes shall be submitted to confidential, binding commercial arbitration in <span className="font-semibold text-[#0B1F3B]">[PLACEHOLDER "” CONFIRM BEFORE PUBLICATION: Arbitration City / Forum]</span> under standard commercial arbitration rules.
          </p>
        </>
      ),
    },
  ]

  return (
    <LegalPageLayout
      pageId="terms-and-conditions"
      title="Terms & Conditions"
      badge="Enterprise Agreement"
      icon={FileText}
      summary="Governing terms, operational responsibilities, acceptable use guidelines, and service level commitments for FieldOps Nexus enterprise subscribers."
      sections={sections}
      onNavigate={onNavigate}
    />
  )
}

// ============================================================================
// 3. DISCLAIMER PAGE
// ============================================================================
export function DisclaimerPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const sections: LegalSection[] = [
    {
      id: "general",
      title: "General Information Disclaimer",
      content: (
        <>
          <p>
            The software, marketing descriptions, technical articles, workflow diagrams, and configuration recommendations on the FieldOps Nexus website and platform are provided for informational, organizational, and operational management purposes only.
          </p>
          <p>
            Nothing within the FieldOps Nexus Platform constitutes certified mechanical engineering counsel, structural architectural analysis, workplace occupational safety certification (OSHA or equivalent), or formal regulatory approval. Enterprise subscribers must maintain qualified engineers and certified safety personnel for physical equipment validation.
          </p>
        </>
      ),
    },
    {
      id: "availability-disclaimer",
      title: "Service and Software Availability",
      content: (
        <>
          <p>
            While FieldOps Nexus adheres to high enterprise uptime standards, the Platform is provided on an "as is" and "as available" operational baseline. Real-time notifications, GPS dispatch breadcrumbs, and live telemetry feeds rely on third-party public telecommunications carriers and satellite networks.
          </p>
          <p>
            FieldOps Nexus cannot and does not guarantee that operational alerts, work order dispatches, or emergency incident notifications will be received without network delay in remote or hazardous industrial environments.
          </p>
        </>
      ),
    },
    {
      id: "accuracy",
      title: "Accuracy of Operational Data and Analytics",
      content: (
        <>
          <p>
            Predictive maintenance algorithms, mean-time-to-repair metrics, and parts depletion forecasts are generated through computational estimates based on historical inputs.
          </p>
          <p>
            The subscriber retains sole operational responsibility for verifying equipment physical safety, lockout/tagout (LOTO) protocols, voltage thresholds, and environmental hazards before dispatching technicians to perform physical maintenance.
          </p>
        </>
      ),
    },
    {
      id: "integrations",
      title: "Third-Party Integrations and External Links",
      content: (
        <>
          <p>
            FieldOps Nexus may interface with third-party Enterprise Resource Planning (ERP) systems, Original Equipment Manufacturer (OEM) parts catalogs, and external telemetry sensors via API endpoints.
          </p>
          <p>
            We do not endorse, guarantee, or assume liability for the availability, accuracy, or security standards of third-party external applications or external data sources.
          </p>
        </>
      ),
    },
    {
      id: "liability-disclaimer",
      title: "Limitation of Direct Operational Liability",
      content: (
        <>
          <p>
            In no event shall FieldOps Nexus, its officers, directors, or technical contributors be held liable for workplace injuries, physical industrial machinery failure, unplanned manufacturing downtime, or production batch spoilage resulting from reliance on the software.
          </p>
          <p>
            For legal and liability inquiries, contact <a href="mailto:legal@fieldopsnexus.com" className="text-[#0B1F3B] font-semibold underline">legal@fieldopsnexus.com</a>.
          </p>
        </>
      ),
    },
  ]

  return (
    <LegalPageLayout
      pageId="disclaimer"
      title="Disclaimer"
      badge="Operational & Legal Notice"
      icon={AlertTriangle}
      summary="Important limitations concerning platform telemetry, industrial safety responsibilities, software availability, and third-party integration data."
      sections={sections}
      onNavigate={onNavigate}
    />
  )
}

// ============================================================================
// 5. COOKIE POLICY PAGE
// ============================================================================
export function CookiePolicyPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const sections: LegalSection[] = [
    {
      id: "what-are-cookies",
      title: "What Are Cookies and Local Storage?",
      content: (
        <>
          <p>
            Cookies are compact text files placed on your browser or device when accessing web applications. Along with HTML5 Local Storage and Session Storage, these technologies permit web platforms to maintain authenticated sessions, record user display preferences, and protect against automated security exploits.
          </p>
        </>
      ),
    },
    {
      id: "essential",
      title: "Essential Technical Cookies",
      content: (
        <>
          <p>
            These cookies and storage tokens are strictly necessary for the core operation of the FieldOps Nexus web platform and cannot be toggled off in our systems without breaking security and functional integrity:
          </p>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs border border-[#E2E8F0]">
              <thead className="bg-[#0B1F3B] text-white">
                <tr>
                  <th className="p-2.5">Identifier</th>
                  <th className="p-2.5">Type</th>
                  <th className="p-2.5">Purpose</th>
                  <th className="p-2.5">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white text-slate-700">
                <tr>
                  <td className="p-2.5 font-mono font-bold text-[#0B1F3B]">fieldops_session</td>
                  <td className="p-2.5">Local Storage</td>
                  <td className="p-2.5">Preserves verified user identity, session state, and assigned organizational role.</td>
                  <td className="p-2.5">Session / Logout</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono font-bold text-[#0B1F3B]">csrf_token</td>
                  <td className="p-2.5">Secure Cookie</td>
                  <td className="p-2.5">Cryptographic token preventing Cross-Site Request Forgery attacks.</td>
                  <td className="p-2.5">Session</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono font-bold text-[#0B1F3B]">load_balancer_stickiness</td>
                  <td className="p-2.5">HTTP Cookie</td>
                  <td className="p-2.5">Routes API calls to the appropriate healthy backend application cluster.</td>
                  <td className="p-2.5">Session</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "preferences",
      title: "Preference and UI State Storage",
      content: (
        <>
          <p>
            We use localized browser storage to remember user interface choices made during your session:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Sidebar navigation collapse/expand toggle states.</li>
            <li>Operational dashboard table density and active filter views.</li>
            <li>System reduced-motion and display accessibility flags.</li>
          </ul>
        </>
      ),
    },
    {
      id: "third-party",
      title: "Third-Party Technologies",
      content: (
        <>
          <p>
            FieldOps Nexus does not utilize intrusive third-party cross-site advertising trackers or behavioural tracking networks within its enterprise management platform.
          </p>
          <p>
            CDN edge nodes (Content Delivery Networks) may place transient technical caching cookies to optimize asset delivery speeds for product documentation and video player demonstrations.
          </p>
        </>
      ),
    },
    {
      id: "management",
      title: "Managing and Disabling Cookies",
      content: (
        <>
          <p>
            Most modern internet browsers allow you to review, block, or delete cookies through browser privacy settings (Chrome, Edge, Firefox, Safari).
          </p>
          <p>
            <strong>Operational Note:</strong> Because essential session tokens are required to verify login identity and protect tenant boundaries, disabling cookies will prevent you from accessing authenticated dashboards, work orders, and dispatch controls.
          </p>
        </>
      ),
    },
    {
      id: "contact-cookies",
      title: "Retention and Inquiries",
      content: (
        <>
          <p>
            Session cookies are erased when you close your web browser or click "Sign Out." Preference tokens persist in local storage until cleared manually or overwritten by new settings.
          </p>
          <p>
            Questions regarding our cookie practices should be sent to <a href="mailto:privacy@fieldopsnexus.com" className="text-[#0B1F3B] font-semibold underline">privacy@fieldopsnexus.com</a>.
          </p>
        </>
      ),
    },
  ]

  return (
    <LegalPageLayout
      pageId="cookie-policy"
      title="Cookie Policy"
      badge="Technical Storage Notice"
      icon={Cookie}
      summary="Disclosures regarding session cookies, cryptographic authentication tokens, local storage usage, and user preference controls."
      sections={sections}
      onNavigate={onNavigate}
    />
  )
}

