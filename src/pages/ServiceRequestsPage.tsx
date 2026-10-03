import { useState } from 'react';
import { Plus, Eye, ChevronRight, CheckCircle } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import FilterBar, { SelectFilter } from '../components/ui/FilterBar';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import type { Page } from '../types';

const SERVICE_REQUESTS = [
  { id: 'SR-2024-1204', requester: 'Priya Mendis', site: 'Colombo HQ', asset: 'HVAC Unit — Block A', category: 'HVAC', priority: 'High', status: 'triaged', created: '29 Sep 2026', sla: '4 hrs' },
  { id: 'SR-2024-1203', requester: 'Rohan Silva', site: 'Kandy Branch', asset: 'Elevator — Tower 2', category: 'Elevator', priority: 'Critical', status: 'approved', created: '29 Sep 2026', sla: '2 hrs' },
  { id: 'SR-2024-1202', requester: 'Anil Jayasinghe', site: 'Galle Site', asset: 'Generator #3', category: 'Power', priority: 'Medium', status: 'new', created: '28 Sep 2026', sla: '8 hrs' },
  { id: 'SR-2024-1201', requester: 'Kumari Perera', site: 'Colombo HQ', asset: 'Chiller Unit #1', category: 'HVAC', priority: 'High', status: 'completed', created: '27 Sep 2026', sla: '—' },
  { id: 'SR-2024-1200', requester: 'Nimal Dharmasena', site: 'Data Centre', asset: 'UPS Bank A', category: 'Power', priority: 'Critical', status: 'closed', created: '26 Sep 2026', sla: '—' },
  { id: 'SR-2024-1199', requester: 'Chaminda Rathnayake', site: 'Kandy Branch', asset: 'BMS Controller', category: 'Controls', priority: 'Low', status: 'rejected', created: '25 Sep 2026', sla: '—' },
];

const WORKFLOW = ['New', 'Triaged', 'Approved', 'Work Order', 'In Service', 'Resolved', 'Confirmed', 'Closed'];

