import { customAlphabet } from "nanoid";
import { default as request, default as supertest } from "supertest";
import { createIdToken, db } from "../core/firebase.js";
import server from "../core/server.js";
import { getHostname } from "./sites.js";

const newId = customAlphabet("0123456789abcdef", 5);
let token: string;
let project: string;

beforeAll(async () => {
  const projectId = newId();
  token = await createIdToken("koistya@chainfuse.io");
  const res = await request(server)
    .post(`/api/projects/test-${projectId}`)
    .auth(token, { type: "bearer" })
    .send({ name: `Test ${projectId}` });
  project = res.body.id;
});

test("GET /api/sites (list)", async () => {
  // Fetch the list of customer websites
  const res = await request(server)
    .get("/api/sites")
    .auth(token, { type: "bearer" });

  expect({
    status: res.status,
    body: res.body,
  }).toEqual(
    expect.objectContaining({
      status: 200,
      body: expect.arrayContaining([
        expect.objectContaining({
          template: expect.any(String),
          version: expect.any(String),
        }),
      ]),
    })
  );
});

test.each([
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://192.168.1.10:5173",
  "https://test-xxx.chainfuse.com",
])(`OPTIONS /api/sites/test-xxx`, async (origin) => {
  const res = await request(server)
    .options(`/api/sites/test-xxx`)
    .set("Origin", origin);

  expect({ status: res.status, headers: res.headers }).toEqual(
    expect.objectContaining({
      status: 204,
      headers: expect.objectContaining({
        "access-control-allow-origin": origin,
        "access-control-allow-headers": "Accept, Content-Type",
        "access-control-allow-methods": "GET, OPTIONS",
        "access-control-max-age": "86400",
      }),
    })
  );
});

test.each([
  "https://xxx.chainfuse.com",
  "https://example.com",
  "http://200.200.200.200:5173",
])(`OPTIONS /api/sites/test-xxx`, async (origin) => {
  const res = await request(server)
    .options(`/api/sites/test-xxx`)
    .set("Origin", origin);

  expect(res.statusCode).toBe(204);
  expect(res.get("access-control-allow-origin")).toBeUndefined();
});

