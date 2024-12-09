import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";
import type { Plugin } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react() as unknown as Plugin,
    createSvgIconsPlugin({
      // Specify the icon folder to be cached
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      // Specify symbolId format
      symbolId: "icon-[dir]-[name]",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve("./src"), // 相对路径别名配置，使用 @ 代替 src
    },
  },
});
