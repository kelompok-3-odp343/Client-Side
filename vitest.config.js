import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom", // agar bisa test komponen React
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"], // cari file test di folder src
  },
});
