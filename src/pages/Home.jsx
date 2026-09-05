import { useState } from "react";

import { normalizarBusca } from "@/lib/utils";
import { HeroBanner } from "@/components/layout/HeroBanner";
import { PromoBanner } from "@/components/layout/PromoBanner";
import { Footer } from "@/components/layout/Footer";
import { CategoryNav } from "@/components/catalog/CategoryNav";
import { CategorySection } from "@/components/catalog/CategorySection";
import { ProductSearch } from "@/components/catalog/ProductSearch";
import { FloatingCart } from "@/components/cart/FloatingCart";
import { LojaFechada } from "@/components/layout/LojaFechada";
import { CATEGORIAS } from "@/data/categories";
import { useProducts } from "@/hooks/useProducts";
import { useLojaAberta } from "@/hooks/useLojaAberta";

export default function Home() {
  const { porCategoria, loading, erro } = useProducts();
  const [busca, setBusca] = useState("");
  const { status, mensagem } = useLojaAberta();

  if (status !== "aberto") return <LojaFechada status={status} mensagem={mensagem} />;

  const ofertas = porCategoria("ofertas");

  // Filtra por nome/descrição; usado para esconder produtos e seções que não
  // batem com a busca do cliente. Ignora acento nos dois lados da comparação
  // (digitar "moida" sem acento precisa achar "Moída").
  const termo = normalizarBusca(busca.trim());
  const filtrar = (lista) =>
    termo
      ? lista.filter((p) =>
          [p.nome, p.descricao]
            .filter(Boolean)
            .some((campo) => normalizarBusca(campo).includes(termo))
        )
      : lista;

  const categoriasComItens = CATEGORIAS.filter(
    (cat) => filtrar(porCategoria(cat.slug)).length > 0
  );

  const semResultados = !loading && termo && categoriasComItens.length === 0;

  return (
    <div className="min-h-dvh bg-background">
      <HeroBanner />
      <PromoBanner ofertas={ofertas} />

      <div className="sticky top-0 z-40">
        <ProductSearch value={busca} onChange={setBusca} />
        <CategoryNav categorias={categoriasComItens} />
      </div>

      <main className="mx-auto max-w-2xl space-y-10 px-4 py-10 lg:max-w-5xl">
        {erro && (
          <p className="rounded-lg bg-carne/10 p-4 text-sm text-carne-dark">
            Não foi possível carregar o catálogo agora. Tente novamente em
            instantes.
          </p>
        )}

        {semResultados && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Nenhum produto encontrado para "{busca}".
          </p>
        )}

        {CATEGORIAS.map((cat) => (
          <CategorySection
            key={cat.slug}
            categoria={cat}
            produtos={filtrar(porCategoria(cat.slug))}
            loading={loading}
          />
        ))}
      </main>

      <Footer />
      <FloatingCart />
    </div>
  );
}
