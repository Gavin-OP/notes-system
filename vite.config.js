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
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return undefined;
            if (id.includes("/mermaid/")) return "mermaid";
            if (id.includes("/echarts/") || id.includes("/zrender/")) return "charts";
            if (id.includes("/antd/") || id.includes("/@ant-design/") || id.includes("/rc-")) {
              return "ui-vendor";
            }
            if (
              id.includes("/react/") ||
              id.includes("/react-dom/") ||
              id.includes("/react-router/") ||
              id.includes("/react-router-dom/") ||
              id.includes("/@reduxjs/") ||
              id.includes("/react-redux/")
            ) {
              return "react-vendor";
            }
            return undefined;
          },
        },
      },
    },
  };
});
