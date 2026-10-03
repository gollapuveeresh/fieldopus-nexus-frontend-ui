import { useState } from 'react';
import { Search, Bell, HelpCircle, ChevronDown, Building2, Menu, X, LogOut, User, Settings } from 'lucide-react';
import type { Page, UserSession } from '../../types';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onMenuToggle: () => void;
  mobileMenuOpen: boolean;
  session?: UserSession;
  onSignOut?: () => void;
}

const breadcrumbMap: Partial<Record<Page, { label: string; parent?: { label: string; page: Page } }>> = {
  dashboard: { label: 'Operations Dashboard' },
  sites: { label: 'Sites & Locations' },
  'site-detail': { label: 'Site Detail', parent: { label: 'Sites', page: 'sites' } },
  'asset-manager-dashboard': { label: 'Asset Manager Dashboard', parent: { label: 'Assets', page: 'assets' } },
  'maintenance-planner-dashboard': { label: 'Maintenance Planner Dashboard', parent: { label: 'Maintenance', page: 'maintenance' } },
  assets: { label: 'Asset Registry' },
  'asset-create': { label: 'Create Asset', parent: { label: 'Assets', page: 'assets' } },
  'asset-detail': { label: 'Asset Detail', parent: { label: 'Assets', page: 'assets' } },
  'asset-hierarchy': { label: 'Asset Hierarchy', parent: { label: 'Assets', page: 'assets' } },
  maintenance: { label: 'Maintenance Overview' },
  'maintenance-plans': { label: 'Maintenance Plans', parent: { label: 'Maintenance', page: 'maintenance' } },
  'maintenance-schedules': { label: 'Schedules', parent: { label: 'Maintenance', page: 'maintenance' } },
  'maintenance-calendar': { label: 'PM Calendar', parent: { label: 'Maintenance', page: 'maintenance' } },
  incidents: { label: 'Incidents' },
  'incident-detail': { label: 'Incident Detail', parent: { label: 'Incidents', page: 'incidents' } },
  'service-requests': { label: 'Service Requests' },
  'service-request-create': { label: 'New Request', parent: { label: 'Service Requests', page: 'service-requests' } },
  'service-request-detail': { label: 'Request Detail', parent: { label: 'Service Requests', page: 'service-requests' } },
  'work-orders': { label: 'Work Orders' },
  'work-order-create': { label: 'Create Work Order', parent: { label: 'Work Orders', page: 'work-orders' } },
  'work-order-detail': { label: 'Work Order Detail', parent: { label: 'Work Orders', page: 'work-orders' } },
  dispatch: { label: 'Dispatch Board' },
  technician: { label: 'Technician Workspace' },
  inspections: { label: 'Inspections' },
  inventory: { label: 'Store & Inventory' },
  'inventory-parts': { label: 'Items', parent: { label: 'Store & Inventory', page: 'inventory' } },
  'inventory-stock': { label: 'Stock Levels', parent: { label: 'Store & Inventory', page: 'inventory' } },
  'inventory-movements': { label: 'Stock Movement', parent: { label: 'Store & Inventory', page: 'inventory' } },
  contracts: { label: 'Contracts' },
  'contracts-warranty': { label: 'Warranty', parent: { label: 'Contracts', page: 'contracts' } },
  'contracts-amc': { label: 'AMC', parent: { label: 'Contracts', page: 'contracts' } },
  sla: { label: 'SLA Dashboard' },
  'sla-profiles': { label: 'SLA Profiles', parent: { label: 'SLA', page: 'sla' } },
  'sla-breaches': { label: 'SLA Breaches', parent: { label: 'SLA', page: 'sla' } },
  'qr-barcode': { label: 'QR / Barcode' },
  'client-portal': { label: 'Client Portal' },
  reports: { label: 'Reports & Analytics' },
  audit: { label: 'Audit & Compliance' },
  'audit-logs': { label: 'Audit Logs', parent: { label: 'Audit & Compliance', page: 'audit' } },
  'audit-closures': { label: 'Closure Approvals', parent: { label: 'Audit & Compliance', page: 'audit' } },
  'audit-history': { label: 'Change History', parent: { label: 'Audit & Compliance', page: 'audit' } },
  'audit-evidence': { label: 'Evidence / Audit Exports', parent: { label: 'Audit & Compliance', page: 'audit' } },
  'audit-reports': { label: 'Audit Reports', parent: { label: 'Audit & Compliance', page: 'audit' } },
  notifications: { label: 'Notifications' },
  profile: { label: 'My Profile' },
  settings: { label: 'Settings' },
};

