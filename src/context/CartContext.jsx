import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { toast } from "sonner";
import { subtotalItem, totalCarrinho } from "@/lib/whatsapp";
import { rotuloCorte } from "@/data/categories";

/**
 * Um item do carrinho:
 * { id, nome, precoKg, gramas, quantidade, imagem, corte, temperada }
 * A "chave" de um item é id + gramas + corte + temperada
 * (mesmo produto com opções diferentes = linhas diferentes).
 */

const CartContext = createContext(null);
const STORAGE_KEY = "maciel:carrinho";

function chave(id, gramas, corte, temperada) {
  return `${id}__${gramas}__${corte || ""}__${temperada ? "t" : "f"}`;
}

function chaveItem(i) {
  return chave(i.id, i.gramas, i.corte, i.temperada);
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const {
        produto,
        gramas = null,
        corte = null,
        temperada = false,
        quantidade = 1,
      } = action;
      const k = chave(produto.id, gramas, corte, temperada);
      const existente = state.find((i) => chaveItem(i) === k);
      if (existente) {
        return state.map((i) =>
          chaveItem(i) === k
            ? { ...i, quantidade: i.quantidade + quantidade }
            : i
        );
      }
      return [
        ...state,
        {
          id: produto.id,
          nome: produto.nome,
          precoKg: produto.precoAtualKg, // já considera oferta
          unidade: produto.unidade === "un" ? "un" : "kg",
          gramas,
          quantidade,
          imagem: produto.imagem,
          corte,
          temperada,
        },
      ];
    }
    case "INC":
      return state.map((i) =>
        chaveItem(i) === action.k ? { ...i, quantidade: i.quantidade + 1 } : i
      );
    case "DEC":
      return state
        .map((i) =>
          chaveItem(i) === action.k
            ? { ...i, quantidade: i.quantidade - 1 }
            : i
        )
        .filter((i) => i.quantidade > 0);
    case "REMOVE":
      return state.filter((i) => chaveItem(i) !== action.k);
    case "CLEAR":
      return [];
    case "HYDRATE":
      return action.payload;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [itens, dispatch] = useReducer(reducer, []);

  // Carrega do localStorage ao abrir o app
  useEffect(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(salvo) && salvo.length) {
        dispatch({ type: "HYDRATE", payload: salvo });
      }
    } catch {
      /* ignora carrinho corrompido */
    }
  }, []);

  // Salva no localStorage sempre que muda
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
  }, [itens]);

  const value = useMemo(() => {
    const quantidadeTotal = itens.reduce((acc, i) => acc + i.quantidade, 0);
    return {
      itens,
      quantidadeTotal,
      total: totalCarrinho(itens),
      subtotalItem,
      chave,
      chaveItem,
      adicionar: (
        produto,
        { gramas = null, corte = null, temperada = false, quantidade = 1 } = {}
      ) => {
        dispatch({ type: "ADD", produto, gramas, corte, temperada, quantidade });
        const medida =
          produto.unidade === "un"
            ? `${quantidade} un`
            : gramas >= 1000
              ? gramas / 1000 + "kg"
              : gramas + "g";
        const extras = [
          corte ? rotuloCorte(corte) : null,
          temperada ? "temperada" : null,
        ].filter(Boolean);
        toast.success("Item adicionado ao carrinho", {
          description:
            `${produto.nome} · ${medida}` +
            (extras.length ? ` · ${extras.join(" · ")}` : ""),
        });
      },
      incrementar: (k) => dispatch({ type: "INC", k }),
      decrementar: (k) => dispatch({ type: "DEC", k }),
      remover: (k) => dispatch({ type: "REMOVE", k }),
      limpar: () => dispatch({ type: "CLEAR" }),
    };
  }, [itens]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
