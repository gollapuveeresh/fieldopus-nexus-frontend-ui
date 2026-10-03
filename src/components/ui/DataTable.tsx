import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  emptyAction?: { label: string; onClick: () => void };
  pagination?: { page: number; total: number; perPage: number; onPage: (p: number) => void };
}

export default function DataTable<T extends Record<string, any>>({
  columns, data, loading, onRowClick, emptyMessage, emptyAction, pagination
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="text-left px-4 py-3 text-xs font-600 text-[#64748B] uppercase tracking-wide">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-b border-[#F1F5F9]">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="skeleton h-4 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white rounded-lg border border-[#E2E8F0] flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
          <ArrowUpDown size={20} className="text-[#94A3B8]" />
        </div>
        <p className="text-sm font-500 text-[#172033] mb-1">{emptyMessage ?? 'No records found'}</p>
        <p className="text-xs text-[#64748B] mb-4">Try adjusting your filters or search criteria.</p>
        {emptyAction && (
          <button
            onClick={emptyAction.onClick}
            className="px-4 py-2 bg-[#0B1F3A] text-white text-xs font-500 rounded hover:bg-[#102A43] transition-colors"
          >
            {emptyAction.label}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 text-xs font-600 text-[#64748B] uppercase tracking-wide whitespace-nowrap"
                  style={col.width ? { width: col.width } : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && <ArrowUpDown size={10} className="text-[#CBD5E1]" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-[#F1F5F9] table-row-hover ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-sm text-[#172033]">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#F1F5F9]">
          <span className="text-xs text-[#64748B]">
            Showing {((pagination.page - 1) * pagination.perPage) + 1}–{Math.min(pagination.page * pagination.perPage, pagination.total)} of {pagination.total} records
          </span>
          <div className="flex items-center gap-1">
            <PagBtn onClick={() => pagination.onPage(1)} disabled={pagination.page === 1}><ChevronsLeft size={13} /></PagBtn>
            <PagBtn onClick={() => pagination.onPage(pagination.page - 1)} disabled={pagination.page === 1}><ChevronLeft size={13} /></PagBtn>
            <span className="px-2 text-xs text-[#172033] font-500">Page {pagination.page}</span>
            <PagBtn onClick={() => pagination.onPage(pagination.page + 1)} disabled={pagination.page * pagination.perPage >= pagination.total}><ChevronRight size={13} /></PagBtn>
            <PagBtn onClick={() => pagination.onPage(Math.ceil(pagination.total / pagination.perPage))} disabled={pagination.page * pagination.perPage >= pagination.total}><ChevronsRight size={13} /></PagBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function PagBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-7 h-7 flex items-center justify-center rounded border border-[#E2E8F0] text-[#64748B] hover:border-[#0B1F3A] hover:text-[#0B1F3A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}
