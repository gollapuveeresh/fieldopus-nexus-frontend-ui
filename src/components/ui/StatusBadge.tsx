interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'small';
}

const statusConfig: Record<string, { bg: string; text: string; dot?: string }> = {
  // Asset statuses
  active: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  'under-maintenance': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'out-of-service': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  retired: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  // Work order statuses
  draft: { bg: 'bg-slate-100', text: 'text-slate-600' },
  planned: { bg: 'bg-blue-50', text: 'text-blue-700' },
  assigned: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  dispatched: { bg: 'bg-purple-50', text: 'text-purple-700' },
  'in-progress': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'on-hold': { bg: 'bg-orange-50', text: 'text-orange-700' },
  completed: { bg: 'bg-green-50', text: 'text-green-700' },
  closed: { bg: 'bg-slate-100', text: 'text-slate-500' },
  // SLA
  healthy: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  breached: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  // Service requests
  new: { bg: 'bg-blue-50', text: 'text-blue-700' },
  triaged: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
  approved: { bg: 'bg-green-50', text: 'text-green-700' },
  rejected: { bg: 'bg-red-50', text: 'text-red-700' },
  resolved: { bg: 'bg-teal-50', text: 'text-teal-700' },
  // Priority
  critical: { bg: 'bg-red-100', text: 'text-red-800' },
  high: { bg: 'bg-orange-50', text: 'text-orange-700' },
  medium: { bg: 'bg-amber-50', text: 'text-amber-700' },
  low: { bg: 'bg-slate-100', text: 'text-slate-600' },
  // Parts
  adequate: { bg: 'bg-green-50', text: 'text-green-700' },
  'low-stock': { bg: 'bg-amber-50', text: 'text-amber-700' },
  'out-of-stock': { bg: 'bg-red-50', text: 'text-red-700' },
  // PM
  scheduled: { bg: 'bg-blue-50', text: 'text-blue-700' },
  due: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  overdue: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  generated: { bg: 'bg-purple-50', text: 'text-purple-700' },
  verified: { bg: 'bg-teal-50', text: 'text-teal-700' },
};

export default function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const key = status.toLowerCase().replace(/ /g, '-');
  const config = statusConfig[key] ?? { bg: 'bg-slate-100', text: 'text-slate-600' };
  const label = status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded font-500 ${config.bg} ${config.text} ${
        variant === 'small' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      {config.dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} pulse-dot flex-shrink-0`} />
      )}
      {label}
    </span>
  );
}
