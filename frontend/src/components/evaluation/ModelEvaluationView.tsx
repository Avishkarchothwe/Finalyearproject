import React, { useEffect, useState } from 'react';
import { Activity, ShieldAlert, Cpu, BarChart3, GitFork, CheckCircle, Radio, Sparkles } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { fetchModelBenchmark, fetchAblationStudy } from '../../services/api';
import { ModelBenchmarkSummary, AblationExperiment } from '../../types';

export const ModelEvaluationView: React.FC = () => {
  const [benchmark, setBenchmark] = useState<ModelBenchmarkSummary | null>(null);
  const [ablation, setAblation] = useState<AblationExperiment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [benchRes, ablatRes] = await Promise.all([
          fetchModelBenchmark(),
          fetchAblationStudy()
        ]);
        setBenchmark(benchRes);
        setAblation(ablatRes);
      } catch (err) {
        console.error('Failed to load benchmark data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !benchmark) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  const importanceData = benchmark.feature_importance.slice(0, 10).map((f) => ({
    name: f.display_name.split(' (')[0],
    score: f.importance_score,
    category: f.category
  }));

  const ablationChartData = ablation.map((a) => ({
    name: `Group ${a.experiment_id.replace('EXP_', '')}`,
    features: a.features_count,
    accuracy: Math.round(a.accuracy * 100),
    spatial_f1: Math.round(a.spatial_cv_f1 * 100)
  }));

  return (
    <div className="h-full overflow-y-auto p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono-code font-bold uppercase tracking-wider mb-1">
          <Activity className="w-4 h-4" />
          <span>SPATIAL ML BENCHMARK & MULTI-SOURCE ABLATION</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Model Evaluation & Spatial Generalization Matrix
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Rigorous benchmarking of linear, kernel, and gradient-boosted models under Spatial Block Cross-Validation to eliminate spatial autocorrelation data leakage.
        </p>
      </div>

      {/* Model Benchmark Table */}
      <div className="glass-panel rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Multi-Model Benchmark Matrix (5-Fold Cross-Validation)</span>
          </h3>
          <span className="text-xs text-emerald-300 font-mono-code font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
            Selected: XGBoost Production Engine
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono-code tracking-wider">
                <th className="py-2.5 px-3">Model Architecture</th>
                <th className="py-2.5 px-3">Class</th>
                <th className="py-2.5 px-3">Accuracy</th>
                <th className="py-2.5 px-3">Macro F1</th>
                <th className="py-2.5 px-3 text-cyan-400 font-bold">Spatial Block CV F1</th>
                <th className="py-2.5 px-3">Random CV F1</th>
                <th className="py-2.5 px-3">Spatial Leak Penalty</th>
                <th className="py-2.5 px-3">Fit Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {benchmark.benchmark_summary.map((m, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    m.model_name === 'XGBoost Classifier' ? 'bg-cyan-500/10 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-3 flex items-center gap-2">
                    {m.model_name === 'XGBoost Classifier' && (
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    )}
                    <span>{m.model_name}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono-code text-[11px]">{m.model_type}</td>
                  <td className="py-3 px-3 font-mono-code font-bold">{(m.accuracy * 100).toFixed(1)}%</td>
                  <td className="py-3 px-3 font-mono-code">{(m.f1_macro * 100).toFixed(1)}%</td>
                  <td className="py-3 px-3 font-mono-code font-bold text-cyan-400">
                    {(m.spatial_cv_f1 * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 font-mono-code text-slate-400">
                    {(m.random_cv_f1 * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 font-mono-code text-amber-400">
                    -{m.spatial_autocorrelation_drop_pct.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 font-mono-code text-slate-400">{m.training_time_seconds}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Spatial Autocorrelation Leakage Explanation Box */}
      <div className="glass-panel border-cyan-500/30 rounded-2xl p-5 space-y-2">
        <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs uppercase tracking-wide font-mono-code">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>Spatial Data Leakage Defense (Tobler's First Law of Geography)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Standard random train/test splitting ignores spatial proximity, allowing points located a few meters from training observations into the validation set. This causes artificial metric inflation (Random CV F1: ~88%). 
          Our <strong>Spatial Block K-Fold</strong> partitions the study area into discrete geographic quadrants during testing, validating true out-of-neighborhood generalization.
        </p>
      </div>

      {/* Two Column Charts: Feature Importance & Ablation Study */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Global SHAP Feature Importance */}
        <div className="glass-panel rounded-2xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider font-mono-code flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Global SHAP Feature Importance (% Impact)</span>
            </h3>
            <span className="text-[10px] font-mono-code text-slate-400">Mean |SHAP|</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={importanceData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={10} unit="%" />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={90} />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#0284c7', borderRadius: '0.5rem' }} />
                <Bar dataKey="score" name="Relative Importance" fill="#0284c7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6-Stage Feature Ablation Study */}
        <div className="glass-panel rounded-2xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider font-mono-code flex items-center gap-1.5">
              <GitFork className="w-4 h-4 text-emerald-400" />
              <span>Ablation Study: Progressive Feature Fusion</span>
            </h3>
            <span className="text-[10px] font-mono-code text-slate-400">6 Fusion Stages</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ablationChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} unit="%" domain={[40, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#10b981', borderRadius: '0.5rem' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="accuracy" name="Accuracy %" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="spatial_f1" name="Spatial CV F1 %" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
