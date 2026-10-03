import { useState } from 'react';
import { Download, Filter } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';

const mttrData = [
  { month: 'Apr', mttr: 8.2, mtbf: 38 },
  { month: 'May', mttr: 7.8, mtbf: 42 },
  { month: 'Jun', mttr: 9.1, mtbf: 35 },
  { month: 'Jul', mttr: 6.9, mtbf: 48 },
  { month: 'Aug', mttr: 7.2, mtbf: 44 },
  { month: 'Sep', mttr: 6.3, mtbf: 51 },
];

const woTypeData = [
  { month: 'Apr', corrective: 28, preventive: 45, inspection: 12 },
  { month: 'May', corrective: 32, preventive: 48, inspection: 15 },
  { month: 'Jun', corrective: 24, preventive: 52, inspection: 11 },
  { month: 'Jul', corrective: 19, preventive: 55, inspection: 14 },
  { month: 'Aug', corrective: 22, preventive: 50, inspection: 13 },
  { month: 'Sep', corrective: 17, preventive: 58, inspection: 16 },
];

const categoryBreakdown = [
  { name: 'HVAC', value: 38, color: '#0B1F3A' },
  { name: 'Electrical', value: 24, color: '#C9A227' },
  { name: 'Mechanical', value: 18, color: '#2563EB' },
  { name: 'Safety', value: 12, color: '#16A34A' },
  { name: 'Others', value: 8, color: '#94A3B8' },
];

const techPerf = [
  { name: 'T. Sharma', jobs: 42, avg_time: 5.2, compliance: 98 },
  { name: 'R. Patel', jobs: 38, avg_time: 6.1, compliance: 94 },
  { name: 'A. Nair', jobs: 31, avg_time: 4.8, compliance: 97 },
  { name: 'K. Singh', jobs: 35, avg_time: 5.8, compliance: 91 },
  { name: 'M. David', jobs: 27, avg_time: 7.2, compliance: 88 },
  { name: 'P. Joseph', jobs: 44, avg_time: 5.5, compliance: 96 },
];

const downtimeData = [
  { month: 'Apr', planned: 12, unplanned: 28 },
  { month: 'May', planned: 10, unplanned: 22 },
  { month: 'Jun', planned: 14, unplanned: 35 },
  { month: 'Jul', planned: 11, unplanned: 18 },
  { month: 'Aug', planned: 9, unplanned: 20 },
  { month: 'Sep', planned: 8, unplanned: 14 },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('last-6-months');

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-700 text-[#172033]">Reports & Analytics</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Operational intelligence across assets, maintenance, work orders and technicians</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="border border-[#E2E8F0] rounded px-3 py-2 text-xs text-[#64748B] outline-none bg-white"
          >
            <option value="this-month">This Month</option>
            <option value="last-3-months">Last 3 Months</option>
            <option value="last-6-months">Last 6 Months</option>
            <option value="this-year">This Year</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#64748B] hover:text-[#172033] transition-colors bg-white">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Avg MTTR', value: '7.1 hrs', sub: '↓ 0.9 hrs vs prev period', positive: true },
          { label: 'Avg MTBF', value: '43 days', sub: '↑ 5 days vs prev period', positive: true },
          { label: 'PM Compliance', value: '94%', sub: '↑ 4% vs prev period', positive: true },
          { label: 'Total Downtime', value: '119 hrs', sub: '↓ 38 hrs vs prev period', positive: true },
        ].map(k => (
          <div key={k.label} className="bg-white border border-[#E2E8F0] rounded-lg p-4">
            <div className="text-xs text-[#64748B] uppercase tracking-wide mb-1">{k.label}</div>
            <div className="text-2xl font-700 text-[#172033]">{k.value}</div>
            <div className={`text-xs mt-1 font-500 ${k.positive ? 'text-green-600' : 'text-red-600'}`}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* MTTR/MTBF */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
          <div className="text-sm font-600 text-[#172033] mb-1">MTTR & MTBF Trend</div>
          <div className="text-xs text-[#64748B] mb-4">Mean Time to Repair (hrs) and Mean Time Between Failures (days)</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mttrData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line yAxisId="left" type="monotone" dataKey="mttr" name="MTTR (hrs)" stroke="#C9A227" strokeWidth={2} dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="mtbf" name="MTBF (days)" stroke="#0B1F3A" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* WO by Type */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
          <div className="text-sm font-600 text-[#172033] mb-1">Work Orders by Type</div>
          <div className="text-xs text-[#64748B] mb-4">Corrective, preventive and inspection work orders over time</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={woTypeData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="corrective" name="Corrective" fill="#DC2626" radius={[2, 2, 0, 0]} />
              <Bar dataKey="preventive" name="Preventive" fill="#0B1F3A" radius={[2, 2, 0, 0]} />
              <Bar dataKey="inspection" name="Inspection" fill="#C9A227" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Category breakdown */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5">
          <div className="text-sm font-600 text-[#172033] mb-1">WO by Category</div>
          <div className="text-xs text-[#64748B] mb-4">This period</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={2}>
                {categoryBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #E2E8F0' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {categoryBreakdown.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-xs text-[#64748B]">{d.name}</span>
                </div>
                <span className="text-xs font-600 text-[#172033]">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Downtime */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-lg p-5">
          <div className="text-sm font-600 text-[#172033] mb-1">Downtime Analysis</div>
          <div className="text-xs text-[#64748B] mb-4">Planned vs unplanned downtime hours by month</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={downtimeData}>
              <defs>
                <linearGradient id="unplanned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="planned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A227" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#C9A227" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="unplanned" name="Unplanned (hrs)" stroke="#DC2626" fill="url(#unplanned)" strokeWidth={2} />
              <Area type="monotone" dataKey="planned" name="Planned (hrs)" stroke="#C9A227" fill="url(#planned)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Technician Performance */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#F1F5F9]">
          <div className="text-sm font-600 text-[#172033]">Technician Performance</div>
          <div className="text-xs text-[#64748B]">Jobs completed, average response time and checklist compliance</div>
        </div>
        <table className="w-full">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <tr>
              {['Technician', 'Jobs Completed', 'Avg Completion Time', 'Checklist Compliance', 'Performance'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-600 text-[#64748B] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {techPerf.map((t, i) => (
              <tr key={i} className="border-t border-[#F1F5F9] table-row-hover">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#0B1F3A] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#C9A227] text-[9px] font-700">{t.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <span className="text-sm font-500 text-[#172033]">{t.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-600 text-[#172033]">{t.jobs}</td>
                <td className="px-4 py-3 text-sm text-[#64748B]">{t.avg_time} hrs</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full w-20">
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${t.compliance}%`, background: t.compliance >= 95 ? '#16A34A' : t.compliance >= 90 ? '#C9A227' : '#DC2626' }}
                      />
                    </div>
                    <span className={`text-xs font-600 ${t.compliance >= 95 ? 'text-green-600' : t.compliance >= 90 ? 'text-amber-600' : 'text-red-600'}`}>
                      {t.compliance}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-600 px-2 py-0.5 rounded ${
                    t.compliance >= 95 ? 'bg-green-50 text-green-700' :
                    t.compliance >= 90 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {t.compliance >= 95 ? 'Excellent' : t.compliance >= 90 ? 'Good' : 'Needs Review'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
