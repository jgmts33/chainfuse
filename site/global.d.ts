/* SPDX-FileCopyrightText: 2020-present Kriasoft */
/* SPDX-License-Identifier: MIT */

declare module "__STATIC_CONTENT_MANIFEST" {
  const JSON: string;
  export default JSON;
}

declare type Env = {
  APP_ENV: "local" | "test" | "prod";
  APP_NAME: string;
  APP_HOSTNAME: string;
  API_ORIGIN: string;
  TEMPLATES_URL: string;
  GOOGLE_CLOUD_PROJECT: string;
  GOOGLE_CLOUD_CREDENTIALS: string;
  __STATIC_CONTENT: Record<string, string>;
};

declare function getMiniflareBindings<Bindings = Env>(): Bindings;
