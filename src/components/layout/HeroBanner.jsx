import { motion } from "framer-motion";

/**
 * Hero: logo (fundo transparente) sobre um banner de madeira real
 * (public/assets/wood-banner.jpg), com um facho de luz quente e um
 * escurecimento que garantem contraste do texto em qualquer tela.
 */
export function HeroBanner() {
  return (
    <header className="relative isolate flex min-h-[20rem] flex-col justify-center overflow-hidden bg-madeira-escura sm:min-h-[22rem]">
      {/* textura de madeira */}
      <img
        src="/assets/wood-banner.jpg"
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
        className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-carvao"
        aria-hidden
      />

      {/* Conteúdo */}
      <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center px-4 pb-16 pt-14 text-center">
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

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-5 max-w-sm text-sm font-medium text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
        >
          Rua João Pacheco de Lima 54-84 Centro.
        </motion.p>

        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.4 }}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/90 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-carne" />
          Itens sujeitos a alteração de peso de 10% para mais ou para menos.
        </motion.span>
      </div>
    </header>
  );
}
