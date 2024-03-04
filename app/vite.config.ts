import react from "@vitejs/plugin-react";
import { createRequire } from "node:module";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";

const require = createRequire(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  cacheDir: "../.cache/vite-app",

  build: {
    assetsDir: "app/assets",
    emptyOutDir: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // chainfuse: ["@chainfuse/core", "@chainfuse/react", "@chainfuse/ui"],
          firebase: ["firebase/app", "firebase/auth"],
          firestore: ["firebase/firestore"],
          react: ["react", "react-dom", "react-router-dom"],
        },
        banner: "window.global=window;",
      },
    },
  },

  // https://docs.cloud.coinbase.com/wallet-sdk/docs/initializing
  resolve: {
    alias: {
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      events: require.resolve("events/"),
      process: require.resolve("process/browser"),
      stream: require.resolve("stream-browserify/"),
      "@chainfuse/core/forms": require.resolve("@chainfuse/core/forms"),
      util: require.resolve("util/"),
      "./util.inspect": require.resolve("node-inspect-extracted"),
      "@walletconnect/jsonrpc-http-connection": require.resolve(
        "@walletconnect/jsonrpc-http-connection/"
      ),
      "@walletconnect/jsonrpc-provider": require.resolve(
        "@walletconnect/jsonrpc-provider/"
      ),
      tslib: require.resolve("tslib/"),
    },
  },

  plugins: [
    mkcert(),
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
        target: "http://localhost:8080/",
        changeOrigin: true,
      },
      "/npm/": {
        target: "https://cdn.jsdelivr.net/",
        changeOrigin: true,
      },
    },
  },
});
