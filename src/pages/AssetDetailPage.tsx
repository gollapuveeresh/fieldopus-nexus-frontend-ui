import { useState } from 'react';
import { QrCode, Edit, Plus, Clock, Wrench, FileText, AlertTriangle, Activity, ChevronRight } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import type { Page } from '../types';

const TABS = [
  { label: 'Overview', value: 'overview' },
  { label: 'Maintenance History', value: 'maintenance' },
  { label: 'Work Orders', value: 'work-orders' },
  { label: 'Documents', value: 'documents' },
  { label: 'Meters', value: 'meters' },
  { label: 'Warranty', value: 'warranty' },
  { label: 'Audit History', value: 'audit' },
];

const maintenanceHistory = [
  { date: '15 Aug 2026', type: 'Preventive', desc: 'Quarterly HVAC service — filters replaced, coils cleaned', tech: 'T. Sharma', status: 'completed' },
  { date: '20 Jun 2026', type: 'Corrective', desc: 'Compressor fault — replaced capacitor bank', tech: 'R. Patel', status: 'completed' },
  { date: '14 Apr 2026', type: 'Preventive', desc: 'Quarterly HVAC service — routine inspection', tech: 'T. Sharma', status: 'completed' },
  { date: '10 Feb 2026', type: 'Inspection', desc: 'Annual compliance inspection — passed', tech: 'A. Nair', status: 'completed' },
];

interface Props { onNavigate: (page: Page) => void; }

