/* SPDX-FileCopyrightText: 2020-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import envars from "envars";

/**
 * Jest configuration
 * https://jestjs.io/docs/configuration
 *
 * @type {import("@jest/types").Config.InitialOptions}
 */
export default {
  cacheDirectory: ".cache/jest",

  testPathIgnorePatterns: [
    "<rootDir>/.cache/",
    "<rootDir>/.github/",
    "<rootDir>/.husky/",
    "<rootDir>/.vscode/",
    "<rootDir>/.yarn/",
    "<rootDir>/*/dist/",
    "<rootDir>/scripts/",
  ],

  moduleFileExtensions: [
    "ts",
    "js",
    "mjs",
    "cjs",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node",
  ],

  modulePathIgnorePatterns: ["<rootDir>/*/dist/"],

  transform: {
    "\\.ts$": "babel-jest",
  },

  extensionsToTreatAsEsm: [".ts"],

  setupFiles: ["envars/config"],

  projects: [
    {
      displayName: "api",
      testEnvironment: "node",
      testMatch: ["<rootDir>/api/**/*.test.ts"],
      transform: {
        "\\.ts$": "babel-jest",
      },
      extensionsToTreatAsEsm: [".ts"],
    },
    {
      displayName: "site",
      // Miniflare Settings
      // https://miniflare.dev/get-started/api
      testEnvironment: "miniflare",
      testEnvironmentOptions: {
        bindings: envars.config(),
        kvNamespaces: [],
        // sitePath: "public",
        modules: true,
      },
      testMatch: ["<rootDir>/site/**/*.test.ts"],
      extensionsToTreatAsEsm: [".ts"],
    },
  ],
};
