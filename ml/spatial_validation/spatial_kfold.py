"""
Spatial Block Cross-Validation Module.
Splits spatial coordinates into contiguous geographic quadrants (blocks) to prevent spatial autocorrelation leakage.
"""
import os
os.environ["LOKY_MAX_CPU_COUNT"] = "4"
import numpy as np
import pandas as pd
from typing import Generator, Tuple
from sklearn.model_selection import KFold


class SpatialBlockKFold:
    """
    Spatial Block Cross-Validation splitter.
    Divides study bounding box into distinct geographic blocks (e.g. NW, NE, Central, SW, SE).
    """

    def __init__(self, n_splits: int = 5, random_state: int = 42):
        self.n_splits = n_splits
        self.random_state = random_state

    def split(self, df: pd.DataFrame, lat_col: str = "latitude", lon_col: str = "longitude") -> Generator[Tuple[np.ndarray, np.ndarray], None, None]:
        lats = df[lat_col].values
        lons = df[lon_col].values
        
        min_lat, max_lat = np.min(lats), np.max(lats)
        min_lon, max_lon = np.min(lons), np.max(lons)
        
        mid_lat = (min_lat + max_lat) / 2.0
        mid_lon = (min_lon + max_lon) / 2.0
        
        # Assign 5 spatial blocks: 0: SW, 1: SE, 2: NW, 3: NE, 4: Central Valley
        blocks = np.zeros(len(df), dtype=int)
        center_dist = np.sqrt(((lats - mid_lat)/(max_lat - min_lat))**2 + ((lons - mid_lon)/(max_lon - min_lon))**2)
        
        for i in range(len(df)):
            if center_dist[i] < 0.25:
                blocks[i] = 4  # Central Valley Block
            elif lats[i] < mid_lat and lons[i] < mid_lon:
                blocks[i] = 0  # SW Hills Block
            elif lats[i] < mid_lat and lons[i] >= mid_lon:
                blocks[i] = 1  # SE Plains Block
            elif lats[i] >= mid_lat and lons[i] < mid_lon:
                blocks[i] = 2  # NW Watershed Block
            else:
                blocks[i] = 3  # NE Basin Block

        indices = np.arange(len(df))
        for block_id in range(self.n_splits):
            test_mask = (blocks == block_id)
            if np.sum(test_mask) == 0:
                test_mask = (indices % self.n_splits == block_id)
            train_mask = ~test_mask
            yield indices[train_mask], indices[test_mask]


def compare_spatial_vs_random_cv(model_cls, model_kwargs, X: np.ndarray, y: np.ndarray, coords_df: pd.DataFrame, n_splits: int = 5) -> dict:
    from sklearn.metrics import f1_score, accuracy_score
    
    # 1. Random K-Fold
    rkf = KFold(n_splits=n_splits, shuffle=True, random_state=42)
    random_f1s, random_accs = [], []
    for train_idx, test_idx in rkf.split(X):
        m = model_cls(**model_kwargs)
        m.fit(X[train_idx], y[train_idx])
        preds = m.predict(X[test_idx])
        random_f1s.append(f1_score(y[test_idx], preds, average="macro"))
        random_accs.append(accuracy_score(y[test_idx], preds))

    # 2. Spatial Block K-Fold
    skf = SpatialBlockKFold(n_splits=n_splits, random_state=42)
    spatial_f1s, spatial_accs = [], []
    for train_idx, test_idx in skf.split(coords_df):
        m = model_cls(**model_kwargs)
        m.fit(X[train_idx], y[train_idx])
        preds = m.predict(X[test_idx])
        spatial_f1s.append(f1_score(y[test_idx], preds, average="macro"))
        spatial_accs.append(accuracy_score(y[test_idx], preds))

    mean_random_f1 = float(np.mean(random_f1s))
    mean_spatial_f1 = float(np.mean(spatial_f1s))
    drop_pct = float(max(0.0, (mean_random_f1 - mean_spatial_f1) / max(0.001, mean_random_f1) * 100.0))

    return {
        "random_cv_f1_mean": round(mean_random_f1, 4),
        "random_cv_accuracy_mean": round(float(np.mean(random_accs)), 4),
        "spatial_cv_f1_mean": round(mean_spatial_f1, 4),
        "spatial_cv_accuracy_mean": round(float(np.mean(spatial_accs)), 4),
        "autocorrelation_drop_pct": round(drop_pct, 2),
        "leakage_explanation": "Random cross-validation overestimates performance by allowing spatially clustered nearby points in train and test sets. Spatial block validation tests true out-of-neighborhood generalization."
    }
