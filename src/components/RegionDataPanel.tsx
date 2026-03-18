import React from "react";
import { MLData } from "@/hooks/useOceanData";
import { motion } from "framer-motion";

interface Props {
  location: { lat: number; lng: number } | null;
  mlData: MLData;
}

export default function RegionDataPanel({ location, mlData }: Props) {
  // Always render the container to avoid layout shifts, but show placeholder if no location
  if (!location) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-border p-12 text-center bg-card/20 uppercase tracking-[2px] font-mono text-[10px] text-muted-foreground">
        Click on the map to analyze regional environmental pressure
      </div>
    );
  }

  const { temperature, pH, salinity } = mlData || { temperature: 20, pH: 8.1, salinity: 35 };

  // Fallbacks if data is null
  const t = temperature ?? 20;
  const p = pH ?? 8.1;
  const s = salinity ?? 35;

  // Deterministic calculation based on location + live ML data
  const seed = (Math.abs(location.lat) + Math.abs(location.lng)) % 10;
  
  // Formulas based on user requested dependencies
  // 1. Coral Bleaching: Temp, Salinity, pH
  const coralBleaching = Math.min(100, Math.max(0, 
    Math.round((t * 2.5 + s * 0.8 + (9 - p) * 12 + seed) * 0.6)
  ));

  // 2. Biodiversity: Temp, pH, Salinity
  const biodiversity = Math.min(100, Math.max(0, 
    Math.round((t * 1.2 + p * 8 + s * 0.5 + seed * 2) * 0.7)
  ));

  // 3. Pollution: pH, Temp
  const pollution = Math.min(100, Math.max(0, 
    Math.round(((9 - p) * 15 + t * 0.8 + seed * 3) * 0.8)
  ));

  // 4. Climate Impact: pH, Salinity
  const climateImpact = Math.min(100, Math.max(0, 
    Math.round(((9 - p) * 10 + s * 1.2 + seed * 4) * 0.9)
  ));

  const average = Math.round((coralBleaching + biodiversity + pollution + climateImpact) / 4);

  const metrics = [
    { label: "Coral Bleaching", value: coralBleaching, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Biodiversity", value: biodiversity, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Pollution", value: pollution, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "Climate Impact", value: climateImpact, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm"
    >
      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* Left Side: Detail Metrics */}
        <div className="flex-1 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-mono text-sm font-bold tracking-wider text-muted-foreground uppercase">
              📍 Regional Analytics: {location.lat.toFixed(3)}°, {location.lng.toFixed(3)}°
            </h3>
            <span className="rounded-full bg-primary/20 px-2 py-0.5 font-mono text-[10px] text-primary">
              LIVE CALCULATION
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metrics.map((m) => (
              <div key={m.label} className={`rounded-lg border border-border p-4 transition-colors hover:border-primary/30 ${m.bg}`}>
                <p className="font-mono text-[10px] font-bold text-muted-foreground uppercase">{m.label}</p>
                <div className="flex items-baseline justify-between mt-1">
                  <span className={`text-2xl font-black ${m.color}`}>{m.value}</span>
                  <span className="text-[10px] text-muted-foreground">Index Units</span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${m.value}%` }}
                    className={`h-full ${m.color.replace('text', 'bg')}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Average Section */}
        <div className="w-full lg:w-72 bg-primary/5 p-6 flex flex-col justify-center items-center text-center">
          <p className="font-mono text-[11px] font-bold text-primary tracking-[3px] uppercase mb-4">
            Region Average
          </p>
          <div className="relative">
            <svg className="h-32 w-32 -rotate-90 transform">
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-800"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="364.4"
                initial={{ strokeDashoffset: 364.4 }}
                animate={{ strokeDashoffset: 364.4 - (364.4 * average) / 100 }}
                className="text-primary"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-foreground">{average}</span>
              <span className="text-[10px] font-mono font-bold text-primary uppercase">Risk Score</span>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground font-mono leading-relaxed">
            Combined environmental pressure index for the selected mile-radius.
          </p>
        </div>
      </div>

      {/* Input Data Summary Footer */}
      <div className="bg-border/50 px-6 py-2 flex items-center gap-4 border-t border-border">
        <span className="font-mono text-[9px] text-muted-foreground uppercase">Reference Data:</span>
        <div className="flex gap-4 font-mono text-[9px] text-foreground font-medium">
          <span>🌡 {t}°C</span>
          <span>🧪 {p} pH</span>
          <span>🧂 {s} psu</span>
        </div>
      </div>
    </motion.div>
  );
}
