import React from 'react';
import { ArrowUpRight, ArrowDownRight, Sparkles, Activity } from 'lucide-react';
import { FeatureContribution } from '../../types';

interface ShapExplanationCardProps {
  positiveFactors: FeatureContribution[];
  negativeFactors: FeatureContribution[];
}

export const ShapExplanationCard: React.FC<ShapExplanationCardProps> = ({
  positiveFactors,
  negativeFactors
}) => {
  return (
    <div className="space-y-3 glass-panel rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-200">
            Explainable AI (TreeSHAP Attribution)
          </h3>
        </div>
        <span className="text-[10px] font-mono-code text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
          LOCAL MARGINAL CONTRIBUTION
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Positive Recharge Drivers */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1 text-emerald-400 text-xs font-mono-code font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Recharge Drivers (+)</span>
          </div>

          <div className="space-y-1.5">
            {positiveFactors.map((f, idx) => (
              <div key={idx} className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-2.5 text-xs space-y-1 shadow-sm">
                <div className="flex items-center justify-between font-semibold text-emerald-300">
                  <span className="truncate pr-1 text-[11px]">{f.display_name}</span>
                  <span className="font-mono-code text-[11px] font-bold text-emerald-400">+{f.shap_value}</span>
                </div>
                <div className="text-[10px] text-emerald-300/80 leading-relaxed">
                  {f.description}
                </div>
              </div>
            ))}
            {positiveFactors.length === 0 && (
              <div className="text-[10px] text-slate-500 italic p-2 font-mono-code">No dominant positive drivers.</div>
            )}
          </div>
        </div>

        {/* Negative Limiting Factors */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1 text-rose-400 text-xs font-mono-code font-bold">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Runoff & Blockage (-)</span>
          </div>

          <div className="space-y-1.5">
            {negativeFactors.map((f, idx) => (
              <div key={idx} className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-2.5 text-xs space-y-1 shadow-sm">
                <div className="flex items-center justify-between font-semibold text-rose-300">
                  <span className="truncate pr-1 text-[11px]">{f.display_name}</span>
                  <span className="font-mono-code text-[11px] font-bold text-rose-400">{f.shap_value}</span>
                </div>
                <div className="text-[10px] text-rose-300/80 leading-relaxed">
                  {f.description}
                </div>
              </div>
            ))}
            {negativeFactors.length === 0 && (
              <div className="text-[10px] text-slate-500 italic p-2 font-mono-code">No dominant limiting factors.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
