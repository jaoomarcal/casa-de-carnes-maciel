import { HeroBanner } from "@/components/layout/HeroBanner";
import { PromoBanner } from "@/components/layout/PromoBanner";
import { Footer } from "@/components/layout/Footer";
import { CategoryNav } from "@/components/catalog/CategoryNav";
import { CategorySection } from "@/components/catalog/CategorySection";
import { FloatingCart } from "@/components/cart/FloatingCart";
import { CATEGORIAS } from "@/data/categories";
import { useProducts } from "@/hooks/useProducts";

export default function Home() {
  const { porCategoria, loading, erro } = useProducts();
  const ofertas = porCategoria("ofertas");
  const categoriasComItens = CATEGORIAS.filter(
    (cat) => porCategoria(cat.slug).length > 0
  );

  return (
    <div className="min-h-dvh bg-background">
      <HeroBanner />
      <PromoBanner ofertas={ofertas} />
      <CategoryNav categorias={categoriasComItens} />

      <main className="mx-auto max-w-2xl space-y-10 px-4 py-10 lg:max-w-5xl">
        {erro && (
          <p className="rounded-lg bg-carne/10 p-4 text-sm text-carne-dark">
            Não foi possível carregar o catálogo agora. Tente novamente em
            instantes.
          </p>
        )}

        {CATEGORIAS.map((cat) => (
          <CategorySection
            key={cat.slug}
            categoria={cat}
            produtos={porCategoria(cat.slug)}
            loading={loading}
          />
        ))}
      </main>

      <Footer />
      <FloatingCart />
    </div>
  );
}
