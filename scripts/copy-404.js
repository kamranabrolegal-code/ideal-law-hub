import fs from "fs";
import path from "path";

const candidates = [
  ".output/public",
  "dist",
  "dist/client",
  "build",
  "out",
  "docs",
  "public"
];
const root = process.cwd();

const dir = candidates.find((d) => {
  try {
    return fs.existsSync(path.join(root, d, "index.html"));
  } catch {
    return false;
  }
});

if (!dir) {
  console.warn("No build output with index.html found; skipping 404 copy.");
  process.exit(0);
}

const src = path.join(root, dir, "index.html");
const dest = path.join(root, dir, "404.html");

try {
  fs.copyFileSync(src, dest);
  console.log(`Copied ${src} -> ${dest}`);
} catch (err) {
  console.error("Failed to copy index.html to 404.html:", err);
  process.exit(1);
}
