# System Architecture, DFD & UML Specifications

## 1. System Architecture Overview

```
                      ┌──────────────────────────────────────────────┐
                      │               DATA INGESTION                 │
                      │  DEM • Sentinel-2 • SoilGrids • GSI Geology  │
                      │       IMD Rainfall • CGWB Monitoring Wells   │
                      └──────────────────────┬───────────────────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │    SPATIAL PREPROCESSING    │
                              │    EPSG:32643 (UTM 43N)     │
                              └──────────────┬──────────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │  16-D FEATURE ENGINEERING   │
                              │  Topo • Hydro • Lithology   │
                              │  Soil • Climate • RS Index  │
                              └──────────────┬──────────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │   SPATIAL BLOCK CROSS-VAL   │
                              │   (Autocorrelation Defense) │
                              └──────────────┬──────────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │    XGBOOST ML ENGINE        │
                              │  • Multi-Class GWP (0-100)  │
                              │  • Depth Regressor (mbgl)   │
                              └──────────────┬──────────────┘
                                             │
                ┌────────────────────────────┼────────────────────────────┐
                ▼                            ▼                            ▼
     [ SHAP TreeExplainer ]       [ Continuous Raster Grid ]     [ Scenario Simulator ]
   (Local Drivers Decomposition)   (50x50 High-Res Surface)       (Climate/Urban Shifts)
                │                            │                            │
                └────────────────────────────┼────────────────────────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │      FASTAPI REST API       │
                              │   /prediction • /groundwater│
                              │   /models • /data • /export │
                              └──────────────┬──────────────┘
                                             │
                              ┌──────────────▼──────────────┐
                              │   REACT + TS + GIS WEB APP  │
                              │  Leaflet Map • Recharts UI  │
                              └─────────────────────────────┘
```

---

## 2. Data Flow Diagrams (DFD)

### DFD Level 0 (Context Diagram)
```
  [ User / GIS Analyst ] 
            │
            ├──── Coordinates (Lat, Lon) / Dataset Upload ────► [ Groundwater AI Platform ]
            │                                                            │
            └◄─── GWP Score, SHAP Factors, Maps & Audit Reports ─────────┘
```

### DFD Level 1
```
                      ┌─────────────────────────────────┐
 [ User Request ] ───►│ 1.0 Coordinate / File Validator │
                      └──────────────┬──────────────────┘
                                     │ Validated Coordinates
                                     ▼
                      ┌─────────────────────────────────┐
                      │ 2.0 Spatial Feature Extractor   │◄── [ Spatial Layers Store ]
                      └──────────────┬──────────────────┘
                                     │ 16-D Feature Vector
                                     ▼
                      ┌─────────────────────────────────┐
                      │ 3.0 XGBoost ML Inference Engine │◄── [ Model Artifacts ]
                      └──────────────┬──────────────────┘
                                     │ Probability & Prediction
                                     ▼
                      ┌─────────────────────────────────┐
                      │ 4.0 SHAP TreeExplainer Engine   │
                      └──────────────┬──────────────────┘
                                     │ Top Factors & Explanations
                                     ▼
                      ┌─────────────────────────────────┐
                      │ 5.0 Response Formatter & API    │───► [ UI / Dashboard ]
                      └─────────────────────────────────┘
```

---

## 3. Entity Relationship (ER) Diagram
```
  ┌───────────────────────┐             ┌─────────────────────────┐
  │      STUDY_AREA       │             │     MONITORING_WELL     │
  ├───────────────────────┤             ├─────────────────────────┤
  │ area_id (PK)          │1           *│ well_id (PK)            │
  │ name                  ├────────────►│ well_name               │
  │ min_lat, max_lat      │             │ latitude, longitude     │
  │ min_lon, max_lon      │             │ elevation_m             │
  │ projected_crs         │             │ current_water_level     │
  └───────────────────────┘             └───────────┬─────────────┘
                                                    │ 1
                                                    │
                                                    │ *
                                        ┌───────────▼─────────────┐
                                        │    WELL_OBSERVATION     │
                                        ├─────────────────────────┤
                                        │ obs_id (PK)             │
                                        │ well_id (FK)            │
                                        │ year                    │
                                        │ pre_monsoon_mbgl        │
                                        │ post_monsoon_mbgl       │
                                        │ seasonal_fluctuation_m  │
                                        │ rainfall_mm             │
                                        └─────────────────────────┘
```
