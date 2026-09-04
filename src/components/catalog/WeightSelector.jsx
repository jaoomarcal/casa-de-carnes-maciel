import { PESO_MINIMO } from "@/data/categories";
import { cn } from "@/lib/utils";

// Pesos mais pedidos no balcão — atalho de um toque em vez de digitar sempre.
const ATALHOS_PESO = [300, 500, 750, 1000];

/**
 * Campo de peso do produto: o cliente escolhe um atalho comum (300g/500g/...)
 * ou digita a quantidade exata em gramas.
 * `value` em gramas (número), `onChange(gramas)`.
 */
export function WeightSelector({ value, onChange, disabled }) {
  return (
    <div className="text-sm font-medium">
      Peso (em gramas)

      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {ATALHOS_PESO.map((g) => (
          <button
            key={g}
            type="button"
            disabled={disabled}
            onClick={() => onChange(g)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
              value === g
                ? "border-carne bg-carne text-white"
                : "border-border bg-background text-muted-foreground hover:border-carne/50"
            )}
          >
            {g >= 1000 ? `${g / 1000}kg` : `${g}g`}
          </button>
        ))}
      </div>

      <label className="mt-1.5 block text-xs font-normal text-muted-foreground">
        ou digite o peso exato
        <div className="relative mt-1">
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
            className="w-full rounded-lg border border-input bg-background px-3 py-2 pr-9 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            g
          </span>
        </div>
      </label>
    </div>
  );
}
