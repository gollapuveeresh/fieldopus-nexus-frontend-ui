import { useState } from 'react';
import { Clock, AlertTriangle, CheckCircle, TrendingDown, Plus, ChevronRight } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import KpiCard from '../components/ui/KpiCard';
import StatusBadge from '../components/ui/StatusBadge';
import type { Page } from '../types';

const ACTIVE_SLAS = [
  { ref: 'SR-2024-1204', desc: 'HVAC Cooling Issue — Block A', priority: 'High', responseLeft: '00:42', resolutionLeft: '03:18', status: 'warning', tech: 'T. Sharma' },
  { ref: 'SR-2024-1203', desc: 'Elevator Fault — Tower 2', priority: 'Critical', responseLeft: '00:08', resolutionLeft: '01:52', status: 'warning', tech: 'R. Patel' },
  { ref: 'WO-2024-0849', desc: 'Generator Monthly Check', priority: 'Medium', responseLeft: '08:22', resolutionLeft: '16:40', status: 'healthy', tech: 'A. Nair' },
  { ref: 'WO-2024-0848', desc: 'Fire Panel Inspection', priority: 'High', responseLeft: '12:00', resolutionLeft: '24:00', status: 'healthy', tech: '—' },
  { ref: 'SR-2024-1200', desc: 'UPS Battery Fault', priority: 'Critical', responseLeft: 'BREACHED', resolutionLeft: 'BREACHED', status: 'breached', tech: 'M. David' },
];

const PROFILES = [
  { name: 'Critical Response', priority: 'Critical', response: '1 hour', resolution: '4 hours', scope: 'All sites' },
  { name: 'High Priority', priority: 'High', response: '4 hours', resolution: '8 hours', scope: 'All sites' },
  { name: 'Standard', priority: 'Medium', response: '8 hours', resolution: '24 hours', scope: 'All sites' },
  { name: 'Low Priority', priority: 'Low', response: '24 hours', resolution: '72 hours', scope: 'All sites' },
  { name: 'Client Contract — ABC Corp', priority: 'High', response: '2 hours', resolution: '6 hours', scope: 'Colombo HQ only' },
];

const BREACHES = [
  { ref: 'WO-2024-0842', desc: 'Transformer Fault', priority: 'Critical', breachType: 'Resolution', breachTime: '2h 14m', root: 'Parts unavailable', tech: 'P. Joseph', date: '27 Sep 2026' },
  { ref: 'SR-2024-1198', desc: 'Chiller Shutdown', priority: 'Critical', breachType: 'Response', breachTime: '0h 28m', root: 'Technician unavailable', tech: '—', date: '26 Sep 2026' },
  { ref: 'WO-2024-0835', desc: 'BMS Offline', priority: 'High', breachType: 'Resolution', breachTime: '3h 02m', root: 'Escalation delay', tech: 'K. Singh', date: '24 Sep 2026' },
];

const TABS_MAP: Record<string, string> = {
  sla: 'dashboard',
  'sla-profiles': 'profiles',
  'sla-breaches': 'breaches',
};

interface Props { onNavigate: (page: Page) => void; currentPage: Page; }

