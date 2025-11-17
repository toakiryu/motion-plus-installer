import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { buildUrl, downloadToFile } from "./lib";
import { detectPackageManager, runPackageManagerAdd } from "./pm";
import { makeLogger } from "./utils";

export async function installFlow(raw: any) {
  const pretty = raw.pretty === undefined ? true : raw.pretty;
  const logger = makeLogger(raw.quiet, pretty);
  const pkg = raw.package || process.env.MOTION_PACKAGE || "motion-plus";
  let version =
    raw.pkgVersion || raw.pkgVersion === ""
      ? raw.pkgVersion
      : raw.pkgVersion || process.env.MOTION_VERSION || "latest";
  const token = raw.token || process.env.MOTION_TOKEN;
  if (!token) {
    logger.error(
      "Error: MOTION_TOKEN is not set in the environment and --token not provided."
    );
    process.exitCode = 2;
    return;
  }

  const storageSubdir =
    raw.storage || process.env.MOTION_STORAGE_SUBDIR || ".motion-plus-installer";

  // If requested version is 'latest', try to resolve the actual version
  // by asking the registry for JSON metadata. If resolution fails, fall
  // back to using the literal 'latest' (existing behavior).
  const registryBase = process.env.MOTION_REGISTRY_URL || "https://api.motion.dev/registry";
  if (version === "latest") {
    try {
      const metaUrl = buildUrl(pkg, version, registryBase);
      const metaRes = await fetch(metaUrl, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const ct = (metaRes.headers && metaRes.headers.get && metaRes.headers.get("content-type")) || "";
      if (metaRes.ok && ct.includes("application/json")) {
        const j = await metaRes.json();
        if (j && typeof j === "object") {
          if (typeof j.version === "string") {
            version = j.version;
          } else if (j["dist-tags"] && typeof j["dist-tags"].latest === "string") {
            version = j["dist-tags"].latest;
          } else if (j.dist && typeof j.dist.tarball === "string") {
            const m = j.dist.tarball.match(/-([0-9]+\.[0-9]+\.[0-9A-Za-z-.]+)\.tgz$/);
            if (m && m[1]) version = m[1];
          }
        }
      }
    } catch (e) {
      // ignore and continue using 'latest'
    }
  }

  const fileName = `${pkg}-${version}.tgz`;

  let outPath;
  if (raw.out) {
    outPath = path.resolve(process.cwd(), raw.out);
  } else {
    const storageDir = path.resolve(process.cwd(), "node_modules", storageSubdir);
    outPath = path.join(storageDir, fileName);
  }

  const headers = { Authorization: `Bearer ${token}` };
  logger.info(`Authorization header: Bearer ${"****"}`);

  const url = buildUrl(pkg, version, registryBase);
  logger.info(`Using storage: ${logger.fmtPath(path.dirname(outPath))}`);
  logger.info(`Target file: ${logger.fmtPath(outPath)}`);
  logger.info(`Download URL: ${logger.fmtPath(url)}`);

  if (raw.proxy) {
    process.env.HTTP_PROXY = raw.proxy;
    process.env.HTTPS_PROXY = raw.proxy;
    logger.info(`Proxy set`);
  }

  try {
    const exists = await fs.promises.stat(outPath).then(() => true).catch(() => false);
    if (exists && !raw.force) {
      logger.info(
        `Found existing file at ${logger.fmtPath(outPath)}, skipping download (use --force to re-download)`
      );
    } else {
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
          await new Promise((r) => setTimeout(r, 1000 * i));
        }
      }
      if (lastErr) {
        logger.error(`Download failed after ${attempts} attempts: ${lastErr.message}`);
        process.exitCode = 3;
        return;
      }
    }

    // If we requested 'latest', try to read the real version from the downloaded
    // tarball's package.json and rename the cached file to include the concrete version.
    if (version === "latest") {
      try {
        const tarRes = spawnSync("tar", ["-xOf", outPath, "package/package.json"], {
          encoding: "utf8",
          shell: false,
        });
        if (tarRes.status === 0 && tarRes.stdout) {
          try {
            const pkgJson = JSON.parse(tarRes.stdout);
            if (pkgJson && typeof pkgJson.version === "string") {
              const resolved = pkgJson.version;
              if (resolved && resolved !== "latest") {
                const newName = `${pkg}-${resolved}.tgz`;
                const newPath = path.join(path.dirname(outPath), newName);
                try {
                  await fs.promises.rename(outPath, newPath);
                  outPath = newPath;
                  version = resolved;
                  logger.info(`Resolved latest -> ${version}, renamed cache to ${logger.fmtPath(outPath)}`);
                } catch (e: any) {
                  logger.warn(`Failed to rename cached file to versioned name: ${e.message || e}`);
                }
              }
            }
          } catch (e) {
            // ignore JSON parse errors
          }
        }
      } catch (e) {
        // ignore failures - best-effort only
      }
    }

    const selectedPm = raw.pmCmd || detectPackageManager(process.cwd());
    logger.info(`Using package manager: ${selectedPm}`);
    try {
      await runPackageManagerAdd(selectedPm, outPath, logger);
    } catch (er: any) {
      logger.error(`package manager failed: ${er.message}`);
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
