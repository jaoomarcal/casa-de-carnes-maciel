import { Search, X } from "lucide-react";

/**
 * Barra de busca do cliente na home. Fica fixa no topo (o wrapper em Home.jsx
 * cuida do sticky) e apenas informa o termo digitado; quem filtra as seções
 * de produtos é a própria Home.
 */
export function ProductSearch({ value, onChange }) {
  return (
    <div className="border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto max-w-2xl px-4 py-2.5 lg:max-w-5xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Buscar produto..."
            className="w-full rounded-full border border-input bg-background py-2 pl-9 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Limpar busca"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
