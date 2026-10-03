import { useState, type FormEvent, type ReactNode } from "react"
import {
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Layers3,
  List,
  MapPin,
  Network,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react"
import PageHeader from "../components/ui/PageHeader"
import DataTable from "../components/ui/DataTable"
import StatusBadge from "../components/ui/StatusBadge"
import FilterBar, { SelectFilter } from "../components/ui/FilterBar"

type Kind = "organization" | "site" | "building" | "zone" | "area"
type Section = "sites" | "organizations" | "buildings" | "areas" | "calendars" | "contacts"
type Location = {
  id: string
  kind: Kind
  name: string
  code: string
  parentId: string | null
  status: "active" | "inactive"
  address?: string
  city?: string
  province?: string
  phone?: string
  email?: string
  manager?: string
  description?: string
  capacity?: string
  hours?: string
  assetCount?: number
}
type Calendar = {
  id: string
  siteId: string
  name: string
  days: string
  hours: string
  timezone: string
  status: "active" | "inactive"
}
type Contact = {
  id: string
  siteId: string
  name: string
  role: string
  phone: string
  email: string
  scope: string
}

const seed: Location[] = [
  {
    id: "org-1",
    kind: "organization",
    name: "FieldOps Corp",
    code: "ORG-001",
    parentId: null,
    status: "active",
    description: "Primary operations organization",
  },
  {
    id: "site-1",
    kind: "site",
    name: "Colombo HQ",
    code: "SITE-001",
    parentId: "org-1",
    status: "active",
    address: "No. 42, Galle Road, Colombo 3",
    city: "Colombo",
    province: "Western Province",
    phone: "+94 11 234 5678",
    manager: "N. Perera",
    assetCount: 214,
    hours: "Mon–Fri · 08:00–18:00",
  },
  {
    id: "b-1",
    kind: "building",
    name: "Main Office",
    code: "BLD-001",
    parentId: "site-1",
    status: "active",
    description: "Head office and visitor reception",
    assetCount: 94,
  },
  {
    id: "z-1",
    kind: "zone",
    name: "Ground Floor",
    code: "ZN-001",
    parentId: "b-1",
    status: "active",
    assetCount: 36,
  },
  {
    id: "a-1",
    kind: "area",
    name: "Reception",
    code: "AR-001",
    parentId: "z-1",
    status: "active",
    assetCount: 8,
  },
  {
    id: "a-2",
    kind: "area",
    name: "East Wing",
    code: "AR-002",
    parentId: "z-1",
    status: "active",
    assetCount: 14,
  },
  {
    id: "z-2",
    kind: "zone",
    name: "First Floor",
    code: "ZN-002",
    parentId: "b-1",
    status: "active",
    assetCount: 58,
  },
  {
    id: "a-3",
    kind: "area",
    name: "Operations Room",
    code: "AR-003",
    parentId: "z-2",
    status: "active",
    assetCount: 21,
  },
  {
    id: "b-2",
    kind: "building",
    name: "Service Block",
    code: "BLD-002",
    parentId: "site-1",
    status: "active",
    assetCount: 120,
  },
  {
    id: "z-3",
    kind: "zone",
    name: "Plant Room",
    code: "ZN-003",
    parentId: "b-2",
    status: "active",
    assetCount: 64,
  },
  {
    id: "a-4",
    kind: "area",
    name: "HVAC Bay",
    code: "AR-004",
    parentId: "z-3",
    status: "active",
    assetCount: 28,
  },
  {
    id: "site-2",
    kind: "site",
    name: "Kandy Branch",
    code: "SITE-002",
    parentId: "org-1",
    status: "active",
    address: "Peradeniya Road",
    city: "Kandy",
    province: "Central Province",
    assetCount: 98,
    manager: "R. Silva",
  },
  {
    id: "b-3",
    kind: "building",
    name: "Branch Office",
    code: "BLD-003",
    parentId: "site-2",
    status: "active",
    assetCount: 98,
  },
  {
    id: "z-4",
    kind: "zone",
    name: "Level 01",
    code: "ZN-004",
    parentId: "b-3",
    status: "active",
    assetCount: 44,
  },
  {
    id: "a-5",
    kind: "area",
    name: "Customer Lobby",
    code: "AR-005",
    parentId: "z-4",
    status: "active",
    assetCount: 12,
  },
  {
    id: "site-3",
    kind: "site",
    name: "Galle Site",
    code: "SITE-003",
    parentId: "org-1",
    status: "active",
    address: "Wakwella Road",
    city: "Galle",
    province: "Southern Province",
    assetCount: 67,
    manager: "S. Fernando",
  },
  {
    id: "site-4",
    kind: "site",
    name: "Data Centre",
    code: "SITE-004",
    parentId: "org-1",
    status: "active",
    address: "Malabe",
    city: "Malabe",
    province: "Western Province",
    assetCount: 121,
    manager: "D. Jayasinghe",
  },
  {
    id: "b-4",
    kind: "building",
    name: "Server Building",
    code: "BLD-004",
    parentId: "site-4",
    status: "active",
    assetCount: 121,
  },
  {
    id: "z-5",
    kind: "zone",
    name: "Server Hall",
    code: "ZN-005",
    parentId: "b-4",
    status: "active",
    assetCount: 87,
  },
  {
    id: "a-6",
    kind: "area",
    name: "Rack Row A",
    code: "AR-006",
    parentId: "z-5",
    status: "active",
    assetCount: 42,
  },
  {
    id: "org-2",
    kind: "organization",
    name: "Acme Operations",
    code: "ORG-002",
    parentId: null,
    status: "active",
    description: "Regional facilities portfolio",
  },
  {
    id: "site-5",
    kind: "site",
    name: "Hyderabad Site",
    code: "SITE-005",
    parentId: "org-2",
    status: "active",
    address: "HITEC City",
    city: "Hyderabad",
    province: "Telangana",
    assetCount: 86,
    manager: "A. Rao",
    hours: "Mon–Sat · 09:00–18:00",
  },
  {
    id: "b-5",
    kind: "building",
    name: "Tower A",
    code: "BLD-005",
    parentId: "site-5",
    status: "active",
    assetCount: 86,
  },
  {
    id: "z-6",
    kind: "zone",
    name: "Floor 03",
    code: "ZN-006",
    parentId: "b-5",
    status: "active",
    assetCount: 32,
  },
  {
    id: "a-7",
    kind: "area",
    name: "Meeting Wing",
    code: "AR-007",
    parentId: "z-6",
    status: "active",
    assetCount: 9,
  },
]

const initialCalendars: Calendar[] = [
  {
    id: "cal-1",
    siteId: "site-1",
    name: "Colombo Standard Hours",
    days: "Monday – Friday",
    hours: "08:00 – 18:00",
    timezone: "Asia/Colombo",
    status: "active",
  },
  {
    id: "cal-2",
    siteId: "site-4",
    name: "Data Centre 24/7",
    days: "Every day",
    hours: "00:00 – 23:59",
    timezone: "Asia/Colombo",
    status: "active",
  },
  {
    id: "cal-3",
    siteId: "site-5",
    name: "Hyderabad Operations",
    days: "Monday – Saturday",
    hours: "09:00 – 18:00",
    timezone: "Asia/Kolkata",
    status: "active",
  },
]

const contacts: Contact[] = [
  {
    id: "c-1",
    siteId: "site-1",
    name: "N. Perera",
    role: "Site Manager",
    phone: "+94 11 234 5678",
    email: "n.perera@fieldops.example",
    scope: "Primary contact",
  },
  {
    id: "c-2",
    siteId: "site-1",
    name: "K. Fernando",
    role: "Facilities Lead",
    phone: "+94 11 234 5680",
    email: "k.fernando@fieldops.example",
    scope: "Escalation contact",
  },
  {
    id: "c-3",
    siteId: "site-5",
    name: "A. Rao",
    role: "Site Manager",
    phone: "+91 40 5550 1200",
    email: "a.rao@acme.example",
    scope: "Primary contact",
  },
]

const labels: Record<Kind, string> = {
  organization: "Organization",
  site: "Site",
  building: "Building",
  zone: "Zone",
  area: "Service Area",
}
const childrenOf: Record<Kind, Kind | null> = {
  organization: "site",
  site: "building",
  building: "zone",
  zone: "area",
  area: null,
}
type SectionLink = {
  id: Section
  label: string
  icon: typeof MapPin
}
const sections: SectionLink[] = [
  { id: "sites", label: "Sites", icon: MapPin },
  { id: "organizations", label: "Organizations", icon: Building2 },
  { id: "buildings", label: "Buildings & Zones", icon: Layers3 },
  { id: "areas", label: "Service Areas", icon: Network },
  { id: "calendars", label: "Operating Calendars", icon: CalendarDays },
  { id: "contacts", label: "Contact Hierarchy", icon: Users },
]
const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded px-3 py-2 text-xs font-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"

function Action({
  children,
  onClick,
  primary = false,
  disabled = false,
  title,
  type = "button",
}: {
  children: ReactNode
  onClick?: () => void
  primary?: boolean
  disabled?: boolean
  title?: string
  type?: "button" | "submit"
}) {
  return (
    <button
      type={type}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`${buttonBase} ${
        primary
          ? "bg-navy-800 text-white hover:bg-navy-700"
          : "bg-white border border-border text-slate-600 hover:border-slate-400 hover:text-navy-800"
      }`}
    >
      {children}
    </button>
  )
}

