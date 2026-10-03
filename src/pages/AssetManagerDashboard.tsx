import { useState, useMemo, useCallback } from 'react';
import {
  Box, AlertTriangle, Wrench, Activity, ShieldOff, ShieldCheck,
  FileWarning, CalendarClock, ChevronRight, ChevronDown, Search,
  Plus, QrCode, History, FileText, BarChart3, Clock, ArrowRight,
  RefreshCcw, Download, X, Eye, Building2, MapPin, Layers, Zap,
  CheckCircle, TrendingDown, TrendingUp, MoreHorizontal, Filter,
  Calendar
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import StatusBadge from '../components/ui/StatusBadge';
import type { Page } from '../types';

// ─── PALETTE ─────────────────────────────────────────────────────────────────
const C = {
  navy: '#0B1F3A',
  navyDark: '#071426',
  navyMid: '#102A43',
  gold: '#C9A227',
  goldLight: '#D9B33F',
  goldPale: '#F7EFCF',
  surface: '#F8FAFC',
  surface2: '#F1F5F9',
  border: '#E2E8F0',
  text: '#172033',
  muted: '#64748B',
  faint: '#94A3B8',
  green: '#16A34A',
  amber: '#F59E0B',
  red: '#DC2626',
  blue: '#2563EB',
};

// ─── DATA ─────────────────────────────────────────────────────────────────────

type AssetStatus = 'active' | 'under-maintenance' | 'out-of-service' | 'retired';
type WarrantyStatus = 'valid' | 'expiring' | 'expired' | 'none';

interface Asset {
  id: string; name: string; category: string; site: string; zone: string;
  status: AssetStatus; condition: string; lastPM: string | null; nextPM: string | null;
  pmOverdue: boolean; downtime: number; breakdowns: number; mttr: number; mtbf: number;
  warranty: WarrantyStatus; warrantyEnd: string | null; warrantyProvider: string;
  amc: boolean; amcEnd: string | null; critical: boolean; pmCoverage: boolean;
  commissionDate: string; model: string;
}

const ASSETS: Asset[] = [
  { id:'AST-0218', name:'HVAC Unit — Block A', category:'HVAC', site:'Colombo HQ', zone:'Zone A', status:'under-maintenance', condition:'Fair', lastPM:'15 Aug 2026', nextPM:'15 Oct 2026', pmOverdue:false, downtime:18.7, breakdowns:6, mttr:3.1, mtbf:18, warranty:'valid', warrantyEnd:'31 Jan 2027', warrantyProvider:'Daikin Lanka', amc:true, amcEnd:'31 Dec 2026', critical:true, pmCoverage:true, commissionDate:'01 Feb 2024', model:'Daikin VRV-IV' },
  { id:'AST-0219', name:'Elevator — Tower 2', category:'Elevator', site:'Kandy Branch', zone:'Main Lobby', status:'under-maintenance', condition:'Fair', lastPM:'01 Sep 2026', nextPM:'01 Oct 2026', pmOverdue:true, downtime:12.5, breakdowns:3, mttr:4.2, mtbf:32, warranty:'valid', warrantyEnd:'14 Mar 2027', warrantyProvider:'Otis Lanka', amc:false, amcEnd:null, critical:true, pmCoverage:true, commissionDate:'15 Mar 2023', model:'Otis Gen2' },
  { id:'AST-0220', name:'Generator #3', category:'Power', site:'Galle Site', zone:'Utility Block', status:'active', condition:'Good', lastPM:'12 Sep 2026', nextPM:'12 Oct 2026', pmOverdue:false, downtime:7.3, breakdowns:2, mttr:3.7, mtbf:48, warranty:'expiring', warrantyEnd:'31 Dec 2026', warrantyProvider:'Caterpillar', amc:false, amcEnd:null, critical:true, pmCoverage:true, commissionDate:'01 Jan 2022', model:'Caterpillar C9' },
  { id:'AST-0221', name:'Fire Panel — Lobby', category:'Safety', site:'Colombo HQ', zone:'Ground Floor', status:'active', condition:'Good', lastPM:'24 Sep 2026', nextPM:'24 Mar 2027', pmOverdue:false, downtime:0, breakdowns:0, mttr:0, mtbf:0, warranty:'valid', warrantyEnd:'15 Jun 2027', warrantyProvider:'Hochiki Lanka', amc:false, amcEnd:null, critical:false, pmCoverage:true, commissionDate:'10 Jan 2024', model:'Hochiki FX-64' },
  { id:'AST-0222', name:'UPS Bank B', category:'Power', site:'Data Centre', zone:'Server Room', status:'active', condition:'Good', lastPM:'28 Sep 2026', nextPM:'28 Dec 2026', pmOverdue:false, downtime:0.25, breakdowns:1, mttr:0.25, mtbf:120, warranty:'valid', warrantyEnd:'15 Apr 2027', warrantyProvider:'APC', amc:true, amcEnd:'31 Mar 2027', critical:true, pmCoverage:true, commissionDate:'20 May 2023', model:'APC Symmetra' },
  { id:'AST-0223', name:'Chiller Unit #1', category:'HVAC', site:'Colombo HQ', zone:'Rooftop', status:'out-of-service', condition:'Poor', lastPM:'10 Jun 2026', nextPM:null, pmOverdue:true, downtime:38.2, breakdowns:4, mttr:9.6, mtbf:21, warranty:'expiring', warrantyEnd:'15 Oct 2026', warrantyProvider:'Trane Lanka', amc:true, amcEnd:'31 Dec 2026', critical:true, pmCoverage:true, commissionDate:'05 Mar 2021', model:'Trane CGAF' },
  { id:'AST-0224', name:'BMS Controller', category:'Controls', site:'Kandy Branch', zone:'IT Room', status:'active', condition:'Excellent', lastPM:'20 Aug 2026', nextPM:'20 Feb 2027', pmOverdue:false, downtime:0, breakdowns:0, mttr:0, mtbf:0, warranty:'valid', warrantyEnd:'30 Nov 2027', warrantyProvider:'Siemens Lanka', amc:false, amcEnd:null, critical:false, pmCoverage:true, commissionDate:'12 Nov 2023', model:'Siemens DESIGO' },
  { id:'AST-0225', name:'Cooling Tower A', category:'HVAC', site:'Galle Site', zone:'Rooftop', status:'active', condition:'Good', lastPM:'18 Sep 2026', nextPM:'18 Nov 2026', pmOverdue:false, downtime:3.5, breakdowns:1, mttr:3.5, mtbf:90, warranty:'expiring', warrantyEnd:'22 Nov 2026', warrantyProvider:'BAC Cooling', amc:false, amcEnd:null, critical:false, pmCoverage:true, commissionDate:'08 Jul 2022', model:'BAC VT1-12' },
  { id:'AST-0226', name:'Water Pump Station', category:'Plumbing', site:'Colombo HQ', zone:'Basement', status:'active', condition:'Good', lastPM:'05 Sep 2026', nextPM:'05 Dec 2026', pmOverdue:false, downtime:1.5, breakdowns:1, mttr:1.5, mtbf:60, warranty:'expired', warrantyEnd:'14 Feb 2025', warrantyProvider:'Grundfos', amc:false, amcEnd:null, critical:false, pmCoverage:true, commissionDate:'20 Aug 2021', model:'Grundfos CR32' },
  { id:'AST-0227', name:'Transformer #2', category:'Electrical', site:'Data Centre', zone:'Switchroom', status:'under-maintenance', condition:'Fair', lastPM:'20 Jul 2026', nextPM:null, pmOverdue:true, downtime:24.0, breakdowns:2, mttr:12.0, mtbf:45, warranty:'expired', warrantyEnd:'31 Dec 2024', warrantyProvider:'ABB Lanka', amc:false, amcEnd:null, critical:true, pmCoverage:false, commissionDate:'15 Mar 2020', model:'ABB 500kVA' },
  { id:'AST-0228', name:'Air Handling Unit B', category:'HVAC', site:'Colombo HQ', zone:'Zone B', status:'active', condition:'Good', lastPM:'10 Sep 2026', nextPM:'10 Dec 2026', pmOverdue:false, downtime:2, breakdowns:1, mttr:2, mtbf:55, warranty:'none', warrantyEnd:null, warrantyProvider:'—', amc:false, amcEnd:null, critical:false, pmCoverage:false, commissionDate:'01 Jun 2020', model:'York YD' },
  { id:'AST-0229', name:'Switchgear Panel A', category:'Electrical', site:'Data Centre', zone:'Main DB', status:'active', condition:'Good', lastPM:'02 Sep 2026', nextPM:'02 Mar 2027', pmOverdue:false, downtime:0, breakdowns:0, mttr:0, mtbf:0, warranty:'none', warrantyEnd:null, warrantyProvider:'—', amc:false, amcEnd:null, critical:false, pmCoverage:false, commissionDate:'15 Jan 2019', model:'Schneider PM5000' },
];

const MAINTENANCE_HISTORY = [
  { date:'29 Sep 2026', time:'09:15', asset:'HVAC Unit — Block A', id:'AST-0218', type:'Corrective', desc:'Refrigerant top-up (R410A), evaporator coil cleaning', tech:'T. Sharma', duration:'3h 15m', outcome:'In Progress', wo:'WO-2024-0851' },
  { date:'28 Sep 2026', time:'14:00', asset:'UPS Bank B', id:'AST-0222', type:'Preventive', desc:'Battery capacity test, firmware update to v4.2.1', tech:'M. David', duration:'2h 00m', outcome:'Completed', wo:'WO-2024-0847' },
  { date:'26 Sep 2026', time:'10:30', asset:'Elevator — Tower 2', id:'AST-0219', type:'Corrective', desc:'Door sensor replacement, safety test, MRL service', tech:'R. Patel', duration:'4h 30m', outcome:'Completed', wo:'WO-2024-0843' },
  { date:'25 Sep 2026', time:'08:00', asset:'Generator #3', id:'AST-0220', type:'Preventive', desc:'Engine oil change, fuel filter, coolant level, load bank test', tech:'A. Nair', duration:'2h 45m', outcome:'Completed', wo:'WO-2024-0842' },
  { date:'24 Sep 2026', time:'11:00', asset:'Fire Panel — Lobby', id:'AST-0221', type:'Inspection', desc:'Annual compliance inspection per NFPA 72 — all zones tested', tech:'K. Singh', duration:'1h 30m', outcome:'Completed', wo:'WO-2024-0840' },
  { date:'22 Sep 2026', time:'09:00', asset:'Transformer #2', id:'AST-0227', type:'Corrective', desc:'Tap changer replacement — voltage regulation fault', tech:'P. Joseph', duration:'6h 00m', outcome:'Ongoing', wo:'WO-2024-0838' },
];

const DOWNTIME_TREND = [
  { month:'Apr', planned:14, unplanned:32 },
  { month:'May', planned:12, unplanned:28 },
  { month:'Jun', planned:16, unplanned:41 },
  { month:'Jul', planned:10, unplanned:24 },
  { month:'Aug', planned:9, unplanned:22 },
  { month:'Sep', planned:8, unplanned:16 },
];

type TreeNode = {
  key: string; label: string; id?: string;
  type: 'org'|'site'|'building'|'zone'|'asset'|'component';
  status?: AssetStatus; count?: number; children?: TreeNode[];
};

const TREE: TreeNode[] = [{
  key:'org', label:'FieldOps Corp', type:'org', count:500,
  children:[
    { key:'s1', label:'Colombo HQ', type:'site', count:214, children:[
      { key:'s1-b1', label:'Main Building', type:'building', count:98, children:[
        { key:'s1-b1-z1', label:'Zone A — Level 3', type:'zone', count:8, children:[
          { key:'s1-ast218', label:'HVAC Unit — Block A', id:'AST-0218', type:'asset', status:'under-maintenance', children:[
            { key:'cmp1', label:'Compressor — DK218-C1', type:'component', status:'active' },
            { key:'cmp2', label:'Air Handler — DK218-A1', type:'component', status:'active' },
            { key:'cmp3', label:'Condenser Fan — DK218-F1', type:'component', status:'under-maintenance' },
          ]},
          { key:'s1-ast221', label:'Fire Panel — Lobby', id:'AST-0221', type:'asset', status:'active' },
        ]},
        { key:'s1-b1-z2', label:'Zone B — Ground Floor', type:'zone', count:12, children:[
          { key:'s1-ast226', label:'Water Pump Station', id:'AST-0226', type:'asset', status:'active' },
          { key:'s1-ast228', label:'Air Handling Unit B', id:'AST-0228', type:'asset', status:'active' },
        ]},
        { key:'s1-b1-z3', label:'Rooftop', type:'zone', count:6, children:[
          { key:'s1-ast223', label:'Chiller Unit #1', id:'AST-0223', type:'asset', status:'out-of-service' },
        ]},
      ]},
    ]},
    { key:'s2', label:'Kandy Branch', type:'site', count:98, children:[
      { key:'s2-b1', label:'Branch Building', type:'building', count:98, children:[
        { key:'s2-b1-z1', label:'Main Lobby', type:'zone', count:3, children:[
          { key:'s2-ast219', label:'Elevator — Tower 2', id:'AST-0219', type:'asset', status:'under-maintenance' },
        ]},
        { key:'s2-b1-z2', label:'IT Room', type:'zone', count:4, children:[
          { key:'s2-ast224', label:'BMS Controller', id:'AST-0224', type:'asset', status:'active' },
        ]},
      ]},
    ]},
    { key:'s3', label:'Galle Site', type:'site', count:67 },
    { key:'s4', label:'Data Centre', type:'site', count:121, children:[
      { key:'s4-b1', label:'DC Building', type:'building', count:121, children:[
        { key:'s4-b1-z1', label:'Server Room', type:'zone', count:11, children:[
          { key:'s4-ast222', label:'UPS Bank B', id:'AST-0222', type:'asset', status:'active' },
        ]},
        { key:'s4-b1-z2', label:'Switchroom', type:'zone', count:8, children:[
          { key:'s4-ast227', label:'Transformer #2', id:'AST-0227', type:'asset', status:'under-maintenance' },
          { key:'s4-ast229', label:'Switchgear Panel A', id:'AST-0229', type:'asset', status:'active' },
        ]},
      ]},
    ]},
  ],
}];

// ─── TREE NODE ────────────────────────────────────────────────────────────────
const NODE_COLOR: Record<string, string> = {
  org:       '#0B1F3A',
  site:      '#2563EB',
  building:  '#7C3AED',
  zone:      '#64748B',
  asset:     '#C9A227',
  component: '#94A3B8',
};
const STATUS_DOT: Record<string, string> = {
  active:              'bg-green-500',
  'under-maintenance': 'bg-amber-400',
  'out-of-service':    'bg-red-500',
  retired:             'bg-slate-400',
};
const NODE_ICON: Record<string, React.ReactNode> = {
  org:       <Building2 size={12} />,
  site:      <MapPin size={12} />,
  building:  <Building2 size={11} />,
  zone:      <Layers size={11} />,
  asset:     <Box size={11} />,
  component: <Zap size={10} />,
};

function TreeItem({ node, depth, expanded, onToggle, selectedKey, onSelect }: {
  node: TreeNode; depth: number; expanded: Set<string>;
  onToggle:(k:string)=>void; selectedKey:string|null; onSelect:(n:TreeNode)=>void;
}) {
  const open = expanded.has(node.key);
  const sel  = selectedKey === node.key;
  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => { onSelect(node); if (node.children?.length) onToggle(node.key); }}
        onKeyDown={e => e.key==='Enter' && onSelect(node)}
        className={`flex items-center gap-1.5 py-[5px] pr-3 rounded-md cursor-pointer transition-colors duration-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A227]
          ${sel ? 'bg-[#F7EFCF]' : 'hover:bg-[#F8FAFC]'}`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        {node.children?.length ? (
          <span className={`flex-shrink-0 text-[#CBD5E1] transition-transform duration-150 ${open?'rotate-90':''}`}>
            <ChevronRight size={11} />
          </span>
        ) : <span className="w-2.5 flex-shrink-0" />}

        <span className="flex-shrink-0" style={{ color: NODE_COLOR[node.type] }}>
          {NODE_ICON[node.type]}
        </span>

        <span className={`text-xs flex-1 min-w-0 truncate leading-tight ${sel?'font-600 text-[#0B1F3A]':depth===0?'font-600 text-[#172033]':'font-400 text-[#64748B]'}`}>
          {node.label}
        </span>

        {node.id && (
          <span className="text-[9px] text-[#94A3B8] flex-shrink-0 hidden xl:block">{node.id}</span>
        )}

        {node.status && (
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[node.status]??'bg-slate-300'}`} />
        )}
        {node.count !== undefined && !node.status && (
          <span className="text-[9px] text-[#CBD5E1] flex-shrink-0">{node.count}</span>
        )}
      </div>
      {open && node.children?.map(ch => (
        <TreeItem key={ch.key} node={ch} depth={depth+1}
          expanded={expanded} onToggle={onToggle}
          selectedKey={selectedKey} onSelect={onSelect} />
      ))}
    </div>
  );
}

// ─── KPI CARD ─────────────────────────────────────────────────────────────────
interface KpiProps {
  label:string; value:number|string; sub:string; icon:React.ReactNode;
  variant:'default'|'success'|'warn'|'danger'|'accent';
  trend?:{dir:'up'|'down'|'flat'; text:string; positive:boolean};
  onClick?:()=>void;
}
function KpiCard({label,value,sub,icon,variant,trend,onClick}:KpiProps) {
  const V = {
    default: { card:'bg-white border-[#E2E8F0]', icon:'bg-[#F1F5F9] text-[#64748B]',  val:'text-[#172033]' },
    success: { card:'bg-white border-green-200',   icon:'bg-green-50 text-green-700',    val:'text-green-700' },
    warn:    { card:'bg-white border-amber-200',   icon:'bg-amber-50 text-amber-600',    val:'text-amber-700' },
    danger:  { card:'bg-red-50 border-red-200',    icon:'bg-red-100 text-red-600',       val:'text-red-700'   },
    accent:  { card:'bg-white border-[#C9A227]/40',icon:'bg-[#F7EFCF] text-[#C9A227]',  val:'text-[#0B1F3A]' },
  }[variant];
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-4 flex flex-col gap-2.5 text-left w-full transition-all hover:shadow-md hover:-translate-y-px active:translate-y-0 ${V.card} ${onClick?'cursor-pointer':'cursor-default'}`}
    >
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

// ─── SECTION SHELL ────────────────────────────────────────────────────────────
function Section({title,icon,children,action,badge,noPad=false}:{
  title:string; icon:React.ReactNode; children:React.ReactNode;
  action?:React.ReactNode; badge?:React.ReactNode; noPad?:boolean;
}) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
        <div className="flex items-center gap-2">
          <span className="text-[#0B1F3A] flex-shrink-0">{icon}</span>
          <span className="text-sm font-700 text-[#172033]">{title}</span>
          {badge}
        </div>
        {action}
      </div>
      <div className={noPad?'':''}>{children}</div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
interface Props { onNavigate:(page:Page)=>void; }

export default function AssetManagerDashboard({onNavigate}:Props) {
  // ── filter state
  const [search,setSearch]     = useState('');
  const [fSite,setFSite]       = useState('');
  const [fCat,setFCat]         = useState('');
  const [fStatus,setFStatus]   = useState('');
  const [fWarranty,setFWarranty] = useState('');
  const [dateRange,setDateRange] = useState('last-6-months');

  // ── UI state
  const [treeExpanded, setTreeExpanded] = useState<Set<string>>(new Set(['org','s1','s1-b1','s1-b1-z1','s4']));
  const [treeSelected, setTreeSelected] = useState<TreeNode|null>(null);
  const [dtView,   setDtView]   = useState<'table'|'chart'>('table');
  const [wView,    setWView]    = useState<'alerts'|'overview'>('alerts');
  const [refreshing, setRefreshing] = useState(false);
  const [activeKpi, setActiveKpi] = useState<string|null>(null);

  const toggleTree = useCallback((k:string)=>{
    setTreeExpanded(prev=>{const n=new Set(prev);n.has(k)?n.delete(k):n.add(k);return n;});
  },[]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(()=>setRefreshing(false), 900);
  };

  // ── derived filter
  const filtered = useMemo(()=> ASSETS.filter(a=>{
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.id.toLowerCase().includes(search.toLowerCase()) && !a.category.toLowerCase().includes(search.toLowerCase())) return false;
    if (fSite   && a.site!==fSite) return false;
    if (fCat    && a.category!==fCat) return false;
    if (fStatus && a.status!==fStatus) return false;
    if (fWarranty==='valid'    && a.warranty!=='valid') return false;
    if (fWarranty==='expiring' && a.warranty!=='expiring') return false;
    if (fWarranty==='expired'  && a.warranty!=='expired') return false;
    if (fWarranty==='none'     && a.warranty!=='none') return false;
    if (activeKpi==='Under Maintenance' && a.status!=='under-maintenance') return false;
    if (activeKpi==='Out of Service'    && a.status!=='out-of-service') return false;
    if (activeKpi==='Critical Assets'  && !a.critical) return false;
    if (activeKpi==='No PM Coverage'   && a.pmCoverage) return false;
    if (activeKpi==='Warranty Expiring'&& a.warranty!=='expiring') return false;
    if (activeKpi==='AMC Expiring'     && !a.amc) return false;
    return true;
  }),[search,fSite,fCat,fStatus,fWarranty,activeKpi]);

  const criticalFiltered = filtered.filter(a=>a.critical||a.status==='out-of-service'||a.pmOverdue);

  // ── derived counts
  const total     = ASSETS.length;
  const active    = ASSETS.filter(a=>a.status==='active').length;
  const underMaint= ASSETS.filter(a=>a.status==='under-maintenance').length;
  const outOfSvc  = ASSETS.filter(a=>a.status==='out-of-service').length;
  const critical  = ASSETS.filter(a=>a.critical).length;
  const noPM      = ASSETS.filter(a=>!a.pmCoverage).length;
  const wExpiring = ASSETS.filter(a=>a.warranty==='expiring').length;
  const amcExp    = ASSETS.filter(a=>a.amc&&a.amcEnd).length;

  const healthData = [
    { name:'Healthy',              value:active-1, pct:Math.round(((active-1)/total)*100), color:C.green },
    { name:'Attention Required',   value:active+underMaint-critical, pct:14, color:C.amber },
    { name:'Under Maintenance',    value:underMaint, pct:Math.round((underMaint/total)*100), color:C.blue },
    { name:'Out of Service',       value:outOfSvc, pct:Math.round((outOfSvc/total)*100), color:C.red },
  ];

  const pmData = [
    { label:'Active PM Plan', value:422, pct:84.4, cls:'bg-green-500', color:C.green },
    { label:'PM Due Soon',    value:33,  pct:6.6,  cls:'bg-blue-500',  color:C.blue  },
    { label:'PM Overdue',     value:14,  pct:2.8,  cls:'bg-red-500',   color:C.red   },
    { label:'No PM',          value:31,  pct:6.2,  cls:'bg-amber-400', color:C.amber },
  ];

  const lifecycleStages = [
    { key:'procurement', label:'Procurement', count:12, color:'#475569', bg:'bg-slate-100' },
    { key:'active',      label:'Active',       count:412, color:C.green,  bg:'bg-green-50' },
    { key:'maintenance', label:'Maintenance',  count:47,  color:C.blue,   bg:'bg-blue-50'  },
    { key:'oos',         label:'Out of Service', count:18, color:C.amber, bg:'bg-amber-50' },
    { key:'retired',     label:'Retired',      count:9,   color:'#94A3B8', bg:'bg-slate-50' },
    { key:'disposed',    label:'Disposed',     count:2,   color:'#CBD5E1', bg:'bg-slate-50' },
  ];

  const warrantyAlerts = ASSETS
    .filter(a=>a.warranty==='expiring'||a.warranty==='expired')
    .sort((a,b)=>(a.warranty==='expired'?1:0)-(b.warranty==='expired'?1:0));

  const warrantyOverview = [
    { name:'Active (>90d)',  value:142, color:C.green },
    { name:'Expiring ≤90d',  value:8,   color:C.amber },
    { name:'Expired',        value:23,  color:C.red   },
    { name:'No Warranty',    value:77,  color:'#CBD5E1'},
  ];

  const anyFilter = search||fSite||fCat||fStatus||fWarranty||activeKpi;
  const clearAll = () => { setSearch('');setFSite('');setFCat('');setFStatus('');setFWarranty('');setActiveKpi(null); };

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full flex flex-col">
      {/* ══ HERO HEADER ══════════════════════════════════════════════════════ */}
      <div className="bg-[#0B1F3A] border-b-2 border-[#C9A227]/40">
        <div className="px-5 pt-5 pb-0">
          {/* Title row */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#C9A227]/20 border border-[#C9A227]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Box size={17} className="text-[#C9A227]" />
              </div>
              <div>
                <h1 className="text-lg font-700 text-white leading-tight">Asset Management Overview</h1>
                <p className="text-sm text-white/50 mt-0.5">Monitor asset health, lifecycle, maintenance, downtime and coverage across all sites.</p>
              </div>
            </div>

            {/* Top controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <select value={dateRange} onChange={e=>setDateRange(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#C9A227]/60 hover:bg-white/15 transition-colors cursor-pointer">
                <option value="this-month" className="text-[#172033]">This Month</option>
                <option value="last-3-months" className="text-[#172033]">Last 3 Months</option>
                <option value="last-6-months" className="text-[#172033]">Last 6 Months</option>
                <option value="this-year" className="text-[#172033]">This Year</option>
              </select>

              <button onClick={handleRefresh}
                className={`flex items-center gap-1.5 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs text-white hover:bg-white/20 transition-colors ${refreshing?'opacity-60':''}`}>
                <RefreshCcw size={12} className={refreshing?'animate-spin':''} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                className="flex items-center gap-1.5 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs text-white hover:bg-white/20 transition-colors">
                <Download size={12} />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button onClick={()=>onNavigate('asset-create')}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#C9A227] text-[#071426] text-xs font-600 rounded-lg hover:bg-[#D9B33F] transition-colors shadow-sm">
                <Plus size={13} />
                Add Asset
              </button>
            </div>
          </div>

          {/* Search & filter bar */}
          <div className="flex flex-wrap items-center gap-2 pb-4">
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 min-w-52 flex-1 max-w-sm focus-within:border-[#C9A227]/60 transition-colors">
              <Search size={13} className="text-white/50 flex-shrink-0" />
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search assets by name, ID, model..."
                className="bg-transparent text-sm text-white placeholder-white/40 outline-none flex-1 min-w-0" />
              {search && <button onClick={()=>setSearch('')}><X size={11} className="text-white/40 hover:text-white/70" /></button>}
            </div>

            {([
              { val:fSite,    set:setFSite,    ph:'All Sites',      opts:['Colombo HQ','Kandy Branch','Galle Site','Data Centre'] },
              { val:fCat,     set:setFCat,     ph:'All Categories', opts:['HVAC','Power','Electrical','Elevator','Safety','Controls','Plumbing'] },
              { val:fStatus,  set:setFStatus,  ph:'All Statuses',   opts:['active','under-maintenance','out-of-service'] },
              { val:fWarranty,set:setFWarranty,ph:'Warranty: All',  opts:['valid','expiring','expired','none'] },
            ] as const).map((f,i)=>(
              <select key={i} value={f.val} onChange={e=>(f.set as any)(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#C9A227]/60 hover:bg-white/15 transition-colors cursor-pointer">
                <option value="" className="text-[#172033]">{f.ph}</option>
                {f.opts.map(o=>(
                  <option key={o} value={o} className="text-[#172033]">{o.replace(/-/g,' ')}</option>
                ))}
              </select>
            ))}

            {anyFilter && (
              <button onClick={clearAll}
                className="flex items-center gap-1.5 px-3 py-2 border border-[#C9A227]/40 text-[#C9A227] text-xs font-500 rounded-lg hover:bg-[#C9A227]/10 transition-colors">
                <X size={11} /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Active filter badge */}
        {activeKpi && (
          <div className="px-5 pb-3 flex items-center gap-2">
            <span className="text-xs text-white/50">Filtered by:</span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#C9A227]/20 border border-[#C9A227]/40 rounded-full text-xs text-[#C9A227] font-500">
              {activeKpi}
              <button onClick={()=>setActiveKpi(null)}><X size={10}/></button>
            </span>
          </div>
        )}
      </div>

      {/* ══ BODY ═════════════════════════════════════════════════════════════ */}
      <div className="flex-1 p-5 space-y-5">

        {/* ── KPI CARDS ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
          {([
            { label:'Total Assets',      value:total,     sub:`Across 4 sites`,          icon:<Box size={14}/>,         variant:'default', trend:{ dir:'up', text:'+12 this month', positive:true  } },
            { label:'Active',            value:active,    sub:`${Math.round((active/total)*100)}% of portfolio`,     icon:<Activity size={14}/>,    variant:'success', trend:{ dir:'up', text:'+5 since last week', positive:true  } },
            { label:'Under Maintenance', value:underMaint,sub:`${Math.round((underMaint/total)*100)}% of portfolio`,  icon:<Wrench size={14}/>,      variant:'warn',    trend:{ dir:'up', text:'+3 vs last week',    positive:false } },
            { label:'Out of Service',    value:outOfSvc,  sub:'Requires urgent action',  icon:<ShieldOff size={14}/>,  variant:'danger',  trend:{ dir:'flat',text:'No change today',   positive:true  } },
            { label:'Critical Assets',   value:critical,  sub:'High-priority monitoring', icon:<AlertTriangle size={14}/>,variant:'danger',  trend:{ dir:'flat',text:'Stable',            positive:true  } },
            { label:'No PM Coverage',    value:noPM,      sub:'Scheduling required',      icon:<CalendarClock size={14}/>,variant:'warn',    trend:{ dir:'up', text:'+2 this week',       positive:false } },
            { label:'Warranty Expiring', value:wExpiring, sub:'Within 90 days',           icon:<FileWarning size={14}/>,variant:'warn',    trend:{ dir:'flat',text:'Action needed',     positive:false } },
            { label:'AMC Expiring',      value:amcExp,    sub:'Within 60 days',           icon:<FileWarning size={14}/>,variant:'danger',  trend:{ dir:'flat',text:'Renewal due',       positive:false } },
          ] as const).map((k,i)=>(
            <KpiCard key={i} {...k}
              variant={k.variant as any}
              onClick={()=>setActiveKpi(prev=>prev===k.label?null:k.label)}
            />
          ))}
        </div>

        {/* ── HEALTH + LIFECYCLE ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Asset Health */}
          <Section title="Asset Health Status" icon={<Activity size={14}/>}
            action={<span className="text-xs text-[#94A3B8]">{total} total</span>}
            badge={<span className="ml-1 text-[10px] bg-[#F1F5F9] text-[#64748B] px-1.5 py-0.5 rounded-full font-600">Live</span>}
          >
            <div className="p-5">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Donut */}
                <div className="relative flex-shrink-0">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={healthData} cx="50%" cy="50%" innerRadius={54} outerRadius={76}
                        dataKey="value" strokeWidth={3} stroke="#fff">
                        {healthData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                      </Pie>
                      <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:`1px solid ${C.border}`,boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-800 text-[#172033]">{total}</span>
                    <span className="text-[10px] text-[#94A3B8] font-500">Total Assets</span>
                  </div>
                </div>
                {/* Legend bars */}
                <div className="flex-1 w-full space-y-3">
                  {healthData.map(d=>(
                    <button key={d.name} onClick={()=>{}}
                      className="w-full flex items-center gap-2.5 group">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:d.color}}/>
                      <span className="text-xs text-[#64748B] flex-1 text-left group-hover:text-[#172033] transition-colors">{d.name}</span>
                      <div className="w-20 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden flex-shrink-0">
                        <div className="h-full rounded-full transition-all" style={{width:`${d.pct}%`,background:d.color}}/>
                      </div>
                      <span className="text-xs font-700 text-[#172033] w-6 text-right">{d.value}</span>
                      <span className="text-[10px] text-[#94A3B8] w-9 text-right">{d.pct}%</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Lifecycle + PM */}
          <div className="lg:col-span-3 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <ArrowRight size={14} className="text-[#0B1F3A]"/>
                <span className="text-sm font-700 text-[#172033]">Asset Lifecycle & PM Coverage</span>
              </div>
            </div>

            <div className="p-5">
              {/* Lifecycle pipeline */}
              <p className="text-[10px] font-600 text-[#94A3B8] uppercase tracking-wider mb-3">Lifecycle Stage Distribution</p>
              <div className="flex items-stretch gap-1 overflow-x-auto pb-1 mb-3">
                {lifecycleStages.map((s,i)=>(
                  <div key={s.key} className="flex items-center gap-1 flex-shrink-0">
                    <div className={`flex flex-col items-center px-3 py-2 rounded-lg ${s.bg} border border-white min-w-[72px]`}>
                      <span className="text-xl font-800 leading-none" style={{color:s.color}}>{s.count}</span>
                      <span className="text-[9px] font-500 text-center leading-tight mt-1" style={{color:s.color}}>{s.label}</span>
                    </div>
                    {i<lifecycleStages.length-1&&(
                      <ChevronRight size={11} className="text-[#CBD5E1] flex-shrink-0"/>
                    )}
                  </div>
                ))}
              </div>

              {/* Stacked bar */}
              <div className="h-3 flex rounded-full overflow-hidden gap-0.5 mb-1">
                {lifecycleStages.map(s=>(
                  <div key={s.key} title={`${s.label}: ${s.count}`}
                    className="transition-all cursor-pointer hover:opacity-80"
                    style={{width:`${(s.count/500)*100}%`,background:s.color,minWidth:s.count?3:0}}/>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mb-5">
                {lifecycleStages.map(s=>(
                  <span key={s.key} className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{background:s.color}}/>
                    <span className="text-[10px] text-[#94A3B8]">{s.label}</span>
                  </span>
                ))}
              </div>

              <div className="h-px bg-[#F1F5F9] mb-4"/>

              {/* PM coverage */}
              <p className="text-[10px] font-600 text-[#94A3B8] uppercase tracking-wider mb-3">PM Coverage</p>
              <div className="space-y-2.5">
                {pmData.map(pm=>(
                  <div key={pm.label} className="flex items-center gap-3">
                    <span className="text-xs text-[#64748B] w-32 flex-shrink-0 leading-tight">{pm.label}</span>
                    <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${pm.cls}`} style={{width:`${pm.pct}%`}}/>
                    </div>
                    <span className="text-xs font-700 text-[#172033] w-7 text-right">{pm.value}</span>
                    <span className="text-[10px] text-[#94A3B8] w-9 text-right">{pm.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── HIERARCHY + CRITICAL ASSETS ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Tree */}
          <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC] flex-shrink-0">
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-[#0B1F3A]"/>
                <span className="text-sm font-700 text-[#172033]">Asset Hierarchy</span>
              </div>
              <button onClick={()=>onNavigate('asset-hierarchy')}
                className="text-xs text-[#C9A227] hover:text-[#a8841e] font-500 transition-colors">
                Full View →
              </button>
            </div>

            {/* Node type legend */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 px-4 py-2 border-b border-[#F1F5F9] bg-[#FAFCFE]">
              {[{t:'site',l:'Site'},{t:'building',l:'Building'},{t:'zone',l:'Zone'},{t:'asset',l:'Asset'},{t:'component',l:'Component'}].map(n=>(
                <span key={n.t} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{background:NODE_COLOR[n.t]}}/>
                  <span className="text-[9px] text-[#94A3B8] font-500">{n.l}</span>
                </span>
              ))}
            </div>

            {/* Tree scroll */}
            <div className="flex-1 overflow-y-auto py-2 px-1.5" style={{maxHeight:400}}>
              {TREE.map(n=>(
                <TreeItem key={n.key} node={n} depth={0}
                  expanded={treeExpanded} onToggle={toggleTree}
                  selectedKey={treeSelected?.key??null} onSelect={setTreeSelected}/>
              ))}
            </div>

            {/* Selected node detail panel */}
            {treeSelected ? (
              <div className="border-t border-[#E2E8F0] p-4 bg-[#F7EFCF]/25 flex-shrink-0">
                <div className="flex items-start justify-between mb-1.5">
                  <div className="min-w-0">
                    <p className="text-xs font-700 text-[#0B1F3A] truncate">{treeSelected.label}</p>
                    <p className="text-[10px] text-[#64748B] capitalize mt-0.5">{treeSelected.type}{treeSelected.id?` · ${treeSelected.id}`:''}</p>
                  </div>
                  {treeSelected.status && <StatusBadge status={treeSelected.status} variant="small"/>}
                </div>
                {treeSelected.count!=null&&(
                  <p className="text-[10px] text-[#94A3B8]">{treeSelected.count} assets in this node</p>
                )}
                {treeSelected.type==='asset' && (
                  <button onClick={()=>onNavigate('asset-detail')}
                    className="mt-2 flex items-center gap-1.5 text-xs text-[#C9A227] font-500 hover:text-[#a8841e] transition-colors">
                    <Eye size={11}/>View Asset Detail
                  </button>
                )}
              </div>
            ) : (
              <div className="border-t border-[#F1F5F9] px-4 py-3 flex-shrink-0">
                <p className="text-[10px] text-[#94A3B8]">Click any node to inspect it</p>
              </div>
            )}
          </div>

          {/* Critical Assets */}
          <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-[#C9A227]"/>
                <span className="text-sm font-700 text-[#172033]">Critical Assets</span>
                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-700">{criticalFiltered.length}</span>
              </div>
              <button onClick={()=>onNavigate('assets')}
                className="text-xs text-[#C9A227] hover:text-[#a8841e] font-500 transition-colors">
                All Assets →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <tr>
                    {['Asset','Category','Site','Status','Last PM','Next PM','Downtime','Warranty',''].map(h=>(
                      <th key={h} className="text-left px-3 py-2.5 text-[10px] font-700 text-[#64748B] uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F8FAFC]">
                  {criticalFiltered.length===0 ? (
                    <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-[#94A3B8]">
                      No assets match current filters.
                    </td></tr>
                  ) : criticalFiltered.map((a,i)=>(
                    <tr key={i} onClick={()=>onNavigate('asset-detail')}
                      className={`cursor-pointer transition-colors hover:bg-[#F8FAFC] ${a.status==='out-of-service'?'bg-red-50/30':a.pmOverdue?'bg-amber-50/20':''}`}>
                      <td className="px-3 py-2.5">
                        <div className="text-[10px] font-600 text-[#0B1F3A]">{a.id}</div>
                        <div className="text-xs font-600 text-[#172033] max-w-[130px] truncate">{a.name}</div>
                        <div className="text-[10px] text-[#94A3B8]">{a.model}</div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs px-2 py-0.5 bg-[#F1F5F9] text-[#64748B] rounded font-500">{a.category}</span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-[#64748B] whitespace-nowrap">{a.site}</td>
                      <td className="px-3 py-2.5"><StatusBadge status={a.status} variant="small"/></td>
                      <td className="px-3 py-2.5 text-xs text-[#64748B] whitespace-nowrap">{a.lastPM??'—'}</td>
                      <td className="px-3 py-2.5">
                        {a.pmOverdue || !a.nextPM ? (
                          <span className="flex items-center gap-1 text-[10px] font-700 text-red-600 whitespace-nowrap">
                            <AlertTriangle size={9}/>OVERDUE
                          </span>
                        ) : (
                          <span className="text-xs text-[#64748B] whitespace-nowrap">{a.nextPM}</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`text-xs font-700 ${a.downtime>20?'text-red-600':a.downtime>10?'text-amber-600':'text-[#64748B]'}`}>
                          {a.downtime>0?`${a.downtime}h`:'—'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`text-[10px] font-600 px-1.5 py-0.5 rounded whitespace-nowrap ${
                          a.warranty==='valid'?'bg-green-50 text-green-700':
                          a.warranty==='expiring'?'bg-amber-50 text-amber-700':
                          a.warranty==='expired'?'bg-red-50 text-red-700':
                          'bg-slate-100 text-slate-500'
                        }`}>{a.warranty==='valid'?'Valid':a.warranty==='expiring'?'Expiring':a.warranty==='expired'?'Expired':'None'}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <button className={`text-[10px] font-600 px-2 py-1 rounded whitespace-nowrap transition-colors ${
                          a.status==='out-of-service'||a.pmOverdue
                            ?'bg-red-600 text-white hover:bg-red-700'
                            :'border border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1] hover:text-[#172033]'
                        }`}>
                          {a.status==='out-of-service'||a.pmOverdue?'Urgent':'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── MAINTENANCE HISTORY + DOWNTIME ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Maintenance timeline */}
          <Section title="Recent Maintenance Events" icon={<History size={14}/>}
            action={
              <button onClick={()=>onNavigate('maintenance')}
                className="text-xs text-[#C9A227] hover:text-[#a8841e] font-500">Full History →</button>
            }
          >
            <div className="divide-y divide-[#F8FAFC]">
              {MAINTENANCE_HISTORY.map((e,i)=>{
                const typeClr = e.type==='Corrective'?{stripe:'bg-orange-400',pill:'bg-orange-50 text-orange-700'}
                  :e.type==='Preventive'?{stripe:'bg-blue-500',pill:'bg-blue-50 text-blue-700'}
                  :{stripe:'bg-purple-400',pill:'bg-purple-50 text-purple-700'};
                return (
                  <div key={i} className="flex items-start gap-3 px-4 py-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    onClick={()=>onNavigate('work-order-detail')}>
                    <div className={`w-0.5 rounded-full flex-shrink-0 self-stretch mt-0.5 ${typeClr.stripe}`} style={{minHeight:40}}/>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-xs font-700 text-[#172033] truncate max-w-[140px]">{e.asset}</span>
                        <span className={`text-[10px] font-600 px-1.5 py-0.5 rounded flex-shrink-0 ${typeClr.pill}`}>{e.type}</span>
                      </div>
                      <p className="text-[11px] text-[#64748B] leading-snug truncate">{e.desc}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-[#94A3B8]">
                        <span>{e.tech}</span><span>·</span>
                        <span>{e.wo}</span><span>·</span>
                        <span>{e.duration}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-[10px] text-[#94A3B8]">{e.date}</div>
                      <div className="text-[10px] text-[#94A3B8] mb-1">{e.time}</div>
                      <span className={`text-[9px] font-700 px-1.5 py-0.5 rounded ${
                        e.outcome==='In Progress'||e.outcome==='Ongoing'
                          ?'bg-amber-50 text-amber-700':'bg-green-50 text-green-700'
                      }`}>{e.outcome}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Downtime analysis */}
          <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[#0B1F3A]"/>
                <span className="text-sm font-700 text-[#172033]">Downtime Analysis</span>
              </div>
              <div className="flex gap-1">
                {(['table','chart'] as const).map(v=>(
                  <button key={v} onClick={()=>setDtView(v)}
                    className={`px-2.5 py-1 text-[10px] font-600 rounded transition-colors capitalize ${dtView===v?'bg-[#0B1F3A] text-white':'text-[#64748B] hover:bg-[#F1F5F9]'}`}>
                    {v==='table'?'Table':'Trend'}
                  </button>
                ))}
              </div>
            </div>

            {dtView==='table' ? (
              <div className="divide-y divide-[#F8FAFC]">
                {ASSETS.filter(a=>a.downtime>0).sort((a,b)=>b.downtime-a.downtime).slice(0,5).map((a,i)=>(
                  <div key={i} className="px-4 py-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    onClick={()=>onNavigate('asset-detail')}>
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="min-w-0">
                        <div className="text-xs font-600 text-[#172033] truncate max-w-[130px]">{a.name}</div>
                        <div className="text-[10px] text-[#94A3B8]">{a.site}</div>
                      </div>
                      <span className={`text-sm font-800 flex-shrink-0 ${a.downtime>20?'text-red-600':a.downtime>10?'text-amber-600':'text-[#64748B]'}`}>
                        {a.downtime}h
                      </span>
                    </div>
                    <div className="flex gap-3 text-[10px] text-[#94A3B8] mb-1.5">
                      <span><strong className="text-[#172033]">{a.breakdowns}</strong> breakdowns</span>
                      <span>MTTR: <strong className="text-[#172033]">{a.mttr}h</strong></span>
                      <span>MTBF: <strong className="text-[#172033]">{a.mtbf}d</strong></span>
                    </div>
                    <div className="h-1 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div className="h-full rounded-full"
                        style={{width:`${Math.min((a.downtime/40)*100,100)}%`,
                          background:a.downtime>20?C.red:a.downtime>10?C.amber:'#94A3B8'}}/>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-center gap-3 text-[10px] text-[#64748B] mb-3">
                  <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-400 inline-block"/> Unplanned</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-[#C9A227] inline-block"/> Planned</span>
                </div>
                <ResponsiveContainer width="100%" height={210}>
                  <AreaChart data={DOWNTIME_TREND} margin={{top:4,right:0,bottom:0,left:-10}}>
                    <defs>
                      <linearGradient id="dtUnplan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#DC2626" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="dtPlan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#C9A227" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#C9A227" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                    <XAxis dataKey="month" tick={{fontSize:10,fill:'#94A3B8'}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fontSize:10,fill:'#94A3B8'}} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:`1px solid ${C.border}`}}/>
                    <Area type="monotone" dataKey="unplanned" name="Unplanned (h)" stroke="#DC2626" fill="url(#dtUnplan)" strokeWidth={2} dot={{r:3,fill:'#DC2626',strokeWidth:0}}/>
                    <Area type="monotone" dataKey="planned"   name="Planned (h)"   stroke="#C9A227" fill="url(#dtPlan)"   strokeWidth={2} dot={{r:3,fill:'#C9A227',strokeWidth:0}}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* ── WARRANTY/AMC + PM COVERAGE ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Warranty & AMC */}
          <div className="lg:col-span-3 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#0B1F3A]"/>
                <span className="text-sm font-700 text-[#172033]">Warranty & AMC Coverage</span>
              </div>
              <div className="flex gap-1">
                {(['alerts','overview'] as const).map(v=>(
                  <button key={v} onClick={()=>setWView(v)}
                    className={`px-2.5 py-1 text-[10px] font-600 rounded transition-colors capitalize ${wView===v?'bg-[#0B1F3A] text-white':'text-[#64748B] hover:bg-[#F1F5F9]'}`}>
                    {v==='alerts'?'Alerts':'Overview'}
                  </button>
                ))}
              </div>
            </div>

            {wView==='alerts' ? (
              <>
                <div className="px-4 py-2.5 border-b border-[#F8FAFC] bg-amber-50/40">
                  <p className="text-[10px] font-600 text-amber-700 uppercase tracking-wider">Expiring Soon & Expired</p>
                </div>
                <div className="divide-y divide-[#F8FAFC]">
                  {warrantyAlerts.map((a,i)=>{
                    const expDate = a.warrantyEnd ? new Date(a.warrantyEnd) : null;
                    const daysLeft = expDate ? Math.round((expDate.getTime()-Date.now())/(1000*86400)) : null;
                    const exp = a.warranty==='expired';
                    return (
                      <div key={i} className={`flex items-center gap-4 px-4 py-3.5 hover:bg-[#F8FAFC] transition-colors cursor-pointer ${exp?'opacity-85':''}`}
                        onClick={()=>onNavigate('contracts-warranty')}>
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${exp?'bg-red-500':'bg-amber-400'}`}/>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-600 text-[#172033] truncate">{a.name}</div>
                          <div className="text-[10px] text-[#94A3B8]">{a.id} · {a.warrantyProvider}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className={`text-xs font-700 ${exp?'text-red-600':'text-amber-600'}`}>
                            {exp&&daysLeft!==null?`${Math.abs(daysLeft)}d overdue`:daysLeft!==null?`${daysLeft}d left`:'—'}
                          </div>
                          <div className="text-[10px] text-[#94A3B8]">{a.warrantyEnd}</div>
                        </div>
                        <span className={`text-[10px] font-700 px-2 py-1 rounded border flex-shrink-0 whitespace-nowrap ${
                          exp?'bg-red-50 text-red-700 border-red-200':'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>{exp?'Renew Now':'Renew Soon'}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="px-4 py-2.5 border-t border-[#F1F5F9] flex gap-4 bg-[#F8FAFC]">
                  <button onClick={()=>onNavigate('contracts-warranty')}
                    className="flex items-center gap-1.5 text-xs text-[#C9A227] font-500 hover:text-[#a8841e] transition-colors">
                    <FileText size={11}/>All Warranties
                  </button>
                  <span className="text-[#E2E8F0]">·</span>
                  <button onClick={()=>onNavigate('contracts-amc')}
                    className="flex items-center gap-1.5 text-xs text-[#C9A227] font-500 hover:text-[#a8841e] transition-colors">
                    <FileText size={11}/>All AMC
                  </button>
                </div>
              </>
            ) : (
              <div className="p-5 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative flex-shrink-0">
                  <ResponsiveContainer width={170} height={170}>
                    <PieChart>
                      <Pie data={warrantyOverview} cx="50%" cy="50%" innerRadius={54} outerRadius={78}
                        dataKey="value" strokeWidth={3} stroke="#fff">
                        {warrantyOverview.map((e,i)=><Cell key={i} fill={e.color}/>)}
                      </Pie>
                      <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:`1px solid ${C.border}`}}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-800 text-[#172033]">250</span>
                    <span className="text-[10px] text-[#94A3B8]">covered</span>
                  </div>
                </div>
                <div className="flex-1 space-y-3 w-full">
                  {warrantyOverview.map(d=>(
                    <div key={d.name} className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:d.color}}/>
                      <span className="text-xs text-[#64748B] flex-1">{d.name}</span>
                      <div className="w-24 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden flex-shrink-0">
                        <div className="h-full rounded-full" style={{width:`${(d.value/250)*100}%`,background:d.color}}/>
                      </div>
                      <span className="text-xs font-700 text-[#172033] w-6 text-right">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PM Coverage Detail */}
          <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
              <div className="flex items-center gap-2">
                <CalendarClock size={14} className="text-[#0B1F3A]"/>
                <span className="text-sm font-700 text-[#172033]">PM Coverage</span>
              </div>
              <button onClick={()=>onNavigate('maintenance-plans')}
                className="text-xs text-[#C9A227] font-500 hover:text-[#a8841e]">
                Manage →
              </button>
            </div>

            <div className="p-5">
              {/* Big percentage ring */}
              <div className="flex items-center gap-4 mb-5">
                <div className="relative flex-shrink-0">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="#F1F5F9" strokeWidth="7"/>
                    <circle cx="40" cy="40" r="32" fill="none" stroke={C.green} strokeWidth="7"
                      strokeDasharray={`${0.844*201} 201`} strokeLinecap="round"
                      transform="rotate(-90 40 40)"/>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-base font-800 text-[#172033]">84%</span>
                    <span className="text-[8px] text-[#94A3B8]">covered</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {pmData.map(pm=>(
                    <div key={pm.label}>
                      <div className="flex justify-between mb-0.5">
                        <span className="text-[10px] text-[#64748B]">{pm.label}</span>
                        <span className="text-[10px] font-700" style={{color:pm.color}}>{pm.value}</span>
                      </div>
                      <div className="h-1 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pm.cls}`} style={{width:`${pm.pct}%`}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alert cards */}
              <div className="space-y-2.5">
                <button onClick={()=>onNavigate('maintenance')}
                  className="w-full flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-left group">
                  <AlertTriangle size={13} className="text-red-600 flex-shrink-0 mt-0.5"/>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-700 text-red-700">14 assets — PM overdue</div>
                    <div className="text-[10px] text-red-500 mt-0.5">Immediate scheduling required</div>
                  </div>
                  <ChevronRight size={12} className="text-red-400 flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform"/>
                </button>
                <button onClick={()=>onNavigate('maintenance-plans')}
                  className="w-full flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors text-left group">
                  <CalendarClock size={13} className="text-amber-600 flex-shrink-0 mt-0.5"/>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-700 text-amber-700">31 assets — no PM plan</div>
                    <div className="text-[10px] text-amber-500 mt-0.5">Create and assign coverage plans</div>
                  </div>
                  <ChevronRight size={12} className="text-amber-400 flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform"/>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── QUICK ACTIONS ──────────────────────────────────────────────── */}
        <div className="bg-[#0B1F3A] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} className="text-[#C9A227]"/>
            <h2 className="text-sm font-700 text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {([
              { label:'Add Asset',                icon:<Plus size={18}/>,         page:'asset-create' as Page,         primary:true  },
              { label:'Asset Hierarchy',          icon:<Layers size={18}/>,       page:'asset-hierarchy' as Page,      primary:false },
              { label:'Create Maint. Request',    icon:<Wrench size={18}/>,       page:'work-order-create' as Page,    primary:false },
              { label:'Maintenance History',      icon:<History size={18}/>,      page:'maintenance' as Page,          primary:false },
              { label:'Warranty & AMC',           icon:<FileText size={18}/>,     page:'contracts-warranty' as Page,   primary:false },
              { label:'QR / Barcode Generator',  icon:<QrCode size={18}/>,       page:'qr-barcode' as Page,           primary:false },
            ]).map(a=>(
              <button key={a.label} onClick={()=>onNavigate(a.page)}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-xl text-center transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 ${
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
