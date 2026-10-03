import { useState } from 'react';
import { Plus, Eye, Edit, Clock } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import FilterBar, { SelectFilter } from '../components/ui/FilterBar';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import type { Page } from '../types';

const WORK_ORDERS = [
  { wo: 'WO-2024-0851', type: 'Corrective', asset: 'HVAC Unit — Block A', site: 'Colombo HQ', priority: 'High', tech: 'T. Sharma', status: 'in-progress', scheduled: '29 Sep 2026', sla: '02 hrs 14 min', slaStatus: 'warning' },
  { wo: 'WO-2024-0850', type: 'Corrective', asset: 'Elevator — Tower 2', site: 'Kandy Branch', priority: 'Critical', tech: 'R. Patel', status: 'assigned', scheduled: '29 Sep 2026', sla: '00 hrs 42 min', slaStatus: 'warning' },
  { wo: 'WO-2024-0849', type: 'Preventive', asset: 'Generator #3', site: 'Galle Site', priority: 'Medium', tech: 'A. Nair', status: 'dispatched', scheduled: '01 Oct 2026', sla: '08 hrs 22 min', slaStatus: 'healthy' },
  { wo: 'WO-2024-0848', type: 'Preventive', asset: 'Fire Panel — Lobby', site: 'Colombo HQ', priority: 'High', tech: 'K. Singh', status: 'planned', scheduled: '02 Oct 2026', sla: '12 hrs 00 min', slaStatus: 'healthy' },
  { wo: 'WO-2024-0847', type: 'Corrective', asset: 'UPS Bank B', site: 'Data Centre', priority: 'Low', tech: 'M. David', status: 'completed', scheduled: '28 Sep 2026', sla: '—', slaStatus: 'healthy' },
  { wo: 'WO-2024-0846', type: 'Inspection', asset: 'Chiller Unit #1', site: 'Colombo HQ', priority: 'Critical', tech: '—', status: 'draft', scheduled: '30 Sep 2026', sla: '—', slaStatus: 'healthy' },
  { wo: 'WO-2024-0845', type: 'Corrective', asset: 'BMS Controller', site: 'Kandy Branch', priority: 'Medium', tech: 'P. Joseph', status: 'on-hold', scheduled: '30 Sep 2026', sla: '04 hrs 10 min', slaStatus: 'warning' },
  { wo: 'WO-2024-0844', type: 'Preventive', asset: 'Cooling Tower A', site: 'Galle Site', priority: 'Low', tech: 'T. Sharma', status: 'closed', scheduled: '27 Sep 2026', sla: '—', slaStatus: 'healthy' },
];

const columns = [
  { key: 'wo', label: 'WO Number', sortable: true, render: (row: any) => (
    <span className="font-600 text-[#0B1F3A] text-sm">{row.wo}</span>
  )},
  { key: 'type', label: 'Type', render: (row: any) => (
    <span className={`text-xs font-500 px-2 py-0.5 rounded ${
      row.type === 'Corrective' ? 'bg-orange-50 text-orange-700' :
      row.type === 'Preventive' ? 'bg-blue-50 text-blue-700' :
      'bg-purple-50 text-purple-700'
    }`}>{row.type}</span>
  )},
  { key: 'asset', label: 'Asset', render: (row: any) => (
    <div>
      <div className="text-sm text-[#172033] font-500">{row.asset}</div>
      <div className="text-xs text-[#64748B]">{row.site}</div>
    </div>
  )},
  { key: 'priority', label: 'Priority', render: (row: any) => <StatusBadge status={row.priority} variant="small" /> },
  { key: 'tech', label: 'Technician', render: (row: any) => (
    <span className="text-sm text-[#64748B]">{row.tech}</span>
  )},
  { key: 'status', label: 'Status', render: (row: any) => <StatusBadge status={row.status} /> },
  { key: 'scheduled', label: 'Scheduled', render: (row: any) => (
    <span className="text-sm text-[#64748B]">{row.scheduled}</span>
  )},
  { key: 'sla', label: 'SLA Remaining', render: (row: any) => (
    <div className="flex items-center gap-1.5">
      {row.sla !== '—' && <Clock size={12} className={row.slaStatus === 'warning' ? 'text-amber-500' : 'text-green-500'} />}
      <span className={`text-sm font-500 ${
        row.sla === '—' ? 'text-[#94A3B8]' :
        row.slaStatus === 'warning' ? 'text-amber-600' : 'text-green-600'
      }`}>{row.sla}</span>
    </div>
  )},
  { key: 'actions', label: '', render: (_: any) => (
    <div className="flex items-center gap-1">
      <button className="p-1.5 text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9] rounded"><Eye size={13} /></button>
      <button className="p-1.5 text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9] rounded"><Edit size={13} /></button>
    </div>
  )},
];

interface Props { onNavigate: (page: Page) => void; }

export default function WorkOrdersPage({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);

  const filtered = WORK_ORDERS.filter(w =>
    (!search || w.wo.includes(search) || w.asset.toLowerCase().includes(search.toLowerCase())) &&
    (!status || w.status === status) &&
    (!priority || w.priority.toLowerCase() === priority)
  );

  return (
    <div className="p-6">
      <PageHeader
        title="Work Orders"
        subtitle="Create, track and manage corrective and preventive maintenance work orders"
        actions={
          <button
            onClick={() => onNavigate('work-order-create')}
            className="flex items-center gap-2 px-3 py-2 bg-[#0B1F3A] rounded text-xs text-white font-500 hover:bg-[#102A43] transition-colors"
          >
            <Plus size={13} /> Create Work Order
          </button>
        }
      />

      <div className="mt-5">
        {/* Summary strip */}
        <div className="grid grid-cols-5 gap-3 mb-5">
          {[
            { label: 'Total Open', value: 98, color: 'text-[#172033]' },
            { label: 'In Progress', value: 47, color: 'text-amber-600' },
            { label: 'Assigned', value: 23, color: 'text-blue-600' },
            { label: 'On Hold', value: 9, color: 'text-orange-600' },
            { label: 'SLA at Risk', value: 12, color: 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-[#E2E8F0] rounded-lg px-4 py-3">
              <div className={`text-xl font-700 ${s.color}`}>{s.value}</div>
              <div className="text-xs text-[#64748B]">{s.label}</div>
            </div>
          ))}
        </div>

        <FilterBar
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search work orders..."
          onAdd={() => onNavigate('work-order-create')}
          addLabel="Create Work Order"
          onExport={() => {}}
          filters={
            <>
              <SelectFilter label="Status" value={status} onChange={setStatus} options={[
                { label: 'Draft', value: 'draft' },
                { label: 'Planned', value: 'planned' },
                { label: 'Assigned', value: 'assigned' },
                { label: 'In Progress', value: 'in-progress' },
                { label: 'On Hold', value: 'on-hold' },
                { label: 'Completed', value: 'completed' },
              ]} />
              <SelectFilter label="Priority" value={priority} onChange={setPriority} options={[
                { label: 'Critical', value: 'critical' },
                { label: 'High', value: 'high' },
                { label: 'Medium', value: 'medium' },
                { label: 'Low', value: 'low' },
              ]} />
            </>
          }
        />

        <DataTable
          columns={columns}
          data={filtered.slice((page - 1) * 8, page * 8)}
          onRowClick={() => onNavigate('work-order-detail')}
          emptyMessage="No work orders found"
          emptyAction={{ label: 'Create Work Order', onClick: () => onNavigate('work-order-create') }}
          pagination={{ page, total: filtered.length, perPage: 8, onPage: setPage }}
        />
      </div>
    </div>
  );
}
