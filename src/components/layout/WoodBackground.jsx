/**
 * Fundo de madeira 100% procedural (SVG + CSS) — sem arquivo de imagem.
 * Camadas: cor base → variação de tábua → veios (feTurbulence) →
 * reflexos claros → frestas entre as tábuas → vinheta.
 */
export function WoodBackground({ className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {/* cor base da madeira */}
      <div className="absolute inset-0 bg-[#4a2f1b]" />

      {/* leve variação de tom ao longo das tábuas */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "linear-gradient(90deg,#3a2413 0%,#5b3a22 22%,#40281700 40%,#5f3f26 62%,#38220f 82%,#4a2f1b 100%)",
        }}
      />

      {/* alternância de tom entre tábuas vizinhas */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg," +
            "rgba(255,255,255,0.05) 0px,rgba(255,255,255,0.05) 85px," +
            "rgba(0,0,0,0.14) 85px,rgba(0,0,0,0.14) 170px)",
        }}
      />

      {/* veios da madeira (grão horizontal) */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.62] mix-blend-overlay"
        preserveAspectRatio="none"
      >
        <filter id="wood-grain" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0035 0.11"
            numOctaves="5"
            seed="12"
            stitchTiles="stitch"
            result="n"
          />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1.6 -0.28"
          />
        </filter>
        <rect width="100%" height="100%" fill="#808080" filter="url(#wood-grain)" />
      </svg>

      {/* reflexos claros do grão */}
      <svg
        className="absolute inset-0 h-full w-full opacity-40 mix-blend-soft-light"
        preserveAspectRatio="none"
      >
        <filter id="wood-hi" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.13"
            numOctaves="3"
            seed="29"
            stitchTiles="stitch"
            result="n"
          />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0.4 -0.02"
          />
        </filter>
        <rect width="100%" height="100%" fill="#808080" filter="url(#wood-hi)" />
      </svg>

      {/* frestas entre as tábuas */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg," +
            "rgba(0,0,0,0) 0px,rgba(0,0,0,0) 83px," +
            "rgba(0,0,0,0.7) 84px,rgba(0,0,0,0.35) 86px," +
            "rgba(255,255,255,0.07) 87px,rgba(0,0,0,0) 89px)",
        }}
      />

      {/* vinheta para dar profundidade e contraste ao conteúdo */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(130% 120% at 50% 0%, transparent 38%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </div>
  );
}
