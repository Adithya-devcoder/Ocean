import { type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { useOceanData } from "@/hooks/useOceanData";
import { PageHeader, StationList } from "./CoralReefs";

const POLLUTION_COLORS = {
  plastic: "#FF3B3B",
  nutrient: "#00FF88",
  oilSpill: "#FFD600",
  chemical: "#00E0FF",
};

export default function Pollution() {
  const { allStations } = useOceanData();
  
  // Apply specific logic for Pollution page:
  // if score < 40 : critical
  // 40<=score<80:moderate
  // 80<=score:healthy
  const stations = allStations.map(s => {
    let category: "CRITICAL" | "MODERATE" | "HEALTHY";
    let color: [number, number, number];
    if (s.score < 40) {
      category = "CRITICAL";
      color = [220, 50, 50];
    } else if (s.score < 80) {
      category = "MODERATE";
      color = [255, 140, 0];
    } else {
      category = "HEALTHY";
      color = [50, 200, 100];
    }
    return { ...s, category, color };
  });

  const pollStations = stations.slice(0, 4); // Fixed to 4 zones as per requirement

  const pollutionTypes = [
    { name: "Plastic", value: 42, fill: POLLUTION_COLORS.plastic },
    { name: "Nutrient", value: 24, fill: POLLUTION_COLORS.nutrient },
    { name: "Oil Spill", value: 18, fill: POLLUTION_COLORS.oilSpill },
    { name: "Chemical", value: 16, fill: POLLUTION_COLORS.chemical },
  ];

  const hotspots = [
    { name: "North Pacific", level: 85 },
    { name: "Gulf of Mexico", level: 72 },
    { name: "Mediterranean", level: 64 },
    { name: "South China Sea", level: 58 },
    { name: "Bay of Bengal", level: 45 },
  ];

  const trend = [
    { month: "Jan", plastic: 45, nutrient: 30, chemical: 20 },
    { month: "Feb", plastic: 48, nutrient: 32, chemical: 22 },
    { month: "Mar", plastic: 52, nutrient: 28, chemical: 25 },
    { month: "Apr", plastic: 49, nutrient: 35, chemical: 24 },
    { month: "May", plastic: 55, nutrient: 31, chemical: 23 },
    { month: "Jun", plastic: 58, nutrient: 34, chemical: 20 },
    { month: "Jul", plastic: 54, nutrient: 29, chemical: 26 },
    { month: "Aug", plastic: 60, nutrient: 27, chemical: 28 },
    { month: "Sep", plastic: 57, nutrient: 32, chemical: 24 },
    { month: "Oct", plastic: 53, nutrient: 36, chemical: 21 },
    { month: "Nov", plastic: 50, nutrient: 33, chemical: 19 },
    { month: "Dec", plastic: 47, nutrient: 28, chemical: 18 },
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
    <div className="mx-auto max-w-[1600px] px-4 py-6 bg-[#020817] min-h-screen text-slate-50">
      <PageHeader
        // icon="🏭"
        title="Pollution Monitor"
        subtitle="Pollution Hotspots · Pollution Trends · Monitoring Stations"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <PollutionStat
          label="Microplastics Concentration Estimate"
          value="~2.76 items/m³"
          glowColor="rgba(255, 59, 59, 0.3)"
          delay={0.1}
        />
        <PollutionStat
          label="Pollution Zones"
          value="4"
          // icon="📍"
          glowColor="rgba(0, 224, 255, 0.3)"
          delay={0.2}
        />
        <PollutionStat
          label="Average Pollution Percentage"
          value="64%"
          glowColor="rgba(0, 255, 136, 0.3)"
          delay={0.3}
        />
        <PollutionStat
          label="Effects Scale"
          value={
            <img
              src={effectsScaleImage}
              alt="Effects scale"
              className="h-10 w-full max-w-[140px] object-contain"
            />
          }
          glowColor="rgba(255, 214, 0, 0.3)"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PollutionChartCard title="Pollution Type Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pollutionTypes}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                label={({ name, value }) => `${value}% ${name}`}
              >
                {pollutionTypes.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid rgba(51, 65, 85, 0.5)",
                  borderRadius: "8px",
                  backdropFilter: "blur(4px)",
                }}
                itemStyle={{ color: "#f8fafc" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {pollutionTypes.map((type) => (
              <div key={type.name} className="flex flex-col items-start px-4 py-2 rounded-xl bg-slate-900/30 border border-slate-800/50">
                <span className="text-xl font-black" style={{ color: type.fill, textShadow: `0 0 10px ${type.fill}44` }}>{type.value}%</span>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-tighter">{type.name}</span>
              </div>
            ))}
          </div>
        </PollutionChartCard>

        <PollutionChartCard title="Pollution Hotspots">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hotspots} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00E0FF" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#00E0FF" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid rgba(51, 65, 85, 0.5)",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="level"
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                style={{ filter: "drop-shadow(0 0 10px rgba(0, 224, 255, 0.4))" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </PollutionChartCard>
      </div>

      <PollutionChartCard title="Pollution Trends">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={trend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPlastic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={POLLUTION_COLORS.plastic} stopOpacity={0.3} />
                <stop offset="95%" stopColor={POLLUTION_COLORS.plastic} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNutrient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={POLLUTION_COLORS.nutrient} stopOpacity={0.3} />
                <stop offset="95%" stopColor={POLLUTION_COLORS.nutrient} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorChemical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={POLLUTION_COLORS.chemical} stopOpacity={0.3} />
                <stop offset="95%" stopColor={POLLUTION_COLORS.chemical} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid rgba(51, 65, 85, 0.5)",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="plastic"
              stroke={POLLUTION_COLORS.plastic}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPlastic)"
              animationDuration={2000}
            />
            <Area
              type="monotone"
              dataKey="nutrient"
              stroke={POLLUTION_COLORS.nutrient}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorNutrient)"
              animationDuration={2500}
            />
            <Area
              type="monotone"
              dataKey="chemical"
              stroke={POLLUTION_COLORS.chemical}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorChemical)"
              animationDuration={3000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </PollutionChartCard>

      <div className="mt-8">
        <StationList stations={pollStations} />
      </div>
    </div>
  );
}

function PollutionStat({
  label,
  value,
  icon,
  glowColor,
  delay = 0,
}: {
  label: string;
  value: ReactNode;
  icon?: string;
  glowColor: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-2xl"
      style={{ boxShadow: `0 0 20px ${glowColor}` }}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          {icon && <span className="text-xl">{icon}</span>}
          <p className="font-mono text-[10px] font-bold tracking-[2px] text-slate-400 uppercase">
            {label}
          </p>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: delay + 0.3 }}
          className="font-display text-3xl font-extrabold text-white"
        >
          {value}
        </motion.p>
      </div>
      <div
        className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: glowColor }}
      />
    </motion.div>
  );
}

function PollutionChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6 backdrop-blur-xl"
    >
      <h3 className="font-mono text-[11px] font-bold tracking-[3px] text-cyan-400 uppercase mb-6 border-b border-slate-800 pb-2">
        {title}
      </h3>
      {children}
    </motion.div>
  );
}
