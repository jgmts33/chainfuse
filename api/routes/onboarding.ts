import { Project } from "db/schemas";
import { FieldValue } from "firebase-admin/firestore";
import { customAlphabet } from "nanoid";
import { ZodError, ZodIssueCode } from "zod";
import env from "../core/env.js";
import { Unauthorized } from "../core/errors.js";
import { db } from "../core/firebase.js";
import { createFormValidator } from "../core/formValidator.js";
import router from "../core/router.js";
import { createValidator } from "../core/validator.js";
import { createProject } from "./projects.js";
import { toShortId } from "./sites.js";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 6);

/**
 * Creates a new decentralized profile.
 */
router.post("/api/onboarding/profile", async (req, res) => {
  if (!req.user) throw new Unauthorized();

  const formTemplate = req.body.template;

  const name = req.body.profileName;
  const work = req.body.work;

  const projectName = `${toShortId(work)}-${nanoid()}`;
  const profileName = `${toShortId(name)}-${nanoid()}`;

  // Validate new project
  const { ...data } = Project.parse({
    id: projectName,
    name: work,
  });

  // Validate form data
  await createFormValidator(formTemplate, "create").parse({
    ...req.body,
    id: profileName,
    project: projectName,
  });

  // Validate site creation data
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...input } = await createValidator("profile", "create").parse({
    ...req.body,
    id: profileName,
    project: projectName,
    name: req.body.profileName,
    avatar:
      req.body.avatar ?? "https://test-upload.chainfuse.com/3tlx9bikuzly.jpg",
  });

  let siteDoc = await db.collection("sites").doc(profileName).get();

  if (siteDoc.exists) {
    throw new ZodError([
      { code: ZodIssueCode.custom, message: "Not available.", path: ["id"] },
    ]);
  }

  // Create project
  await createProject(projectName, data, req);

  // Create site
  await siteDoc.ref.create({
    ...input,
    project: projectName,
    site: profileName,
    template: "profile",
    siteUrl: `https://${profileName}${
      env.APP_ENV === "local" || env.APP_ENV === "test" ? "-test" : ""
    }.chainfuse.com`,
    deployId: siteDoc.id,
    userId: req.user.uid,
    lastModified: FieldValue.serverTimestamp(),
  });

  siteDoc = await siteDoc.ref.get();

  res.status(200).json(siteDoc.data());
});
