import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase, BUCKET_PRODUTOS } from "@/lib/supabase";

/**
 * Reduz e recomprime a foto no navegador antes do upload:
 * lado maior <= 1400px e JPEG de qualidade ~0.82. Assim uma foto de
 * 5 MB do celular vira ~200 KB e carrega rápido para o cliente final.
 * Se algo falhar (formato exótico, navegador antigo), devolve o arquivo original.
 */
async function comprimirImagem(file, maxLado = 1400, qualidade = 0.82) {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
    const escala = Math.min(1, maxLado / Math.max(bitmap.width, bitmap.height));
    const largura = Math.round(bitmap.width * escala);
    const altura = Math.round(bitmap.height * escala);

    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, largura, altura);
    bitmap.close?.();

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", qualidade)
    );
    if (!blob || blob.size >= file.size) return file; // não piorar

    const nome = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], nome, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

/**
 * CRUD de produtos para o painel. Só funciona logado E se o RLS
 * reconhecer o usuário como admin (senão o Supabase devolve erro de permissão).
 */
export function useAdmin() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregar = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .order("categoria")
      .order("nome");
    if (error) toast.error("Erro ao carregar", { description: error.message });
    setProdutos(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  /** Sobe uma foto para o Storage e devolve o "path" para salvar no banco */
  async function uploadFoto(file) {
    const arquivo = await comprimirImagem(file);
    const ext = arquivo.type === "image/jpeg" ? "jpg" : arquivo.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from(BUCKET_PRODUTOS)
      .upload(path, arquivo, {
        cacheControl: "3600",
        upsert: false,
        contentType: arquivo.type,
      });
    if (error) throw error;
    return path;
  }

  /** Remove uma foto do Storage; ignora falhas (o path pode ser uma URL externa) */
  async function apagarFoto(path) {
    if (!path || path.startsWith("http")) return;
    try {
      await supabase.storage.from(BUCKET_PRODUTOS).remove([path]);
    } catch {
      /* nao trava a operacao principal por causa da limpeza da foto */
    }
  }

  async function salvar(produto) {
    const payload = {
      nome: produto.nome,
      descricao: produto.descricao || null,
      categoria: produto.categoria,
      preco_kg: Number(produto.preco_kg),
      preco_oferta_kg: produto.preco_oferta_kg
        ? Number(produto.preco_oferta_kg)
        : null,
      em_oferta: !!produto.em_oferta,
      esgotado: !!produto.esgotado,
      imagem_url: produto.imagem_url || null,
      ordem: Number(produto.ordem) || 0,
    };

    const anterior = produto.id
      ? produtos.find((p) => p.id === produto.id)
      : null;

    const query = produto.id
      ? supabase.from("produtos").update(payload).eq("id", produto.id)
      : supabase.from("produtos").insert(payload);

    const { error } = await query;
    if (error) {
      toast.error("Não salvou", { description: error.message });
      return false;
    }
    // Trocou a foto? Apaga a antiga do Storage para não acumular lixo.
    if (anterior?.imagem_url && anterior.imagem_url !== payload.imagem_url) {
      await apagarFoto(anterior.imagem_url);
    }
    toast.success(produto.id ? "Produto atualizado" : "Produto criado");
    await carregar();
    return true;
  }

  async function remover(id) {
    const alvo = produtos.find((p) => p.id === id);
    const { error } = await supabase.from("produtos").delete().eq("id", id);
    if (error) return toast.error("Erro ao excluir", { description: error.message });
    await apagarFoto(alvo?.imagem_url);
    toast.success("Produto excluído");
    await carregar();
  }

  /** Toggle rápido de uma coluna booleana (esgotado / em_oferta) */
  async function toggle(id, coluna, valorAtual) {
    // atualização otimista
    setProdutos((lista) =>
      lista.map((p) => (p.id === id ? { ...p, [coluna]: !valorAtual } : p))
    );
    const { error } = await supabase
      .from("produtos")
      .update({ [coluna]: !valorAtual })
      .eq("id", id);
    if (error) {
      toast.error("Não atualizou", { description: error.message });
      carregar(); // desfaz
    }
  }

  return { produtos, loading, carregar, uploadFoto, salvar, remover, toggle };
}
