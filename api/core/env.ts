import { cleanEnv, json, str } from "envalid";
import { CredentialBody } from "google-auth-library";

export default cleanEnv(process.env, {
  APP_ENV: str({ choices: ["local", "test", "prod"] }),
  APP_NAME: str(),
  APP_HOSTNAME: str(),
  CLOUDFLARE_ACCOUNT_ID: str(),
  CLOUDFLARE_ZONE_ID: str(),
  CLOUDFLARE_API_TOKEN: str(),
  GOOGLE_CLOUD_PROJECT: str(),
  OPENAI_API_KEY: str(),
  PINATA_API_KEY: str(),
  PINATA_SECRET_KEY: str(),
  GOOGLE_CLOUD_CREDENTIALS: json<GoogleCredentials>(),
  FIREBASE_API_KEY: str(),
  UPLOAD_BUCKET: str(),
  ASSETS_BUCKET: str(),
});

interface GoogleCredentials extends Required<CredentialBody> {
  project_id: string;
  token_uri: string;
}
