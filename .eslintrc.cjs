/**
 * ESLint configuration.
 *
 * @see https://eslint.org/docs/user-guide/configuring
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  env: {
    es6: true,
  },

  extends: ["eslint:recommended", "prettier"],

  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },

  overrides: [
    {
      files: ["*.ts", ".tsx"],
      parser: "@typescript-eslint/parser",
      extends: ["plugin:@typescript-eslint/recommended"],
      plugins: ["@typescript-eslint"],
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: true,
      },
    },
    {
      files: ["*.test.ts"],
      env: {
        jest: true,
      },
    },
    {
      files: [
        ".eslintrc.cjs",
        "**/vite.config.ts",
        "babel.config.cjs",
        "rollup.config.mjs",
        "scripts/**/*.js",
      ],
      env: {
        node: true,
      },
    },
  ],

  ignorePatterns: ["/.cache", "/.git", "/.husky", "/.yarn", "/*/dist/"],
};
