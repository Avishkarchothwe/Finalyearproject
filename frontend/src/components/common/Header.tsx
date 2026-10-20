import React from 'react';
import { Droplets, Activity, Cpu, FileText, Database, Compass, HelpCircle, ListFilter, Radio } from 'lucide-react';

interface HeaderProps {
  activeTab: 'map' | 'evaluation' | 'simulation' | 'data' | 'docs';
  setActiveTab: (tab: 'map' | 'evaluation' | 'simulation' | 'data' | 'docs') => void;
  onOpenGuide: () => void;
  onOpenWellCatalog: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenGuide,
  onOpenWellCatalog
}) => {
  return (
    <header className="h-16 bg-slate-950/90 backdrop-blur-xl border-b border-cyan-500/20 px-6 flex items-center justify-between z-30 shrink-0 shadow-lg shadow-black/40">
      {/* Brand Title & Telemetry Subtitle */}
      <div className="flex items-center space-x-3.5">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-400/30">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping"></span>
        </div>

        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="font-extrabold text-base text-slate-100 tracking-tight flex items-center gap-1.5 font-sans">
              <span className="bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">GeoHydro</span>
              <span className="text-cyan-400 font-black tracking-widest text-sm bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30 font-mono-code">AI</span>
            </h1>
            <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
              PUNE BASIN • EPSG:32643
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium tracking-tight">
            AI-Driven Groundwater Potential Telemetry & Hydrogeological Intelligence
          </p>
        </div>
      </div>

      {/* Segmented Navigation Menu */}
      <nav className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80 shadow-inner">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'map'
              ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-600/30 border border-cyan-400/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>GIS Telemetry Map</span>
        </button>

        <button
          onClick={() => setActiveTab('evaluation')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'evaluation'
              ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-600/30 border border-cyan-400/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Model Benchmark</span>
        </button>

        <button
          onClick={() => setActiveTab('simulation')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'simulation'
              ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-600/30 border border-cyan-400/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Scenario Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('data')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'data'
              ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-600/30 border border-cyan-400/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Data Ingestion & QA</span>
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'docs'
              ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md shadow-cyan-600/30 border border-cyan-400/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Capstone Thesis</span>
        </button>
      </nav>

      {/* Right Controls & Engine Badge */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onOpenWellCatalog}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700/80 transition-colors shadow-sm"
          title="Open Catalog of 180 Pune Well Stations"
        >
          <ListFilter className="w-3.5 h-3.5 text-cyan-400" />
          <span>Well Stations</span>
        </button>

        <button
          onClick={onOpenGuide}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-colors shadow-sm"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Guide</span>
        </button>

        <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></span>
          <span className="text-[11px] font-mono-code font-bold text-emerald-300 tracking-wider">XGB-SHAP v1.0</span>
        </div>
      </div>
    </header>
  );
};
