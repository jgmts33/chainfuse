import { db } from "./firebase.js";

test("firebase.db", async () => {
  const doc = await db.collection("sites").doc("beta").get();
  expect(doc.data()).toMatchInlineSnapshot(`
    {
      "env": {
        "TAGLINE": "ChainFuse",
      },
      "template": "chainfuse",
      "version": "latest",
    }
  `);
});
