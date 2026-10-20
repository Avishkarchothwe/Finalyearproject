import React, { useState } from 'react';
import { Search, MapPin, Compass, Navigation } from 'lucide-react';

interface NeighborhoodPresetsProps {
  onSelectLocation: (lat: number, lon: number) => void;
}

export const PRESET_LOCALITIES = [
  { name: 'Shivajinagar', subtitle: 'River Alluvial Basin', lat: 18.5314, lon: 73.8446, tag: 'Alluvium' },
  { name: 'Kothrud', subtitle: 'Jointed Basalt', lat: 18.5074, lon: 73.8077, tag: 'Fracture' },
  { name: 'Hinjewadi IT', subtitle: 'Urban High-Impervious', lat: 18.5913, lon: 73.7389, tag: 'Urban' },
  { name: 'Katraj Basin', subtitle: 'Foothill Recharge', lat: 18.4485, lon: 73.8580, tag: 'Hills' },
  { name: 'Aundh Gaon', subtitle: 'Mula River Buffer', lat: 18.5580, lon: 73.8070, tag: 'River' },
  { name: 'Viman Nagar', subtitle: 'Vesicular Basalt', lat: 18.5679, lon: 73.9143, tag: 'Vesicular' },
  { name: 'Pashan Lake', subtitle: 'Lacustrine Wetland', lat: 18.5385, lon: 73.7915, tag: 'High TWI' },
  { name: 'Wagholi', subtitle: 'Vertisol Plain', lat: 18.5810, lon: 73.9850, tag: 'Black Soil' }
];

export const NeighborhoodPresets: React.FC<NeighborhoodPresetsProps> = ({ onSelectLocation }) => {
  const [customLat, setCustomLat] = useState('');
  const [customLon, setCustomLon] = useState('');

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);
    if (!isNaN(lat) && !isNaN(lon) && lat >= 18.40 && lat <= 18.65 && lon >= 73.70 && lon <= 74.00) {
      onSelectLocation(lat, lon);
    } else {
      alert('Please enter valid coordinates within Pune study box: Lat [18.40 - 18.65], Lon [73.70 - 74.00]');
    }
  };

  return (
    <div className="space-y-2">
      {/* Preset Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] uppercase font-mono-code font-bold text-cyan-400/90 shrink-0 flex items-center gap-1 pl-1">
          <Navigation className="w-3 h-3 text-cyan-400" /> Presets:
        </span>
        {PRESET_LOCALITIES.map((loc, idx) => (
          <button
            key={idx}
            onClick={() => onSelectLocation(loc.lat, loc.lon)}
            className="px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-cyan-600/90 hover:text-white text-slate-300 border border-slate-800/90 hover:border-cyan-400/40 text-[11px] font-medium transition-all shrink-0 flex items-center gap-1.5 shadow-md shadow-black/40 backdrop-blur-md group"
          >
            <span>{loc.name}</span>
            <span className="text-[9px] font-mono-code px-1.5 py-0.2 rounded bg-slate-900 text-cyan-300/80 group-hover:bg-cyan-700 group-hover:text-white border border-slate-800">
              {loc.tag}
            </span>
          </button>
        ))}
      </div>

      {/* Coordinate Input Telemetry Bar */}
      <form onSubmit={handleManualSearch} className="flex items-center space-x-2 bg-slate-950/85 backdrop-blur-xl p-1.5 rounded-xl border border-cyan-500/20 shadow-xl">
        <div className="flex items-center space-x-1 text-cyan-400 pl-2">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-slate-400">Coords</span>
        </div>
        <input
          type="number"
          step="0.0001"
          placeholder="Latitude (18.5204)"
          value={customLat}
          onChange={(e) => setCustomLat(e.target.value)}
          className="bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-100 placeholder-slate-500 w-36 font-mono-code focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
        <input
          type="number"
          step="0.0001"
          placeholder="Longitude (73.8567)"
          value={customLon}
          onChange={(e) => setCustomLon(e.target.value)}
          className="bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-100 placeholder-slate-500 w-36 font-mono-code focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold text-xs px-3.5 py-1 rounded-lg shadow-md shadow-cyan-600/30 transition-all flex items-center gap-1 border border-cyan-400/30"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Execute</span>
        </button>
      </form>
    </div>
  );
};
