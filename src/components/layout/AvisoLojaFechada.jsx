import { Clock } from "lucide-react";

import { useLoja } from "@/context/LojaContext";

/**
 * Faixa fixa no topo (junto da busca) quando não dá pra fazer pedido online.
 * O catálogo continua navegável; a faixa explica por que não há botão de
 * compra e quando os pedidos voltam.
 */
export function AvisoLojaFechada() {
  const { status, mensagem, podeComprar } = useLoja();
  if (podeComprar) return null;

  return (
    <div role="status" className="bg-carvao text-white">
      <div className="mx-auto flex max-w-2xl items-start gap-2.5 px-4 py-2.5 text-sm lg:max-w-5xl">
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-carne-light" aria-hidden />
        <p>
          <span className="font-semibold">
            {status === "presencial" ? "Hoje é só presencial." : "Estamos fechados."}
          </span>{" "}
          <span className="text-white/80">
            Fique à vontade para consultar os produtos. {mensagem}
          </span>
        </p>
      </div>
    </div>
  );
}
