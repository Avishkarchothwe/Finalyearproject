# API Reference: Groundwater AI Platform REST Endpoints

Base URL: `http://localhost:8000/api/v1`

---

## 1. Prediction Endpoints

### `POST /prediction`
Run primary AI inference for a point in decimal degrees.

**Request Body:**
```json
{
  "latitude": 18.5204,
  "longitude": 73.8567
}
```

**Response (200 OK):**
```json
{
  "location": {
    "latitude": 18.5204,
    "longitude": 73.8567
  },
  "inside_study_area": true,
  "groundwater_potential": "Moderate",
  "potential_score": 58.4,
  "confidence": 0.812,
  "uncertainty_margin": 3.8,
  "predicted_depth_mbgl": 5.4,
  "top_positive_factors": [
    {
      "feature_name": "twi",
      "display_name": "Topographic Wetness Index (TWI)",
      "shap_value": 0.421,
      "contribution": "positive",
      "description": "High TWI (9.4) provides significant moisture accumulation."
    }
  ],
  "top_negative_factors": [
    {
      "feature_name": "impervious_surface_pct",
      "display_name": "Impervious Surface Ratio",
      "shap_value": -0.385,
      "contribution": "negative",
      "description": "High urban impervious cover (68%) blocks natural percolation."
    }
  ]
}
```

### `POST /prediction/scenario`
Simulates "What-If" climate change and urban expansion scenarios.

**Request Body:**
```json
{
  "latitude": 18.5204,
  "longitude": 73.8567,
  "rainfall_change_percent": 15.0,
  "urbanization_increase_percent": 20.0,
  "vegetation_loss_percent": 10.0
}
```

---

## 2. Groundwater & GIS Endpoints

- `GET /groundwater/study-area` - Returns GeoJSON boundary polygon.
- `GET /groundwater/layers` - Metadata and styling for active map layers.
- `GET /groundwater/wells` - List of 180 monitoring stations.
- `GET /groundwater/wells/{id}/trend` - Pre/post monsoon 6-year time-series.
- `GET /groundwater/potential-map` - Precomputed continuous 0-100 GWP surface.
- `GET /groundwater/potential-map/geojson` - Exportable GWP GeoJSON grid.

---

## 3. Model Benchmark & Ingestion Endpoints

- `GET /models/metrics` - Model comparison table (LR, SVM, RF, XGBoost) with Spatial CV.
- `GET /models/features` - Global SHAP feature importance.
- `GET /models/ablation` - 6-stage feature group ablation experiment results.
- `POST /data/upload` - File upload with CRS validation, duplicate detection, and QA auditing.
