import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { generateLiveData } from "@/data/stations";

const COLORS = { critical: "#EF4444", moderate: "#F59E0B", healthy: "#22C55E" };

export default function CoralReefs() {
  const stations = useMemo(() => generateLiveData(4), []);
  const coralStations = stations.filter((s) =>
    ["Coral Bleaching", "Bleaching Risk", "Thermal Stress", "Species Loss"].includes(s.risk)
  );

  const healthData = coralStations.map((s) => ({ name: s.name.slice(0, 15), score: s.score, risk: s.riskPct }));

  const categoryData = [
    { name: "Critical", value: coralStations.filter((s) => s.category === "CRITICAL").length, fill: COLORS.critical },
    { name: "Moderate", value: coralStations.filter((s) => s.category === "MODERATE").length, fill: COLORS.moderate },
    { name: "Healthy", value: coralStations.filter((s) => s.category === "HEALTHY").length, fill: COLORS.healthy },
  ];

  const trendData = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
    bleaching: Math.round(30 + Math.random() * 40),
    recovery: Math.round(20 + Math.random() * 30),
  }));

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6">
      <PageHeader title="Coral Reef Intelligence" subtitle="Bleaching risk · Health indicators · Monitoring" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Stat label="Monitored Reefs" value={coralStations.length} />
        <Stat label="Avg Health Score" value={Math.round(coralStations.reduce((a, s) => a + s.score, 0) / (coralStations.length || 1))} color="text-accent" />
        <Stat label="High Bleaching Risk" value={coralStations.filter((s) => s.category === "CRITICAL").length} color="text-destructive" />
        <Stat label="Avg Bleaching Risk" value={`${Math.round(coralStations.reduce((a, s) => a + s.riskPct, 0) / (coralStations.length || 1))}%`} color="text-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ChartCard title="Coral Health by Station">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={healthData}>
              <XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 10 }} />
              <YAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="score" fill="#4DA3FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Risk Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label>
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
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
export function PageHeader({ title, subtitle }: {title: string; subtitle: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
      <h1 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
        {title}
      </h1>
      <p className="mt-1 font-mono text-[10px] tracking-[2.5px] text-muted-foreground uppercase">{subtitle}</p>
    </motion.div>
  );
}

export function Stat({ label, value, color = "text-foreground" }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="font-mono text-[10px] tracking-[1px] text-primary uppercase">{label}</p>
      <p className={`font-display text-2xl font-extrabold ${color}`}>{value}</p>
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
              <span className={`inline-block rounded-full px-2 py-0.5 font-mono text-[9px] ${
                s.category === "CRITICAL" ? "bg-destructive/10 text-destructive" :
                s.category === "MODERATE" ? "bg-warning/10 text-warning" : "bg-healthy/10 text-healthy"
              }`}>{s.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
