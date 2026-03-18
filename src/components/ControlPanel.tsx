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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Mode */}
        <div>
          <Label>Heatmap & Live</Label>
          <div className="mt-2 space-y-1">
            <Toggle label="🔴 Live Data Stream" checked={filters.liveMode} onChange={(v) => set({ liveMode: v })} />
            <Toggle label="🌡 Risk Heatmap" checked={filters.showHeatmap} onChange={(v) => set({ showHeatmap: v })} />
          </div>
        </div>
        {/* Risk filter */}
        <div>
          <Label>Risk Categorization</Label>
          <div className="mt-2 space-y-1">
            <Toggle label="🔴 Critical Risk" checked={filters.showCritical} onChange={(v) => set({ showCritical: v })} />
            <Toggle label="🟠 Moderate Risk" checked={filters.showModerate} onChange={(v) => set({ showModerate: v })} />
            <Toggle label="🟢 Healthy Zones" checked={filters.showHealthy} onChange={(v) => set({ showHealthy: v })} />
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
