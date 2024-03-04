import { getAuthToken } from "web-auth-library/google";

/**
 * Get the website metadata for the target URL hostname.
 *
 * @example
 *   getSite("https://beta.chainfuse.com", env, ctx)
 *   // => {
 *     template: "chainfuse",
 *     version: "latest",
 *     env: {}
 *   }
 */
export async function getSite(
  url: URL,
  env: Env,
  ctx: ExecutionContext
): Promise<Site | undefined> {
  const hostname = url.hostname;
  let id = null as string | null;

  // Get the website ID from the URL. For example:
  //   "https://affirm.chainfuse.com" => "affirm" (production)
  //   "https://affirm-test.chainfuse.com" => "affirm" (test/QA)
  if (hostname.endsWith(".chainfuse.com")) {
    id = url.hostname.substring(0, url.hostname.indexOf("."));
    if (env.APP_ENV !== "prod" && id.includes("-")) {
      id = id.substring(0, id.lastIndexOf("-"));
    }
  }

  const cacheKey = `https://chainfuse.com/sites/${env.APP_ENV}/${id ?? hostname}`; // prettier-ignore
  const res = await caches.default.match(cacheKey);

  if (res) {
    const lastModified = res.headers.get("last-modified");

    if (
      lastModified &&
      new Date(lastModified) < new Date(Date.now() - 10 * 60 * 1000)
    ) {
      ctx.waitUntil(
        (async () => {
          const site = await fetchSite(id, hostname, env);
          if (site) {
            caches.default.put(cacheKey, createResponse(site));
          }
        })()
      );
    }

    return await res.json();
  }

  const site = await fetchSite(id, hostname, env);

  if (site) {
    ctx.waitUntil(caches.default.put(cacheKey, createResponse(site)));
  }

  return site;
}

async function fetchSite(
  id: string | null,
  hostname: string,
  env: Env
): Promise<Site | undefined> {
  const { accessToken } = await getAuthToken({
    credentials: env.GOOGLE_CLOUD_CREDENTIALS,
    scope: [
      "https://www.googleapis.com/auth/cloud-platform",
      "https://www.googleapis.com/auth/datastore",
    ],
  });

  const documentsUrl = `https://firestore.googleapis.com/v1/projects/${env.GOOGLE_CLOUD_PROJECT}/databases/(default)/documents`;

  if (id) {
    const res = await fetch(`${documentsUrl}/sites/${id}`, {
      headers: {
        [`Authorization`]: `Bearer ${accessToken}`,
        [`Content-Type`]: `application/json`,
      },
    });

    if (res.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await res.json<any>();
      return toJSON(data);
    } else {
      console.error(res.url, res.status, res.statusText);
    }
  } else {
    const res = await fetch(`${documentsUrl}:runQuery`, {
      method: "POST",
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "sites" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "hostname" },
              op: "EQUAL",
              value: { stringValue: hostname },
            },
          },
        },
      }),
      headers: {
        [`Authorization`]: `Bearer ${accessToken}`,
        [`Content-Type`]: `application/json`,
      },
    });

    if (res.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await res.json<any>();
      if (data.length === 1) {
        return toJSON(data[0].document);
      } else {
        console.error(res.url, `sites:`, data.length);
      }
    } else {
      console.error(res.url, res.status, res.statusText);
    }
  }
}

function createResponse(site: Site): Response {
  return Response.json(site, {
    headers: {
      [`Last-Modified`]: new Date().toISOString(),
      [`Cache-Control`]: "public, max-age=86400",
    },
  });
}

/**
 * Converts Firestore field object into plain data
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toValue(field: any): any {
  return "integerValue" in field
    ? Number(field.integerValue)
    : "doubleValue" in field
    ? Number(field.doubleValue)
    : "arrayValue" in field
    ? field.arrayValue.values.map(toValue)
    : "mapValue" in field
    ? toJSON(field.mapValue)
    : Object.entries(field)[0][1];
}

/**
 * Converts Firestore document into a plain data object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toJSON(document: any): any {
  const { fields, ...other } = document;

  // #region Normalize Firestore entity metadata

  if (other.name) {
    other.id = other.name.substring(other.name.lastIndexOf("/") + 1);
    delete other.name;
  }

  if (other.createTime) {
    other.created = other.createTime;
    delete other.createTime;
  }

  if (other.updateTime) {
    other.updated = other.updateTime;
    delete other.updateTime;
  }

  // #endregion

  return {
    ...other,
    ...Object.fromEntries(
      Object.entries(fields ?? {}).map(([key, field]) => [key, toValue(field)])
    ),
  };
}

export type Site = {
  userId: string;
  project: string;
  template: string;
  version: string;
  name: string;
  description: string;
  logoUrl: string;
  hostname?: string;
  lastModified: string;
  env: Record<string, string>;
};
