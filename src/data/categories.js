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

// Opções de peso que o cliente escolhe (em gramas)
export const PESOS = [
  { gramas: 100, label: "100g" },
  { gramas: 500, label: "500g" },
  { gramas: 1000, label: "1kg" },
];

// Peso mínimo que o cliente pode digitar no campo de peso exato (em gramas)
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
