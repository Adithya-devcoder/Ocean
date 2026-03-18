import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { generateLiveData, LiveStation, RiskCategory } from "@/data/stations";

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
  
  const { data: allStations = [], refetch } = useQuery({
    queryKey: ['oceanData'],
    queryFn: async () => {
      const res = await fetch("http://localhost:5001/api/ocean-data");
      if (!res.ok) throw new Error("Network response was not ok");
      const json = await res.json();
      return json.frontend.stations as LiveStation[];
    },
    refetchInterval: filters.liveMode ? filters.refreshSec * 1000 : false,
    initialData: () => generateLiveData(4)
  });

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

  return { filters, setFilters, stations: filtered, allStations, metrics, refresh: refetch };
}
