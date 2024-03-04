import functions from "@google-cloud/functions-framework";
import { getTestServer } from "@google-cloud/functions-framework/testing";
import { api } from "../index.js";

functions.http("api", api);

/**
 * Node.js server to be used in unit tests.
 */
const server = getTestServer("api");

/**
 * Launches Node.js server when running the app in
 * development (watch) mode via `yarn api:start`.
 */
if (process.env.ROLLUP_WATCH === "true") {
  const port = process.env.PORT ?? 8080;
  const envName = `\x1b[92m${process.env.APP_ENV}\x1b[0m`;
  const url = `\x1b[94mhttp://localhost:${port}/\x1b[0m`;

  server.listen(port, function () {
    console.log(`API listening on ${url} (env: ${envName})`);
  });

  process.once("SIGTERM", () => server.close());
}

export default server;
