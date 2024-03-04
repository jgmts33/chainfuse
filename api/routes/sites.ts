import { Request, Response } from "express";
import {
  DocumentData,
  DocumentSnapshot,
  FieldValue,
} from "firebase-admin/firestore";
import { ZodError, ZodIssueCode } from "zod";
import { customHostnames } from "../core/cloudflare.js";
import env from "../core/env.js";
import { Forbidden, NotFound, Unauthorized } from "../core/errors.js";
import { db } from "../core/firebase.js";
import router from "../core/router.js";
import { createValidator } from "../core/validator.js";

async function setCors(
  req: Request,
  res: Response,
  site?: DocumentSnapshot<DocumentData>
) {
  const origin = req.get("origin");
  const { id } = req.params;

  if (origin) {
    // CORS for local development and preview sites
    let allow =
      origin === `https://${id}.chainfuse.com` ||
      origin === `https://${id}-test.chainfuse.com` ||
      origin.startsWith("http://localhost:") ||
      /^https?:\/\/192\.168\.\d+\.\d+:\d+$/.test(origin) ||
      /^https?:\/\/127\.0\.\d+\.\d+:\d+$/.test(origin) ||
      /^https?:\/\/172\.\d+\.\d+\.\d+:\d+$/.test(origin);

    // CORS for custom domains
    if (!allow && `https://${env.APP_HOSTNAME}` !== origin) {
      if (!site) site = await db.collection("sites").doc(id).get();
      const hostname = site.exists ? site.data()?.hostname : undefined;
      allow = hostname ? `https://${hostname}` === origin : false;
    }

    if (allow) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Headers", "Accept, Content-Type");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader("Access-Control-Max-Age", "86400");
    }
  }
}

export function toShortId(name: string, trim = true) {
  return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/^-+/, "")
    .replace(/--+/g, "-")
    .replace(/\s+/g, "-")
    .replace(trim ? /-+$/ : "", "");
}

/**
 * Fetches the list of customer websites
 */
router.get("/api/sites", async (req, res) => {
  if (!req.user) throw new Unauthorized();
  if (!req.user.email?.endsWith("@chainfuse.io")) throw new Forbidden();

  const sites = db.collection("sites");

  if (req.query.limit) {
    sites.limit(Number(req.query.limit));
  }

  if (req.query.offset) {
    sites.offset(Number(req.query.offset));
  }

  if (req.query.orderBy) {
    const [orderBy, dir] = (req.query.orderBy as string).split(",");
    sites.orderBy(
      orderBy,
      ["asc", "desc"].includes(dir) ? (dir as "asc" | "desc") : "asc"
    );
  }

  const sitesSnap = await sites.get();

  res.send(
    sitesSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created: doc.createTime?.toDate(),
      updated: doc.updateTime?.toDate(),
    }))
  );
});

router.get("/api/sites/user", async (req, res) => {
  if (!req.user) throw new Unauthorized();

  const sites = db.collection("sites");

  if (req.query.limit) {
    sites.limit(Number(req.query.limit));
  }

  if (req.query.offset) {
    sites.offset(Number(req.query.offset));
  }

  if (req.query.orderBy) {
    const [orderBy, dir] = (req.query.orderBy as string).split(",");
    sites.orderBy(
      orderBy,
      ["asc", "desc"].includes(dir) ? (dir as "asc" | "desc") : "asc"
    );
  }

  const sitesSnap = await sites.where("userId", "==", req.user.uid).get();

  res.send(
    sitesSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created: doc.createTime?.toDate(),
      updated: doc.updateTime?.toDate(),
    }))
  );
});

router.options("/api/sites/:id", async (req, res) => {
  await setCors(req, res);
  res.status(204);
  res.end();
});

/**
 * Fetches the customer's website metadata.
 */
router.get("/api/sites/:id", async (req, res) => {
  res.setHeader("Vary", "Accept-Encoding, Origin");

  const { id } = req.params;
  const snap = await db.collection("sites").doc(id).get();

  await setCors(req, res, snap);

  if (!snap.exists) {
    throw new NotFound();
  }

  const data = snap.data() ?? {};

  if (!req.user) {
    delete data.userId;
  }

  res.status(200).json({
    id: snap.id,
    ...snap.data(),
    created: snap.createTime?.toDate(),
    updated: snap.createTime?.toDate(),
  });
});

/**
 * Creates a new `site` record in Firestore as well as
 * the corresponding DNS record(s).
 */
