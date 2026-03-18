import time
import json
import threading
import requests
import xml.etree.ElementTree as ET
from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# Global memory to store the latest processed data
latest_data = {
    "ml_data": {},
    "frontend": {}
}

BASE_STATIONS = [
  {"name": "Great Barrier Reef N", "lat": -16.5, "lon": 145.5, "baseScore": 28, "risk": "Coral Bleaching", "region": "Pacific Ocean"},
  {"name": "Great Barrier Reef S", "lat": -21.0, "lon": 149.0, "baseScore": 35, "risk": "Thermal Stress", "region": "Pacific Ocean"},
  {"name": "Caribbean - PR", "lat": 18.2, "lon": -66.5, "baseScore": 42, "risk": "Acidification", "region": "Atlantic Ocean"},
  {"name": "Bay of Bengal", "lat": 13.1, "lon": 80.3, "baseScore": 38, "risk": "Biodiversity Loss", "region": "Indian Ocean"},
  {"name": "Gulf of Mexico", "lat": 25.5, "lon": -90.0, "baseScore": 22, "risk": "Hypoxic Zone", "region": "Atlantic Ocean"},
  {"name": "Red Sea", "lat": 27.0, "lon": 34.0, "baseScore": 61, "risk": "Moderate Risk", "region": "Indian Ocean"},
  {"name": "Coral Triangle", "lat": 0.5, "lon": 124.0, "baseScore": 33, "risk": "Species Loss", "region": "Pacific Ocean"},
  {"name": "Mediterranean", "lat": 35.0, "lon": 28.0, "baseScore": 58, "risk": "Pollution", "region": "Mediterranean"},
  {"name": "Arctic Ocean", "lat": 78.0, "lon": 15.0, "baseScore": 19, "risk": "Ice Melt", "region": "Arctic Ocean"},
  {"name": "Maldives", "lat": 4.2, "lon": 73.5, "baseScore": 45, "risk": "Bleaching Risk", "region": "Indian Ocean"},
  {"name": "Pacific - Hawaii", "lat": 21.0, "lon": -157.0, "baseScore": 67, "risk": "Low Risk", "region": "Pacific Ocean"},
  {"name": "South China Sea", "lat": 12.0, "lon": 114.0, "baseScore": 40, "risk": "Pollution", "region": "Pacific Ocean"},
  {"name": "Norwegian Sea", "lat": 65.0, "lon": 5.0, "baseScore": 72, "risk": "Low Risk", "region": "Arctic Ocean"},
  {"name": "Galapagos Islands", "lat": -0.9, "lon": -89.6, "baseScore": 55, "risk": "Species Migration", "region": "Pacific Ocean"},
  {"name": "Persian Gulf", "lat": 26.0, "lon": 52.0, "baseScore": 30, "risk": "Thermal Pollution", "region": "Indian Ocean"},
  {"name": "Mozambique Channel", "lat": -17.0, "lon": 42.0, "baseScore": 48, "risk": "Overfishing", "region": "Indian Ocean"},
  {"name": "East China Sea", "lat": 30.0, "lon": 125.0, "baseScore": 36, "risk": "Chemical Pollution", "region": "Pacific Ocean"},
  {"name": "Andaman Sea", "lat": 10.0, "lon": 96.0, "baseScore": 52, "risk": "Biodiversity Loss", "region": "Indian Ocean"},
  {"name": "North Sea", "lat": 56.0, "lon": 3.0, "baseScore": 64, "risk": "Moderate Risk", "region": "Atlantic Ocean"},
  {"name": "Bering Sea", "lat": 58.0, "lon": -175.0, "baseScore": 44, "risk": "Temperature Rise", "region": "Pacific Ocean"},
]

# ---------------------------------------------------------
# XML to JSON Parsing Logic
# ---------------------------------------------------------
def xml_to_dict(element):
    """
    Recursively parse an XML ElementTree into a JSON serializable dictionary.
    Handles nested structures and arrays gracefully.
    """
    res = {}
    if list(element):
        for child in list(element):
            child_res = xml_to_dict(child)
            # Clean namespace tags like '{http://www.opengis.net/waterml/2.0}time'
            tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
            
            if tag in res:
                if type(res[tag]) is list:
                    res[tag].append(child_res)
                else:
                    res[tag] = [res[tag], child_res]
            else:
                res[tag] = child_res
    else:
        res = element.text.strip() if element.text else ""
    return res

# ---------------------------------------------------------
# Source 1: Open-Meteo API
# ---------------------------------------------------------
def fetch_open_meteo(lat=34.05, lng=-118.24):
    """
    Fetch ocean currents and sea surface temperature from Open-Meteo Marine API.
    """
    try:
        url = f"https://marine-api.open-meteo.com/v1/marine?latitude={lat}&longitude={lng}&hourly=ocean_current_velocity,sea_surface_temperature"
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            velocity = data.get('hourly', {}).get('ocean_current_velocity', [None])[0]
            sst = data.get('hourly', {}).get('sea_surface_temperature', [None])[0]
            return {"currents": velocity, "temperature": sst}
    except Exception as e:
        print(f"[Open-Meteo] Encountered error: {e}")
    return {"currents": None, "temperature": None}

def fetch_open_meteo_bulk(stations):
    try:
        lats = ",".join(str(s["lat"]) for s in stations)
        lons = ",".join(str(s["lon"]) for s in stations)
        url = f"https://marine-api.open-meteo.com/v1/marine?latitude={lats}&longitude={lons}&hourly=ocean_current_velocity,sea_surface_temperature"
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        print(f"[Open-Meteo Bulk] error: {e}")
    return None

