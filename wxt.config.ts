import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "wxt";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcPath = resolve(__dirname, "src");

export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-solid"],

  manifest: {
    name: "Super Sticker",
    description: "Attach sticky notes to any element on any webpage",
    permissions: ["storage", "activeTab"],
    icons: {
      16: "icon-16.png",
      32: "icon-32.png",
      48: "icon-48.png",
      128: "icon-128.png"
    },
    commands: {
      "add-note": {
        suggested_key: {
          default: "Alt+Shift+A"
        },
        description: "Enter Add Note mode"
      },
      "toggle-visibility": {
        suggested_key: {
          default: "Alt+Shift+V"
        },
        description: "Toggle note visibility"
      }
    },
    browser_specific_settings: {
      gecko: {
        id: "super_sticker@prmworks.com",
        strict_min_version: "109.0",
        // Mozilla requires data_collection_permissions as of Nov 2025
        // Empty arrays indicate no data is collected
        data_collection_permissions: {
          // "none" must be a string inside the 'required' array
          required: ["none"]
        }
      } as Record<string, unknown>
    }
  }
});
