"""
Pydantic schemas for monitoring wells and raster map representations.
"""
from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field


class WellObservation(BaseModel):
    year: int
    pre_monsoon_depth_mbgl: float  # May measurement (dry season)
    post_monsoon_depth_mbgl: float  # Nov measurement (recharge season)
    seasonal_fluctuation_m: float
    rainfall_mm: float


class MonitoringWellSummary(BaseModel):
    well_id: str
    well_name: str
    latitude: float
    longitude: float
    elevation_m: float
    current_water_level_mbgl: float
    seasonal_fluctuation_m: float
    groundwater_potential: str
    aquifer_type: str
    lithology: str
    historical_observations_count: int
    data_source: str
    is_demo: bool


class MonitoringWellDetail(MonitoringWellSummary):
    observations: List[WellObservation]
    historical_trend: str  # 'Improving', 'Stable', 'Depleting'
    average_yield_lps: float
    recharge_rate_estimate: str


class RasterGridPoint(BaseModel):
    lat: float
    lon: float
    score: float
    category: str
    elevation: float
    slope: float
    rainfall: float
    distance_to_stream_m: float


class GroundwaterPotentialMapData(BaseModel):
    study_area: str
    grid_resolution_m: int
    total_cells: int
    bbox: Dict[str, float]
    points: List[RasterGridPoint]
    category_counts: Dict[str, int]
    mean_potential_score: float
    data_tag: str
