import { useState } from 'react';
import type { Page, Role, UserSession } from './types';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ClientRegistrationPage from './pages/ClientRegistrationPage';
import DashboardPage from './pages/DashboardPage';
import AssetsPage from './pages/AssetsPage';
import AssetDetailPage from './pages/AssetDetailPage';
import WorkOrdersPage from './pages/WorkOrdersPage';
import WorkOrderDetailPage from './pages/WorkOrderDetailPage';
import MaintenancePage from './pages/MaintenancePage';
import ServiceRequestsPage from './pages/ServiceRequestsPage';
import DispatchPage from './pages/DispatchPage';
import TechnicianPage from './pages/TechnicianPage';
import InventoryPage from './pages/InventoryPage';
import SLAPage from './pages/SLAPage';
import ReportsPage from './pages/ReportsPage';
import AuditPage from './pages/AuditPage';
import AssetManagerDashboard from './pages/AssetManagerDashboard';
import MaintenancePlannerDashboard from './pages/MaintenancePlannerDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SiteLocationMaster from './pages/SiteLocationMaster';
import {
  IncidentsPage, ContractsPage, QRPage,
  ClientPortalPage, NotificationsPage, ProfilePage, SettingsPage,
  AssetHierarchyPage, InspectionsPage, ForgotPasswordPage
} from './pages/OtherPages';

const APP_PAGES: Page[] = [
  'dashboard', 'super-admin-dashboard', 'asset-manager-dashboard', 'maintenance-planner-dashboard', 'sites', 'site-detail', 'assets', 'asset-create', 'asset-detail', 'asset-hierarchy',
  'maintenance', 'maintenance-plans', 'maintenance-schedules', 'maintenance-calendar',
  'incidents', 'incident-detail', 'service-requests', 'service-request-create', 'service-request-detail',
  'work-orders', 'work-order-create', 'work-order-detail', 'dispatch',
  'technician', 'technician-job-detail', 'inspections', 'inspection-detail',
  'inventory', 'inventory-parts', 'inventory-stock', 'inventory-movements',
  'contracts', 'contracts-warranty', 'contracts-amc',
  'sla', 'sla-profiles', 'sla-breaches', 'qr-barcode',
  'client-portal', 'reports', 'audit', 'audit-logs', 'audit-closures', 'audit-history', 'audit-evidence', 'audit-reports',
  'notifications', 'profile', 'settings',
];

const SESSION_KEY = 'fieldops_session';
const AUDIT_PAGES = new Set<Page>([
  'audit',
  'audit-logs',
  'audit-closures',
  'audit-history',
  'audit-evidence',
  'audit-reports',
]);

const RECOGNIZED_ROLES = new Set<Role>([
  'super-admin',
  'operations',
  'asset-manager',
  'maintenance-planner',
  'technician',
  'stores',
  'service-manager',
  'client',
  'auditor',
]);

interface StoredSession {
  session: UserSession | null;
  invalid: boolean;
}

function isUserSession(value: unknown): value is UserSession {
  if (!value || typeof value !== 'object') return false;
  const session = value as Partial<UserSession>;
  return (
    typeof session.email === 'string' &&
    typeof session.name === 'string' &&
    typeof session.initials === 'string' &&
    typeof session.roleLabel === 'string' &&
    typeof session.role === 'string' &&
    RECOGNIZED_ROLES.has(session.role as Role) &&
    typeof session.homePage === 'string' &&
    APP_PAGES.includes(session.homePage as Page)
  );
}

