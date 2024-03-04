import request from "supertest";
import server from "../core/server.js";

test("GET /api/never", async () => {
  const res = await request(server)
    .get("/api/never")
    .accept("application/json");

  expect({
    status: res.statusCode,
    body: res.body,
  }).toMatchInlineSnapshot(`
    {
      "body": {
        "message": "Not Found",
      },
      "status": 404,
    }
  `);
});
