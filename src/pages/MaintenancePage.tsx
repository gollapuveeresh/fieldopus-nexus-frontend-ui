import { useState } from 'react';
import { Plus, Calendar, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import FilterBar from '../components/ui/FilterBar';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import KpiCard from '../components/ui/KpiCard';
import type { Page } from '../types';

const TABS_MAP: Record<string, string> = {
  maintenance: 'overview',
  'maintenance-plans': 'plans',
  'maintenance-schedules': 'schedules',
  'maintenance-calendar': 'calendar',
};

const PLANS = [
  { id: 'MP-0041', name: 'HVAC Quarterly Service', asset: 'HVAC Units (All)', frequency: 'Quarterly', nextDue: '15 Oct 2026', checklist: 'HVAC-QS-v3', status: 'scheduled', assigned: 'HVAC Team' },
  { id: 'MP-0042', name: 'Generator Monthly Check', asset: 'Generators (All)', frequency: 'Monthly', nextDue: '30 Sep 2026', checklist: 'GEN-MC-v2', status: 'due', assigned: 'Electrical Team' },
  { id: 'MP-0043', name: 'Fire System Annual Inspection', asset: 'Fire Panels (All)', frequency: 'Annual', nextDue: '10 Oct 2026', checklist: 'FIRE-AI-v4', status: 'scheduled', assigned: 'Safety Team' },
  { id: 'MP-0044', name: 'Elevator Monthly Safety Check', asset: 'Elevators (All)', frequency: 'Monthly', nextDue: '29 Sep 2026', checklist: 'ELEV-MS-v2', status: 'overdue', assigned: 'Lift Team' },
  { id: 'MP-0045', name: 'UPS Battery Inspection', asset: 'UPS Systems (All)', frequency: 'Quarterly', nextDue: '05 Oct 2026', checklist: 'UPS-BI-v1', status: 'scheduled', assigned: 'Electrical Team' },
  { id: 'MP-0046', name: 'Water Treatment Monthly', asset: 'Cooling Towers', frequency: 'Monthly', nextDue: '01 Oct 2026', checklist: 'WT-MM-v1', status: 'due', assigned: 'Mechanical Team' },
];

const planCols = [
  { key: 'id', label: 'Plan ID', render: (r: any) => <span className="font-500 text-[#0B1F3A]">{r.id}</span> },
  { key: 'name', label: 'Plan Name', render: (r: any) => <div>
    <div className="font-500 text-[#172033]">{r.name}</div>
    <div className="text-xs text-[#64748B]">{r.checklist}</div>
  </div>},
  { key: 'asset', label: 'Asset / Group', render: (r: any) => <span className="text-sm text-[#64748B]">{r.asset}</span> },
  { key: 'frequency', label: 'Frequency', render: (r: any) => <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-500">{r.frequency}</span> },
  { key: 'nextDue', label: 'Next Due', render: (r: any) => (
    <span className={`text-sm font-500 ${r.status === 'overdue' ? 'text-red-600' : r.status === 'due' ? 'text-amber-600' : 'text-[#64748B]'}`}>
      {r.status === 'overdue' && <AlertTriangle size={12} className="inline mr-1" />}
      {r.nextDue}
    </span>
  )},
  { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
  { key: 'assigned', label: 'Assigned To', render: (r: any) => <span className="text-sm text-[#64748B]">{r.assigned}</span> },
];

const WORKFLOW = ['Scheduled', 'Due', 'Generated', 'Assigned', 'Completed', 'Verified', 'Next Cycle'];

// Simple calendar data
const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
const pmEvents: Record<number, { label: string; color: string }[]> = {
  1: [{ label: 'Water Treatment', color: 'bg-blue-100 text-blue-700' }],
  5: [{ label: 'UPS Inspection', color: 'bg-purple-100 text-purple-700' }],
  10: [{ label: 'Fire Inspection', color: 'bg-orange-100 text-orange-700' }],
  15: [{ label: 'HVAC Quarterly', color: 'bg-[#F7EFCF] text-amber-700' }],
  18: [{ label: 'Chiller Service', color: 'bg-teal-100 text-teal-700' }],
  29: [{ label: 'Elevator Check', color: 'bg-red-100 text-red-700' }],
  30: [{ label: 'Generator Check', color: 'bg-amber-100 text-amber-700' }],
};

interface Props { onNavigate: (page: Page) => void; currentPage: Page; }

export default function MaintenancePage({ onNavigate, currentPage }: Props) {
  const [search, setSearch] = useState('');
  const activeSub = TABS_MAP[currentPage] ?? 'overview';

  return (
    <div>
      <PageHeader
        title="Maintenance"
        subtitle="Preventive maintenance plans, schedules and compliance tracking"
        tabs={[
          { label: 'Overview', value: 'overview' },
          { label: 'Plans', value: 'plans' },
          { label: 'Schedules', value: 'schedules' },
          { label: 'PM Calendar', value: 'calendar' },
        ]}
        activeTab={activeSub}
        onTabChange={v => {
          const map: Record<string, Page> = {
            overview: 'maintenance',
            plans: 'maintenance-plans',
            schedules: 'maintenance-schedules',
            calendar: 'maintenance-calendar',
          };
          onNavigate(map[v]);
        }}
        actions={
          <button className="flex items-center gap-2 px-3 py-2 bg-[#0B1F3A] rounded text-xs text-white font-500 hover:bg-[#102A43] transition-colors">
            <Plus size={13} /> New Plan
          </button>
        }
      />

      <div className="p-6">
        {activeSub === 'overview' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <KpiCard title="Active Plans" value="28" icon={<CheckCircle size={14} />} />
              <KpiCard title="Due This Week" value="6" icon={<Calendar size={14} />} accent />
              <KpiCard title="Overdue" value="3" icon={<AlertTriangle size={14} />} alert />
              <KpiCard title="PM Compliance" value="94%" subtitle="vs 90% target" icon={<CheckCircle size={14} />} trend={{ value: '+3% vs last month', direction: 'up', positive: true }} />
            </div>

            {/* PM Workflow */}
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 mb-6">
              <h3 className="text-sm font-600 text-[#172033] mb-4">PM Lifecycle Workflow</h3>
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {WORKFLOW.map((step, i) => (
                  <div key={step} className="flex items-center gap-1 flex-shrink-0">
                    <div className={`px-4 py-2.5 rounded-lg border text-xs font-500 flex items-center gap-2 ${
                      i === 4 ? 'bg-[#C9A227] border-[#C9A227] text-[#071426]' :
                      i < 4 ? 'bg-[#0B1F3A] border-[#0B1F3A] text-white' :
                      'bg-white border-[#E2E8F0] text-[#64748B]'
                    }`}>
                      <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-700 ${
                        i === 4 ? 'bg-[#071426] text-[#C9A227]' :
                        i < 4 ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#94A3B8]'
                      }`}>{i + 1}</span>
                      {step}
                    </div>
                    {i < WORKFLOW.length - 1 && <ChevronRight size={12} className="text-[#CBD5E1]" />}
                  </div>
                ))}
              </div>
            </div>

            <DataTable
              columns={planCols}
              data={PLANS}
              onRowClick={() => {}}
              emptyMessage="No maintenance plans"
            />
          </>
        )}

        {activeSub === 'plans' && (
          <>
            <FilterBar search={search} onSearch={setSearch} searchPlaceholder="Search plans..." onAdd={() => {}} addLabel="New Plan" />
            <DataTable
              columns={planCols}
              data={PLANS.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))}
              onRowClick={() => {}}
              emptyMessage="No plans found"
            />
          </>
        )}

        {activeSub === 'schedules' && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
            <h3 className="text-sm font-600 text-[#172033] mb-4">Scheduled Maintenance — October 2026</h3>
            <div className="space-y-2">
              {PLANS.map((plan, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                  <div className="w-12 text-center">
                    <div className="text-lg font-700 text-[#0B1F3A]">{plan.nextDue.split(' ')[0]}</div>
                    <div className="text-xs text-[#64748B]">{plan.nextDue.split(' ')[1]}</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-500 text-[#172033]">{plan.name}</div>
                    <div className="text-xs text-[#64748B]">{plan.asset} · {plan.assigned}</div>
                  </div>
                  <StatusBadge status={plan.status} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSub === 'calendar' && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-600 text-[#172033]">October 2026</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 border border-[#E2E8F0] rounded text-xs text-[#64748B] hover:bg-[#F1F5F9]">← Sep</button>
                <button className="px-3 py-1.5 border border-[#E2E8F0] rounded text-xs text-[#64748B] hover:bg-[#F1F5F9]">Nov →</button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <div key={d} className="text-center text-xs font-600 text-[#64748B] py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {/* Oct 2026 starts on Thursday (index 3) */}
              {[0, 1, 2].map(i => <div key={`empty-${i}`} />)}
              {calendarDays.map(day => (
                <div
                  key={day}
                  className={`min-h-16 p-1.5 rounded border text-xs ${
                    day === 29 ? 'border-[#172033] bg-[#F8FAFC]' :
                    pmEvents[day] ? 'border-[#C9A227]/30 bg-[#F7EFCF]/20' :
                    'border-[#E2E8F0]'
                  }`}
                >
                  <div className={`font-600 mb-1 ${day === 29 ? 'text-[#0B1F3A]' : 'text-[#64748B]'}`}>{day}</div>
                  {pmEvents[day]?.map((ev, i) => (
                    <div key={i} className={`text-[10px] px-1 py-0.5 rounded truncate font-500 ${ev.color}`}>
                      {ev.label}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
