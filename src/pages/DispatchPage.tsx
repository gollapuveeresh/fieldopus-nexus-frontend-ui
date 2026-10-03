import { useState } from 'react';
import { MapPin, Clock, AlertTriangle, Check, User } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';

const UNASSIGNED = [
  { wo: 'WO-2024-0853', asset: 'Fire Panel — Lobby', site: 'Colombo HQ', priority: 'High', type: 'Corrective', eta: '1 hr' },
  { wo: 'WO-2024-0854', asset: 'Water Pump Station', site: 'Colombo HQ', priority: 'Medium', type: 'Preventive', eta: '3 hrs' },
  { wo: 'WO-2024-0855', asset: 'Cooling Tower B', site: 'Galle Site', priority: 'Low', type: 'Preventive', eta: '4 hrs' },
  { wo: 'WO-2024-0856', asset: 'Transformer #2', site: 'Data Centre', priority: 'Critical', type: 'Corrective', eta: '30 min' },
];

const TECHNICIANS = [
  { id: 'T001', name: 'Tariq Sharma', role: 'HVAC Specialist', shift: '08:00 – 17:00', available: false, jobs: [
    { wo: 'WO-2024-0851', asset: 'HVAC Unit — Block A', status: 'in-progress', time: '09:00–12:00' },
  ]},
  { id: 'T002', name: 'Ravi Patel', role: 'Electrical Technician', shift: '08:00 – 17:00', available: false, jobs: [
    { wo: 'WO-2024-0850', asset: 'Elevator — Tower 2', status: 'dispatched', time: '10:00–13:00' },
  ]},
  { id: 'T003', name: 'Asanka Nair', role: 'Mechanical Technician', shift: '08:00 – 17:00', available: true, jobs: [] },
  { id: 'T004', name: 'Krishantha Singh', role: 'HVAC Specialist', shift: '10:00 – 19:00', available: true, jobs: [
    { wo: 'WO-2024-0848', asset: 'Fire Panel — Lobby', status: 'planned', time: '14:00–16:00' },
  ]},
  { id: 'T005', name: 'Malik David', role: 'BMS Technician', shift: '08:00 – 17:00', available: true, jobs: [] },
  { id: 'T006', name: 'Pradeep Joseph', role: 'Electrical Technician', shift: '07:00 – 16:00', available: false, jobs: [
    { wo: 'WO-2024-0845', asset: 'BMS Controller', status: 'on-hold', time: '08:00–11:00' },
    { wo: 'WO-2024-0849', asset: 'Generator #3', status: 'dispatched', time: '12:00–15:00' },
  ]},
];

export default function DispatchPage() {
  const [selectedWO, setSelectedWO] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [assigned, setAssigned] = useState<Record<string, string>>({});

  const handleAssign = () => {
    if (selectedWO && selectedTech) {
      setAssigned(prev => ({ ...prev, [selectedWO]: selectedTech }));
      setSelectedWO(null);
      setSelectedTech(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-700 text-[#172033]">Dispatch Board</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Assign and dispatch technicians to open work orders · 29 Sep 2026</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedWO && selectedTech && (
            <button
              onClick={handleAssign}
              className="flex items-center gap-2 px-4 py-2 bg-[#C9A227] text-[#071426] text-sm font-600 rounded hover:bg-[#D9B33F] transition-colors"
            >
              <Check size={14} />
              Assign {selectedWO} → {TECHNICIANS.find(t => t.id === selectedTech)?.name.split(' ')[0]}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Unassigned WOs */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <span className="text-sm font-600 text-[#172033]">Unassigned Work Orders</span>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-600">{UNASSIGNED.filter(w => !assigned[w.wo]).length}</span>
            </div>
            <div className="divide-y divide-[#F1F5F9]">
              {UNASSIGNED.map(wo => {
                const isAssigned = !!assigned[wo.wo];
                return (
                  <div
                    key={wo.wo}
                    onClick={() => !isAssigned && setSelectedWO(selectedWO === wo.wo ? null : wo.wo)}
                    className={`p-4 cursor-pointer transition-all ${
                      isAssigned ? 'opacity-50 bg-[#F8FAFC]' :
                      selectedWO === wo.wo ? 'bg-[#F7EFCF] border-l-3 border-l-[#C9A227]' :
                      'hover:bg-[#F8FAFC]'
                    }`}
                    style={selectedWO === wo.wo ? { borderLeft: '3px solid #C9A227' } : {}}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-600 text-[#0B1F3A]">{wo.wo}</span>
                      <StatusBadge status={wo.priority} variant="small" />
                    </div>
                    <div className="text-sm font-500 text-[#172033] mb-1">{wo.asset}</div>
                    <div className="flex items-center gap-3 text-xs text-[#64748B]">
                      <span className="flex items-center gap-1"><MapPin size={10} />{wo.site}</span>
                      <span className="flex items-center gap-1"><Clock size={10} />Est. {wo.eta}</span>
                    </div>
                    {isAssigned && (
                      <div className="mt-2 text-xs text-green-600 font-500 flex items-center gap-1">
                        <Check size={11} />
                        Assigned to {TECHNICIANS.find(t => t.id === assigned[wo.wo])?.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {selectedWO && (
            <div className="mt-2 p-3 bg-[#F7EFCF] border border-[#C9A227]/30 rounded text-xs text-amber-700 font-500">
              Select a technician on the right to assign {selectedWO}
            </div>
          )}
        </div>

        {/* Technicians */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <span className="text-sm font-600 text-[#172033]">Technician Schedule — Today</span>
            </div>
            <div className="divide-y divide-[#F1F5F9]">
              {TECHNICIANS.map(tech => (
                <div
                  key={tech.id}
                  onClick={() => selectedWO && setSelectedTech(selectedTech === tech.id ? null : tech.id)}
                  className={`p-4 transition-all ${
                    selectedWO ? 'cursor-pointer' : ''
                  } ${
                    selectedTech === tech.id ? 'bg-[#F7EFCF]' : selectedWO ? 'hover:bg-[#F8FAFC]' : ''
                  }`}
                  style={selectedTech === tech.id ? { outline: '2px solid #C9A227', outlineOffset: '-2px' } : {}}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#0B1F3A] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#C9A227] text-xs font-700">
                        {tech.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-600 text-[#172033]">{tech.name}</span>
                        <span className="text-xs text-[#64748B]">{tech.role}</span>
                        <div className={`ml-auto flex items-center gap-1 text-xs font-500 ${
                          tech.available ? 'text-green-600' :
                          tech.jobs.length >= 2 ? 'text-red-600' : 'text-amber-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            tech.available ? 'bg-green-500' :
                            tech.jobs.length >= 2 ? 'bg-red-500' : 'bg-amber-500'
                          }`} />
                          {tech.available ? 'Available' : tech.jobs.length >= 2 ? 'At Capacity' : 'On Job'}
                        </div>
                      </div>
                      <div className="text-xs text-[#64748B] mb-2">Shift: {tech.shift}</div>
                      {tech.jobs.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {tech.jobs.map((job, j) => (
                            <div key={j} className="flex items-center gap-1.5 px-2 py-1.5 bg-[#F1F5F9] rounded border border-[#E2E8F0] text-xs">
                              <span className="font-500 text-[#0B1F3A]">{job.wo}</span>
                              <span className="text-[#64748B]">·</span>
                              <span className="text-[#64748B] truncate max-w-32">{job.asset}</span>
                              <StatusBadge status={job.status} variant="small" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-green-600 font-500">No active jobs — ready to assign</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
