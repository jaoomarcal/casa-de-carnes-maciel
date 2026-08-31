import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Barra fixa de atalhos para as categorias. Fica "grudada" no topo ao rolar,
 * destaca a seção visível (scrollspy) e centraliza o chip ativo no mobile.
 * `categorias` = lista de { slug, nome } que TÊM produtos.
 */
export function CategoryNav({ categorias }) {
  const [ativo, setAtivo] = useState(categorias[0]?.slug ?? null);
  const chipsRef = useRef({});

  useEffect(() => {
    const secoes = categorias
      .map((c) => document.getElementById(c.slug))
      .filter(Boolean);
    if (!secoes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visivel = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0];
        if (visivel) setAtivo(visivel.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    secoes.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [categorias]);

  // Mantém o chip ativo à vista dentro da barra rolável
  useEffect(() => {
    chipsRef.current[ativo]?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [ativo]);

  if (categorias.length < 2) return null;

  return (
    <nav className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="no-scrollbar mx-auto flex max-w-2xl gap-2 overflow-x-auto px-4 py-2.5 lg:max-w-5xl">
        {categorias.map((c) => (
          <a
            key={c.slug}
            href={`#${c.slug}`}
            ref={(el) => (chipsRef.current[c.slug] = el)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              ativo === c.slug
                ? "border-carne bg-carne text-white"
                : "border-border bg-background text-foreground/70 hover:border-carne/50 hover:text-carne"
            )}
          >
            {c.nome}
          </a>
        ))}
      </div>
    </nav>
  );
}
