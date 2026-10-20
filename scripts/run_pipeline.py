"""Master script: End-to-end data preparation, model training, ablation, and map generation."""
import os
import sys
import time

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from ml.data_ingestion.generate_pune_data import generate_pune_dataset
from ml.training.train_all_models import train_models_pipeline
from ml.training.ablation_experiments import run_ablation_study
from scripts.generate_prediction_map import generate_prediction_map

def main():
    print("===============================================================")
    print("PUNE GROUNDWATER AI PLATFORM: MASTER PIPELINE INITIALIZATION")
    print("===============================================================")
    t0 = time.time()

    sample_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "sample"))
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
    data_csv = os.path.join(sample_dir, "groundwater_training_dataset.csv")
    ablation_json = os.path.join(models_dir, "ablation_results.json")

    print("\n[Phase 1/4] Preparing Environmental Datasets & Monitoring Wells...")
    generate_pune_dataset(sample_dir)

    print("\n[Phase 2/4] Training Multi-Model Benchmark with Spatial Block Cross-Validation...")
    train_models_pipeline(data_csv, models_dir)

    print("\n[Phase 3/4] Running 6-Stage Feature Ablation Study...")
    run_ablation_study(data_csv, ablation_json)

    print("\n[Phase 4/4] Generating High-Resolution Pune Continuous GWP Surface Map...")
    generate_prediction_map()

    total_time = round(time.time() - t0, 2)
    print("\n===============================================================")
    print(f"ALL PIPELINE PHASES COMPLETED SUCCESSFULLY IN {total_time}s")
    print("===============================================================")

if __name__ == "__main__":
    main()
