import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#09090e",
        surface: "#12111c",
        "surface-card": "#1a1829",
        "surface-border": "#2c2845",
        primary: {
          DEFAULT: "#7C3AED", // Violet JackPilot / FrenchCasino
          hover: "#6D28D9",
          light: "#A78BFA",
          glow: "rgba(124, 58, 237, 0.4)",
        },
        gold: {
          DEFAULT: "#D4AF37", // Champagne Gold
          light: "#F3E5AB",
          dark: "#AA7C11",
          glow: "rgba(212, 175, 55, 0.3)",
        },
        emerald: {
          DEFAULT: "#10B981",
          glow: "rgba(16, 185, 129, 0.3)",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-hero": "radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.25) 0%, rgba(9, 9, 14, 1) 75%)",
        "gold-shine": "linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #AA7C11 100%)",
        "purple-shine": "linear-gradient(135deg, #C084FC 0%, #7C3AED 50%, #4C1D95 100%)",
        "glass-card": "linear-gradient(180deg, rgba(30, 27, 48, 0.7) 0%, rgba(18, 17, 28, 0.85) 100%)",
      },
      boxShadow: {
        "purple-glow": "0 0 25px rgba(124, 58, 237, 0.35)",
        "gold-glow": "0 0 25px rgba(212, 175, 55, 0.35)",
        "chip-hover": "0 10px 30px -5px rgba(124, 58, 237, 0.5)",
      },
      animation: {
        "pulse-glow": "pulseGlow 3s infinite ease-in-out",
        "float": "float 4s infinite ease-in-out",
        "jackpot": "jackpotGlow 1.5s infinite alternate",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.03)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        jackpotGlow: {
          "0%": { textShadow: "0 0 10px #D4AF37, 0 0 20px #D4AF37" },
          "100%": { textShadow: "0 0 20px #F3E5AB, 0 0 35px #7C3AED, 0 0 45px #7C3AED" },
        }
      }
    },
  },
  plugins: [],
};

export default config;
