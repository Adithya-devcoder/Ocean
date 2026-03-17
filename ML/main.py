from preprocessing import load_data, create_labels, get_features
from models import knn_model, random_forest_model, gradient_boosting_model, logistic_model
from arima_model import run_arima


def main():
    print("🚀 Loading Data...")
    df = load_data()

    print("📊 Creating Labels...")
    df = create_labels(df)

    print("🔍 Selecting Features...")
    features = get_features(df)

    X = df[features]
    y = df['pollution_level']

    print("\n🚀 Running Models...\n")

    knn_model(X, y)
    random_forest_model(X, y)
    gradient_boosting_model(X, y)
    logistic_model(X, y)

    print("\n📈 Running ARIMA...")
    run_arima(df)


if __name__ == "__main__":
    main()