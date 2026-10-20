import React, { useState } from 'react';
import { Database, UploadCloud, CheckCircle2, AlertTriangle, XCircle, FileText, Info, Sparkles, Terminal } from 'lucide-react';
import { uploadDatasetForAudit } from '../../services/api';
import { DataQualityReport } from '../../types';

export const DataQualityView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<DataQualityReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleLoadSampleCSV = () => {
    const sampleCsvContent = `well_id,well_name,latitude,longitude,water_level_mbgl,date,aquifer
PUN_OBS_01,Shivajinagar Station,18.5314,73.8446,4.8,2024-11-15,River Alluvium
PUN_OBS_02,Kothrud Depot,18.5074,73.8077,7.2,2024-11-15,Fractured Basalt
PUN_OBS_03,Katraj Basin,18.4485,73.8580,9.4,2024-11-15,Weathered Basalt
PUN_OBS_04,Hinjewadi Tech Park,18.5913,73.7389,8.1,2024-11-15,Vesicular Basalt
PUN_OBS_05,Viman Nagar East,18.5679,73.9143,5.6,2024-11-15,Alluvium
PUN_OBS_06,Aundh Gaon,18.5580,73.8070,4.2,2024-11-15,Alluvium`;
    
    const blob = new Blob([sampleCsvContent], { type: 'text/csv' });
    const sampleFile = new File([blob], 'Pune_Groundwater_Field_Observations_2024.csv', { type: 'text/csv' });
    setFile(sampleFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await uploadDatasetForAudit(file);
      setReport(res);
    } catch (err: any) {
      setError(err.message || 'Data quality audit failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono-code font-bold uppercase tracking-wider mb-1">
          <Database className="w-4 h-4" />
          <span>DATA INGESTION & GEOSPATIAL AUDIT TERMINAL</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Dataset Ingestion & Spatial Integrity Audit
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Verify coordinate reference system (CRS), bounding box boundaries, duplicate telemetry coordinates, and statistical outlier anomalies.
        </p>
      </div>

      {/* File Upload Dropzone */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-mono-code font-bold text-slate-300">SELECT INGESTION DATASET</span>
          <button
            onClick={handleLoadSampleCSV}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 text-xs font-mono-code font-semibold border border-cyan-500/30 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Sample Pune Observations (CSV)</span>
          </button>
        </div>

        <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/60 rounded-xl p-8 text-center transition-colors bg-slate-950/40">
          <input
            type="file"
            id="dataset-upload"
            accept=".csv,.geojson,.json"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="dataset-upload" className="cursor-pointer flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-200">
                {file ? file.name : 'Click or Drag & Drop Observation Dataset'}
              </span>
              <p className="text-xs text-slate-500 mt-0.5 font-mono-code">Format: CSV, GeoJSON (WGS84 EPSG:4326), max 25MB</p>
            </div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono-code">
            {file && <span>Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)</span>}
          </div>
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white text-xs font-mono-code font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-600/30 transition-all border border-cyan-400/30 disabled:opacity-50"
          >
            {loading ? 'Executing Audit...' : 'Execute Data Audit'}
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-mono-code">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Quality Report Display */}
      {report && (
        <div className="glass-panel-glow rounded-2xl p-6 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-mono-code font-bold text-sm text-white">Spatial Data Audit Report</h3>
                <div className="text-[11px] text-slate-400 font-mono-code">{report.dataset_name}</div>
              </div>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold uppercase tracking-wider border ${
              report.validation_status === 'Passed'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : report.validation_status === 'Passed with Warnings'
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
            }`}>
              {report.validation_status}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 font-mono-code">
              <span className="text-[10px] uppercase font-bold text-slate-500">Total Observations</span>
              <div className="text-xl font-black text-slate-100 mt-0.5">{report.total_records}</div>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 font-mono-code">
              <span className="text-[10px] uppercase font-bold text-slate-500">Valid Pune Points</span>
              <div className="text-xl font-black text-emerald-400 mt-0.5">{report.inside_study_area_count}</div>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 font-mono-code">
              <span className="text-[10px] uppercase font-bold text-slate-500">Detected CRS</span>
              <div className="text-sm font-bold text-cyan-400 mt-1 truncate">{report.detected_crs}</div>
            </div>
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 font-mono-code">
              <span className="text-[10px] uppercase font-bold text-slate-500">Statistical Outliers</span>
              <div className="text-xl font-black text-amber-400 mt-0.5">{report.outliers_detected}</div>
            </div>
          </div>

          {/* Issues and Findings */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono-code font-bold text-slate-300 uppercase tracking-wider">Validation Notes</h4>
            {report.issues.map((iss, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border text-xs flex items-start space-x-2.5 font-mono-code ${
                  iss.severity === 'Error'
                    ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                    : iss.severity === 'Warning'
                    ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                    : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300'
                }`}
              >
                {iss.severity === 'Error' ? (
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                ) : iss.severity === 'Warning' ? (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold">{iss.field ? `${iss.field}: ` : ''}{iss.message}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Affected Records: {iss.affected_rows_count}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 text-xs text-slate-300 font-sans">
            <strong className="text-cyan-400 font-mono-code">Executive Summary:</strong> {report.summary}
          </div>
        </div>
      )}
    </div>
  );
};
