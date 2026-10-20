import React from 'react';
import { MapPin, ShieldAlert, ChevronRight, Download, Droplets, Activity, Radio, Cpu, Sparkles, Gauge } from 'lucide-react';
import { PredictionResult } from '../../types';
import { EnvironmentalParams } from './EnvironmentalParams';
import { ShapExplanationCard } from './ShapExplanationCard';

interface PredictionPanelProps {
  prediction: PredictionResult | null;
  loading: boolean;
  onOpenSimulation: () => void;
}

export const PredictionPanel: React.FC<PredictionPanelProps> = ({
  prediction,
  loading,
  onOpenSimulation
}) => {
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Radio className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-slate-100 font-mono-code tracking-wide">
            EXTRACTING 16 GEOSPATIAL LAYERS...
          </div>
          <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed">
            Querying DEM, Deccan basalt lithology, Mula-Mutha drainage buffers, and computing SHAP TreeExplainer attribution.
          </p>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
          <MapPin className="w-8 h-8" />
        </div>
        <div className="text-sm font-bold text-slate-200">Select Spatial Target</div>
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          Click anywhere inside the Pune metropolitan bounding box or select a landmark preset to initiate inference.
        </p>
      </div>
    );
  }

  const score = prediction.potential_score;
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Very High':
      case 'High':
        return {
          badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20',
          gradient: 'from-emerald-500 to-teal-400',
          accent: '#10b981',
          grade: 'POTENTIAL: HIGH'
        };
      case 'Moderate':
        return {
          badge: 'bg-amber-950/80 text-amber-300 border-amber-500/40 shadow-amber-500/20',
          gradient: 'from-amber-500 to-yellow-400',
          accent: '#f59e0b',
          grade: 'POTENTIAL: MODERATE'
        };
      default:
        return {
          badge: 'bg-rose-950/80 text-rose-300 border-rose-500/40 shadow-rose-500/20',
          gradient: 'from-rose-500 to-orange-400',
          accent: '#ef4444',
          grade: 'POTENTIAL: LOW'
        };
    }
  };

  const styling = getCategoryColor(prediction.groundwater_potential);

  const handleExportSummary = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(prediction, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `GeoHydroAI_Telemetry_${prediction.location.latitude}_${prediction.location.longitude}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // SVG Circular Gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="h-full overflow-y-auto p-5 space-y-4">
      {/* HUD Telemetry Header Card */}
      <div className="glass-panel-glow rounded-2xl p-5 relative overflow-hidden space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-xs text-cyan-400 font-mono-code font-bold mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{prediction.location.latitude.toFixed(4)}° N • {prediction.location.longitude.toFixed(4)}° E</span>
            </div>
            <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Aquifer Telemetry Report</span>
            </h2>
          </div>

          <div className={`px-3 py-1 rounded-full text-[10px] font-mono-code font-black uppercase tracking-wider border shadow-md ${styling.badge}`}>
            {prediction.groundwater_potential}
          </div>
        </div>

        {/* Circular HUD Dial + KPIs */}
        <div className="grid grid-cols-12 gap-3 items-center pt-1">
          {/* Circular SVG Meter */}
          <div className="col-span-5 flex flex-col items-center justify-center relative">
            <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-800/80"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={styling.accent}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black font-mono-code text-white tracking-tighter">
                {prediction.potential_score}
              </span>
              <span className="text-[9px] font-mono-code uppercase font-bold text-slate-400 tracking-wider">
                GWP INDEX
              </span>
            </div>
          </div>

          {/* KPI Columns */}
          <div className="col-span-7 space-y-2">
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/90 flex items-center justify-between">
              <div>
                <div className="text-[9px] font-mono-code uppercase text-slate-400">Confidence</div>
                <div className="text-sm font-black font-mono-code text-cyan-300">
                  {(prediction.confidence * 100).toFixed(1)}%
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-mono-code uppercase text-slate-400">Tolerance</div>
                <div className="text-xs font-mono-code font-bold text-slate-300">
                  ±{prediction.uncertainty_margin} pts
                </div>
              </div>
            </div>

            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/90 flex items-center justify-between">
              <div>
                <div className="text-[9px] font-mono-code uppercase text-slate-400">Depth to Water</div>
                <div className="text-sm font-black font-mono-code text-emerald-400">
                  {prediction.predicted_depth_mbgl ? `${prediction.predicted_depth_mbgl} mbgl` : '5.2 mbgl'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-mono-code uppercase text-slate-400">Aquifer Zone</div>
                <div className="text-xs font-mono-code font-bold text-cyan-400">
                  {prediction.groundwater_potential === 'High' ? 'Unconfined' : 'Basalt Semi-Conf'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <button
            onClick={handleExportSummary}
            className="flex items-center space-x-1.5 text-slate-400 hover:text-cyan-300 transition-colors text-[11px] font-mono-code"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Telemetry (JSON)</span>
          </button>

          <button
            onClick={onOpenSimulation}
            className="flex items-center space-x-1 font-bold text-cyan-400 hover:text-cyan-300 transition-colors text-[11px] font-mono-code"
          >
            <span>Stress-Test Scenario</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SHAP Factor Attribution */}
      <ShapExplanationCard
        positiveFactors={prediction.top_positive_factors}
        negativeFactors={prediction.top_negative_factors}
      />

      {/* Extracted 16-D Environmental Parameters */}
      <EnvironmentalParams features={prediction.features} />

      {/* Permanent Scientific Notice */}
      <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-3.5 text-[11px] text-slate-400 leading-relaxed space-y-1.5">
        <div className="flex items-center space-x-1.5 text-cyan-400 font-bold text-xs uppercase tracking-wide font-mono-code">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          <span>Hydrogeological Governance Notice</span>
        </div>
        <p>{prediction.disclaimer}</p>
      </div>
    </div>
  );
};
