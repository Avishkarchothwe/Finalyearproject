"""
Pydantic schemas for model performance benchmarking, spatial validation, and ablation studies.
"""
from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field


class ModelPerformanceMetrics(BaseModel):
    model_name: str
    model_type: str
    accuracy: float
    precision_macro: float
    recall_macro: float
    f1_macro: float
    roc_auc_ovr: Optional[float] = None
    spatial_cv_f1: float
    random_cv_f1: float
    spatial_autocorrelation_drop_pct: float
    training_time_seconds: float
    confusion_matrix: List[List[int]]
    classes: List[str]


class FeatureImportanceItem(BaseModel):
    feature_name: str
    display_name: str
    category: str  # Topography, Hydrology, Geology, Climate, Soil, Remote Sensing, Urban
    importance_score: float
    shap_mean_abs: float
    description: str


class AblationExperimentResult(BaseModel):
    experiment_id: str
    feature_group_combination: str
    feature_names: List[str]
    features_count: int
    accuracy: float
    f1_macro: float
    spatial_cv_f1: float
    key_takeaway: str


class ModelBenchmarkSummary(BaseModel):
    best_model_name: str
    best_model_accuracy: float
    best_model_f1: float
    best_model_spatial_cv_f1: float
    models: List[ModelPerformanceMetrics]
    feature_importances: List[FeatureImportanceItem]
    ablation_experiments: List[AblationExperimentResult]
    spatial_leakage_analysis: str
