import { motion } from "framer-motion";
import { Clock, MapPin, MessageCircle } from "lucide-react";

const NUMERO_WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMERO || "5517991316331";

/**
 * Ocupa o lugar do site inteiro quando não dá pra fazer pedido online:
 * fora de Seg a Sáb 8h-19h, ou aos domingos fora do atendimento presencial
 * (8h-12h). Mesmo visual do HeroBanner (foto + madeira escura) para manter
 * a identidade da marca.
 */
export function LojaFechada({ status, mensagem }) {
  const presencial = status === "presencial";

  return (
    <div className="relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-madeira-escura px-4 py-10 text-center">
      <img
        src="/assets/hero-acougueiro.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 50% 32%, rgba(255,196,120,0.30), rgba(255,196,120,0) 70%)",
        }}
      />
      <div className="absolute inset-0 bg-black/75" aria-hidden />

      <div className="relative flex w-full max-w-sm flex-col items-center">
        <motion.img
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          src="/assets/logo-maciel.png"
          alt="Casa de Carnes Maciel"
          className="w-36 drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)] sm:w-44"
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mt-5"
        >
          <h1 className="font-display text-2xl text-white">
            {presencial ? "Hoje é só presencial" : "Estamos fechados"}
          </h1>
          <p className="mt-2 text-sm text-white/80">{mensagem}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="mt-6 w-full space-y-2.5 rounded-xl border border-white/15 bg-white/5 p-4 text-left text-sm text-white/85 backdrop-blur-sm"
        >
          <p className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-carne-light" aria-hidden />
            <span>
              Seg a Sáb · 8h às 19h
              <br />
              Domingo · 8h às 12h (só presencial)
            </span>
          </p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Rua+Jo%C3%A3o+Pacheco+de+Lima+54-84+Centro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white/70"
          >
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-carne-light" aria-hidden />
            Rua João Pacheco de Lima 54-84, Centro
          </a>
        </motion.div>

        <motion.a
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          href={`https://wa.me/${NUMERO_WHATSAPP}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-carne px-5 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-carne-dark"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Chamar no WhatsApp
        </motion.a>
      </div>
    </div>
  );
}
