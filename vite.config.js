import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://34.143.146.191:30080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