router.post("/api/sites/:id", async (req, res) => {
  if (!req.user) throw new Unauthorized();

  const voucher = req.body.signatureParameters;
  const hash = req.body.hash;
  const signature = req.body.signature;
  const chainId = req.body.chainId;
  const template = req.body.template;

  let siteDoc = await db.collection("sites").doc(req.params.id).get();

  if (siteDoc.exists) {
    throw new ZodError([
      { code: ZodIssueCode.custom, message: "Not available.", path: ["id"] },
    ]);
  }

  const Z = createValidator(template, "create");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, hostname, ...input } = await Z.parse({
    ...req.body,
    id: req.params.id,
  });

  console.log("Creating site!", input);

  if (template === "token-drop") {
    await siteDoc.ref.create({
      ...input,
      voucher: {
        ...voucher,
        hash,
        signature,
        chainId,
      },
      deployId: siteDoc.id,
      // Add projectId (to filter by project also)
      userId: req.user.uid,
      lastModified: FieldValue.serverTimestamp(),
    });
  } else if (template === "profile") {
    await siteDoc.ref.create({
      ...input,
      deployId: siteDoc.id,
      userId: req.user.uid,
      lastModified: FieldValue.serverTimestamp(),
    });
  } else if (template === "ai") {
    await siteDoc.ref.create({
      ...input,
      deployId: siteDoc.id,
      userId: req.user.uid,
      lastModified: FieldValue.serverTimestamp(),
    });
  } else if (template === "marketplace") {
    await siteDoc.ref.create({
      ...input,
      deployId: siteDoc.id,
      userId: req.user.uid,
      lastModified: FieldValue.serverTimestamp(),
    });
  }

  if (hostname) {
    await createHostname(siteDoc, hostname);
  }

  siteDoc = await siteDoc.ref.get();

  res.status(200).json({
    id: siteDoc.id,
    ...siteDoc.data(),
    created: siteDoc.createTime?.toDate(),
    updated: siteDoc.createTime?.toDate(),
  });
});

/**
 * Allows to update the existing `site` record.
 */
router.patch("/api/sites/:id", async (req, res) => {
  // Check permissions
  if (!req.user) throw new Unauthorized();

  // Attempt to fetch the existing `site` record
  let siteDoc = await db.collection("sites").doc(req.params.id).get();

  // Throw an error if it doesn't exist
  if (!siteDoc.exists) throw new NotFound();

  console.log(siteDoc.data()?.userId, req.user.uid);

  if (siteDoc.data()?.userId !== req.user.uid) {
    throw new Forbidden();
  }

  // Validate user input
  const Z = createValidator(siteDoc.data()?.template, "update");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { hostname, ...input } = await Z.parse(req.body);

  // Save new data to Firestore
  if (Object.keys(input).length > 0) {
    await siteDoc.ref.update({
      ...input,
      lastModified: FieldValue.serverTimestamp(),
    });
  }

  if (hostname) {
    await createHostname(siteDoc, hostname);
  }

  siteDoc = await siteDoc.ref.get();

  res.send({
    id: siteDoc.id,
    created: siteDoc.createTime?.toDate(),
    updated: siteDoc.updateTime?.toDate(),
    ...siteDoc.data(),
  });
});

/**
 * Delete the site record from Firestore as well as all the linked
 * resources such as Custom Hostname in Cloudflare.
 */
router.delete("/api/sites/:id", async (req, res) => {
  if (!req.user) throw new Unauthorized();

  const { id } = req.params;
  const snap = await db.collection("sites").doc(id).get();
  const hostname = snap.data()?.hostname;

  if (!snap.exists) {
    throw new NotFound();
  }

  if (hostname) {
    await deleteHostname(hostname);
  }

  snap.ref.delete();
  res.send({ id });
});

/**
 * Fetch the hostname info (status) from Cloudflare.
 */
router.get("/api/sites/:id/hostname", async (req, res) => {
  if (!req.user) throw new Unauthorized();

  // Fetch the `site` record from Firestore
  const siteDoc = await db.collection("sites").doc(req.params.id).get();

  if (!siteDoc.exists) {
    throw new NotFound();
  }

  // TODO: Allow team member access
  if (siteDoc.data()?.userId !== req.user?.uid) {
    throw new Forbidden();
  }

  const hostname = siteDoc.data()?.hostname as string | undefined;

  if (!hostname) {
    throw new NotFound();
  }

  const hostnameId = siteDoc.data()?.hostnameId as string | undefined;

  if (hostnameId) {
    const record = await customHostnames.get(hostnameId);
    if (record) {
      res.send(record);
      return;
    }
  } else {
    const record = await customHostnames.find({ hostname }).first();
    if (record) {
      await siteDoc.ref.update({ hostnameId: record.id });
      res.send(record);
      return;
    }
  }

  // It's possible the the hostname exists in the primary (Firestore) database
  // but not in Cloudflare (e.g. was accidentally removed), in that case we
  // can create a new record in Cloudflare (as an edge case scenario).
  const record = await customHostnames.create({
    hostname,
    ssl: {
      method: "txt",
      type: "dv",
      settings: {
        min_tls_version: "1.0",
      },
    },
  });

  // And also update `hostnameId` in the primary (Firestore) database
  await siteDoc.ref.update({ hostnameId: record.id });

  res.send(record);
});

