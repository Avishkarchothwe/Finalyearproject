"""Tests for ML inference, SHAP explanation, and scenario simulation."""
import pytest
from ml.inference.predict import GroundwaterInferenceEngine

def test_point_prediction():
    engine = GroundwaterInferenceEngine()
    res = engine.predict_point(18.5204, 73.8567)
    
    assert res["groundwater_potential"] in ["Low", "Moderate", "High"]
    assert 0.0 <= res["potential_score"] <= 100.0
    assert 0.0 <= res["confidence"] <= 1.0
    assert res["uncertainty_margin"] > 0
    assert len(res["top_positive_factors"]) <= 4
    assert len(res["top_negative_factors"]) <= 4
    assert "disclaimer" in res

def test_scenario_simulation():
    engine = GroundwaterInferenceEngine()
    sim = engine.simulate_scenario(
        lat=18.5204,
        lon=73.8567,
        rainfall_change_pct=20.0,
        urbanization_increase_pct=10.0,
        vegetation_loss_pct=5.0
    )
    assert "baseline_score" in sim
    assert "simulated_score" in sim
    assert "score_delta" in sim
    assert "hydrogeological_insight" in sim
