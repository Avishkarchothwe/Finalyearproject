"""
Prediction Endpoints.
"""
from fastapi import APIRouter, HTTPException, Query
from backend.app.schemas.prediction import (
    LocationQuery,
    PredictionResponse,
    ScenarioSimulationRequest,
    ScenarioSimulationResponse
)
from backend.app.services.ml_service import ml_service

router = APIRouter()

@router.post("", response_model=PredictionResponse)
def predict_groundwater_potential(payload: LocationQuery):
    """
    Primary AI Inference Endpoint.
    Estimates groundwater potential score (0-100), category, confidence,
    depth to water table (mbgl), and SHAP positive/negative factor breakdown for given coordinates.
    """
    result = ml_service.predict_location(payload.latitude, payload.longitude)
    return result

@router.get("/{lat}/{lon}", response_model=PredictionResponse)
def get_prediction_by_coordinates(lat: float, lon: float):
    """Convenience GET endpoint for point predictions directly via URL."""
    if not (18.0 <= lat <= 19.5 and 73.0 <= lon <= 74.5):
        raise HTTPException(status_code=400, detail="Coordinates outside regional scope.")
    return ml_service.predict_location(lat, lon)

@router.post("/scenario", response_model=ScenarioSimulationResponse)
def simulate_environmental_scenario(payload: ScenarioSimulationRequest):
    """
    Scenario Simulation Endpoint.
    Models 'What-If' shifts in precipitation (+/-50%), urban impervious surface expansion,
    and vegetation loss on groundwater recharge and potential scores.
    """
    return ml_service.simulate_scenario(
        lat=payload.latitude,
        lon=payload.longitude,
        rain_pct=payload.rainfall_change_percent,
        urban_pct=payload.urbanization_increase_percent,
        veg_pct=payload.vegetation_loss_percent
    )
