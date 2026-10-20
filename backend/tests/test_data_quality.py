"""Tests for data quality audit engine."""
import pytest
from backend.app.services.data_quality_service import DataQualityService

def test_audit_valid_csv():
    dq = DataQualityService()
    sample_csv = b"well_id,latitude,longitude,water_level_mbgl\nPUN_01,18.5204,73.8567,4.2\nPUN_02,18.5500,73.8800,6.8\n"
    report = dq.audit_csv(sample_csv, "test_wells.csv")
    
    assert report["total_records"] == 2
    assert report["valid_records"] == 2
    assert report["inside_study_area_count"] == 2
    assert report["validation_status"] == "Passed"

def test_audit_outside_bounds():
    dq = DataQualityService()
    sample_csv = b"latitude,longitude\n28.6139,77.2090\n"  # Delhi coordinates
    report = dq.audit_csv(sample_csv, "delhi_points.csv")
    
    assert report["total_records"] == 1
    assert report["outside_study_area_count"] == 1
    assert report["validation_status"] == "Failed"
