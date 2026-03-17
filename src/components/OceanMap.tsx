import { useMemo, useState, useCallback } from "react";
import Map, { MapLayerMouseEvent } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import { DeckGLOverlay } from "./DeckGLOverlay";
import { ScatterplotLayer, ColumnLayer } from "deck.gl";
import type { LiveStation } from "@/data/stations";
import "maplibre-gl/dist/maplibre-gl.css";
import { useToast } from "@/hooks/use-toast";

interface Props {
  stations: LiveStation[];
  pitch: number;
  showHeatmap: boolean;
}

export default function OceanMap({ stations, pitch, showHeatmap: _showHeatmap }: Props) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; station: LiveStation } | null>(null);
  const { toast } = useToast();

  const onHover = useCallback((info: { x: number; y: number; object?: LiveStation }) => {
    if (info.object) {
      setTooltip({ x: info.x, y: info.y, station: info.object });
    } else {
      setTooltip(null);
    }
  }, []);

  const handleMapClick = useCallback(async (event: MapLayerMouseEvent) => {
    const { lng, lat } = event.lngLat;
    console.log(`Map clicked at: ${lat}, ${lng}`);

    try {
      // Sending to backend (adjust URL as needed)
      // I prefer using a simple POST request to a REST API
      const response = await fetch("http://localhost:5000/api/map-click", {
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
      console.error("Error sending coordinates:", error);
      toast({
        title: "Connection Error",
        description: "Could not reach the backend API. Please ensure your backend is running at http://localhost:5000",
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
      getFillColor: (d: LiveStation) => [...d.color, 60],
      getLineColor: (d: LiveStation) => [...d.color, 200],
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
      getFillColor: (d: LiveStation) => [...d.color, 210],
      pickable: true,
      extruded: true,
      autoHighlight: true,
      onHover,
    });

    return [scatter, columns];
  }, [stations, onHover]);

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
      </Map>
      {tooltip && (
        <div
          className="pointer-events-none absolute z-20 rounded-lg border bg-card p-3 shadow-lg"
          style={{ left: tooltip.x + 10, top: tooltip.y + 10, borderLeftColor: `rgb(${tooltip.station.color.join(",")})`, borderLeftWidth: 3 }}
        >
          <p className="font-mono text-[11px] font-bold" style={{ color: `rgb(${tooltip.station.color.join(",")})` }}>
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
