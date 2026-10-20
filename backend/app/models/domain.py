"""
Domain models and base extensible resource architecture.
Supports future natural resource extensions (Soil, Agriculture, Surface Water, Minerals).
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field


class ResourcePredictionResult(BaseModel):
    """Generic prediction result contract for any natural resource module."""
    resource_type: str = Field(..., description="Type of natural resource (e.g., 'groundwater', 'soil', 'surface_water')")
    location: Dict[str, float] = Field(..., description="Latitude and Longitude of query point")
    potential_score: float = Field(..., ge=0.0, le=100.0, description="Normalized potential score from 0 to 100")
    potential_category: str = Field(..., description="Categorical classification (e.g., 'Low', 'Moderate', 'High')")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Model prediction confidence/probability")
    uncertainty_margin: Optional[float] = Field(None, description="Uncertainty interval around potential score (e.g. +/- 4.2)")
    extracted_features: Dict[str, Any] = Field(default_factory=dict, description="Raw & engineered environmental features at point")
    top_positive_factors: List[Dict[str, Any]] = Field(default_factory=list, description="Top positive SHAP/feature drivers")
    top_negative_factors: List[Dict[str, Any]] = Field(default_factory=list, description="Top negative SHAP/feature drivers")
    model_version: str = Field(..., description="Identifier of the model used for inference")
    disclaimer: str = Field(
        default="AI-estimated natural resource potential based on available geospatial and hydrogeological evidence. Field investigation is required.",
        description="Mandatory scientific disclaimer"
    )


class BaseNaturalResourceModule(ABC):
    """
    Abstract Base Class for Natural Resource Potential Mapping.
    Enables future expansion to Soil, Agriculture, Surface Water, Minerals, etc.
    """

    def __init__(self, resource_name: str, version: str = "1.0.0"):
        self.resource_name = resource_name
        self.version = version

    @abstractmethod
    def extract_features(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """Extract multi-source geospatial feature vector for the given point."""
        pass

    @abstractmethod
    def predict(self, latitude: float, longitude: float) -> ResourcePredictionResult:
        """Run ML inference and generate potential score, class, confidence, and XAI factors."""
        pass

    @abstractmethod
    def get_supported_features(self) -> List[str]:
        """Return list of features required/used by this resource module."""
        pass
