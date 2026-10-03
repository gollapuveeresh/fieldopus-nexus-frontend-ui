import { useState } from 'react';
import { Building2, QrCode, Users, Bell, User, Settings, FileText, Shield, AlertTriangle, CheckCircle, Clock, X, ChevronRight, Plus, MoreHorizontal, Scan } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable from '../components/ui/DataTable';
import FilterBar from '../components/ui/FilterBar';
import ClientDashboard from './ClientDashboard';
import type { Page } from '../types';

// ---- INCIDENTS PAGE ----
export function IncidentsPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [search, setSearch] = useState('');
  const INCIDENTS = [
    { id: 'INC-0142', asset: 'Chiller Unit #1', site: 'Colombo HQ', severity: 'Critical', reporter: 'K. Perera', reported: '28 Sep 2026 14:32', downtime: '4h 12m', status: 'in-progress' },
    { id: 'INC-0141', asset: 'Transformer #2', site: 'Data Centre', severity: 'High', reporter: 'N. Dharmasena', reported: '27 Sep 2026 09:15', downtime: '1h 48m', status: 'completed' },
    { id: 'INC-0140', asset: 'Elevator — Tower 2', site: 'Kandy Branch', severity: 'Medium', reporter: 'R. Silva', reported: '26 Sep 2026 11:22', downtime: '0h 45m', status: 'closed' },
  ];
  const cols = [
    { key: 'id', label: 'Incident ID', render: (r: any) => <span className="font-600 text-[#0B1F3A]">{r.id}</span> },
    { key: 'asset', label: 'Asset / Site', render: (r: any) => <div>
      <div className="font-500 text-[#172033]">{r.asset}</div>
      <div className="text-xs text-[#64748B]">{r.site}</div>
    </div>},
    { key: 'severity', label: 'Severity', render: (r: any) => <StatusBadge status={r.severity} variant="small" /> },
    { key: 'reporter', label: 'Reported By', render: (r: any) => <span className="text-sm text-[#64748B]">{r.reporter}</span> },
    { key: 'reported', label: 'Reported At', render: (r: any) => <span className="text-sm text-[#64748B]">{r.reported}</span> },
    { key: 'downtime', label: 'Downtime', render: (r: any) => <span className="text-sm font-600 text-red-600">{r.downtime}</span> },
    { key: 'status', label: 'Status', render: (r: any) => <StatusBadge status={r.status} /> },
  ];
  return (
    <div className="p-6">
      <PageHeader title="Incidents & Breakdowns" subtitle="Track equipment failures, breakdowns and service impact"
        actions={<button className="flex items-center gap-2 px-3 py-2 bg-[#DC2626] rounded text-xs text-white font-500"><AlertTriangle size={13} /> Report Incident</button>} />
      <div className="mt-5">
        <FilterBar search={search} onSearch={setSearch} searchPlaceholder="Search incidents..." onExport={() => {}} />
        <DataTable columns={cols} data={INCIDENTS.filter(i => !search || i.id.includes(search) || i.asset.toLowerCase().includes(search.toLowerCase()))} onRowClick={() => onNavigate('incident-detail')} emptyMessage="No incidents found" />
      </div>
    </div>
  );
}

