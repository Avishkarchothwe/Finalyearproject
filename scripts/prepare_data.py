"""Step 1: Prepare datasets for Pune study area."""
import os
import sys

# Ensure root is on path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from ml.data_ingestion.generate_pune_data import generate_pune_dataset

if __name__ == "__main__":
    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "sample"))
    print(f"Generating Pune dataset in {out_dir}...")
    generate_pune_dataset(out_dir)
