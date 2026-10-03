import { Search, Filter, Download, Plus } from 'lucide-react';

interface FilterBarProps {
  searchPlaceholder?: string;
  search: string;
  onSearch: (v: string) => void;
  filters?: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  onExport?: () => void;
}

export default function FilterBar({ searchPlaceholder, search, onSearch, filters, onAdd, addLabel = 'Add', onExport }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded px-3 py-2 flex-1 min-w-48">
        <Search size={14} className="text-[#94A3B8] flex-shrink-0" />
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder={searchPlaceholder ?? 'Search...'}
          className="bg-transparent text-sm text-[#172033] placeholder-[#94A3B8] outline-none flex-1"
        />
      </div>

      {filters && (
        <div className="flex items-center gap-2">
          {filters}
        </div>
      )}

      <div className="flex items-center gap-2 ml-auto">
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-[#E2E8F0] rounded text-xs text-[#64748B] hover:text-[#172033] hover:border-[#CBD5E1] transition-colors"
          >
            <Download size={13} />
            Export
          </button>
        )}
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-3 py-2 bg-[#0B1F3A] rounded text-xs text-white font-500 hover:bg-[#102A43] transition-colors"
          >
            <Plus size={13} />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function SelectFilter({ label, options, value, onChange }: {
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-white border border-[#E2E8F0] rounded px-3 py-2 text-xs text-[#64748B] outline-none hover:border-[#CBD5E1] transition-colors cursor-pointer"
    >
      <option value="">{label}: All</option>
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
