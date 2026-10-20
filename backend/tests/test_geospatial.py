"""Tests for geospatial feature extraction and coordinate validation."""
import pytest
from ml.feature_engineering.extractor import GeospatialFeatureExtractor

def test_feature_extraction_pune_center():
    extractor = GeospatialFeatureExtractor()
    feat = extractor.extract_features(18.5204, 73.8567)  # Shivajinagar / Swargate
    
    assert "elevation_m" in feat
    assert 500 <= feat["elevation_m"] <= 900
    assert "slope_deg" in feat
    assert 0 <= feat["slope_deg"] <= 60
    assert "twi" in feat
    assert feat["twi"] > 0
    assert "annual_rainfall_mm" in feat
    assert 500 <= feat["annual_rainfall_mm"] <= 1400
    assert "distance_to_stream_m" in feat
    assert feat["distance_to_stream_m"] >= 0
    assert "impervious_surface_pct" in feat
    assert 0 <= feat["impervious_surface_pct"] <= 100

def test_feature_keys_count():
    extractor = GeospatialFeatureExtractor()
    keys = extractor.get_feature_vector_keys()
    assert len(keys) == 16
