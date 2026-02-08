import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    name: "MetaBear: SEO & Accessibility Audit",
    permissions: ["activeTab", "scripting", "tabs", "webNavigation"],
    action: {},
    web_accessible_resources: [
      {
        resources: ["panel.html"],
        matches: ["http://*/*", "https://*/*"],
      },
    ],
  },
  modules: ["@wxt-dev/module-react"],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
