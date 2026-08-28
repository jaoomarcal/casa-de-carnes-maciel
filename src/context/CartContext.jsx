import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { toast } from "sonner";
import { subtotalItem, totalCarrinho } from "@/lib/whatsapp";

/**
 * Um item do carrinho:
 * { id, nome, precoKg, gramas, quantidade, imagem }
 * A "chave" de um item é id + gramas (mesmo produto em pesos diferentes = linhas diferentes).
 */

const CartContext = createContext(null);
const STORAGE_KEY = "maciel:carrinho";

function chave(id, gramas) {
  return `${id}__${gramas}`;
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { produto, gramas } = action;
      const k = chave(produto.id, gramas);
      const existente = state.find((i) => chave(i.id, i.gramas) === k);
      if (existente) {
        return state.map((i) =>
          chave(i.id, i.gramas) === k
            ? { ...i, quantidade: i.quantidade + 1 }
            : i
        );
      }
      return [
        ...state,
        {
          id: produto.id,
          nome: produto.nome,
          precoKg: produto.precoAtualKg, // já considera oferta
          gramas,
          quantidade: 1,
          imagem: produto.imagem,
        },
      ];
    }
    case "INC":
      return state.map((i) =>
        chave(i.id, i.gramas) === action.k
          ? { ...i, quantidade: i.quantidade + 1 }
          : i
      );
    case "DEC":
      return state
        .map((i) =>
          chave(i.id, i.gramas) === action.k
            ? { ...i, quantidade: i.quantidade - 1 }
            : i
        )
        .filter((i) => i.quantidade > 0);
    case "REMOVE":
      return state.filter((i) => chave(i.id, i.gramas) !== action.k);
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
      adicionar: (produto, gramas) => {
        dispatch({ type: "ADD", produto, gramas });
        toast.success("Item adicionado ao carrinho", {
          description: `${produto.nome} · ${gramas >= 1000 ? gramas / 1000 + "kg" : gramas + "g"}`,
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
