import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuration Vite : 2 environnements (prod="/" et dev="/dev/")
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "development" ? "/dev/" : "/",
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
}));
