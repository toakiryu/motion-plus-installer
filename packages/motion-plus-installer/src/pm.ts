import fs from "fs";
import path from "path";
import { spawn, spawnSync } from "child_process";

function checkExec(name: string): boolean {
  try {
    const r = spawnSync(name, ["--version"], { stdio: "ignore" });
    return !!(r && r.status === 0);
  } catch (e) {
    return false;
  }
}

export function detectPackageManager(cwd = process.cwd()): string {
  const ua = process.env.npm_config_user_agent || "";
  if (ua.includes("pnpm")) return "pnpm";
  if (ua.includes("yarn")) return "yarn";
  if (ua.includes("bun")) return "bun";
  if (ua.includes("npm")) return "npm";

  const execPath = (process.env.npm_execpath || "").toLowerCase();
  if (execPath.includes("pnpm")) return "pnpm";
  if (execPath.includes("yarn")) return "yarn";
  if (execPath.includes("bun")) return "bun";
  if (execPath.includes("npm")) return "npm";

  try {
    const pj = path.join(cwd, "package.json");
    if (fs.existsSync(pj)) {
      const raw = fs.readFileSync(pj, "utf8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.packageManager) return String(parsed.packageManager).split("@")[0];
    }
  } catch (e) {
    // ignore
  }

  const lockChecks: Array<[string, string]> = [
    ["pnpm-lock.yaml", "pnpm"],
    ["package-lock.json", "npm"],
    ["yarn.lock", "yarn"],
    ["bun.lockb", "bun"],
  ];
  for (const [file, pm] of lockChecks) {
    if (fs.existsSync(path.join(cwd, file))) return pm;
  }

  if (checkExec("pnpm")) return "pnpm";
  if (checkExec("yarn")) return "yarn";
  if (checkExec("bun")) return "bun";

  return "npm";
}

export async function runPackageManagerAdd(pmCmd: string, filePath: string, logger: any) {
  const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, "/");
  const addArg = `./${relPath}`;
  const cmd = (pmCmd || "pnpm").split(" ")[0];
  let args: string[];
  if (cmd === "pnpm" || cmd === "yarn") {
    args = ["add", addArg];
  } else if (cmd === "npm") {
    args = ["install", addArg];
  } else {
    args = ["add", addArg];
  }

  logger.info(`Running: ${pmCmd} ${args.join(" ")}`);
  return new Promise((resolve, reject) => {
    const child = spawn(pmCmd, args, { stdio: "inherit", shell: false });
    child.on("exit", (code) => {
      if (code === 0) resolve(0);
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
    child.on("error", reject);
  });
}
