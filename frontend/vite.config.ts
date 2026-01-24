// @ts-ignore
import { defineConfig, loadEnv } from "vite";
// @ts-ignore
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }: any) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL),
    },
  };
});
