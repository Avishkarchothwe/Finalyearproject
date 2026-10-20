"""Step 4: Generate high-resolution continuous Groundwater Potential raster & GeoJSON map."""
import os
import sys
import json
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from ml.inference.predict import GroundwaterInferenceEngine
from backend.app.core.config import settings

def generate_prediction_map():
    engine = GroundwaterInferenceEngine()
    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "processed"))
    os.makedirs(out_dir, exist_ok=True)

    bbox = settings.PUNE_BBOX
    # 50 x 50 grid covering Pune study area
    lats = np.linspace(bbox["min_lat"], bbox["max_lat"], 50)
    lons = np.linspace(bbox["min_lon"], bbox["max_lon"], 50)

    points = []
    geojson_features = []
    cat_counts = {"High": 0, "Moderate": 0, "Low": 0}
    scores = []

    print("Computing continuous prediction map across Pune...")
    for lat in lats:
        for lon in lons:
            pred = engine.predict_point(float(lat), float(lon))
            feat = pred["features"]
            score = pred["potential_score"]
            cat = pred["groundwater_potential"]

            cat_counts[cat] = cat_counts.get(cat, 0) + 1
            scores.append(score)

            pt_obj = {
                "lat": round(float(lat), 5),
                "lon": round(float(lon), 5),
                "score": score,
                "category": cat,
                "elevation": feat["elevation_m"],
                "slope": feat["slope_deg"],
                "rainfall": feat["annual_rainfall_mm"],
                "distance_to_stream_m": feat["distance_to_stream_m"]
            }
            points.append(pt_obj)

            geojson_features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [round(float(lon), 5), round(float(lat), 5)]
                },
                "properties": {
                    "score": score,
                    "category": cat,
                    "elevation_m": feat["elevation_m"],
                    "rainfall_mm": feat["annual_rainfall_mm"],
                    "stream_dist_m": feat["distance_to_stream_m"],
                    "confidence": pred["confidence"]
                }
            })

    summary_data = {
        "study_area": "Pune Metropolitan Agglomeration",
        "grid_resolution_m": 500,
        "total_cells": len(points),
        "bbox": bbox,
        "points": points,
        "category_counts": cat_counts,
        "mean_potential_score": round(float(np.mean(scores)), 2),
        "data_tag": "SYNTHETIC_PUNE_DEMO_BENCHMARK"
    }

    json_file = os.path.join(out_dir, "groundwater_potential_map.json")
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(summary_data, f)

    geojson_file = os.path.join(out_dir, "groundwater_potential_map.geojson")
    geojson_collection = {
        "type": "FeatureCollection",
        "features": geojson_features
    }
    with open(geojson_file, "w", encoding="utf-8") as f:
        json.dump(geojson_collection, f)

    print(f"Generated {len(points)} grid predictions -> {json_file} & {geojson_file}")

if __name__ == "__main__":
    generate_prediction_map()
