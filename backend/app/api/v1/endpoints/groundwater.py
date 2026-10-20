"""
Groundwater Data, Wells, and Map Endpoints.
"""
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.app.services.well_service import well_service
from backend.app.services.geospatial_service import geospatial_service

router = APIRouter()

@router.get("/study-area")
def get_study_area_boundary():
    """Returns the study area GeoJSON polygon."""
    return geospatial_service.get_study_area()

@router.get("/layers")
def get_map_layers_metadata():
    """Returns metadata and styling for all active GIS layers."""
    return geospatial_service.get_available_layers()

@router.get("/wells")
def list_monitoring_wells():
    """Returns all 180 monitoring well stations across Pune with water depth summaries."""
    return well_service.get_all_wells()

@router.get("/wells/{well_id}")
def get_well_details(well_id: str):
    """Returns detailed historical observations for a specific well."""
    well = well_service.get_well_by_id(well_id)
    if not well:
        raise HTTPException(status_code=404, detail=f"Well '{well_id}' not found.")
    return well

@router.get("/wells/{well_id}/trend")
def get_well_time_series_trend(well_id: str):
    """Returns pre-monsoon vs post-monsoon time-series trend data for charting."""
    trend = well_service.get_well_trend(well_id)
    if not trend:
        raise HTTPException(status_code=404, detail=f"Well '{well_id}' not found.")
    return trend

@router.get("/potential-map")
def get_groundwater_potential_map():
    """Returns the continuous precomputed 0-100 GWP potential map across Pune."""
    return geospatial_service.get_potential_map_data()

@router.get("/potential-map/geojson")
def get_groundwater_potential_map_geojson():
    """Returns the GWP surface as a GeoJSON FeatureCollection."""
    return geospatial_service.get_potential_map_geojson()
