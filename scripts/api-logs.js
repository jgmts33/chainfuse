import envars from "envars";
import { execa } from "execa";
import { $, argv, chalk, path } from "zx";

// Load environment variables
const envName = argv.env ?? "test";
envars.config({ env: envName });

const fnName = envName === "prod" ? "api" : `api-${envName}`;

/**
 * View logs from the "api" Cloud Function. Usage:
 *
 *   $ yarn api:logs [--env #0]
 *
 * @see https://cloud.google.com/functions
 * @see https://cloud.google.com/sdk/gcloud/reference/functions/logs/read
 */
await execa(
  `gcloud`,
  [
    ...["beta", "functions", "logs", "read", fnName],
    `--project=${$.env.GOOGLE_CLOUD_PROJECT}`,
    `--region=${$.env.GOOGLE_CLOUD_REGION}`,
    `--gen2`,
  ],
  { stdio: "inherit", cwd: path.resolve(__dirname, "../api/dist") }
).catch((err) => {
  process.exitCode = err.exitCode;
  console.error("\n" + chalk.redBright(err.command));
  return Promise.resolve();
});
