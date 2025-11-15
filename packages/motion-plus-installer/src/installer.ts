import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { pipeline } from "stream";
import { promisify } from "util";
import { Command } from "commander";
import os from "os";
const program = new Command();
const streamPipeline = promisify(pipeline);

function ansi(code: any) {
  return (s: any) => `\u001b[${code}m${s}\u001b[0m`;
}

const green = ansi(32);
const yellow = ansi(33);
const cyan = ansi(36);
const dim = ansi(2);
const red = ansi(31);

function shortenPath(p: string, cwd?: string) {
  if (!p) return p;
  const home = os.homedir();
  try {
    // If it's a URL, return as-is
    if (/^[a-zA-Z]+:\/\//.test(p)) return p;

    // Home-relative (~/...)
    if (p.startsWith(home)) {
      return `~${p.slice(home.length)}`.replace(/\\/g, "/");
    }

    // If the path is inside the current workspace (cwd), show as vscode-style: "<workspaceName>/path/to/file"
    const workspace = cwd || process.cwd();
    if (p.startsWith(workspace)) {
      const rel = path.relative(workspace, p).replace(/\\/g, "/");
      const base = path.basename(workspace);
      if (!rel || rel === "") return base;
      return `${base}/${rel}`;
    }

    const rel = path.relative(workspace, p);
    if (!rel || rel === ".") return ".";
    if (!rel.startsWith("..")) {
      return `./${rel.replace(/\\/g, "/")}`;
    }
  } catch (e) {
    // ignore and fallback
  }
  // fallback: if too long, truncate middle
  const s = p.replace(/\\/g, "/");
  if (s.length > 60) return `...${s.slice(-57)}`;
  return s;
}

function makeLogger(quiet: boolean, pretty: boolean) {
  return {
    info: (...args: any[]) => {
      if (quiet) return;
      if (!pretty) {
        console.log(...args);
        return;
      }
      const out = args.join(" ");
      console.log(green("info:"), out);
    },
    warn: (...args: any[]) => {
      if (!pretty) console.error(...args);
      else console.error(yellow("warn:"), args.join(" "));
    },
    error: (...args: any[]) => {
      if (!pretty) console.error(...args);
      else console.error(red("error:"), args.join(" "));
    },
    fmtPath: (p: any) => (pretty ? cyan(shortenPath(p)) : p),
  };
}

import { fileNameFor, storageDirFor, buildUrl, downloadToFile } from "./lib";

async function runPnpmAdd(pnpmCmd: string, filePath: string, logger: any) {
  const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, "/");
  const addArg = `./${relPath}`;
  logger.info(`Running: ${pnpmCmd} add ${addArg}`);
  return new Promise((resolve, reject) => {
    const child = spawn(pnpmCmd, ["add", addArg], {
      stdio: "inherit",
      shell: false,
    });
    child.on("exit", (code) => {
      if (code === 0) resolve(0);
      else reject(new Error(`pnpm exited with code ${code}`));
    });
    child.on("error", reject);
  });
}

