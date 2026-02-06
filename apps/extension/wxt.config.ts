import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    permissions: ["activeTab", "scripting", "tabs", "webNavigation"],
    action: {},
    web_accessible_resources: [
      {
        resources: ["panel.html"],
        matches: ["<all_urls>"],
      },
    ],
  },
  modules: ["@wxt-dev/module-react"],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
