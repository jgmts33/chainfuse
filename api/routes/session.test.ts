import request from "supertest";
import { createIdToken } from "../core/firebase.js";
import server from "../core/server.js";

test("POST /api/session", async () => {
  const idToken = await createIdToken("koistya@chainfuse.io");

  const res = await request(server)
    .post(`/api/session`)
    .auth(idToken, { type: "bearer" })
    .send();

  expect({ status: res.status, body: res.body }).toMatchInlineSnapshot(`
    {
      "body": {},
      "status": 200,
    }
  `);

  // chainfuse_id_local=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0ZXN0LmNoYWluZnVzZS5jb20iLCJhdWQiOiJjaGFpbmZ1c2UtdGVzdCIsInN1YiI6IkRMdThtYXNUTlpPRXdZT3ZHV1RFczVRZUtqVDIiLCJlbWFpbCI6ImtvaXN0eWFAY2hhaW5mdXNlLmlvIiwiaWF0IjoxNjY0NDgzNjEzLCJleHAiOjE2NjcwNzU2MTN9.EcUXgdWADyfr_smI5IeFb9DXwRhdZ7LYaWVJOSby7EZsR9CkgbTjMr5ffACmX3DcnsiF29vLecxs24L8MFXB1hhgrcSkNX7Pdvo8N8s7VEsmc11nfchHsBqlVtekgeP90qEXxf82A4d6Z-oiwJIVH_aRNJjVjh-d-XjPhfUAini9z-vRdNMebJsN7Lv2epFE7yEB1BpOo0avbif3fjQBLtXtczXcOJ_-fa7Axkpbvew4dknKn5PNrCS0Z6ok-CauSzoajICl6fhM5HA2M1hO1vAiKXtWkgU7ZmVgOv44A3iMu-A1Q6gD62OVO9MnkVkE9zhyJpnczquzujSQs13TZw; Path=/; Expires=Sat, 29 Oct 2022 20:33:33 GMT; HttpOnly; Secure
  const cookie = res.get("Set-Cookie")?.[0];

  expect(cookie).toBeTruthy();
  expect(cookie.includes("HttpOnly")).toBe(true);
  expect(cookie.includes("Secure")).toBe(true);
});

test("DELETE /api/session", async () => {
  const res = await request(server).delete(`/api/session`).send();

  expect({ status: res.status, body: res.body }).toMatchInlineSnapshot(`
    {
      "body": {},
      "status": 200,
    }
  `);

  const cookie = res.get("Set-Cookie")?.[0];
  expect(cookie).toMatchInlineSnapshot(
    `"chainfuse_id_local=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"`
  );
});