async function main() {
  function loadPackageJsonFromDir(startDir: string) {
    let cur = startDir;
    while (true) {
      const candidate = path.join(cur, "package.json");
      try {
        if (fs.existsSync(candidate)) {
          const raw = fs.readFileSync(candidate, "utf8");
          return JSON.parse(raw);
        }
      } catch (e) {
        // ignore and continue
      }
      const parent = path.dirname(cur);
      if (parent === cur) break;
      cur = parent;
    }
    // fallback to cwd
    try {
      const cwdCandidate = path.join(process.cwd(), "package.json");
      if (fs.existsSync(cwdCandidate)) {
        return JSON.parse(fs.readFileSync(cwdCandidate, "utf8"));
      }
    } catch (e) {
      // ignore
    }
    throw new Error("package.json not found");
  }

  const pkgJson = loadPackageJsonFromDir(__dirname);
  program.version(
    pkgJson.version || "0.0.0",
    "-V, --version",
    "output the CLI version"
  );
  program
    .option("-p, --package <name>", "package name")
    .option("-v, --pkg-version <ver>", "target package version")
    .option("-s, --storage <subdir>", "storage subdir under node_modules")
    .option("-t, --token <token>", "Authorization Bearer token")
    .option("--keep", "keep downloaded .tgz after install")
    .option("--no-keep", "do not keep downloaded .tgz after install")
    .option("--force", "force re-download even if file exists")
    .option("--retry <n>", "download retry count", (v) => parseInt(v, 10))
    .option(
      "--out <path>",
      "write .tgz directly to the given path (no node_modules prefix)"
    )
    .option("--pnpm-cmd <cmd>", "pnpm command to run")
    .option("--proxy <url>", "HTTP(S) proxy URL")
    .option("-q, --quiet", "quiet mode")
    .option("--no-pretty", "disable pretty (colored/shortened) output")
    .allowUnknownOption(false);

  program.parse(process.argv);
  const raw = program.opts();
  const pretty = raw.pretty === undefined ? true : raw.pretty;
  const logger = makeLogger(raw.quiet, pretty);

  const pkg = raw.package || process.env.MOTION_PACKAGE || "motion-plus";
  const version =
    raw.pkgVersion || raw.pkgVersion === ""
      ? raw.pkgVersion
      : raw.pkgVersion || process.env.MOTION_VERSION || "2.0.0-alpha.4";
  const token = raw.token || process.env.MOTION_TOKEN;
  if (!token) {
    logger.error(
      "Error: MOTION_TOKEN is not set in the environment and --token not provided."
    );
    process.exitCode = 2;
    return;
  }

  const storageSubdir =
    raw.storage ||
    process.env.MOTION_STORAGE_SUBDIR ||
    ".motion-plus-installer";
  const fileName = `${pkg}-${version}.tgz`;

  let outPath;
  if (raw.out) {
    outPath = path.resolve(process.cwd(), raw.out);
  } else {
    const storageDir = path.resolve(
      process.cwd(),
      "node_modules",
      storageSubdir
    );
    outPath = path.join(storageDir, fileName);
  }

  const headers = { Authorization: `Bearer ${token}` };
  // Masked log of token presence
  logger.info(`Authorization header: Bearer ${"****"}`);

  const registryBase =
    process.env.MOTION_REGISTRY_URL || "https://api.motion.dev/registry";
  const url = buildUrl(pkg, version, registryBase);
  logger.info(`Using storage: ${logger.fmtPath(path.dirname(outPath))}`);
  logger.info(`Target file: ${logger.fmtPath(outPath)}`);
  logger.info(`Download URL: ${logger.fmtPath(url)}`);

  // proxy handling: set env vars for fetch/https and child processes
  if (raw.proxy) {
    process.env.HTTP_PROXY = raw.proxy;
    process.env.HTTPS_PROXY = raw.proxy;
    logger.info(`Proxy set`);
  }

  try {
    const exists = await fs.promises
      .stat(outPath)
      .then(() => true)
      .catch(() => false);
    if (exists && !raw.force) {
      logger.info(
        `Found existing file at ${logger.fmtPath(
          outPath
        )}, skipping download (use --force to re-download)`
      );
    } else {
      // download with retries
      const attempts = Math.max(1, raw.retry || 2);
      let lastErr = null;
      for (let i = 1; i <= attempts; i++) {
        try {
          const tmpPath = `${outPath}.tmp-${Date.now()}`;
          logger.info(`Downloading (attempt ${i}/${attempts}) ...`);
          await downloadToFile(url, headers, tmpPath, outPath);
          logger.info(`Saved ${logger.fmtPath(outPath)}`);
          lastErr = null;
          break;
        } catch (er: any) {
          lastErr = er;
          logger.warn(`Download attempt ${i} failed: ${er.message}`);
          if (i === attempts) break;
          // small delay before retry
          await new Promise((r) => setTimeout(r, 1000 * i));
        }
      }
      if (lastErr) {
        logger.error(
          `Download failed after ${attempts} attempts: ${lastErr.message}`
        );
        process.exitCode = 3;
        return;
      }
    }

    // Run pnpm add
    try {
      await runPnpmAdd(raw.pnpmCmd || "pnpm", outPath, logger);
    } catch (er: any) {
      logger.error(`pnpm failed: ${er.message}`);
      process.exitCode = 5;
      return;
    }

    logger.info("motion-plus installed successfully.");
    const keep = raw.keep === undefined ? true : raw.keep;
    if (!keep) {
      try {
        await fs.promises.unlink(outPath);
        logger.info(`Removed ${logger.fmtPath(outPath)}`);
      } catch (er: any) {
        logger.warn(`Failed to remove downloaded file: ${er.message}`);
      }
    } else {
      logger.info(`Kept downloaded file at ${logger.fmtPath(outPath)}`);
    }
    process.exitCode = 0;
  } catch (err: any) {
    logger.error("Installation failed:", err.message || err);
    process.exitCode = 1;
  }
}

main();
