import { Link } from "react-router-dom";

/**
 * Rodapé. O link "•" quase invisível leva ao painel admin (/painel).
 * Não é segredo de segurança (a proteção real é o RLS + login),
 * é só para não poluir a interface do cliente.
 */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-muted/50 px-4 py-8 text-center text-sm text-muted-foreground">
      <p className="font-display text-base text-foreground">
        Casa de Carnes Maciel
      </p>
      <p className="mt-1">Seg a Sáb · 8h às 19h</p>
      <p className="mt-4 text-xs">
        © {new Date().getFullYear()} Casa de Carnes Maciel
        {" · "}
        <Link
          to="/painel"
          className="text-muted-foreground/40 transition-colors hover:text-carne"
          aria-label="Área restrita"
        >
          •
        </Link>
      </p>
    </footer>
  );
}
