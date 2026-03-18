export interface BaseStation {
  name: string;
  lat: number;
  lon: number;
  baseScore: number;
  risk: string;
  region: string;
}

export const BASE_STATIONS: BaseStation[] = [
  { name: "Great Barrier Reef N", lat: -16.5, lon: 145.5, baseScore: 28, risk: "Coral Bleaching", region: "Pacific Ocean" },
  { name: "Great Barrier Reef S", lat: -21.0, lon: 149.0, baseScore: 35, risk: "Thermal Stress", region: "Pacific Ocean" },
  { name: "Caribbean - PR", lat: 18.2, lon: -66.5, baseScore: 42, risk: "Acidification", region: "Atlantic Ocean" },
  { name: "Bay of Bengal", lat: 13.1, lon: 80.3, baseScore: 38, risk: "Biodiversity Loss", region: "Indian Ocean" },
  { name: "Gulf of Mexico", lat: 25.5, lon: -90.0, baseScore: 22, risk: "Hypoxic Zone", region: "Atlantic Ocean" },
  { name: "Red Sea", lat: 27.0, lon: 34.0, baseScore: 61, risk: "Moderate Risk", region: "Indian Ocean" },
  { name: "Coral Triangle", lat: 0.5, lon: 124.0, baseScore: 33, risk: "Species Loss", region: "Pacific Ocean" },
  { name: "Mediterranean", lat: 35.0, lon: 28.0, baseScore: 58, risk: "Pollution", region: "Mediterranean" },
  { name: "Arctic Ocean", lat: 78.0, lon: 15.0, baseScore: 19, risk: "Ice Melt", region: "Arctic Ocean" },
  { name: "Maldives", lat: 4.2, lon: 73.5, baseScore: 45, risk: "Bleaching Risk", region: "Indian Ocean" },
  { name: "Pacific - Hawaii", lat: 21.0, lon: -157.0, baseScore: 67, risk: "Low Risk", region: "Pacific Ocean" },
  { name: "South China Sea", lat: 12.0, lon: 114.0, baseScore: 40, risk: "Pollution", region: "Pacific Ocean" },
  { name: "Norwegian Sea", lat: 65.0, lon: 5.0, baseScore: 72, risk: "Low Risk", region: "Arctic Ocean" },
  { name: "Galapagos Islands", lat: -0.9, lon: -89.6, baseScore: 55, risk: "Species Migration", region: "Pacific Ocean" },
  { name: "Persian Gulf", lat: 26.0, lon: 52.0, baseScore: 30, risk: "Thermal Pollution", region: "Indian Ocean" },
  { name: "Mozambique Channel", lat: -17.0, lon: 42.0, baseScore: 48, risk: "Overfishing", region: "Indian Ocean" },
  { name: "East China Sea", lat: 30.0, lon: 125.0, baseScore: 36, risk: "Chemical Pollution", region: "Pacific Ocean" },
  { name: "Andaman Sea", lat: 10.0, lon: 96.0, baseScore: 52, risk: "Biodiversity Loss", region: "Indian Ocean" },
  { name: "North Sea", lat: 56.0, lon: 3.0, baseScore: 64, risk: "Moderate Risk", region: "Atlantic Ocean" },
  { name: "Bering Sea", lat: 58.0, lon: -175.0, baseScore: 44, risk: "Temperature Rise", region: "Pacific Ocean" },
];

export type RiskCategory = "CRITICAL" | "MODERATE" | "HEALTHY";

export interface LiveStation {
  name: string;
  lat: number;
  lon: number;
  score: number;
  risk: string;
  riskPct: number;
  radius: number;
  elevation: number;
  category?: RiskCategory;
  region: string;
  color?: [number, number, number];
}

export function categorizeStation(score: number, type: 'pollution' | 'biodiversity' | 'coral' | 'dashboard' = 'dashboard'): { category: RiskCategory, color: [number, number, number] } {
  if (type === 'biodiversity') {
    if (score < 50) return { category: "CRITICAL", color: [220, 50, 50] };
    if (score < 85) return { category: "MODERATE", color: [255, 140, 0] };
    return { category: "HEALTHY", color: [50, 200, 100] };
  }
  // Default logic for dashboard, pollution, and coral pages
  if (score < 40) return { category: "CRITICAL", color: [220, 50, 50] };
  if (score < 80) return { category: "MODERATE", color: [255, 140, 0] };
  return { category: "HEALTHY", color: [50, 200, 100] };
}

export function generateLiveData(noise = 4): LiveStation[] {
  return BASE_STATIONS.map((s) => {
    const score = Math.max(5, Math.min(95, s.baseScore + (Math.random() * 2 - 1) * noise));
    const riskPct = Math.round((100 - score) * 10) / 10;
    const radius = Math.round((100 - score) * 1800);
    const { category, color } = categorizeStation(score);
    
    return {
      name: s.name,
      lat: s.lat,
      lon: s.lon,
      score: Math.round(score * 10) / 10,
      risk: s.risk,
      riskPct,
      radius,
      elevation: Math.round((100 - score) * 5000),
      category,
      region: s.region,
      color,
    };
  });
}