export default function SLAPage({ onNavigate, currentPage }: Props) {
  const activeSub = TABS_MAP[currentPage] ?? 'dashboard';

  return (
    <div>
      <PageHeader
        title="SLA Management"
        subtitle="Monitor SLA performance, response times and escalations"
        tabs={[
          { label: 'SLA Dashboard', value: 'dashboard' },
          { label: 'SLA Profiles', value: 'profiles' },
          { label: 'Breaches', value: 'breaches' },
        ]}
        activeTab={activeSub}
        onTabChange={v => {
          const map: Record<string, Page> = { dashboard: 'sla', profiles: 'sla-profiles', breaches: 'sla-breaches' };
          onNavigate(map[v]);
        }}
        actions={
          activeSub === 'profiles' && (
            <button className="flex items-center gap-2 px-3 py-2 bg-[#0B1F3A] rounded text-xs text-white font-500">
              <Plus size={13} /> New Profile
            </button>
          )
        }
      />

      <div className="p-6">
        {activeSub === 'dashboard' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <KpiCard title="Active SLAs" value="173" icon={<Clock size={14} />} />
              <KpiCard title="Healthy" value="142" subtitle="82%" icon={<CheckCircle size={14} />} trend={{ value: 'On track', direction: 'up', positive: true }} />
              <KpiCard title="At Risk" value="23" subtitle="13%" icon={<AlertTriangle size={14} />} accent />
              <KpiCard title="Breached" value="8" subtitle="This month" icon={<TrendingDown size={14} />} alert />
            </div>

            {/* Active SLA timers */}
            <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden mb-5">
              <div className="px-5 py-4 border-b border-[#F1F5F9]">
                <div className="text-sm font-600 text-[#172033]">Active SLA Timers</div>
                <div className="text-xs text-[#64748B]">Real-time response and resolution countdowns</div>
              </div>
              <div className="divide-y divide-[#F1F5F9]">
                {ACTIVE_SLAS.map((sla, i) => (
                  <div key={i} className={`px-5 py-4 flex items-center gap-4 ${sla.status === 'breached' ? 'bg-red-50/30' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-600 text-[#0B1F3A]">{sla.ref}</span>
                        <StatusBadge status={sla.priority} variant="small" />
                      </div>
                      <div className="text-sm text-[#172033]">{sla.desc}</div>
                      <div className="text-xs text-[#64748B]">Assigned: {sla.tech}</div>
                    </div>

                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="text-xs text-[#94A3B8] mb-1">Response</div>
                        <div className={`text-sm font-700 font-mono ${
                          sla.responseLeft === 'BREACHED' ? 'text-red-600' :
                          sla.status === 'warning' ? 'text-amber-600' : 'text-green-600'
                        }`}>
                          {sla.responseLeft}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-[#94A3B8] mb-1">Resolution</div>
                        <div className={`text-sm font-700 font-mono ${
                          sla.resolutionLeft === 'BREACHED' ? 'text-red-600' :
                          sla.status === 'warning' ? 'text-amber-600' : 'text-green-600'
                        }`}>
                          {sla.resolutionLeft}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <StatusBadge status={sla.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeSub === 'profiles' && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <tr>
                  {['Profile Name', 'Priority', 'Response Target', 'Resolution Target', 'Scope', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-600 text-[#64748B] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PROFILES.map((p, i) => (
                  <tr key={i} className="border-t border-[#F1F5F9] table-row-hover cursor-pointer">
                    <td className="px-4 py-3 text-sm font-500 text-[#172033]">{p.name}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.priority} variant="small" /></td>
                    <td className="px-4 py-3 text-sm font-600 text-[#172033]">{p.response}</td>
                    <td className="px-4 py-3 text-sm font-600 text-[#172033]">{p.resolution}</td>
                    <td className="px-4 py-3 text-sm text-[#64748B]">{p.scope}</td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-[#64748B] hover:text-[#C9A227]">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSub === 'breaches' && (
          <>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5 flex items-start gap-3">
              <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-600 text-red-700">8 SLA Breaches This Month</div>
                <div className="text-xs text-red-600 mt-0.5">Review root causes and update escalation rules to prevent recurrence.</div>
              </div>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <tr>
                    {['Reference', 'Description', 'Priority', 'Breach Type', 'Exceeded By', 'Root Cause', 'Technician', 'Date'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-600 text-[#64748B] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BREACHES.map((b, i) => (
                    <tr key={i} className="border-t border-[#F1F5F9] table-row-hover">
                      <td className="px-4 py-3 text-sm font-600 text-[#0B1F3A]">{b.ref}</td>
                      <td className="px-4 py-3 text-sm text-[#172033]">{b.desc}</td>
                      <td className="px-4 py-3"><StatusBadge status={b.priority} variant="small" /></td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-500 px-2 py-0.5 rounded ${b.breachType === 'Response' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>
                          {b.breachType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-600 text-red-600">{b.breachTime}</td>
                      <td className="px-4 py-3 text-sm text-[#64748B]">{b.root}</td>
                      <td className="px-4 py-3 text-sm text-[#64748B]">{b.tech}</td>
                      <td className="px-4 py-3 text-sm text-[#64748B]">{b.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
