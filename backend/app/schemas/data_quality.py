"""
Pydantic schemas for data upload validation and quality auditing.
"""
from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field


class DataQualityIssue(BaseModel):
    severity: str  # 'Error', 'Warning', 'Info'
    field: Optional[str] = None
    message: str
    affected_rows_count: int


class DataQualityReport(BaseModel):
    dataset_name: str
    file_type: str
    total_records: int
    valid_records: int
    duplicate_records: int
    missing_values_by_column: Dict[str, int]
    missing_percentage: float
    detected_crs: str
    spatial_extent: Dict[str, float]
    inside_study_area_count: int
    outside_study_area_count: int
    outliers_detected: int
    issues: List[DataQualityIssue]
    validation_status: str  # 'Passed', 'Passed with Warnings', 'Failed'
    summary: str