/**
 * Delete the custom hostname record from Cloudflare.
 */
router.delete("/api/sites/:id/hostname", async (req, res) => {
  if (!req.user) throw new Unauthorized();

  // Fetch the `site` record from Firestore
  const siteDoc = await db.collection("sites").doc(req.params.id).get();

  if (!siteDoc.exists) {
    throw new NotFound();
  }

  if (siteDoc.data()?.userId !== req.user?.uid) {
    throw new Forbidden();
  }

  const hostname = siteDoc.data()?.hostname as string | undefined;
  const hostnameId = siteDoc.data()?.hostnameId as string | undefined;

  // Verity that the custom hostname record actually exists before deleting
  const record = hostnameId
    ? await customHostnames.get(hostnameId)
    : await customHostnames.find({ hostname }).first();

  if (record) {
    await customHostnames.delete(record.id);
  }

  await siteDoc.ref.update({ hostname: null, hostnameId: null });

  res.status(204);
  res.end();
});

router.get("/api/sites/:id/data", async (req, res) => {
  res.status(200).json({
    id: "george",
    created: "2022-10-08T15:13:07.122296Z",
    updated: "2022-11-07T19:17:26.718430Z",
    project: "chainfuse-workspace",
    description:
      "The following AI is an expert in business development, giving advice to early stage startups to help them define focus, goto market, and roadmaps.",
    customUrlText: "Get your own profile @ CHAINFUSE.COM",
    telegram: "@chainfuse",
    profileName: "George Portillo",
    tenantId: "",
    title: "CEO @ ChainFuse.com",
    email: "hello@chainfuse.com",
    userId: "daskx2iwKjYFvuliwCr4DUOwWpV2",
    deployId: "george",
    twitter: "@chainfuse",
    acceptPayments: true,
    discoverable: true,
    address: "0x8c1c3bb07Fa8D3d436FdC5A30Aa0f5b042417408",
    instagram: "@chainfuse",
    customUrl: "https://chainfuse.com/",
    linkedIn: "https://www.linkedin.com/company/chainfuse/",
    github: "https://github.com/georgeportillo",
    name: "george",
    template: "profile",
    version: "latest",
    calendar: "https://calendly.com/chainfuse/30min/",
    avatar: "https://upload.chainfuse.com/8ohegzlsmjyt.jpeg",
  });
});

/**
 * Converts workspace ID to a hostname (subdomain).
 *
 * @example
 *   "affirm" => "https://affirm.chainfuse.com" (production)
 *   "affirm" => "https://affirm-test.chainfuse.com" (test/QA)
 */
export function getHostname(workspaceId: string, appHostname: string): string {
  return appHostname.split(".").length > 2
    ? `${workspaceId}-${appHostname}`
    : `${workspaceId}.${appHostname}`;
}

/**
 * Creates a new custom hostname record in Cloudflare.
 */
export async function createHostname(
  siteDoc: DocumentSnapshot<DocumentData>,
  hostname: string
) {
  const site = siteDoc.data();

  // Delete the existing hostname when a new value was provided
  if (site?.hostname && site.hostname !== hostname) {
    await deleteHostname(site?.hostname);
  }

  if (site?.hostname !== hostname) {
    const sites = await db
      .collection("sites")
      .where("hostname", "==", hostname)
      .get();

    if (!sites.empty) {
      throw new ZodError([
        {
          code: ZodIssueCode.custom,
          message: "Already in use by another site.",
          path: ["hostname"],
        },
      ]);
    }

    const record = await customHostnames.create({
      hostname,
      ssl: {
        method: "txt",
        type: "dv",
        settings: {
          min_tls_version: "1.0",
        },
      },
    });

    await siteDoc.ref.update({ hostname, hostnameId: record.id });
  }
}

/**
 * Deletes the custom hostname record from Cloudflare.
 */
async function deleteHostname(hostname: string) {
  const record = await customHostnames.find({ hostname }).first();

  if (record) {
    await customHostnames.delete(record.id);
  }
}
