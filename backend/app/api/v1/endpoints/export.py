"""
Export & Reporting Endpoints.
"""
from fastapi import APIRouter
from fastapi.responses import PlainTextResponse
from backend.app.services.geospatial_service import geospatial_service
from backend.app.services.well_service import well_service

router = APIRouter()

@router.get("/geojson")
def export_gwp_geojson():
    """Download full Pune Groundwater Potential Map in GeoJSON format."""
    return geospatial_service.get_potential_map_geojson()

@router.get("/wells-csv", response_class=PlainTextResponse)
def export_wells_csv():
    """Download monitoring wells dataset in CSV format."""
    wells = well_service.get_all_wells()
    if not wells:
        return "well_id,well_name,latitude,longitude,water_level_mbgl,potential\n"
    
    header = "well_id,well_name,latitude,longitude,elevation_m,current_water_level_mbgl,seasonal_fluctuation_m,groundwater_potential,aquifer_type"
    lines = [header]
    for w in wells:
        lines.append(f"{w['well_id']},{w['well_name']},{w['latitude']},{w['longitude']},{w['elevation_m']},{w['current_water_level_mbgl']},{w['seasonal_fluctuation_m']},{w['groundwater_potential']},{w['aquifer_type']}")
    return "\n".join(lines)
