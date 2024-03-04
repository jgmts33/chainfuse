/* SPDX-FileCopyrightText: 2020-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { execa } from "execa";
import { EOL } from "node:os";
import { $, fs, path } from "zx";

if ($.env.CI === "true") {
  process.exit();
}

const environments = [
  { name: "local", description: "development" },
  { name: "test", description: "staging/QA" },
  { name: "prod", description: "production" },
];

// Create environment variable override files
// such as `env/.prod.override.env`.
for (const env of environments) {
  const filename = path.join(__dirname, `../env/.${env.name}.override.env`);

  if (!fs.existsSync(filename)) {
    await fs.writeFile(
      filename,
      [
        `# Overrides for the "${env.name}" (${env.description}) environment`,
        `# CLOUDFLARE_API_TOKEN=xxxxx`,
        `# GOOGLE_CLOUD_CREDENTIALS=xxxxx`,
        ``,
      ].join(EOL),
      "utf-8"
    );
  }
}

try {
  await execa("yarn", ["tsc", "--build"], { stdio: "inherit" });
} catch (err) {
  console.error(err);
}
