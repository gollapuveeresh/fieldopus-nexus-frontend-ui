import { useState } from 'react';
import { QrCode, Edit, MoreHorizontal, AlertCircle, Plus } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import FilterBar, { SelectFilter } from '../components/ui/FilterBar';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import type { Page } from '../types';

const ASSETS = [
  { id: 'AST-0218', name: 'HVAC Unit — Block A', category: 'HVAC', model: 'Daikin VRV-IV', serial: 'DK20240218', site: 'Colombo HQ', zone: 'Zone A', status: 'active', condition: 'Good', nextPM: '15 Oct 2026' },
  { id: 'AST-0219', name: 'Elevator — Tower 2', category: 'Elevator', model: 'Otis Gen2', serial: 'OT20230219', site: 'Kandy Branch', zone: 'Main Lobby', status: 'under-maintenance', condition: 'Fair', nextPM: '29 Sep 2026' },
  { id: 'AST-0220', name: 'Generator #3', category: 'Power', model: 'Caterpillar C9', serial: 'CAT20220220', site: 'Galle Site', zone: 'Utility Block', status: 'active', condition: 'Excellent', nextPM: '30 Sep 2026' },
  { id: 'AST-0221', name: 'Fire Panel — Lobby', category: 'Safety', model: 'Hochiki FX-64', serial: 'HC20240221', site: 'Colombo HQ', zone: 'Ground Floor', status: 'active', condition: 'Good', nextPM: '10 Oct 2026' },
  { id: 'AST-0222', name: 'UPS Bank B', category: 'Power', model: 'APC Symmetra', serial: 'APC20230222', site: 'Data Centre', zone: 'Server Room', status: 'active', condition: 'Good', nextPM: '05 Oct 2026' },
  { id: 'AST-0223', name: 'Chiller Unit #1', category: 'HVAC', model: 'Trane CGAF', serial: 'TR20210223', site: 'Colombo HQ', zone: 'Rooftop', status: 'out-of-service', condition: 'Poor', nextPM: 'Overdue' },
  { id: 'AST-0224', name: 'BMS Controller', category: 'Controls', model: 'Siemens DESIGO', serial: 'SI20230224', site: 'Kandy Branch', zone: 'IT Room', status: 'active', condition: 'Excellent', nextPM: '20 Oct 2026' },
  { id: 'AST-0225', name: 'Cooling Tower A', category: 'HVAC', model: 'BAC VT1-12', serial: 'BAC20220225', site: 'Galle Site', zone: 'Rooftop', status: 'active', condition: 'Good', nextPM: '18 Oct 2026' },
  { id: 'AST-0226', name: 'Water Pump Station', category: 'Plumbing', model: 'Grundfos CR32', serial: 'GF20230226', site: 'Colombo HQ', zone: 'Basement', status: 'active', condition: 'Good', nextPM: '12 Oct 2026' },
  { id: 'AST-0227', name: 'Transformer #2', category: 'Electrical', model: 'ABB 500kVA', serial: 'ABB20200227', site: 'Data Centre', zone: 'Switchroom', status: 'under-maintenance', condition: 'Fair', nextPM: 'Overdue' },
];

