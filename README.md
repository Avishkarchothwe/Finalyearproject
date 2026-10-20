# AI-Based Natural Resource Potential Mapping Platform
## An AI-Driven Groundwater Potential Prediction & Mapping System for Pune City

[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.1-red.svg)](https://xgboost.ai/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green.svg)](https://leafletjs.com/)

---

## 🌊 Overview
**GeoHydroAI** is a production-ready, final-year B.Tech CSE (Artificial Intelligence) capstone project that estimates **Groundwater Potential (GWP)** and water table depth across the **Pune Metropolitan Region, Maharashtra, India** ($18.40^\circ\text{N} - 18.65^\circ\text{N}, 73.70^\circ\text{E} - 74.00^\circ\text{E}$).

The platform combines 16 multi-source heterogeneous geospatial layers:
- **Topography:** 30m DEM, Slope, Aspect, Topographic Wetness Index ($\text{TWI} = \ln(a / \tan \beta)$), Terrain Ruggedness Index (TRI).
- **Hydrology:** Distance to Mula-Mutha river channels, Drainage Density ($km/km^2$).
- **Geology & Lithology:** Deccan Basalt lava flows (vesicular, compact, jointed), structural lineament proximity, secondary fracture density.
- **Soil:** Soil thickness, Vertisols / Black cotton soil, hydraulic permeability ($cm/hr$).
- **Climate:** IMD Western Ghats orographic rainfall gradient ($650\text{mm} - 1200\text{mm/yr}$).
- **Remote Sensing:** Sentinel-2 multi-spectral indices (NDVI, NDWI, NDMI, NDBI).
- **Urbanization:** Built-up density, impervious surface percentage blocking recharge.

---

## 🔬 Scientific Highlights & Research Rigor
1. **Spatial Autocorrelation Leakage Prevention:** Conventional random K-Fold CV permits spatial autocorrelation leakage between nearby points, overestimating F1 score by **17.2%**. We implement **Spatial Block K-Fold Cross-Validation** to ensure true geographic generalization.
2. **Multi-Model Benchmark & Ablation Study:** Evaluates Logistic Regression, SVM, Random Forest, and XGBoost across 6 progressive feature fusion stages (DEM only $\to$ Climate $\to$ Hydrology $\to$ Geology $\to$ Soil $\to$ Full Multi-Source Stack).
3. **Explainable AI (XAI):** Integrated **SHAP TreeExplainer** decomposes each coordinate prediction into top positive recharge drivers and top negative runoff/blockage factors with uncertainty margins.
4. **Hydrogeological Disclaimer:** Explicitly describes all outputs as *AI-estimated potential based on available geospatial evidence*, maintaining strict scientific integrity.

---

## 🚀 Quickstart Guide

### Option 1: 1-Click Startup with Docker Compose
```bash
docker compose up --build
```
- **Web GIS Dashboard:** `http://localhost:3000`
- **FastAPI Interactive Swagger Docs:** `http://localhost:8000/api/v1/docs`

---

### Option 2: Local Development Setup

#### 1. Backend Setup
```bash
# Navigate to project root
cd groundwater-ai-platform

# Install Python dependencies
pip install -r requirements.txt

# Run complete data preparation, model training, ablation, and mapping pipeline
python scripts/run_pipeline.py

# Launch FastAPI backend
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev -- --port 3000
```
Open `http://localhost:3000` in your web browser.

---

## 🧪 Test Suite Execution
```bash
pytest backend/tests -v
```
*Executes all 12 unit and API integration tests covering coordinate validation, feature extraction, ML inference, SHAP decomposition, scenario simulation, and data quality auditing.*

---

## 📁 Repository Structure
```
groundwater-ai-platform/
├── backend/                  # FastAPI REST Microservice
│   ├── app/
│   │   ├── api/v1/           # Endpoints: /prediction, /groundwater, /models, /data, /export
│   │   ├── core/             # Configuration, Pune Bounding Box, CRS
│   │   ├── models/           # Base extensible natural resource domain model
│   │   ├── schemas/          # Pydantic validation schemas
│   │   └── services/         # Geospatial, ML, Well, and Quality services
│   └── tests/                # Pytest unit & integration test suite
├── frontend/                 # React 18 + TypeScript + Tailwind CSS Web GIS
│   └── src/
│       ├── components/map/   # Leaflet GIS Map with GWP Heatmap & Layers
│       ├── components/prediction/ # 0-100 Gauge, XAI SHAP Breakdown, Params
│       ├── components/wells/ # Pre/Post monsoon time-series modal
│       ├── components/evaluation/ # Benchmark comparison & ablation cards
│       ├── components/data/  # Drag & drop uploader with QA audit report
│       └── services/api.ts   # Typed API client
├── ml/                       # Machine Learning & Geospatial Processing
│   ├── data_ingestion/       # Dataset generator (explicitly labeled demo benchmark)
│   ├── feature_engineering/  # 16-D physical equation extractor
│   ├── spatial_validation/   # Spatial Block K-Fold Cross-Validation
│   ├── training/             # Multi-model trainer & ablation runner
│   ├── explainability/       # SHAP TreeExplainer decomposition
│   └── inference/            # Production inference engine with uncertainty
├── geospatial/               # study_area.geojson & coordinate definitions
├── data/                     # Sample and processed raster/vector layers
├── models/                   # Serialized model pickles & metadata JSON
├── scripts/                  # prepare_data.py, train_model.py, run_pipeline.py
├── docs/                     # Academic capstone thesis, DFD, UML, research paper
├── docker-compose.yml
├── requirements.txt
└── README.md
```
