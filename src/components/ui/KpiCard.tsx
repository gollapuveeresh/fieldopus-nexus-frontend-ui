import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: string; direction: 'up' | 'down' | 'neutral'; positive?: boolean };
  icon: React.ReactNode;
  accent?: boolean;
  alert?: boolean;
}

export default function KpiCard({ title, value, subtitle, trend, icon, accent, alert }: KpiCardProps) {
  return (
    <div className={`bg-white rounded-lg border p-4 flex flex-col gap-3 ${
      alert ? 'border-red-200 bg-red-50/30' : accent ? 'border-[#C9A227]/30' : 'border-[#E2E8F0]'
    }`}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-500 text-[#64748B] uppercase tracking-wide">{title}</span>
        <span className={`p-1.5 rounded ${accent ? 'bg-[#C9A227]/10 text-[#C9A227]' : alert ? 'bg-red-100 text-red-600' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
          {icon}
        </span>
      </div>
      <div>
        <div className={`text-2xl font-700 ${alert ? 'text-[#DC2626]' : accent ? 'text-[#C9A227]' : 'text-[#172033]'}`}>
          {value}
        </div>
        {subtitle && <div className="text-xs text-[#64748B] mt-0.5">{subtitle}</div>}
      </div>
      {trend && (
        <div className="flex items-center gap-1">
          {trend.direction === 'up' ? (
            <TrendingUp size={12} className={trend.positive ? 'text-green-600' : 'text-red-500'} />
          ) : trend.direction === 'down' ? (
            <TrendingDown size={12} className={trend.positive ? 'text-green-600' : 'text-red-500'} />
          ) : (
            <Minus size={12} className="text-[#94A3B8]" />
          )}
          <span className={`text-xs ${
            trend.direction === 'neutral' ? 'text-[#94A3B8]' :
            trend.positive ? 'text-green-600' : 'text-red-500'
          }`}>
            {trend.value}
          </span>
        </div>
      )}
    </div>
  );
}