function InputField({
  label,
  value,
  onChange,
  required = false,
  placeholder = "",
  multiline = false,
  type = "text",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  placeholder?: string
  multiline?: boolean
  type?: string
}) {
  const cls =
    "w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-navy-800 focus:ring-1 focus:ring-navy-800"
  return (
    <label className="block text-xs font-600 text-slate-600">
      {label}
      {required && <span className="text-red-600"> *</span>}
      {multiline ? (
        <textarea
          className={`${cls} mt-1 min-h-20`}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={`${cls} mt-1`}
          type={type}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  )
}

function Choice({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{
    value: string
    label: string
  }>
}) {
  return (
    <label className="block text-xs font-600 text-slate-600">
      {label}
      <select
        className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-navy-800"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function loadLocations(): Location[] {
  try {
    const saved = JSON.parse(
      localStorage.getItem("fieldops_locations_v1") ?? "null",
    )
    return Array.isArray(saved) ? saved : seed
  } catch {
    return seed
  }
}
function loadCalendars(): Calendar[] {
  try {
    const saved = JSON.parse(
      localStorage.getItem("fieldops_calendars_v1") ?? "null",
    )
    return Array.isArray(saved) ? saved : initialCalendars
  } catch {
    return initialCalendars
  }
}

export default function SiteLocationMaster({
  detail = false,
}: {
  detail?: boolean
}) {
  const [nodes, setNodes] = useState<Location[]>(loadLocations)
  const [calendars, setCalendars] = useState<Calendar[]>(loadCalendars)
  const [section, setSection] = useState<Section>("sites")
  const [selectedId, setSelectedId] = useState<string | null>(
    detail ? "site-1" : null,
  )
  const [expanded, setExpanded] = useState<string[]>([
    "org-1",
    "site-1",
    "org-2",
  ])
  const [treeSearch, setTreeSearch] = useState("")
  const [search, setSearch] = useState("")
  const [orgFilter, setOrgFilter] = useState("")
  const [siteFilter, setSiteFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [view, setView] = useState<"list" | "hierarchy">("list")
  const [page, setPage] = useState(1)
  const [tab, setTab] = useState("overview")
  const [draft, setDraft] = useState<Partial<Location> | null>(null)
  const [calendarDraft, setCalendarDraft] = useState<Partial<Calendar> | null>(
    null,
  )
  const [confirm, setConfirm] = useState<Location | null>(null)
  const [error, setError] = useState("")
  const [showTree, setShowTree] = useState(false)
  const [notice, setNotice] = useState("")

  const byId = (id: string | null | undefined) => nodes.find((n) => n.id === id)
  const lineage = (node: Location): Location[] => {
    const result = [node]
    let parent = byId(node.parentId)
    while (parent) {
      result.unshift(parent)
      parent = byId(parent.parentId)
    }
    return result
  }
  const ancestor = (node: Location, kind: Kind) =>
    lineage(node).find((n) => n.kind === kind)
  const descendants = (node: Location) =>
    nodes.filter(
      (n) => lineage(n).some((p) => p.id === node.id) && n.id !== node.id,
    )
  const selected = byId(selectedId)
  const organizations = nodes.filter((n) => n.kind === "organization")
  const sites = nodes.filter((n) => n.kind === "site")
  const activeSite =
    selected &&
    (selected.kind === "site" ? selected : ancestor(selected, "site"))
  const filteredNodes = nodes.filter((n) => {
    const path = lineage(n)
    return (
      (!orgFilter || path.some((p) => p.id === orgFilter)) &&
      (!siteFilter || path.some((p) => p.id === siteFilter)) &&
      (!statusFilter || n.status === statusFilter) &&
      (!search ||
        `${n.name} ${n.code} ${n.address ?? ""} ${n.city ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase()))
    )
  })
  const rows =
    section === "organizations"
      ? filteredNodes.filter((n) => n.kind === "organization")
      : section === "sites"
        ? filteredNodes.filter((n) => n.kind === "site")
        : section === "buildings"
          ? filteredNodes.filter(
              (n) => n.kind === "building" || n.kind === "zone",
            )
          : filteredNodes.filter((n) => n.kind === "area")
  const totalPages = Math.max(1, Math.ceil(rows.length / 8))
  const paged = rows.slice(
    (Math.min(page, totalPages) - 1) * 8,
    Math.min(page, totalPages) * 8,
  )
  const sectionKind: Record<Section, Kind> = {
    organizations: "organization",
    sites: "site",
    buildings: "building",
    areas: "area",
    calendars: "site",
    contacts: "site",
  }

  function selectNode(node: Location) {
    setSelectedId(node.id)
    setTab("overview")
    setNotice("")
    setShowTree(false)
    setExpanded((prev) => [
      ...new Set([...prev, ...lineage(node).map((n) => n.id)]),
    ])
  }
  function chooseSection(next: Section) {
    setSection(next)
    setSelectedId(null)
    setSearch("")
    setPage(1)
    setNotice("")
    setShowTree(false)
  }
  function openCreate(kind: Kind, parentId?: string) {
    const suggestedParent =
      parentId ??
      (kind === "site"
        ? orgFilter || organizations[0]?.id
        : kind === "building"
          ? activeSite?.id || siteFilter || sites[0]?.id
          : kind === "zone"
            ? selected?.kind === "building"
              ? selected.id
              : nodes.find((n) => n.kind === "building")?.id
            : kind === "area"
              ? selected?.kind === "zone"
                ? selected.id
                : nodes.find((n) => n.kind === "zone")?.id
              : undefined)
    setDraft({
      kind,
      name: "",
      code: "",
      parentId: suggestedParent ?? null,
      status: "active",
      assetCount: 0,
    })
    setError("")
  }
  function saveNode(e: FormEvent) {
    e.preventDefault()
    if (!draft?.kind) return
    const name = draft.name?.trim() ?? ""
    const code = draft.code?.trim().toUpperCase() ?? ""
    if (!name || !code || (draft.kind !== "organization" && !draft.parentId)) {
      setError("Name, code and parent are required.")
      return
    }
    if (
      draft.parentId &&
      byId(draft.parentId)?.status !== "active" &&
      draft.parentId !== byId(draft.id)?.parentId
    ) {
      setError("Choose an active parent location.")
      return
    }
    if (
      nodes.some(
        (n) => n.code.toLowerCase() === code.toLowerCase() && n.id !== draft.id,
      )
    ) {
      setError("This code is already in use.")
      return
    }
    const item: Location = {
      ...draft,
      id: draft.id ?? `loc-${Date.now()}`,
      kind: draft.kind,
      name,
      code,
      parentId: draft.parentId ?? null,
      status: draft.status ?? "active",
    }
    const next = draft.id
      ? nodes.map((n) => (n.id === item.id ? item : n))
      : [...nodes, item]
    setNodes(next)
    localStorage.setItem("fieldops_locations_v1", JSON.stringify(next))
    setDraft(null)
    selectNode(item)
    setNotice(
      `${labels[item.kind]} ${draft.id ? "updated" : "created"} successfully.`,
    )
  }
  function changeStatus() {
    if (!confirm) return
    const status: Location["status"] =
      confirm.status === "active" ? "inactive" : "active"
    const affected = new Set([
      confirm.id,
      ...(status === "inactive" ? descendants(confirm).map((n) => n.id) : []),
    ])
    const next = nodes.map((n) => (affected.has(n.id) ? { ...n, status } : n))
    setNodes(next)
    localStorage.setItem("fieldops_locations_v1", JSON.stringify(next))
    setNotice(
      `${confirm.name} ${status === "active" ? "reactivated" : "deactivated"}${
        affected.size > 1
          ? ` along with ${affected.size - 1} child locations`
          : ""
      }.`,
    )
    setConfirm(null)
  }
  function saveCalendar(e: FormEvent) {
    e.preventDefault()
    if (
      !calendarDraft?.siteId ||
      !calendarDraft.name?.trim() ||
      !calendarDraft.days?.trim() ||
      !calendarDraft.hours?.trim()
    ) {
      setError("Site, name, days and hours are required.")
      return
    }
    const item: Calendar = {
      id: calendarDraft.id ?? `cal-${Date.now()}`,
      siteId: calendarDraft.siteId,
      name: calendarDraft.name.trim(),
      days: calendarDraft.days.trim(),
      hours: calendarDraft.hours.trim(),
      timezone: calendarDraft.timezone ?? "Asia/Colombo",
      status: calendarDraft.status ?? "active",
    }
    const next = calendarDraft.id
      ? calendars.map((c) => (c.id === item.id ? item : c))
      : [...calendars, item]
    setCalendars(next)
    localStorage.setItem("fieldops_calendars_v1", JSON.stringify(next))
    setCalendarDraft(null)
    setNotice(
      `Calendar ${calendarDraft.id ? "updated" : "created"} successfully.`,
    )
  }
  function exportCsv() {
    const csv = [
      ["Code", "Name", "Type", "Organization", "Site", "Status"],
      ...rows.map((n) => [
        n.code,
        n.name,
        labels[n.kind],
        ancestor(n, "organization")?.name ?? "",
        ancestor(n, "site")?.name ?? "",
        n.status,
      ]),
    ]
      .map((line) => line.map((v) => `"${v.replace(/"/g, '""')}"`).join(","))
      .join("\r\n")
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    )
    const link = document.createElement("a")
    link.href = url
    link.download = `locations-${section}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }
  function treeItem(node: Location, depth = 0): ReactNode {
    const children = nodes.filter(
      (n) =>
        n.parentId === node.id &&
        (!orgFilter || lineage(n).some((p) => p.id === orgFilter)) &&
        (!siteFilter || lineage(n).some((p) => p.id === siteFilter)),
    )
    const matches =
      (!treeSearch ||
        node.name.toLowerCase().includes(treeSearch.toLowerCase()) ||
        node.code.toLowerCase().includes(treeSearch.toLowerCase()) ||
        children.some((child) => subtreeMatches(child))) &&
      (view !== "hierarchy" ||
        selected !== undefined ||
        rows.some((row) => lineage(row).some((part) => part.id === node.id)))
    if (!matches) return null
    const isOpen = treeSearch ? true : expanded.includes(node.id)
    const Icon =
      node.kind === "organization"
        ? Building2
        : node.kind === "site"
          ? MapPin
          : node.kind === "building"
            ? Layers3
            : node.kind === "zone"
              ? Network
              : CircleHelp
    return (
      <div key={node.id}>
        <div
          className={`group flex items-center gap-1 rounded pr-2 hover:bg-surface-2 ${["pl-2", "pl-6", "pl-10", "pl-14", "pl-18"][Math.min(depth, 4)]} ${
            selectedId === node.id
              ? "bg-surface-2 text-navy-800"
              : "text-slate-600"
          }`}
        >
          <button
            className="flex h-8 w-5 shrink-0 items-center justify-center"
            aria-label={`${isOpen ? "Collapse" : "Expand"} ${node.name}`}
            disabled={!children.length}
            onClick={() =>
              setExpanded((prev) =>
                isOpen
                  ? prev.filter((id) => id !== node.id)
                  : [...prev, node.id],
              )
            }
          >
            {children.length ? (
              isOpen ? (
                <ChevronDown size={13} />
              ) : (
                <ChevronRight size={13} />
              )
            ) : null}
          </button>
          <button
            className="flex min-w-0 flex-1 items-center gap-2 py-2 text-left text-xs"
            onClick={() => selectNode(node)}
          >
            <Icon size={14} className="shrink-0 text-text-secondary" />
            <span className="truncate">{node.name}</span>
          </button>
          {node.status === "inactive" && (
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400"
              title="Inactive"
            />
          )}
        </div>
        {isOpen && children.map((child) => treeItem(child, depth + 1))}
      </div>
    )
  }
  function subtreeMatches(node: Location): boolean {
    return (
      `${node.name} ${node.code}`
        .toLowerCase()
        .includes(treeSearch.toLowerCase()) ||
      nodes.some((n) => n.parentId === node.id && subtreeMatches(n))
    )
  }
  const tree = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between border-b border-border px-4 py-4">
        <div>
          <div className="text-sm font-600 text-text-primary">
            Location hierarchy
          </div>
          <div className="mt-0.5 text-xs text-slate-400">
            Browse your portfolio
          </div>
        </div>
        <button
          className="lg:hidden"
          onClick={() => setShowTree(false)}
          aria-label="Close hierarchy"
        >
          <X size={18} />
        </button>
      </div>
      <div className="relative mx-3 mt-3">
        <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
        <input
          aria-label="Search hierarchy"
          value={treeSearch}
          onChange={(e) => setTreeSearch(e.target.value)}
          placeholder="Find a location..."
          className="w-full rounded border border-border bg-surface py-2 pl-9 pr-2 text-xs outline-none focus:border-navy-800"
        />
      </div>
      <div className="mt-3 flex-1 overflow-y-auto px-2 pb-4">
        {organizations
          .filter((n) => !orgFilter || n.id === orgFilter)
          .map((n) => treeItem(n))}
        {!nodes.some(
          (n) =>
            n.kind === "organization" &&
            (!orgFilter || n.id === orgFilter) &&
            subtreeMatches(n),
        ) &&
          treeSearch && (
            <div className="px-3 py-8 text-center text-xs text-slate-400">
              No locations match your search.
            </div>
          )}
      </div>
      <div className="border-t border-border px-4 py-3 text-xs text-text-secondary">
        {sites.length} sites ·{" "}
        {nodes.filter((n) => n.kind === "building").length} buildings
      </div>
    </div>
  )

  const locationCols = [
    {
      key: "code",
      label: "Code",
      render: (n: Location) => (
        <span className="font-600 text-navy-800">{n.code}</span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (n: Location) => (
        <div className="font-500 text-text-primary">
          {n.name}
          <div className="mt-0.5 text-xs font-400 text-slate-400">
            {labels[n.kind]}
          </div>
        </div>
      ),
    },
    {
      key: "parentId",
      label: "Located within",
      render: (n: Location) => (
        <span className="text-text-secondary">
          {byId(n.parentId)?.name ?? "—"}
        </span>
      ),
    },
    {
      key: "location",
      label: "Location / coverage",
      render: (n: Location) => (
        <span className="text-text-secondary">
          {n.city
            ? [n.city, n.province].filter(Boolean).join(", ")
            : n.kind === "organization"
              ? `${descendants(n).filter((d) => d.kind === "site").length} sites`
              : `${descendants(n).filter((d) => d.kind === childrenOf[n.kind]).length} ${
                  childrenOf[n.kind] === "area"
                    ? "areas"
                    : `${childrenOf[n.kind] ?? "child"}s`
                }`}
        </span>
      ),
    },
    {
      key: "assetCount",
      label: "Assets",
      render: (n: Location) => (
        <span className="font-600 text-text-primary">
          {n.assetCount ??
            (n.kind === "organization"
              ? descendants(n)
                  .filter((d) => d.kind === "site")
                  .reduce((sum, s) => sum + (s.assetCount ?? 0), 0)
              : "—")}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (n: Location) => <StatusBadge status={n.status} />,
    },
    {
      key: "open",
      label: "",
      render: () => <ChevronRight size={15} className="text-slate-400" />,
    },
  ]

  return (
    <div className="flex min-h-full flex-col bg-surface">
      <PageHeader
        title="Site & Location Master"
        subtitle="Manage organizations, sites, buildings and service coverage in one place"
        actions={
          <>
            <div className="lg:hidden">
              <Action onClick={() => setShowTree(true)} title="Open hierarchy">
                <Network size={14} />{" "}
                <span className="hidden sm:inline">Hierarchy</span>
              </Action>
            </div>
            {section !== "contacts" && (
              <Action
                primary
                onClick={() => {
                  if (section === "calendars") {
                    setCalendarDraft({
                      siteId: siteFilter || activeSite?.id || sites[0]?.id,
                      status: "active",
                      timezone: "Asia/Colombo",
                    })
                    setError("")
                  } else {
                    openCreate(sectionKind[section])
                  }
                }}
              >
                <Plus size={14} />{" "}
                {section === "calendars"
                  ? "Add Calendar"
                  : `Add ${labels[sectionKind[section]]}`}
              </Action>
            )}
          </>
        }
      />
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 border-r border-border lg:block">
          {tree}
        </aside>
        {showTree && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowTree(false)}
            />
            <aside className="relative w-72 max-w-[85vw] shadow-xl">
              {tree}
            </aside>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="border-b border-border bg-white px-6">
            <div className="flex gap-1 overflow-x-auto">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => chooseSection(s.id)}
                  className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-xs font-500 transition-colors ${
                    section === s.id
                      ? "border-gold-500 text-navy-800"
                      : "border-transparent text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <s.icon size={14} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mx-auto max-w-7xl p-5 md:p-6">
            {notice && (
              <div
                role="status"
                className="mb-4 flex items-center justify-between rounded border border-green-200 bg-green-50 px-4 py-2 text-xs text-green-800"
              >
                {notice}
                <button
                  onClick={() => setNotice("")}
                  aria-label="Dismiss notice"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            {selected ? (
              <>
                <div className="mb-5 flex flex-wrap items-center gap-1 text-xs text-text-secondary">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="hover:text-navy-800"
                  >
                    {sections.find((s) => s.id === section)?.label}
                  </button>
                  {lineage(selected).map((n) => (
                    <span key={n.id} className="flex items-center gap-1">
                      <ChevronRight size={12} />
                      <button
                        onClick={() => selectNode(n)}
                        className={
                          n.id === selected.id
                            ? "font-600 text-navy-800"
                            : "hover:text-navy-800"
                        }
                      >
                        {n.name}
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mb-5 rounded-lg border border-border bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-navy-800">
                        {selected.kind === "site" ? (
                          <MapPin size={20} />
                        ) : (
                          <Building2 size={20} />
                        )}
                      </div>
                      <div>
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-700 text-text-primary">
                            {selected.name}
                          </h2>
                          <StatusBadge status={selected.status} />
                        </div>
                        <div className="text-xs text-text-secondary">
                          {labels[selected.kind]} · {selected.code}
                          {selected.city
                            ? ` · ${selected.city}, ${selected.province}`
                            : ""}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Action
                        onClick={() => {
                          setDraft({ ...selected })
                          setError("")
                        }}
                      >
                        <Pencil size={13} /> Edit
                      </Action>
                      <Action onClick={() => setConfirm(selected)}>
                        {selected.status === "active"
                          ? "Deactivate"
                          : "Reactivate"}
                      </Action>
                    </div>
                  </div>
                </div>
                <div className="mb-5 flex gap-1 overflow-x-auto border-b border-border">
                  {["overview", "hierarchy", "contacts", "calendar"].map(
                    (t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`shrink-0 border-b-2 px-4 py-2.5 text-xs font-500 capitalize ${
                          tab === t
                            ? "border-gold-500 text-navy-800"
                            : "border-transparent text-text-secondary"
                        }`}
                      >
                        {t}
                      </button>
                    ),
                  )}
                </div>
                {tab === "overview" && (
                  <div className="grid gap-5 xl:grid-cols-3">
                    <div className="rounded-lg border border-border bg-white p-5 xl:col-span-2">
                      <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-sm font-600 text-text-primary">
                          {labels[selected.kind]} information
                        </h3>
                        <span className="text-xs text-slate-400">
                          Master record
                        </span>
                      </div>
                      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                        {[
                          ["Code", selected.code],
                          [
                            "Organization",
                            ancestor(selected, "organization")?.name ??
                              selected.name,
                          ],
                          [
                            "Parent location",
                            byId(selected.parentId)?.name ?? "—",
                          ],
                          ["Address", selected.address ?? "—"],
                          [
                            "City / Province",
                            [selected.city, selected.province]
                              .filter(Boolean)
                              .join(", ") || "—",
                          ],
                          ["Site manager", selected.manager ?? "—"],
                          ["Phone", selected.phone ?? "—"],
                          ["Operating hours", selected.hours ?? "—"],
                          ["Description", selected.description ?? "—"],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <div className="mb-1 text-xs text-slate-400">
                              {label}
                            </div>
                            <div className="text-sm font-500 text-text-primary">
                              {value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-5">
                      <div className="rounded-lg border border-border bg-white p-5">
                        <h3 className="mb-4 text-sm font-600 text-text-primary">
                          At a glance
                        </h3>
                        {[
                          [
                            "Sites",
                            selected.kind === "organization"
                              ? descendants(selected).filter(
                                  (n) => n.kind === "site",
                                ).length
                              : null,
                          ],
                          [
                            "Buildings",
                            descendants(selected).filter(
                              (n) => n.kind === "building",
                            ).length,
                          ],
                          [
                            "Zones",
                            descendants(selected).filter(
                              (n) => n.kind === "zone",
                            ).length,
                          ],
                          [
                            "Service areas",
                            descendants(selected).filter(
                              (n) => n.kind === "area",
                            ).length,
                          ],
                          ["Assets", selected.assetCount ?? "—"],
                        ]
                          .filter(([, value]) => value !== null)
                          .map(([label, value]) => (
                            <div
                              key={label}
                              className="flex justify-between border-b border-surface-2 py-2.5 last:border-0"
                            >
                              <span className="text-xs text-text-secondary">
                                {label}
                              </span>
                              <span className="text-sm font-600 text-text-primary">
                                {value}
                              </span>
                            </div>
                          ))}
                      </div>
                      <div className="rounded-lg border border-border bg-white p-5">
                        <h3 className="mb-2 text-sm font-600 text-text-primary">
                          Location path
                        </h3>
                        <div className="flex flex-wrap items-center gap-1 text-xs text-text-secondary">
                          {lineage(selected).map((n, i) => (
                            <span
                              key={n.id}
                              className="inline-flex items-center gap-1"
                            >
                              {i > 0 && <ChevronRight size={12} />}
                              {n.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {tab === "hierarchy" && (
                  <div className="rounded-lg border border-border bg-white p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-600 text-text-primary">
                          Contained locations
                        </h3>
                        <p className="mt-1 text-xs text-text-secondary">
                          Navigate the levels below {selected.name}.
                        </p>
                      </div>
                      {childrenOf[selected.kind] && (
                        <Action
                          onClick={() =>
                            openCreate(childrenOf[selected.kind]!, selected.id)
                          }
                        >
                          <Plus size={13} /> Add{" "}
                          {labels[childrenOf[selected.kind]!]}
                        </Action>
                      )}
                    </div>
                    {nodes.filter((n) => n.parentId === selected.id).length ? (
                      <div className="divide-y divide-surface-2">
                        {nodes
                          .filter((n) => n.parentId === selected.id)
                          .map((n) => (
                            <button
                              key={n.id}
                              onClick={() => selectNode(n)}
                              className="flex w-full items-center justify-between gap-3 py-3 text-left hover:bg-surface"
                            >
                              <div className="flex items-center gap-3">
                                <div className="rounded bg-surface-2 p-2 text-text-secondary">
                                  <Layers3 size={15} />
                                </div>
                                <div>
                                  <div className="text-sm font-500 text-text-primary">
                                    {n.name}
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    {n.code} · {labels[n.kind]} ·{" "}
                                    {
                                      nodes.filter(
                                        (child) => child.parentId === n.id,
                                      ).length
                                    }{" "}
                                    child locations
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <StatusBadge status={n.status} />
                                <ChevronRight
                                  size={14}
                                  className="text-slate-400"
                                />
                              </div>
                            </button>
                          ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center text-sm text-slate-400">
                        No child locations yet. Add one to build this hierarchy.
                      </div>
                    )}
                  </div>
                )}
                {tab === "contacts" && (
                  <ContactPanel
                    items={contacts.filter((c) =>
                      activeSite
                        ? c.siteId === activeSite.id
                        : sites.some(
                            (s) =>
                              s.parentId === selected.id && s.id === c.siteId,
                          ),
                    )}
                    sites={sites}
                  />
                )}
                {tab === "calendar" && (
                  <CalendarPanel
                    items={calendars.filter((c) =>
                      activeSite
                        ? c.siteId === activeSite.id
                        : sites.some(
                            (s) =>
                              s.parentId === selected.id && s.id === c.siteId,
                          ),
                    )}
                    sites={sites}
                    onEdit={(c) => {
                      setCalendarDraft({ ...c })
                      setError("")
                    }}
                    onAdd={() => {
                      setCalendarDraft({
                        siteId: activeSite?.id ?? sites[0]?.id,
                        status: "active",
                        timezone: "Asia/Colombo",
                      })
                      setError("")
                    }}
                  />
                )}
              </>
            ) : (
              <>
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-400">
                      MASTER DATA / {section.toUpperCase()}
                    </div>
                    <h2 className="mt-1 text-xl font-700 text-text-primary">
                      {sections.find((s) => s.id === section)?.label}
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary">
                      {section === "sites"
                        ? "A single source of truth for every operational location."
                        : section === "organizations"
                          ? "Group sites by their owning organization."
                          : section === "buildings"
                            ? "Explore the structures and zones within each site."
                            : section === "areas"
                              ? "Define the spaces where work and assets are located."
                              : section === "calendars"
                                ? "Keep local working hours and coverage visible."
                                : "Know who to contact at each site."}
                    </p>
                  </div>
                  {section !== "contacts" && (
                    <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-600 text-navy-800">
                      {section === "calendars" ? calendars.length : rows.length}{" "}
                      records
                    </span>
                  )}
                </div>
                <div className="mb-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Organizations", organizations.length, Building2],
                    [
                      "Active sites",
                      sites.filter((s) => s.status === "active").length,
                      MapPin,
                    ],
                    [
                      "Service areas",
                      nodes.filter((n) => n.kind === "area").length,
                      Network,
                    ],
                  ].map(([label, value, Icon]) => {
                    const DisplayIcon = Icon as typeof MapPin
                    return (
                      <div
                        key={label as string}
                        className="flex items-center gap-3 rounded-lg border border-border bg-white p-4"
                      >
                        <div className="rounded-lg bg-surface-2 p-2.5 text-navy-800">
                          <DisplayIcon size={18} />
                        </div>
                        <div>
                          <div className="text-xl font-700 text-text-primary">
                            {value as number}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {label as string}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {section === "calendars" ? (
                  <CalendarPanel
                    items={calendars.filter(
                      (c) =>
                        (!orgFilter ||
                          ancestor(byId(c.siteId)!, "organization")?.id ===
                            orgFilter) &&
                        (!siteFilter || c.siteId === siteFilter) &&
                        (!statusFilter || c.status === statusFilter) &&
                        (!search ||
                          `${c.name} ${byId(c.siteId)?.name}`
                            .toLowerCase()
                            .includes(search.toLowerCase())),
                    )}
                    sites={sites}
                    onEdit={(c) => {
                      setCalendarDraft({ ...c })
                      setError("")
                    }}
                    onAdd={() => {
                      setCalendarDraft({
                        siteId: siteFilter || sites[0]?.id,
                        status: "active",
                        timezone: "Asia/Colombo",
                      })
                      setError("")
                    }}
                  />
                ) : section === "contacts" ? (
                  <ContactPanel
                    items={contacts.filter(
                      (c) =>
                        (!siteFilter || c.siteId === siteFilter) &&
                        (!orgFilter ||
                          ancestor(byId(c.siteId)!, "organization")?.id ===
                            orgFilter) &&
                        (!search ||
                          `${c.name} ${c.role} ${byId(c.siteId)?.name}`
                            .toLowerCase()
                            .includes(search.toLowerCase())),
                    )}
                    sites={sites}
                  />
                ) : null}
                <div className="mt-5">
                  <FilterBar
                    search={search}
                    onSearch={(v) => {
                      setSearch(v)
                      setPage(1)
                    }}
                    searchPlaceholder={`Search ${section} by name or code...`}
                    filters={
                      <>
                        <SelectFilter
                          label="Organization"
                          value={orgFilter}
                          onChange={(v) => {
                            setOrgFilter(v)
                            setSiteFilter("")
                            setPage(1)
                          }}
                          options={organizations.map((n) => ({
                            label: n.name,
                            value: n.id,
                          }))}
                        />
                        <SelectFilter
                          label="Site"
                          value={siteFilter}
                          onChange={(v) => {
                            setSiteFilter(v)
                            setPage(1)
                          }}
                          options={sites
                            .filter(
                              (s) => !orgFilter || s.parentId === orgFilter,
                            )
                            .map((n) => ({ label: n.name, value: n.id }))}
                        />
                        <SelectFilter
                          label="Status"
                          value={statusFilter}
                          onChange={(v) => {
                            setStatusFilter(v)
                            setPage(1)
                          }}
                          options={[
                            { label: "Active", value: "active" },
                            { label: "Inactive", value: "inactive" },
                          ]}
                        />
                      </>
                    }
                    onExport={
                      section === "calendars" || section === "contacts"
                        ? undefined
                        : exportCsv
                    }
                  />
                  {section !== "calendars" && section !== "contacts" && (
                    <>
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs text-text-secondary">
                          Showing {rows.length}{" "}
                          {section === "buildings"
                            ? "buildings and zones"
                            : section}
                        </span>
                        <div className="flex gap-1">
                          <Action
                            onClick={() => setView("list")}
                            title="List view"
                          >
                            <List size={14} /> List
                          </Action>
                          <Action
                            onClick={() => setView("hierarchy")}
                            title="Hierarchy view"
                          >
                            <Network size={14} /> Hierarchy
                          </Action>
                        </div>
                      </div>
                      {view === "list" ? (
                        <DataTable
                          columns={locationCols}
                          data={paged}
                          onRowClick={selectNode}
                          emptyMessage="No locations match these filters"
                          pagination={
                            rows.length > 8
                              ? {
                                  page: Math.min(page, totalPages),
                                  perPage: 8,
                                  total: rows.length,
                                  onPage: setPage,
                                }
                              : undefined
                          }
                        />
                      ) : (
                        <div className="rounded-lg border border-border bg-white p-4">
                          <div className="mb-3 text-sm font-600 text-text-primary">
                            Organization → Site → Building → Zone → Service Area
                          </div>
                          {organizations
                            .filter((n) => !orgFilter || n.id === orgFilter)
                            .map((n) => treeItem(n))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {draft && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDraft(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${draft.id ? "Edit" : "Add"} ${labels[draft.kind!]}`}
            className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-xl"
          >
            <div className="flex items-start justify-between border-b border-border p-6">
              <div>
                <h2 className="text-lg font-700 text-text-primary">
                  {draft.id ? "Edit" : "Add"} {labels[draft.kind!]}
                </h2>
                <p className="mt-1 text-xs text-text-secondary">
                  {draft.id
                    ? "Update this master record."
                    : "Add a location to the operational hierarchy."}
                </p>
              </div>
              <button onClick={() => setDraft(null)} aria-label="Close form">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={saveNode} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                <InputField
                  label="Name"
                  required
                  value={draft.name ?? ""}
                  onChange={(name) => setDraft({ ...draft, name })}
                  placeholder={`Enter ${labels[draft.kind!].toLowerCase()} name`}
                />
                <InputField
                  label="Code"
                  required
                  value={draft.code ?? ""}
                  onChange={(code) => setDraft({ ...draft, code })}
                  placeholder="Unique identifier"
                />
                {draft.kind !== "organization" && (
                  <Choice
                    label={`Parent ${labels[({ site: "organization", building: "site", zone: "building", area: "zone" } as Record<string, Kind>)[draft.kind!]]}`}
                    value={draft.parentId ?? ""}
                    onChange={(parentId) => setDraft({ ...draft, parentId })}
                    options={[
                      { value: "", label: "Select parent location" },
                      ...nodes
                        .filter(
                          (n) =>
                            n.kind ===
                              ({
                                site: "organization",
                                building: "site",
                                zone: "building",
                                area: "zone",
                              } as Record<string, Kind>)[draft.kind!] &&
                            n.status === "active",
                        )
                        .map((n) => ({
                          value: n.id,
                          label: `${n.name} (${n.code})`,
                        })),
                    ]}
                  />
                )}
                {draft.kind === "site" && (
                  <>
                    <InputField
                      label="Street address"
                      value={draft.address ?? ""}
                      onChange={(address) => setDraft({ ...draft, address })}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <InputField
                        label="City"
                        value={draft.city ?? ""}
                        onChange={(city) => setDraft({ ...draft, city })}
                      />
                      <InputField
                        label="Province / State"
                        value={draft.province ?? ""}
                        onChange={(province) =>
                          setDraft({ ...draft, province })
                        }
                      />
                    </div>
                    <InputField
                      label="Site manager"
                      value={draft.manager ?? ""}
                      onChange={(manager) => setDraft({ ...draft, manager })}
                    />
                    <InputField
                      label="Contact phone"
                      type="tel"
                      value={draft.phone ?? ""}
                      onChange={(phone) => setDraft({ ...draft, phone })}
                    />
                    <InputField
                      label="Operating hours"
                      value={draft.hours ?? ""}
                      onChange={(hours) => setDraft({ ...draft, hours })}
                      placeholder="Mon–Fri · 08:00–18:00"
                    />
                  </>
                )}
                {draft.kind !== "organization" && (
                  <InputField
                    label="Asset count"
                    type="number"
                    value={String(draft.assetCount ?? 0)}
                    onChange={(value) =>
                      setDraft({
                        ...draft,
                        assetCount: Math.max(0, Number(value)),
                      })
                    }
                  />
                )}
                <InputField
                  label="Description"
                  multiline
                  value={draft.description ?? ""}
                  onChange={(description) =>
                    setDraft({ ...draft, description })
                  }
                />
                {error && (
                  <p role="alert" className="text-xs text-red-600">
                    {error}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2 border-t border-border p-4">
                <Action onClick={() => setDraft(null)}>Cancel</Action>
                <Action type="submit" primary>
                  {draft.id ? "Save changes" : `Create ${labels[draft.kind!]}`}
                </Action>
              </div>
            </form>
          </div>
        </div>
      )}
      {calendarDraft && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setCalendarDraft(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Operating calendar"
            className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="text-lg font-700 text-text-primary">
                {calendarDraft.id ? "Edit" : "Add"} operating calendar
              </h2>
              <button
                onClick={() => setCalendarDraft(null)}
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={saveCalendar} className="flex flex-1 flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                <Choice
                  label="Site"
                  value={calendarDraft.siteId ?? ""}
                  onChange={(siteId) =>
                    setCalendarDraft({ ...calendarDraft, siteId })
                  }
                  options={[
                    { value: "", label: "Select site" },
                    ...sites.map((s) => ({ value: s.id, label: s.name })),
                  ]}
                />
                <InputField
                  label="Calendar name"
                  required
                  value={calendarDraft.name ?? ""}
                  onChange={(name) =>
                    setCalendarDraft({ ...calendarDraft, name })
                  }
                />
                <InputField
                  label="Working days"
                  required
                  placeholder="Monday – Friday"
                  value={calendarDraft.days ?? ""}
                  onChange={(days) =>
                    setCalendarDraft({ ...calendarDraft, days })
                  }
                />
                <InputField
                  label="Operating hours"
                  required
                  placeholder="08:00 – 18:00"
                  value={calendarDraft.hours ?? ""}
                  onChange={(hours) =>
                    setCalendarDraft({ ...calendarDraft, hours })
                  }
                />
                <InputField
                  label="Timezone"
                  value={calendarDraft.timezone ?? ""}
                  onChange={(timezone) =>
                    setCalendarDraft({ ...calendarDraft, timezone })
                  }
                />
                <Choice
                  label="Status"
                  value={calendarDraft.status ?? "active"}
                  onChange={(status) =>
                    setCalendarDraft({
                      ...calendarDraft,
                      status: status as Calendar["status"],
                    })
                  }
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                  ]}
                />
                {error && (
                  <p role="alert" className="text-xs text-red-600">
                    {error}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2 border-t border-border p-4">
                <Action onClick={() => setCalendarDraft(null)}>Cancel</Action>
                <Action type="submit" primary>
                  Save calendar
                </Action>
              </div>
            </form>
          </div>
        </div>
      )}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-label="Confirm status change"
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-700">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-lg font-600 text-text-primary">
              {confirm.status === "active" ? "Deactivate" : "Reactivate"}{" "}
              {confirm.name}?
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              {confirm.status === "active"
                ? `This record and its ${descendants(confirm).length} child locations will be marked inactive. Historical data remains available.`
                : "This record will be marked active. Child locations remain unchanged."}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Action onClick={() => setConfirm(null)}>Cancel</Action>
              <Action primary onClick={changeStatus}>
                Confirm
              </Action>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CalendarPanel({
  items,
  sites,
  onEdit,
  onAdd,
}: {
  items: Calendar[]
  sites: Location[]
  onEdit: (calendar: Calendar) => void
  onAdd: () => void
}) {
  return (
    <div className="rounded-lg border border-border bg-white">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <h3 className="text-sm font-600 text-text-primary">
            Operating calendars
          </h3>
          <p className="mt-1 text-xs text-text-secondary">
            Working days, hours and timezones by site
          </p>
        </div>
        <Action onClick={onAdd}>
          <Plus size={13} /> Add calendar
        </Action>
      </div>
      {items.length ? (
        <div className="grid gap-3 p-4 md:grid-cols-2">
          {items.map((c) => (
            <div key={c.id} className="rounded-lg border border-border p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="rounded bg-surface-2 p-2 text-navy-800">
                    <CalendarDays size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-600 text-text-primary">
                      {c.name}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {sites.find((s) => s.id === c.siteId)?.name}
                    </div>
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-text-secondary">
                <Clock3 size={14} />
                {c.days} · {c.hours}
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-surface-2 pt-3 text-xs text-slate-400">
                <span>{c.timezone}</span>
                <button
                  onClick={() => onEdit(c)}
                  className="inline-flex items-center gap-1 font-600 text-navy-800"
                >
                  <Pencil size={12} /> Edit calendar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 text-center text-sm text-slate-400">
          No calendars match this view.
        </div>
      )}
    </div>
  )
}

function ContactPanel({
  items,
  sites,
}: {
  items: Contact[]
  sites: Location[]
}) {
  return (
    <div className="rounded-lg border border-border bg-white">
      <div className="border-b border-border p-4">
        <h3 className="text-sm font-600 text-text-primary">
          Site contact hierarchy
        </h3>
        <p className="mt-1 text-xs text-text-secondary">
          Primary and escalation contacts for operational sites
        </p>
      </div>
      {items.length ? (
        <div className="grid gap-3 p-4 md:grid-cols-2">
          {items.map((c) => (
            <div key={c.id} className="rounded-lg border border-border p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 text-xs font-700 text-navy-800">
                  {c.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-sm font-600 text-text-primary">
                    {c.name}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {c.role} · {sites.find((s) => s.id === c.siteId)?.name}
                  </div>
                </div>
              </div>
              <div className="mb-2 text-xs text-text-secondary">{c.scope}</div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-800">
                <span>{c.phone}</span>
                <span>{c.email}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 text-center text-sm text-slate-400">
          No contacts match this view.
        </div>
      )}
    </div>
  )
}
