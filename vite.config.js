import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// "@/..." aponta para a pasta src -> imports curtos e sem "../../../"
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
});
