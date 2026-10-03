import {
  AlertCircle,
  AlertTriangle,
  Box,
  CalendarClock,
  CheckCircle,
  ChevronRight,
  CircleCheck,
  ClipboardCheck,
  Clock,
  FileClock,
  FileText,
  History,
  ListChecks,
  MapPin,
  MessageSquare,
  Plus,
  RefreshCw,
  ShieldCheck,
  Wrench,
  X,
} from 'lucide-react';
import {
  createElement,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import DataTable from '../components/ui/DataTable';
import FilterBar, { SelectFilter } from '../components/ui/FilterBar';
import KpiCard from '../components/ui/KpiCard';
import PageHeader from '../components/ui/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
import type { Page } from '../types';

interface ClientRequest extends Record<string, string> {
  id: string;
  desc: string;
  priority: string;
  status: string;
  created: string;
  updated: string;
}

interface ClientDashboardProps {
  requests: ClientRequest[];
  onNavigate: (page: Page) => void;
  loading?: boolean;
  error?: boolean;
}

function ButtonControl(props: ComponentProps<'button'>) {
  return createElement('button', props);
}

function Section({
  title,
  subtitle,
  action,
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`overflow-hidden rounded-lg border border-border bg-white ${className}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-surface-2 px-5 py-4">
        <div>
          <div className="text-sm font-700 text-text-primary">{title}</div>
          {subtitle && <div className="mt-1 text-xs text-text-secondary">{subtitle}</div>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function SecondaryButton({
  children,
  onClick,
  danger = false,
  compact = false,
}: {
  children: ReactNode;
  onClick?: ComponentProps<'button'>['onClick'];
  danger?: boolean;
  compact?: boolean;
}) {
  return (
    <ButtonControl
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded border bg-white font-500 transition-colors ${
        compact ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-xs'
      } ${
        danger
          ? 'border-red-200 text-red-600 hover:bg-red-50'
          : 'border-border text-text-secondary hover:border-navy-800 hover:text-navy-800'
      }`}
    >
      {children}
    </ButtonControl>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center px-5 py-8 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-text-secondary">
        {icon}
      </div>
      <div className="text-sm font-600 text-text-primary">{title}</div>
      <div className="mt-1 max-w-md text-xs leading-5 text-text-secondary">{description}</div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="p-6">
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-border bg-white p-4">
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton mt-5 h-7 w-12 rounded" />
            <div className="skeleton mt-3 h-3 w-28 rounded" />
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-lg border border-border bg-white p-5 xl:col-span-2">
          <div className="skeleton h-4 w-40 rounded" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="skeleton h-11 rounded" />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-white p-5">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton mt-5 h-32 rounded" />
        </div>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="p-6">
      <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-red-200 bg-white px-6 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertCircle size={20} />
        </div>
        <div className="mt-4 text-sm font-700 text-text-primary">Unable to load client dashboard.</div>
        <div className="mt-1 text-xs text-text-secondary">
          Service request information could not be loaded. Try again.
        </div>
        <div className="mt-4">
          <SecondaryButton onClick={onRetry}>
            <RefreshCw size={13} />
            Retry
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
}

export default function ClientDashboard({
  requests,
  onNavigate,
  loading = false,
  error = false,
}: ClientDashboardProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(null);
  const [retrying, setRetrying] = useState(false);

  const filteredRequests = useMemo(
    () =>
      requests.filter(
        request =>
          (!search ||
            `${request.id} ${request.desc}`.toLowerCase().includes(search.toLowerCase())) &&
          (!statusFilter || request.status === statusFilter) &&
          (!priorityFilter || request.priority.toLowerCase() === priorityFilter),
      ),
    [priorityFilter, requests, search, statusFilter],
  );

  const metrics = useMemo(() => {
    const active = requests.filter(request => request.status !== 'closed');
    return {
      open: active.length,
      inProgress: requests.filter(request => request.status === 'in-progress').length,
      awaitingConfirmation: requests.filter(request => request.status === 'resolved').length,
      completed: requests.filter(request => request.status === 'closed').length,
      slaAtRisk: requests.filter(request =>
        ['warning', 'breached'].includes(request.status),
      ).length,
    };
  }, [requests]);

  const columns = [
    {
      key: 'id',
      label: 'Request ID',
      sortable: true,
      render: (request: ClientRequest) => (
        <span className="font-600 text-navy-800">{request.id}</span>
      ),
    },
    {
      key: 'desc',
      label: 'Issue',
      sortable: true,
      render: (request: ClientRequest) => (
        <div className="max-w-xs">
          <div className="truncate font-500 text-text-primary">{request.desc}</div>
        </div>
      ),
    },
    { key: 'site', label: 'Site', render: () => <Unavailable /> },
    { key: 'asset', label: 'Asset', render: () => <Unavailable /> },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (request: ClientRequest) => (
        <StatusBadge status={request.priority} variant="small" />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (request: ClientRequest) => <StatusBadge status={request.status} />,
    },
    { key: 'sla', label: 'SLA', render: () => <Unavailable /> },
    { key: 'created', label: 'Created', sortable: true },
    { key: 'updated', label: 'Last Updated', sortable: true },
    {
      key: 'action',
      label: 'Action',
      render: (request: ClientRequest) => (
        <SecondaryButton
          compact
          onClick={event => {
            event.stopPropagation();
            setSelectedRequest(request);
          }}
        >
          View Request
          <ChevronRight size={12} />
        </SecondaryButton>
      ),
    },
  ];

  function retry() {
    setRetrying(true);
    window.setTimeout(() => setRetrying(false), 700);
  }

  return (
    <div>
      <PageHeader
        title="Client Dashboard"
        subtitle="Monitor your service requests, maintenance activities, assets and service performance."
        actions={
          <ButtonControl
            type="button"
            onClick={() => onNavigate('service-request-create')}
            className="inline-flex items-center gap-2 rounded bg-navy-800 px-3 py-2 text-xs font-600 text-white transition-colors hover:bg-navy-700"
          >
            <Plus size={13} />
            New Service Request
          </ButtonControl>
        }
      />

      {loading || retrying ? (
        <LoadingState />
      ) : error ? (
        <ErrorState onRetry={retry} />
      ) : (
        <div className="p-4 md:p-6">
          <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            <KpiCard
              title="Open Requests"
              value={metrics.open}
              subtitle="Currently active"
              icon={<FileText size={15} />}
              accent
            />
            <KpiCard
              title="In Progress"
              value={metrics.inProgress}
              subtitle="Service underway"
              icon={<Wrench size={15} />}
            />
            <KpiCard
              title="Awaiting Confirmation"
              value={metrics.awaitingConfirmation}
              subtitle="Requires your review"
              icon={<ClipboardCheck size={15} />}
            />
            <KpiCard
              title="Completed"
              value={metrics.completed}
              subtitle="Closed requests"
              icon={<CircleCheck size={15} />}
            />
            <KpiCard
              title="SLA At Risk"
              value={metrics.slaAtRisk}
              subtitle="Needs attention"
              icon={<AlertTriangle size={15} />}
              alert={metrics.slaAtRisk > 0}
            />
            <KpiCard
              title="Total Assets"
              value="—"
              subtitle="Data not available"
              icon={<Box size={15} />}
            />
          </div>

          <Section
            title="Requires Your Attention"
            subtitle="Client actions from the current service workflow"
            className="mb-5 border-l-4 border-l-gold-500"
          >
            <EmptyState
              icon={<CheckCircle size={18} />}
              title="No actions require your confirmation."
              description="Requests requiring a response, scheduled visit acknowledgement or completion confirmation will appear here."
            />
          </Section>

          <div className="grid gap-5 xl:grid-cols-3">
            <Section
              title="Recent Service Requests"
              subtitle={`${requests.length} service request${requests.length === 1 ? '' : 's'} available`}
              className="xl:col-span-2"
              action={
                <SecondaryButton onClick={() => onNavigate('service-requests')}>
                  View All
                  <ChevronRight size={12} />
                </SecondaryButton>
              }
            >
              <div className="p-4">
                <FilterBar
                  search={search}
                  onSearch={setSearch}
                  searchPlaceholder="Search request ID or issue..."
                  onAdd={() => onNavigate('service-request-create')}
                  addLabel="New Request"
                  filters={
                    <>
                      <SelectFilter
                        label="Status"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                          { label: 'Approved', value: 'approved' },
                          { label: 'Closed', value: 'closed' },
                        ]}
                      />
                      <SelectFilter
                        label="Priority"
                        value={priorityFilter}
                        onChange={setPriorityFilter}
                        options={[
                          { label: 'High', value: 'high' },
                          { label: 'Critical', value: 'critical' },
                        ]}
                      />
                    </>
                  }
                />
                <DataTable
                  columns={columns}
                  data={filteredRequests}
                  onRowClick={setSelectedRequest}
                  emptyMessage={requests.length ? 'No requests match the current filters.' : 'No service requests yet.'}
                  emptyAction={
                    requests.length
                      ? undefined
                      : {
                          label: 'New Service Request',
                          onClick: () => onNavigate('service-request-create'),
                        }
                  }
                />
              </div>
            </Section>

            <Section
              title="SLA Status"
              subtitle="Commitment status for current requests"
            >
              <div className="p-5">
                <div className="rounded-lg border border-border bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-600 uppercase tracking-wide text-text-secondary">
                        Current Status
                      </div>
                      <div className="mt-2 text-lg font-700 text-text-primary">Not available</div>
                    </div>
                    <div className="rounded bg-surface-2 p-2 text-text-secondary">
                      <FileClock size={17} />
                    </div>
                  </div>
                  <div className="mt-4 border-t border-border pt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">Response due</span>
                      <span className="font-600 text-text-primary">—</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-text-secondary">Resolution due</span>
                      <span className="font-600 text-text-primary">—</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2 rounded border border-blue-100 bg-blue-50 p-3 text-xs leading-5 text-blue-700">
                  <ShieldCheck size={15} className="mt-0.5 shrink-0" />
                  SLA due times will appear when available from the existing service request data.
                </div>
              </div>
            </Section>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <Section
              title="Active Work Orders"
              subtitle="Work orders linked to your service requests"
              action={
                <SecondaryButton onClick={() => onNavigate('work-orders')}>
                  View Work Orders
                  <ChevronRight size={12} />
                </SecondaryButton>
              }
            >
              <EmptyState
                icon={<ListChecks size={18} />}
                title="No active work orders."
                description="Active work orders linked to your service requests will appear here."
              />
            </Section>

            <Section
              title="My Assets"
              subtitle="Assets available within your authorized client view"
              action={
                <SecondaryButton onClick={() => onNavigate('assets')}>
                  View Assets
                  <ChevronRight size={12} />
                </SecondaryButton>
              }
            >
              <EmptyState
                icon={<Box size={18} />}
                title="No asset information available."
                description="Asset tag, category, service status and maintenance dates will appear when available."
              />
            </Section>
          </div>

          <Section
            title="Recent Service History"
            subtitle="Recently completed service activity"
            className="mt-5"
          >
            <EmptyState
              icon={<History size={18} />}
              title="No service history available."
              description="Completed service details will appear here when they are available from the existing workflow."
            />
          </Section>
        </div>
      )}

      {selectedRequest && (
        <RequestDetailDrawer
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

function Unavailable() {
  return <span className="text-text-secondary">—</span>;
}

function DetailField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs font-500 text-text-secondary">{label}</div>
      <div className="mt-1 text-sm font-600 text-text-primary">{value || 'Not available'}</div>
    </div>
  );
}

function RequestDetailDrawer({
  request,
  onClose,
  onNavigate,
}: {
  request: ClientRequest;
  onClose: () => void;
  onNavigate: (page: Page) => void;
}) {
  const workflow = [
    'Request Raised',
    'Triaged',
    'Work Order Created',
    'Assigned',
    'Technician Visit',
    'Work Completed',
    'Supervisor Review',
    'Client Confirmation',
    'Closed',
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy-950/50">
      <ButtonControl
        type="button"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
        aria-label="Close request details"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Request details for ${request.id}`}
        className="relative flex h-full w-full max-w-2xl flex-col bg-surface shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border bg-white px-5 py-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-700 text-navy-800">{request.id}</span>
              <StatusBadge status={request.status} />
              <StatusBadge status={request.priority} variant="small" />
            </div>
            <div className="mt-1 text-sm text-text-secondary">{request.desc}</div>
          </div>
          <ButtonControl
            type="button"
            onClick={onClose}
            className="rounded p-2 text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary"
            aria-label="Close request details"
          >
            <X size={17} />
          </ButtonControl>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-5">
          <DrawerSection title="Request Overview" icon={<FileText size={15} />}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <DetailField label="Request ID" value={request.id} />
              <div>
                <div className="text-xs font-500 text-text-secondary">Status</div>
                <div className="mt-1"><StatusBadge status={request.status} /></div>
              </div>
              <div>
                <div className="text-xs font-500 text-text-secondary">Priority</div>
                <div className="mt-1"><StatusBadge status={request.priority} variant="small" /></div>
              </div>
              <DetailField label="Created Date" value={request.created} />
              <DetailField label="Updated Date" value={request.updated} />
            </div>
          </DrawerSection>

          <div className="grid gap-4 md:grid-cols-2">
            <DrawerSection title="Location" icon={<MapPin size={15} />}>
              <div className="space-y-4">
                <DetailField label="Site" />
                <DetailField label="Zone" />
                <DetailField label="Service Area" />
              </div>
            </DrawerSection>
            <DrawerSection title="Asset" icon={<Box size={15} />}>
              <div className="space-y-4">
                <DetailField label="Asset Name" />
                <DetailField label="Asset Tag" />
                <DetailField label="Category" />
                <DetailField label="Criticality" />
              </div>
            </DrawerSection>
          </div>

          <DrawerSection title="Issue" icon={<MessageSquare size={15} />}>
            <DetailField label="Title" value={request.desc} />
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <DetailField label="Description" />
              <DetailField label="Attachments" />
            </div>
          </DrawerSection>

          <DrawerSection title="SLA" icon={<Clock size={15} />}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <DetailField label="Response Due" />
              <DetailField label="Resolution Due" />
              <DetailField label="Current SLA Status" />
            </div>
          </DrawerSection>

          <DrawerSection title="Workflow Timeline" icon={<CalendarClock size={15} />}>
            <div className="rounded border border-border bg-white px-4 py-1">
              {workflow.map((step, index) => (
                <div key={step} className="relative flex gap-3 py-3">
                  {index < workflow.length - 1 && (
                    <div className="absolute left-2 top-7 h-full border-l border-border" />
                  )}
                  <div
                    className={`relative z-10 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      index === 0
                        ? 'border-gold-500 bg-gold-500 text-navy-950'
                        : 'border-border bg-white text-text-secondary'
                    }`}
                  >
                    {index === 0 && <CheckCircle size={10} />}
                  </div>
                  <div>
                    <div
                      className={`text-xs font-600 ${
                        index === 0 ? 'text-text-primary' : 'text-text-secondary'
                      }`}
                    >
                      {step}
                    </div>
                    {index === 0 && (
                      <div className="mt-1 text-xs text-text-secondary">
                        Request created · Current system status: {request.status}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs leading-5 text-text-secondary">
              The timeline represents the existing service workflow. Stages are updated only by the
              current FieldOps Nexus process.
            </div>
          </DrawerSection>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-border bg-white p-4">
          <SecondaryButton onClick={onClose}>Close</SecondaryButton>
          <ButtonControl
            type="button"
            onClick={() => onNavigate('service-request-detail')}
            className="inline-flex items-center gap-2 rounded bg-navy-800 px-3 py-2 text-xs font-600 text-white transition-colors hover:bg-navy-700"
          >
            View Full Request
            <ChevronRight size={12} />
          </ButtonControl>
        </div>
      </aside>
    </div>
  );
}

function DrawerSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-white p-4">
      <div className="mb-4 flex items-center gap-2 border-b border-surface-2 pb-3 text-sm font-700 text-text-primary">
        <span className="text-gold-600">{icon}</span>
        {title}
      </div>
      {children}
    </section>
  );
}
