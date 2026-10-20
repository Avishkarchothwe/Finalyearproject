"""Integration tests for FastAPI endpoints."""
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"

def test_study_area():
    res = client.get("/api/v1/groundwater/study-area")
    assert res.status_code == 200
    assert res.json()["type"] == "FeatureCollection"

def test_monitoring_wells():
    res = client.get("/api/v1/groundwater/wells")
    assert res.status_code == 200
    wells = res.json()
    assert len(wells) > 0
    assert "well_id" in wells[0]

def test_prediction_endpoint():
    res = client.post("/api/v1/prediction", json={"latitude": 18.5204, "longitude": 73.8567})
    assert res.status_code == 200
    data = res.json()
    assert "potential_score" in data
    assert "groundwater_potential" in data
    assert len(data["top_positive_factors"]) > 0

def test_model_metrics():
    res = client.get("/api/v1/models/metrics")
    assert res.status_code == 200
    data = res.json()
    assert "benchmark_summary" in data

def test_ablation():
    res = client.get("/api/v1/models/ablation")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 6
