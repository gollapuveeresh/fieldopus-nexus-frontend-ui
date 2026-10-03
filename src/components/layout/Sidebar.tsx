import { useState } from 'react';
import {
  LayoutDashboard, MapPin, Box, Wrench, AlertTriangle, ClipboardList,
  Truck, User, Package, FileText, Shield, QrCode, Users, BarChart3,
  ScrollText, Bell, Settings, LogOut, ChevronDown, ChevronRight,
  Zap, Activity, Calendar, Layers, RotateCcw, ArrowLeftRight,
  TrendingUp, Clock, BookOpen, CheckSquare
} from 'lucide-react';
import type { Page, Role, UserSession } from '../../types';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  page?: Page;
  children?: { label: string; page: Page }[];
}

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  role: Role;
  session?: UserSession;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSignOut?: () => void;
}

const auditNavChildren: { label: string; page: Page }[] = [
  { label: 'Audit Dashboard', page: 'audit' },
  { label: 'Audit Logs', page: 'audit-logs' },
  { label: 'Closure Approvals', page: 'audit-closures' },
  { label: 'Change History', page: 'audit-history' },
  { label: 'Evidence / Audit Exports', page: 'audit-evidence' },
  { label: 'Audit Reports', page: 'audit-reports' },
];

// ── Operations Manager nav (full platform access)
const operationsNavGroups: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={16} />, page: 'dashboard' },
  {
    label: 'Operations', icon: <Zap size={16} />,
    children: [
      { label: 'Service Requests', page: 'service-requests' },
      { label: 'Work Orders', page: 'work-orders' },
      { label: 'Dispatch Board', page: 'dispatch' },
      { label: 'Technician Workspace', page: 'technician' },
    ],
  },
  {
    label: 'Assets', icon: <Box size={16} />,
    children: [
      { label: 'Asset Manager Dashboard', page: 'asset-manager-dashboard' },
      { label: 'Asset Registry', page: 'assets' },
      { label: 'Asset Hierarchy', page: 'asset-hierarchy' },
    ],
  },
  {
    label: 'Maintenance', icon: <Wrench size={16} />,
    children: [
      { label: 'Overview', page: 'maintenance' },
      { label: 'Maintenance Plans', page: 'maintenance-plans' },
      { label: 'Schedules', page: 'maintenance-schedules' },
      { label: 'PM Calendar', page: 'maintenance-calendar' },
    ],
  },
  { label: 'Incidents', icon: <AlertTriangle size={16} />, page: 'incidents' },
  {
    label: 'Inspections', icon: <CheckSquare size={16} />,
    children: [
      { label: 'Checklists', page: 'inspections' },
      { label: 'Inspection Detail', page: 'inspection-detail' },
    ],
  },
  {
    label: 'Inventory', icon: <Package size={16} />,
    children: [
      { label: 'Overview', page: 'inventory' },
      { label: 'Parts', page: 'inventory-parts' },
      { label: 'Stock', page: 'inventory-stock' },
      { label: 'Stock Movements', page: 'inventory-movements' },
    ],
  },
  {
    label: 'Contracts', icon: <FileText size={16} />,
    children: [
      { label: 'Overview', page: 'contracts' },
      { label: 'Warranty', page: 'contracts-warranty' },
      { label: 'AMC', page: 'contracts-amc' },
    ],
  },
  {
    label: 'SLA', icon: <Clock size={16} />,
    children: [
      { label: 'SLA Dashboard', page: 'sla' },
      { label: 'SLA Profiles', page: 'sla-profiles' },
      { label: 'Breaches', page: 'sla-breaches' },
    ],
  },
  { label: 'Sites & Locations', icon: <MapPin size={16} />, page: 'sites' },
  { label: 'QR / Barcode', icon: <QrCode size={16} />, page: 'qr-barcode' },
  { label: 'Client Portal', icon: <Users size={16} />, page: 'client-portal' },
  { label: 'Reports & Analytics', icon: <BarChart3 size={16} />, page: 'reports' },
  {
    label: 'AUDIT & COMPLIANCE',
    icon: <ScrollText size={16} />,
    children: auditNavChildren,
  },
];

