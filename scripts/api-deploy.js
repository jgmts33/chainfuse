import envars from "envars";
import { execa } from "execa";
import { userInfo } from "node:os";
import { $, argv, chalk, fs, path, YAML } from "zx";

// Load environment variables
const envName = argv.env ?? "test";
envars.config({ env: envName });

// Save the required environment variables to env.yml
await fs.writeFile(
  "./api/dist/env.yml",
  YAML.stringify({
    APP_ENV: $.env.APP_ENV,
    APP_NAME: $.env.APP_NAME,
    APP_HOSTNAME: $.env.APP_HOSTNAME,
    CLOUDFLARE_ACCOUNT_ID: $.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_ZONE_ID: $.env.CLOUDFLARE_ZONE_ID,
    CLOUDFLARE_API_TOKEN: $.env.CLOUDFLARE_API_TOKEN,
    GOOGLE_CLOUD_PROJECT: $.env.GOOGLE_CLOUD_PROJECT,
    GOOGLE_CLOUD_CREDENTIALS: $.env.GOOGLE_CLOUD_CREDENTIALS,
    OPENAI_API_KEY: $.env.OPENAI_API_KEY,
    PINATA_API_KEY: $.env.PINATA_API_KEY,
    PINATA_SECRET_KEY: $.env.PINATA_SECRET_KEY,
    FIREBASE_API_KEY: $.env.FIREBASE_API_KEY,
    UPLOAD_BUCKET: $.env.UPLOAD_BUCKET,
    ASSETS_BUCKET: $.env.ASSETS_BUCKET,
    NODE_OPTIONS: "--experimental-fetch",
  }),
  "utf-8"
);

// Clean up and copy package.json file into the ./dist folder
const pkg = JSON.parse(await fs.readFile("./api/package.json", "utf-8"));
await fs.writeFile(
  "./api/dist/package.json",
  JSON.stringify(
    {
      ...pkg,
      dependencies: {
        "@google-cloud/functions-framework":
          pkg.dependencies["@google-cloud/functions-framework"],
        "firebase-admin": pkg.dependencies["firebase-admin"],
        "@google-cloud/storage": pkg.dependencies["@google-cloud/storage"],
        got: pkg.dependencies["got"],
        nanoid: pkg.dependencies["nanoid"],
      },
      devDependencies: undefined,
    },
    null,
    "  "
  ),
  "utf-8"
);

// Bundle Node.js/Yarn related files
await $`cp .yarnrc.yml api/dist/.yarnrc.yml`;
await $`cp yarn.lock api/dist/yarn.lock`;
await fs.copy(".yarn/releases", "api/dist/.yarn/releases");

$.cwd = path.resolve(__dirname, "../api/dist");
$.env.NODE_OPTIONS = undefined;
$.env.YARN_ENABLE_IMMUTABLE_INSTALLS = "false";

await $`yarn config set enableGlobalCache false`;
await $`yarn install --mode=update-lockfile`;

// Update .gcloudignore
await fs.writeFile(
  path.resolve(__dirname, "../api/dist/.gcloudignore"),
  [
    ".yarn/*",
    "!.yarn/patches",
    "!.yarn/plugins",
    "!.yarn/releases",
    "env.yml",
    ".gcloudignore",
  ].join("\n"),
  "utf-8"
);

const fnName = envName === "prod" ? "api" : `api-${envName}`;

/**
 * Deploys the "api" package to Google Cloud Functions (GCF). Usage:
 *
 *   $ yarn api:deploy [--env #0]
 *
 * @see https://cloud.google.com/functions
 * @see https://cloud.google.com/sdk/gcloud/reference/functions/deploy
 */
await execa(
  `gcloud`,
  [
    ...["beta", "functions", "deploy", fnName],
    userInfo().username === "koistya" && `--account=koistya@chainfuse.io`,
    `--project=chainfuse`, // ${$.env.GOOGLE_CLOUD_PROJECT}
    `--region=${$.env.GOOGLE_CLOUD_REGION}`,
    `--allow-unauthenticated`,
    `--entry-point=api`,
    `--gen2`,
    `--memory=1G`,
    `--runtime=nodejs16`,
    `--source=.`,
    `--timeout=30s`,
    `--env-vars-file=env.yml`,
    `--min-instances=0`,
    `--max-instances=2`,
    `--trigger-http`,
  ].filter(Boolean),
  { stdio: "inherit", cwd: path.resolve(__dirname, "../api/dist") }
).catch((err) => {
  process.exitCode = err.exitCode;
  console.error("\n" + chalk.redBright(err.command));
  return Promise.resolve();
});
