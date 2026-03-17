import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

def load_data():
    df = pd.read_excel("final_dataset_with_ph_chl.xlsx")

    # Normalize column names
    df.columns = df.columns.str.strip().str.lower()

    # Convert Date if exists
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
        df['year'] = df['date'].dt.year
        df['month'] = df['date'].dt.month

    # Fill missing values
    df.fillna(df.mean(numeric_only=True), inplace=True)

    return df


def create_labels(df):
    # Auto-detect oxygen column
    oxygen_col = None
    for col in df.columns:
        if "oxygen" in col:
            oxygen_col = col
            break

    if oxygen_col is None:
        raise Exception("❌ No oxygen column found in dataset")

    print(f"✅ Using oxygen column: {oxygen_col}")

    conditions = [
        (df[oxygen_col] > 350),
        (df[oxygen_col] > 300) & (df[oxygen_col] <= 350),
        (df[oxygen_col] <= 300)
    ]

    choices = [0, 1, 2]  # Low, Medium, High
    df['pollution_level'] = np.select(conditions, choices)

    return df


def get_features(df):
    features = []

    for col in df.columns:
        if any(key in col for key in [
            'latitude', 'longitude', 'depth',
            'oxygen', 'salinity', 'temperature',
            'ph', 'chlorophyll', 'year', 'month'
        ]):
            features.append(col)

    print(f"✅ Features used: {features}")
    return features


def scale_features(X):
    scaler = StandardScaler()
    return scaler.fit_transform(X)