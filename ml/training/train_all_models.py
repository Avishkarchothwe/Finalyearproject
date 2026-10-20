"""
Model Training & Evaluation Pipeline for Groundwater Potential Prediction.
"""
import os
os.environ["LOKY_MAX_CPU_COUNT"] = "4"
import json
import time
import pickle
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
import xgboost as xgb

from ml.spatial_validation.spatial_kfold import SpatialBlockKFold, compare_spatial_vs_random_cv
from ml.explainability.shap_explainer import GroundwaterSHAPExplainer


def train_models_pipeline(data_path: str, models_output_dir: str):
    os.makedirs(models_output_dir, exist_ok=True)
    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} records from {data_path}")

    feature_cols = [
        "elevation_m", "slope_deg", "twi", "terrain_ruggedness_tri",
        "distance_to_stream_m", "drainage_density_km_sqkm",
        "annual_rainfall_mm", "geology_permeability_score",
        "distance_to_lineament_m", "lineament_density",
        "soil_thickness_m", "soil_permeability_cm_hr",
        "ndvi", "ndwi", "ndbi", "impervious_surface_pct"
    ]

    target_col = "groundwater_potential"
    depth_col = "groundwater_depth_mbgl"

    class_map = {"Low": 0, "Moderate": 1, "High": 2}
    classes = ["Low", "Moderate", "High"]

    X_raw = df[feature_cols].values
    y = df[target_col].map(class_map).values
    y_depth = df[depth_col].values
    coords_df = df[["latitude", "longitude"]]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_raw)

    skf = SpatialBlockKFold(n_splits=5, random_state=42)
    train_idx, test_idx = next(skf.split(coords_df))

    X_train, X_test = X_raw[train_idx], X_raw[test_idx]
    X_train_scaled, X_test_scaled = X_scaled[train_idx], X_scaled[test_idx]
    y_train, y_test = y[train_idx], y[test_idx]
    y_depth_train, y_depth_test = y_depth[train_idx], y_depth[test_idx]

    model_candidates = [
        {
            "name": "Logistic Regression",
            "type": "Linear Baseline",
            "model": LogisticRegression(max_iter=500, random_state=42),
            "use_scaled": True,
            "cls_fn": LogisticRegression,
            "kwargs": {"max_iter": 500, "random_state": 42}
        },
        {
            "name": "Support Vector Machine (RBF)",
            "type": "Kernel Baseline",
            "model": SVC(kernel="rbf", probability=True, random_state=42),
            "use_scaled": True,
            "cls_fn": SVC,
            "kwargs": {"kernel": "rbf", "probability": True, "random_state": 42}
        },
        {
            "name": "Random Forest",
            "type": "Tree Ensemble Baseline",
            "model": RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, n_jobs=1),
            "use_scaled": False,
            "cls_fn": RandomForestClassifier,
            "kwargs": {"n_estimators": 100, "max_depth": 10, "random_state": 42, "n_jobs": 1}
        },
        {
            "name": "XGBoost Classifier",
            "type": "Gradient Boosted Tree (Production)",
            "model": xgb.XGBClassifier(
                n_estimators=150,
                max_depth=5,
                learning_rate=0.08,
                subsample=0.85,
                colsample_bytree=0.85,
                random_state=42,
                eval_metric="mlogloss",
                n_jobs=1
            ),
            "use_scaled": False,
            "cls_fn": xgb.XGBClassifier,
            "kwargs": {
                "n_estimators": 150,
                "max_depth": 5,
                "learning_rate": 0.08,
                "subsample": 0.85,
                "colsample_bytree": 0.85,
                "random_state": 42,
                "eval_metric": "mlogloss",
                "n_jobs": 1
            }
        }
    ]

    benchmark_metrics = []
    best_xgb_model = None

    for cand in model_candidates:
        t0 = time.time()
        X_tr = X_train_scaled if cand["use_scaled"] else X_train
        X_te = X_test_scaled if cand["use_scaled"] else X_test

        cand["model"].fit(X_tr, y_train)
        train_time = round(time.time() - t0, 3)

        preds = cand["model"].predict(X_te)
        proba = cand["model"].predict_proba(X_te) if hasattr(cand["model"], "predict_proba") else None

        acc = float(accuracy_score(y_test, preds))
        prec = float(precision_score(y_test, preds, average="macro", zero_division=0))
        rec = float(recall_score(y_test, preds, average="macro", zero_division=0))
        f1 = float(f1_score(y_test, preds, average="macro"))

        roc_auc = None
        if proba is not None:
            try:
                roc_auc = float(roc_auc_score(y_test, proba, multi_class="ovr"))
            except Exception:
                roc_auc = None

        cm = confusion_matrix(y_test, preds).tolist()

        cv_eval = compare_spatial_vs_random_cv(
            cand["cls_fn"],
            cand["kwargs"],
            X_scaled if cand["use_scaled"] else X_raw,
            y,
            coords_df,
            n_splits=5
        )

        metrics_obj = {
            "model_name": cand["name"],
            "model_type": cand["type"],
            "accuracy": round(acc, 4),
            "precision_macro": round(prec, 4),
            "recall_macro": round(rec, 4),
            "f1_macro": round(f1, 4),
            "roc_auc_ovr": round(roc_auc, 4) if roc_auc else None,
            "spatial_cv_f1": cv_eval["spatial_cv_f1_mean"],
            "random_cv_f1": cv_eval["random_cv_f1_mean"],
            "spatial_autocorrelation_drop_pct": cv_eval["autocorrelation_drop_pct"],
            "training_time_seconds": train_time,
            "confusion_matrix": cm,
            "classes": classes
        }
        benchmark_metrics.append(metrics_obj)
        print(f"[{cand['name']}] Acc: {acc:.4f} | F1: {f1:.4f} | Spatial CV F1: {cv_eval['spatial_cv_f1_mean']:.4f}")

        if cand["name"] == "XGBoost Classifier":
            best_xgb_model = cand["model"]

    # Train XGBoost Depth Regressor
    depth_regressor = xgb.XGBRegressor(
        n_estimators=150,
        max_depth=5,
        learning_rate=0.08,
        random_state=42,
        n_jobs=1
    )
    depth_regressor.fit(X_train, y_depth_train)

    shap_explainer = GroundwaterSHAPExplainer(best_xgb_model, feature_cols)
    feat_importance = shap_explainer.get_global_feature_importance(df[feature_cols].sample(min(300, len(df)), random_state=42))

    with open(os.path.join(models_output_dir, "best_model.pkl"), "wb") as f:
        pickle.dump(best_xgb_model, f)

    with open(os.path.join(models_output_dir, "regression_model.pkl"), "wb") as f:
        pickle.dump(depth_regressor, f)

    with open(os.path.join(models_output_dir, "scaler.pkl"), "wb") as f:
        pickle.dump(scaler, f)

    metadata = {
        "model_type": "XGBoost Classifier (Multi-Class: Low, Moderate, High)",
        "regression_model_type": "XGBoost Regressor (Depth to water table in mbgl)",
        "training_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "features": feature_cols,
        "classes": classes,
        "best_accuracy": benchmark_metrics[-1]["accuracy"],
        "best_f1": benchmark_metrics[-1]["f1_macro"],
        "best_spatial_cv_f1": benchmark_metrics[-1]["spatial_cv_f1"],
        "benchmark_summary": benchmark_metrics,
        "feature_importance": feat_importance,
        "spatial_leakage_note": "Spatial Block K-Fold isolates spatial clusters to avoid over-optimistic performance from spatial autocorrelation."
    }

    with open(os.path.join(models_output_dir, "model_metadata.json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"All models trained and saved to {models_output_dir}")
    return metadata
