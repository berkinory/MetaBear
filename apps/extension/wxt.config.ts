import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    permissions: ["activeTab", "scripting", "tabs"],
  },
  modules: ["@wxt-dev/module-react"],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
