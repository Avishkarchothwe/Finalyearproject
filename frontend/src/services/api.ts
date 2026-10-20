import {
  PredictionResult,
  MonitoringWell,
  GroundwaterMapData,
  ModelBenchmarkSummary,
  AblationExperiment,
  ScenarioSimulationResult,
  DataQualityReport
} from '../types';

const API_BASE = '/api/v1';

export async function fetchHealth(): Promise<any> {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchStudyArea(): Promise<any> {
  const res = await fetch(`${API_BASE}/groundwater/study-area`);
  return res.json();
}

export async function fetchMonitoringWells(): Promise<MonitoringWell[]> {
  const res = await fetch(`${API_BASE}/groundwater/wells`);
  return res.json();
}

export async function fetchWellDetails(wellId: string): Promise<MonitoringWell> {
  const res = await fetch(`${API_BASE}/groundwater/wells/${wellId}`);
  return res.json();
}

export async function fetchPotentialMap(): Promise<GroundwaterMapData> {
  const res = await fetch(`${API_BASE}/groundwater/potential-map`);
  return res.json();
}

export async function predictLocation(lat: number, lon: number): Promise<PredictionResult> {
  const res = await fetch(`${API_BASE}/prediction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude: lat, longitude: lon })
  });
  if (!res.ok) {
    throw new Error('Failed to compute groundwater potential prediction');
  }
  return res.json();
}

export async function simulateScenario(
  lat: number,
  lon: number,
  rainPct: number,
  urbanPct: number,
  vegPct: number
): Promise<ScenarioSimulationResult> {
  const res = await fetch(`${API_BASE}/prediction/scenario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      latitude: lat,
      longitude: lon,
      rainfall_change_percent: rainPct,
      urbanization_increase_percent: urbanPct,
      vegetation_loss_percent: vegPct
    })
  });
  if (!res.ok) {
    throw new Error('Failed to run scenario simulation');
  }
  return res.json();
}

export async function fetchModelBenchmark(): Promise<ModelBenchmarkSummary> {
  const res = await fetch(`${API_BASE}/models/metrics`);
  return res.json();
}

export async function fetchAblationStudy(): Promise<AblationExperiment[]> {
  const res = await fetch(`${API_BASE}/models/ablation`);
  return res.json();
}

export async function uploadDatasetForAudit(file: File): Promise<DataQualityReport> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/data/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Data audit failed');
  }
  return res.json();
}
