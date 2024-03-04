import * as cookie from "cookie";
import { decodeProtectedHeader, importX509, jwtVerify, KeyLike } from "jose";
import { default as QuickLRU } from "quick-lru";

const keys = new QuickLRU<string, KeyLike>({ maxSize: 100, maxAge: 21600000 });

export async function verifySessionCookie(req: Request, env: Env) {
  const envName = env.APP_ENV;
  const cookies = cookie.parse(req.headers.get("cookie") ?? "");
  const cookieName = envName === "prod" ? `id` : `chainfuse_id_${envName}`;
  const sessionCookie = cookies[cookieName];

  if (sessionCookie) {
    const credentials = JSON.parse(env.GOOGLE_CLOUD_CREDENTIALS);
    const { private_key_id: kid, client_x509_cert_url: certUrl } = credentials;
    let key = keys.get(kid);

    if (!key) {
      const { alg } = decodeProtectedHeader(sessionCookie) as JwtHeader;
      const res = await fetch(certUrl);
      const data = await res.json<Record<string, string>>();
      key = await importX509(data[kid], alg);
      const cacheControl = res.headers.get("cache-control") ?? "";
      const maxAge = Number(cacheControl.match(/max-age=(\d+)/)?.[1]) * 1000;
      keys.set(kid, key, { maxAge });
    }

    // See `/api/routes/session.ts` where the session cookie is created
    const { payload } = await jwtVerify(sessionCookie, key, {
      issuer: `https://${env.APP_HOSTNAME}`,
      audience: env.GOOGLE_CLOUD_PROJECT,
      maxTokenAge: 60 * 60 * 24 * 30,
    });

    const now = Date.now() / 1000;
    const token = payload as Token;

    if (!(token.iat < now)) {
      throw new Error("Issued-at time must be in the past.");
    }

    return token;
  }
}

type Token = {
  iss: string;
  aud: string;
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

type JwtHeader = {
  alg: string;
  kid: string;
};
