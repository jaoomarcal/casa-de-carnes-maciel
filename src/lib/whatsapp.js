import { formatBRL, formatPeso } from "./utils";
import { rotuloCorte, CORTE_PECA_INTEIRA } from "@/data/categories";

const NUMERO = import.meta.env.VITE_WHATSAPP_NUMERO || "5517991316331";

/**
 * Taxa de entrega fixa. Só entra na conta quando o pedido é "entrega" e
 * apenas na mensagem enviada ao WhatsApp — o site não soma esse valor em
 * lugar nenhum (o total exibido continua sendo só o dos produtos).
 */
export const TAXA_ENTREGA = 8;

/**
 * Preço de uma linha do carrinho.
 *  - "un" sem peso: preço por unidade * quantidade
 *  - "un" com peso estimado: preço/kg * (peso da unidade / 1000) * quantidade
 *  - "kg": preço/kg * (gramas / 1000) * quantidade
 */
export function subtotalItem(item) {
  if (item.unidade === "un") {
    if (item.gramas) {
      return item.precoKg * (item.gramas / 1000) * item.quantidade;
    }
    return item.precoKg * item.quantidade;
  }
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
    const extras = [
      item.corte ? `Corte: ${rotuloCorte(item.corte)}` : null,
      item.temperada ? "Temperada" : null,
    ].filter(Boolean);
    const sufixo = extras.length ? ` · ${extras.join(" · ")}` : "";
    const medida =
      item.unidade === "un"
        ? item.gramas
          ? ` — ~${formatPeso(item.gramas)}/un (peso a confirmar)`
          : ""
        : item.corte === CORTE_PECA_INTEIRA
          ? ` — ~${formatPeso(item.gramas)} (peso a confirmar)`
          : ` — ${formatPeso(item.gramas)}`;
    // Só mostra a quantidade quando ela importa (mais de 1); em pedidos por
    // peso (quantidade sempre 1) isso deixaria a linha poluída sem motivo.
    const qtd = item.quantidade > 1 ? ` — Qtd: ${item.quantidade}` : "";
    return `• ${item.nome}${medida}${sufixo}${qtd}`;
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
    dados.entrega === "entrega"
      ? "*Tempo estimado de entrega:* trinta minutos"
      : "*Tempo estimado de preparo:* trinta minutos",
  ].filter(Boolean);

  // O site não mostra mais preço nenhum (produto, subtotal ou total) — o
  // valor é combinado direto pelo WhatsApp. "Total estimado:" fica em
  // branco de propósito, pra o açougueiro preencher depois de pesar.
  const taxaEntrega = dados.entrega === "entrega" ? TAXA_ENTREGA : 0;
  const resumoValores = [
    ...(taxaEntrega ? [`*Taxa de entrega:* ${formatBRL(taxaEntrega)}`] : []),
    "*Total estimado:*",
  ];

  const mensagem = [
    "🥩 *NOVO PEDIDO — CASA DE CARNES MACIEL*",
    "",
    ...linhas,
    "",
    "————————————————",
    ...resumoValores,
    "",
    ...infoCliente,
  ].join("\n");

  const url = `https://wa.me/${NUMERO}?text=${encodeURIComponent(mensagem)}`;

  // No celular, abrir em nova aba (window.open) é o motivo clássico do
  // botão "falhar e voltar pro site": a aba em branco tenta repassar pro
  // app do WhatsApp e, se esse handoff travar (Safari iOS, navegadores
  // in-app, etc.), o usuário só vê a aba fechando sem nada acontecer.
  // Navegar na própria aba resolve. No desktop mantemos nova aba, que
  // funciona bem com o WhatsApp Web.
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = url;
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
