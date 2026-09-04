// Ordem e rótulos das categorias exibidas na home.
// O "slug" precisa ser IGUAL ao valor salvo na coluna "categoria" do banco.
// O emoji no fim do nome é só visual (barra de categorias, seções e painel),
// ajuda a bater o olho e identificar a categoria mais rápido.
export const CATEGORIAS = [
  { slug: "ofertas", nome: "Ofertas do Dia 🔥" },
  { slug: "bovinos", nome: "Bovinos 🐂" },
  { slug: "suinos", nome: "Suínos 🐷" },
  { slug: "aves", nome: "Aves 🐔" },
  { slug: "peixes", nome: "Peixes 🐟" },
  { slug: "linguica", nome: "Embutidos 🌭" },
  { slug: "temperados", nome: "Temperados 🧂" },
  { slug: "mercearia", nome: "Mercearia 🛒" },
  { slug: "diversos", nome: "Diversos 🧺" },
  { slug: "bebidas", nome: "Bebidas 🥤" },
];

// Peso mínimo que o cliente pode digitar no campo de peso (em gramas)
export const PESO_MINIMO = 100;

/**
 * Como o produto é vendido:
 *  - "kg": preço por quilo, o cliente escolhe o peso em gramas (padrão do açougue)
 *  - "un": preço por unidade, o cliente escolhe a quantidade (bebidas, mercearia,
 *          bandejas, congelados embalados — nada de peso)
 * No banco, a coluna "unidade" guarda esse valor e "preco_kg" passa a significar
 * "preço por unidade" quando unidade = "un".
 */
export function rotuloUnidade(unidade) {
  return unidade === "un" ? "un" : "kg";
}

// Tipos de corte que o açougueiro pode fazer. O "valor" é o que fica salvo
// no array "cortes" do produto (banco); o "label" é o que aparece na tela.
export const CORTES = [
  { valor: "bife", label: "Bife" },
  { valor: "manta", label: "Manta" },
  { valor: "cubos", label: "Cubos" },
  { valor: "moida", label: "Moída" },
  { valor: "peca-inteira", label: "Peça inteira" },
];

/** Rótulo amigável de um corte a partir do valor salvo ("cubos" -> "Cubos") */
export function rotuloCorte(valor) {
  return CORTES.find((c) => c.valor === valor)?.label || valor;
}
