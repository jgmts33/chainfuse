import * as Cloudflare from "cloudflare-client";
import env from "./env.js";

export const customHostnames = Cloudflare.customHostnames({
  zoneId: env.CLOUDFLARE_ZONE_ID,
  accessToken: env.CLOUDFLARE_API_TOKEN,
});

export const dnsRecords = Cloudflare.dnsRecords({
  zoneId: env.CLOUDFLARE_ZONE_ID,
  accessToken: env.CLOUDFLARE_API_TOKEN,
});
