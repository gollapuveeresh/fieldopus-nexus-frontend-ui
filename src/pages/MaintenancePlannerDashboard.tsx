import { useState, useMemo } from 'react';
import {
  Wrench, CalendarClock, AlertTriangle, CheckCircle, Clock, Users,
  Plus, ChevronRight, ChevronLeft, BarChart3, Activity, Search,
  RefreshCcw, Download, X, ArrowRight, Zap, Calendar, Eye,
  ClipboardList, TrendingUp, TrendingDown, RotateCcw, UserCheck,
  Bell, List, Layers
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import type { Page } from '../types';

// ─── PALETTE ────────────────────────────────────────────────────────────────
const C = {
  navy: '#0B1F3A', gold: '#C9A227', goldPale: '#F7EFCF',
  border: '#E2E8F0', surface: '#F8FAFC', surface2: '#F1F5F9',
  text: '#172033', muted: '#64748B', faint: '#94A3B8',
  green: '#16A34A', amber: '#F59E0B', red: '#DC2626', blue: '#2563EB', purple: '#7C3AED',
};

// ─── DATA ────────────────────────────────────────────────────────────────────
type PMStatus = 'scheduled' | 'due' | 'overdue' | 'in-progress' | 'completed' | 'verified';
type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

interface PMRecord {
  id: string; asset: string; site: string; category: string;
  type: 'Time-Based' | 'Meter-Based' | 'Condition-Based';
  priority: Priority; dueDate: string; daysOverdue: number;
  tech: string | null; status: PMStatus; lastDone: string;
}

const PM_RECORDS: PMRecord[] = [
  { id:'PM-2026-0218', asset:'HVAC Unit — Block A',    site:'Colombo HQ',  category:'HVAC',       type:'Time-Based',      priority:'Critical', dueDate:'20 Sep 2026', daysOverdue:9,  tech:'T. Sharma',   status:'overdue',    lastDone:'20 Jun 2026' },
  { id:'PM-2026-0219', asset:'Chiller Unit #1',         site:'Colombo HQ',  category:'HVAC',       type:'Time-Based',      priority:'Critical', dueDate:'15 Sep 2026', daysOverdue:14, tech:null,          status:'overdue',    lastDone:'15 Jun 2026' },
  { id:'PM-2026-0220', asset:'Transformer #2',          site:'Data Centre', category:'Electrical', type:'Time-Based',      priority:'High',     dueDate:'25 Sep 2026', daysOverdue:4,  tech:'P. Joseph',   status:'overdue',    lastDone:'25 Jun 2026' },
  { id:'PM-2026-0221', asset:'Generator #3',            site:'Galle Site',  category:'Power',      type:'Time-Based',      priority:'High',     dueDate:'29 Sep 2026', daysOverdue:0,  tech:'A. Nair',     status:'due',        lastDone:'29 Jun 2026' },
  { id:'PM-2026-0222', asset:'Elevator — Tower 2',      site:'Kandy Branch',category:'Elevator',   type:'Time-Based',      priority:'High',     dueDate:'29 Sep 2026', daysOverdue:0,  tech:'R. Patel',    status:'due',        lastDone:'29 Mar 2026' },
  { id:'PM-2026-0223', asset:'UPS Bank B',              site:'Data Centre', category:'Power',      type:'Meter-Based',     priority:'High',     dueDate:'05 Oct 2026', daysOverdue:0,  tech:'M. David',    status:'scheduled',  lastDone:'05 Jul 2026' },
  { id:'PM-2026-0224', asset:'Fire Panel — Lobby',      site:'Colombo HQ',  category:'Safety',     type:'Time-Based',      priority:'Medium',   dueDate:'08 Oct 2026', daysOverdue:0,  tech:'K. Singh',    status:'scheduled',  lastDone:'08 Apr 2026' },
  { id:'PM-2026-0225', asset:'BMS Controller',          site:'Kandy Branch',category:'Controls',   type:'Time-Based',      priority:'Medium',   dueDate:'12 Oct 2026', daysOverdue:0,  tech:'K. Singh',    status:'scheduled',  lastDone:'12 Apr 2026' },
  { id:'PM-2026-0226', asset:'Cooling Tower A',         site:'Galle Site',  category:'HVAC',       type:'Condition-Based', priority:'Medium',   dueDate:'15 Oct 2026', daysOverdue:0,  tech:'T. Sharma',   status:'scheduled',  lastDone:'15 Apr 2026' },
  { id:'PM-2026-0227', asset:'Switchgear Panel A',      site:'Data Centre', category:'Electrical', type:'Time-Based',      priority:'Low',      dueDate:'20 Oct 2026', daysOverdue:0,  tech:'P. Joseph',   status:'scheduled',  lastDone:'20 Apr 2026' },
  { id:'PM-2026-0228', asset:'Water Pump Station',      site:'Colombo HQ',  category:'Plumbing',   type:'Meter-Based',     priority:'Low',      dueDate:'28 Oct 2026', daysOverdue:0,  tech:null,          status:'scheduled',  lastDone:'28 Jul 2026' },
  { id:'PM-2026-0229', asset:'Air Handling Unit B',     site:'Colombo HQ',  category:'HVAC',       type:'Time-Based',      priority:'Medium',   dueDate:'01 Oct 2026', daysOverdue:0,  tech:'T. Sharma',   status:'in-progress',lastDone:'01 Jul 2026' },
];

const TECHNICIANS = [
  { name:'T. Sharma',  available:8, assigned:6.5, jobs:3, overloaded:false },
  { name:'R. Patel',   available:8, assigned:8,   jobs:4, overloaded:true  },
  { name:'A. Nair',    available:6, assigned:4,   jobs:2, overloaded:false },
  { name:'M. David',   available:8, assigned:5,   jobs:2, overloaded:false },
  { name:'P. Joseph',  available:4, assigned:5.5, jobs:3, overloaded:true  },
  { name:'K. Singh',   available:8, assigned:3,   jobs:1, overloaded:false },
];

const WINDOWS = [
  { id:'MW-001', site:'Data Centre',  area:'Server Room',      start:'02 Oct 2026 00:00', end:'02 Oct 2026 06:00', status:'upcoming', work:'UPS maintenance, switchgear testing' },
  { id:'MW-002', site:'Colombo HQ',   area:'Rooftop — HVAC',   start:'04 Oct 2026 08:00', end:'04 Oct 2026 18:00', status:'upcoming', work:'Chiller full service, cooling tower inspection' },
  { id:'MW-003', site:'Kandy Branch', area:'IT Room',          start:'06 Oct 2026 09:00', end:'06 Oct 2026 13:00', status:'upcoming', work:'BMS firmware update, sensor calibration' },
  { id:'MW-004', site:'Galle Site',   area:'Utility Block',    start:'29 Sep 2026 07:00', end:'29 Sep 2026 12:00', status:'active',   work:'Generator monthly service — in progress' },
  { id:'MW-005', site:'Colombo HQ',   area:'Ground Floor',     start:'24 Sep 2026 10:00', end:'24 Sep 2026 12:00', status:'completed',work:'Fire panel annual inspection completed' },
];

const COMPLETION_TREND = [
  { month:'Apr', scheduled:42, completed:38, overdue:4  },
  { month:'May', scheduled:39, completed:36, overdue:6  },
  { month:'Jun', scheduled:45, completed:40, overdue:8  },
  { month:'Jul', scheduled:41, completed:39, overdue:5  },
  { month:'Aug', scheduled:44, completed:42, overdue:4  },
  { month:'Sep', scheduled:48, completed:39, overdue:11 },
];

const ACTIVITY = [
  { time:'09:28', date:'29 Sep', type:'overdue',   desc:'PM-2026-0218 marked overdue — HVAC Unit Block A',          user:'System',    asset:'AST-0218' },
  { time:'08:47', date:'29 Sep', type:'assigned',  desc:'PM-2026-0222 assigned to R. Patel — Elevator Tower 2',     user:'J. Mitchell',asset:'AST-0219' },
  { time:'07:00', date:'29 Sep', type:'window',    desc:'Maintenance window MW-004 opened — Galle Site Generator',  user:'System',    asset:'AST-0220' },
  { time:'16:12', date:'28 Sep', type:'generated', desc:'WO-2024-0851 generated from PM-2026-0229',                 user:'System',    asset:'AST-0228' },
  { time:'14:30', date:'28 Sep', type:'completed', desc:'PM-2026-0224 completed — Fire Panel Annual Inspection',    user:'K. Singh',  asset:'AST-0221' },
  { time:'11:05', date:'27 Sep', type:'scheduled', desc:'PM-2026-0227 auto-scheduled — Switchgear Panel A Oct',     user:'System',    asset:'AST-0229' },
];

// Calendar data — Sept/Oct 2026
const CAL_EVENTS: Record<number, { label: string; status: PMStatus; priority: Priority }[]> = {
  29: [{ label:'Generator #3', status:'due', priority:'High' }, { label:'Elevator T2', status:'due', priority:'High' }],
  30: [{ label:'AHU Unit B', status:'in-progress', priority:'Medium' }],
  1:  [{ label:'UPS Bank B', status:'scheduled', priority:'High' }],
  2:  [{ label:'MW: Data Centre', status:'scheduled', priority:'Critical' }],
  4:  [{ label:'MW: HVAC Rooftop', status:'scheduled', priority:'High' }, { label:'Chiller #1', status:'scheduled', priority:'Critical' }],
  5:  [{ label:'Fire Panel', status:'scheduled', priority:'Medium' }],
  6:  [{ label:'MW: Kandy BMS', status:'scheduled', priority:'Medium' }],
  8:  [{ label:'Fire Panel', status:'scheduled', priority:'Medium' }],
  12: [{ label:'BMS Controller', status:'scheduled', priority:'Medium' }],
  15: [{ label:'Cooling Tower', status:'scheduled', priority:'Medium' }],
  20: [{ label:'Switchgear', status:'scheduled', priority:'Low' }],
  28: [{ label:'Water Pump', status:'scheduled', priority:'Low' }],
};

const PLANNING_BOARD: Record<string,PMRecord[]> = {
  'Unassigned': PM_RECORDS.filter(p=>!p.tech && p.status!=='completed'),
  'Planned':    PM_RECORDS.filter(p=>p.tech && p.status==='scheduled'),
  'Assigned':   PM_RECORDS.filter(p=>p.tech && (p.status==='due'||p.status==='overdue')),
  'In Progress':PM_RECORDS.filter(p=>p.status==='in-progress'),
  'Completed':  [],
};

const ALERTS = [
  { type:'overdue',   label:'3 PM tasks overdue',              sub:'HVAC Unit, Chiller #1, Transformer #2', action:'View Overdue',   severity:'high'   },
  { type:'due',       label:'2 PM tasks due today',            sub:'Generator #3, Elevator Tower 2',        action:'View Due',       severity:'medium' },
  { type:'capacity',  label:'R. Patel — overloaded (8/8h)',    sub:'4 jobs assigned, no remaining capacity',action:'Reassign',       severity:'high'   },
  { type:'capacity',  label:'P. Joseph — overloaded (5.5/4h)', sub:'Exceeds available hours today',          action:'Reassign',       severity:'high'   },
  { type:'window',    label:'MW-004 active — Galle Site',      sub:'Generator monthly service, ends 12:00', action:'View Window',    severity:'info'   },
  { type:'missed',    label:'Chiller #1 — 14 days without PM', sub:'Last PM: 15 Jun 2026',                  action:'Schedule Now',   severity:'high'   },
  { type:'recurring', label:'Oct PM cycle generation due',     sub:'48 tasks to generate for October',      action:'Generate Now',   severity:'medium' },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const PRIORITY_STYLE: Record<Priority, string> = {
  Critical: 'bg-red-100 text-red-700',
  High:     'bg-orange-100 text-orange-700',
  Medium:   'bg-amber-100 text-amber-700',
  Low:      'bg-slate-100 text-slate-600',
};
const STATUS_STYLE: Record<PMStatus, { dot: string; label: string; pill: string }> = {
  overdue:    { dot:'bg-red-500',    label:'Overdue',     pill:'bg-red-50 text-red-700'       },
  due:        { dot:'bg-amber-400',  label:'Due Today',   pill:'bg-amber-50 text-amber-700'   },
  'in-progress':{ dot:'bg-blue-500',  label:'In Progress', pill:'bg-blue-50 text-blue-700'   },
  scheduled:  { dot:'bg-green-500',  label:'Scheduled',   pill:'bg-green-50 text-green-700'   },
  completed:  { dot:'bg-slate-400',  label:'Completed',   pill:'bg-slate-50 text-slate-600'   },
  verified:   { dot:'bg-purple-500', label:'Verified',    pill:'bg-purple-50 text-purple-700' },
};
const CAL_EVENT_COLOR: Record<PMStatus, string> = {
  overdue:     'bg-red-100 border-red-400 text-red-700',
  due:         'bg-amber-100 border-amber-400 text-amber-700',
  'in-progress':'bg-blue-100 border-blue-400 text-blue-700',
  scheduled:   'bg-green-50 border-green-400 text-green-700',
  completed:   'bg-slate-100 border-slate-300 text-slate-600',
  verified:    'bg-purple-100 border-purple-400 text-purple-700',
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
function Section({ title, icon, children, action, badge }: {
  title: string; icon: React.ReactNode; children: React.ReactNode;
  action?: React.ReactNode; badge?: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
        <div className="flex items-center gap-2">
          <span className="text-[#0B1F3A]">{icon}</span>
          <span className="text-sm font-700 text-[#172033]">{title}</span>
          {badge}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function KpiCard({ label, value, sub, icon, variant, trend, onClick }: {
  label: string; value: string | number; sub: string; icon: React.ReactNode;
  variant: 'default'|'success'|'warn'|'danger'|'accent'|'info';
  trend?: { dir: 'up'|'down'|'flat'; text: string; positive: boolean };
  onClick?: () => void;
}) {
  const V = {
    default: { card:'bg-white border-[#E2E8F0]',     icon:'bg-[#F1F5F9] text-[#64748B]',  val:'text-[#172033]' },
    success: { card:'bg-white border-green-200',       icon:'bg-green-50 text-green-700',    val:'text-green-700' },
    warn:    { card:'bg-white border-amber-200',       icon:'bg-amber-50 text-amber-600',    val:'text-amber-700' },
    danger:  { card:'bg-red-50 border-red-200',        icon:'bg-red-100 text-red-600',       val:'text-red-700'   },
    accent:  { card:'bg-white border-[#C9A227]/40',   icon:'bg-[#F7EFCF] text-[#C9A227]',  val:'text-[#0B1F3A]' },
    info:    { card:'bg-white border-blue-200',        icon:'bg-blue-50 text-blue-600',      val:'text-blue-700'  },
  }[variant];
  return (
    <button onClick={onClick}
      className={`rounded-xl border p-4 flex flex-col gap-2.5 text-left w-full transition-all hover:shadow-md hover:-translate-y-px active:translate-y-0 ${V.card} ${onClick?'cursor-pointer':'cursor-default'}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-500 text-[#64748B] leading-snug">{label}</span>
        <span className={`p-1.5 rounded-md flex-shrink-0 ${V.icon}`}>{icon}</span>
      </div>
      <div className={`text-[26px] font-800 leading-none tracking-tight ${V.val}`}>{value}</div>
      <div className="text-[11px] text-[#94A3B8] leading-snug">{sub}</div>
      {trend && (
        <div className="flex items-center gap-1 pt-0.5 border-t border-[#F1F5F9]">
          {trend.dir==='up'?<TrendingUp size={10}/>:trend.dir==='down'?<TrendingDown size={10}/>:null}
          <span className={`text-[10px] font-500 ${trend.positive?'text-green-600':'text-red-500'}`}>{trend.text}</span>
        </div>
      )}
    </button>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
interface Props { onNavigate: (page: Page) => void; }

export default function MaintenancePlannerDashboard({ onNavigate }: Props) {
  const [search, setSearch]         = useState('');
  const [fSite, setFSite]           = useState('');
  const [fType, setFType]           = useState('');
  const [fPriority, setFPriority]   = useState('');
  const [fTech, setFTech]           = useState('');
  const [fStatus, setFStatus]       = useState('');
  const [dateRange, setDateRange]   = useState('this-month');
  const [refreshing, setRefreshing] = useState(false);
  const [calView, setCalView]       = useState<'month'|'week'|'day'>('month');
  const [calMonth, setCalMonth]     = useState(9); // Oct = 9 (0-indexed would be oct = 9, let's just use display month 10)
  const [activeKpi, setActiveKpi]   = useState<string|null>(null);
  const [boardExpanded, setBoardExpanded] = useState(true);

  const handleRefresh = () => { setRefreshing(true); setTimeout(()=>setRefreshing(false),900); };
  const anyFilter = search||fSite||fType||fPriority||fTech||fStatus||activeKpi;
  const clearAll  = () => { setSearch('');setFSite('');setFType('');setFPriority('');setFTech('');setFStatus('');setActiveKpi(null); };

  const filteredPMs = useMemo(() => PM_RECORDS.filter(p => {
    if (search && !p.asset.toLowerCase().includes(search.toLowerCase()) && !p.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (fSite && p.site !== fSite) return false;
    if (fType && p.type !== fType) return false;
    if (fPriority && p.priority !== fPriority) return false;
    if (fTech && p.tech !== fTech) return false;
    if (fStatus && p.status !== fStatus) return false;
    if (activeKpi === 'Overdue PM'    && p.status !== 'overdue')    return false;
    if (activeKpi === 'Due Today'     && p.status !== 'due')        return false;
    if (activeKpi === 'Scheduled PM'  && p.status !== 'scheduled')  return false;
    if (activeKpi === 'Assigned Jobs' && !p.tech)                   return false;
    return true;
  }), [search,fSite,fType,fPriority,fTech,fStatus,activeKpi]);

  const overduePMs = PM_RECORDS.filter(p => p.status === 'overdue');
  const duePMs     = PM_RECORDS.filter(p => p.status === 'due');
  const scheduled  = PM_RECORDS.filter(p => p.status === 'scheduled').length;
  const assigned   = PM_RECORDS.filter(p => p.tech).length;
  const compliance = Math.round((COMPLETION_TREND.at(-1)!.completed / COMPLETION_TREND.at(-1)!.scheduled) * 100);

  // Calendar days for October 2026
  const calDays = Array.from({length:31},(_,i)=>i+1);
  const firstDayOfOct = 4; // October 1, 2026 = Thursday (4)

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full flex flex-col">
      {/* ══ HERO HEADER ═══════════════════════════════════════════════════ */}
      <div className="bg-[#0B1F3A] border-b-2 border-[#C9A227]/40">
        <div className="px-5 pt-5 pb-0">
          {/* Title row */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#C9A227]/20 border border-[#C9A227]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Wrench size={17} className="text-[#C9A227]" />
              </div>
              <div>
                <h1 className="text-lg font-700 text-white leading-tight">Maintenance Planning Overview</h1>
                <p className="text-sm text-white/50 mt-0.5">Plan, schedule and monitor preventive maintenance across assets and sites.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <select value={dateRange} onChange={e=>setDateRange(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#C9A227]/60 hover:bg-white/15 cursor-pointer">
                <option value="this-week"  className="text-[#172033]">This Week</option>
                <option value="this-month" className="text-[#172033]">This Month</option>
                <option value="next-month" className="text-[#172033]">Next Month</option>
                <option value="quarter"    className="text-[#172033]">This Quarter</option>
              </select>
              <button onClick={handleRefresh}
                className={`flex items-center gap-1.5 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs text-white hover:bg-white/20 transition-colors ${refreshing?'opacity-60':''}`}>
                <RefreshCcw size={12} className={refreshing?'animate-spin':''} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs text-white hover:bg-white/20 transition-colors">
                <Download size={12} /><span className="hidden sm:inline">Export</span>
              </button>
              <button onClick={()=>onNavigate('maintenance-plans')}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#C9A227] text-[#071426] text-xs font-600 rounded-lg hover:bg-[#D9B33F] transition-colors shadow-sm">
                <Plus size={13} />Create PM Plan
              </button>
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-2 pb-4">
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 min-w-48 flex-1 max-w-xs focus-within:border-[#C9A227]/60">
              <Search size={13} className="text-white/50 flex-shrink-0" />
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search PM tasks, assets..."
                className="bg-transparent text-sm text-white placeholder-white/40 outline-none flex-1 min-w-0" />
              {search && <button onClick={()=>setSearch('')}><X size={11} className="text-white/40 hover:text-white/70"/></button>}
            </div>
            {([
              { val:fSite,     set:setFSite,     ph:'All Sites',     opts:['Colombo HQ','Kandy Branch','Galle Site','Data Centre'] },
              { val:fType,     set:setFType,     ph:'All Types',     opts:['Time-Based','Meter-Based','Condition-Based'] },
              { val:fPriority, set:setFPriority, ph:'All Priorities',opts:['Critical','High','Medium','Low'] },
              { val:fTech,     set:setFTech,     ph:'All Technicians',opts:TECHNICIANS.map(t=>t.name) },
              { val:fStatus,   set:setFStatus,   ph:'All Statuses',  opts:['scheduled','due','overdue','in-progress','completed'] },
            ] as const).map((f,i)=>(
              <select key={i} value={f.val} onChange={e=>(f.set as any)(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#C9A227]/60 hover:bg-white/15 cursor-pointer">
                <option value="" className="text-[#172033]">{f.ph}</option>
                {f.opts.map(o=><option key={o} value={o} className="text-[#172033]">{o}</option>)}
              </select>
            ))}
            {anyFilter && (
              <button onClick={clearAll}
                className="flex items-center gap-1.5 px-3 py-2 border border-[#C9A227]/40 text-[#C9A227] text-xs font-500 rounded-lg hover:bg-[#C9A227]/10">
                <X size={11}/>Clear
              </button>
            )}
          </div>

          {activeKpi && (
            <div className="pb-3 flex items-center gap-2">
              <span className="text-xs text-white/50">Filtered by:</span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#C9A227]/20 border border-[#C9A227]/40 rounded-full text-xs text-[#C9A227] font-500">
                {activeKpi}<button onClick={()=>setActiveKpi(null)}><X size={10}/></button>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ══ BODY ══════════════════════════════════════════════════════════ */}
      <div className="flex-1 p-5 space-y-5">

        {/* ── ALERTS BANNER (show only if high-severity alerts exist) ── */}
        {ALERTS.filter(a=>a.severity==='high').length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 flex items-start gap-3">
            <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-700 text-red-700">
                {ALERTS.filter(a=>a.severity==='high').length} critical alerts require attention
              </span>
              <span className="text-sm text-red-600"> — overdue PM tasks, overloaded technicians, missed maintenance</span>
            </div>
            <button onClick={()=>onNavigate('maintenance')}
              className="flex-shrink-0 text-xs font-600 text-red-700 hover:text-red-900 transition-colors whitespace-nowrap">
              View All →
            </button>
          </div>
        )}

        {/* ── KPI CARDS ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
          {([
            { label:'Scheduled PM',      value:scheduled, sub:'Active plans this month',     icon:<CalendarClock size={14}/>,  variant:'default', trend:{dir:'up',  text:'+4 vs last month', positive:true  } },
            { label:'Due Today',         value:duePMs.length, sub:'Require action now',      icon:<Clock size={14}/>,          variant:'warn',    trend:{dir:'flat',text:'Check assignments',positive:false } },
            { label:'Overdue PM',        value:overduePMs.length, sub:'Immediate attention', icon:<AlertTriangle size={14}/>,  variant:'danger',  trend:{dir:'up',  text:'+2 this week',     positive:false } },
            { label:'Generated WOs',     value:18,        sub:'This month',                  icon:<ClipboardList size={14}/>,  variant:'info',    trend:{dir:'up',  text:'+3 this week',     positive:true  } },
            { label:'Assigned Jobs',     value:assigned,  sub:'To technicians',              icon:<UserCheck size={14}/>,      variant:'default', trend:{dir:'flat',text:'2 unassigned',      positive:false } },
            { label:'Completed PM',      value:39,        sub:'Sep 2026',                    icon:<CheckCircle size={14}/>,    variant:'success', trend:{dir:'down',text:'-3 vs Aug',         positive:false } },
            { label:'PM Compliance',     value:`${compliance}%`, sub:'Sep completion rate',  icon:<BarChart3 size={14}/>,      variant: compliance>=90?'success':compliance>=75?'warn':'danger', trend:{dir:'down',text:'-6% vs Aug', positive:false } },
            { label:'Maint. Windows',    value:WINDOWS.filter(w=>w.status!=='completed').length, sub:'Active & upcoming',     icon:<Layers size={14}/>,         variant:'accent',  trend:{dir:'flat',text:'1 active now',   positive:true  } },
          ] as const).map((k,i)=>(
            <KpiCard key={i} {...k} variant={k.variant as any}
              onClick={()=>setActiveKpi(prev=>prev===k.label?null:k.label)} />
          ))}
        </div>

        {/* ── PM WORKFLOW PIPELINE ──────────────────────────────────── */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <ArrowRight size={14} className="text-[#0B1F3A]"/>
              <span className="text-sm font-700 text-[#172033]">PM Workflow Status</span>
            </div>
            <button onClick={()=>onNavigate('maintenance-plans')} className="text-xs text-[#C9A227] font-500">Full View →</button>
          </div>
          <div className="p-5">
            <div className="flex items-stretch gap-1 overflow-x-auto pb-1">
              {([
                { stage:'Scheduled',  count:scheduled, color:C.green,  bg:'bg-green-50',  desc:'PM plans active' },
                { stage:'Due',        count:duePMs.length, color:C.amber,  bg:'bg-amber-50',  desc:'Due for execution' },
                { stage:'Generated',  count:18,         color:C.blue,   bg:'bg-blue-50',   desc:'WOs generated' },
                { stage:'Assigned',   count:assigned,   color:'#7C3AED',bg:'bg-purple-50', desc:'To technicians' },
                { stage:'Completed',  count:39,         color:'#475569',bg:'bg-slate-50',  desc:'This month' },
                { stage:'Verified',   count:34,         color:C.green,  bg:'bg-green-50',  desc:'Sign-off done' },
                { stage:'Next Cycle', count:scheduled,  color:C.gold,   bg:'bg-[#F7EFCF]', desc:'Auto-scheduled' },
              ]).map((s,i,arr)=>(
                <div key={s.stage} className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={()=>setFStatus(s.stage==='Due'?'due':s.stage==='Scheduled'?'scheduled':s.stage==='Assigned'?'scheduled':'')}
                    className={`flex flex-col items-center px-4 py-3 rounded-xl ${s.bg} border border-white hover:opacity-90 transition-opacity min-w-[88px]`}>
                    <span className="text-2xl font-800 leading-none" style={{color:s.color}}>{s.count}</span>
                    <span className="text-[10px] font-700 mt-1" style={{color:s.color}}>{s.stage}</span>
                    <span className="text-[9px] text-[#94A3B8] mt-0.5 text-center leading-tight">{s.desc}</span>
                  </button>
                  {i<arr.length-1&&<ChevronRight size={14} className="text-[#CBD5E1] flex-shrink-0"/>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CALENDAR + OVERDUE SPLIT ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Calendar */}
          <div className="lg:col-span-3 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[#0B1F3A]"/>
                <span className="text-sm font-700 text-[#172033]">Maintenance Calendar</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {(['month','week','day'] as const).map(v=>(
                    <button key={v} onClick={()=>setCalView(v)}
                      className={`px-2.5 py-1 text-[10px] font-600 rounded capitalize transition-colors ${calView===v?'bg-[#0B1F3A] text-white':'text-[#64748B] hover:bg-[#F1F5F9]'}`}>
                      {v}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-1 text-[#64748B] hover:text-[#172033]"><ChevronLeft size={14}/></button>
                  <span className="text-xs font-600 text-[#172033] whitespace-nowrap">October 2026</span>
                  <button className="p-1 text-[#64748B] hover:text-[#172033]"><ChevronRight size={14}/></button>
                </div>
                <button onClick={()=>onNavigate('maintenance-calendar')}
                  className="text-xs text-[#C9A227] font-500 hidden sm:block">Full →</button>
              </div>
            </div>

            {calView === 'month' && (
              <div className="p-4">
                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
                    <div key={d} className="text-center text-[10px] font-700 text-[#94A3B8] py-1">{d}</div>
                  ))}
                </div>
                {/* Day grid */}
                <div className="grid grid-cols-7 gap-px bg-[#F1F5F9] rounded-lg overflow-hidden">
                  {/* Leading empty cells (Oct 1 = Thursday = index 4) */}
                  {Array.from({length:firstDayOfOct}).map((_,i)=>(
                    <div key={`e${i}`} className="bg-[#F8FAFC] min-h-[64px] p-1"/>
                  ))}
                  {calDays.map(day=>{
                    const events = CAL_EVENTS[day] ?? [];
                    const hasOverdue = events.some(e=>e.status==='overdue');
                    const hasDue = events.some(e=>e.status==='due');
                    const isToday = day===1; // Oct 1 is "today" in our demo context (actually 29 Sep)
                    return (
                      <div key={day}
                        className={`bg-white min-h-[64px] p-1.5 cursor-pointer hover:bg-[#F8FAFC] transition-colors ${hasOverdue?'border-l-2 border-red-400':hasDue?'border-l-2 border-amber-400':''}`}>
                        <div className={`text-[11px] font-600 mb-1 w-5 h-5 rounded-full flex items-center justify-center ${isToday?'bg-[#0B1F3A] text-white':'text-[#172033]'}`}>
                          {day}
                        </div>
                        <div className="space-y-0.5">
                          {events.slice(0,2).map((ev,i)=>(
                            <div key={i} onClick={()=>onNavigate('maintenance')}
                              className={`text-[9px] px-1 py-0.5 rounded border-l-2 truncate leading-tight ${CAL_EVENT_COLOR[ev.status]}`}>
                              {ev.label}
                            </div>
                          ))}
                          {events.length>2&&(
                            <div className="text-[9px] text-[#94A3B8] pl-1">+{events.length-2} more</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                  {([['overdue','Overdue'],['due','Due Today'],['in-progress','In Progress'],['scheduled','Scheduled'],['window','Maint. Window']] as const).map(([s,l])=>(
                    <span key={s} className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-sm border-l-2 ${
                        s==='overdue'?'bg-red-100 border-red-400':
                        s==='due'?'bg-amber-100 border-amber-400':
                        s==='in-progress'?'bg-blue-100 border-blue-400':
                        s==='window'?'bg-purple-100 border-purple-400':
                        'bg-green-50 border-green-400'
                      }`}/>
                      <span className="text-[10px] text-[#94A3B8]">{l}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {calView !== 'month' && (
              <div className="flex items-center justify-center py-16 text-sm text-[#94A3B8]">
                {calView === 'week' ? 'Week' : 'Day'} view — click Full → to open full calendar
              </div>
            )}
          </div>

          {/* Reminders & Alerts */}
          <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <Bell size={14} className="text-[#0B1F3A]"/>
                <span className="text-sm font-700 text-[#172033]">Alerts & Reminders</span>
                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-700">
                  {ALERTS.filter(a=>a.severity==='high').length}
                </span>
              </div>
            </div>
            <div className="divide-y divide-[#F8FAFC] overflow-y-auto" style={{maxHeight:400}}>
              {ALERTS.map((a,i)=>{
                const sev = a.severity==='high'?{stripe:'bg-red-500',bg:'hover:bg-red-50/30'}
                  :a.severity==='medium'?{stripe:'bg-amber-400',bg:'hover:bg-amber-50/20'}
                  :{stripe:'bg-blue-400',bg:'hover:bg-blue-50/20'};
                return (
                  <div key={i} className={`flex items-start gap-2.5 px-4 py-3.5 transition-colors cursor-pointer ${sev.bg}`}
                    onClick={()=>onNavigate('maintenance')}>
                    <div className={`w-0.5 rounded-full flex-shrink-0 self-stretch mt-0.5 ${sev.stripe}`} style={{minHeight:36}}/>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-700 text-[#172033] leading-snug">{a.label}</div>
                      <div className="text-[10px] text-[#94A3B8] mt-0.5 truncate">{a.sub}</div>
                    </div>
                    <button className={`flex-shrink-0 text-[10px] font-600 px-2 py-1 rounded whitespace-nowrap transition-colors ${
                      a.severity==='high'?'bg-red-50 text-red-700 hover:bg-red-100':
                      a.severity==='medium'?'bg-amber-50 text-amber-700 hover:bg-amber-100':
                      'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}>{a.action}</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── OVERDUE TABLE + TECHNICIAN CAPACITY ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Overdue PM table */}
          <div className="lg:col-span-3 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F1F5F9] bg-red-50">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-600"/>
                <span className="text-sm font-700 text-[#172033]">Overdue PM</span>
                <span className="text-[10px] bg-red-200 text-red-700 px-1.5 py-0.5 rounded-full font-700">{overduePMs.length}</span>
              </div>
              <button onClick={()=>setFStatus('overdue')} className="text-xs text-[#C9A227] font-500">Filter All →</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <tr>
                    {['PM ID','Asset','Site','Type','Due Date','Overdue','Priority','Technician',''].map(h=>(
                      <th key={h} className="text-left px-3 py-2.5 text-[10px] font-700 text-[#64748B] uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F8FAFC]">
                  {(activeKpi?filteredPMs.filter(p=>p.status==='overdue'):overduePMs).map((p,i)=>(
                    <tr key={i} className="bg-red-50/20 hover:bg-red-50/40 transition-colors cursor-pointer"
                      onClick={()=>onNavigate('maintenance')}>
                      <td className="px-3 py-2.5 text-[10px] font-600 text-[#0B1F3A] whitespace-nowrap">{p.id}</td>
                      <td className="px-3 py-2.5">
                        <div className="text-xs font-600 text-[#172033] max-w-[120px] truncate">{p.asset}</div>
                        <div className="text-[10px] text-[#94A3B8]">{p.category}</div>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-[#64748B] whitespace-nowrap">{p.site}</td>
                      <td className="px-3 py-2.5">
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#F1F5F9] text-[#64748B] rounded">{p.type}</span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-[#64748B] whitespace-nowrap">{p.dueDate}</td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs font-800 text-red-600">{p.daysOverdue}d</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[10px] font-600 px-1.5 py-0.5 rounded ${PRIORITY_STYLE[p.priority]}`}>{p.priority}</span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-[#64748B] whitespace-nowrap">{p.tech??<span className="text-red-400 font-600">Unassigned</span>}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1.5">
                          <button className="text-[10px] font-600 px-2 py-1 bg-[#0B1F3A] text-white rounded hover:bg-[#102A43] whitespace-nowrap">
                            {p.tech?'Reschedule':'Assign'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Technician Capacity */}
          <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-[#0B1F3A]"/>
                <span className="text-sm font-700 text-[#172033]">Technician Capacity</span>
                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-700">
                  {TECHNICIANS.filter(t=>t.overloaded).length} overloaded
                </span>
              </div>
            </div>
            <div className="divide-y divide-[#F8FAFC]">
              {TECHNICIANS.map((t,i)=>{
                const pct = Math.min((t.assigned/t.available)*100,100);
                const over = t.overloaded;
                return (
                  <div key={i} className={`px-4 py-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer ${over?'bg-red-50/20':''}`}
                    onClick={()=>onNavigate('technician')}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-[#0B1F3A] flex items-center justify-center flex-shrink-0">
                          <span className="text-[#C9A227] text-[9px] font-700">
                            {t.name.split(' ').map(n=>n[0]).join('')}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-600 text-[#172033] truncate">{t.name}</div>
                          <div className="text-[10px] text-[#94A3B8]">{t.jobs} jobs</div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className={`text-xs font-800 ${over?'text-red-600':'text-[#172033]'}`}>{t.assigned}h</div>
                        <div className="text-[10px] text-[#94A3B8]">of {t.available}h</div>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${over?'bg-red-500':pct>75?'bg-amber-400':'bg-green-500'}`}
                        style={{width:`${Math.min(pct,100)}%`}}/>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-[#94A3B8]">
                        {over?'Overloaded':`${t.available-t.assigned}h remaining`}
                      </span>
                      <span className={`text-[10px] font-600 ${over?'text-red-600':'text-[#64748B]'}`}>
                        {Math.round(pct)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── PLANNING BOARD ────────────────────────────────────────── */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
          <button
            onClick={()=>setBoardExpanded(p=>!p)}
            className="w-full flex items-center justify-between px-5 py-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors">
            <div className="flex items-center gap-2">
              <List size={14} className="text-[#0B1F3A]"/>
              <span className="text-sm font-700 text-[#172033]">Maintenance Planning Board</span>
            </div>
            <ChevronRight size={14} className={`text-[#64748B] transition-transform ${boardExpanded?'rotate-90':''}`}/>
          </button>

          {boardExpanded && (
            <div className="p-4 overflow-x-auto">
              <div className="flex gap-3 min-w-max">
                {Object.entries(PLANNING_BOARD).map(([col, items])=>{
                  const colColor: Record<string,string> = {
                    'Unassigned':'border-red-200 bg-red-50/30',
                    'Planned':   'border-blue-200 bg-blue-50/30',
                    'Assigned':  'border-amber-200 bg-amber-50/30',
                    'In Progress':'border-[#C9A227]/40 bg-[#F7EFCF]/30',
                    'Completed': 'border-green-200 bg-green-50/30',
                  };
                  const hdColor: Record<string,string> = {
                    'Unassigned':'text-red-700',
                    'Planned':   'text-blue-700',
                    'Assigned':  'text-amber-700',
                    'In Progress':'text-[#7a6015]',
                    'Completed': 'text-green-700',
                  };
                  return (
                    <div key={col} className={`w-52 flex-shrink-0 rounded-xl border ${colColor[col]} p-2`}>
                      <div className={`text-[10px] font-800 uppercase tracking-wider px-2 py-1 mb-2 ${hdColor[col]}`}>
                        {col} <span className="font-500 opacity-70">({items.length})</span>
                      </div>
                      <div className="space-y-2 overflow-y-auto" style={{maxHeight:280}}>
                        {items.length === 0 && (
                          <div className="text-[11px] text-[#94A3B8] text-center py-6 italic">No items</div>
                        )}
                        {items.map((p,i)=>(
                          <div key={i} onClick={()=>onNavigate('maintenance')}
                            className="bg-white border border-[#E2E8F0] rounded-lg p-2.5 cursor-pointer hover:shadow-sm hover:-translate-y-px transition-all text-left">
                            <div className="flex items-start justify-between mb-1">
                              <span className="text-[10px] font-700 text-[#0B1F3A]">{p.id}</span>
                              <span className={`text-[9px] font-600 px-1 py-0.5 rounded ${PRIORITY_STYLE[p.priority]}`}>{p.priority}</span>
                            </div>
                            <div className="text-xs font-600 text-[#172033] leading-tight mb-1 truncate">{p.asset}</div>
                            <div className="text-[10px] text-[#94A3B8] truncate mb-1.5">{p.site}</div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-[#64748B]">{p.dueDate}</span>
                              {p.tech && (
                                <span className="text-[10px] text-[#64748B] truncate max-w-[70px]">{p.tech.split(' ')[0]}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── PM PERFORMANCE + MAINTENANCE WINDOWS ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* PM Performance */}
          <div className="lg:col-span-3 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-[#0B1F3A]"/>
                <span className="text-sm font-700 text-[#172033]">PM Performance Analytics</span>
              </div>
              <button onClick={()=>onNavigate('reports')} className="text-xs text-[#C9A227] font-500">Full Report →</button>
            </div>
            <div className="p-5">
              {/* Stat row */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
                {[
                  { label:'Completion',  value:`${compliance}%`, color:compliance>=90?C.green:C.amber },
                  { label:'On-Time',     value:'79%',            color:C.blue   },
                  { label:'Overdue %',   value:'23%',            color:C.red    },
                  { label:'Failed',      value:'3',              color:C.red    },
                  { label:'Generated',   value:'18',             color:C.navy   },
                  { label:'Repeat Fail', value:'1',              color:C.amber  },
                ].map(s=>(
                  <div key={s.label} className="text-center">
                    <div className="text-xl font-800 leading-none" style={{color:s.color}}>{s.value}</div>
                    <div className="text-[10px] text-[#94A3B8] mt-1 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Trend chart */}
              <p className="text-[10px] font-600 text-[#94A3B8] uppercase tracking-wider mb-3">Monthly PM Completion Trend</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={COMPLETION_TREND} margin={{top:4,right:0,bottom:0,left:-15}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                  <XAxis dataKey="month" tick={{fontSize:10,fill:'#94A3B8'}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:10,fill:'#94A3B8'}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{fontSize:11,borderRadius:8,border:`1px solid ${C.border}`}}/>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:11}}/>
                  <Bar dataKey="scheduled" name="Scheduled" fill="#CBD5E1" radius={[3,3,0,0]} maxBarSize={18}/>
                  <Bar dataKey="completed" name="Completed" fill={C.green}  radius={[3,3,0,0]} maxBarSize={18}/>
                  <Bar dataKey="overdue"   name="Overdue"   fill={C.red}    radius={[3,3,0,0]} maxBarSize={18}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Maintenance Windows */}
          <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-[#0B1F3A]"/>
                <span className="text-sm font-700 text-[#172033]">Maintenance Windows</span>
              </div>
            </div>
            <div className="divide-y divide-[#F8FAFC]">
              {WINDOWS.map((w,i)=>{
                const st = w.status==='active'?{pill:'bg-green-100 text-green-700 border-green-200',dot:'bg-green-500'}
                  :w.status==='upcoming'?{pill:'bg-blue-100 text-blue-700 border-blue-200',dot:'bg-blue-400'}
                  :{pill:'bg-slate-100 text-slate-600 border-slate-200',dot:'bg-slate-400'};
                return (
                  <div key={i} className="px-4 py-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    onClick={()=>onNavigate('maintenance')}>
                    <div className="flex items-start justify-between mb-1">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-700 text-[#0B1F3A]">{w.id}</span>
                          <span className={`text-[9px] font-700 px-1.5 py-0.5 rounded-full border ${st.pill} capitalize`}>{w.status}</span>
                        </div>
                        <div className="text-xs font-600 text-[#172033]">{w.site} — {w.area}</div>
                      </div>
                    </div>
                    <div className="text-[10px] text-[#94A3B8] mb-1">{w.start} → {w.end}</div>
                    <div className="text-[10px] text-[#64748B] truncate">{w.work}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RECENT ACTIVITY TIMELINE ──────────────────────────────── */}
        <Section title="Recent Maintenance Activity" icon={<Activity size={14}/>}
          action={<button onClick={()=>onNavigate('maintenance')} className="text-xs text-[#C9A227] font-500">Full History →</button>}>
          <div className="divide-y divide-[#F8FAFC]">
            {ACTIVITY.map((a,i)=>{
              const typeConf = {
                overdue:   { stripe:'bg-red-500',    pill:'bg-red-50 text-red-700'    },
                assigned:  { stripe:'bg-purple-400', pill:'bg-purple-50 text-purple-700'},
                window:    { stripe:'bg-blue-400',   pill:'bg-blue-50 text-blue-700'  },
                generated: { stripe:'bg-amber-400',  pill:'bg-amber-50 text-amber-700'},
                completed: { stripe:'bg-green-500',  pill:'bg-green-50 text-green-700'},
                scheduled: { stripe:'bg-slate-400',  pill:'bg-slate-100 text-slate-600'},
              }[a.type] ?? { stripe:'bg-slate-400', pill:'bg-slate-100 text-slate-600' };
              return (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  onClick={()=>onNavigate('maintenance')}>
                  <div className={`w-0.5 rounded-full flex-shrink-0 self-stretch mt-0.5 ${typeConf.stripe}`} style={{minHeight:36}}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className={`text-[10px] font-600 px-1.5 py-0.5 rounded flex-shrink-0 capitalize ${typeConf.pill}`}>{a.type}</span>
                      <span className="text-xs text-[#94A3B8]">{a.asset}</span>
                    </div>
                    <div className="text-xs font-500 text-[#172033] leading-snug">{a.desc}</div>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5">{a.user}</div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-[10px] text-[#94A3B8]">{a.date}</div>
                    <div className="text-[10px] text-[#94A3B8]">{a.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ── QUICK ACTIONS ─────────────────────────────────────────── */}
        <div className="bg-[#0B1F3A] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} className="text-[#C9A227]"/>
            <h2 className="text-sm font-700 text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {([
              { label:'Create PM Plan',       icon:<Plus size={18}/>,         page:'maintenance-plans' as Page,    primary:true  },
              { label:'Schedule Maintenance', icon:<CalendarClock size={18}/>,page:'maintenance-schedules' as Page,primary:false },
              { label:'Open Calendar',        icon:<Calendar size={18}/>,     page:'maintenance-calendar' as Page, primary:false },
              { label:'Generate Work Order',  icon:<ClipboardList size={18}/>,page:'work-order-create' as Page,    primary:false },
              { label:'Assign Technician',    icon:<UserCheck size={18}/>,    page:'dispatch' as Page,             primary:false },
              { label:'View Overdue PM',      icon:<AlertTriangle size={18}/>,page:'maintenance' as Page,          primary:false },
            ]).map(a=>(
              <button key={a.label} onClick={()=>onNavigate(a.page)}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-xl text-center transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                  a.primary
                    ?'bg-[#C9A227] text-[#071426] hover:bg-[#D9B33F] shadow-lg shadow-[#C9A227]/20'
                    :'bg-white/8 text-white hover:bg-white/15 border border-white/10'
                }`}>
                <span>{a.icon}</span>
                <span className="text-xs font-600 leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
