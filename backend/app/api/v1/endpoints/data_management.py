"""
Data Ingestion & Quality Audit Endpoints.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.app.services.data_quality_service import data_quality_service
from backend.app.schemas.data_quality import DataQualityReport

router = APIRouter()

@router.post("/upload", response_model=DataQualityReport)
async def upload_dataset_for_audit(file: UploadFile = File(...)):
    """
    Accepts CSV or GeoJSON dataset uploads, executes spatial CRS validation,
    bounding box verification, duplicate detection, and generates a formal data quality audit report.
    """
    if not (file.filename.endswith(".csv") or file.filename.endswith(".geojson") or file.filename.endswith(".json")):
        raise HTTPException(status_code=400, detail="Supported formats: .csv, .geojson, .json")

    content = await file.read()
    if len(content) > 25 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum 25 MB limit.")

    report = data_quality_service.audit_csv(content, file.filename)
    return report
