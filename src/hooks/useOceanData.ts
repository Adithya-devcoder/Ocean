import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { generateLiveData, LiveStation, RiskCategory, categorizeStation } from "@/data/stations";

export interface MLData {
  temperature: number | null;
  currents: number | null;
  pH: number | null;
  oxygen: number | null;
  salinity: number | null;
  heavy_metals: number | null;
}

export interface OceanFilters {
  liveMode: boolean;
  showHeatmap: boolean;
  showCritical: boolean;
  showModerate: boolean;
  showHealthy: boolean;
  minScore: number;
  maxScore: number;
  refreshSec: number;
  pitch: number;
}

const DEFAULT_FILTERS: OceanFilters = {
  liveMode: true,
  showHeatmap: false,
  showCritical: true,
  showModerate: true,
  showHealthy: true,
  minScore: 0,
  maxScore: 100,
  refreshSec: 20,
  pitch: 45,
};

export function useOceanData() {
  const [filters, setFilters] = useState<OceanFilters>(DEFAULT_FILTERS);
  
  const { data, refetch } = useQuery({
    queryKey: ['oceanData'],
    queryFn: async () => {
      const res = await fetch("http://localhost:5001/api/ocean-data");
      if (!res.ok) throw new Error("Network response was not ok");
      const json = await res.json();
      const rawStations = json.frontend.stations as LiveStation[];
      // Enrich backend data with frontend categorization
      const stations = rawStations.map(s => {
        const { category, color } = categorizeStation(s.score);
        return { ...s, category, color };
      });
      return { stations, mlData: json.ml_data as MLData };
    },
    refetchInterval: filters.liveMode ? filters.refreshSec * 1000 : false,
    initialData: { stations: generateLiveData(4), mlData: { temperature: 21, currents: 0.5, pH: 8.1, oxygen: 6.5, salinity: 35, heavy_metals: 0.02 } }
  });

  const allStations = data?.stations || [];
  const mlData = data?.mlData;

  const cats: RiskCategory[] = [];
  if (filters.showCritical) cats.push("CRITICAL");
  if (filters.showModerate) cats.push("MODERATE");
  if (filters.showHealthy) cats.push("HEALTHY");

  const filtered = allStations.filter(
    (s) =>
      cats.includes(s.category) &&
      s.score >= filters.minScore &&
      s.score <= filters.maxScore
  );

  const metrics = {
    total: filtered.length,
    critical: filtered.filter((s) => s.category === "CRITICAL").length,
    moderate: filtered.filter((s) => s.category === "MODERATE").length,
    healthy: filtered.filter((s) => s.category === "HEALTHY").length,
    avgScore: filtered.length
      ? Math.round((filtered.reduce((a, s) => a + s.score, 0) / filtered.length) * 10) / 10
      : 0,
  };

  return { filters, setFilters, stations: filtered, allStations, mlData, metrics, refresh: refetch };
}
