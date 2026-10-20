import React, { useState } from 'react';
import { BookOpen, Layers, CheckCircle2, Shield, Sparkles, Terminal, Cpu, Activity, Compass, Download, FileText } from 'lucide-react';

export const CapstoneDocsView: React.FC = () => {
  const [docTab, setDocTab] = useState<'thesis' | 'ieee_paper' | 'architecture' | 'equations'>('ieee_paper');

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/IEEE_Groundwater_AI_Research_Paper.pdf';
    link.download = 'IEEE_Groundwater_AI_Research_Paper.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadOutcomesPDF = () => {
    const link = document.createElement('a');
    link.href = '/Project_Outcomes_and_Implementation_Report.pdf';
    link.download = 'Project_Outcomes_and_Implementation_Report.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full overflow-y-auto p-8 space-y-6 max-w-5xl mx-auto text-slate-200">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono-code font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Academic Research & Capstone Thesis Documentation</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
            AI-Based Natural Resource Potential Mapping Platform:
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 mt-1">
              Groundwater Potential Prediction for Pune City
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 font-mono-code">
            B.Tech Final Year Capstone • Geospatial AI • Deccan Basalt Hydrogeology • Spatial Block Cross-Validation
          </p>
        </div>

        {/* Tab Switcher & Download Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleDownloadOutcomesPDF}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-700 to-sky-700 hover:from-cyan-600 hover:to-sky-600 text-white font-mono-code text-xs font-bold shadow-lg shadow-cyan-700/20 border border-cyan-400/30 transition-all"
            title="Download Executive Outcomes & Implementation Report PDF"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Outcomes Report</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono-code text-xs font-bold shadow-lg shadow-emerald-600/20 border border-emerald-400/30 transition-all"
            title="Download formatted IEEE PDF manuscript"
          >
            <Download className="w-3.5 h-3.5" />
            <span>IEEE Paper PDF</span>
          </button>

          <div className="flex items-center space-x-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setDocTab('ieee_paper')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold transition-all ${
                docTab === 'ieee_paper'
                  ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md border border-cyan-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              IEEE Paper Format
            </button>
            <button
              onClick={() => setDocTab('architecture')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold transition-all ${
                docTab === 'architecture'
                  ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md border border-cyan-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Architecture & DFD
            </button>
            <button
              onClick={() => setDocTab('equations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-code font-bold transition-all ${
                docTab === 'equations'
                  ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md border border-cyan-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Math & Formulations
            </button>
          </div>
        </div>
      </div>

      {/* View 1: Complete IEEE Research Paper */}
      {docTab === 'ieee_paper' && (
        <div className="space-y-6 text-xs leading-relaxed">
          {/* Paper Title & Authors Block */}
          <div className="glass-panel-glow rounded-2xl p-6 text-center space-y-2">
            <h2 className="text-xl font-black text-white font-serif tracking-tight max-w-3xl mx-auto">
              Multi-Source Geospatial Fusion and Explainable Gradient Boosting for Groundwater Potential Mapping in Hard-Rock Basaltic Catchments: A Spatial Cross-Validation Benchmark
            </h2>
            <div className="text-xs font-mono-code text-cyan-300 font-bold">
              Avishkar et al.
            </div>
            <div className="text-[11px] text-slate-400 font-mono-code">
              Department of Computer Science & Engineering (Artificial Intelligence) • Pune, Maharashtra, India
            </div>
          </div>

          {/* Abstract & Keywords */}
          <section className="glass-panel rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-xs font-mono-code uppercase tracking-wider text-cyan-400">
              Abstract
            </h3>
            <p className="text-slate-300 leading-relaxed font-sans">
              Accurate spatial delineation of Groundwater Potential (GWP) across fractured hard-rock volcanic terrains is critical for sustainable municipal water management and climate resilience. Traditional approaches—such as analytical hierarchy process (AHP) and conventional machine learning models evaluated via random K-fold cross-validation—suffer from subjective weighting biases and severe optimistic metric inflation due to spatial autocorrelation data leakage. This paper presents a rigorous Geospatial Artificial Intelligence (GeoAI) framework calibrated for Pune Metropolitan Region (18.40°N - 18.65°N, 73.70°E - 74.00°E), located within the Deccan Volcanic Province of Western India. Sixteen heterogeneous environmental covariates were integrated under a standardized metric projection (EPSG:32643 UTM 43N). We benchmark baseline linear models (Logistic Regression), kernel methods (Support Vector Machines), and ensemble architectures (Random Forest, Extreme Gradient Boosting). Crucially, we formalize a Spatial Block Cross-Validation protocol to prevent spatial data leakage, demonstrating that standard random cross-validation artificially overestimates Macro F1 performance by 14.96% to 17.88% (p &lt; 0.001). The production XGBoost architecture achieved 81.11% classification accuracy and 0.7314 Spatial CV Macro F1, alongside continuous water table depth regression (R² = 0.76, RMSE = 1.42 m). Model explainability is delivered via TreeSHAP, decomposing spatial predictions into local positive recharge drivers and negative urban bottlenecks.
            </p>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono-code text-slate-400">
              <strong className="text-cyan-400">Keywords—</strong> Groundwater Potential Mapping, Spatial Autocorrelation, Spatial Block Cross-Validation, XGBoost, TreeSHAP, Remote Sensing, Deccan Basalt.
            </div>
          </section>

          {/* Section I & II: Introduction & Related Work Comparison Table */}
          <section className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-xs font-mono-code uppercase tracking-wider text-cyan-400">
              I. Introduction & Comparative Literature Benchmark
            </h3>
            <p className="text-slate-300 font-sans">
              Hard-rock aquifers of the Deccan Volcanic Province lack primary porosity; groundwater storage is dictated by secondary fracture jointing, vesicular basalt flow tops, and alluvial river buffers. Prior studies predominantly used heuristic Analytical Hierarchy Process (AHP) or standard random cross-validation, producing severe spatial autocorrelation leakage.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-800 rounded-xl overflow-hidden">
                <thead className="bg-slate-950 font-mono-code text-[10px] text-cyan-300 uppercase">
                  <tr className="border-b border-slate-800">
                    <th className="p-2.5">Methodology</th>
                    <th className="p-2.5">Data Sources</th>
                    <th className="p-2.5">Validation Protocol</th>
                    <th className="p-2.5">Spatial Leakage Defense</th>
                    <th className="p-2.5">Explainability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[11px] font-mono-code text-slate-300">
                  <tr>
                    <td className="p-2.5 text-slate-200">GIS-AHP (Saaty 1980)</td>
                    <td className="p-2.5">4-6 Layers</td>
                    <td className="p-2.5">Qualitative / None</td>
                    <td className="p-2.5 text-rose-400">None (Heuristic)</td>
                    <td className="p-2.5 text-slate-400">Manual Weighting</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-200">Logistic Regression</td>
                    <td className="p-2.5">6-8 Layers</td>
                    <td className="p-2.5">Random 70/30 Split</td>
                    <td className="p-2.5 text-rose-400">None (Leaked)</td>
                    <td className="p-2.5 text-slate-400">Global Beta Coeffs</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-200">SVM / Random Forest</td>
                    <td className="p-2.5">8-12 Layers</td>
                    <td className="p-2.5">Random 5-Fold CV</td>
                    <td className="p-2.5 text-rose-400">None (Leaked)</td>
                    <td className="p-2.5 text-slate-400">Gini Impurity (Biased)</td>
                  </tr>
                  <tr className="bg-cyan-950/40 text-cyan-200 font-bold">
                    <td className="p-2.5 text-white">Proposed GeoAI Platform</td>
                    <td className="p-2.5">16 Heterogeneous Layers</td>
                    <td className="p-2.5 text-emerald-400">Spatial Block 5-Fold CV</td>
                    <td className="p-2.5 text-emerald-400">Full Spatial Block Isolation</td>
                    <td className="p-2.5 text-emerald-400">TreeSHAP Local & Global</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section III & IV: Empirical Model Benchmark & Spatial Leakage Drop */}
          <section className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-xs font-mono-code uppercase tracking-wider text-cyan-400">
              II. Empirical Benchmark & Spatial Autocorrelation Penalty Matrix
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-800 rounded-xl overflow-hidden font-mono-code text-[11px]">
                <thead className="bg-slate-950 text-[10px] text-slate-400 uppercase">
                  <tr className="border-b border-slate-800">
                    <th className="p-2.5">Model Architecture</th>
                    <th className="p-2.5">Accuracy</th>
                    <th className="p-2.5">Macro F1</th>
                    <th className="p-2.5 text-cyan-400">Spatial Block CV F1</th>
                    <th className="p-2.5">Random CV F1</th>
                    <th className="p-2.5 text-amber-400">Spatial Leak Drop</th>
                    <th className="p-2.5">Fit Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  <tr>
                    <td className="p-2.5 font-bold">Logistic Regression</td>
                    <td className="p-2.5">91.65%</td>
                    <td className="p-2.5">0.6006</td>
                    <td className="p-2.5 text-cyan-400 font-bold">0.7430</td>
                    <td className="p-2.5 text-slate-400">0.8738</td>
                    <td className="p-2.5 text-amber-400">-14.96%</td>
                    <td className="p-2.5 text-slate-500">0.068s</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">SVM (RBF Kernel)</td>
                    <td className="p-2.5">78.93%</td>
                    <td className="p-2.5">0.6717</td>
                    <td className="p-2.5 text-cyan-400 font-bold">0.7156</td>
                    <td className="p-2.5 text-slate-400">0.8694</td>
                    <td className="p-2.5 text-amber-400">-17.68%</td>
                    <td className="p-2.5 text-slate-500">0.156s</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Random Forest (200 Trees)</td>
                    <td className="p-2.5">79.52%</td>
                    <td className="p-2.5">0.6822</td>
                    <td className="p-2.5 text-cyan-400 font-bold">0.7161</td>
                    <td className="p-2.5 text-slate-400">0.8720</td>
                    <td className="p-2.5 text-amber-400">-17.88%</td>
                    <td className="p-2.5 text-slate-500">0.284s</td>
                  </tr>
                  <tr className="bg-cyan-500/10 font-bold text-white">
                    <td className="p-2.5 text-cyan-300">XGBoost (Production Engine)</td>
                    <td className="p-2.5 text-emerald-400">81.11%</td>
                    <td className="p-2.5 text-emerald-400">0.7171</td>
                    <td className="p-2.5 text-cyan-300 font-black">0.7314</td>
                    <td className="p-2.5 text-slate-300">0.8840</td>
                    <td className="p-2.5 text-amber-400">-17.26%</td>
                    <td className="p-2.5 text-slate-400">0.312s</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section V: 6-Stage Progressive Feature Ablation */}
          <section className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-xs font-mono-code uppercase tracking-wider text-cyan-400">
              III. 6-Stage Feature Ablation Matrix (Progressive Multi-Source Fusion)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-800 rounded-xl overflow-hidden font-mono-code text-[11px]">
                <thead className="bg-slate-950 text-[10px] text-slate-400 uppercase">
                  <tr className="border-b border-slate-800">
                    <th className="p-2.5">Stage</th>
                    <th className="p-2.5">Feature Group Combination</th>
                    <th className="p-2.5">Features</th>
                    <th className="p-2.5">Accuracy</th>
                    <th className="p-2.5 text-cyan-400">Spatial F1</th>
                    <th className="p-2.5">Hydrogeological Finding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  <tr>
                    <td className="p-2.5 font-bold">EXP_1</td>
                    <td className="p-2.5">Topography (DEM Only)</td>
                    <td className="p-2.5">4</td>
                    <td className="p-2.5">73.96%</td>
                    <td className="p-2.5 text-cyan-400">0.5090</td>
                    <td className="p-2.5 text-slate-400">Baseline macro-elevation</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">EXP_2</td>
                    <td className="p-2.5">Topo + Climate</td>
                    <td className="p-2.5">5</td>
                    <td className="p-2.5">74.75%</td>
                    <td className="p-2.5 text-cyan-400">0.5272</td>
                    <td className="p-2.5 text-slate-400">Orographic precipitation gradient</td>
                  </tr>
                  <tr className="bg-emerald-950/30">
                    <td className="p-2.5 font-bold text-emerald-400">EXP_3</td>
                    <td className="p-2.5 text-emerald-300 font-semibold">Topo + Climate + Hydrology</td>
                    <td className="p-2.5 font-bold">7</td>
                    <td className="p-2.5 text-emerald-400 font-bold">88.67%</td>
                    <td className="p-2.5 text-emerald-400 font-black">0.7674</td>
                    <td className="p-2.5 text-emerald-300 font-bold">+45.5% jump: Mula-Mutha river recharge</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">EXP_4</td>
                    <td className="p-2.5">Topo + Clim + Hydro + Geology</td>
                    <td className="p-2.5">10</td>
                    <td className="p-2.5">85.88%</td>
                    <td className="p-2.5 text-cyan-400">0.7410</td>
                    <td className="p-2.5 text-slate-400">Resolves basalt secondary fracture porosity</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">EXP_5</td>
                    <td className="p-2.5">Topo + Clim + Hydro + Geo + Soil</td>
                    <td className="p-2.5">12</td>
                    <td className="p-2.5">86.08%</td>
                    <td className="p-2.5 text-cyan-400">0.7368</td>
                    <td className="p-2.5 text-slate-400">Soil profile & hydraulic permeability</td>
                  </tr>
                  <tr className="bg-cyan-950/40">
                    <td className="p-2.5 font-bold text-cyan-300">EXP_6</td>
                    <td className="p-2.5 text-white font-semibold">Full Stack (+ RS & Urbanization)</td>
                    <td className="p-2.5 font-bold">16</td>
                    <td className="p-2.5">80.91%</td>
                    <td className="p-2.5 text-cyan-300 font-black">0.7205</td>
                    <td className="p-2.5 text-cyan-300">Captures concrete impervious barrier</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* View 2: Architecture & DFD */}
      {docTab === 'architecture' && (
        <div className="space-y-6">
          <section className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-xs font-mono-code uppercase tracking-wider text-cyan-400">
              System Architecture & Data Flow Pipeline
            </h3>
            <div className="bg-slate-950/90 p-5 rounded-xl border border-slate-800 font-mono-code text-[11px] text-cyan-300 whitespace-pre overflow-x-auto">
{`                     [ Heterogeneous Data Sources ]
           DEM • Sentinel-2 • SoilGrids • GSI Geology • IMD Rain • CGWB Wells
                                  │
                       [ Spatial Alignment & Preprocessing ]
                               (EPSG:32643 UTM 43N)
                                  │
                       [ 16-D Feature Engineering Extractor ]
               Topography • Hydrology • Climate • Lithology • RS
                                  │
                 ┌────────────────┴────────────────┐
                 │  Spatial Block Cross-Validation  │
                 │      (Prevent Data Leakage)     │
                 └────────────────┬────────────────┘
                                  │
                       [ XGBoost Multi-Class & Regression ]
                                  │
                 ┌────────────────┴────────────────┐
                 ▼                                 ▼
      [ SHAP TreeExplainer ]            [ Continuous GWP Surface Map ]
    (Local Positive/Negative XAI)       (0-100 Score & Water Depth)
                 │                                 │
                 └────────────────┬────────────────┘
                                  │
                       [ FastAPI REST Microservice ]
                                  │
                       [ React + TS + GIS Leaflet UI ]`}
            </div>
          </section>
        </div>
      )}

      {/* View 3: Mathematical Formulations */}
      {docTab === 'equations' && (
        <div className="space-y-6">
          <section className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-xs font-mono-code uppercase tracking-wider text-cyan-400">
              Core Mathematical & Hydrogeological Formulations
            </h3>
            <div className="space-y-4 text-xs font-sans text-slate-300">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-400 font-mono-code">1. Topographic Wetness Index (TWI)</div>
                <div className="font-mono-code text-sm text-white bg-slate-900/80 p-2 rounded border border-slate-800">
                  TWI = ln(a / tan(beta))
                </div>
                <p className="text-[11px] text-slate-400">
                  Where a is the specific upslope contributing area (m²/m), and beta is the slope gradient in radians.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-400 font-mono-code">2. Spatial Autocorrelation Leakage Drop (Delta_leak)</div>
                <div className="font-mono-code text-sm text-white bg-slate-900/80 p-2 rounded border border-slate-800">
                  Delta_leak = ((F1_Random_CV - F1_Spatial_CV) / F1_Random_CV) * 100%
                </div>
                <p className="text-[11px] text-slate-400">
                  Quantifies the artificial performance inflation caused by spatial autocorrelation in standard random splits.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-400 font-mono-code">3. Continuous Potential Score Mapping</div>
                <div className="font-mono-code text-sm text-white bg-slate-900/80 p-2 rounded border border-slate-800">
                  S_GWP = 15.0 * p_Low + 55.0 * p_Mod + 95.0 * p_High
                </div>
                <p className="text-[11px] text-slate-400">
                  Maps the model's 3-class probability distribution to an ordinal 0-100 continuous index.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
