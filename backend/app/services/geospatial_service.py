"""
Geospatial Data & Layer Services.
"""
import os
import json
from typing import Dict, Any, List
from backend.app.core.config import settings

class GeospatialService:
    def __init__(self):
        self.study_area_path = os.path.join(settings.BASE_DIR, "geospatial", "study_area.geojson")
        self.map_data_path = os.path.join(settings.DATA_DIR, "processed", "groundwater_potential_map.json")
        self.geojson_map_path = os.path.join(settings.DATA_DIR, "processed", "groundwater_potential_map.geojson")

    def get_study_area(self) -> Dict[str, Any]:
        if os.path.exists(self.study_area_path):
            with open(self.study_area_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {"name": "Pune Default Box"},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[73.70, 18.40], [74.00, 18.40], [74.00, 18.65], [73.70, 18.65], [73.70, 18.40]]]
                }
            }]
        }

    def get_available_layers(self) -> List[Dict[str, Any]]:
        return [
            {
                "id": "gwp_potential_map",
                "name": "Groundwater Potential Zones (GWP)",
                "category": "AI Prediction Surface",
                "type": "raster_heatmap",
                "description": "Continuous 0-100 AI-predicted groundwater potential surface across Pune.",
                "color_ramp": ["#d73027", "#fc8d59", "#fee08b", "#91cf60", "#1a9850"],
                "labels": ["Very Low", "Low", "Moderate", "High", "Very High"],
                "default_visible": True,
                "opacity": 0.65
            },
            {
                "id": "monitoring_wells",
                "name": "Groundwater Monitoring Wells (CGWB/GSDA)",
                "category": "Field Observations",
                "type": "point_markers",
                "description": "180 observation well stations with pre/post-monsoon water level time-series.",
                "default_visible": True
            },
            {
                "id": "rivers_drainage",
                "name": "Drainage Network (Mula-Mutha Basin)",
                "category": "Hydrology",
                "type": "polyline",
                "description": "Major rivers and surface stream network providing primary recharge buffers.",
                "default_visible": True
            },
            {
                "id": "geology_lithology",
                "name": "Lithology & Deccan Basalt Formations",
                "category": "Geology",
                "type": "polygon",
                "description": "Vesicular basalt, compact basalt, and valley alluvium lithological units.",
                "default_visible": False
            },
            {
                "id": "dem_elevation",
                "name": "Topography & Digital Elevation (DEM)",
                "category": "Topography",
                "type": "raster",
                "description": "SRTM/Copernicus 30m Digital Elevation Model (540m to 880m).",
                "default_visible": False
            },
            {
                "id": "lulc_landcover",
                "name": "Land Use / Land Cover (LULC)",
                "category": "Remote Sensing",
                "type": "raster",
                "description": "Urban built-up, agriculture, and deciduous forest classification.",
                "default_visible": False
            }
        ]

    def get_potential_map_data(self) -> Dict[str, Any]:
        if os.path.exists(self.map_data_path):
            with open(self.map_data_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {"error": "Prediction map not generated yet. Run python scripts/generate_prediction_map.py"}

    def get_potential_map_geojson(self) -> Dict[str, Any]:
        if os.path.exists(self.geojson_map_path):
            with open(self.geojson_map_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {"type": "FeatureCollection", "features": []}

geospatial_service = GeospatialService()
