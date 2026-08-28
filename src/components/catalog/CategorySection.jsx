import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductGridSkeleton } from "@/components/catalog/ProductSkeleton";

/**
 * Uma seção de categoria: título + grade de produtos.
 * Some da tela se não houver produtos (e não estiver carregando).
 */
export function CategorySection({ categoria, produtos, loading }) {
  if (!loading && produtos.length === 0) return null;

  return (
    <section id={categoria.slug} className="scroll-mt-24">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl">{categoria.emoji}</span>
        <h2 className="font-display text-xl tracking-tight">{categoria.nome}</h2>
        {!loading && (
          <span className="text-sm text-muted-foreground">
            ({produtos.length})
          </span>
        )}
      </div>

      {loading ? (
        <ProductGridSkeleton n={4} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {produtos.map((p) => (
            <ProductCard key={p.id} produto={p} />
          ))}
        </div>
      )}
    </section>
  );
}
