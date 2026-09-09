import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductGridSkeleton } from "@/components/catalog/ProductSkeleton";
import { PromoCarousel } from "@/components/catalog/PromoCarousel";

/**
 * Uma seção de categoria: título + grade de produtos.
 * Some da tela se não houver produtos (e não estiver carregando).
 *
 * A categoria "promocao" foge da grade: vira uma vitrine giratória com um
 * produto grande por vez (ver PromoCarousel), pra ficar mais chamativa e
 * legível no mobile.
 */
export function CategorySection({ categoria, produtos, loading }) {
  if (!loading && produtos.length === 0) return null;

  const ehPromocao = categoria.slug === "promocao";

  return (
    <section id={categoria.slug} className="scroll-mt-24">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="font-display text-xl tracking-tight">{categoria.nome}</h2>
        {!loading && (
          <span className="text-sm text-muted-foreground">
            ({produtos.length})
          </span>
        )}
      </div>

      {loading ? (
        <ProductGridSkeleton n={4} />
      ) : ehPromocao ? (
        <PromoCarousel produtos={produtos} />
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
