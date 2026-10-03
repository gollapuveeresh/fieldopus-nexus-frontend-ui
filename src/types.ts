export type Page =
  | 'landing'
  | 'login'
  | 'client-register'
  | 'forgot-password'
  | 'dashboard'
  | 'sites'
  | 'site-detail'
  | 'assets'
  | 'asset-create'
  | 'asset-detail'
  | 'asset-hierarchy'
  | 'maintenance'
  | 'maintenance-plans'
  | 'maintenance-schedules'
  | 'maintenance-calendar'
  | 'incidents'
  | 'incident-detail'
  | 'service-requests'
  | 'service-request-create'
  | 'service-request-detail'
  | 'work-orders'
  | 'work-order-create'
  | 'work-order-detail'
  | 'dispatch'
  | 'technician'
  | 'technician-job-detail'
  | 'inspections'
  | 'inspection-detail'
  | 'inventory'
  | 'inventory-parts'
  | 'inventory-stock'
  | 'inventory-movements'
  | 'contracts'
  | 'contracts-warranty'
  | 'contracts-amc'
  | 'sla'
  | 'sla-profiles'
  | 'sla-breaches'
  | 'qr-barcode'
  | 'client-portal'
  | 'reports'
  | 'audit'
  | 'audit-logs'
  | 'audit-closures'
  | 'audit-history'
  | 'audit-evidence'
  | 'audit-reports'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'asset-manager-dashboard'
  | 'maintenance-planner-dashboard'
  | 'super-admin-dashboard';

export type Role = 'super-admin' | 'operations' | 'asset-manager' | 'maintenance-planner' | 'technician' | 'stores' | 'service-manager' | 'client' | 'auditor';

export interface UserSession {
  email: string;
  name: string;
  initials: string;
  roleLabel: string;
  role: Role;
  homePage: Page;
}
