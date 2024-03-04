import { customAlphabet } from "nanoid";
import request from "supertest";
import { createIdToken, db } from "../core/firebase.js";
import server from "../core/server.js";

const newId = customAlphabet("0123456789abcdef", 5);

test("POST /api/projects/:id", async () => {
  const id = newId();
  const idToken = await createIdToken("koistya@chainfuse.io");

  // Create a new project
  const res = await request(server)
    .post(`/api/projects/test-${id}`)
    .auth(idToken, { type: "bearer" })
    .send({ name: `Test ${id}` });

  expect({ status: res.statusCode, body: res.body }).toEqual(
    expect.objectContaining({
      status: 200,
      body: expect.objectContaining({
        id: `test-${id}`,
        name: `Test ${id}`,
        userId: `DLu8masTNZOEwYOvGWTEs5QeKjT2`,
      }),
    })
  );

  // Attempt to create a new project with the same ID
  const createRes = await request(server)
    .post(`/api/projects/test-${id}`)
    .auth(idToken, { type: "bearer" })
    .send({ name: `Test ${id} New` });

  expect({
    status: createRes.statusCode,
    body: createRes.body,
  }).toMatchInlineSnapshot(`
    {
      "body": {
        "errors": {
          "id": [
            "Not available.",
          ],
        },
        "message": "Bad Request",
      },
      "status": 400,
    }
  `);

  const deleteRes = await request(server)
    .delete(`/api/projects/test-${id}`)
    .auth(idToken, { type: "bearer" });

  expect(deleteRes.statusCode).toBe(200);

  // Create a new project
  const invalidRes = await request(server)
    .post(`/api/projects/test-${id}!`)
    .auth(idToken, { type: "bearer" })
    .send({ name: `T` });

  expect({
    status: invalidRes.statusCode,
    body: invalidRes.body,
  }).toMatchInlineSnapshot(`
    {
      "body": {
        "errors": {
          "id": [
            "Can only contain letters, numbers and dash characters.",
          ],
          "name": [
            "Must be at least 2 characters long.",
          ],
        },
        "message": "Bad Request",
      },
      "status": 400,
    }
  `);
});

afterAll(async () => {
  const snap = await db.collection("projects").get();
  const queue = [];

  for (const doc of snap.docs) {
    if (/^test-[a-e0-9]{5}$/.test(doc.id)) {
      queue.push(doc.ref.delete());
    }
  }

  await Promise.all(queue);
});
