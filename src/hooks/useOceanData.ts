import { useState, useEffect, useCallback, useRef } from "react";
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
  refreshSec: 15,
  pitch: 45,
};

export function useOceanData() {
  const [filters, setFilters] = useState<OceanFilters>(DEFAULT_FILTERS);
  const [allStations, setAllStations] = useState<LiveStation[]>(() => generateLiveData(4));
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const refresh = useCallback(() => {
    setAllStations(generateLiveData(filters.liveMode ? 4 : 0));
  }, [filters.liveMode]);

  useEffect(() => {
    if (!filters.liveMode) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setAllStations(generateLiveData(4));
    }, filters.refreshSec * 1000);
    return () => clearInterval(intervalRef.current);
  }, [filters.liveMode, filters.refreshSec]);

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

  return { filters, setFilters, stations: filtered, allStations, metrics, refresh };
}
