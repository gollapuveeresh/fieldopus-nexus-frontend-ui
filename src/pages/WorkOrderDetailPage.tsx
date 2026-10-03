import { useState } from 'react';
import { Clock, AlertTriangle, CheckCircle, User, MapPin, Wrench, FileText, Package, ChevronRight } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import PageHeader from '../components/ui/PageHeader';
import type { Page } from '../types';

const TABS = [
  { label: 'Overview', value: 'overview' },
  { label: 'Checklist', value: 'checklist' },
  { label: 'Labor', value: 'labor' },
  { label: 'Parts', value: 'parts' },
  { label: 'Attachments', value: 'attachments' },
  { label: 'SLA', value: 'sla' },
  { label: 'Activity', value: 'activity' },
];

const WORKFLOW = ['Draft', 'Planned', 'Assigned', 'Dispatched', 'In Progress', 'On Hold', 'Completed', 'Review', 'Closed'];

const checklistItems = [
  { question: 'Isolate power supply and confirm lockout/tagout', result: 'pass' },
  { question: 'Inspect air filters — record condition', result: 'pass' },
  { question: 'Clean evaporator coils', result: 'pass' },
  { question: 'Check refrigerant pressure (R410A)', result: 'fail', finding: 'Low refrigerant pressure — 85 PSI (expected 115–125 PSI). Top up required.' },
  { question: 'Inspect electrical connections and capacitors', result: null },
  { question: 'Test thermostat calibration', result: null },
  { question: 'Record unit running current (amps)', result: null },
  { question: 'Conduct 10-minute test run and verify temperatures', result: null },
];

interface Props { onNavigate: (page: Page) => void; }

