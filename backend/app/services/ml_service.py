"""
Machine Learning & Inference Service.
"""
import os
import json
from typing import Dict, Any, List
from ml.inference.predict import GroundwaterInferenceEngine
from backend.app.core.config import settings

class MLService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MLService, cls).__new__(cls)
            cls._instance.engine = GroundwaterInferenceEngine()
            cls._instance.metadata_path = os.path.join(settings.MODEL_DIR, "model_metadata.json")
            cls._instance.ablation_path = os.path.join(settings.MODEL_DIR, "ablation_results.json")
        return cls._instance

    def predict_location(self, lat: float, lon: float) -> Dict[str, Any]:
        return self.engine.predict_point(lat, lon)

    def simulate_scenario(self, lat: float, lon: float, rain_pct: float, urban_pct: float, veg_pct: float) -> Dict[str, Any]:
        return self.engine.simulate_scenario(lat, lon, rain_pct, urban_pct, veg_pct)

    def get_model_metrics(self) -> Dict[str, Any]:
        if os.path.exists(self.metadata_path):
            with open(self.metadata_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {"error": "Model metadata not found. Train model first."}

    def get_ablation_results(self) -> List[Dict[str, Any]]:
        if os.path.exists(self.ablation_path):
            with open(self.ablation_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return []

    def get_feature_importances(self) -> List[Dict[str, Any]]:
        metrics = self.get_model_metrics()
        return metrics.get("feature_importance", [])

ml_service = MLService()
