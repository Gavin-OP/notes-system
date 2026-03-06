import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/notes-system/",
  plugins: [react()],
  server: {
    proxy: {
      "/api/tts": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
});
