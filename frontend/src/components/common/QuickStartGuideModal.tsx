import React from 'react';
import { X, MapPin, Droplets, Sparkles, Cpu, Database, CheckCircle2, HelpCircle } from 'lucide-react';

interface QuickStartGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickStartGuideModal: React.FC<QuickStartGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: MapPin,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      title: '1. Select or Search Any Pune Location',
      description: 'Click anywhere inside the Pune boundary on the interactive map, use the coordinate search bar, or click any landmark preset (e.g., Shivajinagar, Kothrud, Hinjewadi).'
    },
    {
      icon: Droplets,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      title: '2. Review AI Groundwater Potential & Water Depth',
      description: 'The right panel immediately calculates the 0-100 Potential Score, category (High, Moderate, Low), prediction confidence %, and estimated depth to water table (mbgl).'
    },
    {
      icon: Sparkles,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: '3. Inspect Explainable AI (SHAP) Drivers',
      description: 'Understand the hydrogeological reasoning behind each prediction: see which parameters acted as positive recharge drivers (+) and which acted as runoff/blockage factors (-).'
    },
    {
      icon: Droplets,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      title: '4. Analyze Monitoring Wells & Historical Fluctuation',
      description: 'Click on any of the 180 monitoring well markers or open the Well Catalog drawer to view 6-year pre-monsoon vs post-monsoon water depth trends and seasonal swings.'
    },
    {
      icon: Cpu,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      title: '5. Run "What-If" Climate & Urbanization Scenarios',
      description: 'Navigate to the Scenario Simulator tab to test how +25% monsoon rainfall or +40% urban impervious surface growth affects aquifer recharge at that exact spot.'
    },
    {
      icon: Database,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      title: '6. Ingest & Audit New Field Observations',
      description: 'Upload CSV or GeoJSON groundwater monitoring records in the Data Ingestion tab to run automatic CRS validation, bounding box verification, and outlier diagnostics.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">How to Use the GeoHydroAI Platform</h2>
              <p className="text-xs text-slate-400">Quick interactive guide for exploring Pune groundwater intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center border text-xs font-bold ${step.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-200">{step.title}</h3>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-1">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-sky-950/30 border border-sky-500/20 rounded-xl p-3.5 flex items-center justify-between text-xs">
          <div className="text-sky-300 font-medium">
            Ready to explore? Click any point on the map to begin.
          </div>
          <button
            onClick={onClose}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-1.5 rounded-lg shadow-md transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
