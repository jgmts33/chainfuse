import { default as request } from "supertest";
import server from "../core/server.js";

test("GET /api/templates", async () => {
  const res = await request(server).get("/api/templates");

  expect({
    statusCode: res.statusCode,
    body: res.body,
  }).toEqual(
    expect.objectContaining({
      statusCode: 200,
      body: expect.arrayContaining([
        {
          id: "marketplace",
          name: "NFT Marketplace",
          description:
            "Launch your own Decentralized NFT marketplace, filled with the tools you need to grow a community.",
        },
      ]),
    })
  );
});
