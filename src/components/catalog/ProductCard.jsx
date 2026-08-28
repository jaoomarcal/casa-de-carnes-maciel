import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { cn, formatBRL } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WeightSelector } from "@/components/catalog/WeightSelector";
import { useCart } from "@/context/CartContext";

/**
 * Card de um produto do catálogo.
 *
 * Regras de UI pedidas:
 *  - hover suave: hover:scale-105 + sombra maior
 *  - esgotado (produto.esgotado === true):
 *      imagem em grayscale + opacidade reduzida
 *      botão "Adicionar" some e entra a badge "Indisponível"
 *  - oferta: mostra preço antigo riscado + preço novo
 *  - preço no formato "R$ 48,50 / kg"
 */
export function ProductCard({ produto }) {
  const { adicionar } = useCart();
  const [gramas, setGramas] = useState(500);

  const esgotado = produto.esgotado;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-background shadow-soft",
        "transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-card",
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

        {/* Seleção de peso + ação (empurrados para baixo com mt-auto) */}
        <div className="mt-auto space-y-2 pt-1">
          <WeightSelector value={gramas} onChange={setGramas} disabled={esgotado} />

          {esgotado ? (
            <Badge
              variant="muted"
              className="w-full justify-center py-2 text-sm"
            >
              Indisponível
            </Badge>
          ) : (
            <Button
              size="sm"
              className="w-full"
              onClick={() => adicionar(produto, gramas)}
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