export default function AssetDetailPage({ onNavigate }: Props) {
  const [tab, setTab] = useState('overview');

  return (
    <div>
      <PageHeader
        title="HVAC Unit — Block A"
        subtitle="AST-0218 · Colombo HQ, Zone A"
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
        actions={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#64748B] hover:text-[#172033] transition-colors">
              <QrCode size={13} /> View QR
            </button>
            <button
              onClick={() => onNavigate('work-order-create')}
              className="flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#64748B] hover:text-[#172033] transition-colors"
            >
              <Plus size={13} /> Work Order
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-[#0B1F3A] rounded text-xs text-white font-500 hover:bg-[#102A43] transition-colors">
              <Edit size={13} /> Edit Asset
            </button>
          </div>
        }
      />

      {/* Status bar */}
      <div className="bg-white border-b border-[#E2E8F0] px-6 py-3 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <StatusBadge status="active" />
          <span className="text-xs text-[#64748B]">Condition: <span className="text-green-600 font-500">Good</span></span>
        </div>
        <div className="h-4 w-px bg-[#E2E8F0]" />
        <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
          <Clock size={12} />
          Next PM: <span className="text-[#172033] font-500">15 Oct 2026</span>
        </div>
        <div className="h-4 w-px bg-[#E2E8F0]" />
        <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
          <Wrench size={12} />
          Last Serviced: <span className="text-[#172033] font-500">15 Aug 2026</span>
        </div>
        <div className="h-4 w-px bg-[#E2E8F0]" />
        <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
          <Activity size={12} />
          Runtime: <span className="text-[#172033] font-500">14,230 hrs</span>
        </div>
      </div>

      <div className="p-6">
        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Asset details */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
                <h3 className="text-sm font-600 text-[#172033] mb-4">Asset Information</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  {[
                    { label: 'Asset ID', value: 'AST-0218' },
                    { label: 'Asset Name', value: 'HVAC Unit — Block A' },
                    { label: 'Category', value: 'HVAC' },
                    { label: 'Sub-Category', value: 'Air Handling Unit' },
                    { label: 'Manufacturer', value: 'Daikin Industries' },
                    { label: 'Model', value: 'VRV-IV Series' },
                    { label: 'Serial Number', value: 'DK20240218' },
                    { label: 'Asset Tag', value: 'TAG-A218' },
                    { label: 'Commission Date', value: '01 Feb 2024' },
                    { label: 'Purchase Price', value: 'LKR 2,400,000' },
                    { label: 'Site', value: 'Colombo HQ' },
                    { label: 'Zone', value: 'Zone A — Level 3' },
                  ].map(f => (
                    <div key={f.label}>
                      <div className="text-xs text-[#94A3B8] uppercase tracking-wide mb-1">{f.label}</div>
                      <div className="text-sm text-[#172033] font-500">{f.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
                <h3 className="text-sm font-600 text-[#172033] mb-4">Maintenance Summary</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    { label: 'Total Work Orders', value: '23' },
                    { label: 'Avg MTBF', value: '4.2 mo' },
                    { label: 'Avg MTTR', value: '6.3 hrs' },
                    { label: 'Total Downtime', value: '48 hrs' },
                    { label: 'PM Compliance', value: '91%' },
                    { label: 'Last Inspection', value: '10 Feb 2026' },
                  ].map(s => (
                    <div key={s.label} className="bg-[#F8FAFC] rounded p-3">
                      <div className="text-lg font-700 text-[#172033]">{s.value}</div>
                      <div className="text-xs text-[#64748B]">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="space-y-4">
              {/* Warranty */}
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
                <h3 className="text-xs font-600 text-[#172033] uppercase tracking-wide mb-3">Warranty</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-[#64748B]">Provider</span>
                    <span className="text-xs font-500 text-[#172033]">Daikin Lanka</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[#64748B]">Valid Until</span>
                    <span className="text-xs font-500 text-green-600">31 Jan 2027</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[#64748B]">Coverage</span>
                    <span className="text-xs font-500 text-[#172033]">Parts & Labour</span>
                  </div>
                </div>
                <div className="mt-3 h-1.5 bg-[#F1F5F9] rounded-full">
                  <div className="h-1.5 bg-green-500 rounded-full" style={{ width: '75%' }} />
                </div>
                <div className="text-xs text-[#64748B] mt-1">485 days remaining</div>
              </div>

              {/* Recent activity */}
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
                <h3 className="text-xs font-600 text-[#172033] uppercase tracking-wide mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'PM Completed', desc: 'Quarterly service by T. Sharma', time: '15 Aug' },
                    { action: 'Status Updated', desc: 'Changed to Active from Maintenance', time: '15 Aug' },
                    { action: 'Part Consumed', desc: 'Air filter (×2) issued from WH-01', time: '15 Aug' },
                    { action: 'Work Order Closed', desc: 'WO-2024-0812 closed by supervisor', time: '15 Aug' },
                  ].map((a, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-px bg-[#E2E8F0] mt-1 flex-shrink-0 ml-1.5" />
                      <div>
                        <div className="text-xs font-500 text-[#172033]">{a.action}</div>
                        <div className="text-xs text-[#64748B]">{a.desc}</div>
                        <div className="text-[10px] text-[#94A3B8]">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'maintenance' && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <tr>
                  {['Date', 'Type', 'Description', 'Technician', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-600 text-[#64748B] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {maintenanceHistory.map((row, i) => (
                  <tr key={i} className="border-t border-[#F1F5F9] table-row-hover">
                    <td className="px-4 py-3 text-sm text-[#64748B]">{row.date}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-500 px-2 py-0.5 rounded ${
                        row.type === 'Preventive' ? 'bg-blue-50 text-blue-700' :
                        row.type === 'Corrective' ? 'bg-orange-50 text-orange-700' :
                        'bg-purple-50 text-purple-700'
                      }`}>{row.type}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#172033]">{row.desc}</td>
                    <td className="px-4 py-3 text-sm text-[#64748B]">{row.tech}</td>
                    <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(tab === 'documents' || tab === 'meters' || tab === 'warranty' || tab === 'audit' || tab === 'work-orders') && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg flex flex-col items-center justify-center py-16 text-center">
            <FileText size={32} className="text-[#CBD5E1] mb-3" />
            <p className="text-sm font-500 text-[#172033]">No {tab} data yet</p>
            <p className="text-xs text-[#64748B] mt-1">Data will appear here as you use the platform.</p>
          </div>
        )}
      </div>
    </div>
  );
}