// ── Asset Manager nav (focused on asset management)
const assetManagerNavGroups: NavItem[] = [
  { label: 'Asset Manager Dashboard', icon: <LayoutDashboard size={16} />, page: 'asset-manager-dashboard' },
  {
    label: 'Assets', icon: <Box size={16} />,
    children: [
      { label: 'Asset Registry', page: 'assets' },
      { label: 'Asset Hierarchy', page: 'asset-hierarchy' },
    ],
  },
  {
    label: 'Maintenance', icon: <Wrench size={16} />,
    children: [
      { label: 'Maintenance History', page: 'maintenance' },
      { label: 'Maintenance Plans', page: 'maintenance-plans' },
    ],
  },
  {
    label: 'Contracts', icon: <FileText size={16} />,
    children: [
      { label: 'Warranty', page: 'contracts-warranty' },
      { label: 'AMC', page: 'contracts-amc' },
    ],
  },
  { label: 'QR / Barcode', icon: <QrCode size={16} />, page: 'qr-barcode' },
];

// ── Field Technician nav
const technicianNavGroups: NavItem[] = [
  { label: 'Technician Workspace', icon: <Wrench size={16} />, page: 'technician' },
  {
    label: 'My Jobs', icon: <ClipboardList size={16} />,
    children: [
      { label: 'All My Jobs', page: 'work-orders' },
      { label: 'Current Job', page: 'technician-job-detail' },
    ],
  },
  { label: 'Inspections', icon: <CheckSquare size={16} />, page: 'inspections' },
  {
    label: 'Parts / Inventory', icon: <Package size={16} />,
    children: [
      { label: 'Parts Lookup', page: 'inventory-parts' },
      { label: 'Movements', page: 'inventory-movements' },
    ],
  },
  { label: 'QR / Barcode', icon: <QrCode size={16} />, page: 'qr-barcode' },
  { label: 'Notifications', icon: <Bell size={16} />, page: 'notifications' },
  { label: 'Settings', icon: <Settings size={16} />, page: 'settings' },
];

// ── Maintenance Planner nav
const maintenancePlannerNavGroups: NavItem[] = [
  { label: 'Maintenance Planner', icon: <LayoutDashboard size={16} />, page: 'maintenance-planner-dashboard' },
  {
    label: 'Maintenance', icon: <Wrench size={16} />,
    children: [
      { label: 'Maintenance Planner Dashboard', page: 'maintenance-planner-dashboard' },
      { label: 'PM Plans', page: 'maintenance-plans' },
      { label: 'Schedules', page: 'maintenance-schedules' },
      { label: 'PM Calendar', page: 'maintenance-calendar' },
    ],
  },
  {
    label: 'Work Orders', icon: <ClipboardList size={16} />,
    children: [
      { label: 'All Work Orders', page: 'work-orders' },
      { label: 'Create Work Order', page: 'work-order-create' },
    ],
  },
  {
    label: 'Assets', icon: <Box size={16} />,
    children: [
      { label: 'Asset Registry', page: 'assets' },
      { label: 'Asset Hierarchy', page: 'asset-hierarchy' },
    ],
  },
];

// Client demo navigation only exposes existing client-facing destinations.
const clientNavGroups: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={16} />, page: 'client-portal' },
  { label: 'Service Requests', icon: <ClipboardList size={16} />, page: 'service-requests' },
  { label: 'Work Orders', icon: <Wrench size={16} />, page: 'work-orders' },
  { label: 'Assets', icon: <Box size={16} />, page: 'assets' },
];

// ── Storekeeper nav (inventory operations only)
const storesNavGroups: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={16} />, page: 'inventory' },
  {
    label: 'Inventory',
    icon: <Package size={16} />,
    children: [
      { label: 'Items', page: 'inventory-parts' },
      { label: 'Stock Levels', page: 'inventory-stock' },
    ],
  },
  {
    label: 'Stock Transactions',
    icon: <ArrowLeftRight size={16} />,
    children: [{ label: 'Stock Movement', page: 'inventory-movements' }],
  },
];

// ── Auditor nav (read-only audit access)
const auditorNavGroups: NavItem[] = [
  {
    label: 'AUDIT & COMPLIANCE',
    icon: <Shield size={16} />,
    children: auditNavChildren,
  },
];

