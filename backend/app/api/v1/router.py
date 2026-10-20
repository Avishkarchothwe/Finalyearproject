"""
Central API Router for v1.
"""
from fastapi import APIRouter
from backend.app.api.v1.endpoints import (
    prediction,
    groundwater,
    models_info,
    data_management,
    export
)

api_router = APIRouter()

api_router.include_router(prediction.router, prefix="/prediction", tags=["Prediction & XAI"])
api_router.include_router(groundwater.router, prefix="/groundwater", tags=["Groundwater & GIS Layers"])
api_router.include_router(models_info.router, prefix="/models", tags=["Model Evaluation & Ablation"])
api_router.include_router(data_management.router, prefix="/data", tags=["Data Ingestion & Quality"])
api_router.include_router(export.router, prefix="/export", tags=["Export & Reporting"])
