"""
Model Evaluation, Benchmark, and Ablation Endpoints.
"""
from fastapi import APIRouter
from typing import List, Dict, Any
from backend.app.services.ml_service import ml_service

router = APIRouter()

@router.get("/metrics")
def get_model_benchmark_metrics():
    """Returns multi-model comparison table (LR, SVM, RF, XGBoost) and Spatial Block CV results."""
    return ml_service.get_model_metrics()

@router.get("/features")
def get_global_feature_importance():
    """Returns global SHAP mean absolute importance values across all 16 geospatial features."""
    return ml_service.get_feature_importances()

@router.get("/ablation")
def get_ablation_study_results():
    """Returns 6-stage feature group ablation experiment results demonstrating multi-source fusion gains."""
    return ml_service.get_ablation_results()
