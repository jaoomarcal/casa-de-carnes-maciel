import { PESOS, PESO_MINIMO } from "@/data/categories";
import { cn } from "@/lib/utils";

/**
 * Seleção de peso: atalhos (100g / 500g / 1kg) + campo para digitar
 * o peso exato em gramas.
 * `value` em gramas (número), `onChange(gramas)`.
 */
export function WeightSelector({ value, onChange, disabled }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-1.5">
        {PESOS.map((p) => (
          <button
            key={p.gramas}
            type="button"
            disabled={disabled}
            onClick={() => onChange(p.gramas)}
            className={cn(
              "flex-1 rounded-md border px-2 py-1.5 text-xs font-semibold transition-colors",
              value === p.gramas
                ? "border-carne bg-carne text-white"
                : "border-border bg-background text-muted-foreground hover:border-carne/50"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        Peso exato (g)
        <input
          type="number"
          inputMode="numeric"
          min={PESO_MINIMO}
          step={50}
          disabled={disabled}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            onChange(Number.isNaN(n) ? "" : n);
          }}
          className="w-24 rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        />
      </label>
    </div>
  );
}