export default function Sidebar({ currentPage, onNavigate, role, session, collapsed, onToggleCollapse, onSignOut }: SidebarProps) {
  const navGroups =
    role === 'asset-manager'       ? assetManagerNavGroups :
    role === 'maintenance-planner' ? maintenancePlannerNavGroups :
    role === 'technician'          ? technicianNavGroups :
    role === 'stores'              ? storesNavGroups :
    role === 'auditor'             ? auditorNavGroups :
    role === 'client'              ? clientNavGroups :
    operationsNavGroups;
  const defaultExpanded =
    role === 'asset-manager'       ? ['Assets', 'Maintenance', 'Contracts'] :
    role === 'maintenance-planner' ? ['Maintenance', 'Work Orders', 'Assets'] :
    role === 'technician'          ? ['My Jobs', 'Parts / Inventory'] :
    role === 'stores'              ? ['Inventory', 'Stock Transactions'] :
    role === 'auditor'             ? ['AUDIT & COMPLIANCE'] :
    role === 'client'              ? [] :
    ['Operations', 'Assets', 'Maintenance'];

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(defaultExpanded)
  );

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const isActive = (page?: Page) => page === currentPage;
  const isGroupActive = (item: NavItem) => {
    if (item.page) return item.page === currentPage;
    return item.children?.some(c => c.page === currentPage) ?? false;
  };

  return (
    <aside
      className={`flex flex-col h-screen bg-[#0B1F3A] transition-all duration-300 flex-shrink-0 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
      style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
        <div className="flex-shrink-0 w-8 h-8 rounded bg-[#C9A227] flex items-center justify-center">
          <Activity size={16} className="text-[#071426]" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-700 text-sm leading-tight tracking-wide">FieldOps</div>
            <div className="text-[#C9A227] text-[10px] font-600 tracking-widest uppercase">Nexus</div>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="ml-auto text-white/40 hover:text-white/80 transition-colors"
          aria-label="Toggle sidebar"
        >
          <ChevronRight size={14} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll py-3 px-2 space-y-0.5">
        {navGroups.map((item) => {
          if (item.page) {
            return (
              <button
                key={item.label}
                onClick={() => onNavigate(item.page!)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-all duration-150 text-left ${
                  isActive(item.page)
                    ? 'nav-active text-white font-500'
                    : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                }`}
              >
                <span className={isActive(item.page) ? 'text-[#C9A227]' : ''}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          }

          const expanded = expandedGroups.has(item.label);
          const groupActive = isGroupActive(item);

          return (
            <div key={item.label}>
              <button
                onClick={() => !collapsed && toggleGroup(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-all duration-150 text-left ${
                  groupActive && !expanded
                    ? 'text-white/90 font-500'
                    : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                }`}
              >
                <span className={groupActive ? 'text-[#C9A227]' : ''}>{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    <ChevronDown
                      size={12}
                      className={`text-white/40 transition-transform ${expanded ? '' : '-rotate-90'}`}
                    />
                  </>
                )}
              </button>
              {!collapsed && expanded && (
                <div className="ml-3 pl-3 border-l border-white/[0.06] mt-0.5 mb-1 space-y-0.5">
                  {item.children?.map(child => (
                    <button
                      key={child.page}
                      onClick={() => onNavigate(child.page)}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all duration-150 ${
                        isActive(child.page)
                          ? 'nav-active text-white font-500'
                          : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                      }`}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/[0.06] p-2 space-y-0.5">
        <button
          hidden={role === 'auditor'}
          onClick={() => onNavigate('notifications')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-all text-left ${
            currentPage === 'notifications' ? 'nav-active text-white' : 'text-white/60 hover:text-white/90 hover:bg-white/5'
          }`}
        >
          <Bell size={16} />
          {!collapsed && <span>Notifications</span>}
          {!collapsed && role !== 'stores' && (
            <span className="ml-auto bg-[#DC2626] text-white text-[10px] font-700 rounded-full w-4 h-4 flex items-center justify-center">
              5
            </span>
          )}
        </button>
        {role !== 'client' && role !== 'stores' && role !== 'auditor' && (
          <button
            onClick={() => onNavigate('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-all text-left ${
              currentPage === 'settings' ? 'nav-active text-white' : 'text-white/60 hover:text-white/90 hover:bg-white/5'
            }`}
          >
            <Settings size={16} />
            {!collapsed && <span>Settings</span>}
          </button>
        )}
        <button
          hidden={role === 'auditor'}
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-all text-left ${
            currentPage === 'profile' ? 'nav-active text-white' : 'text-white/60 hover:text-white/90 hover:bg-white/5'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-[#C9A227] flex items-center justify-center flex-shrink-0">
            <span className="text-[#071426] text-[9px] font-700">{session?.initials ?? 'JM'}</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-white/80 text-xs font-500 truncate">{session?.name ?? 'James Mitchell'}</div>
              <div className="text-white/40 text-[10px] truncate">{session?.roleLabel ?? 'Operations Manager'}</div>
            </div>
          )}
        </button>
        {onSignOut && !collapsed && (
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-all text-left text-white/40 hover:text-red-400 hover:bg-white/5"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}
