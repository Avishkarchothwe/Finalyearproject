"""Step 3: Run 7-group ablation study."""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from ml.training.ablation_experiments import run_ablation_study

if __name__ == "__main__":
    data_csv = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "sample", "groundwater_training_dataset.csv"))
    out_json = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "ablation_results.json"))
    print("Running multi-source feature ablation study...")
    run_ablation_study(data_csv, out_json)
