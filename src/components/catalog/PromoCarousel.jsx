import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";

import { cn, formatBRL } from "@/lib/utils";
import { rotuloUnidade } from "@/data/categories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductModal } from "@/components/catalog/ProductModal";

const INTERVALO_MS = 4500;

/**
 * Vitrine da categoria "Ofertas": em vez de grade, mostra um produto por
 * vez em destaque (mesma arquitetura do ProductCard normal, só que maior:
 * foto, selo, nome e preço bem grandes) e troca sozinha a cada 4.5s.
 *
 * Só o card central aparece; a navegação entre os produtos fica nos
 * pontinhos abaixo dele.
 */
export function PromoCarousel({ produtos = [] }) {
  const [indice, setIndice] = useState(0);
  const [produtoModal, setProdutoModal] = useState(null);
  const total = produtos.length;

  useEffect(() => {
    if (total < 2) return;
    setIndice((v) => v % total);
    const t = setInterval(() => setIndice((v) => (v + 1) % total), INTERVALO_MS);
    return () => clearInterval(t);
  }, [total]);

  if (total === 0) return null;

  const atual = indice % total;
  const central = produtos[atual];

  const esgotado = central.esgotado;
  const desconto =
    central.temDesconto && central.precoKg > 0
      ? Math.round((1 - central.precoAtualKg / central.precoKg) * 100)
      : null;
  const abrirCentral = () => {
    if (!esgotado) setProdutoModal(central);
  };

  return (
    <>
      <div className="flex justify-center overflow-hidden px-1">
        <motion.article
          key={central.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onClick={abrirCentral}
          role={esgotado ? undefined : "button"}
          tabIndex={esgotado ? undefined : 0}
          onKeyDown={(e) => {
            if (!esgotado && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              abrirCentral();
            }
          }}
          className={cn(
            "flex w-full max-w-sm flex-col overflow-hidden rounded-lg border border-border bg-background shadow-card",
            !esgotado && "cursor-pointer",
            esgotado && "opacity-60"
          )}
        >
          {/* Imagem */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={central.imagem || "/assets/carnes-og.png"}
              alt={central.nome}
              className={cn(
                "h-full w-full object-cover",
                esgotado && "grayscale"
              )}
            />

            {/* Selo chamativo: desconto real quando existe preço de oferta,
                senão um selo genérico — nunca a palavra "Promoção" (o card
                já está dentro dessa seção). */}
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              {desconto ? (
                <Badge className="bg-carne text-sm font-extrabold shadow-lg shadow-carne/40">
                  -{desconto}% OFF
                </Badge>
              ) : (
                <Badge variant="oferta" className="text-sm font-extrabold">
                  Oferta do dia 🔥
                </Badge>
              )}
              {esgotado && <Badge variant="muted">Esgotado</Badge>}
            </div>
          </div>

          {/* Corpo */}
          <div className="flex flex-1 flex-col gap-2.5 p-4 sm:p-5">
            <h3 className="line-clamp-1 text-xl font-semibold leading-tight sm:text-2xl">
              {central.nome}
            </h3>
            {central.descricao && (
              <p className="line-clamp-1 text-sm text-muted-foreground">
                {central.descricao}
              </p>
            )}

            <div className="flex flex-wrap items-baseline gap-1.5">
              {central.temDesconto && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatBRL(central.precoKg)}
                </span>
              )}
              <span className="text-3xl font-extrabold text-carne sm:text-4xl">
                {formatBRL(central.precoAtualKg)}
              </span>
              <span className="text-sm text-muted-foreground">
                / {central.unidadeComPeso ? "kg" : rotuloUnidade(central.unidade)}
              </span>
            </div>

            <div className="mt-auto pt-1">
              {esgotado ? (
                <Badge
                  variant="muted"
                  className="w-full justify-center py-2.5 text-sm"
                >
                  Indisponível
                </Badge>
              ) : (
                <Button size="lg" className="w-full" onClick={abrirCentral}>
                  <SlidersHorizontal className="h-4 w-4" />
                  Escolher
                </Button>
              )}
            </div>
          </div>
        </motion.article>
      </div>

      {total > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {produtos.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Ver ${p.nome}`}
              onClick={() => setIndice(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                idx === atual ? "w-6 bg-carne" : "w-1.5 bg-muted"
              )}
            />
          ))}
        </div>
      )}

      {produtoModal && (
        <ProductModal
          produto={produtoModal}
          aberto={!!produtoModal}
          onOpenChange={(open) => !open && setProdutoModal(null)}
        />
      )}
    </>
  );
}
