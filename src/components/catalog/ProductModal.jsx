import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";

import { cn, formatBRL, formatPeso } from "@/lib/utils";
import { CORTES, PESO_MINIMO } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { WeightSelector } from "@/components/catalog/WeightSelector";
import { useCart } from "@/context/CartContext";

/**
 * Modal de detalhe do produto: o cliente escolhe peso (atalho ou exato),
 * o corte (quando o produto recebe corte) e se vai temperada (quando
 * o produto permite tempero), e então adiciona ao carrinho.
 */
export function ProductModal({ produto, aberto, onOpenChange }) {
  const { adicionar } = useCart();

  const cortesDisponiveis = CORTES.filter((c) =>
    (produto.cortes || []).includes(c.valor)
  );

  const [gramas, setGramas] = useState(500);
  const [corte, setCorte] = useState(cortesDisponiveis[0]?.valor || null);
  const [temperada, setTemperada] = useState(false);

  // Zera as escolhas toda vez que o modal reabre
  useEffect(() => {
    if (aberto) {
      setGramas(500);
      setCorte(cortesDisponiveis[0]?.valor || null);
      setTemperada(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto, produto.id]);

  const pesoValido = Number.isFinite(gramas) && gramas >= PESO_MINIMO;
  const precoEstimado = pesoValido
    ? produto.precoAtualKg * (gramas / 1000)
    : 0;

  function confirmar() {
    if (!pesoValido) return;
    adicionar(produto, { gramas, corte, temperada });
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={aberto} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {aberto && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-carvao/50 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
            <Dialog.Content asChild forceMount>
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.97 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="pointer-events-auto relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-background shadow-glass focus:outline-none"
              >
                <button
                  onClick={() => onOpenChange(false)}
                  className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-2 text-muted-foreground transition hover:bg-muted"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="min-h-0 flex-1 overflow-y-auto">
                  {/* Imagem — object-contain para mostrar a peça inteira sem cortar/esticar */}
                  <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-muted">
                    <img
                      src={produto.imagem || "/assets/carnes-og.png"}
                      alt={produto.nome}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <Dialog.Title className="font-display text-xl tracking-tight">
                        {produto.nome}
                      </Dialog.Title>
                      <div className="mt-1 flex items-baseline gap-1.5">
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
                      {produto.descricao && (
                        <Dialog.Description className="mt-2 text-sm text-muted-foreground">
                          {produto.descricao}
                        </Dialog.Description>
                      )}
                    </div>

                    {/* Peso */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Quanto você quer?</p>
                      <WeightSelector value={gramas} onChange={setGramas} />
                      {!pesoValido && (
                        <p className="text-xs text-carne">
                          Informe um peso de pelo menos {PESO_MINIMO}g.
                        </p>
                      )}
                    </div>

                    {/* Corte */}
                    {cortesDisponiveis.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Tipo de corte</p>
                        <div className="flex flex-wrap gap-1.5">
                          {cortesDisponiveis.map((c) => (
                            <button
                              key={c.valor}
                              type="button"
                              onClick={() => setCorte(c.valor)}
                              className={cn(
                                "rounded-md border px-3 py-2 text-xs font-semibold transition-colors",
                                corte === c.valor
                                  ? "border-carne bg-carne text-white"
                                  : "border-border bg-background text-muted-foreground hover:border-carne/50"
                              )}
                            >
                              {c.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tempero */}
                    {produto.permiteTempero && (
                      <label className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={temperada}
                          onChange={(e) => setTemperada(e.target.checked)}
                        />
                        Vai temperada?
                      </label>
                    )}
                  </div>
                </div>

                {/* Rodapé */}
                <div className="border-t border-border bg-background p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {pesoValido ? formatPeso(gramas) : "—"} estimado
                    </span>
                    <span className="font-display text-lg">
                      {formatBRL(precoEstimado)}
                    </span>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    disabled={!pesoValido}
                    onClick={confirmar}
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar ao carrinho
                  </Button>
                </div>
              </motion.div>
            </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
