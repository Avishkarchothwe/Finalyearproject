"""
FastAPI Application Entry Point.
"""
import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from backend.app.core.config import settings
from backend.app.api.v1.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
    # AI-Based Natural Resource Potential Mapping Platform
    ### AI-Driven Groundwater Potential Prediction & Mapping System for Pune City
    
    Combines:
    - Sentinel-2 Remote Sensing Indices (NDVI, NDWI, NDBI)
    - Digital Elevation Models (SRTM DEM, Slope, Aspect, TWI, Ruggedness)
    - Deccan Volcanic Basalt Lithology & Lineaments
    - Hydrological Drainage & Stream Buffers (Mula-Mutha Basin)
    - Rainfall Orographic Gradients (IMD / CHIRPS)
    - Soil Permeability & Vertisol Thickness
    - Spatial Block Cross-Validation & SHAP TreeExplainer Local Interpretability.
    
    *Disclaimer: Predictions represent AI-estimated groundwater potential based on available geospatial evidence and do not constitute direct physical sub-surface measurements.*
    """,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", include_in_schema=False)
def root_redirect():
    return RedirectResponse(url=f"{settings.API_V1_STR}/docs")

@app.get("/health", tags=["Health"])
@app.get(f"{settings.API_V1_STR}/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "study_area": "Pune City, Maharashtra, India",
        "model_engine": "XGBoost + SHAP TreeExplainer",
        "crs": settings.PROJECTED_UTM_CRS
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
