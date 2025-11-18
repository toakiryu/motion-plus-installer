import fs from "fs";
import path from "path";

function humanSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let u = -1;
  let v = bytes;
  do {
    v = v / 1024;
    u++;
  } while (v >= 1024 && u < units.length - 1);
  return `${v.toFixed(2)} ${units[u]}`;
}

async function main() {
  const cwd = process.cwd();
  const pkgPath = path.join(cwd, "package.json");
  let expected;
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const name = pkg.name && pkg.name.replace(/^@/, "").replace(/\//g, "-");
    const version = pkg.version;
    if (name && version) {
      expected = `${name}-${version}.tgz`;
    }
  } catch (e) {
    // ignore
  }

  const files = (await fs.promises.readdir(cwd)).filter((f) => f.endsWith(".tgz"));
  let target = null;
  if (expected && files.includes(expected)) {
    target = expected;
  } else if (files.length > 0) {
    // pick newest file
    files.sort((a, b) => {
      try {
        const sa = fs.statSync(path.join(cwd, a)).mtimeMs;
        const sb = fs.statSync(path.join(cwd, b)).mtimeMs;
        return sb - sa;
      } catch (e) {
        return 0;
      }
    });
    target = files[0];
  }

  if (!target) {
    console.log("No .tgz package found after packing.");
    return;
  }

  try {
    const st = await fs.promises.stat(path.join(cwd, target));
    console.log(`Package created: ${target} (${humanSize(st.size)})`);
  } catch (e) {
    console.log(`Created package: ${target} (size unknown)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
