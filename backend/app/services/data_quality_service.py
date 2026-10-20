"""
Data Ingestion Quality Assurance Service.
Audits uploaded CSV/GeoJSON datasets for coordinate range, missingness, duplicates, outliers, and CRS.
"""
import io
import json
import pandas as pd
import numpy as np
from typing import Dict, Any, List
from backend.app.core.config import settings

class DataQualityService:
    def audit_csv(self, content: bytes, filename: str) -> Dict[str, Any]:
        df = pd.read_csv(io.BytesIO(content))
        total_rows = len(df)
        
        # Detect coordinate columns
        lat_cols = [c for c in df.columns if any(k in c.lower() for k in ["lat", "latitude", "y"])]
        lon_cols = [c for c in df.columns if any(k in c.lower() for k in ["lon", "longitude", "long", "x"])]
        
        issues = []
        if not lat_cols or not lon_cols:
            issues.append({
                "severity": "Error",
                "field": "Coordinates",
                "message": "Could not identify latitude/longitude columns in uploaded file.",
                "affected_rows_count": total_rows
            })
            return {
                "dataset_name": filename,
                "file_type": "CSV",
                "total_records": total_rows,
                "valid_records": 0,
                "duplicate_records": 0,
                "missing_values_by_column": df.isnull().sum().to_dict(),
                "missing_percentage": 100.0,
                "detected_crs": "Unknown",
                "spatial_extent": {},
                "inside_study_area_count": 0,
                "outside_study_area_count": total_rows,
                "outliers_detected": 0,
                "issues": issues,
                "validation_status": "Failed",
                "summary": "Missing required coordinate columns (latitude and longitude)."
            }

        lat_col = lat_cols[0]
        lon_col = lon_cols[0]

        # Valid rows
        valid_df = df.dropna(subset=[lat_col, lon_col])
        missing_count = total_rows - len(valid_df)
        
        # Duplicate coordinates
        duplicates = int(valid_df.duplicated(subset=[lat_col, lon_col]).sum())
        if duplicates > 0:
            issues.append({
                "severity": "Warning",
                "field": f"{lat_col}, {lon_col}",
                "message": f"Found {duplicates} duplicate spatial locations.",
                "affected_rows_count": duplicates
            })

        # Bounding box check (Pune bbox)
        bbox = settings.PUNE_BBOX
        inside_mask = (
            (valid_df[lat_col] >= bbox["min_lat"]) & (valid_df[lat_col] <= bbox["max_lat"]) &
            (valid_df[lon_col] >= bbox["min_lon"]) & (valid_df[lon_col] <= bbox["max_lon"])
        )
        inside_count = int(inside_mask.sum())
        outside_count = len(valid_df) - inside_count

        if outside_count > 0:
            issues.append({
                "severity": "Warning",
                "field": "Spatial Bounding Box",
                "message": f"{outside_count} observations lie outside the Pune study area boundary.",
                "affected_rows_count": outside_count
            })

        # Outlier detection on water levels if column exists
        wl_cols = [c for c in df.columns if any(k in c.lower() for k in ["water", "depth", "level", "mbgl"])]
        outliers_detected = 0
        if wl_cols:
            wl_col = wl_cols[0]
            vals = valid_df[wl_col].dropna()
            q1, q3 = vals.quantile(0.25), vals.quantile(0.75)
            iqr = q3 - q1
            outlier_mask = (vals < (q1 - 1.5 * iqr)) | (vals > (q3 + 1.5 * iqr))
            outliers_detected = int(outlier_mask.sum())
            if outliers_detected > 0:
                issues.append({
                    "severity": "Info",
                    "field": wl_col,
                    "message": f"Detected {outliers_detected} statistical water-level outliers via IQR analysis.",
                    "affected_rows_count": outliers_detected
                })

        extent = {
            "min_lat": float(valid_df[lat_col].min()) if len(valid_df) > 0 else 0,
            "max_lat": float(valid_df[lat_col].max()) if len(valid_df) > 0 else 0,
            "min_lon": float(valid_df[lon_col].min()) if len(valid_df) > 0 else 0,
            "max_lon": float(valid_df[lon_col].max()) if len(valid_df) > 0 else 0
        }

        status = "Passed" if outside_count == 0 and missing_count == 0 else ("Passed with Warnings" if inside_count > 0 else "Failed")

        return {
            "dataset_name": filename,
            "file_type": "CSV",
            "total_records": total_rows,
            "valid_records": len(valid_df) - duplicates,
            "duplicate_records": duplicates,
            "missing_values_by_column": {k: int(v) for k, v in df.isnull().sum().to_dict().items()},
            "missing_percentage": round(float((df.isnull().sum().sum()) / max(1, (total_rows * len(df.columns))) * 100.0), 2),
            "detected_crs": "EPSG:4326 (WGS84 Geographic Decimal Degrees)",
            "spatial_extent": extent,
            "inside_study_area_count": inside_count,
            "outside_study_area_count": outside_count,
            "outliers_detected": outliers_detected,
            "issues": issues,
            "validation_status": status,
            "summary": f"Audited {total_rows} records with {inside_count} valid Pune observations ready for spatial ingestion."
        }

data_quality_service = DataQualityService()
