import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const backEndDir = fileURLToPath(new URL("../back-end", import.meta.url));
  const backEndPort = loadEnv(mode, backEndDir, "").PORT || 3000;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/api": `http://localhost:${backEndPort}`,
      },
    },
  };
});
