"""Step 2: Train all models and produce spatial validation metrics."""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from ml.training.train_all_models import train_models_pipeline

if __name__ == "__main__":
    data_csv = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "sample", "groundwater_training_dataset.csv"))
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
    print("Training ML models with Spatial K-Fold...")
    train_models_pipeline(data_csv, models_dir)
