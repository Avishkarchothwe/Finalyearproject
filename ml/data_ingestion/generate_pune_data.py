"""
Pipeline for Pune City Groundwater Potential Mapping.
Generates realistic, physically consistent environmental datasets and monitoring well observations.
Tagged explicitly as: DEMO DATA (SYNTHETIC BENCHMARK).
"""
import os
import json
import math
import random
import numpy as np
import pandas as pd
from ml.feature_engineering.extractor import GeospatialFeatureExtractor

def generate_pune_dataset(output_dir: str):
    os.makedirs(output_dir, exist_ok=True)
    extractor = GeospatialFeatureExtractor()
    random.seed(42)
    np.random.seed(42)

    # 1. Generate 180 realistic Pune monitoring wells
    pune_well_locations = [
        ("Shivajinagar Central", 18.5314, 73.8446, "River Valley Alluvium", "Basalt / Silt"),
        ("Kothrud Depot", 18.5074, 73.8077, "Fractured Basalt", "Fractured Basalt"),
        ("Deccan Gymkhana", 18.5167, 73.8417, "River Alluvium", "Basalt Alluvium"),
        ("Hadapsar Industrial", 18.5089, 73.9259, "Vesicular Basalt", "Black Cotton Soil / Basalt"),
        ("Aundh Gaon", 18.5580, 73.8070, "River Alluvium", "Alluvial Loam"),
        ("Baner Road", 18.5590, 73.7868, "Fractured Basalt", "Jointed Basalt"),
        ("Hinjewadi Phase 1", 18.5913, 73.7389, "Vesicular Basalt", "Weathered Basalt"),
        ("Katraj Lake Basin", 18.4485, 73.8580, "Fractured Basalt Foothills", "Basalt / Clay"),
        ("Sinhagad Foothills", 18.4200, 73.7600, "Massive Basalt Ridge", "Compact Basalt"),
        ("Swargate Junction", 18.5018, 73.8636, "Valley Alluvium", "Basalt Silt"),
        ("Viman Nagar", 18.5679, 73.9143, "Vesicular Basalt", "Medium Black Soil"),
        ("Kharadi Bypass", 18.5514, 73.9392, "River Plain Alluvium", "Alluvium"),
        ("Yerawada Bridge", 18.5529, 73.8796, "Mula-Mutha Confluence Alluvium", "Deep Alluvial Loam"),
        ("Bavdhan West", 18.5140, 73.7710, "Weathered Basalt", "Gravelly Loam"),
        ("Pashan Lake Margin", 18.5385, 73.7915, "Fractured Basalt / Lake Alluvium", "Lacustrine Silt"),
        ("Wagholi East", 18.5810, 73.9850, "Vesicular Basalt", "Black Soil"),
        ("Warje Malwadi", 18.4850, 73.8020, "Valley Margin Basalt", "Weathered Basalt"),
        ("Kondhwa Khurd", 18.4720, 73.8920, "Vesicular Basalt", "Medium Black Soil"),
        ("Dhanori Hills", 18.5880, 73.8820, "Weathered Basalt", "Coarse Soil"),
        ("Pimpri Chinchwad Link", 18.6270, 73.8130, "Pavana River Basin", "Alluvium / Basalt")
    ]

    wells = []
    well_counter = 1
    for base_name, b_lat, b_lon, aquifer, lith in pune_well_locations:
        for offset_idx in range(9):
            if offset_idx == 0:
                w_lat, w_lon = b_lat, b_lon
                w_name = f"{base_name} Main"
            else:
                d_lat = (random.random() - 0.5) * 0.035
                d_lon = (random.random() - 0.5) * 0.040
                w_lat = round(b_lat + d_lat, 4)
                w_lon = round(b_lon + d_lon, 4)
                w_name = f"{base_name} Stn-{offset_idx+1}"

            feat = extractor.extract_features(w_lat, w_lon)
            
            raw_gwp_score = (
                (feat["twi"] / 14.0) * 28.0 +
                (max(0.0, 1.0 - feat["distance_to_stream_m"] / 4000.0)) * 22.0 +
                (feat["geology_permeability_score"]) * 20.0 +
                (feat["annual_rainfall_mm"] / 1200.0) * 15.0 +
                (max(0.0, 1.0 - feat["slope_deg"] / 25.0)) * 12.0 +
                (max(0.0, 1.0 - feat["impervious_surface_pct"] / 100.0)) * 8.0 +
                (feat["soil_thickness_m"] / 2.8) * 5.0
            )
            gwp_score = float(np.clip(raw_gwp_score + random.gauss(0, 3.2), 5.0, 96.0))

            if gwp_score >= 68.0:
                gwp_cat = "High"
                base_pre_water_depth = random.uniform(5.5, 9.8)
                base_post_water_depth = random.uniform(1.8, 4.2)
                avg_yield_lps = round(random.uniform(4.5, 9.5), 1)
                trend = "Stable"
            elif gwp_score >= 44.0:
                gwp_cat = "Moderate"
                base_pre_water_depth = random.uniform(10.2, 16.5)
                base_post_water_depth = random.uniform(4.5, 8.5)
                avg_yield_lps = round(random.uniform(2.0, 4.4), 1)
                trend = random.choice(["Stable", "Depleting"])
            else:
                gwp_cat = "Low"
                base_pre_water_depth = random.uniform(17.0, 26.5)
                base_post_water_depth = random.uniform(9.5, 16.8)
                avg_yield_lps = round(random.uniform(0.5, 1.9), 1)
                trend = "Depleting"

            obs = []
            for yr in range(2019, 2025):
                yr_rain = round(feat["annual_rainfall_mm"] * (1.0 + (yr - 2021) * 0.04 + random.gauss(0, 0.08)), 1)
                rain_factor = (yr_rain - feat["annual_rainfall_mm"]) / 300.0
                pre_depth = round(base_pre_water_depth - rain_factor * 1.2 + (2024 - yr) * 0.15 + random.gauss(0, 0.4), 2)
                post_depth = round(base_post_water_depth - rain_factor * 1.8 + (2024 - yr) * 0.12 + random.gauss(0, 0.3), 2)
                fluct = round(pre_depth - post_depth, 2)
                obs.append({
                    "year": yr,
                    "pre_monsoon_depth_mbgl": max(1.2, pre_depth),
                    "post_monsoon_depth_mbgl": max(0.8, post_depth),
                    "seasonal_fluctuation_m": max(0.2, fluct),
                    "rainfall_mm": yr_rain
                })

            current_post = obs[-1]["post_monsoon_depth_mbgl"]
            current_fluct = obs[-1]["seasonal_fluctuation_m"]

            well_data = {
                "well_id": f"PUN-GW-{well_counter:03d}",
                "well_name": w_name,
                "latitude": w_lat,
                "longitude": w_lon,
                "elevation_m": feat["elevation_m"],
                "current_water_level_mbgl": current_post,
                "seasonal_fluctuation_m": current_fluct,
                "groundwater_potential": gwp_cat,
                "potential_score": round(gwp_score, 1),
                "aquifer_type": feat["geology_unit"],
                "lithology": lith,
                "average_yield_lps": avg_yield_lps,
                "historical_trend": trend,
                "historical_observations_count": len(obs),
                "recharge_rate_estimate": "High (0.28 m/yr)" if gwp_cat == "High" else ("Moderate (0.15 m/yr)" if gwp_cat == "Moderate" else "Low (0.05 m/yr)"),
                "data_source": "CGWB / GSDA Pune Benchmark Grid (Synthetic Demonstration Calibration)",
                "is_demo": True,
                "observations": obs
            }
            wells.append(well_data)
            well_counter += 1

    wells_file = os.path.join(output_dir, "monitoring_wells.json")
    with open(wells_file, "w", encoding="utf-8") as f:
        json.dump(wells, f, indent=2)
    print(f"Generated {len(wells)} monitoring wells -> {wells_file}")

    train_records = []
    lat_range = np.linspace(18.402, 18.648, 50)
    lon_range = np.linspace(73.705, 73.995, 50)

    for i, lat in enumerate(lat_range):
        for j, lon in enumerate(lon_range):
            j_lat = round(lat + (random.random() - 0.5) * 0.003, 5)
            j_lon = round(lon + (random.random() - 0.5) * 0.003, 5)
            feat = extractor.extract_features(j_lat, j_lon)

            raw_gwp_score = (
                (feat["twi"] / 14.0) * 28.0 +
                (max(0.0, 1.0 - feat["distance_to_stream_m"] / 4000.0)) * 22.0 +
                (feat["geology_permeability_score"]) * 20.0 +
                (feat["annual_rainfall_mm"] / 1200.0) * 15.0 +
                (max(0.0, 1.0 - feat["slope_deg"] / 25.0)) * 12.0 +
                (max(0.0, 1.0 - feat["impervious_surface_pct"] / 100.0)) * 8.0 +
                (feat["soil_thickness_m"] / 2.8) * 5.0
            )
            gwp_score = float(np.clip(raw_gwp_score + random.gauss(0, 2.5), 2.0, 98.0))

            if gwp_score >= 68.0:
                gwp_cat = "High"
                water_depth = round(2.0 + (100.0 - gwp_score) * 0.12 + random.gauss(0, 0.4), 2)
            elif gwp_score >= 44.0:
                gwp_cat = "Moderate"
                water_depth = round(5.5 + (68.0 - gwp_score) * 0.18 + random.gauss(0, 0.6), 2)
            else:
                gwp_cat = "Low"
                water_depth = round(11.0 + (44.0 - gwp_score) * 0.25 + random.gauss(0, 0.8), 2)

            rec = {
                "point_id": f"PUN_PT_{len(train_records)+1:04d}",
                "latitude": j_lat,
                "longitude": j_lon,
                **{k: feat[k] for k in extractor.get_feature_vector_keys()},
                "groundwater_depth_mbgl": max(0.5, water_depth),
                "potential_score": round(gwp_score, 1),
                "groundwater_potential": gwp_cat,
                "data_tag": "SYNTHETIC_PUNE_DEMO_BENCHMARK"
            }
            train_records.append(rec)

    df_train = pd.DataFrame(train_records)
    dataset_csv = os.path.join(output_dir, "groundwater_training_dataset.csv")
    df_train.to_csv(dataset_csv, index=False)
    print(f"Generated {len(df_train)} training records -> {dataset_csv}")
    return wells, df_train

if __name__ == "__main__":
    import sys
    base_dir = sys.argv[1] if len(sys.argv) > 1 else r"data/sample"
    generate_pune_dataset(base_dir)
