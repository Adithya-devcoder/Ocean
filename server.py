from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
# CORS is required so the frontend can talk to this server
CORS(app)

@app.route('/api/map-click', methods=['POST'])
def handle_map_click():
    data = request.json
    lat = data.get('latitude')
    lng = data.get('longitude')
    timestamp = data.get('timestamp')

    print(f"--- NEW DATA RECEIVED ---")
    print(f"Time: {timestamp}")
    print(f"Coordinates: {lat}, {lng}")
    print(f"-------------------------")

    # This is where you would eventually call your ML model
    # result = my_ml_model.predict(lat, lng)

    return jsonify({
        "status": "success",
        "message": "Coordinates received by Python backend",
        "received": {
            "lat": lat,
            "lng": lng
        }
    }), 200

if __name__ == '__main__':
    print("🚀 Python Backend running on http://localhost:5000")
    print("Click on the map to see the data appear here!")
    app.run(host='0.0.0.0', port=5000, debug=True)
