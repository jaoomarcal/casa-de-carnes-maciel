import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Store,
  Bike,
  X,
  ChevronDown,
} from "lucide-react";

import { cn, formatBRL, formatPeso } from "@/lib/utils";
import { rotuloCorte, CORTE_PECA_INTEIRA } from "@/data/categories";
import { enviarPedidoWhatsApp } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import {
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";

const CLIENTE_KEY = "maciel:cliente";

function lerCliente() {
  try {
    return JSON.parse(localStorage.getItem(CLIENTE_KEY) || "{}");
  } catch {
    return {};
  }
}

/**
 * Conteúdo interno da gaveta do carrinho. Tem duas etapas:
 *  - "carrinho": lista de itens
 *  - "dados": nome, retirada/entrega + endereço e forma de pagamento
 * `onClose` fecha o drawer (usado no botão "Continuar comprando").
 */
export function CartDrawer({ onClose }) {
  const {
    itens,
    total,
    subtotalItem,
    chaveItem,
    incrementar,
    decrementar,
    remover,
  } = useCart();

  const [etapa, setEtapa] = useState("carrinho");

  const salvo = lerCliente();
  const [nome, setNome] = useState(salvo.nome || "");
  const [entrega, setEntrega] = useState(salvo.entrega || "retirada");
  const [endereco, setEndereco] = useState(salvo.endereco || "");
  const [pagamento, setPagamento] = useState(salvo.pagamento || "pix");
  const [trocoPara, setTrocoPara] = useState(salvo.trocoPara || "");

  const vazio = itens.length === 0;
  const precisaEndereco = entrega === "entrega";
  const faltando = [
    nome.trim().length <= 1 ? "nome" : null,
    precisaEndereco && endereco.trim().length <= 4 ? "endereço" : null,
  ].filter(Boolean);
  const podeEnviar = faltando.length === 0;

  function finalizar() {
    const dados = {
      nome,
      entrega,
      endereco,
      pagamento,
      trocoPara: pagamento === "dinheiro" ? trocoPara : "",
    };
    try {
      localStorage.setItem(CLIENTE_KEY, JSON.stringify(dados));
    } catch {
      /* ignora se o navegador bloquear o storage */
    }
    enviarPedidoWhatsApp(itens, dados);
  }

  const naEtapaDados = etapa === "dados" && !vazio;

  return (
    <>
      <button
        onClick={onClose}
        className="absolute right-3 top-3 z-10 rounded-full p-2 text-muted-foreground transition hover:bg-muted"
        aria-label="Fechar carrinho"
      >
        <X className="h-5 w-5" />
      </button>

      <SheetHeader className="pr-14">
        <div className="flex items-center gap-2">
          {naEtapaDados && (
            <button
              onClick={() => setEtapa("carrinho")}
              className="rounded-md p-1 text-muted-foreground transition hover:bg-muted"
              aria-label="Voltar ao carrinho"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <SheetTitle className="flex items-center gap-2">
            {naEtapaDados ? (
              "Seus dados"
            ) : (
              <>
                <ShoppingBag className="h-5 w-5 text-carne" />
                Seu carrinho
              </>
            )}
          </SheetTitle>
        </div>
        <SheetDescription>
          {vazio
            ? "Ainda não há itens."
            : naEtapaDados
              ? "Para finalizar o pedido no WhatsApp."
              : `${itens.length} ${itens.length === 1 ? "item" : "itens"} selecionado${
                  itens.length === 1 ? "" : "s"
                }`}
        </SheetDescription>
      </SheetHeader>

      {/* Corpo */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {vazio ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
            <img
              src="/assets/acougueiro-3d.png"
              alt=""
              className="w-28 opacity-80"
            />
            <p className="text-sm">Adicione cortes para fechar seu pedido.</p>
          </div>
        ) : naEtapaDados ? (
          <>
            <ResumoPedido itens={itens} chaveItem={chaveItem} subtotalItem={subtotalItem} />
            <DadosCliente
              nome={nome}
              setNome={setNome}
              entrega={entrega}
              setEntrega={setEntrega}
              endereco={endereco}
              setEndereco={setEndereco}
              pagamento={pagamento}
              setPagamento={setPagamento}
              trocoPara={trocoPara}
              setTrocoPara={setTrocoPara}
            />
          </>
        ) : (
          <ul className="space-y-3">
            <AnimatePresence initial={false}>
              {itens.map((item) => {
                const k = chaveItem(item);
                return (
                  <motion.li
                    key={k}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-3 rounded-lg border border-border p-3"
                  >
                    <img
                      src={item.imagem || "/assets/carnes-og.png"}
                      alt={item.nome}
                      className="h-16 w-16 shrink-0 rounded-md object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-sm font-semibold">
                        {item.nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.unidade === "un"
                          ? `${formatBRL(item.precoKg)} / un`
                          : item.corte === CORTE_PECA_INTEIRA
                            ? `~${formatPeso(item.gramas)} estimado · ${formatBRL(item.precoKg)}/kg`
                            : `${formatPeso(item.gramas)} · ${formatBRL(item.precoKg)}/kg`}
                      </p>
                      {(item.corte || item.temperada) && (
                        <p className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-carne-dark">
                          {item.corte && (
                            <span>Corte: {rotuloCorte(item.corte)}</span>
                          )}
                          {item.temperada && <span>Temperada</span>}
                        </p>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        {/* Stepper de quantidade */}
                        <div className="flex items-center rounded-md border border-border">
                          <button
                            onClick={() => decrementar(k)}
                            className="grid h-11 w-11 place-items-center text-sm hover:bg-muted"
                            aria-label="Diminuir"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">
                            {item.quantidade}
                          </span>
                          <button
                            onClick={() => incrementar(k)}
                            className="grid h-11 w-11 place-items-center text-sm hover:bg-muted"
                            aria-label="Aumentar"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm font-bold text-carne">
                          {formatBRL(subtotalItem(item))}
                        </span>
                      </div>
                    </div>

                    {/* Excluir rápido */}
                    <button
                      onClick={() => remover(k)}
                      className="self-start rounded-md p-1.5 text-muted-foreground transition hover:bg-carne/10 hover:text-carne"
                      aria-label={`Remover ${item.nome}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {/* Aviso obrigatório + totais + ações */}
      {!vazio && (
        <SheetFooter>
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-muted-foreground">Total estimado</span>
            <span className="font-display text-xl">{formatBRL(total)}</span>
          </div>

          {naEtapaDados ? (
            <>
              {!podeEnviar && (
                <p className="text-center text-xs text-carne">
                  Falta preencher: {faltando.join(" e ")}.
                </p>
              )}
              <Button
                variant="whatsapp"
                size="lg"
                className="w-full"
                disabled={!podeEnviar}
                onClick={finalizar}
              >
                Enviar pedido no WhatsApp
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setEtapa("carrinho")}
              >
                Voltar ao carrinho
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="whatsapp"
                size="lg"
                className="w-full"
                onClick={() => setEtapa("dados")}
              >
                Continuar para os dados
              </Button>
              <Button variant="outline" className="w-full" onClick={onClose}>
                Continuar comprando
              </Button>
            </>
          )}
        </SheetFooter>
      )}
    </>
  );
}

/**
 * Resumo compacto e recolhível do pedido, mostrado durante a etapa "dados"
 * — sem ele o cliente perde de vista o que está prestes a mandar pro
 * WhatsApp (o momento de maior risco do fluxo: pedido errado sem querer).
 */
function ResumoPedido({ itens, chaveItem, subtotalItem }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="mb-4 rounded-lg border border-border">
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        className="flex w-full items-center justify-between gap-2 p-3 text-left text-sm"
      >
        <span className="font-medium">
          {itens.length} {itens.length === 1 ? "item" : "itens"} no pedido
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          {aberto ? "ocultar" : "ver detalhes"}
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", aberto && "rotate-180")}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {aberto && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border"
          >
            <ul className="space-y-1.5 p-3 pt-2 text-sm">
              {itens.map((item) => {
                const extras = [
                  item.corte ? rotuloCorte(item.corte) : null,
                  item.temperada ? "Temperada" : null,
                ]
                  .filter(Boolean)
                  .join(" · ");
                const medida =
                  item.unidade === "un" ? "" : ` — ${formatPeso(item.gramas)}`;
                return (
                  <li key={chaveItem(item)} className="flex justify-between gap-2">
                    <span className="text-muted-foreground">
                      {item.quantidade}x {item.nome}
                      {medida}
                      {extras && ` · ${extras}`}
                    </span>
                    <span className="shrink-0 font-medium">
                      {formatBRL(subtotalItem(item))}
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* --------------------------- Etapa "dados" --------------------------- */
const campoBase =
  "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function DadosCliente({
  nome,
  setNome,
  entrega,
  setEntrega,
  endereco,
  setEndereco,
  pagamento,
  setPagamento,
  trocoPara,
  setTrocoPara,
}) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">
        Nome
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Seu nome"
          className={campoBase}
        />
      </label>

      <div className="text-sm font-medium">
        Como quer receber?
        <div className="mt-1.5 grid grid-cols-2 gap-2">
          <OpcaoGrande
            ativo={entrega === "retirada"}
            onClick={() => setEntrega("retirada")}
            icone={<Store className="h-4 w-4" />}
            label="Retirar na loja"
          />
          <OpcaoGrande
            ativo={entrega === "entrega"}
            onClick={() => setEntrega("entrega")}
            icone={<Bike className="h-4 w-4" />}
            label="Entrega"
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {entrega === "entrega" && (
          <motion.label
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="block overflow-hidden text-sm font-medium"
          >
            Endereço de entrega
            <textarea
              rows={2}
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, número, bairro e ponto de referência"
              className={campoBase}
            />
          </motion.label>
        )}
      </AnimatePresence>

      <div className="text-sm font-medium">
        Forma de pagamento
        <div className="mt-1.5 flex gap-1.5">
          {[
            ["pix", "PIX"],
            ["dinheiro", "Dinheiro"],
            ["cartao", "Cartão"],
          ].map(([valor, rotulo]) => (
            <button
              key={valor}
              type="button"
              aria-pressed={pagamento === valor}
              onClick={() => setPagamento(valor)}
              className={cn(
                "flex-1 rounded-md border px-2 py-2 text-xs font-semibold transition-colors",
                pagamento === valor
                  ? "border-carne bg-carne text-white"
                  : "border-border bg-background text-muted-foreground hover:border-carne/50"
              )}
            >
              {rotulo}
            </button>
          ))}
        </div>
      </div>

      {/* Troco — card à parte, só quando o pagamento é em dinheiro */}
      <AnimatePresence initial={false}>
        {pagamento === "dinheiro" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <label className="block text-sm font-medium">
                Precisa de troco?
                <input
                  value={trocoPara}
                  onChange={(e) => setTrocoPara(e.target.value)}
                  placeholder="Troco para quanto? (ex.: R$ 100)"
                  className={campoBase}
                />
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tempo estimado — texto muda conforme retirada ou entrega */}
      <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
        <span className="font-medium">
          {entrega === "entrega" ? "Tempo estimado de entrega:" : "Tempo estimado de preparo:"}
        </span>{" "}
        <span className="text-muted-foreground">trinta minutos</span>
      </div>

      <p className="text-xs text-muted-foreground">
        O pedido é combinado e confirmado pelo WhatsApp da loja.
      </p>
    </div>
  );
}

function OpcaoGrande({ ativo, onClick, icone, label }) {
  return (
    <button
      type="button"
      aria-pressed={ativo}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors",
        ativo
          ? "border-carne bg-carne text-white"
          : "border-border bg-background text-muted-foreground hover:border-carne/50"
      )}
    >
      {icone}
      {label}
    </button>
  );
}
