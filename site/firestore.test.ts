import { jest } from "@jest/globals";
import { getSite } from "./firestore.js";

test("firestore.getSite(url, env, ctx)", async () => {
  const ctx = createContext();
  const env = getMiniflareBindings();
  const site = await getSite(new URL("https://beta.chainfuse.com/"), env, ctx);
  expect(anonymize(site)).toMatchInlineSnapshot(`
    {
      "created": "0000-00-00T00:00:00.000000Z",
      "env": {
        "TAGLINE": "ChainFuse",
      },
      "id": "beta",
      "template": "chainfuse",
      "updated": "0000-00-00T00:00:00.000000Z",
      "version": "latest",
    }
  `);
});

function anonymize(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>
): Record<string, unknown> | undefined {
  return (
    data && {
      ...data,
      ...("created" in data && {
        created: data.created?.replace(/\d/g, "0"),
      }),
      ...("updated" in data && {
        updated: data.updated?.replace(/\d/g, "0"),
      }),
    }
  );
}

function createContext(): ExecutionContext {
  return {
    waitUntil: jest.fn(),
    passThroughOnException: jest.fn(),
  };
}
