/* SPDX-FileCopyrightText: 2020-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import { createServer } from "vite";
import { $, argv, chalk } from "zx";

// Load environment variables
envars.config({ env: argv.env ?? "local" });

console.clear();
console.log("");

console.log(
  [
    `${chalk.gray("Application")}: ${chalk.greenBright($.env.APP_NAME)}`,
    `${chalk.gray("environment")}: ${chalk.greenBright($.env.APP_ENV)}`,
  ].join(", ")
);

console.log("");

// Launch the web application (front-end) server
const app = await createServer({
  root: "admin",
  base: argv.base,
  logLevel: argv.logLevel ?? argv.l,
  clearScreen: argv.clearScreen,
  optimizeDeps: {
    force: argv.force,
  },
  server: {
    host: argv.host,
    port: argv.port,
    https: argv.https,
    open: argv.open,
    cors: argv.cors,
    strictPort: argv.strictPort,
    proxy: {
      "/api": {
        target: $.env.API_ORIGIN,
        changeOrigin: true,
      },
    },
  },
});

await app.listen();
app.printUrls();

console.log("");