// Frontend demo authentication only; this is not production authentication or authorization.
function loadSession(): StoredSession {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return { session: null, invalid: false };
    const parsed: unknown = JSON.parse(raw);
    if (isUserSession(parsed)) return { session: parsed, invalid: false };
    localStorage.removeItem(SESSION_KEY);
    return { session: null, invalid: true };
  } catch {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // Storage may be unavailable; continue without a restored demo session.
    }
    return { session: null, invalid: true };
  }
}

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Restore session from localStorage; if one exists start on their home page
  const [storedSession] = useState<StoredSession>(() => loadSession());
  const [session, setSession] = useState<UserSession | null>(storedSession.session);
  const [page, setPage] = useState<Page>(() =>
    storedSession.invalid ? 'login' : storedSession.session?.homePage ?? 'landing'
  );

  const navigate = (target: Page) => {
    setPage(target);
    setMobileMenuOpen(false);
  };

  const handleLogin = (s: UserSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    setSession(s);
    navigate(s.homePage);
  };

  const handleSignOut = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    navigate('login');
  };

  // Route protection: each role stays on their home when trying to access another role's home.
  const resolvedPage: Page = (() => {
    if (session?.role === 'super-admin' && page !== 'super-admin-dashboard') return 'super-admin-dashboard';
    if (page === 'super-admin-dashboard' && session?.role !== 'super-admin') return session?.homePage ?? 'login';
    if (session?.role === 'client' && page === 'dashboard') return 'client-portal';
    if (session?.role === 'asset-manager' && page === 'dashboard') return 'asset-manager-dashboard';
    if (session?.role === 'maintenance-planner' && page === 'dashboard') return 'maintenance-planner-dashboard';
    if (session?.role === 'technician' && (page === 'dashboard' || page === 'asset-manager-dashboard' || page === 'maintenance-planner-dashboard')) return 'technician';
    if (session?.role === 'stores' && page !== 'inventory') return 'inventory';
    if (session?.role === 'auditor' && !AUDIT_PAGES.has(page)) return 'audit';
    return page;
  })();

  const PUBLIC_PAGES = new Set<Page>([
    'landing',
    'asset-management',
    'service-management',
    'work-order-management',
    'inventory-management',
    'maintenance-management',
    'workforce-management',
    'analytics-reporting',
    'audit-traceability',
    'manufacturing',
    'facilities',
    'enterprise-operations',
  ]);

  if (PUBLIC_PAGES.has(resolvedPage)) return <LandingPage page={resolvedPage} onNavigate={navigate} />;
  if (resolvedPage === 'login') return <LoginPage onLogin={handleLogin} onNavigate={navigate} />;
  if (resolvedPage === 'client-register') return <ClientRegistrationPage onRegister={handleLogin} onNavigate={navigate} />;
  if (resolvedPage === 'forgot-password') return <ForgotPasswordPage onNavigate={navigate} />;
  if (resolvedPage === 'super-admin-dashboard') {
    return <SuperAdminDashboard session={session} onSignOut={handleSignOut} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Sidebar — desktop */}
      <div className="hidden md:block flex-shrink-0">
        <Sidebar
          currentPage={resolvedPage}
          onNavigate={navigate}
          role={session?.role ?? 'operations'}
          session={session ?? undefined}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onSignOut={handleSignOut}
        />
      </div>

      {/* Mobile overlay sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 z-40 md:hidden">
            <Sidebar
              currentPage={resolvedPage}
              onNavigate={navigate}
              role={session?.role ?? 'operations'}
              session={session ?? undefined}
              collapsed={false}
              onToggleCollapse={() => setMobileMenuOpen(false)}
              onSignOut={handleSignOut}
            />
          </div>
        </>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentPage={resolvedPage}
          onNavigate={navigate}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          mobileMenuOpen={mobileMenuOpen}
          session={session ?? undefined}
          onSignOut={handleSignOut}
        />
        <main className="flex-1 overflow-y-auto">
          <PageRenderer page={resolvedPage} navigate={navigate} session={session} />
        </main>
      </div>
    </div>
  );
}

function PageRenderer({ page, navigate, session }: { page: Page; navigate: (p: Page) => void; session: UserSession | null }) {
  switch (page) {
    case 'dashboard':
      return <DashboardPage onNavigate={navigate} />;
    case 'super-admin-dashboard':
      return <SuperAdminDashboard session={session} onSignOut={() => navigate('login')} />;
    case 'asset-manager-dashboard':
      return <AssetManagerDashboard onNavigate={navigate} />;
    case 'maintenance-planner-dashboard':
      return <MaintenancePlannerDashboard onNavigate={navigate} />;
    case 'sites':
      return <SiteLocationMaster />;
    case 'site-detail':
      return <SiteLocationMaster detail />;
    case 'assets':
      return <AssetsPage onNavigate={navigate} />;
    case 'asset-create':
      return <AssetCreatePage onNavigate={navigate} />;
    case 'asset-detail':
      return <AssetDetailPage onNavigate={navigate} />;
    case 'asset-hierarchy':
      return <AssetHierarchyPage />;
    case 'maintenance':
    case 'maintenance-plans':
    case 'maintenance-schedules':
    case 'maintenance-calendar':
      return <MaintenancePage onNavigate={navigate} currentPage={page} />;
    case 'incidents':
    case 'incident-detail':
      return <IncidentsPage onNavigate={navigate} />;
    case 'service-requests':
    case 'service-request-create':
    case 'service-request-detail':
      return <ServiceRequestsPage onNavigate={navigate} currentPage={page} />;
    case 'work-orders':
    case 'work-order-create':
      return <WorkOrdersPage onNavigate={navigate} />;
    case 'work-order-detail':
      return <WorkOrderDetailPage onNavigate={navigate} />;
    case 'dispatch':
      return <DispatchPage />;
    case 'technician':
    case 'technician-job-detail':
      return <TechnicianPage onNavigate={navigate} currentPage={page} />;
    case 'inspections':
    case 'inspection-detail':
      return <InspectionsPage onNavigate={navigate} />;
    case 'inventory':
    case 'inventory-parts':
    case 'inventory-stock':
    case 'inventory-movements':
      return <InventoryPage onNavigate={navigate} currentPage={page} />;
    case 'contracts':
    case 'contracts-warranty':
    case 'contracts-amc':
      return <ContractsPage onNavigate={navigate} currentPage={page} />;
    case 'sla':
    case 'sla-profiles':
    case 'sla-breaches':
      return <SLAPage onNavigate={navigate} currentPage={page} />;
    case 'qr-barcode':
      return <QRPage />;
    case 'client-portal':
      return <ClientPortalPage onNavigate={navigate} />;
    case 'reports':
      return <ReportsPage />;
    case 'audit':
    case 'audit-logs':
    case 'audit-closures':
    case 'audit-history':
    case 'audit-evidence':
    case 'audit-reports':
      return <AuditPage currentPage={page} />;
    case 'notifications':
      return <NotificationsPage />;
    case 'profile':
      return <ProfilePage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="text-6xl font-800 text-[#E2E8F0] mb-4">404</div>
          <div className="text-lg font-600 text-[#172033] mb-2">Page Not Found</div>
          <button onClick={() => navigate(session?.homePage ?? 'dashboard')} className="mt-4 px-4 py-2 bg-[#0B1F3A] text-white text-sm font-500 rounded hover:bg-[#102A43] transition-colors">
            Return to Dashboard
          </button>
        </div>
      );
  }
}

function AssetCreatePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [section, setSection] = useState('basic');
  return (
    <div className="p-6 max-w-3xl">
      <div className="bg-white border border-[#E2E8F0] rounded-lg">
        <div className="px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="text-base font-700 text-[#172033]">Add New Asset</h2>
          <p className="text-sm text-[#64748B] mt-0.5">Register a new physical asset in the system</p>
        </div>
        {/* Section tabs */}
        <div className="flex border-b border-[#E2E8F0] px-6">
          {[
            { key: 'basic', label: 'Basic Info' },
            { key: 'location', label: 'Location' },
            { key: 'purchase', label: 'Purchase' },
            { key: 'warranty', label: 'Warranty' },
          ].map(s => (
            <button key={s.key} onClick={() => setSection(s.key)}
              className={`px-4 py-2.5 text-sm font-500 border-b-2 -mb-px transition-colors ${
                section === s.key ? 'border-[#C9A227] text-[#0B1F3A]' : 'border-transparent text-[#64748B] hover:text-[#172033]'
              }`}>{s.label}</button>
          ))}
        </div>
        <div className="p-6">
          {section === 'basic' && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Asset Name', placeholder: 'e.g. HVAC Unit — Block A', required: true },
                { label: 'Asset Category', type: 'select', options: ['HVAC', 'Electrical', 'Mechanical', 'Safety', 'Controls', 'Plumbing'], required: true },
                { label: 'Manufacturer', placeholder: 'e.g. Daikin Industries' },
                { label: 'Model', placeholder: 'e.g. VRV-IV Series' },
                { label: 'Serial Number', placeholder: 'e.g. DK20240218', required: true },
                { label: 'Asset Tag / Barcode', placeholder: 'e.g. TAG-A218' },
                { label: 'Commission Date', type: 'date' },
                { label: 'Status', type: 'select', options: ['Active', 'Under Maintenance', 'Out of Service'] },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-500 text-[#172033] mb-1.5">
                    {f.label} {f.required && <span className="text-red-500">*</span>}
                  </label>
                  {f.type === 'select' ? (
                    <select className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded text-sm outline-none focus:border-[#C9A227] bg-white">
                      <option value="">Select...</option>
                      {f.options?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type || 'text'} placeholder={f.placeholder}
                      className="w-full px-3 py-2.5 border border-[#E2E8F0] rounded text-sm placeholder-[#94A3B8] outline-none focus:border-[#C9A227]" />
                  )}
                </div>
              ))}
            </div>
          )}
          {section !== 'basic' && (
            <div className="flex items-center justify-center py-12 text-sm text-[#94A3B8]">{section} fields</div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-[#F1F5F9] flex justify-between">
          <button onClick={() => onNavigate('assets')} className="px-4 py-2 border border-[#E2E8F0] rounded text-sm text-[#64748B] hover:text-[#172033]">
            Cancel
          </button>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-[#E2E8F0] rounded text-sm text-[#64748B] hover:text-[#172033]">Save Draft</button>
            <button onClick={() => onNavigate('asset-detail')} className="px-5 py-2 bg-[#0B1F3A] text-white text-sm font-600 rounded hover:bg-[#102A43]">
              Save Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
