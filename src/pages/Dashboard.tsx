import { useOceanData } from "@/hooks/useOceanData";
import DashboardHeader from "@/components/DashboardHeader";
import ControlPanel from "@/components/ControlPanel";
import MetricsPanel from "@/components/MetricsPanel";
import OceanMap from "@/components/OceanMap";
import AlertsPanel from "@/components/AlertsPanel";
import DataTable from "@/components/DataTable";
import { useState } from "react";
import RegionDataPanel from "@/components/RegionDataPanel";

export default function Dashboard() {
  const { filters, setFilters, stations, mlData, metrics } = useOceanData();
  const [clickedRegion, setClickedRegion] = useState<{ lat: number; lng: number } | null>(null);

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6">
      <DashboardHeader liveMode={filters.liveMode} />
      <ControlPanel filters={filters} onChange={setFilters} />
      <MetricsPanel metrics={metrics} />
      <OceanMap 
        stations={stations} 
        pitch={filters.pitch} 
        showHeatmap={filters.showHeatmap}
        clickedLocation={clickedRegion}
        onMapClick={setClickedRegion}
      />
      <RegionDataPanel location={clickedRegion} mlData={mlData!} />
      <AlertsPanel stations={stations} />
      <DataTable stations={stations} />
      <p className="mt-4 border-t border-border pt-4 text-right font-mono text-[10px] text-muted-foreground">
        Last updated: {new Date().toISOString().replace("T", " ").slice(0, 19)} UTC · Ocean Risk Monitor
      </p>
    </div>
  );
}