// ---- CONTRACTS PAGE ----
export function ContractsPage({ onNavigate, currentPage }: { onNavigate: (page: Page) => void; currentPage: Page }) {
  const TABS_MAP: Record<string, string> = { contracts: 'overview', 'contracts-warranty': 'warranty', 'contracts-amc': 'amc' };
  const activeSub = TABS_MAP[currentPage] ?? 'overview';

  const WARRANTY = [
    { asset: 'HVAC Unit — Block A', provider: 'Daikin Lanka', coverage: 'Parts & Labour', start: '01 Feb 2024', end: '31 Jan 2027', status: 'active' },
    { asset: 'Elevator — Tower 2', provider: 'Otis Lanka', coverage: 'Full Coverage', start: '15 Mar 2023', end: '14 Mar 2026', status: 'active' },
    { asset: 'Generator #3', provider: 'Caterpillar', coverage: 'Parts Only', start: '01 Jan 2022', end: '31 Dec 2024', status: 'active' },
  ];
  const AMC = [
    { asset: 'Chiller System', provider: 'Trane Lanka', coverage: 'Comprehensive AMC', start: '01 Jan 2026', end: '31 Dec 2026', sla: '4 hr response', status: 'active' },
    { asset: 'Building BMS', provider: 'Siemens Lanka', coverage: 'Preventive + Corrective', start: '01 Mar 2026', end: '28 Feb 2027', sla: '8 hr response', status: 'active' },
  ];

  return (
    <div>
      <PageHeader title="Contracts & Warranty" subtitle="Manage asset warranties, AMC agreements and service contracts"
        tabs={[{ label: 'Overview', value: 'overview' }, { label: 'Warranty', value: 'warranty' }, { label: 'AMC', value: 'amc' }]}
        activeTab={activeSub}
        onTabChange={v => {
          const map: Record<string, Page> = { overview: 'contracts', warranty: 'contracts-warranty', amc: 'contracts-amc' };
          onNavigate(map[v]);
        }}
        actions={<button className="flex items-center gap-2 px-3 py-2 bg-[#0B1F3A] rounded text-xs text-white font-500"><Plus size={13} /> Add Contract</button>}
      />
      <div className="p-6">
        {(activeSub === 'overview' || activeSub === 'warranty') && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <span className="text-sm font-600 text-[#172033]">Warranty Register</span>
            </div>
            <table className="w-full">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]"><tr>
                {['Asset', 'Provider', 'Coverage', 'Start Date', 'End Date', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-600 text-[#64748B] uppercase tracking-wide">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {WARRANTY.map((w, i) => (
                  <tr key={i} className="border-t border-[#F1F5F9] table-row-hover cursor-pointer">
                    <td className="px-4 py-3 text-sm font-500 text-[#172033]">{w.asset}</td>
                    <td className="px-4 py-3 text-sm text-[#64748B]">{w.provider}</td>
                    <td className="px-4 py-3 text-sm text-[#64748B]">{w.coverage}</td>
                    <td className="px-4 py-3 text-sm text-[#64748B]">{w.start}</td>
                    <td className="px-4 py-3 text-sm text-green-600 font-500">{w.end}</td>
                    <td className="px-4 py-3"><StatusBadge status={w.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeSub === 'amc' && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <span className="text-sm font-600 text-[#172033]">AMC Register</span>
            </div>
            <table className="w-full">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]"><tr>
                {['Asset/Scope', 'Provider', 'Coverage Type', 'Start', 'End', 'SLA', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-600 text-[#64748B] uppercase tracking-wide">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {AMC.map((a, i) => (
                  <tr key={i} className="border-t border-[#F1F5F9] table-row-hover cursor-pointer">
                    <td className="px-4 py-3 text-sm font-500 text-[#172033]">{a.asset}</td>
                    <td className="px-4 py-3 text-sm text-[#64748B]">{a.provider}</td>
                    <td className="px-4 py-3 text-sm text-[#64748B]">{a.coverage}</td>
                    <td className="px-4 py-3 text-sm text-[#64748B]">{a.start}</td>
                    <td className="px-4 py-3 text-sm text-green-600 font-500">{a.end}</td>
                    <td className="px-4 py-3 text-sm text-[#64748B]">{a.sla}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- QR PAGE ----
export function QRPage() {
  const [scanned, setScanned] = useState(false);
  const [code, setCode] = useState('');

  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-xl font-700 text-[#172033]">QR / Barcode</h1>
        <p className="text-sm text-[#64748B] mt-0.5">Scan or enter an asset identifier to view details or raise a service event</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Scan size={16} className="text-[#0B1F3A]" />
            <h3 className="text-sm font-600 text-[#172033]">Scan Asset</h3>
          </div>
          <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg aspect-video flex flex-col items-center justify-center mb-4 bg-[#F8FAFC]">
            <QrCode size={48} className="text-[#CBD5E1] mb-3" />
            <p className="text-sm text-[#64748B]">Camera access required for QR scanning</p>
            <p className="text-xs text-[#94A3B8] mt-1">Point camera at QR code or barcode</p>
          </div>
          <div className="text-center text-xs text-[#94A3B8] mb-4">— or enter code manually —</div>
          <div className="flex gap-2">
            <input
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Enter asset code..."
              className="flex-1 px-3 py-2.5 border border-[#E2E8F0] rounded text-sm outline-none focus:border-[#C9A227]"
            />
            <button
              onClick={() => code && setScanned(true)}
              className="px-4 py-2.5 bg-[#0B1F3A] text-white text-sm font-500 rounded hover:bg-[#102A43] transition-colors"
            >
              Look Up
            </button>
          </div>
        </div>

        {scanned && (
          <div className="bg-white border border-[#C9A227]/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-600 text-[#172033]">Asset Found</h3>
              <StatusBadge status="active" />
            </div>
            <div className="space-y-3 mb-5">
              {[
                { label: 'Asset ID', value: 'AST-0218' },
                { label: 'Name', value: 'HVAC Unit — Block A' },
                { label: 'Location', value: 'Colombo HQ · Zone A' },
                { label: 'Last Serviced', value: '15 Aug 2026' },
                { label: 'Next PM', value: '15 Oct 2026' },
              ].map(f => (
                <div key={f.label} className="flex gap-4">
                  <span className="text-xs text-[#94A3B8] w-28 flex-shrink-0">{f.label}</span>
                  <span className="text-sm text-[#172033] font-500">{f.value}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2.5 bg-[#0B1F3A] text-white text-xs font-500 rounded hover:bg-[#102A43] transition-colors">
                View Asset
              </button>
              <button className="py-2.5 border border-[#C9A227] text-[#C9A227] text-xs font-500 rounded hover:bg-[#C9A227]/5 transition-colors">
                Raise Request
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- CLIENT PORTAL ----
export function ClientPortalPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const REQUESTS = [
    { id: 'SR-2024-1204', desc: 'HVAC Cooling Issue — Block A', priority: 'High', status: 'approved', created: '29 Sep 2026', updated: '10 min ago' },
    { id: 'SR-2024-1198', desc: 'Chiller Shutdown — Level 2', priority: 'Critical', status: 'closed', created: '26 Sep 2026', updated: '3 days ago' },
  ];
  return <ClientDashboard requests={REQUESTS} onNavigate={onNavigate} />;
}

// ---- NOTIFICATIONS ----
export function NotificationsPage() {
  const NOTIFS = [
    { type: 'sla', title: 'SLA Warning: SR-2024-1204', desc: 'Response deadline in 42 minutes for HVAC issue at Colombo HQ.', time: '2 min ago', priority: 'high', read: false },
    { type: 'wo', title: 'Work Order Completed: WO-2024-0847', desc: 'T. Sharma completed maintenance on UPS Bank B. Awaiting review.', time: '28 min ago', priority: 'medium', read: false },
    { type: 'inventory', title: 'Low Stock Alert: Circuit Breaker 32A', desc: 'Current stock (7 units) is below minimum level (10 units) at WH-01.', time: '1 hr ago', priority: 'medium', read: false },
    { type: 'contract', title: 'Contract Expiry: Generator Warranty', desc: 'Generator #3 warranty expires in 45 days (31 Dec 2026). Renewal required.', time: '3 hrs ago', priority: 'low', read: true },
    { type: 'system', title: 'Scheduled Maintenance Window', desc: 'Platform maintenance scheduled for 04 Oct 2026 02:00–04:00 (offline).', time: '5 hrs ago', priority: 'low', read: true },
  ];

  const typeIcon: Record<string, React.ReactNode> = {
    sla: <Clock size={14} className="text-red-600" />,
    wo: <CheckCircle size={14} className="text-green-600" />,
    inventory: <AlertTriangle size={14} className="text-amber-600" />,
    contract: <FileText size={14} className="text-[#0B1F3A]" />,
    system: <Settings size={14} className="text-[#64748B]" />,
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-700 text-[#172033]">Notifications</h1>
          <p className="text-sm text-[#64748B] mt-0.5">3 unread notifications</p>
        </div>
        <button className="text-xs text-[#C9A227] hover:text-[#a8841e] font-500">Mark All Read</button>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-lg divide-y divide-[#F1F5F9]">
        {NOTIFS.map((n, i) => (
          <div key={i} className={`flex gap-3 px-5 py-4 ${!n.read ? 'bg-[#F7EFCF]/20' : ''} hover:bg-[#F8FAFC] transition-colors cursor-pointer`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              n.priority === 'high' ? 'bg-red-50' : n.priority === 'medium' ? 'bg-amber-50' : 'bg-[#F1F5F9]'
            }`}>
              {typeIcon[n.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2">
                <div className="text-sm font-600 text-[#172033] flex-1">{n.title}</div>
                {!n.read && <div className="w-2 h-2 bg-[#C9A227] rounded-full flex-shrink-0 mt-1" />}
              </div>
              <div className="text-xs text-[#64748B] mt-0.5">{n.desc}</div>
              <div className="text-[10px] text-[#94A3B8] mt-1">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- PROFILE PAGE ----
export function ProfilePage() {
  const [tab, setTab] = useState('profile');
  return (
    <div className="p-6 max-w-3xl">
      <PageHeader title="My Profile" subtitle="Manage your account, security settings and preferences"
        tabs={[
          { label: 'Profile', value: 'profile' },
          { label: 'Security', value: 'security' },
          { label: 'Preferences', value: 'preferences' },
          { label: 'Activity', value: 'activity' },
        ]}
        activeTab={tab}
        onTabChange={setTab}
      />
      <div className="mt-5 bg-white border border-[#E2E8F0] rounded-lg p-6">
        {tab === 'profile' && (
          <>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#F1F5F9]">
              <div className="w-16 h-16 rounded-full bg-[#0B1F3A] flex items-center justify-center">
                <span className="text-[#C9A227] text-xl font-700">JM</span>
              </div>
              <div>
                <div className="text-base font-700 text-[#172033]">James Mitchell</div>
                <div className="text-sm text-[#64748B]">Operations Manager · FieldOps Corp</div>
                <div className="text-xs text-[#94A3B8]">james.mitchell@fieldops.com</div>
              </div>
              <button className="ml-auto px-3 py-2 border border-[#E2E8F0] rounded text-xs text-[#64748B] hover:text-[#172033]">Edit Photo</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'First Name', value: 'James' },
                { label: 'Last Name', value: 'Mitchell' },
                { label: 'Email', value: 'james.mitchell@fieldops.com' },
                { label: 'Phone', value: '+94 77 123 4567' },
                { label: 'Role', value: 'Operations Manager' },
                { label: 'Organization', value: 'FieldOps Corp' },
                { label: 'Primary Site', value: 'Colombo HQ' },
                { label: 'Employee ID', value: 'EMP-0001' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-500 text-[#172033] mb-1.5">{f.label}</label>
                  <input defaultValue={f.value} className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded text-sm text-[#172033] outline-none focus:border-[#C9A227] bg-white" />
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-[#F1F5F9] flex justify-end">
              <button className="px-5 py-2.5 bg-[#0B1F3A] text-white text-sm font-500 rounded hover:bg-[#102A43] transition-colors">Save Changes</button>
            </div>
          </>
        )}
        {tab !== 'profile' && (
          <div className="flex items-center justify-center py-12 text-sm text-[#94A3B8]">{tab} settings coming soon.</div>
        )}
      </div>
    </div>
  );
}

// ---- SETTINGS PAGE ----
export function SettingsPage() {
  const [section, setSection] = useState('organization');
  const sections = [
    { key: 'organization', label: 'Organization' },
    { key: 'users', label: 'Users & Roles' },
    { key: 'notifications', label: 'Notification Preferences' },
    { key: 'calendar', label: 'Operating Calendar' },
    { key: 'system', label: 'System Preferences' },
    { key: 'audit', label: 'Audit Configuration' },
  ];
  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-xl font-700 text-[#172033]">Settings</h1>
        <p className="text-sm text-[#64748B] mt-0.5">Configure platform settings, users, roles and preferences</p>
      </div>
      <div className="grid grid-cols-4 gap-5">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-2">
          {sections.map(s => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className={`w-full text-left px-3 py-2.5 rounded text-sm transition-colors ${
                section === s.key ? 'bg-[#F7EFCF] text-[#0B1F3A] font-600' : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#172033]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="col-span-3 bg-white border border-[#E2E8F0] rounded-lg p-6">
          <h2 className="text-base font-700 text-[#172033] mb-5 capitalize">{section.replace('-', ' ')}</h2>
          {section === 'organization' && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Organization Name', value: 'FieldOps Corp' },
                { label: 'Organization Code', value: 'FOC-001' },
                { label: 'Primary Contact', value: 'J. Mitchell' },
                { label: 'Contact Email', value: 'admin@fieldops.com' },
                { label: 'Country', value: 'Sri Lanka' },
                { label: 'Timezone', value: 'Asia/Colombo (UTC+5:30)' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-500 text-[#172033] mb-1.5">{f.label}</label>
                  <input defaultValue={f.value} className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded text-sm outline-none focus:border-[#C9A227] bg-white" />
                </div>
              ))}
              <div className="col-span-2 flex justify-end pt-2">
                <button className="px-5 py-2.5 bg-[#0B1F3A] text-white text-sm font-500 rounded hover:bg-[#102A43]">Save Settings</button>
              </div>
            </div>
          )}
          {section !== 'organization' && (
            <div className="flex items-center justify-center py-12 text-sm text-[#94A3B8]">{section} settings panel.</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- ASSET HIERARCHY ----
export function AssetHierarchyPage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['org', 'SITE-001', 'SITE-001-Z1']));
  const toggle = (key: string) => setExpanded(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  type TreeNode = { key: string; label: string; type: string; count?: number; children?: TreeNode[] };

  const tree: TreeNode[] = [
    { key: 'org', label: 'FieldOps Corp', type: 'org', children: [
      { key: 'SITE-001', label: 'Colombo HQ', type: 'site', count: 214, children: [
        { key: 'SITE-001-Z1', label: 'Zone A — Level 3', type: 'zone', children: [
          { key: 'AST-0218', label: 'HVAC Unit — Block A', type: 'asset', children: [
            { key: 'COMP-001', label: 'Compressor Unit', type: 'component' },
            { key: 'COMP-002', label: 'Air Handler', type: 'component' },
          ]},
        ]},
        { key: 'SITE-001-Z2', label: 'Zone B — Ground Floor', type: 'zone', children: [
          { key: 'AST-0221', label: 'Fire Panel — Lobby', type: 'asset' },
        ]},
      ]},
      { key: 'SITE-002', label: 'Kandy Branch', type: 'site', count: 98 },
    ]}
  ];

  const typeConfig: Record<string, { icon: string; color: string }> = {
    org: { icon: '🏢', color: 'text-[#0B1F3A]' },
    site: { icon: '📍', color: 'text-blue-700' },
    zone: { icon: '🗂', color: 'text-[#64748B]' },
    asset: { icon: '⚙️', color: 'text-[#C9A227]' },
    component: { icon: '🔧', color: 'text-[#94A3B8]' },
  };

  const renderNode = (node: TreeNode, depth = 0): React.ReactNode => (
    <div key={node.key}>
      <div
        onClick={() => node.children && toggle(node.key)}
        className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer hover:bg-[#F8FAFC] transition-colors`}
        style={{ paddingLeft: `${12 + depth * 20}px` }}
      >
        {node.children ? (
          <ChevronRight size={12} className={`text-[#94A3B8] flex-shrink-0 transition-transform ${expanded.has(node.key) ? 'rotate-90' : ''}`} />
        ) : <span className="w-3" />}
        <span className="text-sm">{typeConfig[node.type]?.icon}</span>
        <span className={`text-sm font-500 ${typeConfig[node.type]?.color}`}>{node.label}</span>
        {node.count && <span className="ml-auto text-xs text-[#94A3B8]">{node.count} assets</span>}
      </div>
      {node.children && expanded.has(node.key) && node.children.map(child => renderNode(child, depth + 1))}
    </div>
  );

  return (
    <div className="p-6">
      <PageHeader title="Asset Hierarchy" subtitle="Visual tree of organization, sites, zones, assets and components" />
      <div className="mt-5 grid grid-cols-3 gap-5">
        <div className="col-span-1 bg-white border border-[#E2E8F0] rounded-lg p-2 h-fit">
          <div className="px-3 py-2 border-b border-[#F1F5F9] mb-2">
            <span className="text-xs font-600 text-[#64748B] uppercase tracking-wide">Structure</span>
          </div>
          {tree.map(node => renderNode(node))}
        </div>
        <div className="col-span-2 bg-white border border-[#E2E8F0] rounded-lg p-5">
          <h3 className="text-sm font-600 text-[#172033] mb-4">HVAC Unit — Block A</h3>
          <div className="grid grid-cols-2 gap-y-3 gap-x-6">
            {[
              { label: 'Asset ID', value: 'AST-0218' },
              { label: 'Status', value: <StatusBadge status="active" /> as any },
              { label: 'Location', value: 'Colombo HQ · Zone A' },
              { label: 'Category', value: 'HVAC' },
              { label: 'Components', value: '2 components' },
            ].map(f => (
              <div key={f.label}>
                <div className="text-xs text-[#94A3B8] mb-0.5">{f.label}</div>
                <div className="text-sm font-500 text-[#172033]">{f.value as any}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- INSPECTIONS PAGE ----
export function InspectionsPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const TEMPLATES = [
    { id: 'CHK-001', name: 'HVAC Quarterly Service', items: 8, version: 'v3', lastUsed: '29 Sep 2026' },
    { id: 'CHK-002', name: 'Fire Safety Inspection', items: 14, version: 'v4', lastUsed: '25 Sep 2026' },
    { id: 'CHK-003', name: 'Elevator Monthly Check', items: 10, version: 'v2', lastUsed: '28 Sep 2026' },
    { id: 'CHK-004', name: 'Generator Load Test', items: 6, version: 'v1', lastUsed: '20 Sep 2026' },
  ];
  return (
    <div className="p-6">
      <PageHeader title="Inspections" subtitle="Manage checklist templates and track inspection execution"
        actions={<button className="flex items-center gap-2 px-3 py-2 bg-[#0B1F3A] rounded text-xs text-white font-500"><Plus size={13} /> New Template</button>} />
      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Templates', value: '12' },
          { label: 'Inspections This Month', value: '34' },
          { label: 'Open Findings', value: '7' },
          { label: 'Compliance Rate', value: '97%' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#E2E8F0] rounded-lg px-4 py-3">
            <div className="text-xl font-700 text-[#172033]">{s.value}</div>
            <div className="text-xs text-[#64748B]">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <span className="text-sm font-600 text-[#172033]">Checklist Templates</span>
        </div>
        <table className="w-full">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]"><tr>
            {['Template ID', 'Name', 'Items', 'Version', 'Last Used', ''].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-600 text-[#64748B] uppercase tracking-wide">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {TEMPLATES.map((t, i) => (
              <tr key={i} className="border-t border-[#F1F5F9] table-row-hover cursor-pointer" onClick={() => onNavigate('inspection-detail')}>
                <td className="px-4 py-3 text-sm font-500 text-[#0B1F3A]">{t.id}</td>
                <td className="px-4 py-3 text-sm font-500 text-[#172033]">{t.name}</td>
                <td className="px-4 py-3 text-sm text-[#64748B]">{t.items} items</td>
                <td className="px-4 py-3"><span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-500">{t.version}</span></td>
                <td className="px-4 py-3 text-sm text-[#64748B]">{t.lastUsed}</td>
                <td className="px-4 py-3"><button className="text-xs text-[#64748B] hover:text-[#C9A227]">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---- FORGOT PASSWORD ----
export function ForgotPasswordPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white border border-[#E2E8F0] rounded-xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded bg-[#C9A227] flex items-center justify-center">
            <Shield size={14} className="text-[#071426]" />
          </div>
          <span className="font-700 text-[#172033]">FieldOps <span className="text-[#C9A227]">Nexus</span></span>
        </div>

        {!sent ? (
          <>
            <h1 className="text-xl font-700 text-[#172033] mb-1">Reset Password</h1>
            <p className="text-sm text-[#64748B] mb-6">Enter your email address and we'll send a reset link.</p>
            <div className="mb-4">
              <label className="block text-xs font-500 text-[#172033] mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@organization.com"
                className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded text-sm outline-none focus:border-[#C9A227]" />
            </div>
            <button onClick={() => email && setSent(true)} className="w-full py-2.5 bg-[#0B1F3A] text-white text-sm font-600 rounded hover:bg-[#102A43] transition-colors">
              Send Reset Link
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={22} className="text-green-600" />
            </div>
            <h2 className="text-base font-700 text-[#172033] mb-2">Reset Link Sent</h2>
            <p className="text-sm text-[#64748B] mb-5">Check your inbox at <strong>{email}</strong> for a password reset link.</p>
          </div>
        )}

        <button onClick={() => onNavigate('login')} className="w-full mt-4 text-xs text-[#64748B] hover:text-[#C9A227] transition-colors">
          ← Back to Sign In
        </button>
      </div>
    </div>
  );
}
