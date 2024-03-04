import { Storage, type Bucket } from "@google-cloud/storage";
import { customAlphabet } from "nanoid/async";
import path from "node:path";
import { z } from "zod";
import env from "../core/env.js";
import { Unauthorized } from "../core/errors.js";
import router from "../core/router.js";

const newId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12);

/**
 * Generates a temporary upload URL
 * https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
 */
router.post("/api/upload", async (req, res) => {
  // Only authenticated users can upload files
  if (!req.user) throw new Unauthorized();

  // Initialize the Google Cloud Storage client
  if (!uploadBucket) {
    const projectId = env.GOOGLE_CLOUD_PROJECT;
    const credentials = env.GOOGLE_CLOUD_CREDENTIALS;
    const storage = new Storage({ credentials, projectId });
    uploadBucket = storage.bucket(env.UPLOAD_BUCKET);
  }

  // Validate user input
  const input = Input.parse(req.body);

  // Generate a temporary URL for the uploaded content
  const filename = `${await newId()}${path.extname(input.filename)}`;
  const [url] = await uploadBucket.file(filename).getSignedUrl({
    action: "write",
    expires: Date.now() + 1.44e7 /* 4 hours */,
    version: "v4",
    contentType: input.type,
    virtualHostedStyle: true,
    cname: `https://${env.UPLOAD_BUCKET}`,
  });

  res.type("application/json; charset=utf-8");
  res.send(JSON.stringify(url));
});

router.post("/api/onboarding/upload", async (req, res) => {
  // Initialize the Google Cloud Storage client
  if (!uploadBucket) {
    const projectId = env.GOOGLE_CLOUD_PROJECT;
    const credentials = env.GOOGLE_CLOUD_CREDENTIALS;
    const storage = new Storage({ credentials, projectId });
    uploadBucket = storage.bucket(env.UPLOAD_BUCKET);
  }

  // Validate user input
  const input = Input.parse(req.body);

  // Generate a temporary URL for the uploaded content
  const filename = `${await newId()}${path.extname(input.filename)}`;
  const [url] = await uploadBucket.file(filename).getSignedUrl({
    action: "write",
    expires: Date.now() + 1.44e7 /* 4 hours */,
    version: "v4",
    contentType: input.type,
    virtualHostedStyle: true,
    cname: `https://${env.UPLOAD_BUCKET}`,
  });

  res.type("application/json; charset=utf-8");
  res.send(JSON.stringify(url));
});

// Validation schema
const Input = z.object({
  filename: z.string().min(3).max(250),
  type: z.string().min(3).max(50),
});

let uploadBucket: Bucket;
