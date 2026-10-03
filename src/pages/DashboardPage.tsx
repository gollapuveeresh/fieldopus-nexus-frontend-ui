import { Box, Wrench, AlertTriangle, ClipboardList, Clock, Users, TrendingUp, Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import KpiCard from '../components/ui/KpiCard';
import StatusBadge from '../components/ui/StatusBadge';
import type { Page } from '../types';

const woStatusData = [
  { name: 'Draft', value: 12 },
  { name: 'Planned', value: 28 },
  { name: 'Assigned', value: 34 },
  { name: 'In Progress', value: 47 },
  { name: 'On Hold', value: 9 },
  { name: 'Completed', value: 83 },
];

const pmComplianceData = [
  { month: 'Apr', compliance: 84, target: 90 },
  { month: 'May', compliance: 88, target: 90 },
  { month: 'Jun', compliance: 82, target: 90 },
  { month: 'Jul', compliance: 91, target: 90 },
  { month: 'Aug', compliance: 86, target: 90 },
  { month: 'Sep', compliance: 94, target: 90 },
];

const slaData = [
  { name: 'Healthy', value: 142, color: '#16A34A' },
  { name: 'Warning', value: 23, color: '#F59E0B' },
  { name: 'Breached', value: 8, color: '#DC2626' },
];

const techWorkloadData = [
  { name: 'T. Sharma', jobs: 7, capacity: 10 },
  { name: 'R. Patel', jobs: 9, capacity: 10 },
  { name: 'A. Nair', jobs: 5, capacity: 10 },
  { name: 'K. Singh', jobs: 8, capacity: 10 },
  { name: 'M. David', jobs: 3, capacity: 10 },
  { name: 'P. Joseph', jobs: 10, capacity: 10 },
];

const recentWOs = [
  { wo: 'WO-2024-0851', asset: 'HVAC Unit — Block A', site: 'Colombo HQ', tech: 'T. Sharma', priority: 'High', status: 'in-progress', due: '30 Sep 2026' },
  { wo: 'WO-2024-0850', asset: 'Elevator — Tower 2', site: 'Kandy Branch', tech: 'R. Patel', priority: 'Critical', status: 'assigned', due: '29 Sep 2026' },
  { wo: 'WO-2024-0849', asset: 'Generator #3', site: 'Galle Site', tech: 'A. Nair', priority: 'Medium', status: 'dispatched', due: '01 Oct 2026' },
  { wo: 'WO-2024-0848', asset: 'Fire Panel — Lobby', site: 'Colombo HQ', tech: 'K. Singh', priority: 'High', status: 'planned', due: '02 Oct 2026' },
  { wo: 'WO-2024-0847', asset: 'UPS Bank B', site: 'Data Centre', tech: 'M. David', priority: 'Low', status: 'completed', due: '28 Sep 2026' },
];

const assetHealthData = [
  { name: 'Active', value: 412, color: '#16A34A' },
  { name: 'Maintenance', value: 47, color: '#F59E0B' },
  { name: 'Out of Service', value: 18, color: '#DC2626' },
  { name: 'Retired', value: 23, color: '#94A3B8' },
];

interface Props { onNavigate: (page: Page) => void; }

export default function DashboardPage({ onNavigate }: Props) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-700 text-[#172033]">Operations Dashboard</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Monitor assets, maintenance, work orders and field operations · 29 Sep 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded text-xs text-green-700 font-500">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full pulse-dot" />
            Platform Operational
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Assets"
          value="500"
          subtitle="412 active"
          icon={<Box size={15} />}
          trend={{ value: '+12 this month', direction: 'up', positive: true }}
        />
        <KpiCard
          title="Active Work Orders"
          value="98"
          subtitle="47 in progress"
          icon={<ClipboardList size={15} />}
          accent
        />
        <KpiCard
          title="Overdue PM"
          value="14"
          subtitle="Needs attention"
          icon={<Wrench size={15} />}
          alert
          trend={{ value: '+3 since last week', direction: 'up', positive: false }}
        />
        <KpiCard
          title="Open Requests"
          value="37"
          subtitle="8 awaiting triage"
          icon={<AlertTriangle size={15} />}
        />
        <KpiCard
          title="SLA Breaches"
          value="8"
          subtitle="This month"
          icon={<Clock size={15} />}
          alert
        />
        <KpiCard
          title="Technicians Available"
          value="6 / 14"
          subtitle="8 currently on job"
          icon={<Users size={15} />}
          trend={{ value: '2 on leave', direction: 'neutral' }}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* WO by Status */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-600 text-[#172033]">Work Orders by Status</div>
              <div className="text-xs text-[#64748B]">Current distribution across all open work orders</div>
            </div>
            <select className="text-xs border border-[#E2E8F0] rounded px-2 py-1 text-[#64748B] outline-none">
              <option>This Month</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={woStatusData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontSize: 12, border: '1px solid #E2E8F0', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              />
              <Bar dataKey="value" fill="#0B1F3A" radius={[3, 3, 0, 0]}>
                {woStatusData.map((_, i) => (
                  <Cell key={i} fill={i === 3 ? '#C9A227' : '#0B1F3A'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Asset Health */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
          <div className="text-sm font-600 text-[#172033] mb-1">Asset Health</div>
          <div className="text-xs text-[#64748B] mb-4">500 total registered assets</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={assetHealthData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={2}>
                {assetHealthData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #E2E8F0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {assetHealthData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span className="text-xs text-[#64748B]">{d.name}</span>
                <span className="text-xs font-600 text-[#172033] ml-auto">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* PM Compliance */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#E2E8F0] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-600 text-[#172033]">PM Compliance</div>
              <div className="text-xs text-[#64748B]">Monthly compliance rate vs 90% target</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-[#64748B]">
                <span className="w-3 h-0.5 bg-[#0B1F3A] inline-block" /> Actual
              </span>
              <span className="flex items-center gap-1 text-xs text-[#C9A227]">
                <span className="w-3 h-0.5 bg-[#C9A227] inline-block border-dashed" /> Target
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={pmComplianceData}>
              <defs>
                <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0B1F3A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0B1F3A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #E2E8F0' }} />
              <Area type="monotone" dataKey="compliance" stroke="#0B1F3A" fill="url(#compGrad)" strokeWidth={2} dot={{ r: 3, fill: '#0B1F3A' }} />
              <Line type="monotone" dataKey="target" stroke="#C9A227" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* SLA */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
          <div className="text-sm font-600 text-[#172033] mb-1">SLA Performance</div>
          <div className="text-xs text-[#64748B] mb-4">173 active SLAs this period</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={slaData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={2}>
                {slaData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #E2E8F0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {slaData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-xs text-[#64748B]">{d.name}</span>
                </div>
                <span className="text-xs font-600 text-[#172033]">{d.value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => onNavigate('sla')}
            className="w-full mt-3 py-1.5 text-xs text-[#C9A227] border border-[#C9A227]/30 rounded hover:bg-[#C9A227]/5 transition-colors font-500"
          >
            View SLA Dashboard →
          </button>
        </div>
      </div>

      {/* Technician Workload */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-600 text-[#172033]">Technician Workload</div>
            <div className="text-xs text-[#64748B]">Active jobs vs capacity today</div>
          </div>
          <button onClick={() => onNavigate('dispatch')} className="text-xs text-[#C9A227] hover:text-[#a8841e] font-500">
            Open Dispatch Board →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {techWorkloadData.map(t => (
            <div key={t.name} className="text-center">
              <div className="relative w-12 h-12 mx-auto mb-2">
                <svg viewBox="0 0 48 48" className="w-12 h-12 -rotate-90">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#F1F5F9" strokeWidth="4" />
                  <circle
                    cx="24" cy="24" r="20" fill="none"
                    stroke={t.jobs >= 9 ? '#DC2626' : t.jobs >= 7 ? '#F59E0B' : '#16A34A'}
                    strokeWidth="4"
                    strokeDasharray={`${(t.jobs / t.capacity) * 125.6} 125.6`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-700 text-[#172033]">{t.jobs}</span>
                </div>
              </div>
              <div className="text-xs text-[#172033] font-500 truncate">{t.name}</div>
              <div className="text-[10px] text-[#64748B]">{t.jobs}/{t.capacity} jobs</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Work Orders */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
          <div className="text-sm font-600 text-[#172033]">Recent Work Orders</div>
          <button onClick={() => onNavigate('work-orders')} className="text-xs text-[#C9A227] hover:text-[#a8841e] font-500">
            View All →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC]">
              <tr>
                {['WO Number', 'Asset', 'Site', 'Technician', 'Priority', 'Status', 'Due Date', ''].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-600 text-[#64748B] uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentWOs.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => onNavigate('work-order-detail')}
                  className="border-t border-[#F1F5F9] table-row-hover cursor-pointer"
                >
                  <td className="px-4 py-3 text-sm font-500 text-[#0B1F3A]">{row.wo}</td>
                  <td className="px-4 py-3 text-sm text-[#172033]">{row.asset}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{row.site}</td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{row.tech}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.priority} variant="small" />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-[#64748B]">{row.due}</td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-[#64748B] hover:text-[#172033]">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
