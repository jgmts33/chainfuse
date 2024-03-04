import { URL } from "node:url";
import request from "supertest";
import { createIdToken } from "../core/firebase.js";
import server from "../core/server.js";

test("POST /api/upload", async () => {
  const idToken = await createIdToken("koistya@chainfuse.io");

  // Request a new upload URL
  const res = await request(server)
    .post("/api/upload")
    .auth(idToken, { type: "bearer" })
    .send({ filename: "test.png", type: "image/png" });

  expect(res.status).toEqual(200);

  // Anonymize
  const url = new URL(res.body);
  url.searchParams.delete("X-Goog-Signature");
  url.searchParams.delete("X-Goog-Date");
  url.searchParams.delete("X-Goog-Expires");
  url.searchParams.delete("X-Goog-Credential");
  url.pathname = url.pathname.replace(/\w+\./, "xxxxx.");

  expect(url).toMatchInlineSnapshot(
    `"https://test-upload.chainfuse.com/xxxxx.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-SignedHeaders=content-type%3Bhost"`
  );
});

test("POST /api/upload (unauthorized)", async () => {
  const errRes = await request(server).post("/api/upload").send({});

  expect({ status: errRes.status, body: errRes.body }).toMatchInlineSnapshot(`
    {
      "body": {
        "message": "Unauthorized",
      },
      "status": 401,
    }
  `);
});

test("POST /api/upload (validation)", async () => {
  const idToken = await createIdToken("koistya@chainfuse.io");
  const errRes = await request(server)
    .post("/api/upload")
    .auth(idToken, { type: "bearer" })
    .send({});

  expect({ status: errRes.status, body: errRes.body }).toMatchInlineSnapshot(`
    {
      "body": {
        "errors": {
          "filename": [
            "Required",
          ],
          "type": [
            "Required",
          ],
        },
        "message": "Bad Request",
      },
      "status": 400,
    }
  `);
});