const columns = [
  { key: 'id', label: 'Asset ID', sortable: true, render: (row: any) => (
    <span className="font-500 text-[#0B1F3A]">{row.id}</span>
  )},
  { key: 'name', label: 'Asset Name', render: (row: any) => (
    <div>
      <div className="font-500 text-[#172033]">{row.name}</div>
      <div className="text-xs text-[#64748B]">{row.model} · {row.serial}</div>
    </div>
  )},
  { key: 'category', label: 'Category' },
  { key: 'site', label: 'Site', render: (row: any) => (
    <div>
      <div className="text-sm text-[#172033]">{row.site}</div>
      <div className="text-xs text-[#64748B]">{row.zone}</div>
    </div>
  )},
  { key: 'status', label: 'Status', render: (row: any) => <StatusBadge status={row.status} /> },
  { key: 'condition', label: 'Condition', render: (row: any) => (
    <span className={`text-xs font-500 ${
      row.condition === 'Excellent' ? 'text-green-600' :
      row.condition === 'Good' ? 'text-blue-600' :
      row.condition === 'Fair' ? 'text-amber-600' : 'text-red-600'
    }`}>{row.condition}</span>
  )},
  { key: 'nextPM', label: 'Next PM', render: (row: any) => (
    <span className={`text-sm ${row.nextPM === 'Overdue' ? 'text-red-600 font-600' : 'text-[#64748B]'}`}>
      {row.nextPM === 'Overdue' && <AlertCircle size={12} className="inline mr-1" />}
      {row.nextPM}
    </span>
  )},
  { key: 'actions', label: '', render: (_: any) => (
    <div className="flex items-center gap-1">
      <button className="p-1.5 text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9] rounded transition-colors">
        <QrCode size={13} />
      </button>
      <button className="p-1.5 text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9] rounded transition-colors">
        <Edit size={13} />
      </button>
      <button className="p-1.5 text-[#64748B] hover:text-[#172033] hover:bg-[#F1F5F9] rounded transition-colors">
        <MoreHorizontal size={13} />
      </button>
    </div>
  )},
];

interface Props { onNavigate: (page: Page) => void; }

export default function AssetsPage({ onNavigate }: Props) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const filtered = ASSETS.filter(a =>
    (!search || a.name.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase())) &&
    (!status || a.status === status) &&
    (!category || a.category === category)
  );

  return (
    <div className="p-6">
      <PageHeader
        title="Asset Registry"
        subtitle="Manage and track all physical assets across sites and zones"
        actions={
          <>
            <button
              onClick={() => onNavigate('asset-hierarchy')}
              className="px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#64748B] hover:text-[#172033] font-500 transition-colors"
            >
              View Hierarchy
            </button>
            <button
              onClick={() => onNavigate('asset-create')}
              className="flex items-center gap-2 px-3 py-2 bg-[#0B1F3A] rounded text-xs text-white font-500 hover:bg-[#102A43] transition-colors"
            >
              <Plus size={13} />
              Add Asset
            </button>
          </>
        }
      />

      <div className="mt-5">
        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Total Assets', value: 500, color: 'text-[#172033]' },
            { label: 'Active', value: 412, color: 'text-green-600' },
            { label: 'Under Maintenance', value: 47, color: 'text-amber-600' },
            { label: 'Out of Service', value: 18, color: 'text-red-600' },
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
          searchPlaceholder="Search assets by name, ID or serial..."
          onAdd={() => onNavigate('asset-create')}
          addLabel="Add Asset"
          onExport={() => {}}
          filters={
            <>
              <SelectFilter
                label="Status"
                value={status}
                onChange={setStatus}
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Under Maintenance', value: 'under-maintenance' },
                  { label: 'Out of Service', value: 'out-of-service' },
                ]}
              />
              <SelectFilter
                label="Category"
                value={category}
                onChange={setCategory}
                options={[
                  { label: 'HVAC', value: 'HVAC' },
                  { label: 'Power', value: 'Power' },
                  { label: 'Safety', value: 'Safety' },
                  { label: 'Elevator', value: 'Elevator' },
                  { label: 'Controls', value: 'Controls' },
                ]}
              />
            </>
          }
        />

        <DataTable
          columns={columns}
          data={filtered.slice((page - 1) * 8, page * 8)}
          onRowClick={() => onNavigate('asset-detail')}
          emptyMessage="No assets found"
          emptyAction={{ label: 'Add Asset', onClick: () => onNavigate('asset-create') }}
          pagination={{ page, total: filtered.length, perPage: 8, onPage: setPage }}
        />
      </div>
    </div>
  );
}
