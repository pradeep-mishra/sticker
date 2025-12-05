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
          primary: "#3B82F6",
          accent: "#F59E0B",
          danger: "#EF4444"
        }
      },
      backdropBlur: {
        glass: "10px"
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.1)",
        "glass-hover": "0 12px 40px rgba(0, 0, 0, 0.15)"
      },
      borderRadius: {
        glass: "12px"
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
