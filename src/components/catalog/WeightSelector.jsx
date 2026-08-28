import { PESOS } from "@/data/categories";
import { cn } from "@/lib/utils";

/**
 * Botõezinhos de peso (100g / 500g / 1kg).
 * `value` em gramas, `onChange(gramas)`.
 */
export function WeightSelector({ value, onChange, disabled }) {
  return (
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
  );
}
