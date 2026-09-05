import { useEffect, useState } from "react";

// Horário de funcionamento, sempre calculado no fuso de São Paulo (não no
// fuso do navegador do cliente), já que quem importa é o horário da loja:
//  - Seg a Sáb: 8h às 19h, com pedido online normal.
//  - Domingo: loja aberta, mas só para atendimento presencial, das 8h às 12h
//    (sem pedido online — por isso o site também mostra a tela cheia).
const ABRE_HORA = 8;
const FECHA_HORA = 19;
const FECHA_HORA_DOMINGO = 12;

function agoraEmSaoPaulo() {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const mapa = Object.fromEntries(partes.map((p) => [p.type, p.value]));
  const diaSemana = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[mapa.weekday];
  // Alguns navegadores retornam "24" para meia-noite em vez de "00".
  const hora = Number(mapa.hour) % 24;
  const minuto = Number(mapa.minute);

  return { diaSemana, hora, minuto };
}

/** "aberto" (site+loja), "presencial" (domingo, só na loja) ou "fechado". */
function calcularStatus({ diaSemana, hora, minuto }) {
  const minutosNoDia = hora * 60 + minuto;

  if (diaSemana === 0) {
    return minutosNoDia >= ABRE_HORA * 60 && minutosNoDia < FECHA_HORA_DOMINGO * 60
      ? "presencial"
      : "fechado";
  }

  return minutosNoDia >= ABRE_HORA * 60 && minutosNoDia < FECHA_HORA * 60
    ? "aberto"
    : "fechado";
}

/** Texto amigável para a tela cheia (só faz sentido quando não está "aberto"). */
function calcularMensagem({ diaSemana, hora }, status) {
  if (status === "presencial") {
    return "Hoje atendemos só presencialmente na loja, das 8h às 12h.";
  }

  // status === "fechado"
  if (diaSemana === 0) {
    return hora < ABRE_HORA
      ? "Hoje atendemos presencialmente das 8h às 12h."
      : "Amanhã, segunda-feira, voltamos com pedido online às 8h.";
  }
  if (hora < ABRE_HORA) return "Abrimos hoje às 8h.";
  if (diaSemana === 6) {
    return "Amanhã (domingo) atendemos só presencialmente, das 8h às 12h. Pedido online volta segunda-feira às 8h.";
  }
  return "Abrimos amanhã às 8h.";
}

/** Status atual da loja/site ("aberto" | "presencial" | "fechado") e uma frase explicativa. */
export function useLojaAberta() {
  const calcular = () => {
    const agora = agoraEmSaoPaulo();
    const status = calcularStatus(agora);
    return { status, mensagem: calcularMensagem(agora, status) };
  };

  const [estado, setEstado] = useState(calcular);

  useEffect(() => {
    const id = setInterval(() => setEstado(calcular()), 30_000);
    return () => clearInterval(id);
  }, []);

  return estado;
}
