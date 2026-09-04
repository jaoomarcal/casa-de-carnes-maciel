import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn() = junta classes do Tailwind com segurança.
 * Ex.: cn("p-2", condicao && "bg-carne", props.className)
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Formata número para Real: 48.5 -> "R$ 48,50" */
export function formatBRL(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(valor || 0));
}

/** Rótulo amigável de peso: 100 -> "100g", 1000 -> "1kg" */
export function formatPeso(gramas) {
  return gramas >= 1000 ? `${gramas / 1000}kg` : `${gramas}g`;
}

/**
 * Normaliza texto pra busca: minúsculas e sem acento ("Moída" -> "moida").
 * Sem isso, digitar "moida" no celular (sem acento, comum) não acha "Moída".
 */
const DIACRITICOS = new RegExp("[\\u0300-\\u036f]", "g");

export function normalizarBusca(texto) {
  return texto.normalize("NFD").replace(DIACRITICOS, "").toLowerCase();
}
