import { execa } from "execa";
import { $, path } from "zx";

const name = path.basename($.env.INIT_CWD);
const bucket = `templates.chainfuse.com/${name}-latest`;

// Copy the compiled output to a Google Cloud storage bucket
await execa(
  "gsutil",
  [
    "-o",
    "GSUtil:parallel_process_count=1",
    "rsync",
    "-r",
    `./dist`,
    `gs://${bucket}`,
  ],
  { stdio: "inherit" }
);

// Set `Cache-Control` header on the `index.html` file
await execa(
  "gsutil",
  [
    "setmeta",
    "-h",
    `Cache-Control: public, max-age=600, must-revalidate`,
    `gs://${bucket}/index.html`,
  ],
  { stdio: "inherit" }
);

// Set `Cache-Control` header on the static asset files
await execa(
  "gsutil",
  [
    "setmeta",
    "-h",
    `Cache-Control: public, max-age=31536000, s-maxage=604800, immutable`,
    `gs://${bucket}/assets/**`,
  ],
  { stdio: "inherit" }
);