test(`GET /api/sites/test-xxx`, async () => {
  const id = newId();

  // Attempt to read a non-existent customer website
  const getRes = await request(server).get(`/api/sites/test-${id}`);

  expect({
    status: getRes.statusCode,
    body: getRes.body,
  }).toEqual(
    expect.objectContaining({
      status: 404,
      body: { message: "Not Found" },
    })
  );

  const deployId = `test-${id}`;

  // Create a new customer website
  const createRes = await request(server)
    .post(`/api/sites/test-${id}`)
    .auth(token, { type: "bearer" })
    .accept("application/json")
    .send({
      project,
      deployId,
      avatar: "https://test-upload.chainfuse.com/0l5b0nciyrw1.png",
      acceptPayments: true,
      address: "0x5490c09DD6d1a6F7C58f07947332d151cAB9C834",
      linkedIn: "https://www.linkedin.com/company/chainfuse/",
      telegram: "https://t.me/chainfuse",
      template: "profile",
      version: "latest",
      name: "My Website",
      description: "Website summary",
      tagline: "Test tagline",
      logoUrl: "https://test-upload.chainfuse.com/0l5b0nciyrw1.png",
      logoRectangleUrl: "https://test-upload.chainfuse.com/0l5b0nciyrw1.png",
      signature: "xxxxx",
      hash: "xxxxx",
      chainId: 1,
      signatureParameters: {
        creator: {
          v: "0xbf2Cf9763a0A506579d7670568e946086eFb9F97",
          t: "address",
        },
        operation: {
          t: "string",
          v: "mint",
        },
        nonce: {
          v: "5n49f",
          t: "string",
        },
        registrationId: {
          v: 104,
          t: "uint",
        },
        price: {
          t: "uint",
          v: 200000000000000000,
        },
      },
    });

  expect({
    status: createRes.statusCode,
    body: anonymize(createRes.body),
  }).toMatchInlineSnapshot(`
    {
      "body": {
        "acceptPayments": true,
        "address": "0x5490c09DD6d1a6F7C58f07947332d151cAB9C834",
        "avatar": "https://test-upload.chainfuse.com/0l5b0nciyrw1.png",
        "created": "0000-00-00T00:00:00.000Z",
        "deployId": "test-xxxxx",
        "description": "Website summary",
        "id": "test-xxxxx",
        "linkedIn": "https://www.linkedin.com/company/chainfuse/",
        "name": "My Website",
        "project": "test-xxxxx",
        "telegram": "https://t.me/chainfuse",
        "template": "profile",
        "updated": "0000-00-00T00:00:00.000Z",
        "userId": "DLu8masTNZOEwYOvGWTEs5QeKjT2",
        "version": "latest",
      },
      "status": 200,
    }
  `);

  expect(createRes.body.id).toMatch(createRes.body.deployId);

  // Set `hostname` value on the existing customer website
  const patchRes = await request(server)
    .patch(`/api/sites/test-${id}`)
    .auth(token, { type: "bearer" })
    .send({ hostname: `test-${id}.koistya.com` });

  expect({
    statusCode: patchRes.statusCode,
    body: anonymize(patchRes.body),
  }).toMatchInlineSnapshot(`
    {
      "body": {
        "acceptPayments": true,
        "address": "0x5490c09DD6d1a6F7C58f07947332d151cAB9C834",
        "avatar": "https://test-upload.chainfuse.com/0l5b0nciyrw1.png",
        "created": "0000-00-00T00:00:00.000Z",
        "deployId": "test-xxxxx",
        "description": "Website summary",
        "hostname": "test-xxxxx.koistya.com",
        "hostnameId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "id": "test-xxxxx",
        "linkedIn": "https://www.linkedin.com/company/chainfuse/",
        "name": "My Website",
        "project": "test-xxxxx",
        "telegram": "https://t.me/chainfuse",
        "template": "profile",
        "updated": "0000-00-00T00:00:00.000Z",
        "userId": "DLu8masTNZOEwYOvGWTEs5QeKjT2",
        "version": "latest",
      },
      "statusCode": 200,
    }
  `);

  // Fetch the custom hostname status
  const hostnameRes = await request(server)
    .get(`/api/sites/test-${id}/hostname`)
    .auth(token, { type: "bearer" });

  expect({
    statusCode: hostnameRes.statusCode,
    body: hostnameRes.body,
  }).toEqual(
    expect.objectContaining({
      statusCode: 200,
      body: expect.objectContaining({
        hostname: `test-${id}.koistya.com`,
        status: `pending`,
      }),
    })
  );

  // Delete customer website
  const delRes = await request(server)
    .delete(`/api/sites/test-${id}`)
    .auth(token, { type: "bearer" });

  expect({
    status: delRes.statusCode,
    body: delRes.body,
  }).toEqual(
    expect.objectContaining({
      status: 200,
      body: { id: `test-${id}` },
    })
  );
}, 15000);

afterAll(async () => {
  const queue: supertest.Test[] = [];
  const res = await request(server)
    .get("/api/sites")
    .auth(token, { type: "bearer" });

  res.body.forEach((site: { id: string }) => {
    if (/^test-[0-9a-f]{5}$/.test(site.id)) {
      queue.push(
        request(server)
          .delete(`/api/sites/${site.id}`)
          .auth(token, { type: "bearer" })
      );
    }
  });

  queue.push(
    request(server)
      .delete(`/api/projects/${project}`)
      .auth(token, { type: "bearer" })
  );

  await Promise.all(queue);
  await db.terminate();
}, 15000);

test("getHostname(workspaceId, baseHostname)", () => {
  const prod = getHostname("example", "chainfuse.com");
  const test = getHostname("example", "test.chainfuse.com");

  expect({ prod, test }).toMatchInlineSnapshot(`
    {
      "prod": "example.chainfuse.com",
      "test": "example-test.chainfuse.com",
    }
  `);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function anonymize(input: any): any {
  const output = input && { ...input };

  if (output?.id) {
    output.id = output.id.replace(/-\w{5}/, "-xxxxx");
  }

  if (output?.deployId) {
    output.deployId = output.deployId.replace(/-\w{5}/, "-xxxxx");
  }

  if (output?.project) {
    output.project = output.project.replace(/-\w{5}/, "-xxxxx");
  }

  if (output?.hostname) {
    output.hostname = output.hostname.replace(/-\w{5}/, "-xxxxx");
  }

  if (output?.created) {
    output.created = output.created.replace(/\d/g, "0");
  }

  if (output?.updated) {
    output.updated = output.created.replace(/\d/g, "0");
  }

  if (output?.hostnameId) {
    output.hostnameId = output.hostnameId.replace(/\w/g, "x");
  }

  return output;
}
