import { PESO_MINIMO } from "@/data/categories";

/**
 * Campo de peso do produto: o cliente digita a quantidade exata em gramas.
 * `value` em gramas (número), `onChange(gramas)`.
 */
export function WeightSelector({ value, onChange, disabled }) {
  return (
    <label className="block text-sm font-medium">
      Peso (em gramas)
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
  );
}
