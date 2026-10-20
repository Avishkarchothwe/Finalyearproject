"""
Configuration settings for Groundwater AI Platform.
"""
import os
from typing import List, Dict, Any
from pydantic_settings import BaseSettings

_BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Groundwater Potential Mapping Platform"
    API_V1_STR: str = "/api/v1"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "AI-Driven Groundwater Potential Prediction and Mapping System for Pune City"
    
    # Study Area Bounding Box (Pune Urban Region) in EPSG:4326 (WGS84)
    PUNE_BBOX: Dict[str, float] = {
        "min_lat": 18.40,
        "max_lat": 18.65,
        "min_lon": 73.70,
        "max_lon": 74.00,
        "center_lat": 18.5204,
        "center_lon": 73.8567
    }
    
    # Spatial CRS Definitions
    DEFAULT_WGS84_CRS: str = "EPSG:4326"
    PROJECTED_UTM_CRS: str = "EPSG:32643"  # UTM Zone 43N for Western India / Pune
    
    # Classification Thresholds for 0-100 Score
    POTENTIAL_THRESHOLDS: Dict[str, Dict[str, float]] = {
        "Very Low": {"min": 0.0, "max": 30.0},
        "Low": {"min": 30.0, "max": 50.0},
        "Moderate": {"min": 50.0, "max": 70.0},
        "High": {"min": 70.0, "max": 85.0},
        "Very High": {"min": 85.0, "max": 100.0}
    }
    
    # Security & File Uploads
    MAX_UPLOAD_SIZE_MB: int = 25
    ALLOWED_EXTENSIONS: List[str] = [".csv", ".geojson", ".json", ".tif", ".tiff"]
    
    # Paths
    BASE_DIR: str = _BASE_DIR
    DATA_DIR: str = os.path.join(_BASE_DIR, "data")
    MODEL_DIR: str = os.path.join(_BASE_DIR, "models")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ]

    class Config:
        case_sensitive = True


settings = Settings()
