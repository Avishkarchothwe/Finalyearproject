"""
Pydantic schemas for prediction requests and responses.
"""
from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field, field_validator


class LocationQuery(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude in decimal degrees (e.g. 18.5204)")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude in decimal degrees (e.g. 73.8567)")

    @field_validator("latitude")
    @classmethod
    def validate_latitude(cls, v: float) -> float:
        if not (-90.0 <= v <= 90.0):
            raise ValueError("Latitude must be between -90 and 90")
        return round(v, 6)

    @field_validator("longitude")
    @classmethod
    def validate_longitude(cls, v: float) -> float:
        if not (-180.0 <= v <= 180.0):
            raise ValueError("Longitude must be between -180 and 180")
        return round(v, 6)


class FeatureContribution(BaseModel):
    feature_name: str
    display_name: str
    feature_value: Any
    unit: str
    shap_value: float
    contribution: str  # 'positive' or 'negative'
    description: str


class PredictionResponse(BaseModel):
    location: Dict[str, float]
    inside_study_area: bool
    groundwater_potential: str  # 'Low', 'Moderate', 'High' or 'Very High' / 'Very Low'
    potential_score: float  # 0 to 100
    confidence: float  # 0 to 1
    uncertainty_margin: float  # +/- score margin
    predicted_depth_mbgl: Optional[float] = None  # Estimated depth to water in meters below ground level
    features: Dict[str, Any]
    top_positive_factors: List[FeatureContribution]
    top_negative_factors: List[FeatureContribution]
    model_version: str
    disclaimer: str


class ScenarioSimulationRequest(BaseModel):
    latitude: float = Field(..., ge=18.40, le=18.65)
    longitude: float = Field(..., ge=73.70, le=74.00)
    rainfall_change_percent: float = Field(default=0.0, ge=-50.0, le=50.0, description="Precipitation variation % (-50 to +50)")
    urbanization_increase_percent: float = Field(default=0.0, ge=0.0, le=100.0, description="Impervious surface increase % (0 to 100)")
    vegetation_loss_percent: float = Field(default=0.0, ge=0.0, le=100.0, description="NDVI vegetation reduction % (0 to 100)")


class ScenarioSimulationResponse(BaseModel):
    baseline_score: float
    simulated_score: float
    score_delta: float
    baseline_category: str
    simulated_category: str
    baseline_confidence: float
    simulated_confidence: float
    key_drivers_of_change: List[str]
    hydrogeological_insight: str
