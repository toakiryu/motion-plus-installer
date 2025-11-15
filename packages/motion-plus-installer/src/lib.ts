import fs from "fs";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";
const streamPipeline = promisify(pipeline);

function fileNameFor(pkg: string, version: string): string {
  return `${pkg}-${version}.tgz`;
}

function storageDirFor(cwd: string, storageSubdir?: string): string {
  return path.resolve(
    cwd,
    "node_modules",
    storageSubdir || ".motion-plus-installer"
  );
}

function buildUrl(
  pkg: string,
  version: string,
  base = "https://api.motion.dev/registry"
): string {
  return `${base}?package=${encodeURIComponent(
    pkg
  )}&version=${encodeURIComponent(version)}`;
}

async function downloadToFile(
  url: string,
  headers: Record<string, string>,
  tmpPath: string,
  finalPath: string
) {
  const dir = path.dirname(finalPath);
  await fs.promises.mkdir(dir, { recursive: true });
  if (typeof fetch === "function") {
    const res = await fetch(url, { headers });
    if (!res.ok)
      throw new Error(`Failed to download: ${res.status} ${res.statusText}`);
    if (!res.body) throw new Error("Response has no body");
    const writeStream = fs.createWriteStream(tmpPath);
    await streamPipeline(res.body, writeStream);
    await fs.promises.rename(tmpPath, finalPath);
  } else {
    await new Promise((resolve, reject) => {
      const http = require("http");
      const https = require("https");
      const client = url.startsWith("https:") ? https : http;
      const req = client.get(url, { headers }, (res: any) => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(
            new Error(
              `Failed to download: ${res.statusCode} ${res.statusMessage}`
            )
          );
          return;
        }
        const file = fs.createWriteStream(tmpPath);
        res.pipe(file);
        file.on("finish", async () => {
          try {
            file.close();
            await fs.promises.rename(tmpPath, finalPath);
            resolve(null);
          } catch (er) {
            reject(er);
          }
        });
        file.on("error", reject);
      });
      req.on("error", reject);
    });
  }
}

export { fileNameFor, storageDirFor, buildUrl, downloadToFile };
