import fs from "fs";
import path from "path";
import { Command } from "commander";
const program = new Command();

import { storageDirFor } from "./lib";
import { makeLogger } from "./utils";
import { installFlow } from "./installer-flow";

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
program.name("motion-plus-installer");
// If user asked for version via -V/--version, print once and exit to avoid
// duplicate printing from downstream wrapper or commander internals.
const rawArgs = process.argv.slice(2);
if (rawArgs.includes("-V") || rawArgs.includes("--version")) {
  console.log(pkgJson.version || "0.0.0");
  process.exit(0);
}

program.version(pkgJson.version || "0.0.0", "-V, --version", "output the CLI version");

// install サブコマンド: 引数に <pkg>@<version> を受け取る
program
  .command("install [pkgWithVersion]")
  .alias("i")
  .description(
    "Download and install a Motion+ package. Use <pkg>@<version> format."
  )
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
  .option("--pm-cmd <cmd>", "package manager command to run (npm|pnpm|yarn)")
  .option("--proxy <url>", "HTTP(S) proxy URL")
  .option("-q, --quiet", "quiet mode")
  .option("--no-pretty", "disable pretty (colored/shortened) output")
  .option(
    "-a, --allow-default",
    "when omitted, allow falling back to the default package `motion-plus@latest`"
  )
  .allowUnknownOption(false)
  .action(async (pkgWithVersion: string | undefined, cmdObj: any) => {
    // Commander may pass either the Command object (with .opts())
    // or the plain options object depending on version/build.
    const opts =
      typeof cmdObj?.opts === "function" ? cmdObj.opts() : cmdObj || {};

    // Determine package and version with precedence:
    // 1. CLI argument `pkg@version` (if provided)
    // 2. Environment variables `MOTION_PACKAGE` / `MOTION_VERSION` (if set)
    // 3. Fallback to `motion-plus@latest`
    let pkg: string | undefined;
    let version: string | undefined;

    if (pkgWithVersion) {
      // parse pkg@version, handle scoped packages like @scope/name@1.2.3
      const atPos = pkgWithVersion.lastIndexOf("@");
      if (atPos > 0) {
        pkg = pkgWithVersion.slice(0, atPos);
        version = pkgWithVersion.slice(atPos + 1) || undefined;
      } else {
        pkg = pkgWithVersion;
      }
    } else {
      // No argument: prefer environment
      pkg = process.env.MOTION_PACKAGE;
      version = process.env.MOTION_VERSION;

      // If environment not set, only allow using the hardcoded default when
      // the caller explicitly requested it via `--allow-default`.
      if (!pkg) {
        const allowDefault = !!opts.allowDefault;
        if (allowDefault) {
          pkg = "motion-plus";
          version = version || "latest";
        } else {
          console.error(
            "Error: missing package argument. Use format: <pkg>@<version> (e.g. motion-plus@latest)"
          );
          console.error("You can either:");
          console.error("  - specify the package on the command line: motion-plus-installer install motion-plus@latest");
          console.error("  - set environment variable MOTION_PACKAGE (and optionally MOTION_VERSION)");
          console.error("  - or pass --allow-default to install the default: motion-plus@latest");
          process.exit(1);
        }
      }
    }

    opts.package = pkg;
    opts.pkgVersion = version || "latest";
    await installFlow(opts);
  });

// clear-cache サブコマンド: ストレージのキャッシュを削除する
program
  .command("clear-cache")
  .alias("cc")
  .description(
    "Remove cached .tgz files in storage directory (or remove dir with --all)"
  )
  .option("-s, --storage <subdir>", "storage subdir under node_modules")
  .option("--all", "remove entire storage directory")
  .option("-q, --quiet", "quiet mode")
  .action(async (cmdObj: any) => {
    const opts =
      typeof cmdObj?.opts === "function" ? cmdObj.opts() : cmdObj || {};
    const storageDir = storageDirFor(process.cwd(), opts.storage);
    const logger = makeLogger(opts.quiet, true);
    try {
      const exists = await fs.promises
        .stat(storageDir)
        .then(() => true)
        .catch(() => false);
      if (!exists) {
        logger.info(`No cache found at ${logger.fmtPath(storageDir)}`);
        return;
      }
      if (opts.all) {
        await fs.promises.rm(storageDir, { recursive: true, force: true });
        logger.info(`Removed storage directory ${logger.fmtPath(storageDir)}`);
        return;
      }
      const files = await fs.promises.readdir(storageDir);
      const tgz = files.filter((f) => f.endsWith(".tgz"));
      if (tgz.length === 0) {
        logger.info(`No .tgz files in ${logger.fmtPath(storageDir)}`);
        return;
      }
      for (const f of tgz) {
        const p = path.join(storageDir, f);
        try {
          await fs.promises.unlink(p);
          logger.info(`Removed ${logger.fmtPath(p)}`);
        } catch (e: any) {
          logger.warn(`Failed to remove ${f}: ${e.message || e}`);
        }
      }
    } catch (e: any) {
      logger.error(`Failed to clear cache: ${e.message || e}`);
      process.exitCode = 1;
    }
  });

// デフォルト: 引数が無ければヘルプ表示
if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(0);
}

// Prevent commander from printing errors by itself (we'll handle them centrally)
program.configureOutput({
  // Don't let commander write to stderr automatically
  writeErr: (_str: string) => {},
  // Prevent default error formatting/printing
  outputError: (_str: string, _write: (s: string) => void) => {},
});

// Override default exit behavior to provide friendlier error messages
program.exitOverride();
try {
  program.parse(process.argv);
} catch (err: any) {
  // If install subcommand was invoked without required argument, show clearer hint
  const invoked = (process.argv.slice(2)[0] || "").toLowerCase();
  if (
    err &&
    (err.code === "commander.missingArgument" || err.code === "commander.helpDisplayed") &&
    (invoked === "install" || invoked === "i")
  ) {
    console.error("Error: missing package argument. Use format: <pkg>@<version> (e.g. motion-plus@latest)");
    console.error("Example:");
    console.error("  motion-plus-installer install motion-plus@latest");
    console.error("  motion-plus-installer i motion-plus@latest");
    process.exit(1);
  }

  // For other commander errors, show the original message and exit with its code
  if (err && typeof err.exitCode === "number") {
    console.error(err.message || err);
    process.exit(err.exitCode);
  }

  // Unknown error: rethrow
  throw err;
}
