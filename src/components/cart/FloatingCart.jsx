import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";

import { formatBRL } from "@/lib/utils";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCart } from "@/context/CartContext";

/**
 * Botão flutuante (FAB) com ícone 3D do cutelo + gaveta lateral do carrinho.
 *
 * Regras pedidas:
 *  - o FAB só aparece quando há itens (itens.length > 0), com entrada animada (Framer Motion)
 *  - badge vermelho com a quantidade total de itens
 *  - ao clicar, abre um Drawer deslizando da DIREITA (estilo iFood), não um modal central
 *
 * Usamos o Dialog do Radix (acessível: foco preso, ESC fecha, trava o scroll)
 * com `forceMount` para o Framer Motion controlar entrada e saída.
 */
export function FloatingCart() {
  const { itens, quantidadeTotal, total } = useCart();
  const [aberto, setAberto] = useState(false);
  const temItens = itens.length > 0;

  return (
    <Dialog.Root open={aberto} onOpenChange={setAberto}>
      {/* ---------- FAB ---------- */}
      <AnimatePresence>
        {temItens && !aberto && (
          <motion.div
            key="fab"
            initial={{ opacity: 0, y: 80, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-5 right-5 z-40"
          >
            <Dialog.Trigger asChild>
              <motion.button
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05, rotate: -3 }}
                className="relative grid h-16 w-16 place-items-center rounded-full bg-carvao shadow-glass ring-1 ring-white/10"
                aria-label={`Abrir carrinho, ${quantidadeTotal} itens`}
              >
                <img
                  src="/assets/cutelo-3d.png"
                  alt=""
                  className="h-12 w-12 object-contain drop-shadow-lg"
                />

                {/* Badge de quantidade */}
                <motion.span
                  key={quantidadeTotal}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-carne px-1 text-xs font-bold text-white ring-2 ring-carvao"
                >
                  {quantidadeTotal}
                </motion.span>

                {/* Total (aparece em telas maiores) */}
                <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-carvao px-3 py-1.5 text-xs font-semibold text-white shadow-glass sm:block">
                  {formatBRL(total)}
                </span>
              </motion.button>
            </Dialog.Trigger>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- Drawer ---------- */}
      <AnimatePresence>
        {aberto && (
          <Dialog.Portal forceMount>
            {/* Fundo escuro translúcido */}
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-carvao/40 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            {/* Gaveta deslizando da direita */}
            <Dialog.Content asChild forceMount>
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 32 }}
                className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-glass focus:outline-none"
              >
                <CartDrawer onClose={() => setAberto(false)} />
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
