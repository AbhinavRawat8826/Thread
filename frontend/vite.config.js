import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: process.env.NODE_ENV === "production"
      ? undefined
      : {
          "/api": {
            target: BASE_URL,
            changeOrigin: true,
            secure: false,
          },
        },
  },
});
