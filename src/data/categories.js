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
