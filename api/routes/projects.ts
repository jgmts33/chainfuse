import { Project } from "db/schemas";
import { DocumentData, DocumentSnapshot } from "firebase-admin/firestore";
import createError from "http-errors";
import { Forbidden, NotFound, Unauthorized } from "../core/errors.js";
import { db } from "../core/firebase.js";
import * as reserved from "../core/reserved.js";
import router from "../core/router.js";

export const createProject = async (
  id: string,
  data: {
    name: string;
  },
  req: Express.Request
): Promise<DocumentSnapshot<DocumentData>> => {
  if (!req.user) throw new Unauthorized();

  // Create a new `Project` record in Firestore
  await db
    .collection("projects")
    .doc(id)
    .create({ ...data, userId: req.user.uid });

  // Fetch the created `Project` record
  const doc = await db.collection("projects").doc(id).get();

  return doc;
};

/**
 * Checks if the project exists.
 */
router.head("/api/projects/:id", async (req, res) => {
  const doc = await db.collection("projects").doc(req.params.id).get();

  if (doc.exists) {
    res.status(200);
    res.end();
  }

  if (reserved.ids.includes(req.params.id)) {
    res.status(400);
    res.setHeader("x-message", "Invalid project ID");
    res.end();
  }

  res.status(404);
  res.end();
});

/**
 * Creates a new project.
 */
router.post("/api/projects/:id", async (req, res) => {
  if (!req.user) throw new Unauthorized();

  // Check if the project what the provided ID already exists
  let doc = await db.collection("projects").doc(req.params.id).get();

  if (doc.exists || reserved.ids.includes(req.params.id)) {
    throw createError(400, { errors: { id: ["Not available."] } });
  }

  // Validate user input
  const { id, ...data } = Project.parse({ ...req.body, id: req.params.id });

  doc = await createProject(id, data, req);

  res.send({
    ...doc.data(),
    id: doc.id,
    created: doc.createTime?.toDate(),
    updated: doc.updateTime?.toDate(),
  });
});

/**
 * Deletes a new project.
 */
router.delete("/api/projects/:id", async (req, res) => {
  if (!req.user) throw new Unauthorized();

  // Find the target project
  const doc = await db.collection("projects").doc(req.params.id).get();
  if (!doc.exists) throw new NotFound();

  // Check permissions
  if (
    !(
      doc.data()?.userId === req.user.uid ||
      req.user.email?.endsWith("@chainfuse.io")
    )
  ) {
    throw new Forbidden();
  }

  // Delete project
  await doc.ref.delete();

  res.send({ id: doc.id });
});
