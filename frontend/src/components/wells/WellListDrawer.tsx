import React, { useState } from 'react';
import { X, Search, Droplets, Filter, MapPin, ChevronRight, Activity, Radio } from 'lucide-react';
import { MonitoringWell } from '../../types';

interface WellListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wells: MonitoringWell[];
  onSelectWell: (well: MonitoringWell) => void;
}

export const WellListDrawer: React.FC<WellListDrawerProps> = ({
  isOpen,
  onClose,
  wells,
  onSelectWell
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'All' | 'High' | 'Moderate' | 'Low'>('All');

  if (!isOpen) return null;

  const filteredWells = wells.filter((w) => {
    const matchName = w.well_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      w.well_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      w.aquifer_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCategory === 'All' || w.groundwater_potential === filterCategory;
    return matchName && matchCat;
  });

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-96 bg-slate-950/95 backdrop-blur-2xl border-r border-cyan-500/20 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono-code font-bold text-white uppercase tracking-wider">Groundwater Well Stations</h2>
            <div className="text-[10px] text-slate-400 font-mono-code">{wells.length} Pune Telemetry Records</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search & Filter Chips */}
      <div className="p-3 border-b border-slate-800/80 space-y-2 bg-slate-950/60">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Filter stations, aquifers, IDs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 font-mono-code focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-1 text-[10px] font-mono-code">
          {(['All', 'High', 'Moderate', 'Low'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-sm border border-cyan-400/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat === 'All' ? 'All (180)' : `${cat}`}
            </button>
          ))}
        </div>
      </div>

      {/* Wells List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-slate-800/40">
        {filteredWells.map((well) => (
          <div
            key={well.well_id}
            onClick={() => {
              onSelectWell(well);
              onClose();
            }}
            className="p-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all space-y-1.5 group shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] font-mono-code text-cyan-400 font-bold">{well.well_id}</span>
                <h3 className="text-xs font-bold text-slate-200 group-hover:text-white">{well.well_name}</h3>
              </div>
              <span className={`text-[9px] font-mono-code font-black uppercase px-2 py-0.5 rounded-full border ${
                well.groundwater_potential === 'High'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  : well.groundwater_potential === 'Moderate'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                  : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
              }`}>
                {well.groundwater_potential}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1 font-mono-code">
              <div>
                Water Depth: <strong className="text-slate-200">{well.current_water_level_mbgl} mbgl</strong>
              </div>
              <div>
                Yield: <strong className="text-slate-200">{well.average_yield_lps} LPS</strong>
              </div>
            </div>

            <div className="text-[9px] text-slate-500 font-mono-code truncate">
              {well.aquifer_type} • Elevation {well.elevation_m}m
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
