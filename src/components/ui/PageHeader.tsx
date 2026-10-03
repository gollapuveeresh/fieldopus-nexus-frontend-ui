interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  tabs?: { label: string; value: string }[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export default function PageHeader({ title, subtitle, actions, tabs, activeTab, onTabChange }: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-[#E2E8F0]">
      <div className="px-6 pt-5 pb-0">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-lg font-700 text-[#172033]">{title}</h1>
            {subtitle && <p className="text-sm text-[#64748B] mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
        </div>
        {tabs && (
          <div className="flex gap-0 -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => onTabChange?.(tab.value)}
                className={`px-4 py-2.5 text-sm font-500 border-b-2 transition-colors ${
                  activeTab === tab.value
                    ? 'border-[#C9A227] text-[#0B1F3A]'
                    : 'border-transparent text-[#64748B] hover:text-[#172033]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
