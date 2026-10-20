"""
Explainable AI (XAI) Engine with SHAP.
Provides Global Feature Importance and Local Factor Breakdown for individual coordinate queries.
"""
import shap
import numpy as np
import pandas as pd
from typing import Dict, List, Any

FEATURE_DISPLAY_METADATA = {
    "elevation_m": ("Elevation", "Topography", "m", "Higher elevations experience greater hydraulic runoff, reducing recharge"),
    "slope_deg": ("Slope", "Topography", "degrees", "Steep slopes promote rapid runoff; gentle slopes allow water infiltration"),
    "twi": ("Topographic Wetness Index (TWI)", "Topography", "unitless", "High wetness index indicates natural flow convergence and accumulation"),
    "terrain_ruggedness_tri": ("Terrain Ruggedness (TRI)", "Topography", "m", "High terrain roughness indicates dissected bedrock and poor retention"),
    "distance_to_stream_m": ("Distance to River/Drainage", "Hydrology", "m", "Proximity to Mula/Mutha rivers provides direct recharge buffer"),
    "drainage_density_km_sqkm": ("Drainage Density", "Hydrology", "km/sq.km", "High drainage density facilitates surface runoff and recharge pathways"),
    "annual_rainfall_mm": ("Annual Rainfall", "Climate", "mm/yr", "Monsoon precipitation is the primary replenishment source"),
    "geology_permeability_score": ("Geological Permeability", "Geology", "0-1", "Porosity and hydraulic conductivity of basaltic/alluvial lithology"),
    "distance_to_lineament_m": ("Distance to Lineament/Fracture", "Geology", "m", "Proximity to structural lineaments provides secondary fracture porosity"),
    "lineament_density": ("Lineament Density", "Geology", "intensity", "High fracture density dramatically increases deep aquifer transmissivity"),
    "soil_thickness_m": ("Soil Thickness", "Soil", "m", "Thicker soil profiles retain percolation moisture before reaching bedrock"),
    "soil_permeability_cm_hr": ("Soil Permeability", "Soil", "cm/hr", "Rate at which surface water infiltrates the vadose zone"),
    "ndvi": ("Normalized Difference Veg Index (NDVI)", "Remote Sensing", "-1 to 1", "Dense vegetation indicates perennial moisture retention"),
    "ndwi": ("Normalized Difference Water Index (NDWI)", "Remote Sensing", "-1 to 1", "Surface moisture and water presence index"),
    "ndbi": ("Normalized Difference Built-up Index (NDBI)", "Remote Sensing", "-1 to 1", "Built-up land cover prevents natural surface infiltration"),
    "impervious_surface_pct": ("Impervious Surface Ratio", "Urban", "%", "Concrete, asphalt, and rooftops block aquifer recharge")
}

class GroundwaterSHAPExplainer:
    def __init__(self, model, feature_names: List[str]):
        self.model = model
        self.feature_names = feature_names
        self.explainer = shap.TreeExplainer(model)

    def explain_point(self, feature_values_dict: Dict[str, float], top_k: int = 4) -> Dict[str, List[Dict[str, Any]]]:
        X_pt = pd.DataFrame([[feature_values_dict[k] for k in self.feature_names]], columns=self.feature_names)
        shap_vals = self.explainer.shap_values(X_pt)

        if isinstance(shap_vals, list):
            pt_shap = shap_vals[2][0] if len(shap_vals) > 2 else shap_vals[-1][0]
        elif len(shap_vals.shape) == 3:
            pt_shap = shap_vals[0, :, 2] if shap_vals.shape[2] > 2 else shap_vals[0, :, -1]
        else:
            pt_shap = shap_vals[0]

        items = []
        for i, fname in enumerate(self.feature_names):
            val = feature_values_dict.get(fname, 0.0)
            disp_name, cat, unit, base_desc = FEATURE_DISPLAY_METADATA.get(
                fname, (fname.replace("_", " ").title(), "General", "", "")
            )
            s_val = float(pt_shap[i])
            contrib = "positive" if s_val > 0 else "negative"
            
            if fname == "twi" and s_val > 0:
                desc = f"High TWI ({val:.1f}) provides significant moisture accumulation."
            elif fname == "slope_deg" and s_val > 0:
                desc = f"Gentle slope ({val:.1f}°) permits high rainwater infiltration."
            elif fname == "slope_deg" and s_val < 0:
                desc = f"Steep slope ({val:.1f}°) causes rapid surface runoff."
            elif fname == "distance_to_stream_m" and s_val > 0:
                desc = f"Close proximity to river channel ({val:.0f}m) enhances aquifer recharge."
            elif fname == "distance_to_stream_m" and s_val < 0:
                desc = f"Large distance to drainage ({val:.0f}m) limits surface water replenishment."
            elif fname == "geology_permeability_score" and s_val > 0:
                desc = "Permeable alluvium/fractured basalt provides high aquifer transmissivity."
            elif fname == "geology_permeability_score" and s_val < 0:
                desc = "Dense massive basalt restricts vertical hydraulic conductivity."
            elif fname == "impervious_surface_pct" and s_val < 0:
                desc = f"High urban impervious cover ({val:.0f}%) blocks natural percolation."
            elif fname == "annual_rainfall_mm" and s_val > 0:
                desc = f"Favorable precipitation ({val:.0f} mm/yr) supports groundwater recharge."
            else:
                desc = base_desc

            items.append({
                "feature_name": fname,
                "display_name": disp_name,
                "category": cat,
                "feature_value": val,
                "unit": unit,
                "shap_value": round(s_val, 4),
                "contribution": contrib,
                "description": desc
            })

        pos_factors = sorted([x for x in items if x["shap_value"] > 0], key=lambda x: x["shap_value"], reverse=True)[:top_k]
        neg_factors = sorted([x for x in items if x["shap_value"] < 0], key=lambda x: x["shap_value"])[:top_k]

        return {
            "top_positive_factors": pos_factors,
            "top_negative_factors": neg_factors,
            "all_factors": items
        }

    def get_global_feature_importance(self, X_sample: pd.DataFrame) -> List[Dict[str, Any]]:
        shap_vals = self.explainer.shap_values(X_sample)
        if isinstance(shap_vals, list):
            vals = np.mean([np.abs(sv) for sv in shap_vals], axis=0)
            mean_abs = np.mean(vals, axis=0)
        elif len(shap_vals.shape) == 3:
            mean_abs = np.mean(np.abs(shap_vals), axis=(0, 2))
        else:
            mean_abs = np.mean(np.abs(shap_vals), axis=0)

        total = float(np.sum(mean_abs)) if np.sum(mean_abs) > 0 else 1.0
        res = []
        for i, fname in enumerate(self.feature_names):
            disp_name, cat, unit, desc = FEATURE_DISPLAY_METADATA.get(fname, (fname, "General", "", ""))
            score = round(float(mean_abs[i] / total * 100.0), 2)
            res.append({
                "feature_name": fname,
                "display_name": disp_name,
                "category": cat,
                "importance_score": score,
                "shap_mean_abs": round(float(mean_abs[i]), 4),
                "description": desc
            })
        return sorted(res, key=lambda x: x["importance_score"], reverse=True)