export default function Header({ currentPage, onNavigate, onMenuToggle, mobileMenuOpen, session, onSignOut }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const bc = breadcrumbMap[currentPage];

  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] flex items-center px-4 gap-4 flex-shrink-0 z-20">
      {/* Mobile menu */}
      <button
        onClick={onMenuToggle}
        className="md:hidden text-[#64748B] hover:text-[#172033] transition-colors"
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
        {bc?.parent && (
          <>
            <button
              onClick={() => onNavigate(bc.parent!.page)}
              className="text-[#64748B] hover:text-[#C9A227] transition-colors whitespace-nowrap"
            >
              {bc.parent.label}
            </button>
            <span className="text-[#CBD5E1]">/</span>
          </>
        )}
        <span className="text-[#172033] font-600 truncate">{bc?.label ?? 'FieldOps Nexus'}</span>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        {searchOpen ? (
          <div className="flex items-center gap-2 bg-[#F1F5F9] rounded border border-[#E2E8F0] px-3 py-1.5">
            <Search size={14} className="text-[#64748B]" />
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={session?.role === 'auditor' ? 'Search audit events...' : 'Search assets, work orders, sites...'}
              className="bg-transparent text-sm text-[#172033] placeholder-[#94A3B8] outline-none w-64"
              onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
            />
            <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
              <X size={12} className="text-[#94A3B8]" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 text-[#64748B] hover:text-[#172033] transition-colors text-sm"
          >
            <Search size={16} />
            <span className="hidden lg:inline text-xs text-[#94A3B8]">⌘K</span>
          </button>
        )}

        {/* Site selector */}
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#F1F5F9] rounded border border-[#E2E8F0] text-xs text-[#64748B] hover:text-[#172033] transition-colors">
          <Building2 size={13} />
          <span>All Sites</span>
          <ChevronDown size={11} />
        </button>

        {/* Help */}
        <button className="text-[#64748B] hover:text-[#172033] transition-colors hidden md:block">
          <HelpCircle size={16} />
        </button>

        {/* Notifications */}
        <button
          hidden={session?.role === 'auditor'}
          onClick={() => onNavigate('notifications')}
          className="relative text-[#64748B] hover:text-[#172033] transition-colors"
        >
          <Bell size={16} />
          {session?.role !== 'stores' && (
            <span className="absolute -top-1 -right-1 bg-[#DC2626] text-white text-[9px] font-700 rounded-full w-3.5 h-3.5 flex items-center justify-center">5</span>
          )}
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2"
          >
            <div className="w-7 h-7 rounded-full bg-[#0B1F3A] flex items-center justify-center">
              <span className="text-[#C9A227] text-[10px] font-700">{session?.initials ?? 'JM'}</span>
            </div>
            <ChevronDown size={12} className="text-[#64748B] hidden md:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg border border-[#E2E8F0] shadow-lg py-1 z-50">
              <div className="px-3 py-2 border-b border-[#F1F5F9]">
                <div className="text-xs font-600 text-[#172033]">{session?.name ?? 'James Mitchell'}</div>
                <div className="text-[10px] text-[#64748B]">{session?.roleLabel ?? 'Operations Manager'}</div>
                <div className="text-[9px] text-[#94A3B8] mt-0.5 truncate">{session?.email ?? ''}</div>
              </div>
              {[
                ...(session?.role === 'auditor'
                  ? []
                  : [{ label: 'My Profile', icon: <User size={13} />, page: 'profile' as Page }]),
                ...(session?.role === 'client' || session?.role === 'stores' || session?.role === 'auditor'
                  ? []
                  : [{ label: 'Settings', icon: <Settings size={13} />, page: 'settings' as Page }]),
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => { onNavigate(item.page); setProfileOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#172033] transition-colors"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <div className="border-t border-[#F1F5F9] mt-1">
                <button
                  onClick={() => { setProfileOpen(false); onSignOut ? onSignOut() : onNavigate('login'); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                >
                  <LogOut size={13} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
