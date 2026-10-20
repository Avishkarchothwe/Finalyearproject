import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-slate-950/80 border-b border-cyan-900/30 px-6 py-1.5 flex items-center justify-between text-xs text-slate-400 font-medium backdrop-blur-md">
      <div className="flex items-center space-x-2.5 truncate">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="truncate">
          <strong className="text-slate-300 font-semibold">Scientific Methodology:</strong> Multi-criteria AI estimation derived from DEM topography, Deccan Basalt fractures, Mula-Mutha drainage, soil hydraulic conductivity, and rainfall grids.
        </span>
      </div>
      <div className="flex items-center space-x-2 shrink-0 ml-4 font-mono-code text-[10px]">
        <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/20">
          SPATIAL BLOCK K-FOLD CV
        </span>
        <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/20">
          TREE-SHAP EXPLAINER
        </span>
      </div>
    </div>
  );
};
