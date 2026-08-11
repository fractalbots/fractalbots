/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#070A11", 900: "#0D1420", 800: "#131C2B" },
        paper: { DEFAULT: "#E7EAEF", 100: "#F4F6F8" },
        fb: {
          cyan: "#1E9AD7",
          green: "#43B02A",
          purple: "#5E2D8E",
          orange: "#F5811F",
          sky: "#6FD3FF",
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "Arial Black", "sans-serif"],
        body: ['"Instrument Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(.16,1,.3,1)",
      },
      keyframes: {
        slide: { to: { transform: "translateX(-50%)" } },
        spin46: { to: { transform: "rotate(360deg)" } },
        pop: { to: { transform: "none", opacity: "1" } },
      },
      animation: {
        slide: "slide 34s linear infinite",
        ringA: "spin46 46s linear infinite",
        ringB: "spin46 68s linear infinite reverse",
      },
    },
  },
  plugins: [],
};
