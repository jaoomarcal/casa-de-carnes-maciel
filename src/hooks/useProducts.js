import { useCallback, useEffect, useState } from "react";
import { supabase, urlImagemProduto } from "@/lib/supabase";
import { CORTE_PECA_INTEIRA } from "@/data/categories";

/** Normaliza o registro do banco para o formato que a UI usa */
function normalizar(row) {
  const emOferta = row.em_oferta && row.preco_oferta_kg != null;
  const cortes = Array.isArray(row.cortes) ? row.cortes : [];
  // "Peça inteira" é sempre vendida por quilo (o preço por unidade não faz
  // sentido com peso variável). Cai aqui pra qualquer cadastro que ainda
  // não foi resalvo no painel com unidade="kg".
  const vendePorPeca = cortes.includes(CORTE_PECA_INTEIRA);
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    categoria: row.categoria,
    unidade: vendePorPeca ? "kg" : row.unidade === "un" ? "un" : "kg",
    precoKg: Number(row.preco_kg),
    precoOfertaKg: row.preco_oferta_kg != null ? Number(row.preco_oferta_kg) : null,
    precoAtualKg: emOferta ? Number(row.preco_oferta_kg) : Number(row.preco_kg),
    emOferta,
    esgotado: row.esgotado,
    cortes,
    permiteTempero: !!row.permite_tempero,
    pesoEstimadoG: row.peso_estimado_g != null ? Number(row.peso_estimado_g) : null,
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

  // Agrupa por categoria; "ofertas" é uma vitrine virtual (em_oferta = true)
  const porCategoria = (slug) => {
    if (slug === "ofertas") return produtos.filter((p) => p.emOferta);
    return produtos.filter((p) => p.categoria === slug);
  };

  return { produtos, porCategoria, loading, erro, recarregar: carregar };
}
