import matplotlib.pyplot as plt
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA


def run_arima(df):
    # Detect time column
    time_col = None
    for col in df.columns:
        if 'time' in col:
            time_col = col
            break

    if time_col is None:
        print("\n❌ No time/date column found → Skipping ARIMA")
        return

    print(f"\n✅ Using time column: {time_col}")

    # Convert to datetime
    df[time_col] = pd.to_datetime(df[time_col], errors='coerce')

    # Sort by time
    df = df.sort_values(time_col)

    # Set as index
    df.set_index(time_col, inplace=True)

    # Create time-series (average pollution per date)
    ts = df['pollution_level'].resample('M').mean()

    # Drop NaN
    ts = ts.dropna()

    try:
        model = ARIMA(ts, order=(1, 1, 1))
        model_fit = model.fit()

        forecast = model_fit.forecast(steps=12)

        plt.figure(figsize=(10,5))
        plt.plot(ts, label="Actual")
        plt.plot(forecast, label="Forecast", color='red')
        plt.legend()
        plt.title("📈 ARIMA Forecast (Real Data)")
        plt.show()

    except Exception as e:
        print("❌ ARIMA failed:", e)