import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { got } from "got";
import env from "./env.js";

export const app = initializeApp({
  credential: cert({
    projectId: env.GOOGLE_CLOUD_CREDENTIALS.project_id,
    privateKey: env.GOOGLE_CLOUD_CREDENTIALS.private_key,
    clientEmail: env.GOOGLE_CLOUD_CREDENTIALS.client_email,
  }),
  projectId: env.GOOGLE_CLOUD_PROJECT,
});

export const auth = getAuth(app);
export const db = getFirestore(app);

/**
 * Generates an ID token that can be used during unit tests
 */
export async function createIdToken(
  uid: string,
  claims?: Record<string, unknown>
): Promise<string> {
  const user = uid.includes("@")
    ? await auth.getUserByEmail(uid)
    : await auth.getUser(uid);
  if (!user) throw new Error("User not found");
  const token = await auth.createCustomToken(user.uid, claims);
  const url = new URL(
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken"
  );
  url.searchParams.set("key", env.FIREBASE_API_KEY);
  const res = await got
    .post(url, { json: { token, returnSecureToken: true } })
    .json<{ idToken: string }>();
  return res.idToken;
}
