import envars from "envars";
import { execa } from "execa";
import { $, argv, path } from "zx";

const envName = argv.env ?? "test";
const [command] = argv._;

// Load environment variables
envars.config({ env: envName });

// Export the selected Firestore collections to a GCS bucket
// https://firebase.google.com/docs/firestore/manage-data/export-import
if (command === "export") {
  const timestamp = new Date()
    .toISOString()
    .replace(/\.\d+Z$/, "")
    .replace(/[-:]/g, "");

  await execa(
    "gcloud",
    [
      "firestore",
      "export",
      `--project=${$.env.GOOGLE_CLOUD_PROJECT}`,
      `gs://backup.chainfuse.com/firestore-${envName}-${timestamp}`,
      "--collection-ids",
      "sites,workspaces",
    ],
    {
      stdio: "inherit",
      cwd: path.resolve(__dirname, "../db"),
    }
  );
} else {
  throw new Error(`Unknown command: ${command}`);
}
