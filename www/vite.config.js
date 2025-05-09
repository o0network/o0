import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import copy from "rollup-plugin-copy";

export default defineConfig({
  root: "./src",
  base: "/www/",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: "./src/index.html",
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: (assetInfo) => {
          return `assets/${assetInfo.name}`;
        },
      },
      plugins: [
        copy({
          targets: [{ src: "src/assets", dest: "dist" }],
          hook: "writeBundle",
        }),
      ],
    },
  },
  plugins: [
    createHtmlPlugin({
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
        removeAttributeQuotes: false,
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [
        require("postcss-nesting"),
        require("postcss-preset-env")({
          features: {
            "nesting-rules": false,
          },
        }),
      ],
    },
  },
});
