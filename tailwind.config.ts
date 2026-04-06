import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#0a0a0f",
          surface: "#0f1117",
          "surface-2": "#151b27",
          border: "#1e2d3d",
          primary: "#00d4ff",
          "primary-dim": "#0099bb",
          accent: "#7c3aed",
          "accent-dim": "#5b21b6",
          danger: "#ff2d55",
          success: "#00ff88",
          warning: "#ffb800",
          text: "#e2e8f0",
          muted: "#64748b",
        },
      },
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(0, 212, 255, 0.4)",
        "glow-purple": "0 0 20px rgba(124, 58, 237, 0.4)",
        "glow-green": "0 0 20px rgba(0, 255, 136, 0.4)",
        "glow-red": "0 0 20px rgba(255, 45, 85, 0.4)",
        "glow-amber": "0 0 20px rgba(255, 184, 0, 0.4)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "fade-in": "fadeIn 0.2s ease-out",
        "level-up": "levelUp 0.6s ease-out",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0, 212, 255, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(0, 212, 255, 0.7)" },
        },
        slideUp: {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          from: { transform: "translateY(-10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        levelUp: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "50%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
