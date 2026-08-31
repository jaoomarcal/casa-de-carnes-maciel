import { formatBRL, formatPeso } from "./utils";
import { rotuloCorte } from "@/data/categories";

const NUMERO = import.meta.env.VITE_WHATSAPP_NUMERO || "5517991316331";

/**
 * Preço de uma linha do carrinho.
 *  - "un": preço por unidade * quantidade
 *  - "kg": preço/kg * (gramas / 1000) * quantidade
 */
export function subtotalItem(item) {
  if (item.unidade === "un") return item.precoKg * item.quantidade;
  return item.precoKg * (item.gramas / 1000) * item.quantidade;
}

/** Soma de tudo que está no carrinho */
export function totalCarrinho(itens) {
  return itens.reduce((acc, item) => acc + subtotalItem(item), 0);
}

const ROTULO_PAGAMENTO = { pix: "PIX", dinheiro: "Dinheiro", cartao: "Cartão" };

/**
 * Transforma o carrinho + os dados do cliente numa mensagem bonita
 * e abre o WhatsApp.
 * `dados` = { nome, entrega: "retirada" | "entrega", endereco, pagamento }
 */
export function enviarPedidoWhatsApp(itens, dados = {}) {
  if (!itens.length) return;

  const linhas = itens.map((item) => {
    const preco = formatBRL(subtotalItem(item));
    const extras = [
      item.corte ? `Corte: ${rotuloCorte(item.corte)}` : null,
      item.temperada ? "Temperada" : null,
    ].filter(Boolean);
    const sufixo = extras.length ? ` · ${extras.join(" · ")}` : "";
    const medida =
      item.unidade === "un" ? "" : ` — ${formatPeso(item.gramas)}`;
    return `• *${item.quantidade}x* ${item.nome}${medida}${sufixo}\n   ${preco}`;
  });

  const entrega =
    dados.entrega === "entrega"
      ? `*Entrega no endereço:*\n${(dados.endereco || "").trim()}`
      : "*Retirada na loja*";

  const troco =
    dados.pagamento === "dinheiro" && (dados.trocoPara || "").trim()
      ? `*Troco para:* ${dados.trocoPara.trim()}`
      : null;

  const infoCliente = [
    dados.nome ? `*Cliente:* ${dados.nome.trim()}` : null,
    entrega,
    dados.pagamento
      ? `*Pagamento:* ${ROTULO_PAGAMENTO[dados.pagamento] || dados.pagamento}`
      : null,
    troco,
    "*Tempo estimado de entrega:* trinta minutos",
  ].filter(Boolean);

  const mensagem = [
    "🥩 *NOVO PEDIDO — CASA DE CARNES MACIEL*",
    "",
    ...linhas,
    "",
    "————————————————",
    `*Total estimado:* ${formatBRL(totalCarrinho(itens))}`,
    "",
    ...infoCliente,
  ].join("\n");

  const url = `https://wa.me/${NUMERO}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
