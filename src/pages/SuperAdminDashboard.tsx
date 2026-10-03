import { createElement, useState, type ComponentProps, type ReactNode } from 'react';
import {
  Activity, AlertTriangle, Archive, BarChart3, Bell, Box, Building2,
  CalendarClock, Check, ChevronDown, ChevronRight, CircleHelp, ClipboardCheck,
  Clock3, Database, FileClock, FileText, Gauge, Globe2, HardDrive,
  KeyRound, Layers3, ListChecks, LockKeyhole, LogOut, MapPin, Menu,
  Package, Play, Plus, RefreshCw, Search, Settings, Shield, ShieldCheck,
  SlidersHorizontal, User, UserCog, Users, Wrench, X,
} from 'lucide-react';
import type { UserSession } from '../types';

type View =
  | 'overview' | 'organizations' | 'sites' | 'users' | 'roles' | 'scope'
  | 'assets' | 'service' | 'work-orders' | 'maintenance' | 'inventory'
  | 'sla' | 'dashboards' | 'audit' | 'settings' | 'notifications'
  | 'profile' | 'security';
type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type NavItem = { id: View; label: string; icon: typeof Activity };

const NAV: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'organizations', label: 'Organizations', icon: Building2 },
  { id: 'sites', label: 'Sites & Locations', icon: MapPin },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck },
  { id: 'assets', label: 'Assets', icon: Box },
  { id: 'service', label: 'Service Operations', icon: ClipboardCheck },
  { id: 'work-orders', label: 'Work Orders', icon: ListChecks },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'sla', label: 'SLA & Policies', icon: FileClock },
  { id: 'dashboards', label: 'Operational Dashboards', icon: BarChart3 },
  { id: 'audit', label: 'Audit & Compliance', icon: Shield },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

const ORGANIZATIONS = [
  { name: 'Northstar Facilities', code: 'ORG-001', sites: 8, users: 124, assets: 1438, work: 92, status: 'Active', activity: '12 min ago' },
  { name: 'Meridian Property Group', code: 'ORG-002', sites: 5, users: 76, assets: 684, work: 41, status: 'Active', activity: '38 min ago' },
  { name: 'Horizon Service Partners', code: 'ORG-003', sites: 3, users: 42, assets: 391, work: 18, status: 'Active', activity: '2 hr ago' },
  { name: 'Atlas Workplace Services', code: 'ORG-004', sites: 2, users: 21, assets: 176, work: 6, status: 'Suspended', activity: '4 days ago' },
  { name: 'Crestline Operations', code: 'ORG-005', sites: 1, users: 9, assets: 88, work: 0, status: 'Inactive', activity: '18 days ago' },
];
const USERS_DATA = [
  { name: 'Avery Morgan', email: 'avery.morgan@example.test', role: 'Operations', org: 'Northstar Facilities', scope: '8 sites', status: 'Active', login: 'Today, 09:42' },
  { name: 'Priya Sen', email: 'priya.sen@example.test', role: 'Asset Manager', org: 'Meridian Property Group', scope: '5 sites', status: 'Active', login: 'Today, 08:16' },
  { name: 'Eli Navarro', email: 'eli.navarro@example.test', role: 'Maintenance Planner', org: 'Northstar Facilities', scope: '3 sites', status: 'Active', login: 'Yesterday, 17:28' },
  { name: 'Mina Park', email: 'mina.park@example.test', role: 'Supervisor', org: 'Horizon Service Partners', scope: '2 sites', status: 'Pending', login: 'Not signed in' },
  { name: 'Theo Bennett', email: 'theo.bennett@example.test', role: 'Technician', org: 'Atlas Workplace Services', scope: '1 site', status: 'Locked', login: '3 days ago' },
  { name: 'Noah Clarke', email: 'noah.clarke@example.test', role: 'Stores', org: 'Crestline Operations', scope: '1 site', status: 'Inactive', login: '24 days ago' },
];
const ALERTS = [
  { severity: 'High', title: 'Dashboard snapshot failed', module: 'Operational Dashboards', time: '8 min ago', status: 'Open' },
  { severity: 'Medium', title: 'Scheduled task delayed', module: 'System', time: '21 min ago', status: 'Investigating' },
  { severity: 'Medium', title: 'Elevated permission granted', module: 'Roles & Permissions', time: '1 hr ago', status: 'Reviewed' },
  { severity: 'Low', title: 'Warranty expiry window reached', module: 'Warranty / Contract', time: '3 hr ago', status: 'Open' },
];
const SNAPSHOTS = [
  { name: 'Executive Operations Weekly', metrics: '8 metrics', scope: 'All authorized organizations', period: 'Weekly', last: 'Today, 06:00', status: 'Completed', next: 'Mon, 06:00' },
  { name: 'SLA Governance Daily', metrics: 'SLA + response', scope: '3 organizations', period: 'Daily', last: 'Today, 07:00', status: 'Completed', next: 'Tomorrow, 07:00' },
  { name: 'Maintenance Compliance', metrics: 'PM compliance', scope: 'Northstar / All sites', period: 'Monthly', last: '1 Sep, 05:30', status: 'Ready', next: '1 Oct, 05:30' },
  { name: 'Asset Reliability', metrics: 'MTTR + MTBF', scope: 'Meridian / 5 sites', period: 'Weekly', last: 'Today, 06:15', status: 'Failed', next: 'Mon, 06:15' },
];
const AUDIT = [
  { time: '29 Sep 2026 · 10:48:32', actor: 'Super Admin', action: 'Permission changed', module: 'RBAC', object: 'Maintenance Planner', result: 'Success', ref: 'AUD-009184' },
  { time: '29 Sep 2026 · 10:22:14', actor: 'A. Morgan', action: 'User login', module: 'Security', object: 'Session', result: 'Success', ref: 'SES-482901' },
  { time: '29 Sep 2026 · 09:56:08', actor: 'Super Admin', action: 'Scope updated', module: 'Organizations', object: 'Northstar Facilities', result: 'Success', ref: 'AUD-009182' },
  { time: '29 Sep 2026 · 09:31:45', actor: 'System', action: 'Snapshot execution', module: 'Dashboards', object: 'Asset Reliability', result: 'Failed', ref: 'RUN-006241' },
  { time: '29 Sep 2026 · 08:47:11', actor: 'Unknown session', action: 'Access attempt', module: 'Security', object: 'System Settings', result: 'Blocked', ref: 'SEC-001872' },
];

function ButtonControl(props: ComponentProps<'button'>) {
  return createElement('button', props);
}
function InputControl(props: ComponentProps<'input'>) {
  return createElement('input', props);
}
function SelectControl(props: ComponentProps<'select'>) {
  return createElement('select', props);
}

