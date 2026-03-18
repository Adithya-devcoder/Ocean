import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area } from "recharts";
import { useOceanData } from "@/hooks/useOceanData";
import { categorizeStation } from "@/data/stations";
import { PageHeader, Stat, ChartCard, StationList } from "./CoralReefs";

export default function Biodiversity() {
  const { allStations } = useOceanData();

  // Apply specific logic for Biodiversity page:
  const stations = allStations.map(s => {
    const { category, color } = categorizeStation(s.score, 'biodiversity');
    return { ...s, category, color };
  });
  const bioStations = stations.filter((s) =>
    ["Biodiversity Loss", "Species Loss", "Species Migration", "Overfishing"].includes(s.risk)
  );
  const allForCharts = stations;

  const diversityIndex = allForCharts.map((s) => ({
    name: s.name.slice(0, 12),
    diversity: Math.round(s.score * 0.8 + Math.random() * 20),
  }));

  const radarData = [
    { subject: "Fish Species", A: 78, fullMark: 100 },
    { subject: "Coral Species", A: 45, fullMark: 100 },
    { subject: "Mammal Pop.", A: 62, fullMark: 100 },
    { subject: "Plankton", A: 88, fullMark: 100 },
    { subject: "Seagrass", A: 55, fullMark: 100 },
    { subject: "Invertebrates", A: 71, fullMark: 100 },
  ];

  const trend = [
    { month: "Jan", index: 59 },
    { month: "Feb", index: 62 },
    { month: "Mar", index: 70 },
    { month: "Apr", index: 76 },
    { month: "May", index: 73 },
    { month: "Jun", index: 68 },
    { month: "Jul", index: 57 },
    { month: "Aug", index: 51 },
    { month: "Sep", index: 54 },
    { month: "Oct", index: 61 },
    { month: "Nov", index: 69 },
    { month: "Dec", index: 72 },
  ];

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6">
      <PageHeader title="Biodiversity Analysis" subtitle="Species diversity · Ecosystem health · Hotspot mapping" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Stat label="Risk Regions" value={bioStations.length} />
        <Stat label="Species at Risk" value={Math.round(bioStations.length * 42)} color="text-destructive" />
        <Stat label="Biodiversity Index" value="67.3" color="text-accent" />
        <Stat label="Recovery Rate" value="23%" color="text-healthy" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Salinity by Region">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={diversityIndex.slice(0, 10)}>
              <XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="diversity" fill="#7C8CFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Ecosystem Health Radar">
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1E2A3A" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: "#9CA3AF", fontSize: 9 }} />
              <Radar dataKey="A" stroke="#22D3EE" fill="#22D3EE" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Biodiversity Index Trend (12 Months)">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={trend}>
            <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
            <YAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} />
            <Tooltip />
            <Area type="monotone" dataKey="index" stroke="#7C8CFF" fill="#7C8CFF" fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <StationList stations={bioStations.length > 0 ? bioStations : allForCharts.slice(0, 5)} />
    </div>
  );
}
