export interface FeatureContribution {
  feature_name: string;
  display_name: string;
  feature_value: number | string;
  unit: string;
  shap_value: number;
  contribution: 'positive' | 'negative';
  description: string;
}

export interface PredictionResult {
  location: {
    latitude: number;
    longitude: number;
  };
  inside_study_area: boolean;
  groundwater_potential: 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High' | string;
  potential_score: number;
  confidence: number;
  uncertainty_margin: number;
  predicted_depth_mbgl?: number | null;
  features: Record<string, any>;
  top_positive_factors: FeatureContribution[];
  top_negative_factors: FeatureContribution[];
  model_version: string;
  disclaimer: string;
}

export interface WellObservation {
  year: number;
  pre_monsoon_depth_mbgl: number;
  post_monsoon_depth_mbgl: number;
  seasonal_fluctuation_m: number;
  rainfall_mm: number;
}

export interface MonitoringWell {
  well_id: string;
  well_name: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  current_water_level_mbgl: number;
  seasonal_fluctuation_m: number;
  groundwater_potential: string;
  potential_score?: number;
  aquifer_type: string;
  lithology: string;
  average_yield_lps: number;
  historical_trend: string;
  historical_observations_count: number;
  recharge_rate_estimate: string;
  data_source: string;
  is_demo: boolean;
  observations?: WellObservation[];
}

export interface RasterGridPoint {
  lat: number;
  lon: number;
  score: number;
  category: string;
  elevation: number;
  slope: number;
  rainfall: number;
  distance_to_stream_m: number;
}

export interface GroundwaterMapData {
  study_area: string;
  grid_resolution_m: number;
  total_cells: number;
  bbox: {
    min_lat: number;
    max_lat: number;
    min_lon: number;
    max_lon: number;
    center_lat: number;
    center_lon: number;
  };
  points: RasterGridPoint[];
  category_counts: Record<string, number>;
  mean_potential_score: number;
  data_tag: string;
}

export interface ModelMetrics {
  model_name: string;
  model_type: string;
  accuracy: number;
  precision_macro: number;
  recall_macro: number;
  f1_macro: number;
  roc_auc_ovr: number | null;
  spatial_cv_f1: number;
  random_cv_f1: number;
  spatial_autocorrelation_drop_pct: number;
  training_time_seconds: number;
  confusion_matrix: number[][];
  classes: string[];
}

export interface FeatureImportanceItem {
  feature_name: string;
  display_name: string;
  category: string;
  importance_score: number;
  shap_mean_abs: number;
  description: string;
}

export interface ModelBenchmarkSummary {
  model_type: string;
  regression_model_type: string;
  training_date: string;
  features: string[];
  classes: string[];
  best_accuracy: number;
  best_f1: number;
  best_spatial_cv_f1: number;
  benchmark_summary: ModelMetrics[];
  feature_importance: FeatureImportanceItem[];
  spatial_leakage_note: string;
}

export interface AblationExperiment {
  experiment_id: string;
  feature_group_combination: string;
  feature_names: string[];
  features_count: number;
  accuracy: number;
  f1_macro: number;
  spatial_cv_f1: number;
  key_takeaway: string;
}

export interface ScenarioSimulationResult {
  baseline_score: number;
  simulated_score: number;
  score_delta: number;
  baseline_category: string;
  simulated_category: string;
  baseline_confidence: number;
  simulated_confidence: number;
  key_drivers_of_change: string[];
  hydrogeological_insight: string;
}

export interface DataQualityReport {
  dataset_name: string;
  file_type: string;
  total_records: number;
  valid_records: number;
  duplicate_records: number;
  missing_values_by_column: Record<string, number>;
  missing_percentage: number;
  detected_crs: string;
  spatial_extent: Record<string, number>;
  inside_study_area_count: number;
  outside_study_area_count: number;
  outliers_detected: number;
  issues: Array<{
    severity: string;
    field?: string;
    message: string;
    affected_rows_count: number;
  }>;
  validation_status: 'Passed' | 'Passed with Warnings' | 'Failed';
  summary: string;
}
