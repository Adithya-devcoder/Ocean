import type { OceanFilters } from "@/hooks/useOceanData";

interface Props {
  filters: OceanFilters;
  onChange: (f: OceanFilters) => void;
}

export default function ControlPanel({ filters, onChange }: Props) {
  const set = (partial: Partial<OceanFilters>) => onChange({ ...filters, ...partial });

  return (
    <div className="rounded-xl border border-border bg-card p-4 mb-4">
      <p className="font-mono text-[10px] tracking-[2px] text-primary uppercase mb-3">⚙ Controls</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Mode */}
        <div>
          <Label>Mode</Label>
          <div className="mt-1 space-y-1">
            <Toggle label="🔴 Live" checked={filters.liveMode} onChange={(v) => set({ liveMode: v })} />
            <Toggle label="🌡 Heatmap" checked={filters.showHeatmap} onChange={(v) => set({ showHeatmap: v })} />
          </div>
        </div>
        {/* Refresh */}
        <div>
          <Label>Refresh (s)</Label>
          <input
            type="range" min={5} max={60} value={filters.refreshSec}
            onChange={(e) => set({ refreshSec: +e.target.value })}
            className="mt-2 w-full accent-primary"
          />
          <span className="font-mono text-[11px] text-muted-foreground">{filters.refreshSec}s</span>
        </div>
        {/* Tilt */}
        <div>
          <Label>3D Tilt</Label>
          <input
            type="range" min={0} max={60} value={filters.pitch}
            onChange={(e) => set({ pitch: +e.target.value })}
            className="mt-2 w-full accent-primary"
          />
          <span className="font-mono text-[11px] text-muted-foreground">{filters.pitch}°</span>
        </div>
        {/* Risk filter */}
        <div>
          <Label>Risk Filter</Label>
          <div className="mt-1 space-y-1">
            <Toggle label="🔴 Critical" checked={filters.showCritical} onChange={(v) => set({ showCritical: v })} />
            <Toggle label="🟠 Moderate" checked={filters.showModerate} onChange={(v) => set({ showModerate: v })} />
            <Toggle label="🟢 Healthy" checked={filters.showHealthy} onChange={(v) => set({ showHealthy: v })} />
          </div>
        </div>
        {/* Score range */}
        <div>
          <Label>Score Range</Label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="number" min={0} max={100} value={filters.minScore}
              onChange={(e) => set({ minScore: +e.target.value })}
              className="w-14 rounded border border-border bg-muted px-2 py-1 font-mono text-xs text-foreground"
            />
            <span className="text-muted-foreground">–</span>
            <input
              type="number" min={0} max={100} value={filters.maxScore}
              onChange={(e) => set({ maxScore: +e.target.value })}
              className="w-14 rounded border border-border bg-muted px-2 py-1 font-mono text-xs text-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10px] tracking-[2px] text-primary uppercase">{children}</p>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-primary" />
      <span className="font-mono text-[11px] text-foreground">{label}</span>
    </label>
  );
}
