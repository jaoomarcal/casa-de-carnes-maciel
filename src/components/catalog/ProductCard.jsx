import { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";

import { cn, formatBRL } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductModal } from "@/components/catalog/ProductModal";

/**
 * Card de um produto do catálogo.
 *
 * Regras de UI:
 *  - hover suave: hover:scale-105 + sombra maior
 *  - esgotado (produto.esgotado === true):
 *      imagem em grayscale + opacidade reduzida
 *      botão "Escolher" some e entra a badge "Indisponível"
 *  - oferta: mostra preço antigo riscado + preço novo
 *  - preço no formato "R$ 48,50 / kg"
 *  - ao clicar no card (não esgotado) abre o modal com peso, corte e tempero
 */
export function ProductCard({ produto }) {
  const [aberto, setAberto] = useState(false);

  const esgotado = produto.esgotado;
  const abrir = () => {
    if (!esgotado) setAberto(true);
  };

  return (
    <>
      <motion.article
        layout
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onClick={abrir}
        role={esgotado ? undefined : "button"}
        tabIndex={esgotado ? undefined : 0}
        onKeyDown={(e) => {
          if (!esgotado && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            abrir();
          }
        }}
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-background shadow-soft",
          "transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-card",
          !esgotado && "cursor-pointer",
          esgotado && "opacity-60"
        )}
      >
        {/* Imagem */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={produto.imagem || "/assets/carnes-og.png"}
            alt={produto.nome}
            loading="lazy"
            className={cn(
              "h-full w-full object-cover transition-transform duration-500 group-hover:scale-110",
              esgotado && "grayscale"
            )}
          />

          {/* Selos no canto */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {produto.emOferta && !esgotado && <Badge variant="oferta">Oferta 🔥</Badge>}
            {esgotado && <Badge variant="muted">Esgotado</Badge>}
          </div>
        </div>

        {/* Corpo */}
        <div className="flex flex-1 flex-col gap-2 p-3">
          <h3 className="line-clamp-1 font-semibold leading-tight">{produto.nome}</h3>

          <div className="flex items-baseline gap-1.5">
            {produto.emOferta && (
              <span className="text-xs text-muted-foreground line-through">
                {formatBRL(produto.precoKg)}
              </span>
            )}
            <span className="text-lg font-bold text-carne">
              {formatBRL(produto.precoAtualKg)}
            </span>
            <span className="text-xs text-muted-foreground">/ kg</span>
          </div>

          {/* Ação (empurrada para baixo com mt-auto) */}
          <div className="mt-auto pt-1">
            {esgotado ? (
              <Badge
                variant="muted"
                className="w-full justify-center py-2 text-sm"
              >
                Indisponível
              </Badge>
            ) : (
              <Button size="sm" className="w-full" onClick={abrir}>
                <SlidersHorizontal className="h-4 w-4" />
                Escolher
              </Button>
            )}
          </div>
        </div>
      </motion.article>

      {!esgotado && (
        <ProductModal produto={produto} aberto={aberto} onOpenChange={setAberto} />
      )}
    </>
  );
}
