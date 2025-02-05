import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
  server: {
    historyApiFallback: true, // Fixes routing in development
  },
  preview: {
    port: 4173,
    strictPort: true,
    historyApiFallback: true, // Fixes routing in production
  },
});
