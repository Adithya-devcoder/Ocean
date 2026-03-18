import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import { useOceanData } from "@/hooks/useOceanData";
import { PageHeader, Stat, ChartCard, StationList } from "./CoralReefs";

export default function ClimateImpact() {
  const { allStations: stations } = useOceanData();

  const tempData = [
    { month: "2021-Jan", temp: 13.2, anomaly: 0.12 },
    { month: "2021-Jul", temp: 15.8, anomaly: 0.45 },
    { month: "2022-Jan", temp: 14.1, anomaly: 0.22 },
    { month: "2022-Jul", temp: 16.4, anomaly: 0.58 },
    { month: "2023-Jan", temp: 13.8, anomaly: 0.28 },
    { month: "2023-Jul", temp: 15.9, anomaly: 0.52 },
    { month: "2024-Jan", temp: 14.5, anomaly: 0.41 },
    { month: "2024-Jul", temp: 18.2, anomaly: 1.15 },
    { month: "2025-Jan", temp: 15.1, anomaly: 0.62 },
    { month: "2025-Jul", temp: 17.5, anomaly: 0.98 },
    { month: "2026-Jan", temp: 16.2, anomaly: 0.84 },
    { month: "2026-Jul", temp: 19.8, anomaly: 1.72 },
  ];

  const vulnData = [
    { name: "Great Barrie", vulnerability: 78 },
    { name: "Great Barrie", vulnerability: 71 },
    { name: "Caribbean - ", vulnerability: 65 },
    { name: "Bay of Benga", vulnerability: 69 },
    { name: "Gulf of Mexi", vulnerability: 82 },
    { name: "Red Sea", vulnerability: 45 },
    { name: "Coral Triang", vulnerability: 74 },
    { name: "Mediterranea", vulnerability: 48 },
  ];

  const seaLevel = [
    { month: "Jan", rise: 3.2 },
    { month: "Feb", rise: 3.3 },
    { month: "Mar", rise: 3.4 },
    { month: "Apr", rise: 3.6 },
    { month: "May", rise: 3.8 },
    { month: "Jun", rise: 4.1 },
    { month: "Jul", rise: 4.4 },
    { month: "Aug", rise: 4.6 },
    { month: "Sep", rise: 4.3 },
    { month: "Oct", rise: 4.0 },
    { month: "Nov", rise: 3.7 },
    { month: "Dec", rise: 3.5 },
  ];

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6">
      <PageHeader title="Climate Impact Analysis" subtitle="Temperature changes · Ecosystem vulnerability · Sea level trends" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Stat label="Avg Ocean Temp" value="15.2°C" color="text-accent" />
        <Stat label="Temp Anomaly" value="+1.2°C" color="text-destructive" />
        <Stat label="Sea Level Rise" value="3.6mm/yr" color="text-warning" />
        <Stat label="Vulnerable Zones" value={stations.filter((s) => s.score < 40).length} color="text-destructive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Ocean Temperature Trend (2021 - 2026)">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={tempData}>
              <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 9 }} interval={0} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} domain={["auto", "auto"]} />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#22D3EE" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="anomaly" stroke="#EF4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Ecosystem Vulnerability">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={vulnData}>
              <XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="vulnerability" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Sea Level Rise Projection">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={seaLevel}>
            <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
            <YAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} />
            <Tooltip />
            <Area type="monotone" dataKey="rise" stroke="#4DA3FF" fill="#4DA3FF" fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <StationList stations={stations.filter((s) => s.score < 50).slice(0, 6)} />
    </div>
  );
}
