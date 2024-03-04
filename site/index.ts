/* SPDX-FileCopyrightText: 2020-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { verifySessionCookie } from "./auth.js";
import { getSite } from "./firestore.js";
import { transform } from "./transform.js";

const WEBFLOW_ORIGIN = "https://chainfuse-033d02.webflow.io";

export default {
  /**
   * Cloudflare Workers script acting as a reverse proxy for these URLs:
   *
   *   - *.chainfuse.com/*            - *-test.chainfuse.com
   *   - chainfuse.com/api/sites      - test.chainfuse.com/api/sites
   *   - chainfuse.com/api/sites/*    - test.chainfuse.com/api/sites/*
   */
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    const { pathname: path, search, hostname } = url;

    if (path.includes("app-ads")) {
      const res = await fetch(
        `https://storage.googleapis.com/templates.chainfuse.com/app-latest/app-ads.txt`,
        req
      );

      return res;
    }

    // Rewrite API requests to a GCF endpoint
    if (path.startsWith("/api/")) {
      return await fetch(`${env.API_ORIGIN}${path}${search}`, req);
    }

    // Handle requests to https://chainfuse.com (vs https://<site>.chainfuse.com)
    if (hostname === env.APP_HOSTNAME) {
      // Attempt to verify the session cookie if it exists in order
      // to identify the user before sending an HTML page response
      try {
        const idToken = await verifySessionCookie(req, env);

        // In the case when user is authenticated, redirect from the
        // home (landing) page to the customer dashboard
        if (idToken && path === "/") {
          return Response.redirect(
            `https://${env.APP_HOSTNAME}/templates`,
            302
          );
        }

        // Redirect to signed in if no token
        if (path === "/onboard") {
          const res = await fetch(
            `${`${"https://storage.googleapis.com/templates.chainfuse.com"}/app-latest`}/index.html`,
            req
          );

          return res;
        }
      } catch (err) {
        console.error((err as Error)?.message);
      }

      // Serve landing page(s)
      // https://webflow.com/design/chainfuse-033d02 - design and layout
      // https://chainfuse-033d02.webflow.io/?edit=1 - content editor
      return await fetch(`${WEBFLOW_ORIGIN}${path}${search}`, req);
    }

    // Get the target website metadata from Firestore
    // https://console.cloud.google.com/firestore/data/sites?project=chainfuse
    const site = await getSite(url, env, ctx);

    // TEMP: Testing/debugging endpoint
    if (path === "/echo") {
      return Response.json({
        APP_ENV: env.APP_ENV,
        APP_NAME: env.APP_NAME,
        APP_HOSTNAME: env.APP_HOSTNAME,
        TEMPLATES_URL: env.TEMPLATES_URL,
        headers: Object.fromEntries(req.headers.entries()),
        cf: req.cf,
        site,
      });
    }

    if (!site) {
      return Response.redirect(`https://${env.APP_HOSTNAME}/`, 302);
    }

    // Get the URL of the target template in GCS
    const templateUrl = `${env.TEMPLATES_URL}/${site.template}-${site.version}`;

    if (
      path.startsWith("/_next/") ||
      path.startsWith("/assets/") ||
      path.endsWith(".png") ||
      path.endsWith(".jpg") ||
      path.endsWith(".jpeg") ||
      path.endsWith(".css") ||
      path.endsWith(".ico") ||
      path.endsWith(".svg") ||
      path.endsWith(".json") ||
      path.endsWith(".js") ||
      path.endsWith(".txt")
    ) {
      return fetch(`${templateUrl}${path}${search}`, req);
    }

    // Load `index.html` markup
    const res = await fetch(`${templateUrl}/index.html`, req);

    // Normalize environment variables that will be serialized
    // and injected into the client-side app
    const envVars: any = {
      ...site,
    };

    // Inject environment variables and serve back to the client
    return transform(res, envVars, site);
  },
} as Required<Pick<ExportedHandler<Env>, "fetch">>;
