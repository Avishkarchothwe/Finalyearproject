import React from 'react';
import { X, Droplets, TrendingDown, TrendingUp, Calendar, Compass, Waves } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { MonitoringWell } from '../../types';

interface WellTrendModalProps {
  well: MonitoringWell | null;
  onClose: () => void;
}

export const WellTrendModal: React.FC<WellTrendModalProps> = ({ well, onClose }) => {
  if (!well) return null;

  const chartData = well.observations?.map((obs) => ({
    year: obs.year,
    pre_monsoon: obs.pre_monsoon_depth_mbgl,
    post_monsoon: obs.post_monsoon_depth_mbgl,
    fluctuation: obs.seasonal_fluctuation_m,
    rainfall: obs.rainfall_mm
  })) || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel-glow rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono-code text-cyan-400 font-bold mb-1">
              <Droplets className="w-3.5 h-3.5" />
              <span>{well.well_id} • CGWB / GSDA Pune Benchmark</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">{well.well_name}</h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono-code">
              Lat: {well.latitude.toFixed(4)}°N, Lon: {well.longitude.toFixed(4)}°E • Elevation: {well.elevation_m}m MSL
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Metric Cards */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 space-y-0.5">
            <div className="text-[10px] font-mono-code uppercase font-bold text-slate-500">Current Water Depth</div>
            <div className="text-lg font-black font-mono-code text-emerald-400">{well.current_water_level_mbgl} mbgl</div>
            <div className="text-[10px] text-slate-400">Post-monsoon recharge</div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 space-y-0.5">
            <div className="text-[10px] font-mono-code uppercase font-bold text-slate-500">Seasonal Fluctuation</div>
            <div className="text-lg font-black font-mono-code text-amber-400">Δ {well.seasonal_fluctuation_m} m</div>
            <div className="text-[10px] text-slate-400">Pre/post dry-wet swing</div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 space-y-0.5">
            <div className="text-[10px] font-mono-code uppercase font-bold text-slate-500">Aquifer Yield</div>
            <div className="text-lg font-black font-mono-code text-cyan-400">{well.average_yield_lps} LPS</div>
            <div className="text-[10px] text-slate-400">Estimated discharge rate</div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 space-y-0.5">
            <div className="text-[10px] font-mono-code uppercase font-bold text-slate-500">6-Year Trend</div>
            <div className="text-lg font-black font-mono-code text-slate-200 flex items-center gap-1">
              {well.historical_trend === 'Improving' ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-rose-400" />}
              {well.historical_trend}
            </div>
            <div className="text-[10px] text-slate-400">Multi-year trendline</div>
          </div>
        </div>

        {/* 6-Year Depth Time Series Chart */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/90 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono-code font-bold text-slate-300">
            <span className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-cyan-400" />
              <span>Depth to Water Table Hydrograph (2019 - 2024)</span>
            </span>
            <span className="text-[10px] text-slate-500 font-normal">Reversed Y-Axis (Shallower is Higher)</span>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} reversed={true} unit="m" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#0284c7', borderRadius: '0.75rem', boxShadow: '0 10px 25px rgba(0,0,0,0.7)' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="pre_monsoon"
                  name="Pre-Monsoon (May Dry Season)"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#f43f5e' }}
                />
                <Line
                  type="monotone"
                  dataKey="post_monsoon"
                  name="Post-Monsoon (Nov Recharge)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Aquifer Formation & Lithology Details */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 font-mono-code font-bold uppercase text-[10px]">Aquifer Formation</span>
            <div className="text-slate-200 font-semibold mt-0.5">{well.aquifer_type}</div>
          </div>
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 font-mono-code font-bold uppercase text-[10px]">Recharge Velocity Index</span>
            <div className="text-slate-200 font-semibold mt-0.5">{well.recharge_rate_estimate}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
