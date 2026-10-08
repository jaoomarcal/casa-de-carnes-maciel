import { createContext, useContext } from "react";
import { useLojaAberta } from "@/hooks/useLojaAberta";

/**
 * Status da loja compartilhado pelo site inteiro. O catálogo fica aberto
 * 24h para consulta; `podeComprar` diz se dá pra montar/enviar pedido agora
 * (só Seg a Sáb, 8h-18h). Um único relógio para todos os cards, em vez de
 * cada componente chamar useLojaAberta por conta própria.
 */
const LojaContext = createContext(null);

export function LojaProvider({ children }) {
  const { status, mensagem } = useLojaAberta();
  const valor = { status, mensagem, podeComprar: status === "aberto" };
  return <LojaContext.Provider value={valor}>{children}</LojaContext.Provider>;
}

export function useLoja() {
  const ctx = useContext(LojaContext);
  if (!ctx) throw new Error("useLoja precisa estar dentro de <LojaProvider>");
  return ctx;
}
