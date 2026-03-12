import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiProxyTarget =
  process.env.VITE_API_PROXY_TARGET || "http://localhost:3000";
const storageProxyTarget =
  process.env.VITE_STORAGE_PROXY_TARGET || "http://localhost:9000";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
      },
      "/storage": {
        target: storageProxyTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/storage/, "/profile-pictures"),
      },
      "/socket.io": {
        target: apiProxyTarget,
        ws: true,
      },
    },
  },
});
