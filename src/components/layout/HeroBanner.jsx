import { motion } from "framer-motion";

/**
 * Hero: logo (fundo transparente) sobre a foto do açougueiro
 * (public/assets/hero-acougueiro.jpg), com um facho de luz quente e um
 * escurecimento que garantem contraste do texto em qualquer tela.
 */
export function HeroBanner() {
  return (
    <header className="relative isolate flex min-h-[20rem] flex-col justify-center overflow-hidden bg-madeira-escura sm:min-h-[22rem]">
      {/* foto de fundo */}
      <img
        src="/assets/hero-acougueiro.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* facho de luz quente atrás da logo */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 50% 32%, rgba(255,196,120,0.30), rgba(255,196,120,0) 70%)",
        }}
      />
      {/* escurecimento: contraste do texto + emenda com o restante da página */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-carvao"
        aria-hidden
      />

      {/* Conteúdo */}
      <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center px-4 pb-16 pt-14 text-center">
        {/* A logo já mostra o nome visualmente; este h1 dá à página um
            título real para leitor de tela e SEO (antes só existia via alt). */}
        <h1 className="sr-only">Casa de Carnes Maciel</h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative"
        >
          {/* brilho suave sob a logo */}
          <div
            className="absolute left-1/2 top-1/2 -z-10 h-[115%] w-[115%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{ background: "radial-gradient(circle, rgba(0,0,0,0.45), transparent 70%)" }}
            aria-hidden
          />
          <img
            src="/assets/logo-maciel.png"
            alt="Casa de Carnes Maciel"
            className="w-56 drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)] sm:w-72"
          />
        </motion.div>

        <motion.a
          href="https://www.google.com/maps/search/?api=1&query=Rua+Jo%C3%A3o+Pacheco+de+Lima+54-84+Centro"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-10 max-w-sm text-sm font-medium text-white/90 underline decoration-white/40 underline-offset-4 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] transition hover:text-white hover:decoration-white/80"
        >
          Rua João Pacheco de Lima 54-84 Centro.
        </motion.a>
      </div>
    </header>
  );
}
