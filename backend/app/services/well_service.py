"""
Monitoring Well Data Services.
"""
import os
import json
from typing import Dict, Any, List, Optional
from backend.app.core.config import settings

class WellService:
    def __init__(self):
        self.wells_file = os.path.join(settings.DATA_DIR, "sample", "monitoring_wells.json")
        self._wells_cache: List[Dict[str, Any]] = []
        self._load_wells()

    def _load_wells(self):
        if os.path.exists(self.wells_file):
            with open(self.wells_file, "r", encoding="utf-8") as f:
                self._wells_cache = json.load(f)
        else:
            self._wells_cache = []

    def get_all_wells(self) -> List[Dict[str, Any]]:
        if not self._wells_cache:
            self._load_wells()
        return self._wells_cache

    def get_well_by_id(self, well_id: str) -> Optional[Dict[str, Any]]:
        for w in self.get_all_wells():
            if w["well_id"].lower() == well_id.lower():
                return w
        return None

    def get_well_trend(self, well_id: str) -> Optional[Dict[str, Any]]:
        well = self.get_well_by_id(well_id)
        if not well:
            return None
        return {
            "well_id": well["well_id"],
            "well_name": well["well_name"],
            "latitude": well["latitude"],
            "longitude": well["longitude"],
            "current_water_level_mbgl": well["current_water_level_mbgl"],
            "historical_trend": well.get("historical_trend", "Stable"),
            "average_yield_lps": well.get("average_yield_lps", 3.5),
            "observations": well.get("observations", [])
        }

well_service = WellService()
