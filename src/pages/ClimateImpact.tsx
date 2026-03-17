import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import { generateLiveData } from "@/data/stations";
import { PageHeader, Stat, ChartCard, StationList } from "./CoralReefs";

export default function ClimateImpact() {
  const stations = useMemo(() => generateLiveData(4), []);

  const tempData = Array.from({ length: 24 }, (_, i) => ({
    month: `${2023 + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}`,
    temp: +(14.5 + i * 0.05 + Math.random() * 0.5).toFixed(2),
    anomaly: +(0.2 + i * 0.02 + Math.random() * 0.3).toFixed(2),
  }));

  const vulnData = stations.slice(0, 8).map((s) => ({
    name: s.name.slice(0, 12),
    vulnerability: Math.round(100 - s.score + Math.random() * 10),
  }));

  const seaLevel = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
    rise: +(3.2 + i * 0.1 + Math.random() * 0.5).toFixed(1),
  }));

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
        <ChartCard title="Ocean Temperature Trend (24 Months)">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={tempData}>
              <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 9 }} interval={3} />
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
