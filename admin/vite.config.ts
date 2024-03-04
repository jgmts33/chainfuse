/* SPDX-FileCopyrightText: 2020-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import rollupReplace from "@rollup/plugin-replace";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * Vite configuration
 * https://vitejs.dev/config/
 */
export default defineConfig({
  cacheDir: "../.cache/vite-admin",

  base: "/admin/",

  plugins: [
    /* @ts-expect-error https://github.com/vitejs/vite/issues/7843 */
    rollupReplace({
      preventAssignment: true,
      values: {
        __DEV__: JSON.stringify(true),
        "process.env.NODE_ENV": JSON.stringify("development"),
      },
    }),

    // https://github.com/vitejs/vite/tree/main/packages/plugin-react
    react({
      jsxRuntime: "classic",
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],

  server: {
    proxy: {
      "/api": {
        target: "https://test.chainfuse.com",
        changeOrigin: true,
      },
      "/npm/": {
        target: "https://cdn.jsdelivr.net/",
        changeOrigin: true,
      },
    },
  },
});
