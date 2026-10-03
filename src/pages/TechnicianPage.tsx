import { useState, useEffect } from 'react';
import {
  MapPin, Clock, CheckSquare, Package, Camera, Pause, CheckCircle,
  AlertTriangle, Plus, Play, QrCode, ArrowLeft, ChevronRight,
  User, Wrench, FileText, Timer, Bell, Zap, Search, Filter,
  Shield, Star, RotateCcw, Info, StickyNote, X
} from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import type { Page } from '../types';

// ─── DATA ─────────────────────────────────────────────────────────────────────
type TechStatus = 'available' | 'on-job' | 'on-break' | 'offline';

const TECH_STATUS_CONFIG: Record<TechStatus, { label: string; dot: string; badge: string }> = {
  'available': { label: 'Available',  dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700 border-green-200' },
  'on-job':    { label: 'On Job',     dot: 'bg-[#C9A227]',  badge: 'bg-[#F7EFCF] text-[#7a6015] border-[#C9A227]/30' },
  'on-break':  { label: 'On Break',   dot: 'bg-blue-400',   badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  'offline':   { label: 'Offline',    dot: 'bg-slate-400',  badge: 'bg-slate-100 text-slate-600 border-slate-200' },
};

interface Job {
  woId: string; title: string; asset: string; assetId: string;
  category: string; site: string; location: string;
  priority: 'Critical'|'High'|'Medium'|'Low';
  scheduledTime: string; status: 'assigned'|'dispatched'|'in-progress'|'on-hold'|'completed';
  sla: string; slaAt: 'safe'|'at-risk'|'breached';
  checklistTotal: number; checklistDone: number;
  description: string; lastMaint: string; warranty: string;
}

const JOBS: Job[] = [
  {
    woId:'WO-2024-0851', title:'HVAC Corrective Maintenance — Refrigerant Fault',
    asset:'HVAC Unit — Block A', assetId:'AST-0218', category:'HVAC',
    site:'Colombo HQ', location:'Zone A — Level 3',
    priority:'High', scheduledTime:'09:00 – 12:00', status:'in-progress',
    sla:'03:18 remaining', slaAt:'at-risk',
    checklistTotal:8, checklistDone:3,
    description:'Investigate reduced cooling capacity. HVAC running at ~60% output. Perform full diagnostic: refrigerant pressure, coil inspection, capacitor test. Replace faulty components.',
    lastMaint:'20 Jun 2026', warranty:'Valid until 31 Jan 2027',
  },
  {
    woId:'WO-2024-0848', title:'Fire Panel Annual Inspection',
    asset:'Fire Panel — Lobby', assetId:'AST-0221', category:'Safety',
    site:'Colombo HQ', location:'Ground Floor — Main Lobby',
    priority:'High', scheduledTime:'14:00 – 16:00', status:'assigned',
    sla:'08:00 remaining', slaAt:'safe',
    checklistTotal:6, checklistDone:0,
    description:'Perform NFPA 72 annual compliance inspection. Test all detection zones, verify panel functions, check battery backup. Submit compliance certificate.',
    lastMaint:'24 Sep 2025', warranty:'Valid until 15 Jun 2027',
  },
  {
    woId:'WO-2024-0839', title:'Generator #3 — Monthly Service',
    asset:'Generator #3', assetId:'AST-0220', category:'Power',
    site:'Galle Site', location:'Utility Block',
    priority:'Medium', scheduledTime:'Yesterday 09:00', status:'assigned',
    sla:'BREACHED', slaAt:'breached',
    checklistTotal:5, checklistDone:0,
    description:'Monthly preventive service: oil change, filter replacement, coolant check, load bank test.',
    lastMaint:'29 Aug 2026', warranty:'Expiring 31 Dec 2026',
  },
];

const CHECKLIST_ITEMS = [
  { id:1, question:'Isolate power supply and confirm lockout/tagout procedure',      result: 'pass' as string|null, finding:'' },
  { id:2, question:'Inspect air filters — record condition (clean/dirty/replace)',   result: 'pass' as string|null, finding:'' },
  { id:3, question:'Clean evaporator coils — use approved coil cleaner',             result: 'pass' as string|null, finding:'' },
  { id:4, question:'Check refrigerant pressure (R410A) — record reading',            result: 'fail' as string|null, finding:'Low refrigerant pressure: 85 PSI (expected 115–125 PSI). Top-up required.' },
  { id:5, question:'Inspect all electrical connections and check capacitors',         result: null,                  finding:'' },
  { id:6, question:'Test thermostat calibration against reference sensor',            result: null,                  finding:'' },
  { id:7, question:'Record unit running current (amps) under load',                   result: null,                  finding:'' },
  { id:8, question:'Conduct 10-minute test run and verify temperature differential',  result: null,                  finding:'' },
];

const PARTS_DATA = [
  { name:'Air Filter (HEPA)', partNo:'PART-0091', required:2, issued:2, consumed:2, returned:0,  status:'issued'   },
  { name:'Refrigerant R410A', partNo:'PART-0103', required:1, issued:1, consumed:0, returned:0,  status:'reserved' },
  { name:'Capacitor 45/5 µF', partNo:'PART-0187', required:1, issued:0, consumed:0, returned:0,  status:'pending'  },
];

const ALERTS_DATA = [
  { type:'sla',       msg:'WO-2024-0851 SLA resolution in 3h 18m',               severity:'high'   },
  { type:'overdue',   msg:'WO-2024-0839 is overdue — was due yesterday',          severity:'high'   },
  { type:'assignment',msg:'New job assigned: WO-2024-0855 — UPS Bank B Fault',    severity:'medium' },
  { type:'part',      msg:'Part request PART-0187 approved — collect from stores',severity:'info'   },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const PRIORITY_STYLE: Record<string, string> = {
  Critical:'bg-red-100 text-red-700',
  High:    'bg-orange-100 text-orange-700',
  Medium:  'bg-amber-100 text-amber-700',
  Low:     'bg-slate-100 text-slate-600',
};
const SLA_STYLE: Record<string, string> = {
  safe:    'text-green-600',
  'at-risk':'text-amber-600',
  breached:'text-red-600',
};
const JOB_STATUS_LABEL: Record<Job['status'], string> = {
  assigned:'Assigned', dispatched:'Dispatched', 'in-progress':'In Progress',
  'on-hold':'On Hold', completed:'Completed',
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

// Elapsed timer
function ElapsedTimer({ startTime }: { startTime: string }) {
  const [elapsed, setElapsed] = useState('1h 14m');
  useEffect(() => {
    const iv = setInterval(() => setElapsed(p => p), 60_000);
    return () => clearInterval(iv);
  }, []);
  return <span>{elapsed}</span>;
}

// Checklist item
function CheckItem({ item, onResult, onFinding }: {
  item: typeof CHECKLIST_ITEMS[0];
  onResult: (id: number, r: string|null) => void;
  onFinding: (id: number, text: string) => void;
}) {
  const [editFinding, setEditFinding] = useState(false);
  const [findingText, setFindingText] = useState(item.finding);

  const stateStyle = item.result === 'pass'
    ? 'border-green-200 bg-green-50/30'
    : item.result === 'fail'
    ? 'border-red-200 bg-red-50/30'
    : 'border-[#E2E8F0] bg-white';

  return (
    <div className={`border rounded-xl p-3.5 transition-colors ${stateStyle}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-700 mt-0.5
          ${item.result==='pass'?'bg-green-500 text-white':item.result==='fail'?'bg-red-500 text-white':'bg-[#F1F5F9] text-[#64748B]'}`}>
          {item.result==='pass'?'✓':item.result==='fail'?'✗':item.id}
        </div>
        <p className="text-sm text-[#172033] flex-1 leading-snug">{item.question}</p>
      </div>

      {item.result === null ? (
        <div className="flex gap-2 ml-9">
          <button onClick={() => onResult(item.id, 'pass')}
            className="flex-1 py-3 bg-green-600 text-white text-sm font-600 rounded-lg active:scale-95 transition-all hover:bg-green-700">
            ✓ Pass
          </button>
          <button onClick={() => onResult(item.id, 'fail')}
            className="flex-1 py-3 bg-red-600 text-white text-sm font-600 rounded-lg active:scale-95 transition-all hover:bg-red-700">
            ✗ Fail
          </button>
          <button onClick={() => onResult(item.id, 'na')}
            className="px-4 py-3 bg-[#F1F5F9] text-[#64748B] text-sm rounded-lg active:scale-95 transition-all hover:bg-[#E2E8F0] font-500">
            N/A
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 ml-9">
          <span className={`px-3 py-1.5 rounded-lg text-sm font-600 ${
            item.result==='pass'?'bg-green-100 text-green-700':
            item.result==='fail'?'bg-red-100 text-red-700':
            'bg-slate-100 text-slate-600'
          }`}>
            {item.result==='pass'?'✓ Pass':item.result==='fail'?'✗ Fail':'N/A'}
          </span>
          <button onClick={() => onResult(item.id, null)} className="text-xs text-[#64748B] hover:text-[#C9A227] transition-colors px-2 py-1">
            Edit
          </button>
        </div>
      )}

      {item.result === 'fail' && (
        <div className="ml-9 mt-3">
          {item.finding && !editFinding ? (
            <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle size={13} className="text-red-500 flex-shrink-0 mt-0.5"/>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-700 text-red-700 mb-0.5">Finding</div>
                <p className="text-xs text-red-700 leading-snug">{item.finding}</p>
              </div>
              <button onClick={() => setEditFinding(true)} className="text-[11px] text-red-500 hover:text-red-700 flex-shrink-0">Edit</button>
            </div>
          ) : (
            <div>
              <textarea value={findingText}
                onChange={e => setFindingText(e.target.value)}
                placeholder="Describe the finding..."
                rows={2}
                className="w-full p-2.5 border border-red-200 rounded-lg text-sm placeholder-[#94A3B8] outline-none focus:border-red-400 resize-none bg-red-50/50"/>
              <div className="flex gap-2 mt-1.5">
                <button
                  onClick={() => { onFinding(item.id, findingText); setEditFinding(false); }}
                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-600 rounded-lg hover:bg-red-700">
                  Save Finding
                </button>
                {item.finding && (
                  <button onClick={() => setEditFinding(false)} className="px-3 py-1.5 border border-[#E2E8F0] text-xs text-[#64748B] rounded-lg">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
interface Props { onNavigate: (page: Page) => void; currentPage: Page; }

export default function TechnicianPage({ onNavigate, currentPage }: Props) {
  const [techStatus, setTechStatus]   = useState<TechStatus>('on-job');
  const [statusOpen, setStatusOpen]   = useState(false);
  const [activeJobIdx, setActiveJobIdx] = useState(0);
  const [tab, setTab]                 = useState<'checklist'|'asset'|'parts'|'labor'|'evidence'|'complete'>('checklist');
  const [jobStatus, setJobStatus]     = useState<'assigned'|'in-progress'|'paused'|'completed'>('in-progress');
  const [checklist, setChecklist]     = useState(CHECKLIST_ITEMS);
  const [resolutionNote, setResolutionNote] = useState('');
  const [qrMode, setQrMode]           = useState(false);
  const [jobSearch, setJobSearch]     = useState('');
  const [jobFilter, setJobFilter]     = useState<'today'|'upcoming'|'overdue'|'all'>('today');
  const [alertsDismissed, setAlertsDismissed] = useState<number[]>([]);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const isDetail = currentPage === 'technician-job-detail';
  const activeJob = JOBS[activeJobIdx];

  const setResult = (id: number, result: string|null) => {
    setChecklist(prev => prev.map(i => i.id===id ? {...i, result} : i));
  };
  const setFinding = (id: number, text: string) => {
    setChecklist(prev => prev.map(i => i.id===id ? {...i, finding:text} : i));
  };

  const done    = checklist.filter(i => i.result !== null).length;
  const failed  = checklist.filter(i => i.result === 'fail').length;
  const pct     = Math.round((done / checklist.length) * 100);

  const completionGates = [
    { label:'Required checklist completed',   ok: done === checklist.length },
    { label:'Resolution notes entered',        ok: resolutionNote.trim().length > 10 },
    { label:'Failed items have findings',      ok: checklist.filter(i=>i.result==='fail').every(i=>i.finding.length>0) },
    { label:'Parts consumption recorded',      ok: PARTS_DATA.some(p=>p.consumed>0) },
    { label:'Labor time recorded',             ok: jobStatus==='in-progress' || jobStatus==='paused' },
  ];
  const canComplete = completionGates.every(g => g.ok);

  const statusConf = TECH_STATUS_CONFIG[techStatus];

  // ─── QR SCANNER MOCK ──────────────────────────────────────────────────────
  if (qrMode) {
    return (
      <div className="flex flex-col min-h-full bg-[#0B1F3A]">
        <div className="px-4 py-4 flex items-center gap-3 border-b border-white/10">
          <button onClick={() => setQrMode(false)} className="text-white/60 hover:text-white p-1">
            <ArrowLeft size={20}/>
          </button>
          <div>
            <h2 className="text-sm font-700 text-white">Scan Asset QR / Barcode</h2>
            <p className="text-xs text-white/50">Point camera at asset QR code or barcode</p>
          </div>
        </div>
        {/* Simulated scanner frame */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
          <div className="relative w-56 h-56 border-2 border-white/30 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-black/40"/>
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#C9A227] rounded-tl-lg"/>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#C9A227] rounded-tr-lg"/>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#C9A227] rounded-bl-lg"/>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#C9A227] rounded-br-lg"/>
            <div className="absolute inset-0 flex items-center justify-center">
              <QrCode size={56} className="text-white/20"/>
            </div>
          </div>
          <p className="text-white/60 text-sm text-center">Scanning for asset QR code…</p>
          {/* Simulate a scanned result */}
          <div className="w-full max-w-sm bg-white rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F7EFCF] flex items-center justify-center flex-shrink-0">
                <Wrench size={18} className="text-[#C9A227]"/>
              </div>
              <div>
                <div className="text-sm font-700 text-[#172033]">HVAC Unit — Block A</div>
                <div className="text-xs text-[#94A3B8]">AST-0218 · Colombo HQ</div>
              </div>
              <span className="ml-auto text-[10px] font-600 px-2 py-1 bg-amber-50 text-amber-700 rounded-full">Under Maint.</span>
            </div>
            <div className="space-y-1.5 text-xs text-[#64748B] mb-4">
              <div className="flex justify-between"><span>Last Maintenance</span><span className="font-600 text-[#172033]">20 Jun 2026</span></div>
              <div className="flex justify-between"><span>Open Work Orders</span><span className="font-600 text-[#172033]">1 active</span></div>
              <div className="flex justify-between"><span>Warranty</span><span className="font-600 text-green-700">Valid — Jan 2027</span></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setQrMode(false); setActiveJobIdx(0); onNavigate('technician-job-detail'); }}
                className="flex-1 py-2.5 bg-[#0B1F3A] text-white text-xs font-600 rounded-lg hover:bg-[#102A43] transition-colors">
                Open Work Order
              </button>
              <button onClick={() => { setQrMode(false); onNavigate('asset-detail'); }}
                className="flex-1 py-2.5 border border-[#E2E8F0] text-[#64748B] text-xs font-500 rounded-lg hover:text-[#172033] transition-colors">
                View Asset
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── JOB DETAIL VIEW ──────────────────────────────────────────────────────
  if (isDetail) {
    return (
      <div className="flex flex-col min-h-full bg-[#F8FAFC]">

        {/* Job header — navy */}
        <div className="bg-[#0B1F3A] px-4 pt-4 pb-0 flex-shrink-0">
          <button onClick={() => onNavigate('technician')}
            className="flex items-center gap-1.5 text-white/60 text-xs mb-3 hover:text-white transition-colors">
            <ArrowLeft size={14}/>My Jobs
          </button>

          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-700 text-[#C9A227]">{activeJob.woId}</span>
                <span className={`text-[10px] font-600 px-1.5 py-0.5 rounded ${PRIORITY_STYLE[activeJob.priority]}`}>{activeJob.priority}</span>
              </div>
              <h2 className="text-sm font-700 text-white leading-snug">{activeJob.title}</h2>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-white/60 flex-wrap">
                <span className="flex items-center gap-1"><MapPin size={10}/>{activeJob.site}</span>
                <span className="flex items-center gap-1"><Wrench size={10}/>{activeJob.location}</span>
              </div>
            </div>
            <span className={`text-[11px] font-700 flex-shrink-0 ml-3 ${SLA_STYLE[activeJob.slaAt]}`}>
              {activeJob.slaAt==='breached'?'⚠ SLA BREACHED':`⏱ ${activeJob.sla}`}
            </span>
          </div>

          {/* Progress bar */}
          <div className="pb-3">
            <div className="flex justify-between text-[11px] text-white/50 mb-1">
              <span>Checklist — {done}/{checklist.length} items</span>
              <span>{pct}%{failed>0?` · ${failed} failing`:''}</span>
            </div>
            <div className="h-2 bg-white/15 rounded-full overflow-hidden">
              <div className="h-full bg-[#C9A227] rounded-full transition-all" style={{width:`${pct}%`}}/>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pb-4">
            {jobStatus === 'assigned' && (
              <button onClick={() => setJobStatus('in-progress')}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#C9A227] text-[#071426] text-sm font-700 rounded-xl hover:bg-[#D9B33F] transition-colors active:scale-95">
                <Play size={15}/>Start Work
              </button>
            )}
            {jobStatus === 'in-progress' && (
              <>
                <button onClick={() => setJobStatus('paused')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/15 text-white text-sm font-600 rounded-xl hover:bg-white/25 transition-colors active:scale-95">
                  <Pause size={14}/>Pause
                </button>
                <button onClick={() => { if(canComplete) setJobStatus('completed'); else setTab('complete'); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-700 rounded-xl transition-colors active:scale-95 ${
                    canComplete?'bg-green-600 text-white hover:bg-green-700':'bg-white/8 text-white/50 cursor-not-allowed'
                  }`}>
                  <CheckCircle size={15}/>Complete
                </button>
              </>
            )}
            {jobStatus === 'paused' && (
              <button onClick={() => setJobStatus('in-progress')}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#C9A227] text-[#071426] text-sm font-700 rounded-xl hover:bg-[#D9B33F] transition-colors active:scale-95">
                <Play size={15}/>Resume Work
              </button>
            )}
            {jobStatus === 'completed' && (
              <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600/20 text-green-400 text-sm font-700 rounded-xl border border-green-500/30">
                <CheckCircle size={15}/>Completed — Pending Review
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-0 overflow-x-auto -mx-4 px-4 pb-0 border-t border-white/10">
            {([
              { key:'checklist', icon:<CheckSquare size={13}/>, label:'Checklist' },
              { key:'asset',     icon:<Wrench size={13}/>,      label:'Asset'     },
              { key:'parts',     icon:<Package size={13}/>,     label:'Parts'     },
              { key:'labor',     icon:<Timer size={13}/>,       label:'Labor'     },
              { key:'evidence',  icon:<Camera size={13}/>,      label:'Evidence'  },
              { key:'complete',  icon:<CheckCircle size={13}/>, label:'Complete'  },
            ] as const).map(t=>(
              <button key={t.key} onClick={()=>setTab(t.key)}
                className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-500 border-b-2 whitespace-nowrap transition-colors flex-shrink-0 ${
                  tab===t.key?'border-[#C9A227] text-white':'border-transparent text-white/50 hover:text-white/80'
                }`}>
                {t.icon}{t.label}
                {t.key==='checklist' && failed>0 && (
                  <span className="bg-red-500 text-white text-[9px] font-700 rounded-full w-4 h-4 flex items-center justify-center">{failed}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4 pb-8">

          {/* CHECKLIST ───────────────────────────────────────────── */}
          {tab === 'checklist' && (
            <div className="space-y-3 max-w-2xl">
              {jobStatus === 'assigned' && (
                <div className="flex items-center gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                  <Info size={15} className="text-amber-600 flex-shrink-0"/>
                  <p className="text-sm text-amber-700">Click <strong>Start Work</strong> above before filling the checklist.</p>
                </div>
              )}
              {checklist.map(item => (
                <CheckItem key={item.id} item={item} onResult={setResult} onFinding={setFinding}/>
              ))}
            </div>
          )}

          {/* ASSET ────────────────────────────────────────────────── */}
          {tab === 'asset' && (
            <div className="max-w-lg space-y-4">
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F7EFCF] flex items-center justify-center flex-shrink-0">
                    <Wrench size={22} className="text-[#C9A227]"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-700 text-[#172033] leading-tight">{activeJob.asset}</h3>
                    <div className="text-xs text-[#94A3B8] mt-0.5">{activeJob.assetId} · {activeJob.category}</div>
                  </div>
                  <StatusBadge status="under-maintenance" variant="small"/>
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  {[
                    { label:'Site',           value:activeJob.site },
                    { label:'Location',       value:activeJob.location },
                    { label:'Last Maint.',    value:activeJob.lastMaint },
                    { label:'Next Scheduled', value:'15 Dec 2026' },
                    { label:'Warranty',       value:activeJob.warranty },
                    { label:'AMC',            value:'Active — Daikin Lanka' },
                  ].map(f=>(
                    <div key={f.label}>
                      <div className="text-[10px] text-[#94A3B8] uppercase tracking-wide mb-0.5">{f.label}</div>
                      <div className="text-xs font-600 text-[#172033]">{f.value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-5">
                  <button onClick={() => onNavigate('asset-detail')}
                    className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#64748B] hover:text-[#172033] hover:border-[#CBD5E1] font-500 transition-colors">
                    View Full Asset
                  </button>
                  <button onClick={() => setQrMode(true)}
                    className="flex items-center gap-2 px-4 py-2.5 border border-[#C9A227]/40 rounded-xl text-sm text-[#C9A227] font-600 hover:bg-[#F7EFCF] transition-colors">
                    <QrCode size={14}/>Asset QR
                  </button>
                </div>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
                <h4 className="text-xs font-700 text-[#172033] uppercase tracking-wider mb-3">Work Description</h4>
                <p className="text-sm text-[#64748B] leading-relaxed">{activeJob.description}</p>
              </div>
            </div>
          )}

          {/* PARTS ────────────────────────────────────────────────── */}
          {tab === 'parts' && (
            <div className="max-w-lg space-y-3">
              {PARTS_DATA.map((p, i) => (
                <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm font-700 text-[#172033]">{p.name}</div>
                      <div className="text-xs text-[#94A3B8]">{p.partNo}</div>
                    </div>
                    <StatusBadge status={p.status} variant="small"/>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center mb-3">
                    {[
                      { label:'Required', value:p.required, color:'text-[#172033]' },
                      { label:'Issued',   value:p.issued,   color:'text-blue-600'  },
                      { label:'Consumed', value:p.consumed, color:'text-amber-600' },
                      { label:'Returned', value:p.returned, color:'text-green-600' },
                    ].map(s=>(
                      <div key={s.label} className="bg-[#F8FAFC] rounded-lg py-2">
                        <div className={`text-lg font-800 leading-none ${s.color}`}>{s.value}</div>
                        <div className="text-[10px] text-[#94A3B8] mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 text-xs font-600 bg-[#F1F5F9] text-[#64748B] rounded-lg hover:bg-amber-50 hover:text-amber-700 transition-colors">
                      Record Use
                    </button>
                    <button className="flex-1 py-2 text-xs font-600 bg-[#F1F5F9] text-[#64748B] rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors">
                      Return
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full py-4 border-2 border-dashed border-[#E2E8F0] rounded-xl text-sm text-[#64748B] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors flex items-center justify-center gap-2 font-500">
                <Plus size={16}/> Request Additional Part
              </button>
            </div>
          )}

          {/* LABOR ────────────────────────────────────────────────── */}
          {tab === 'labor' && (
            <div className="max-w-lg space-y-4">
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
                <h4 className="text-xs font-700 text-[#172033] uppercase tracking-wider mb-4">Active Labor Session</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-5">
                  {[
                    { label:'Start Time',   value:'09:15' },
                    { label:'Status',       value:jobStatus==='paused'?'Paused':'Running' },
                    { label:'Elapsed Time', value:<ElapsedTimer startTime="09:15"/> },
                    { label:'Technician',   value:'Field Technician' },
                  ].map(f=>(
                    <div key={f.label as string}>
                      <div className="text-[10px] text-[#94A3B8] uppercase tracking-wide mb-0.5">{f.label}</div>
                      <div className="text-sm font-700 text-[#172033]">{f.value}</div>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-[#F1F5F9] mb-4"/>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-800 text-[#0B1F3A]">1h 14m</div>
                    <div className="text-xs text-[#94A3B8]">Total Labor Time</div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-sm text-[#64748B] hover:text-[#172033] transition-colors font-500">
                    <Plus size={14}/> Add Entry
                  </button>
                </div>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-xs font-700 text-[#172033]">Labor Log</span>
                </div>
                <div className="divide-y divide-[#F8FAFC]">
                  {[
                    { type:'Start',  time:'09:15', notes:'Job started, safety check complete' },
                    { type:'Pause',  time:'09:45', notes:'Waiting for parts — refrigerant R410A' },
                    { type:'Resume', time:'10:12', notes:'Parts received, continuing diagnosis' },
                  ].map((e,i)=>(
                    <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                      <span className={`text-[10px] font-700 px-2 py-1 rounded flex-shrink-0 ${
                        e.type==='Start'?'bg-green-100 text-green-700':
                        e.type==='Pause'?'bg-amber-100 text-amber-700':
                        'bg-blue-100 text-blue-700'
                      }`}>{e.type}</span>
                      <span className="text-xs font-600 text-[#172033] flex-shrink-0">{e.time}</span>
                      <span className="text-xs text-[#64748B] truncate">{e.notes}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EVIDENCE ────────────────────────────────────────────── */}
          {tab === 'evidence' && (
            <div className="max-w-lg space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Existing photo placeholder */}
                <div className="aspect-square bg-[#F1F5F9] rounded-xl border border-[#E2E8F0] flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute top-2 left-2 bg-white/90 text-[10px] font-600 text-[#172033] px-2 py-0.5 rounded-full">Before</div>
                  <Camera size={28} className="text-[#94A3B8] mb-1"/>
                  <span className="text-xs text-[#94A3B8]">Photo 1</span>
                </div>
                {/* Add photo */}
                <button className="aspect-square bg-[#F8FAFC] rounded-xl border-2 border-dashed border-[#E2E8F0] flex flex-col items-center justify-center hover:border-[#C9A227] hover:text-[#C9A227] hover:bg-[#F7EFCF]/30 transition-colors text-[#94A3B8] group">
                  <Camera size={28} className="mb-1 group-hover:text-[#C9A227] transition-colors"/>
                  <span className="text-xs">Add Photo</span>
                </button>
              </div>

              {/* Resolution notes */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
                <label className="block text-xs font-700 text-[#172033] uppercase tracking-wide mb-2">
                  Resolution Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={resolutionNote}
                  onChange={e=>setResolutionNote(e.target.value)}
                  placeholder="Describe the work performed, findings, and resolution…"
                  rows={4}
                  className="w-full p-3 border border-[#E2E8F0] rounded-xl text-sm placeholder-[#94A3B8] outline-none focus:border-[#C9A227] resize-none transition-colors"/>
                <div className="text-[10px] text-[#94A3B8] mt-1">{resolutionNote.length} characters (min. 10 required)</div>
              </div>

              {/* Attachments */}
              <button className="w-full py-4 border-2 border-dashed border-[#E2E8F0] rounded-xl text-sm text-[#64748B] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors flex items-center justify-center gap-2 font-500">
                <FileText size={16}/>Attach Document / Report
              </button>
            </div>
          )}

          {/* COMPLETE ────────────────────────────────────────────── */}
          {tab === 'complete' && (
            <div className="max-w-lg space-y-4">
              <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <h4 className="text-sm font-700 text-[#172033]">Completion Checklist</h4>
                  <p className="text-xs text-[#64748B] mt-0.5">All items must be satisfied before completing this work order.</p>
                </div>
                <div className="divide-y divide-[#F8FAFC]">
                  {completionGates.map((g, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${g.ok?'bg-green-500':'bg-[#F1F5F9]'}`}>
                        {g.ok
                          ? <CheckCircle size={14} className="text-white"/>
                          : <span className="text-xs text-[#94A3B8] font-600">{i+1}</span>
                        }
                      </div>
                      <span className={`text-sm flex-1 ${g.ok?'text-[#172033]':'text-[#94A3B8]'}`}>{g.label}</span>
                      {!g.ok && (
                        <button onClick={()=>setTab(
                          i===0?'checklist':i===1||i===2?'evidence':i===3?'parts':'labor'
                        )} className="text-[11px] text-[#C9A227] font-600 hover:text-[#a8841e]">
                          Go →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                disabled={!canComplete}
                onClick={()=>setJobStatus('completed')}
                className={`w-full py-4 rounded-xl text-base font-700 transition-all flex items-center justify-center gap-3 ${
                  canComplete
                    ?'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20 active:scale-95'
                    :'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed'
                }`}>
                <CheckCircle size={20}/>
                {canComplete ? 'Complete Work Order' : `${completionGates.filter(g=>!g.ok).length} items remaining`}
              </button>

              {jobStatus === 'completed' && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0"/>
                  <div>
                    <div className="text-sm font-700 text-green-700">Work Order Completed</div>
                    <div className="text-xs text-green-600">Pending supervisor review and sign-off.</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── WORKSPACE HOME (default view) ────────────────────────────────────────
  const inProgressJob = JOBS.find(j=>j.status==='in-progress');
  const overdueJobs   = JOBS.filter(j=>j.slaAt==='breached');
  const visibleAlerts = ALERTS_DATA.filter((_,i)=>!alertsDismissed.includes(i));

  const filteredJobs = JOBS.filter(j => {
    if (jobSearch && !j.asset.toLowerCase().includes(jobSearch.toLowerCase()) && !j.woId.toLowerCase().includes(jobSearch.toLowerCase())) return false;
    if (jobFilter === 'overdue' && j.slaAt !== 'breached') return false;
    if (jobFilter === 'upcoming' && (j.status === 'completed' || j.status === 'in-progress')) return false;
    return true;
  });

  return (
    <div className="flex flex-col min-h-full">
      {/* ══ HERO HEADER ══════════════════════════════════════════════════ */}
      <div className="bg-[#0B1F3A] border-b-2 border-[#C9A227]/40">
        <div className="px-4 sm:px-5 pt-4 pb-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#C9A227]/20 border border-[#C9A227]/30 flex items-center justify-center flex-shrink-0">
                <Wrench size={17} className="text-[#C9A227]"/>
              </div>
              <div>
                <h1 className="text-base font-700 text-white leading-tight">Technician Workspace</h1>
                <p className="text-xs text-white/50 mt-0.5">Shift: Mon 29 Sep · 07:00 – 17:00</p>
              </div>
            </div>

            {/* Status toggle */}
            <div className="relative flex-shrink-0">
              <button onClick={()=>setShowStatusMenu(p=>!p)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-600 transition-colors ${statusConf.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`}/>
                {statusConf.label}
              </button>
              {showStatusMenu && (
                <div className="absolute right-0 top-full mt-1.5 bg-white border border-[#E2E8F0] rounded-xl shadow-lg py-1.5 z-50 w-40">
                  {(Object.keys(TECH_STATUS_CONFIG) as TechStatus[]).map(s=>(
                    <button key={s} onClick={()=>{setTechStatus(s);setShowStatusMenu(false);}}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs hover:bg-[#F8FAFC] transition-colors ${techStatus===s?'font-700 text-[#0B1F3A]':'text-[#64748B]'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${TECH_STATUS_CONFIG[s].dot}`}/>
                      {TECH_STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { label:'Assigned',    value:JOBS.length,       color:'text-white'        },
              { label:'Due Today',   value:2,                  color:'text-amber-300'    },
              { label:'In Progress', value:1,                  color:'text-[#C9A227]'    },
              { label:'Completed',   value:0,                  color:'text-green-400'    },
              { label:'Overdue',     value:overdueJobs.length, color:'text-red-400'      },
              { label:'SLA At Risk', value:1,                  color:'text-orange-400'   },
            ].map(k=>(
              <div key={k.label} className="bg-white/8 border border-white/10 rounded-xl px-3 py-2.5 text-center">
                <div className={`text-xl font-800 leading-none ${k.color}`}>{k.value}</div>
                <div className="text-[10px] text-white/50 mt-1 leading-tight">{k.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-5 space-y-4 max-w-4xl w-full mx-auto lg:max-w-none">

        {/* ── ALERTS ─────────────────────────────────────────────── */}
        {visibleAlerts.length > 0 && (
          <div className="space-y-2">
            {visibleAlerts.map((a, i) => {
              const realIdx = ALERTS_DATA.indexOf(a);
              const conf = a.severity==='high'?{bg:'bg-red-50 border-red-200',icon:'text-red-500',text:'text-red-700'}
                :a.severity==='medium'?{bg:'bg-amber-50 border-amber-200',icon:'text-amber-500',text:'text-amber-700'}
                :{bg:'bg-blue-50 border-blue-200',icon:'text-blue-500',text:'text-blue-700'};
              return (
                <div key={i} className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${conf.bg}`}>
                  <Bell size={14} className={`flex-shrink-0 mt-0.5 ${conf.icon}`}/>
                  <p className={`flex-1 text-sm ${conf.text}`}>{a.msg}</p>
                  <button onClick={()=>setAlertsDismissed(p=>[...p,realIdx])}
                    className={`flex-shrink-0 ${conf.icon} hover:opacity-70`}><X size={14}/></button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── CURRENT JOB ──────────────────────────────────────── */}
        {inProgressJob && (
          <div className={`bg-[#0B1F3A] rounded-2xl overflow-hidden border-2 ${
            inProgressJob.slaAt==='breached'?'border-red-500/50':
            inProgressJob.slaAt==='at-risk'?'border-[#C9A227]/50':'border-[#C9A227]/20'
          }`}>
            <div className="px-5 py-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-700 text-[#C9A227] uppercase tracking-wide">Current Job</span>
                    <span className={`text-[10px] font-600 px-1.5 py-0.5 rounded ${PRIORITY_STYLE[inProgressJob.priority]}`}>
                      {inProgressJob.priority}
                    </span>
                  </div>
                  <div className="text-xs font-700 text-white/60 mb-0.5">{inProgressJob.woId}</div>
                  <h3 className="text-sm font-700 text-white leading-snug">{inProgressJob.title}</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-white/50 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin size={10}/>{inProgressJob.site}</span>
                    <span className="flex items-center gap-1"><Wrench size={10}/>{inProgressJob.location}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <div className={`text-sm font-800 ${SLA_STYLE[inProgressJob.slaAt]}`}>
                    {inProgressJob.slaAt==='breached'?'SLA BREACHED':inProgressJob.sla}
                  </div>
                  <div className="text-[10px] text-white/40 mt-0.5">SLA Resolution</div>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-[11px] text-white/50 mb-1.5">
                  <span>Checklist progress</span>
                  <span>{done}/{checklist.length} · {pct}%</span>
                </div>
                <div className="h-2.5 bg-white/15 rounded-full overflow-hidden">
                  <div className="h-full bg-[#C9A227] rounded-full transition-all" style={{width:`${pct}%`}}/>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={()=>{ setActiveJobIdx(0); onNavigate('technician-job-detail'); setTab('checklist'); }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#C9A227] text-[#071426] text-sm font-700 rounded-xl hover:bg-[#D9B33F] transition-colors active:scale-95">
                  <Play size={15}/>Continue Work
                </button>
                <button onClick={()=>setQrMode(true)}
                  className="flex items-center gap-2 px-4 py-3 bg-white/10 text-white text-sm rounded-xl hover:bg-white/20 transition-colors">
                  <QrCode size={16}/>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MY JOBS ──────────────────────────────────────────── */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
            <div className="flex items-center gap-2">
              <ClipboardList size={14} className="text-[#0B1F3A]"/>
              <span className="text-sm font-700 text-[#172033]">My Jobs</span>
              <span className="text-[10px] bg-[#F1F5F9] text-[#64748B] px-1.5 py-0.5 rounded-full font-600">{JOBS.length}</span>
            </div>
          </div>

          {/* Search + filter row */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#F8FAFC]">
            <div className="flex items-center gap-2 flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 focus-within:border-[#C9A227] transition-colors">
              <Search size={13} className="text-[#94A3B8] flex-shrink-0"/>
              <input value={jobSearch} onChange={e=>setJobSearch(e.target.value)}
                placeholder="Search work orders..."
                className="bg-transparent text-sm text-[#172033] placeholder-[#94A3B8] outline-none flex-1 min-w-0"/>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              {(['today','upcoming','overdue','all'] as const).map(f=>(
                <button key={f} onClick={()=>setJobFilter(f)}
                  className={`px-2.5 py-1.5 text-[10px] font-600 rounded-lg capitalize transition-colors ${
                    jobFilter===f?'bg-[#0B1F3A] text-white':'text-[#64748B] hover:bg-[#F1F5F9]'
                  }`}>{f}</button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-[#F8FAFC]">
            {filteredJobs.map((job, i) => (
              <div key={i}
                onClick={()=>{ setActiveJobIdx(JOBS.indexOf(job)); onNavigate('technician-job-detail'); setTab('checklist'); }}
                className={`px-5 py-4 cursor-pointer hover:bg-[#F8FAFC] transition-colors ${
                  job.status==='in-progress'?'border-l-4 border-[#C9A227]':
                  job.slaAt==='breached'?'border-l-4 border-red-500 bg-red-50/20':'border-l-4 border-transparent'
                }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[11px] font-700 text-[#0B1F3A]">{job.woId}</span>
                      <span className={`text-[9px] font-600 px-1.5 py-0.5 rounded ${PRIORITY_STYLE[job.priority]}`}>{job.priority}</span>
                      {job.status==='in-progress' && (
                        <span className="text-[9px] font-700 px-1.5 py-0.5 bg-[#F7EFCF] text-[#7a6015] rounded">Active</span>
                      )}
                    </div>
                    <div className="text-sm font-600 text-[#172033] leading-snug">{job.title}</div>
                  </div>
                  <span className={`text-xs font-700 flex-shrink-0 ml-2 ${SLA_STYLE[job.slaAt]}`}>
                    {job.slaAt==='breached'?'⚠ BREACHED':job.sla}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#64748B] mb-3 flex-wrap">
                  <span className="flex items-center gap-1"><MapPin size={10}/>{job.site}</span>
                  <span className="flex items-center gap-1"><Clock size={10}/>{job.scheduledTime}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full bg-[#C9A227] rounded-full"
                      style={{width:`${(job.checklistDone/job.checklistTotal)*100}%`}}/>
                  </div>
                  <span className="text-[11px] text-[#64748B] flex-shrink-0">
                    {job.checklistDone}/{job.checklistTotal}
                  </span>
                  <StatusBadge status={job.status} variant="small"/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── QUICK ACTIONS ──────────────────────────────────────── */}
        <div className="bg-[#0B1F3A] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={14} className="text-[#C9A227]"/>
            <h2 className="text-sm font-700 text-white">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {([
              { label:'Scan Asset QR',  icon:<QrCode size={18}/>,      primary:true,  action:()=>setQrMode(true)                    },
              { label:'View My Jobs',   icon:<ClipboardList size={18}/>,primary:true,  action:()=>onNavigate('work-orders')          },
              { label:'Start Work',     icon:<Play size={18}/>,         primary:false, action:()=>{ setActiveJobIdx(0); onNavigate('technician-job-detail'); } },
              { label:'Request Part',   icon:<Package size={18}/>,      primary:false, action:()=>onNavigate('inventory-parts')      },
              { label:'Add Inspection', icon:<CheckSquare size={18}/>,  primary:false, action:()=>onNavigate('inspections')          },
              { label:'Add Note',       icon:<StickyNote size={18}/>,   primary:false, action:()=>{}                                 },
            ]).map((a,i)=>(
              <button key={i} onClick={a.action}
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

// needed by App.tsx for the ClipboardList import
function ClipboardList(props: { size: number; className?: string }) {
  return (
    <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      className={props.className}>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>
    </svg>
  );
}