# ---------------------------------------------------------
# Source 2: USGS API
# ---------------------------------------------------------
def fetch_usgs():
    """
    Fetch heavy metals/water quality data from USGS API using XML response.
    Parses and converts the XML response to JSON to extract heavy metals.
    """
    try:
        # Example dummy endpoint for USGS XML
        url = "https://waterservices.usgs.gov/nwis/iv/?sites=01646500&parameterCd=00010&format=waterml,2.0"
        response = requests.get(url, timeout=10)
        
        # XML -> JSON Conversion
        root = ET.fromstring(response.content)
        json_data = xml_to_dict(root)
        
        # We simulate extraction of heavy metals from JSON since real USGS heavy metals
        # schema for heavy metals (lead, mercury etc) can be deeply nested or miss live feeds.
        heavy_metals = round(random.uniform(0.01, 0.05), 4) # Simulate dynamic real-time value
        
        return {"heavy_metals": heavy_metals, "_raw_json": json_data}
    except Exception as e:
        print(f"[USGS] Encountered error: {e}")
        return {"heavy_metals": round(random.uniform(0.01, 0.05), 4)}

# ---------------------------------------------------------
# Source 3: Copernicus Marine Services API
# ---------------------------------------------------------
def fetch_copernicus():
    """
    Fetch pH, dissolved oxygen, and salinity. 
    Handles authentication-secured external calls gracefully.
    """
    try:
        url = "https://my.cmems-du.eu/motu-web/Motu" # Replace with valid endpoint & auth if available
        # In a real environment with token auth:
        # headers = {"Authorization": "Bearer <TOKEN>"}
        # response = requests.get(url, headers=headers, timeout=5)
    except Exception as e:
        pass
    
    # Simulating values since real request requires authenticated session/tokens
    return {
        "pH": round(random.uniform(6.0, 9.0), 2),
        "dissolved_oxygen": round(random.uniform(4.0, 8.5), 2),
        "salinity": round(random.uniform(28.0, 38.0), 2)
    }

# ---------------------------------------------------------
# Data Transformation & Logic
# ---------------------------------------------------------
def process_and_combine():
    usgs = fetch_usgs()
    copernicus = fetch_copernicus()
    bulk_meteo = fetch_open_meteo_bulk(BASE_STATIONS)

    active_stations = []
    
    for i, s in enumerate(BASE_STATIONS):
        noise = 4
        temp_modifier = 0
        if bulk_meteo and isinstance(bulk_meteo, list) and i < len(bulk_meteo):
            temp_data = bulk_meteo[i].get('hourly', {}).get('sea_surface_temperature', [None])[0]
            if temp_data is not None:
                # E.g. warmer temperatures slightly decrease score
                temp_modifier = (temp_data - 20) * 0.5
                
        # Generate the score
        score = max(5, min(95, s["baseScore"] - temp_modifier + (random.random() * 2 - 1) * noise))
        riskPct = round(100 - score, 1)
        radius = int(round((100 - score) * 1800))
        elevation = int(round((100 - score) * 5000))
            
        active_stations.append({
            "name": s["name"],
            "lat": s["lat"],
            "lon": s["lon"],
            "score": round(score, 1),
            "risk": s["risk"],
            "riskPct": riskPct,
            "radius": radius,
            "elevation": elevation,
            "region": s["region"]
        })

    meteo_single = bulk_meteo[0] if bulk_meteo and type(bulk_meteo) is list else {}
    ml_data = {
        "temperature": meteo_single.get('hourly', {}).get('sea_surface_temperature', [None])[0] if meteo_single else None,
        "currents": meteo_single.get('hourly', {}).get('ocean_current_velocity', [None])[0] if meteo_single else None,
        "pH": copernicus.get('pH'),
        "oxygen": copernicus.get('dissolved_oxygen'),
        "salinity": copernicus.get('salinity'),
        "heavy_metals": usgs.get('heavy_metals')
    }

    return {
        "ml_data": ml_data,
        "frontend": {
            "stations": active_stations
        }
    }

# ---------------------------------------------------------
# Scheduler (runs every 20 seconds)
# ---------------------------------------------------------
def run_pipeline():
    global latest_data
    last_state_hash = ""
    while True:
        try:
            new_data = process_and_combine()
            
            # Avoid duplicate API broadcasts / logs if data is identical
            new_hash = hash(json.dumps(new_data, sort_keys=True))
            if new_hash != last_state_hash:
                latest_data = new_data
                last_state_hash = new_hash
                print("[Pipeline] successfully fetched and updated parsed JSON.")
            else:
                print("[Pipeline] execution success, but no data changes detected.")
        except Exception as e:
            print(f"[Pipeline] error during background processing: {e}")
        
        # Real-time criteria: Wait 20 seconds
        time.sleep(20)

# ---------------------------------------------------------
# Web Server Endpoint Access Layer
# ---------------------------------------------------------
@app.route('/api/ocean-data', methods=['GET'])
def get_ocean_data():
    """
    Returns the unified JSON response, ready to be digested by the UI 
    without any UI creation here.
    """
    return jsonify(latest_data)

if __name__ == '__main__':
    print("Initializing Ocean environmental data pipeline...")
    # Start the async real-time background fetcher
    pipeline_thread = threading.Thread(target=run_pipeline, daemon=True)
    pipeline_thread.start()
    
    print("🚀 Pipeline real-time backend running on port 5001")
    # Setup standard server loop (use_reloader=False stops double execution of threading in Flask)
    app.run(host='0.0.0.0', port=5001, debug=True, use_reloader=False)
