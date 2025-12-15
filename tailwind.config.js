/** @type {import('tailwindcss').Config} */
export default {
  content: ["./entrypoints/**/*.{html,ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        glass: {
          white: "rgba(255, 255, 255, 0.7)",
          border: "rgba(255, 255, 255, 0.3)",
          dark: "rgba(0, 0, 0, 0.1)"
        },
        sticker: {
          primary: "#359EFF",
          secondary: "#F3F4F6",
          accent: "#F59E0B",
          danger: "#EF4444",
          "background-light": "#f5f7f8",
          "background-dark": "#0f1923"
        }
      },
      backdropBlur: {
        glass: "10px"
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.1)",
        "glass-hover": "0 12px 40px rgba(0, 0, 0, 0.15)",
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        glow: "0 0 15px rgba(37, 99, 235, 0.3)"
      },
      borderRadius: {
        glass: "12px",
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        }
      }
    }
  },
  plugins: []
};
