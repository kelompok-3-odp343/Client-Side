import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [['babel-plugin-react-compiler']],
  server: {
    proxy: {
      "/api": {
        target: "https://2535102e169c.ngrok-free.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});


