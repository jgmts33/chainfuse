/* SPDX-FileCopyrightText: 2016-present Kriasoft <hello@kriasoft.com> */
/* SPDX-License-Identifier: MIT */

import envars from "envars";
import { $, argv, fs, path } from "zx";

// Load the environment variables
const envName = argv.env ?? "test";
envars.config({ env: envName });

const cwd = process.cwd();
const corsFile = path.relative(cwd, path.join(__dirname, "cors.json"));

for (const bucket of [$.env.UPLOAD_BUCKET, $.env.ASSETS_BUCKET]) {
  // Write CORS settings to a temporary file
  await fs.writeFile(
    corsFile,
    JSON.stringify([
      {
        origin: [
          `https://${$.env.APP_HOSTNAME}`,
          envName !== "prod" && "http://localhost:3000",
          envName !== "prod" && "http://localhost:3001",
          envName !== "prod" && "http://localhost:4173",
          envName !== "prod" && "http://localhost:4174",
          envName !== "prod" && "http://localhost:5173",
          envName !== "prod" && "http://localhost:5174",
          envName !== "prod" && "https://localhost:5173",
          envName !== "prod" && "https://localhost:5174",
          envName !== "prod" && "http://127.0.0.1:4173",
          envName !== "prod" && "http://127.0.0.1:4174",
          envName !== "prod" && "http://127.0.0.1:5173",
          envName !== "prod" && "http://127.0.0.1:5174",
          envName !== "prod" && "https://127.0.0.1:5173",
          envName !== "prod" && "https://127.0.0.1:5174",
        ].filter(Boolean),
        responseHeader:
          bucket === $.env.UPLOAD_BUCKET
            ? ["Content-Type", "Authorization"]
            : ["Content-Type"],
        method:
          bucket === $.env.UPLOAD_BUCKET
            ? ["GET", "POST", "PUT", "DELETE"]
            : ["GET"],
        maxAgeSeconds: 3600,
      },
    ]),
    { encoding: "utf-8" }
  );

  // Apply CORS settings to the target bucket
  try {
    await $`gsutil cors set ${corsFile} ${`gs://${bucket}`}`;
  } finally {
    await fs.unlink(corsFile);
  }
}