const columns = [
  { key: 'id', label: 'Request ID', sortable: true, render: (r: any) => <span className="font-600 text-[#0B1F3A]">{r.id}</span> },
  { key: 'requester', label: 'Requester', render: (r: any) => (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[10px] font-700 text-[#64748B] flex-shrink-0">
        {r.requester.split(' ').map((n: string) => n[0]).join('')}
      </div>
      <span className="text-sm text-[#172033]">{r.requester}</span>
    </div>
  )},
  { key: 'site', label: 'Site / Asset', render: (r: any) => (
    <div>
      <div className="text-sm font-500 text-[#172033]">{r.site}</div>
      <div className="text-xs text-[#64748B]">{r.asset}</div>
    </div>
  )},
  { key: 'category', label: 'Category' },
  { key: 'priority', label: 'Priority', render: (r: any) => <StatusBadge status={r.priority} variant="small" /> },
  { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
  { key: 'created', label: 'Created', render: (r: any) => <span className="text-sm text-[#64748B]">{r.created}</span> },
  { key: 'sla', label: 'SLA', render: (r: any) => <span className="text-sm text-[#64748B]">{r.sla}</span> },
  { key: 'actions', label: '', render: (_: any) => (
    <button className="p-1.5 text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9] rounded"><Eye size={13} /></button>
  )},
];

interface Props { onNavigate: (page: Page) => void; currentPage: Page; }

export default function ServiceRequestsPage({ onNavigate, currentPage }: Props) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);

  const isCreate = currentPage === 'service-request-create';
  const isDetail = currentPage === 'service-request-detail';

  const filtered = SERVICE_REQUESTS.filter(r =>
    (!search || r.id.includes(search) || r.requester.toLowerCase().includes(search.toLowerCase())) &&
    (!status || r.status === status) &&
    (!priority || r.priority.toLowerCase() === priority)
  );

  if (isCreate) {
    return (
      <div className="p-6 max-w-2xl">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <button onClick={() => onNavigate('service-requests')} className="text-xs text-[#64748B] hover:text-[#C9A227]">
              Service Requests
            </button>
            <ChevronRight size={12} className="text-[#CBD5E1]" />
            <span className="text-xs text-[#172033] font-500">New Service Request</span>
          </div>
          <h2 className="text-base font-700 text-[#172033] mb-5">Raise Service Request</h2>
          <div className="space-y-4">
            {[
              { label: 'Requester Name', type: 'text', placeholder: 'Your name', required: true },
              { label: 'Site', type: 'select', options: ['Colombo HQ', 'Kandy Branch', 'Galle Site', 'Data Centre'], required: true },
              { label: 'Asset', type: 'text', placeholder: 'Search or enter asset name', required: true },
              { label: 'Service Category', type: 'select', options: ['HVAC', 'Power', 'Elevator', 'Safety', 'Controls', 'Plumbing'], required: true },
              { label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'], required: true },
              { label: 'Description', type: 'textarea', placeholder: 'Describe the issue in detail...', required: true },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-500 text-[#172033] mb-1.5">
                  {f.label} {f.required && <span className="text-red-500">*</span>}
                </label>
                {f.type === 'textarea' ? (
                  <textarea
                    placeholder={f.placeholder}
                    rows={4}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded text-sm text-[#172033] placeholder-[#94A3B8] outline-none focus:border-[#C9A227] transition-colors resize-none"
                  />
                ) : f.type === 'select' ? (
                  <select className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded text-sm text-[#172033] outline-none focus:border-[#C9A227] transition-colors bg-white">
                    <option value="">Select {f.label.toLowerCase()}...</option>
                    {f.options?.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded text-sm text-[#172033] placeholder-[#94A3B8] outline-none focus:border-[#C9A227] transition-colors"
                  />
                )}
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => onNavigate('service-requests')}
                className="px-4 py-2.5 border border-[#E2E8F0] rounded text-sm text-[#64748B] hover:text-[#172033] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onNavigate('service-request-detail')}
                className="px-6 py-2.5 bg-[#0B1F3A] text-white text-sm font-600 rounded hover:bg-[#102A43] transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isDetail) {
    const sr = SERVICE_REQUESTS[0];
    return (
      <div className="p-6">
        <div className="bg-white border border-[#E2E8F0] rounded-lg">
          <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
                <button onClick={() => onNavigate('service-requests')} className="hover:text-[#C9A227]">Service Requests</button>
                <ChevronRight size={10} />
                <span className="text-[#172033]">{sr.id}</span>
              </div>
              <h2 className="text-base font-700 text-[#172033]">{sr.id} — HVAC Cooling Issue</h2>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={sr.status} />
              <button className="px-3 py-2 bg-[#0B1F3A] text-white text-xs font-500 rounded hover:bg-[#102A43] transition-colors">
                Create Work Order
              </button>
            </div>
          </div>

          {/* Workflow */}
          <div className="px-6 py-3 border-b border-[#F1F5F9] flex items-center gap-1 overflow-x-auto">
            {WORKFLOW.map((step, i) => (
              <div key={step} className="flex items-center gap-1 flex-shrink-0">
                <div className={`px-3 py-1.5 rounded text-xs font-500 flex items-center gap-1.5 ${
                  i === 2 ? 'bg-[#C9A227] text-[#071426]' :
                  i < 2 ? 'bg-[#0B1F3A] text-white' : 'bg-[#F1F5F9] text-[#94A3B8]'
                }`}>
                  {i < 2 && <CheckCircle size={10} />}
                  {step}
                </div>
                {i < WORKFLOW.length - 1 && <ChevronRight size={10} className="text-[#CBD5E1]" />}
              </div>
            ))}
          </div>

          <div className="p-6 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-600 text-[#64748B] uppercase tracking-wide mb-4">Request Details</h3>
              <div className="space-y-3">
                {[
                  { label: 'Requester', value: sr.requester },
                  { label: 'Site', value: sr.site },
                  { label: 'Asset', value: sr.asset },
                  { label: 'Category', value: sr.category },
                  { label: 'Priority', value: <StatusBadge status={sr.priority} variant="small" /> },
                  { label: 'Created', value: sr.created },
                ].map(f => (
                  <div key={f.label} className="flex gap-4">
                    <span className="text-xs text-[#94A3B8] w-24 flex-shrink-0 pt-0.5">{f.label}</span>
                    <span className="text-sm text-[#172033] font-500">{f.value as any}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
                <div className="text-xs text-[#94A3B8] mb-2">Description</div>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  The HVAC unit in Block A (Level 3) has been producing significantly less cooling than normal since Monday morning. The area temperature is consistently 3-4 degrees above the set point. Multiple occupants have reported discomfort. Please investigate and resolve urgently.
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-600 text-[#64748B] uppercase tracking-wide mb-4">Actions & Notes</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="text-xs font-600 text-green-700 mb-1">Approved by J. Mitchell</div>
                  <div className="text-xs text-green-600">29 Sep 2026 09:12 — Work order creation authorized</div>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                  <div className="text-xs font-600 text-[#172033] mb-1">Triage Note</div>
                  <div className="text-xs text-[#64748B]">Confirmed with asset manager. Fault likely refrigerant related. Assign HVAC specialist.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Service Requests"
        subtitle="Track and manage incoming service requests from all sites and clients"
        actions={
          <button
            onClick={() => onNavigate('service-request-create')}
            className="flex items-center gap-2 px-3 py-2 bg-[#0B1F3A] rounded text-xs text-white font-500 hover:bg-[#102A43] transition-colors"
          >
            <Plus size={13} /> New Request
          </button>
        }
      />

      <div className="mt-5">
        <FilterBar
          search={search}
          onSearch={setSearch}
          searchPlaceholder="Search requests..."
          onAdd={() => onNavigate('service-request-create')}
          addLabel="New Request"
          onExport={() => {}}
          filters={
            <>
              <SelectFilter label="Status" value={status} onChange={setStatus} options={[
                { label: 'New', value: 'new' },
                { label: 'Triaged', value: 'triaged' },
                { label: 'Approved', value: 'approved' },
                { label: 'Completed', value: 'completed' },
                { label: 'Closed', value: 'closed' },
              ]} />
              <SelectFilter label="Priority" value={priority} onChange={setPriority} options={[
                { label: 'Critical', value: 'critical' },
                { label: 'High', value: 'high' },
                { label: 'Medium', value: 'medium' },
              ]} />
            </>
          }
        />
        <DataTable
          columns={columns}
          data={filtered.slice((page - 1) * 8, page * 8)}
          onRowClick={() => onNavigate('service-request-detail')}
          emptyMessage="No service requests found"
          emptyAction={{ label: 'New Request', onClick: () => onNavigate('service-request-create') }}
          pagination={{ page, total: filtered.length, perPage: 8, onPage: setPage }}
        />
      </div>
    </div>
  );
}