function Button({ children, onClick, primary, danger, disabled, compact, type = 'button' }: { children: ReactNode; onClick?: () => void; primary?: boolean; danger?: boolean; disabled?: boolean; compact?: boolean; type?: 'button' | 'submit' }) {
  const variant = primary
    ? 'bg-admin-primary text-white hover:bg-admin-secondary'
    : danger
      ? 'border-admin-danger/30 text-admin-danger hover:bg-admin-danger/5'
      : 'border-admin-primary/15 bg-white text-admin-secondary hover:border-admin-secondary/40 hover:bg-admin-surface';
  return <ButtonControl type={type} disabled={disabled} onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded border border-transparent font-600 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${compact ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm'} ${variant}`}>{children}</ButtonControl>;
}
function Field({ value, onChange, placeholder, icon: Icon = Search, type = 'text' }: { value: string; onChange: (value: string) => void; placeholder: string; icon?: typeof Search; type?: string }) {
  return <label className="relative block"><Icon size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-admin-primary/40" /><InputControl type={type} value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded border border-admin-primary/15 bg-white py-2 pl-9 pr-3 text-sm text-admin-primary outline-none transition-colors duration-200 placeholder:text-admin-primary/35 focus:border-admin-info" /></label>;
}
function Select({ value, onChange, label, options }: { value: string; onChange: (value: string) => void; label: string; options: string[] }) {
  return <label className="relative"><span className="sr-only">{label}</span><SelectControl value={value} onChange={event => onChange(event.target.value)} className="appearance-none rounded border border-admin-primary/15 bg-white py-2 pl-3 pr-8 text-xs text-admin-secondary outline-none focus:border-admin-info"><option value="">{label}</option>{options.map(option => <option key={option}>{option}</option>)}</SelectControl><ChevronDown size={12} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-admin-primary/45" /></label>;
}
function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  const colors: Record<Tone, string> = {
    success: 'bg-admin-success/10 text-admin-success',
    warning: 'bg-admin-warning/10 text-admin-warning',
    danger: 'bg-admin-danger/10 text-admin-danger',
    info: 'bg-admin-info/10 text-admin-info',
    neutral: 'bg-admin-primary/5 text-admin-secondary',
  };
  return <span className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-600 ${colors[tone]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{children}</span>;
}
function toneFor(status: string): Tone {
  if (['Active', 'Healthy', 'Success', 'Completed', 'Ready', 'Allowed'].includes(status)) return 'success';
  if (['Warning', 'Pending', 'Running', 'Restricted', 'Investigating', 'Medium'].includes(status)) return 'warning';
  if (['Failed', 'Blocked', 'Locked', 'Suspended', 'Unavailable', 'High'].includes(status)) return 'danger';
  if (['Open', 'Low'].includes(status)) return 'info';
  return 'neutral';
}
function Section({ title, description, action, children, className = '' }: { title: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return <section className={`overflow-hidden rounded-lg border border-admin-primary/10 bg-white shadow-sm ${className}`}><div className="flex flex-wrap items-start justify-between gap-3 border-b border-admin-primary/10 px-5 py-4"><div><div className="font-700 text-admin-primary">{title}</div>{description && <div className="mt-1 text-xs text-admin-primary/55">{description}</div>}</div>{action}</div>{children}</section>;
}
function Table({ headers, children, empty = false }: { headers: string[]; children: ReactNode; empty?: boolean }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-max"><thead><tr className="bg-admin-surface">{headers.map(header => <th key={header} className="whitespace-nowrap px-4 py-3 text-left text-xs font-700 uppercase tracking-wide text-admin-primary/50">{header}</th>)}</tr></thead><tbody className="divide-y divide-admin-primary/10">{empty ? <tr><td colSpan={headers.length} className="px-4 py-12 text-center text-sm text-admin-primary/45">No records match the current filters.</td></tr> : children}</tbody></table></div>;
}
function Cell({ children, strong, muted }: { children: ReactNode; strong?: boolean; muted?: boolean }) {
  return <td className={`whitespace-nowrap px-4 py-3 text-sm ${strong ? 'font-600 text-admin-primary' : muted ? 'text-admin-primary/50' : 'text-admin-secondary'}`}>{children}</td>;
}
function Stat({ label, value, context, icon: Icon, tone = 'neutral' }: { label: string; value: string; context: string; icon: typeof Activity; tone?: Tone }) {
  const iconColor = tone === 'danger' ? 'text-admin-danger bg-admin-danger/10' : tone === 'warning' ? 'text-admin-warning bg-admin-warning/10' : tone === 'success' ? 'text-admin-success bg-admin-success/10' : 'text-admin-secondary bg-admin-primary/5';
  return <div className="rounded-lg border border-admin-primary/10 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between"><div className={`rounded-lg p-2.5 ${iconColor}`}><Icon size={17} /></div><span className={`mt-1 h-2 w-2 rounded-full ${tone === 'danger' ? 'bg-admin-danger' : tone === 'warning' ? 'bg-admin-warning' : 'bg-admin-success'}`} /></div><div className="mt-4 text-2xl font-700 text-admin-primary">{value}</div><div className="mt-1 text-sm font-600 text-admin-secondary">{label}</div><div className="mt-1 text-xs text-admin-primary/45">{context}</div></div>;
}
function Filters({ search, setSearch, extra }: { search: string; setSearch: (value: string) => void; extra?: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2 border-b border-admin-primary/10 p-4"><div className="min-w-56 flex-1"><Field value={search} onChange={setSearch} placeholder="Search records..." /></div>{extra}</div>;
}

export default function SuperAdminDashboard({ session, onSignOut }: { session: UserSession | null; onSignOut: () => void }) {
  const [view, setView] = useState<View>('overview');
  const [mobileNav, setMobileNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [modal, setModal] = useState<'organization' | 'user' | 'snapshot' | null>(null);
  const [runningSnapshot, setRunningSnapshot] = useState('');

  function navigate(next: View) {
    setView(next);
    setMobileNav(false);
    setProfileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 3200);
  }
  function runSnapshot(name: string) {
    setRunningSnapshot(name);
    setModal(null);
    window.setTimeout(() => {
      setRunningSnapshot('');
      notify(`${name} completed successfully.`);
    }, 1400);
  }

  const page = view === 'overview' ? <Overview navigate={navigate} notify={notify} />
    : view === 'organizations' ? <Organizations onCreate={() => setModal('organization')} notify={notify} />
    : view === 'sites' ? <Sites />
    : view === 'users' ? <UsersAdmin onCreate={() => setModal('user')} notify={notify} />
    : view === 'roles' ? <Roles />
    : view === 'scope' ? <Scope />
    : view === 'dashboards' ? <Dashboards onRun={(name) => { setRunningSnapshot(name); setModal('snapshot'); }} running={runningSnapshot} />
    : view === 'audit' ? <Audit />
    : view === 'settings' ? <SettingsView />
    : view === 'notifications' ? <Notifications notify={notify} />
    : view === 'profile' ? <Profile session={session} security={false} />
    : view === 'security' ? <Profile session={session} security />
    : <Visibility view={view} />;

  const sidebar = <div className="flex h-full flex-col bg-admin-primary text-white">
    <div className="flex h-16 items-center gap-3 border-b border-white/[0.08] px-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-admin-gold text-admin-primary"><Activity size={18} /></div>
      {!collapsed && <div className="min-w-0"><div className="text-sm font-700 tracking-wide">FieldOps Nexus</div><div className="mt-0.5 text-xs font-700 tracking-widest text-admin-gold">SUPER ADMIN</div></div>}
      <ButtonControl onClick={() => setMobileNav(false)} className="ml-auto text-white/60 md:hidden" aria-label="Close navigation"><X size={19} /></ButtonControl>
    </div>
    <nav className="sidebar-scroll flex-1 space-y-1 overflow-y-auto px-2 py-4">{NAV.map(item => <ButtonControl key={item.id} title={collapsed ? item.label : undefined} onClick={() => navigate(item.id)} className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm transition-all duration-200 ${view === item.id ? 'bg-admin-secondary font-600 text-white shadow-inner ring-1 ring-white/10' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}><item.icon size={16} className={view === item.id ? 'text-admin-gold' : ''} />{!collapsed && <span>{item.label}</span>}{view === item.id && !collapsed && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-admin-gold" />}</ButtonControl>)}</nav>
    <div className="border-t border-white/[0.08] p-2">
      {!collapsed && <div className="mb-2 px-3 py-2"><div className="text-xs font-600">Super Admin</div><div className="mt-0.5 truncate text-xs text-white/40">{session?.email ?? 'superadmin@fieldopsnexus.com'}</div></div>}
      {[{ id: 'profile' as View, label: 'Profile', icon: User }, { id: 'security' as View, label: 'Security', icon: LockKeyhole }].map(item => <ButtonControl key={item.id} onClick={() => navigate(item.id)} className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-white/60 hover:bg-white/5 hover:text-white"><item.icon size={15} />{!collapsed && item.label}</ButtonControl>)}
      <ButtonControl onClick={onSignOut} className="flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm text-white/60 hover:bg-admin-danger/10 hover:text-admin-danger"><LogOut size={15} />{!collapsed && 'Logout'}</ButtonControl>
    </div>
  </div>;

  return <div className="flex min-h-screen bg-admin-surface text-admin-primary">
    <aside className={`sticky top-0 hidden h-screen shrink-0 transition-all duration-200 md:block ${collapsed ? 'w-16' : 'w-64'}`}>{sidebar}</aside>
    {mobileNav && <div className="fixed inset-0 z-50 flex md:hidden"><ButtonControl className="absolute inset-0 bg-admin-primary/60" onClick={() => setMobileNav(false)} aria-label="Close navigation overlay" /><aside className="relative w-72 max-w-full">{sidebar}</aside></div>}
    <div className="min-w-0 flex-1">
      <header className="sticky top-0 z-30 border-b border-admin-primary/10 bg-white">
        <div className="flex min-h-16 items-center gap-3 px-4 md:px-6">
          <ButtonControl onClick={() => setMobileNav(true)} className="text-admin-secondary md:hidden" aria-label="Open navigation"><Menu size={20} /></ButtonControl>
          <ButtonControl onClick={() => setCollapsed(value => !value)} className="hidden rounded p-2 text-admin-primary/45 hover:bg-admin-primary/5 md:block" aria-label="Collapse navigation"><Menu size={17} /></ButtonControl>
          <div className="min-w-0 flex-1"><div className="truncate text-sm font-700 text-admin-primary md:text-base">Platform Administration</div><div className="hidden truncate text-xs text-admin-primary/50 sm:block">Manage organizations, access, configuration and platform-wide visibility.</div></div>
          {searchOpen ? <div className="absolute inset-x-3 top-3 z-10 md:static md:w-72"><Field value={globalSearch} onChange={setGlobalSearch} placeholder="Search users, organizations, settings..." /><ButtonControl onClick={() => { setSearchOpen(false); setGlobalSearch(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-admin-primary/40"><X size={14} /></ButtonControl>{globalSearch && <div className="absolute left-0 right-0 top-full mt-2 rounded-lg border border-admin-primary/10 bg-white p-2 shadow-xl"><ButtonControl onClick={() => navigate('organizations')} className="w-full rounded px-3 py-2 text-left text-xs hover:bg-admin-surface">Organizations matching “{globalSearch}”</ButtonControl><ButtonControl onClick={() => navigate('users')} className="w-full rounded px-3 py-2 text-left text-xs hover:bg-admin-surface">Users matching “{globalSearch}”</ButtonControl></div>}</div> : <ButtonControl onClick={() => setSearchOpen(true)} className="rounded p-2 text-admin-primary/55 hover:bg-admin-primary/5" aria-label="Global search"><Search size={18} /></ButtonControl>}
          <ButtonControl onClick={() => navigate('notifications')} className="relative rounded p-2 text-admin-primary/55 hover:bg-admin-primary/5" aria-label="Notifications"><Bell size={18} /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-admin-danger ring-2 ring-white" /></ButtonControl>
          <ButtonControl onClick={() => notify('Help center opened in demo mode.')} className="hidden rounded p-2 text-admin-primary/55 hover:bg-admin-primary/5 sm:block" aria-label="Help"><CircleHelp size={18} /></ButtonControl>
          <div className="relative"><ButtonControl onClick={() => setProfileOpen(value => !value)} className="flex items-center gap-2 rounded border border-admin-primary/10 p-1.5 pr-2 hover:bg-admin-surface"><span className="flex h-7 w-7 items-center justify-center rounded bg-admin-primary text-xs font-700 text-admin-gold">SA</span><span className="hidden text-xs font-600 text-admin-primary lg:block">Super Admin</span><ChevronDown size={12} /></ButtonControl>{profileOpen && <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-admin-primary/10 bg-white p-1 shadow-xl">{[{ id: 'profile' as View, label: 'Profile', icon: User }, { id: 'security' as View, label: 'Security', icon: LockKeyhole }, { id: 'settings' as View, label: 'Preferences', icon: SlidersHorizontal }, { id: 'settings' as View, label: 'System Settings', icon: Settings }].map((item, index) => <ButtonControl key={`${item.label}-${index}`} onClick={() => navigate(item.id)} className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-xs text-admin-secondary hover:bg-admin-surface"><item.icon size={14} />{item.label}</ButtonControl>)}<div className="my-1 border-t border-admin-primary/10" /><ButtonControl onClick={onSignOut} className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-xs text-admin-danger hover:bg-admin-danger/5"><LogOut size={14} />Logout</ButtonControl></div>}</div>
        </div>
      </header>
      <main className="p-4 md:p-6">{page}</main>
    </div>
    {toast && <div role="status" className="fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-3 rounded-lg bg-admin-primary px-4 py-3 text-sm text-white shadow-xl"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-admin-success"><Check size={14} /></span>{toast}<ButtonControl onClick={() => setToast('')} className="ml-2 text-white/50"><X size={14} /></ButtonControl></div>}
    {modal && <Modal kind={modal} running={runningSnapshot} onClose={() => { setModal(null); setRunningSnapshot(''); }} onConfirm={(name) => modal === 'snapshot' ? runSnapshot(name) : (setModal(null), notify(modal === 'organization' ? 'Organization created successfully.' : 'User invitation sent successfully.'))} />}
  </div>;
}

function PageTitle({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><div className="text-xs font-700 uppercase tracking-widest text-admin-primary/40">{eyebrow}</div><div className="mt-1 text-2xl font-700 text-admin-primary">{title}</div><div className="mt-1 max-w-3xl text-sm text-admin-primary/55">{description}</div></div>{actions && <div className="flex flex-wrap gap-2">{actions}</div>}</div>;
}
function Overview({ navigate, notify }: { navigate: (view: View) => void; notify: (message: string) => void }) {
  const stats = [
    ['Total Organizations', '5', '4 active · 1 inactive', Building2, 'success'],
    ['Active Sites', '19', 'Across authorized scope', MapPin, 'success'],
    ['Active Users', '263', '7 pending access', Users, 'info'],
    ['Configured Roles', '9', '3 custom permission sets', ShieldCheck, 'neutral'],
    ['Active Assets', '2,514', 'Registry visibility only', Box, 'success'],
    ['System Alerts', '4', '1 requires attention', AlertTriangle, 'danger'],
  ] as const;
  return <div>
    <PageTitle eyebrow="Super Admin / Overview" title="Platform control center" description="A platform-wide view of organizations, access, system health and governed reporting. Demo data shown." actions={<><Badge tone="success">Platform available</Badge><Button onClick={() => notify('Platform status refreshed.') }><RefreshCw size={14} />Refresh</Button></>} />
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{stats.map(([label, value, context, icon, tone]) => <Stat key={label} label={label} value={value} context={context} icon={icon} tone={tone} />)}</div>
    <div className="mt-5 grid gap-5 xl:grid-cols-3">
      <Section title="Access configuration" description="RBAC and scope posture across the platform" className="xl:col-span-2" action={<Button compact onClick={() => navigate('roles')}>Manage RBAC<ChevronRight size={13} /></Button>}>
        <div className="grid gap-4 p-5 md:grid-cols-3"><AccessMetric label="Role coverage" value="9 / 9" detail="Documented roles configured" percent={100} /><AccessMetric label="Scoped users" value="98.8%" detail="3 users need scope review" percent={98} tone="warning" /><AccessMetric label="MFA enrollment" value="94.2%" detail="15 accounts pending" percent={94} tone="info" /></div>
        <div className="border-t border-admin-primary/10 px-5 py-3 text-xs text-admin-primary/50"><Shield size={13} className="mr-2 inline" />Backend RBAC remains the enforcement authority. This console reflects configured policy and scope.</div>
      </Section>
      <Section title="System health" description="Last checked 29 Sep 2026 · 10:52"><div className="divide-y divide-admin-primary/10">{[['Application', 'Healthy'], ['Database', 'Healthy'], ['Background Jobs', 'Warning'], ['Scheduled Tasks', 'Healthy'], ['Notifications', 'Healthy'], ['API Services', 'Healthy']].map(([name, status]) => <div key={name} className="flex items-center justify-between px-5 py-2.5 text-sm"><span className="text-admin-secondary">{name}</span><Badge tone={toneFor(status)}>{status}</Badge></div>)}</div></Section>
    </div>
    <div className="mt-5 grid gap-5 xl:grid-cols-5">
      <Section title="Platform alerts" description="Administration and system events requiring review" className="xl:col-span-3" action={<Button compact onClick={() => navigate('notifications')}>View all</Button>}><AlertList /></Section>
      <Section title="Snapshot health" description="Scheduled dashboard generation" className="xl:col-span-2" action={<Button compact onClick={() => navigate('dashboards')}>Manage snapshots</Button>}><div className="grid grid-cols-3 gap-3 p-5"><MiniStat value="12" label="Ready" tone="success" /><MiniStat value="1" label="Running" tone="info" /><MiniStat value="1" label="Failed" tone="danger" /></div><div className="border-t border-admin-primary/10 p-5"><div className="flex items-center justify-between text-xs"><span className="text-admin-primary/50">Last successful run</span><span className="font-600 text-admin-secondary">Today · 07:00</span></div><div className="mt-3 flex items-center justify-between text-xs"><span className="text-admin-primary/50">Next scheduled run</span><span className="font-600 text-admin-secondary">Today · 18:00</span></div></div></Section>
    </div>
    <div className="mt-5 grid gap-5 xl:grid-cols-3">
      <Section title="Administrative quick actions" description="Governance and configuration only" className="xl:col-span-2"><div className="grid gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">{[
        ['Create Organization', Building2, 'organizations'], ['Add User', UserCog, 'users'], ['Manage Roles', ShieldCheck, 'roles'],
        ['Configure Scope', Layers3, 'scope'], ['Run Dashboard Snapshot', Play, 'dashboards'], ['View Audit Logs', Shield, 'audit'],
        ['Manage Site', MapPin, 'sites'], ['Configure Permissions', KeyRound, 'roles'], ['System Settings', Settings, 'settings'],
      ].map(([label, Icon, target]) => <ButtonControl key={label as string} onClick={() => navigate(target as View)} className="flex items-center gap-3 rounded border border-admin-primary/10 p-3 text-left transition-all duration-200 hover:border-admin-gold hover:bg-admin-surface"><span className="rounded bg-admin-primary/5 p-2 text-admin-secondary"><Icon size={15} /></span><span className="text-xs font-600 text-admin-secondary">{label as string}</span><ChevronRight size={13} className="ml-auto text-admin-primary/30" /></ButtonControl>)}</div></Section>
      <Section title="Recent admin activity" description="Append-only platform changes"><div className="p-5">{[['Organization Created', 'Super Admin · Organizations · 12 min ago'], ['Scope Updated', 'Super Admin · Access · 56 min ago'], ['Snapshot Generated', 'System · Dashboards · 1 hr ago'], ['Permission Changed', 'Super Admin · RBAC · 2 hr ago'], ['Site Updated', 'A. Morgan · Locations · 3 hr ago']].map((item, index) => <div key={item[0]} className="relative flex gap-3 pb-4 last:pb-0"><div className="relative z-10 mt-1.5 h-2 w-2 shrink-0 rounded-full bg-admin-gold ring-4 ring-admin-gold/15" />{index < 4 && <div className="absolute left-1 top-3 h-full border-l border-admin-primary/10" />}<div><div className="text-xs font-600 text-admin-secondary">{item[0]}</div><div className="mt-1 text-xs text-admin-primary/45">{item[1]}</div></div></div>)}</div></Section>
    </div>
    <StateShowcase />
  </div>;
}
function AccessMetric({ label, value, detail, percent, tone = 'success' }: { label: string; value: string; detail: string; percent: number; tone?: Tone }) {
  const bar = tone === 'warning' ? 'bg-admin-warning' : tone === 'info' ? 'bg-admin-info' : 'bg-admin-success';
  return <div><div className="flex items-end justify-between"><span className="text-xs font-600 text-admin-primary/55">{label}</span><span className="text-lg font-700 text-admin-primary">{value}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-admin-primary/5"><div className={`h-full rounded-full ${bar}`} style={{ width: `${percent}%` }} /></div><div className="mt-2 text-xs text-admin-primary/45">{detail}</div></div>;
}
function MiniStat({ value, label, tone }: { value: string; label: string; tone: Tone }) {
  const color = tone === 'danger' ? 'text-admin-danger' : tone === 'info' ? 'text-admin-info' : 'text-admin-success';
  return <div className="rounded bg-admin-surface p-3 text-center"><div className={`text-xl font-700 ${color}`}>{value}</div><div className="mt-1 text-xs text-admin-primary/45">{label}</div></div>;
}
function AlertList() {
  return <div className="divide-y divide-admin-primary/10">{ALERTS.map(alert => <div key={alert.title} className="flex flex-wrap items-center gap-3 px-5 py-3"><Badge tone={toneFor(alert.severity)}>{alert.severity}</Badge><div className="min-w-48 flex-1"><div className="text-sm font-600 text-admin-secondary">{alert.title}</div><div className="mt-0.5 text-xs text-admin-primary/45">{alert.module} · {alert.time}</div></div><span className="text-xs text-admin-primary/50">{alert.status}</span><Button compact>Review</Button></div>)}</div>;
}
function StateShowcase() {
  return <Section title="Interface states" description="Reusable feedback patterns for administration tasks" className="mt-5"><div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-5"><div className="rounded border border-admin-primary/10 p-3"><Badge tone="success">Success</Badge><div className="mt-2 text-xs text-admin-primary/50">Changes saved and audited.</div></div><div className="rounded border border-admin-danger/25 bg-admin-danger/5 p-3"><Badge tone="danger">Error</Badge><div className="mt-2 text-xs text-admin-primary/50">Unable to complete action.</div></div><div className="rounded border border-admin-primary/10 p-3"><div className="flex items-center gap-2 text-xs font-600"><RefreshCw size={14} className="animate-spin text-admin-info" />Loading</div><div className="mt-2 h-2 animate-pulse rounded bg-admin-primary/10" /></div><div className="rounded border border-admin-primary/10 p-3 text-center"><Archive size={16} className="mx-auto text-admin-primary/30" /><div className="mt-2 text-xs text-admin-primary/50">Empty state</div></div><div className="rounded border border-admin-primary/10 p-3"><Button disabled compact>Disabled action</Button><div className="mt-2 text-xs text-admin-primary/50">Requires permission.</div></div></div></Section>;
}

function Organizations({ onCreate, notify }: { onCreate: () => void; notify: (message: string) => void }) {
  const [search, setSearch] = useState(''); const [status, setStatus] = useState('');
  const rows = ORGANIZATIONS.filter(item => (!search || `${item.name} ${item.code}`.toLowerCase().includes(search.toLowerCase())) && (!status || item.status === status));
  return <div><PageTitle eyebrow="Platform Administration" title="Organizations" description="Manage organization structures, site scope and platform access." actions={<Button primary onClick={onCreate}><Plus size={14} />Create Organization</Button>} /><Section title="Organization directory" description={`${rows.length} demo organizations in the current view`}><Filters search={search} setSearch={setSearch} extra={<><Select value="" onChange={() => {}} label="Site: All" options={['Central Campus', 'Riverside Hub']} /><Select value={status} onChange={setStatus} label="Status: All" options={['Active', 'Inactive', 'Suspended']} /><Select value="" onChange={() => {}} label="Date: Any" options={['Last 7 days', 'Last 30 days']} /></>} /><Table headers={['Organization', 'Sites', 'Users', 'Assets', 'Open Work', 'Status', 'Last Activity', 'Action']} empty={!rows.length}>{rows.map(item => <tr key={item.code} className="hover:bg-admin-surface"><Cell strong><div>{item.name}</div><div className="mt-0.5 text-xs font-400 text-admin-primary/40">{item.code}</div></Cell><Cell>{item.sites}</Cell><Cell>{item.users}</Cell><Cell>{item.assets.toLocaleString()}</Cell><Cell>{item.work}</Cell><Cell><Badge tone={toneFor(item.status)}>{item.status}</Badge></Cell><Cell muted>{item.activity}</Cell><Cell><div className="flex gap-1"><Button compact onClick={() => notify(`Viewing ${item.name}.`)}>View</Button><Button compact onClick={() => notify(`Manage mode opened for ${item.name}.`)}>Manage</Button><Button compact onClick={() => notify(`Configuration opened for ${item.name}.`)}>Configure</Button></div></Cell></tr>)}</Table></Section></div>;
}
function Sites() {
  const [selected, setSelected] = useState('Central Campus');
  const hierarchy = [{ org: 'Northstar Facilities', sites: [{ name: 'Central Campus', children: ['Administration Building', 'North Plant'], areas: ['Reception', 'Operations Room', 'HVAC Bay'] }, { name: 'Riverside Hub', children: ['Service Building'], areas: ['Stores', 'Workshop'] }] }, { org: 'Meridian Property Group', sites: [{ name: 'Harbor Point', children: ['Tower One'], areas: ['Lobby', 'Plant Room'] }] }];
  return <div><PageTitle eyebrow="Platform Administration" title="Site & Location Control" description="Govern organization and location hierarchy without creating or changing Asset Registry data." actions={<Button primary><Plus size={14} />Manage Site</Button>} /><div className="grid gap-5 xl:grid-cols-3"><Section title="Location hierarchy" description="Organization → Site → Building / Zone → Service Area" className="xl:col-span-2"><div className="p-4">{hierarchy.map(group => <div key={group.org} className="mb-3 rounded border border-admin-primary/10"><div className="flex items-center gap-2 bg-admin-surface px-4 py-3 text-sm font-700 text-admin-primary"><Building2 size={15} />{group.org}</div>{group.sites.map(site => <div key={site.name} className="border-t border-admin-primary/10 px-4 py-3"><ButtonControl onClick={() => setSelected(site.name)} className={`flex w-full items-center gap-2 rounded p-2 text-left text-sm font-600 ${selected === site.name ? 'bg-admin-gold/15 text-admin-primary' : 'text-admin-secondary hover:bg-admin-surface'}`}><ChevronDown size={13} /><MapPin size={14} className="text-admin-info" />{site.name}<Badge tone="success">Active</Badge></ButtonControl><div className="ml-7 border-l border-admin-primary/10 pl-4">{site.children.map((child, index) => <div key={child} className="py-2"><div className="flex items-center gap-2 text-xs font-600 text-admin-secondary"><Layers3 size={13} />{child} <span className="text-admin-primary/35">· Building / Zone</span></div>{index === 0 && <div className="mt-2 flex flex-wrap gap-2">{site.areas.map(area => <span key={area} className="rounded border border-admin-primary/10 bg-admin-surface px-2 py-1 text-xs text-admin-primary/55">{area}</span>)}</div>}</div>)}</div></div>)}</div>)}</div></Section><Section title={selected} description="Administrative location profile"><div className="divide-y divide-admin-primary/10">{[['Organization', selected === 'Harbor Point' ? 'Meridian Property Group' : 'Northstar Facilities'], ['Operating Calendar', 'Standard Business Hours'], ['Contacts', '2 configured'], ['Buildings / Zones', selected === 'Central Campus' ? '2' : '1'], ['Service Areas', selected === 'Central Campus' ? '3' : '2']].map(([label, value]) => <div key={label} className="flex justify-between gap-4 px-5 py-3 text-xs"><span className="text-admin-primary/45">{label}</span><span className="text-right font-600 text-admin-secondary">{value}</span></div>)}</div><div className="flex gap-2 p-4"><Button compact>View</Button><Button compact>Manage</Button><Button compact>Configure</Button></div><div className="border-t border-admin-primary/10 px-5 py-4 text-xs text-admin-primary/45">Assets are managed separately in Asset Registry.</div></Section></div></div>;
}
function UsersAdmin({ onCreate, notify }: { onCreate: () => void; notify: (message: string) => void }) {
  const [search, setSearch] = useState(''); const [status, setStatus] = useState('');
  const rows = USERS_DATA.filter(item => (!search || `${item.name} ${item.email}`.toLowerCase().includes(search.toLowerCase())) && (!status || item.status === status));
  return <div><PageTitle eyebrow="Access Administration" title="Users" description="Manage identities, role assignment and authorized organization and site scope." actions={<Button primary onClick={onCreate}><Plus size={14} />Add User</Button>} /><div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4"><Stat label="Active Users" value="263" context="Across 5 organizations" icon={Users} tone="success" /><Stat label="Pending Users" value="7" context="Invitation not accepted" icon={Clock3} tone="warning" /><Stat label="Inactive Users" value="11" context="Access disabled" icon={UserCog} /><Stat label="Locked Users" value="2" context="Security review required" icon={LockKeyhole} tone="danger" /></div><Section title="User administration" description="Backend RBAC controls actual access"><Filters search={search} setSearch={setSearch} extra={<><Select value="" onChange={() => {}} label="Role: All" options={['Operations', 'Asset Manager', 'Maintenance Planner', 'Supervisor', 'Technician', 'Stores']} /><Select value={status} onChange={setStatus} label="Status: All" options={['Active', 'Pending', 'Inactive', 'Locked']} /></>} /><Table headers={['User', 'Role', 'Organization', 'Site Scope', 'Status', 'Last Login', 'Action']} empty={!rows.length}>{rows.map(item => <tr key={item.email} className="hover:bg-admin-surface"><Cell strong><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-admin-primary text-xs text-admin-gold">{item.name.split(' ').map(value => value[0]).join('')}</span><div>{item.name}<div className="mt-0.5 text-xs font-400 text-admin-primary/40">{item.email}</div></div></div></Cell><Cell>{item.role}</Cell><Cell>{item.org}</Cell><Cell>{item.scope}</Cell><Cell><Badge tone={toneFor(item.status)}>{item.status}</Badge></Cell><Cell muted>{item.login}</Cell><Cell><div className="flex gap-1"><Button compact>View</Button><Button compact>Edit</Button><Button compact danger={item.status === 'Active'} onClick={() => notify(item.status === 'Locked' ? 'Reset access confirmation opened.' : 'User access updated.')}>{item.status === 'Locked' ? 'Reset Access' : 'Deactivate'}</Button></div></Cell></tr>)}</Table></Section></div>;
}
const ROLES = ['Super Admin', 'Operations', 'Asset Manager', 'Maintenance Planner', 'Supervisor', 'Technician', 'Stores', 'Service Manager', 'Client / Requester'];
const MODULES = ['Organizations', 'Sites', 'Assets', 'Asset Hierarchy', 'Service Requests', 'Work Orders', 'Checklists', 'Maintenance', 'Inventory', 'SLA', 'Warranty / AMC / Contract', 'QR / Barcode', 'Client Portal', 'Reports', 'Audit'];
const PERMISSIONS = ['View', 'Create', 'Edit', 'Approve', 'Assign', 'Execute', 'Export'];
function Roles() {
  const [role, setRole] = useState('Operations');
  return <div><PageTitle eyebrow="Access Administration" title="Roles & Permissions" description="Inspect documented role policy. Backend RBAC is the source of truth and enforces all access." actions={<Button primary><ShieldCheck size={14} />Configure Permissions</Button>} /><div className="mb-5 flex gap-2 overflow-x-auto pb-1">{ROLES.map(item => <ButtonControl key={item} onClick={() => setRole(item)} className={`whitespace-nowrap rounded border px-3 py-2 text-xs font-600 transition-colors ${role === item ? 'border-admin-primary bg-admin-primary text-white' : 'border-admin-primary/10 bg-white text-admin-primary/55 hover:border-admin-primary/30'}`}>{item}</ButtonControl>)}</div><Section title={`${role} permission matrix`} description="Allowed, restricted and not allowed states reflect configured policy"><div className="overflow-x-auto"><table className="w-full min-w-max"><thead><tr className="bg-admin-surface"><th className="sticky left-0 bg-admin-surface px-4 py-3 text-left text-xs font-700 uppercase tracking-wide text-admin-primary/50">Module</th>{PERMISSIONS.map(item => <th key={item} className="px-4 py-3 text-center text-xs font-700 uppercase tracking-wide text-admin-primary/50">{item}</th>)}</tr></thead><tbody className="divide-y divide-admin-primary/10">{MODULES.map((module, row) => <tr key={module} className="hover:bg-admin-surface"><td className="sticky left-0 bg-white px-4 py-3 text-sm font-600 text-admin-secondary">{module}</td>{PERMISSIONS.map((permission, col) => { const state = role === 'Super Admin' ? 'Allowed' : (row + col) % 5 === 0 ? 'Not Allowed' : (row + col) % 4 === 0 ? 'Restricted' : 'Allowed'; return <td key={permission} className="px-4 py-3 text-center"><span title={state} className={`inline-flex h-6 w-6 items-center justify-center rounded ${state === 'Allowed' ? 'bg-admin-success/10 text-admin-success' : state === 'Restricted' ? 'bg-admin-warning/10 text-admin-warning' : 'bg-admin-danger/10 text-admin-danger'}`}>{state === 'Allowed' ? <Check size={13} /> : state === 'Restricted' ? <LockKeyhole size={12} /> : <X size={13} />}</span></td>; })}</tr>)}</tbody></table></div><div className="flex flex-wrap gap-4 border-t border-admin-primary/10 px-5 py-3 text-xs">{[['Allowed', 'bg-admin-success'], ['Restricted', 'bg-admin-warning'], ['Not Allowed', 'bg-admin-danger']].map(([label, color]) => <span key={label} className="flex items-center gap-2 text-admin-primary/55"><span className={`h-2 w-2 rounded-full ${color}`} />{label}</span>)}</div></Section></div>;
}
function Scope() {
  const [selected, setSelected] = useState('Northstar Facilities');
  return <div><PageTitle eyebrow="Access Administration" title="Scope Management" description="Define organization, site, module and role boundaries. Filters and reports respect authorized scope." actions={<Button primary><Layers3 size={14} />Configure Scope</Button>} /><div className="grid gap-5 xl:grid-cols-3"><Section title="Scope selector" description="Super Admin authorized structure" className="xl:col-span-2"><div className="p-5"><div className="mb-3 flex items-center gap-2 rounded bg-admin-primary px-4 py-3 text-sm font-600 text-white"><ShieldCheck size={16} className="text-admin-gold" />Super Admin</div>{[['Northstar Facilities', ['Central Campus', 'Riverside Hub']], ['Meridian Property Group', ['Harbor Point']], ['Horizon Service Partners', ['West Service Center']]].map(([org, sites]) => <div key={org as string} className="ml-4 border-l border-admin-primary/10 pl-5"><ButtonControl onClick={() => setSelected(org as string)} className={`my-1 flex w-full items-center gap-2 rounded p-2 text-left text-sm font-600 ${selected === org ? 'bg-admin-gold/15' : 'hover:bg-admin-surface'}`}><ChevronDown size={13} /><Building2 size={14} />{org as string}</ButtonControl>{(sites as string[]).map(site => <div key={site} className="ml-7 flex items-center gap-2 py-2 text-xs text-admin-primary/55"><MapPin size={13} />{site}<Badge tone="success">Authorized</Badge></div>)}</div>)}</div></Section><Section title="Effective scope" description={selected}><div className="divide-y divide-admin-primary/10">{[['Organization Scope', selected], ['Site Scope', 'All assigned sites'], ['Module Access', '14 modules'], ['Role Scope', 'Super Admin'], ['Reports', 'Authorized data only'], ['Filters', 'Scope enforced']].map(([label, value]) => <div key={label} className="px-5 py-3"><div className="text-xs text-admin-primary/40">{label}</div><div className="mt-1 text-sm font-600 text-admin-secondary">{value}</div></div>)}</div><div className="m-4 rounded border border-admin-info/20 bg-admin-info/5 p-3 text-xs text-admin-secondary"><Shield size={14} className="mr-2 inline text-admin-info" />Users never access data outside authorized organization and site scope.</div></Section></div></div>;
}

const VISIBILITY: Record<string, { title: string; description: string; states: [string, string][] }> = {
  assets: { title: 'Asset Visibility', description: 'Read-only lifecycle distribution from Asset Registry.', states: [['Active', '2,514'], ['Under Maintenance', '86'], ['Out of Service', '19'], ['Retired', '42']] },
  service: { title: 'Service Operations Visibility', description: 'Read-only service request lifecycle visibility.', states: [['New', '19'], ['Triaged', '12'], ['Approved / Rejected', '28'], ['Work Order Created', '41'], ['In Service', '36'], ['Resolved', '52'], ['Confirmed', '47'], ['Closed', '318']] },
  'work-orders': { title: 'Work Order Visibility', description: 'Read-only distribution using the documented workflow.', states: [['Draft', '14'], ['Planned', '31'], ['Assigned', '28'], ['Dispatched', '17'], ['In Progress', '46'], ['On Hold', '9'], ['Completed', '78'], ['Supervisor Review', '12'], ['Closed', '286']] },
  maintenance: { title: 'Maintenance Visibility', description: 'Read-only preventive maintenance cycle visibility.', states: [['Scheduled', '124'], ['Due', '34'], ['Generated', '28'], ['Assigned', '21'], ['Completed', '92'], ['Verified', '84'], ['Next Cycle', '118']] },
  inventory: { title: 'Inventory Visibility', description: 'Read-only part request state visibility.', states: [['Requested', '22'], ['Reserved', '18'], ['Issued', '31'], ['Consumed', '24'], ['Returned', '7'], ['Reconciled', '68']] },
  sla: { title: 'SLA & Policy Visibility', description: 'Platform policy and escalation visibility without operational transactions.', states: [['Active Policies', '18'], ['Healthy', '142'], ['Warning', '23'], ['SLA Breaches', '8']] },
};
function Visibility({ view }: { view: View }) {
  const content = VISIBILITY[view] ?? VISIBILITY.assets;
  const workStates = view === 'work-orders' || view === 'maintenance' || view === 'inventory' || view === 'service';
  return <div><PageTitle eyebrow="Platform Visibility / Read only" title={content.title} description={content.description} actions={<Badge tone="info">Scope enforced</Badge>} /><div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">{content.states.map(([state, value], index) => <div key={state} className="rounded-lg border border-admin-primary/10 bg-white p-4 shadow-sm"><div className="text-2xl font-700 text-admin-primary">{value}</div><div className="mt-2 text-xs font-600 text-admin-secondary">{state}</div><div className={`mt-3 h-1 rounded-full ${index === 0 ? 'bg-admin-info' : index === content.states.length - 1 ? 'bg-admin-success' : 'bg-admin-warning'}`} /></div>)}</div>{workStates && <Section title="Workflow protection" description="Exact documented states shown in sequence" className="mt-5"><div className="flex items-center overflow-x-auto p-5">{content.states.map(([state], index) => <div key={state} className="flex shrink-0 items-center"><span className="rounded border border-admin-primary/10 bg-admin-surface px-3 py-2 text-xs font-600 text-admin-secondary">{state}</span>{index < content.states.length - 1 && <ChevronRight size={15} className="mx-2 text-admin-primary/25" />}</div>)}</div></Section>}<Section title="Administrative visibility only" description="Transactions remain in their owning operational modules" className="mt-5"><div className="grid gap-3 p-5 sm:grid-cols-3"><div className="rounded bg-admin-surface p-4 text-xs text-admin-primary/55">No workflow transitions are available here.</div><div className="rounded bg-admin-surface p-4 text-xs text-admin-primary/55">No ownership or role assignments are changed here.</div><div className="rounded bg-admin-surface p-4 text-xs text-admin-primary/55">Records are filtered by authorized scope.</div></div></Section></div>;
}

function Dashboards({ onRun, running }: { onRun: (name: string) => void; running: string }) {
  const [tab, setTab] = useState<'visibility' | 'snapshots' | 'history'>('visibility');
  return <div><PageTitle eyebrow="Governed Reporting" title="Operational Dashboards" description="Read-only official metric categories and controlled snapshot administration." actions={<Badge tone="info">RBAC scope enforced</Badge>} /><div className="mb-5 flex gap-1 rounded-lg border border-admin-primary/10 bg-white p-1">{[['visibility', 'Operational Visibility'], ['snapshots', 'Snapshot Control'], ['history', 'Snapshot History']].map(([id, label]) => <ButtonControl key={id} onClick={() => setTab(id as typeof tab)} className={`rounded px-4 py-2 text-xs font-600 transition-colors ${tab === id ? 'bg-admin-primary text-white' : 'text-admin-primary/50 hover:bg-admin-surface'}`}>{label}</ButtonControl>)}</div>{tab === 'visibility' ? <OperationalVisibility /> : tab === 'snapshots' ? <SnapshotControl onRun={onRun} running={running} /> : <SnapshotHistory />}</div>;
}
function OperationalVisibility() {
  const metrics = [['MTTR', '4h 18m', 'Last 30 days', 'All authorized sites'], ['MTBF', '418h', 'Last 90 days', 'Critical assets'], ['Downtime', '126h', 'This month', 'All authorized sites'], ['Open Work Orders', '145', 'Current', '4 organizations'], ['Technician Utilization', '78%', 'This week', 'Authorized teams'], ['SLA Breaches', '8', 'This month', 'All priorities'], ['PM Compliance', '92%', 'This month', 'All categories'], ['Parts Consumption', '1,284 units', 'This month', '3 stores']];
  return <Section title="Operational visibility" description="Official metric categories only. Formula definitions remain configurable pending confirmation."><div className="flex flex-wrap gap-2 border-b border-admin-primary/10 p-4">{['Organization', 'Site', 'Asset Category', 'Period', 'Priority'].map(label => <Select key={label} value="" onChange={() => {}} label={`${label}: All`} options={['Demo option A', 'Demo option B']} />)}</div><div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-4">{metrics.map(([metric, value, period, scope], index) => <div key={metric} className="rounded border border-admin-primary/10 p-4"><div className="flex items-center justify-between"><span className="text-xs font-700 text-admin-primary/50">{metric}</span><BarChart3 size={14} className="text-admin-info" /></div><div className="mt-3 text-xl font-700 text-admin-primary">{value}</div><div className="mt-3 h-10"><div className="flex h-full items-end gap-1">{[38, 62, 49, 74, 57, 84, 68].map((height, bar) => <span key={bar} className={`flex-1 rounded-t ${bar === 6 ? 'bg-admin-gold' : 'bg-admin-secondary/15'}`} style={{ height: `${Math.max(18, height - index)}%` }} />)}</div></div><div className="mt-3 text-xs text-admin-primary/45">{period} · {scope}</div><div className="mt-1 text-xs text-admin-primary/35">Updated 10:45</div></div>)}</div><div className="border-t border-admin-primary/10 px-5 py-3 text-xs text-admin-primary/45">Values are fictional demo data. Metric formulas are configurable and are not asserted by this prototype.</div></Section>;
}
function SnapshotControl({ onRun, running }: { onRun: (name: string) => void; running: string }) {
  return <Section title="Dashboard Snapshot Control" description="Schedule and run governed dashboard snapshots"><Table headers={['Snapshot Name', 'Metric Set', 'Scope', 'Period', 'Last Run', 'Status', 'Next Run', 'Action']}>{SNAPSHOTS.map(item => <tr key={item.name} className="hover:bg-admin-surface"><Cell strong>{item.name}</Cell><Cell>{item.metrics}</Cell><Cell>{item.scope}</Cell><Cell>{item.period}</Cell><Cell muted>{item.last}</Cell><Cell><Badge tone={toneFor(running === item.name ? 'Running' : item.status)}>{running === item.name ? 'Running' : item.status}</Badge></Cell><Cell muted>{item.next}</Cell><Cell><div className="flex gap-1"><Button compact disabled={Boolean(running)} onClick={() => onRun(item.name)}><Play size={12} />Run Snapshot</Button><Button compact>View Details</Button></div></Cell></tr>)}</Table></Section>;
}
function SnapshotHistory() {
  return <Section title="Snapshot History" description="Immutable execution history for governed reports"><Table headers={['Run ID', 'Report', 'Scope', 'Started', 'Completed', 'Status', 'Triggered By']}>{[['RUN-006241', 'Asset Reliability', 'Meridian / 5 sites', 'Today, 06:15', 'Today, 06:16', 'Failed', 'Schedule'], ['RUN-006240', 'SLA Governance Daily', '3 organizations', 'Today, 07:00', 'Today, 07:01', 'Completed', 'Schedule'], ['RUN-006239', 'Executive Operations Weekly', 'All authorized organizations', 'Today, 06:00', 'Today, 06:03', 'Completed', 'Super Admin']].map(item => <tr key={item[0]}><Cell strong>{item[0]}</Cell>{item.slice(1, 5).map((value, index) => <Cell key={index}>{value}</Cell>)}<Cell><Badge tone={toneFor(item[5])}>{item[5]}</Badge></Cell><Cell>{item[6]}</Cell></tr>)}</Table></Section>;
}
function Audit() {
  const [search, setSearch] = useState(''); const [result, setResult] = useState('');
  const rows = AUDIT.filter(item => (!search || Object.values(item).join(' ').toLowerCase().includes(search.toLowerCase())) && (!result || item.result === result));
  return <div><PageTitle eyebrow="Governance" title="Audit & Compliance" description="Append-only traceability for access, configuration, approvals, exports and security events." actions={<Button><FileText size={14} />Export Authorized View</Button>} /><Section title="Security and audit log" description="Sensitive personal data is intentionally minimized"><Filters search={search} setSearch={setSearch} extra={<><Select value="" onChange={() => {}} label="Category: All" options={['Login Activity', 'Permission Changes', 'Role Changes', 'Organization Changes', 'Configuration Changes', 'Approval Actions', 'Exports', 'Security Events']} /><Select value={result} onChange={setResult} label="Result: All" options={['Success', 'Warning', 'Blocked', 'Failed']} /><Select value="" onChange={() => {}} label="Date: Today" options={['Last 7 days', 'Last 30 days']} /></>} /><Table headers={['Timestamp', 'Actor', 'Action', 'Module', 'Object', 'Result', 'Session / Reference']} empty={!rows.length}>{rows.map(item => <tr key={item.ref} className="hover:bg-admin-surface"><Cell muted>{item.time}</Cell><Cell strong>{item.actor}</Cell><Cell>{item.action}</Cell><Cell>{item.module}</Cell><Cell>{item.object}</Cell><Cell><Badge tone={toneFor(item.result)}>{item.result}</Badge></Cell><Cell strong>{item.ref}</Cell></tr>)}</Table><div className="border-t border-admin-primary/10 px-5 py-3 text-xs text-admin-primary/45"><LockKeyhole size={13} className="mr-2 inline" />Audit records are presented as append-only and are not editable from this console.</div></Section></div>;
}
function SettingsView() {
  const [category, setCategory] = useState('General');
  const categories = ['General', 'Organizations', 'Users', 'Roles', 'Permissions', 'Notifications', 'Audit', 'Dashboard Snapshots', 'Security'];
  return <div><PageTitle eyebrow="Platform Configuration" title="System Settings" description="Configure supported administration categories without altering operational workflows." /><div className="grid gap-5 lg:grid-cols-4"><Section title="Settings navigation" className="lg:col-span-1"><nav className="p-2">{categories.map(item => <ButtonControl key={item} onClick={() => setCategory(item)} className={`flex w-full items-center gap-2 rounded px-3 py-2.5 text-left text-sm ${category === item ? 'bg-admin-primary text-white' : 'text-admin-primary/55 hover:bg-admin-surface'}`}><Settings size={14} />{item}<ChevronRight size={12} className="ml-auto" /></ButtonControl>)}</nav></Section><Section title={category} description="Configuration fields are placeholders where documentation requires confirmation." className="lg:col-span-3" action={<Button primary>Save Changes</Button>}><div className="space-y-4 p-5">{[['Configuration status', 'Ready for configuration'], ['Scope', 'Platform administration'], ['Enforcement', 'Backend controlled']].map(([label, value]) => <div key={label} className="grid gap-2 sm:grid-cols-3 sm:items-center"><div className="text-sm font-600 text-admin-secondary">{label}</div><div className="sm:col-span-2"><div className="rounded border border-admin-primary/10 bg-admin-surface px-3 py-2 text-sm text-admin-primary/55">{value}</div></div></div>)}<div className="rounded border border-admin-warning/25 bg-admin-warning/5 p-4 text-xs text-admin-secondary"><AlertTriangle size={14} className="mr-2 inline text-admin-warning" />No unsupported policy value is assumed. Final configuration remains subject to backend validation and documented approval.</div></div></Section></div></div>;
}
function Notifications({ notify }: { notify: (message: string) => void }) {
  const [filter, setFilter] = useState('All');
  return <div><PageTitle eyebrow="Platform Administration" title="Notifications" description="Platform alerts, security events and administration updates." actions={<Button onClick={() => notify('All notifications marked as read.')}><Check size={14} />Mark all read</Button>} /><div className="mb-4 flex gap-2">{['All', 'Unread', 'Security', 'System'].map(item => <ButtonControl key={item} onClick={() => setFilter(item)} className={`rounded px-3 py-2 text-xs font-600 ${filter === item ? 'bg-admin-primary text-white' : 'border border-admin-primary/10 bg-white text-admin-primary/50'}`}>{item}</ButtonControl>)}</div><Section title={`${filter} notifications`}><AlertList /></Section></div>;
}
function Profile({ session, security }: { session: UserSession | null; security: boolean }) {
  return <div><PageTitle eyebrow="Account" title={security ? 'Security' : 'Super Admin Profile'} description={security ? 'Review administrative account security and active sessions.' : 'Manage account details and preferences.'} /><div className="grid gap-5 lg:grid-cols-3"><Section title={security ? 'Security posture' : 'Profile details'} className="lg:col-span-2"><div className="space-y-4 p-5">{security ? <>{[['Multi-factor authentication', 'Enabled'], ['Password status', 'Current'], ['Active sessions', '1 web session'], ['Last security review', '29 Sep 2026']].map(([label, value]) => <div key={label} className="flex items-center justify-between rounded border border-admin-primary/10 p-4"><span className="text-sm font-600 text-admin-secondary">{label}</span><Badge tone="success">{value}</Badge></div>)}<Button danger>Sign out other sessions</Button></> : <>{[['Display name', session?.name ?? 'Super Admin'], ['Email', session?.email ?? 'superadmin@fieldopsnexus.com'], ['Role', 'Super Admin'], ['Default scope', 'All authorized organizations']].map(([label, value]) => <label key={label} className="block text-xs font-600 text-admin-primary/55">{label}<InputControl readOnly value={value} className="mt-1 w-full rounded border border-admin-primary/10 bg-admin-surface px-3 py-2 text-sm text-admin-secondary outline-none" /></label>)}<Button primary>Save Profile</Button></>}</div></Section><Section title="Access notice"><div className="p-5 text-sm leading-6 text-admin-primary/55">Your access is controlled by backend RBAC and authorized organization and site scope. Account changes are recorded in the append-only audit trail.</div></Section></div></div>;
}
function Modal({ kind, running, onClose, onConfirm }: { kind: 'organization' | 'user' | 'snapshot'; running: string; onClose: () => void; onConfirm: (name: string) => void }) {
  const [name, setName] = useState(kind === 'snapshot' ? running : '');
  const title = kind === 'organization' ? 'Create Organization' : kind === 'user' ? 'Add User' : 'Run Dashboard Snapshot';
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-admin-primary/60 p-4"><div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-lg rounded-lg bg-white shadow-xl"><div className="flex items-center justify-between border-b border-admin-primary/10 px-5 py-4"><div><div className="font-700 text-admin-primary">{title}</div><div className="mt-1 text-xs text-admin-primary/45">{kind === 'snapshot' ? 'Confirm a governed snapshot execution.' : 'Demo form · backend validation required'}</div></div><ButtonControl onClick={onClose} className="text-admin-primary/40"><X size={18} /></ButtonControl></div><div className="space-y-4 p-5">{kind === 'snapshot' ? <div className="rounded border border-admin-info/20 bg-admin-info/5 p-4"><div className="text-sm font-600 text-admin-secondary">{running}</div><div className="mt-1 text-xs text-admin-primary/45">Scope and metric set will use the saved configuration.</div></div> : <><label className="block text-xs font-600 text-admin-primary/55">{kind === 'organization' ? 'Organization name' : 'Full name'}<InputControl value={name} onChange={event => setName(event.target.value)} placeholder={kind === 'organization' ? 'Enter fictional demo organization' : 'Enter user name'} className="mt-1 w-full rounded border border-admin-primary/15 px-3 py-2 text-sm outline-none focus:border-admin-info" /></label><label className="block text-xs font-600 text-admin-primary/55">{kind === 'organization' ? 'Organization code' : 'Work email'}<InputControl placeholder={kind === 'organization' ? 'ORG-000' : 'name@example.test'} className="mt-1 w-full rounded border border-admin-primary/15 px-3 py-2 text-sm outline-none focus:border-admin-info" /></label></>}<div className="rounded border border-admin-warning/20 bg-admin-warning/5 p-3 text-xs text-admin-secondary">This action will be recorded in the audit trail.</div></div><div className="flex justify-end gap-2 border-t border-admin-primary/10 p-4"><Button onClick={onClose}>Cancel</Button><Button primary disabled={kind !== 'snapshot' && !name.trim()} onClick={() => onConfirm(kind === 'snapshot' ? running : name)}>{kind === 'snapshot' ? <><Play size={13} />Run Snapshot</> : 'Confirm'}</Button></div></div></div>;
}
