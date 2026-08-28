/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        // Identidade da Casa de Carnes Maciel
        carne: {
          DEFAULT: "#C1121F", // vermelho sangue (ações, badges)
          dark: "#8B0D16",
          light: "#E23B48",
        },
        madeira: {
          DEFAULT: "#7A4A25", // marrom madeira
          escura: "#3E2A1B",
          clara: "#C89B6A",
        },
        carvao: "#0E0E0E", // "preto" da marca (não usar #000 puro)

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Archivo Black'", "Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgb(0 0 0 / 0.10)",
        card: "0 8px 30px -8px rgb(0 0 0 / 0.15)",
        glass: "0 8px 32px rgb(0 0 0 / 0.20)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
