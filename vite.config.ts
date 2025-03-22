import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",  // Keeps the PWA updated automatically
      manifest: {
        name: "Write app",
        short_name: "PWA",
        description: "A React write PWA built with Vite",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "/imgs/write_logo.png", // Ensure this image exists in public/imgs/
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/imgs/write_logo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true, // Enable PWA in development mode
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
