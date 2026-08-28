// Ordem e rótulos das categorias exibidas na home.
// O "slug" precisa ser IGUAL ao valor salvo na coluna "categoria" do banco.
export const CATEGORIAS = [
  { slug: "ofertas", nome: "Ofertas do Dia", emoji: "🔥" },
  { slug: "bovinos", nome: "Bovinos", emoji: "🐂" },
  { slug: "suinos", nome: "Suínos", emoji: "🐖" },
  { slug: "aves", nome: "Aves", emoji: "🐔" },
  { slug: "linguica", nome: "Linguiça", emoji: "🌭" },
  { slug: "temperados", nome: "Temperados", emoji: "🧂" },
];

// Peso mínimo que o cliente pode digitar no campo de peso (em gramas)
export const PESO_MINIMO = 100;

// Tipos de corte que o açougueiro pode fazer. O "valor" é o que fica salvo
// no array "cortes" do produto (banco); o "label" é o que aparece na tela.
export const CORTES = [
  { valor: "bife", label: "Bife" },
  { valor: "manta", label: "Manta" },
  { valor: "cubos", label: "Cubos" },
  { valor: "moida", label: "Moída" },
];

/** Rótulo amigável de um corte a partir do valor salvo ("cubos" -> "Cubos") */
export function rotuloCorte(valor) {
  return CORTES.find((c) => c.valor === valor)?.label || valor;
}
