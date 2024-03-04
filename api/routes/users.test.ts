import { default as request } from "supertest";
import { createIdToken } from "../core/firebase.js";
import server from "../core/server.js";

let token: string;

beforeAll(async () => {
  token = await createIdToken("koistya@chainfuse.io");
});

test("GET /api/users", async () => {
  const res = await request(server)
    .get("/api/users")
    .auth(token, { type: "bearer" });

  expect({
    status: res.status,
    body: res.body,
  }).toEqual(
    expect.objectContaining({
      status: 200,
      body: expect.objectContaining({
        users: expect.arrayContaining([
          expect.objectContaining({
            uid: expect.any(String),
            email: expect.any(String),
            displayName: expect.any(String),
          }),
        ]),
      }),
    })
  );
});
