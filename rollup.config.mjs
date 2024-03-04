/* SPDX-FileCopyrightText: 2020-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import run from "@rollup/plugin-run";
import chalk from "chalk";
import { deleteAsync } from "del";
import envars from "envars";
import { globbySync } from "globby";
import prettyBytes from "pretty-bytes";
import { $, path } from "zx";

const isWatch = $.env.ROLLUP_WATCH === "true";
if (isWatch) envars.config();

export default globbySync(["*/package.json"])
  .map((file) => path.dirname(file))
  .filter((name) => name !== "core")
  .filter((name) => name === process.env.TARGET || !process.env.TARGET)
  .map(
    /**
     * Rollup configuration
     * https://rollupjs.org/guide/
     *
     * @return {import("rollup").RollupOptions}
     */
    (name) => ({
      input:
        name === "api" && isWatch
          ? `./${name}/core/server.ts`
          : `./${name}/index.ts`,
      output: {
        name,
        file: `./${name}/dist/index.js`,
        format: "es",
        minifyInternalExports: true,
        generatedCode: "es2015",
        sourcemap: name === "api",
        inlineDynamicImports: true,
      },
      plugins: [
        nodeResolve({
          extensions: [".ts", ".tsx", ".mjs", ".js", ".json", ".node"],
          browser: name === "api" ? false : true,
        }),
        commonjs(),
        json(),
        babel({
          extensions: [".js", ".mjs", ".ts", ".tsx"],
          babelHelpers: "bundled",
        }),
        {
          name: "custom",
          async buildStart() {
            await deleteAsync(`${name}/dist/**`);
          },
          generateBundle(options, bundle) {
            if (!process.argv.includes("--silent") && !this.meta.watchMode) {
              const file = path.basename(options.file);
              const size = bundle[file].code.length;
              const prettySize = chalk.green(prettyBytes(size));
              console.log(`${chalk.cyan("file size:")} ${prettySize}`);
            }
          },
        },
        isWatch &&
          run({
            execArgv: [
              "--require=./.pnp.cjs",
              "--require=source-map-support/register",
              "--no-warnings",
            ],
          }),
      ].filter(Boolean),
      external: [
        "__STATIC_CONTENT_MANIFEST",
        "@google-cloud/storage",
        "firebase-admin",
        "nanoid",
        "nanoid/async",
        /^firebase-admin\//,
        "got",
      ],
    })
  );
