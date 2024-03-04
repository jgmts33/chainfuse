import { importPKCS8, KeyLike, SignJWT } from "jose";
import env from "../core/env.js";
import { Forbidden, Unauthorized } from "../core/errors.js";
import { auth } from "../core/firebase.js";
import router from "../core/router.js";

const cookieName =
  env.APP_ENV === "prod" ? "id" : `chainfuse_id_${env.APP_ENV}`;
const expiresIn = 60 * 60 * 24 * 30; // one month
let key: KeyLike;

/**
 * Creates a session JWT-based cookie that can be used for
 * detecting the user's identity early on (during HTML page rendering)
 */
router.post("/api/session", async (req, res) => {
  const idToken = req.get("Authorization")?.replace(/^Bearer\s+/i, "");

  console.log("%cidToken", "font-size: 20px; color: red;", idToken);

  if (!idToken) {
    throw new Unauthorized();
  }

  try {
    // Verify the user's ID token issued by Firebase Auth / Google Cloud Identity
    const user = await auth.verifyIdToken(idToken, true);

    console.log("%cUser", "font-size: 20px; color: green;", user);

    if (!key) {
      key = await importPKCS8(
        env.GOOGLE_CLOUD_CREDENTIALS.private_key,
        "RS256"
      );
    }

    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + expiresIn;

    // Generate a JWT token to be used as a session cookie
    // NOTE: `createSessionCookie()` from Firebase doesn't allow creating
    //       a session cookie with an expiration date greater than 2 weeks
    const jwt = await new SignJWT({
      iss: `https://${env.APP_HOSTNAME}`,
      aud: user.aud,
      sub: user.sub,
      email: user.email,
    })
      .setProtectedHeader({ alg: "RS256", typ: "JWT" })
      .setIssuedAt(issuedAt)
      .setExpirationTime(issuedAt + expiresIn)
      .sign(key);

    console.log("SETTING COOKIE!!!!!!");

    res.cookie(cookieName, jwt, {
      httpOnly: true,
      secure: true,
      expires: new Date(expiresAt * 1000),
    });

    res.status(200);
    res.end();
  } catch (err) {
    console.error(err);
    throw new Forbidden((err as Error)?.message);
  }
});

/**
 * Deletes a session cookie.
 */
router.delete("/api/session", (req, res) => {
  res.clearCookie(cookieName);
  res.status(200);
  res.end();
});
