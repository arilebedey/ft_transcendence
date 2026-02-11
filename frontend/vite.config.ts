import { defineConfig } from "vite";
<<<<<<< HEAD
import react from "@vitejs/plugin-react-swc";
=======
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
>>>>>>> 2c426df (Modifications packages -> making sure we work with the right deps. Modified colors values -> switched to hex)
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
<<<<<<< HEAD
  plugins: [react()],
=======
  plugins: [react(), tailwindcss()],
>>>>>>> 2c426df (Modifications packages -> making sure we work with the right deps. Modified colors values -> switched to hex)
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));