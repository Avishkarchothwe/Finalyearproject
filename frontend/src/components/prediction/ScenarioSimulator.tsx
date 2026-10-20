import React, { useState } from 'react';
import { Cpu, RefreshCw, Sparkles, TrendingUp, TrendingDown, CloudRain, Building2, Trees, RotateCcw, Activity, ShieldAlert } from 'lucide-react';
import { simulateScenario } from '../../services/api';
import { ScenarioSimulationResult } from '../../types';

interface ScenarioSimulatorProps {
  latitude: number;
  longitude: number;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ latitude, longitude }) => {
  const [rainPct, setRainPct] = useState(0);
  const [urbanPct, setUrbanPct] = useState(0);
  const [vegPct, setVegPct] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScenarioSimulationResult | null>(null);

  const applyPreset = (rain: number, urban: number, veg: number) => {
    setRainPct(rain);
    setUrbanPct(urban);
    setVegPct(veg);
  };

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await simulateScenario(latitude, longitude, rainPct, urbanPct, vegPct);
      setResult(res);
    } catch (err) {
      console.error('Simulation error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono-code font-bold uppercase tracking-wider mb-1">
          <Cpu className="w-4 h-4" />
          <span>HYDROGEOLOGICAL STRESS-TEST ENGINE</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Climate & Urbanization Scenario Simulation
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Evaluate "What-If" climate change precipitation anomalies and urban expansion stress on aquifer recharge for coordinates ({latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E).
        </p>
      </div>

      {/* Preset Chips */}
      <div className="glass-panel rounded-2xl p-4 space-y-2.5">
        <span className="text-[11px] font-mono-code font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Calibrated Simulation Presets</span>
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => applyPreset(25, 0, 0)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-semibold transition-all flex items-center gap-2 shadow-sm"
          >
            <CloudRain className="w-3.5 h-3.5 text-emerald-400" />
            <span>Monsoon Surplus (+25% Rain)</span>
          </button>

          <button
            onClick={() => applyPreset(-30, 0, 0)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 font-semibold transition-all flex items-center gap-2 shadow-sm"
          >
            <CloudRain className="w-3.5 h-3.5 text-rose-400" />
            <span>Drought Deficit (-30% Rain)</span>
          </button>

          <button
            onClick={() => applyPreset(-10, 45, 20)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 font-semibold transition-all flex items-center gap-2 shadow-sm"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Urban Sprawl (+45% Impervious)</span>
          </button>

          <button
            onClick={() => applyPreset(0, 0, 0)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold transition-all flex items-center gap-2 border border-slate-700 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Slider 1: Rainfall */}
        <div className="glass-panel rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-200 flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
              <span>Precipitation Delta</span>
            </span>
            <span className={`font-mono-code font-bold ${rainPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {rainPct > 0 ? `+${rainPct}%` : `${rainPct}%`}
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="5"
            value={rainPct}
            onChange={(e) => setRainPct(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono-code">
            <span>-50% (Drought)</span>
            <span>0%</span>
            <span>+50% (Surplus)</span>
          </div>
        </div>

        {/* Slider 2: Urbanization */}
        <div className="glass-panel rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-200 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Impervious Expansion</span>
            </span>
            <span className="font-mono-code font-bold text-amber-400">+{urbanPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="5"
            value={urbanPct}
            onChange={(e) => setUrbanPct(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono-code">
            <span>0% (Current)</span>
            <span>+40%</span>
            <span>+80% (Dense)</span>
          </div>
        </div>

        {/* Slider 3: Vegetation Loss */}
        <div className="glass-panel rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-200 flex items-center gap-1.5">
              <Trees className="w-3.5 h-3.5 text-rose-400" />
              <span>Canopy Reduction</span>
            </span>
            <span className="font-mono-code font-bold text-rose-400">-{vegPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="5"
            value={vegPct}
            onChange={(e) => setVegPct(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono-code">
            <span>0% (Intact)</span>
            <span>-30%</span>
            <span>-60% (Severe)</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSimulate}
          disabled={loading}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-600/30 transition-all border border-cyan-400/30 disabled:opacity-50 font-mono-code uppercase tracking-wider"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Execute Simulation</span>
        </button>
      </div>

      {result && (
        <div className="glass-panel-glow rounded-2xl p-6 space-y-5 shadow-2xl">
          <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-3">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="font-mono-code font-bold text-sm text-white uppercase tracking-wider">
              Simulation Telemetry Output
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-center space-y-1">
              <div className="text-[10px] font-mono-code uppercase font-bold text-slate-400">Baseline Score</div>
              <div className="text-3xl font-black font-mono-code text-slate-300">{result.baseline_score}</div>
              <div className="text-xs font-semibold text-slate-400">{result.baseline_category} Potential</div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-center flex flex-col items-center justify-center space-y-1">
              <div className="text-[10px] font-mono-code uppercase font-bold text-slate-400">Net Impact Shift</div>
              <div className={`text-3xl font-black font-mono-code flex items-center gap-1.5 ${
                result.score_delta > 0 ? 'text-emerald-400' : result.score_delta < 0 ? 'text-rose-400' : 'text-slate-400'
              }`}>
                {result.score_delta > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {result.score_delta > 0 ? `+${result.score_delta}` : result.score_delta}
              </div>
              <div className="text-[11px] font-mono-code text-slate-500">Score Variation</div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-center space-y-1">
              <div className="text-[10px] font-mono-code uppercase font-bold text-slate-400">Simulated Score</div>
              <div className="text-3xl font-black font-mono-code text-cyan-400">{result.simulated_score}</div>
              <div className="text-xs font-semibold text-cyan-300">{result.simulated_category} Potential</div>
            </div>
          </div>

          <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-xl p-4 space-y-1.5">
            <div className="text-xs font-mono-code font-bold text-cyan-300 uppercase tracking-wide">
              Hydrogeological AI Assessment
            </div>
            <p className="text-xs text-cyan-200/90 leading-relaxed font-sans">{result.hydrogeological_insight}</p>
          </div>
        </div>
      )}
    </div>
  );
};
