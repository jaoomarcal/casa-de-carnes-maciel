import { useEffect, useState } from "react";

import { formatBRL } from "@/lib/utils";
import { rotuloUnidade } from "@/data/categories";

const INTERVALO_MS = 4500;

/**
 * Banner de promoções: uma faixa horizontal cheia entre o hero e o menu de
 * categorias. Mostra os produtos marcados como "É oferta do dia" com imagem
 * grande, rotacionando um por vez.
 *
 * A faixa tem ALTURA FIXA e os slides ficam empilhados por cima dela (absolute),
 * então nem a imagem nem o texto esticam ou encolhem o banner: a foto usa
 * `object-cover` sangrando de ponta a ponta e o texto fica numa coluna alinhada
 * à largura do resto da página, com no máximo duas linhas. A troca é um
 * crossfade em CSS puro, que não trava nem fica "no meio".
 */
export function PromoBanner({ promocoes = [], loading = false }) {
  const [atual, setAtual] = useState(0);
  const total = promocoes.length;

  // Rotação automática — só quando há mais de um produto
  useEffect(() => {
    if (total < 2) return;
    setAtual((v) => v % total);
    const t = setInterval(
      () => setAtual((v) => (v + 1) % total),
      INTERVALO_MS
    );
    return () => clearInterval(t);
  }, [total]);

  const faixa =
    "relative block h-52 w-full overflow-hidden bg-carvao shadow-[0_22px_50px_-18px_rgba(0,0,0,0.55)] sm:h-[17rem]";
  // Coluna de conteúdo alinhada ao restante da página
  const coluna = "mx-auto flex h-full max-w-2xl items-center px-4 lg:max-w-5xl";

  if (loading && total === 0) {
    return (
      <div className={`${faixa} animate-pulse`} aria-hidden />
    );
  }

  if (total === 0) return null;

  const indice = atual % total;

  return (
    <a href="#promocao" className={`${faixa} group`}>
      {promocoes.map((p, idx) => (
        <div
          key={p.id}
          aria-hidden={idx !== indice}
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: idx === indice ? 1 : 0 }}
        >
          {/* Foto do produto: sangra de ponta a ponta sem distorcer */}
          <img
            src={p.imagem || "/assets/carnes-og.png"}
            alt={p.nome}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[5000ms] ease-out group-hover:scale-105"
          />
          {/* Escurecimento à esquerda pra leitura do texto */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-carvao via-carvao/75 to-carvao/10"
            aria-hidden
          />

          {/* Mensagem — coluna alinhada à página, no máx. 2 linhas */}
          <div className="absolute inset-0">
            <div className={coluna}>
              <div className="flex max-w-[60%] flex-col gap-1.5 text-white sm:max-w-[52%] sm:gap-2">
                <span className="w-fit rounded-full bg-carne px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide">
                  Promoção 🔥
                </span>
                <p className="line-clamp-2 font-display text-lg leading-tight tracking-tight sm:text-2xl">
                  {p.nome}
                </p>
                <p className="flex flex-wrap items-baseline gap-x-2">
                  {p.temDesconto && (
                    <span className="text-xs text-white/50 line-through sm:text-sm">
                      {formatBRL(p.precoKg)}
                    </span>
                  )}
                  <span className="text-base font-bold text-carne-light sm:text-xl">
                    {formatBRL(p.precoAtualKg)}
                  </span>
                  <span className="text-xs text-white/60">
                    / {p.unidadeComPeso ? "kg" : rotuloUnidade(p.unidade)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Bordas suaves: o topo se dissolve no hero escuro e a base perde a
          linha dura num degradê, complementando a sombra externa do card */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-carvao/95 via-carvao/40 to-transparent sm:h-24"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-carvao/80 via-carvao/25 to-transparent sm:h-24"
        aria-hidden
      />

      {/* Indicadores de posição — alinhados à coluna da página */}
      {total > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3">
          <div className="mx-auto flex max-w-2xl justify-end px-4 lg:max-w-5xl">
            <div className="flex gap-1.5">
              {promocoes.map((p, idx) => (
                <span
                  key={p.id}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === indice ? "w-4 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </a>
  );
}
