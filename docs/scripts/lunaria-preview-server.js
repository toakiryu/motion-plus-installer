#!/usr/bin/env node
import http from "http";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

function chooseDefaultDir(cwd) {
  const cand1 = path.join(cwd, ".vitepress", "dist", "_translations");
  const cand2 = path.join(cwd, ".vitepress", "dist");
  if (fs.existsSync(cand1)) return cand1;
  if (fs.existsSync(cand2)) return cand2;
  return cand2; // default even if not exists
}

const argv = process.argv.slice(2);
const cwd = process.cwd();
const dir = argv[0] ? path.resolve(argv[0]) : chooseDefaultDir(cwd);
const port = Number(argv[1] || process.env.PORT || 8080);
const host = argv[2] || process.env.HOST || "127.0.0.1";

const mime = {
  html: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "application/javascript; charset=utf-8",
  json: "application/json; charset=utf-8",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  txt: "text/plain; charset=utf-8",
  wasm: "application/wasm",
};

function contentTypeFromName(name) {
  const ext = path.extname(name).slice(1).toLowerCase();
  return mime[ext] || "application/octet-stream";
}

function serveFile(filePath, res) {
  fs.stat(filePath, (err, stat) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found\n");
      return;
    }
    if (stat.isDirectory()) {
      // try index.html
      const idx = path.join(filePath, "index.html");
      if (fs.existsSync(idx)) {
        serveFile(idx, res);
        return;
      }
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Forbidden\n");
      return;
    }
    const stream = fs.createReadStream(filePath);
    res.writeHead(200, { "Content-Type": contentTypeFromName(filePath) });
    stream.pipe(res);
  });
}

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    // prevent path traversal
    const safePath = path.normalize(urlPath).replace(/^\/+/, "");
    const filePath = path.join(dir, safePath);
    // Security: ensure filePath is inside dir
    if (!filePath.startsWith(path.resolve(dir))) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Forbidden\n");
      return;
    }
    if (fs.existsSync(filePath)) {
      serveFile(filePath, res);
      return;
    }
    // fallback to index.html for SPA
    const indexFile = path.join(dir, "index.html");
    if (fs.existsSync(indexFile)) {
      serveFile(indexFile, res);
      return;
    }
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found\n");
  } catch (e) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Server error\n");
  }
});

server.listen(port, host, () => {
  const url = `http://${host}:${port}/`;
  console.log(`Serving ${dir}`);
  console.log(`Listening on ${url}`);

  // open default browser
  let cmd;
  let args = [];
  const plat = process.platform;
  if (plat === "win32") {
    // start requires 'cmd' shell
    cmd = "cmd";
    args = ["/c", "start", "", url];
  } else if (plat === "darwin") {
    cmd = "open";
    args = [url];
  } else {
    // linux and others
    cmd = "xdg-open";
    args = [url];
  }

  try {
    const p = spawn(cmd, args, { stdio: "ignore", detached: true });
    p.unref();
  } catch (e) {
    console.log(`Failed to open browser automatically. Please open: ${url}`);
  }
});

server.on("error", (err) => {
  console.error("Server error:", err.message || err);
  process.exit(1);
});