export default function WorkOrderDetailPage({ onNavigate }: Props) {
  const [tab, setTab] = useState('overview');
  const currentStep = 4;

  return (
    <div>
      <PageHeader
        title="WO-2024-0851"
        subtitle="Corrective Maintenance · HVAC Unit — Block A · Colombo HQ"
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status="in-progress" />
            <button className="px-3 py-2 border border-amber-300 text-amber-700 bg-amber-50 rounded text-xs font-500 hover:bg-amber-100 transition-colors">
              Place On Hold
            </button>
            <button className="px-3 py-2 bg-green-700 text-white rounded text-xs font-500 hover:bg-green-800 transition-colors">
              Mark Complete
            </button>
          </div>
        }
      />

      {/* SLA bar */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs text-amber-700 font-500">
          <Clock size={13} />
          SLA Response: <span className="font-700">00:42 remaining</span>
        </div>
        <div className="h-3 w-px bg-amber-200" />
        <div className="flex items-center gap-2 text-xs text-amber-700">
          SLA Resolution: <span className="font-700">03:18 remaining</span>
        </div>
        <div className="h-3 w-px bg-amber-200" />
        <span className="text-xs text-amber-600">Priority: <strong>High</strong></span>
      </div>

      {/* Workflow */}
      <div className="bg-white border-b border-[#E2E8F0] px-6 py-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          {WORKFLOW.map((step, i) => (
            <div key={step} className="flex items-center gap-1 flex-shrink-0">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-500 ${
                i < currentStep ? 'bg-[#0B1F3A] text-white' :
                i === currentStep ? 'bg-[#C9A227] text-[#071426]' :
                'bg-[#F1F5F9] text-[#94A3B8]'
              }`}>
                {i < currentStep && <CheckCircle size={11} />}
                {step}
              </div>
              {i < WORKFLOW.length - 1 && <ChevronRight size={12} className="text-[#CBD5E1]" />}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              {/* WO Info */}
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
                <h3 className="text-sm font-600 text-[#172033] mb-4">Work Order Details</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  {[
                    { label: 'WO Number', value: 'WO-2024-0851' },
                    { label: 'Work Type', value: 'Corrective Maintenance' },
                    { label: 'Source', value: 'Service Request SR-2024-1189' },
                    { label: 'Asset', value: 'HVAC Unit — Block A (AST-0218)' },
                    { label: 'Site', value: 'Colombo HQ' },
                    { label: 'Zone', value: 'Zone A — Level 3' },
                    { label: 'Scheduled Start', value: '29 Sep 2026 09:00' },
                    { label: 'Scheduled End', value: '29 Sep 2026 12:00' },
                    { label: 'Created By', value: 'J. Mitchell (Operations)' },
                    { label: 'Created At', value: '28 Sep 2026 16:42' },
                  ].map(f => (
                    <div key={f.label}>
                      <div className="text-xs text-[#94A3B8] uppercase tracking-wide mb-0.5">{f.label}</div>
                      <div className="text-sm text-[#172033] font-500">{f.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
                  <div className="text-xs text-[#94A3B8] uppercase tracking-wide mb-1">Instructions</div>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    Investigate reported reduction in cooling capacity for Block A. HVAC unit has been running at reduced output since 26 Sep. Perform full diagnostic including refrigerant pressure check, coil inspection, and capacitor test. Replace any faulty components. Document findings and obtain supervisor sign-off.
                  </p>
                </div>
              </div>

              {/* Assignment */}
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
                <h3 className="text-sm font-600 text-[#172033] mb-4">Assignment</h3>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#0B1F3A] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#C9A227] text-sm font-700">TS</span>
                  </div>
                  <div>
                    <div className="text-sm font-600 text-[#172033]">Tariq Sharma</div>
                    <div className="text-xs text-[#64748B]">Senior HVAC Technician · T-0012</div>
                    <div className="text-xs text-[#64748B]">Dispatched: 29 Sep 2026 08:47 · Started: 09:15</div>
                  </div>
                  <div className="ml-auto">
                    <StatusBadge status="in-progress" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
                <h3 className="text-xs font-600 text-[#172033] uppercase tracking-wide mb-3">Checklist Progress</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full">
                    <div className="h-2 bg-[#C9A227] rounded-full" style={{ width: '37.5%' }} />
                  </div>
                  <span className="text-xs font-600 text-[#172033]">3 / 8</span>
                </div>
                <div className="text-xs text-[#64748B]">1 finding recorded</div>
                <button
                  onClick={() => setTab('checklist')}
                  className="mt-3 w-full py-1.5 text-xs text-[#C9A227] border border-[#C9A227]/30 rounded hover:bg-[#C9A227]/5 font-500 transition-colors"
                >
                  View Checklist →
                </button>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
                <h3 className="text-xs font-600 text-[#172033] uppercase tracking-wide mb-3">Parts Required</h3>
                {[
                  { part: 'Air Filter (HEPA)', qty: 2, status: 'issued' },
                  { part: 'Refrigerant R410A', qty: 1, status: 'reserved' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0">
                    <div>
                      <div className="text-xs font-500 text-[#172033]">{p.part}</div>
                      <div className="text-[10px] text-[#64748B]">Qty: {p.qty}</div>
                    </div>
                    <StatusBadge status={p.status} variant="small" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'checklist' && (
          <div className="max-w-2xl">
            <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
                <div>
                  <div className="text-sm font-600 text-[#172033]">Maintenance Checklist</div>
                  <div className="text-xs text-[#64748B]">HVAC Quarterly Service — 8 items</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 bg-[#F1F5F9] rounded-full">
                    <div className="h-2 bg-[#C9A227] rounded-full" style={{ width: '37.5%' }} />
                  </div>
                  <span className="text-xs font-600 text-[#172033]">3/8</span>
                </div>
              </div>
              <div className="divide-y divide-[#F1F5F9]">
                {checklistItems.map((item, i) => (
                  <div key={i} className={`px-5 py-4 ${item.result === 'fail' ? 'bg-red-50/50' : ''}`}>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#F1F5F9] text-[#64748B] text-xs flex items-center justify-center flex-shrink-0 font-600 mt-0.5">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-[#172033]">{item.question}</p>
                        {item.finding && (
                          <div className="mt-2 flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                            <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
                            {item.finding}
                          </div>
                        )}
                      </div>
                      {item.result ? (
                        <div className={`px-2 py-1 rounded text-xs font-600 ${
                          item.result === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.result === 'pass' ? '✓ Pass' : '✗ Fail'}
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button className="px-2 py-1 bg-[#F1F5F9] text-[#64748B] text-xs rounded hover:bg-green-100 hover:text-green-700 transition-colors">Pass</button>
                          <button className="px-2 py-1 bg-[#F1F5F9] text-[#64748B] text-xs rounded hover:bg-red-100 hover:text-red-700 transition-colors">Fail</button>
                          <button className="px-2 py-1 bg-[#F1F5F9] text-[#64748B] text-xs rounded hover:bg-[#E2E8F0] transition-colors">N/A</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'activity' && (
          <div className="max-w-2xl bg-white border border-[#E2E8F0] rounded-lg p-5">
            <h3 className="text-sm font-600 text-[#172033] mb-4">Activity Log</h3>
            <div className="space-y-4">
              {[
                { user: 'T. Sharma', action: 'Updated checklist — 3 items completed, 1 finding recorded', time: '29 Sep 2026 10:48', type: 'checklist' },
                { user: 'T. Sharma', action: 'Started work order execution', time: '29 Sep 2026 09:15', type: 'status' },
                { user: 'J. Mitchell', action: 'Dispatched to Tariq Sharma', time: '29 Sep 2026 08:47', type: 'dispatch' },
                { user: 'J. Mitchell', action: 'Assigned to Tariq Sharma (HVAC Technician)', time: '28 Sep 2026 17:05', type: 'assign' },
                { user: 'System', action: 'Work order moved from Draft to Planned', time: '28 Sep 2026 16:42', type: 'status' },
                { user: 'J. Mitchell', action: 'Created work order from SR-2024-1189', time: '28 Sep 2026 16:42', type: 'create' },
              ].map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0B1F3A] flex items-center justify-center flex-shrink-0">
                    <span className="text-[#C9A227] text-[8px] font-700">
                      {event.user === 'System' ? 'SY' : event.user.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-600 text-[#172033]">{event.user}</span>
                    <span className="text-xs text-[#64748B]"> {event.action}</span>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5">{event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(tab === 'labor' || tab === 'parts' || tab === 'attachments' || tab === 'sla') && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-3">
              <FileText size={18} className="text-[#94A3B8]" />
            </div>
            <p className="text-sm font-500 text-[#172033]">No {tab} recorded yet</p>
            <p className="text-xs text-[#64748B] mt-1">Add {tab} entries as work progresses.</p>
          </div>
        )}
      </div>
    </div>
  );
}
