import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const configuredApiBase = env.VITE_API_BASE_URL || "";
  const apiProxyTarget =
    env.VITE_API_PROXY_TARGET ||
    (/^https?:\/\//.test(configuredApiBase) ? configuredApiBase : "") ||
    "http://localhost:8000";

  return {
    base: "/notes-system/",
    plugins: [react()],
    server: {
      proxy: {
        "/api/tts": {
          target: "http://localhost:8787",
          changeOrigin: true,
        },
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
