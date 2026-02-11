import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#e1eaef",
        input: "#e1eaef",
        ring: "#0e53e7",
        background: "#f9fafb",
        foreground: "#0f2129",
        primary: {
          DEFAULT: "#0e53e7",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#f3f5f7",
          foreground: "#0f2129",
        },
        destructive: {
          DEFAULT: "#ef4343",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#ebedf0",
          foreground: "#657b8b",
        },
        accent: {
          DEFAULT: "#0e53e7",
          foreground: "#ffffff",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#0f2129",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0f2129",
        },
        sidebar: {
          DEFAULT: "#ffffff",
          foreground: "#0f2129",
          primary: "#0e53e7",
          "primary-foreground": "#ffffff",
          accent: "#f3f5f7",
          "accent-foreground": "#0f2129",
          border: "#e1eaef",
          ring: "#0e53e7",
        },
        success: {
          DEFAULT: "#21c45d",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#f59f0a",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(14,83,231,0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(14,83,231,0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "pulse-glow": "pulse-glow 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
