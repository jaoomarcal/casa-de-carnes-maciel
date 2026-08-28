import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, LogOut, Plus, Pencil, Trash2 } from "lucide-react";

import { formatBRL } from "@/lib/utils";
import { urlImagemProduto } from "@/lib/supabase";
import { CATEGORIAS } from "@/data/categories";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/* --------------------------- Tela de login --------------------------- */
function Login({ onEntrar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setCarregando(true);
    try {
      await onEntrar(email, senha);
    } catch (err) {
      toast.error("Login inválido", { description: err.message });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-muted px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-background p-6 shadow-card"
      >
        <img src="/assets/logo-maciel.png" alt="" className="mx-auto w-24" />
        <h1 className="text-center font-display text-lg">Área restrita</h1>
        <input
          type="email"
          required
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-input px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="password"
          required
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full rounded-lg border border-input px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <Button type="submit" className="w-full" disabled={carregando}>
          {carregando ? "Entrando..." : "Entrar"}
        </Button>
        <Link
          to="/"
          className="block text-center text-xs text-muted-foreground hover:text-carne"
        >
          ← Voltar para a loja
        </Link>
      </form>
    </div>
  );
}

/* --------------------------- Formulário de produto --------------------------- */
const VAZIO = {
  nome: "",
  descricao: "",
  categoria: "bovinos",
  preco_kg: "",
  preco_oferta_kg: "",
  em_oferta: false,
  esgotado: false,
  imagem_url: "",
  ordem: 0,
};

function ProdutoForm({ inicial, onSalvar, onCancelar, uploadFoto }) {
  const [form, setForm] = useState(inicial || VAZIO);
  const [enviando, setEnviando] = useState(false);

  const set = (campo) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [campo]: v }));
  };

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const path = await uploadFoto(file);
      setForm((f) => ({ ...f, imagem_url: path }));
      toast.success("Foto enviada");
    } catch (err) {
      toast.error("Falha no upload", { description: err.message });
    }
  }

  async function submit(e) {
    e.preventDefault();
    setEnviando(true);
    const ok = await onSalvar(form);
    setEnviando(false);
    if (ok) onCancelar();
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-3 rounded-xl border border-border bg-background p-4"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          Nome
          <input
            required
            value={form.nome}
            onChange={set("nome")}
            className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm">
          Categoria
          <select
            value={form.categoria}
            onChange={set("categoria")}
            className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
          >
            {CATEGORIAS.filter((c) => c.slug !== "ofertas").map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Preço por kg (R$)
          <input
            required
            type="number"
            step="0.01"
            value={form.preco_kg}
            onChange={set("preco_kg")}
            className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm">
          Preço de oferta por kg (opcional)
          <input
            type="number"
            step="0.01"
            value={form.preco_oferta_kg ?? ""}
            onChange={set("preco_oferta_kg")}
            className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="block text-sm">
        Descrição
        <textarea
          rows={2}
          value={form.descricao ?? ""}
          onChange={set("descricao")}
          className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
        />
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.em_oferta}
            onChange={set("em_oferta")}
          />
          É oferta do dia
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.esgotado}
            onChange={set("esgotado")}
          />
          Esgotado
        </label>
        <label className="text-sm">
          Ordem
          <input
            type="number"
            value={form.ordem}
            onChange={set("ordem")}
            className="ml-2 w-16 rounded-lg border border-input px-2 py-1 text-sm"
          />
        </label>
      </div>

      <div className="flex items-center gap-3">
        {form.imagem_url && (
          <img
            src={urlImagemProduto(form.imagem_url)}
            alt=""
            className="h-16 w-16 rounded-lg object-cover"
          />
        )}
        <input type="file" accept="image/*" onChange={onFile} className="text-sm" />
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" disabled={enviando}>
          {enviando ? "Salvando..." : "Salvar"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

/* --------------------------- Painel --------------------------- */
export default function Admin() {
  const { user, loading: authLoading, entrar, sair } = useAuth();
  const { produtos, loading, uploadFoto, salvar, remover, toggle } = useAdmin();
  const [editando, setEditando] = useState(null); // objeto | "novo" | null

  if (authLoading) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Skeleton className="h-40 w-80" />
      </div>
    );
  }

  if (!user) return <Login onEntrar={entrar} />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <header className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-carne"
        >
          <ArrowLeft className="h-4 w-4" /> Loja
        </Link>
        <h1 className="font-display text-lg">Painel</h1>
        <Button variant="ghost" size="sm" onClick={sair}>
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </header>

      <div className="my-4">
        {editando ? (
          <ProdutoForm
            inicial={editando === "novo" ? null : editando}
            onSalvar={salvar}
            onCancelar={() => setEditando(null)}
            uploadFoto={uploadFoto}
          />
        ) : (
          <Button onClick={() => setEditando("novo")}>
            <Plus className="h-4 w-4" /> Novo produto
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border">
          {produtos.map((p) => (
            <li
              key={p.id}
              className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:gap-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={urlImagemProduto(p.imagem_url) || "/assets/carnes-og.png"}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.categoria} · {formatBRL(p.preco_kg)}/kg
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:ml-auto">
                {/* Toggle rápido: oferta */}
                <TogglePill
                  ativo={p.em_oferta}
                  onClick={() => toggle(p.id, "em_oferta", p.em_oferta)}
                  label="Oferta"
                />
                {/* Toggle rápido: estoque */}
                <TogglePill
                  ativo={!p.esgotado}
                  onClick={() => toggle(p.id, "esgotado", p.esgotado)}
                  label={p.esgotado ? "Esgotado" : "Em estoque"}
                />

                <button
                  onClick={() => setEditando(p)}
                  className="ml-auto rounded-md p-1.5 hover:bg-muted sm:ml-0"
                  aria-label="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Excluir "${p.nome}"?`)) remover(p.id);
                  }}
                  className="rounded-md p-1.5 text-carne hover:bg-carne/10"
                  aria-label="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TogglePill({ ativo, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
        ativo ? "bg-carne text-white" : "bg-muted text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}
