import { useCallback, useEffect, useState } from "react";
import { supabase, urlImagemProduto } from "@/lib/supabase";
import { CORTE_PECA_INTEIRA } from "@/data/categories";

/** Normaliza o registro do banco para o formato que a UI usa */
function normalizar(row) {
  // "Em promoção" = só o checkbox "É oferta do dia" (em_oferta). Basta ele
  // pra o produto entrar na vitrine "Promoção" e ganhar o selo, mesmo sem
  // preço promocional. Quando também há preço de oferta, aí sim o preço
  // normal aparece riscado (temDesconto).
  const emOferta = !!row.em_oferta;
  const temDesconto = emOferta && row.preco_oferta_kg != null;
  const cortes = Array.isArray(row.cortes) ? row.cortes : [];
  // "Peça inteira" é sempre vendida por quilo (o preço por unidade não faz
  // sentido com peso variável). Cai aqui pra qualquer cadastro que ainda
  // não foi resalvo no painel com unidade="kg".
  const vendePorPeca = cortes.includes(CORTE_PECA_INTEIRA);
  const pesoEstimadoG =
    row.peso_estimado_g != null ? Number(row.peso_estimado_g) : null;
  // "Unidade com peso estimado": vendido por unidade (o cliente escolhe quantas),
  // mas o preço é por kg e o peso de cada unidade varia — então o site mostra um
  // valor estimado e a mensagem de peso, igual ao modo "peça inteira". Só vale
  // quando o dono preencheu o peso estimado no painel; sem ele, é preço fixo
  // por unidade (bebidas, mercearia).
  const unidadeComPeso =
    !vendePorPeca && row.unidade === "un" && pesoEstimadoG > 0;
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    categoria: row.categoria,
    unidade: vendePorPeca ? "kg" : row.unidade === "un" ? "un" : "kg",
    unidadeComPeso,
    precoKg: Number(row.preco_kg),
    precoOfertaKg: row.preco_oferta_kg != null ? Number(row.preco_oferta_kg) : null,
    precoAtualKg: temDesconto ? Number(row.preco_oferta_kg) : Number(row.preco_kg),
    emOferta,
    temDesconto,
    esgotado: row.esgotado,
    cortes,
    permiteTempero: !!row.permite_tempero,
    pesoEstimadoG,
    imagem: urlImagemProduto(row.imagem_url),
    ordem: row.ordem ?? 0,
  };
}

/**
 * Busca os produtos do Supabase.
 * Retorna { produtos, porCategoria, loading, erro, recarregar }.
 */
export function useProducts() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .order("ordem", { ascending: true })
      .order("nome", { ascending: true });

    if (error) {
      setErro(error.message);
      setProdutos([]);
    } else {
      setProdutos((data || []).map(normalizar));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Agrupa por categoria; "promocao" é uma vitrine virtual (em_oferta = true)
  const porCategoria = (slug) => {
    if (slug === "promocao") return produtos.filter((p) => p.emOferta);
    return produtos.filter((p) => p.categoria === slug);
  };

  return { produtos, porCategoria, loading, erro, recarregar: carregar };
}
