import { execa } from "execa";
import { argv, path } from "zx";

const cwd = path.resolve(__dirname, "../../chainfuse-js/example");
const bucket = `templates.chainfuse.com/token-drop-latest`;

// You can disable the build step by using `--no-build` flag
if (argv.build !== false) {
  await execa("yarn", ["build"], { cwd, stdio: "inherit" });
}

await execa(
  "gsutil",
  [
    ...["-m", "-o", "GSUtil:parallel_process_count=1"],
    ...["-h", "Cache-Control: private, max-age=600, must-revalidate"],
    ...["rsync", "-x", "assets\\/\\.*", "./dist", `gs://${bucket}/`],
  ],
  { cwd, stdio: "inherit" }
);

await execa(
  "gsutil",
  [
    ...["-m", "-o", "GSUtil:parallel_process_count=1"],
    ...[
      "-h",
      "Cache-Control: public, max-age=31536000, s-maxage=604800, immutable",
    ],
    ...["rsync", "./dist/assets", `gs://${bucket}/assets/`],
  ],
  { cwd, stdio: "inherit" }
);
