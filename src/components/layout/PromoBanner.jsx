import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

/**
 * Banner de promoções em estilo Glassmorphism, logo abaixo do hero.
 * Rotaciona as ofertas a cada 4s. `ofertas` = lista de produtos em oferta.
 */
export function PromoBanner({ ofertas = [] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (ofertas.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % ofertas.length), 4000);
    return () => clearInterval(t);
  }, [ofertas.length]);

  if (!ofertas.length) return null;
  const atual = ofertas[i % ofertas.length];

  return (
    <div className="relative z-10 mx-auto -mt-8 max-w-2xl px-4">
      <a
        href="#ofertas"
        className="glass-dark flex items-center gap-3 rounded-2xl p-4 text-white transition-transform active:scale-[0.98]"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-carne">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wide text-white/70">
            Oferta do dia
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={atual.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="truncate font-semibold"
            >
              {atual.nome} — {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(atual.precoAtualKg)}{" "}
              / {atual.unidade === "un" ? "un" : "kg"}
            </motion.p>
          </AnimatePresence>
        </div>
      </a>
    </div>
  );
}
