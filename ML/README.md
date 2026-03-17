# Ocean Risk Intelligence Platform – ML Module

## Files

| File | Purpose |
|---|---|
| `ocean_ml_pipeline.py` | **Main pipeline** – all 5 models + visualisation |
| `generate_sample_data.py` | Generates `ocean_data.xlsx` for testing |
| `requirements.txt` | Python dependencies |

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. (Optional) Generate a synthetic dataset to test the pipeline
python generate_sample_data.py      # creates ocean_data.xlsx

# 3. Run the full ML pipeline
python ocean_ml_pipeline.py
```

If you already have **your own** `ocean_data.xlsx`, place it in the `ML/` folder and skip step 2.

## Models implemented

| # | Model | Notes |
|---|---|---|
| 1 | **K-Nearest Neighbors** | Auto-tunes K (1–15) |
| 2 | **Random Forest** | Shows feature importance |
| 3 | **Gradient Boosting** | Optimised hyperparameters |
| 4 | **Logistic Regression** | Scaled features |
| 5 | **ARIMA** | Monthly oxygen trend + 12-month forecast |

## Outputs

- Console: accuracy, classification report, predictions sample, comparison table, best-model explanation  
- File: `ocean_ml_report.png` – combined figure with confusion matrices, K-curve, feature importance, ARIMA forecast

## Target variable (`pollution_level`)

Derived from domain thresholds:

| Condition | Label |
|---|---|
| Oxygen < 4 mg/L **or** Temperature > 30 °C | **High** |
| Oxygen 4–6 mg/L **or** Temperature 25–30 °C | **Medium** |
| Otherwise | **Low** |

## Dataset column expectations

```
Date, Latitude, Longitude, Depth,
Oxygen_Value, Salinity_Value, Temperature_Value,
pH (optional), Chlorophyll (optional)
```
