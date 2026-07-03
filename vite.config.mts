import path from "node:path";
import { defineConfig } from "vite";
import zaloMiniApp from "zmp-vite-plugin";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    base: "",
    plugins: [zaloMiniApp(), react()],
    server: {
      host: "0.0.0.0",
      port: 3000,
      strictPort: true,
    },
    build: {
      assetsInlineLimit: 0,
      outDir: "www",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  });
};
