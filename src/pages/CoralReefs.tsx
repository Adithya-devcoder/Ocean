import React, { type ReactNode } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { useOceanData } from "@/hooks/useOceanData";
import { categorizeStation } from "@/data/stations";
import { generateLiveData } from "@/data/stations"; // Kept for the return type of StationList

const COLORS = { critical: "#EF4444", moderate: "#F59E0B", healthy: "#22C55E" };

export default function CoralReefs() {
  const { allStations } = useOceanData();

  // Apply specific logic for CoralReefs page:
  const stations = allStations.map(s => {
    const { category, color } = categorizeStation(s.score, 'coral');
    return { ...s, category, color };
  });

  const coralStations = stations.filter((s) =>
    ["Coral Bleaching", "Bleaching Risk", "Thermal Stress", "Species Loss"].includes(s.risk)
  );

  const healthData = coralStations.map((s) => {
    let name = s.name;
    if (name === "Great Barrier Reef N") name = "Great Barrier N";
    else if (name === "Great Barrier Reef S") name = "Great Barrier S";
    else name = name.slice(0, 15);
    
    return { name, score: s.score, risk: s.riskPct };
  });

  const categoryData = [
    { name: "critical", value: coralStations.filter((s) => s.category === "CRITICAL").length, fill: COLORS.critical },
    { name: "moderate", value: coralStations.filter((s) => s.category === "MODERATE").length, fill: COLORS.moderate },
    { name: "healthy", value: coralStations.filter((s) => s.category === "HEALTHY").length, fill: COLORS.healthy },
  ];

  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="#F8FAFC" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" className="font-mono">
        <tspan x={x} dy="-0.6em" fontSize="11" fontWeight="900" fill="#F8FAFC">{(percent * 100).toFixed(0)}%</tspan>
        <tspan x={x} dy="1.2em" fontSize="9" fontWeight="500" fill="#94A3B8" className="uppercase tracking-widest">{name}</tspan>
      </text>
    );
  };

  const trendData = [
    { month: "Jan", bleaching: 45, recovery: 32 },
    { month: "Feb", bleaching: 48, recovery: 35 },
    { month: "Mar", bleaching: 52, recovery: 38 },
    { month: "Apr", bleaching: 55, recovery: 40 },
    { month: "May", bleaching: 62, recovery: 36 },
    { month: "Jun", bleaching: 68, recovery: 31 },
    { month: "Jul", bleaching: 72, recovery: 28 },
    { month: "Aug", bleaching: 75, recovery: 25 },
    { month: "Sep", bleaching: 69, recovery: 30 },
    { month: "Oct", bleaching: 58, recovery: 36 },
    { month: "Nov", bleaching: 49, recovery: 42 },
    { month: "Dec", bleaching: 44, recovery: 45 },
  ];

  const effectsScaleImage = `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="350" height="25">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#a70000aa" />
          <stop offset="50%" stop-color="#ffff00d2" />
          <stop offset="100%" stop-color="#118711c3" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="350" height="25" rx="12" fill="url(#g)" />
    </svg>
  `)}`;

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6">
      <PageHeader title="Coral Reef Intelligence" subtitle="Bleaching risk · Health indicators · Monitoring" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Stat label="Monitored Reefs" value={coralStations.length} />
        <Stat label="Avg Health Score" value={Math.round(coralStations.reduce((a, s) => a + s.score, 0) / (coralStations.length || 1))} color="text-accent" />
        <Stat label="Avg Bleaching Risk" value={`${Math.round(coralStations.reduce((a, s) => a + s.riskPct, 0) / (coralStations.length || 1))}%`} color="text-warning" />
        <Stat 
          label="Effects Scale" 
          value={
            <img
              src={effectsScaleImage}
              alt="Effects scale"
              className="h-10 w-full max-w-[140px] object-contain"
            />
          } 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Coral Health by Station">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={healthData}>
              <XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
              <YAxis 
                tick={{ fill: "#9CA3AF", fontSize: 10 }} 
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip />
              <Bar dataKey="score" fill="#4DA3FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Risk Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
                label={renderCustomLabel}
                labelLine={false}
              >
                {categoryData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.fill}
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid rgba(51, 65, 85, 0.5)",
                  borderRadius: "8px",
                  fontSize: "12px"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Bleaching & Recovery Trends (12 Months)">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={trendData}>
            <XAxis dataKey="month" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
            <YAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} />
            <Tooltip />
            <Area type="monotone" dataKey="bleaching" stroke="#EF4444" fill="#EF4444" fillOpacity={0.15} />
            <Area type="monotone" dataKey="recovery" stroke="#22C55E" fill="#22C55E" fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <StationList stations={coralStations} />
    </div>
  );
}

// Shared sub-page components
export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <h1 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
        {title}
      </h1>
      <p className="mt-1 font-mono text-[10px] tracking-[2.5px] text-muted-foreground uppercase">{subtitle}</p>
    </motion.div>
  );
}

export function Stat({ label, value, color = "text-foreground" }: { label: string; value: ReactNode; color?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="font-mono text-[10px] tracking-[1px] text-primary uppercase">{label}</p>
      <div className={`font-display text-2xl font-extrabold ${color}`}>{value}</div>
    </div>
  );
}

export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 mb-4">
      <p className="font-mono text-[10px] tracking-[2px] text-primary uppercase mb-3">{title}</p>
      {children}
    </div>
  );
}

export function StationList({ stations }: { stations: ReturnType<typeof generateLiveData> }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 mt-4">
      <p className="font-mono text-[10px] tracking-[2px] text-primary uppercase mb-3">📋 Monitoring Stations</p>
      <div className="space-y-2">
        {stations.map((s) => (
          <div key={s.name} className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-4 py-2">
            <div>
              <p className="font-mono text-xs font-bold text-foreground">{s.name}</p>
              <p className="font-mono text-[10px] text-muted-foreground">{s.risk} · {s.region}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-bold text-accent">{s.score}</p>
              <span className={`inline-block rounded-full px-2 py-0.5 font-mono text-[9px] ${s.category === "CRITICAL" ? "bg-destructive/10 text-destructive" :
                s.category === "MODERATE" ? "bg-warning/10 text-warning" : "bg-healthy/10 text-healthy"
                }`}>{s.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
