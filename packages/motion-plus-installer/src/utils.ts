import os from "os";
import path from "path";

function ansi(code: any) {
  return (s: any) => `\u001b[${code}m${s}\u001b[0m`;
}

const green = ansi(32);
const yellow = ansi(33);
const cyan = ansi(36);
const red = ansi(31);

export function shortenPath(p: string, cwd?: string) {
  if (!p) return p;
  const home = os.homedir();
  try {
    if (/^[a-zA-Z]+:\/\//.test(p)) return p;
    if (p.startsWith(home)) {
      return `~${p.slice(home.length)}`.replace(/\\/g, "/");
    }
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
  const s = p.replace(/\\/g, "/");
  if (s.length > 60) return `...${s.slice(-57)}`;
  return s;
}

export function makeLogger(quiet: boolean, pretty: boolean) {
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
