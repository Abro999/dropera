import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--color-ink)",
        "ink-soft": "var(--color-ink-soft)",
        paper: "var(--color-paper)",
        "paper-soft": "var(--color-paper-soft)",
        brass: "var(--color-brass)",
        "brass-soft": "var(--color-brass-soft)",
        teel: "var(--color-teel)",
        charcoal: "var(--color-charcoal)",
        line: "var(--color-line)",
        "line-dark": "var(--color-line-dark)",
        cream: "var(--color-cream)",
        rust: "var(--color-rust)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1400px",
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};
export default config;
