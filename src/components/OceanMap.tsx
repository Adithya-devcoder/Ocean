import { useMemo, useState, useCallback } from "react";
import Map, { MapLayerMouseEvent, Popup } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import { DeckGLOverlay } from "./DeckGLOverlay";
import { ScatterplotLayer, ColumnLayer } from "deck.gl";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import type { LiveStation } from "@/data/stations";
import "maplibre-gl/dist/maplibre-gl.css";
import { useToast } from "@/hooks/use-toast";

interface Props {
  stations: LiveStation[];
  pitch: number;
  showHeatmap: boolean;
  clickedLocation: { lat: number; lng: number } | null;
  onMapClick: (location: { lat: number; lng: number } | null) => void;
}

export default function OceanMap({ stations, pitch, showHeatmap: _showHeatmap, clickedLocation, onMapClick }: Props) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; station: LiveStation } | null>(null);
  const { toast } = useToast();

  const onHover = useCallback((info: { x: number; y: number; object?: LiveStation }) => {
    // console.log("Map hovered", info.object?.name); // Debugging
    if (info.object) {
      setTooltip({ x: info.x, y: info.y, station: info.object });
    } else {
      setTooltip(null);
    }
  }, []);

  const handleMapClick = useCallback(async (event: MapLayerMouseEvent) => {
    // Only trigger if it's a real click event and NOT a hover or drag
    if (event.type !== "click") return;

    const { lng, lat } = event.lngLat;
    console.log(`✅ User deliberately clicked the map at Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
    onMapClick({ lat, lng });

    try {
      // Sending to backend (adjust URL as needed)
      const response = await fetch("http://localhost:5001/api/map-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          latitude: lat, 
          longitude: lng,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        toast({
          title: "Coordinates Sent",
          description: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} successfully sent to backend.`,
        });
      } else {
        throw new Error("Failed to send coordinates");
      }
    } catch (error) {
      console.error("❌ Error sending coordinates:", error);
      // We'll use a shorter description to make it less intrusive
      toast({
        title: "Connection Error",
        description: "Backend (localhost:5000) is unreachable. Check your server.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const layers = useMemo(() => {
    const scatter = new ScatterplotLayer({
      id: "scatter",
      data: stations,
      getPosition: (d: LiveStation) => [d.lon, d.lat],
      getRadius: (d: LiveStation) => d.radius,
      getFillColor: (d: LiveStation) => [...(d.color || [255, 255, 255]), 60],
      getLineColor: (d: LiveStation) => [...(d.color || [255, 255, 255]), 200],
      stroked: true,
      filled: true,
      lineWidthMinPixels: 2,
      pickable: true,
      autoHighlight: true,
      onHover,
    });

    const columns = new ColumnLayer({
      id: "columns",
      data: stations,
      getPosition: (d: LiveStation) => [d.lon, d.lat],
      getElevation: (d: LiveStation) => d.elevation,
      radius: 35000,
      getFillColor: (d: LiveStation) => [...(d.color || [255, 255, 255]), 210],
      pickable: true,
      extruded: true,
      autoHighlight: true,
      onHover,
    });

    const heatmap = _showHeatmap ? new HeatmapLayer({
      id: "heatmap",
      data: stations,
      getPosition: (d: LiveStation) => [d.lon, d.lat],
      getWeight: (d: LiveStation) => 100 - d.score,
      radiusPixels: 60,
      intensity: 1,
      threshold: 0.05,
    }) : null;
    const clickRadiusLayer = clickedLocation ? new ScatterplotLayer({
      id: "clicked-radius",
      data: [{ ...clickedLocation }],
      getPosition: (d: { lat: number; lng: number }) => [d.lng, d.lat],
      getRadius: 1609.34, // 1 mile in meters
      getFillColor: [0, 224, 255, 80], // Cyan transparent
      getLineColor: [0, 224, 255, 200],
      stroked: true,
      filled: true,
      lineWidthMinPixels: 2,
    }) : null;

    return [_showHeatmap ? heatmap : null, scatter, !_showHeatmap ? columns : null, clickRadiusLayer].filter(Boolean);
  }, [stations, onHover, clickedLocation, _showHeatmap]);

  return (
    <div className="relative mb-4 overflow-hidden rounded-xl border border-border" style={{ height: 500 }}>
      <p className="absolute left-4 top-4 z-10 font-mono text-[10px] tracking-[2px] text-primary uppercase">
        🗺 Risk Map
      </p>
      <Map
        mapLib={maplibregl}
        initialViewState={{
          latitude: 15,
          longitude: 20,
          zoom: 1.8,
          pitch,
          bearing: -5,
        }}
        onClick={handleMapClick}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        style={{ width: "100%", height: "100%" }}
        renderWorldCopies={false}
      >
        <DeckGLOverlay layers={layers} />
        {clickedLocation && (
          <Popup
            latitude={clickedLocation.lat}
            longitude={clickedLocation.lng}
            closeButton={true}
            closeOnClick={false}
            onClose={() => onMapClick(null)}
            anchor="bottom"
            offset={10}
          >
            <div className="rounded border border-slate-700 bg-slate-900 p-2 shadow-lg w-48 z-auto opacity-100 backdrop-blur-md">
              <p className="font-mono text-xs font-bold text-cyan-400 mb-1 border-b border-slate-700 pb-1">
                📍 Region Selected
              </p>
              <div className="font-mono text-[10px] text-slate-300">
                <p>Lat: <span className="font-bold text-slate-100">{clickedLocation.lat.toFixed(4)}</span></p>
                <p>Lng: <span className="font-bold text-slate-100">{clickedLocation.lng.toFixed(4)}</span></p>
                <p className="mt-1 text-cyan-300 opacity-80 border-t border-slate-700 pt-1">⭕ 1-mile radius isolated</p>
              </div>
            </div>
          </Popup>
        )}
      </Map>
      {tooltip && (
        <div
          className="pointer-events-none absolute z-20 rounded-lg border bg-card p-3 shadow-lg"
          style={{ left: tooltip.x + 10, top: tooltip.y + 10, borderLeftColor: `rgb(${(tooltip.station.color || [255, 255, 255]).join(",")})`, borderLeftWidth: 3 }}
        >
          <p className="font-mono text-[11px] font-bold" style={{ color: `rgb(${(tooltip.station.color || [255, 255, 255]).join(",")})` }}>
            {tooltip.station.category}
          </p>
          <p className="font-mono text-xs text-foreground font-bold">{tooltip.station.name}</p>
          <p className="font-mono text-[11px] text-muted-foreground">⚠ {tooltip.station.risk}</p>
          <p className="font-mono text-[11px] text-foreground">
            🌊 Score: <span className="font-bold">{tooltip.station.score}/100</span>{" "}
            📊 Risk: <span className="font-bold">{tooltip.station.riskPct}%</span>
          </p>
        </div>
      )}
    </div>
  );
}
