import { build } from "esbuild";

// --- JavaScript build (esbuild) ---

// // ESM
// await build({
//   entryPoints: ["src/installer.ts"],
//   bundle: true,
//   format: "esm",
//   platform: "node",
//   target: "es2020",
//   outdir: "dist/esm",
//   entryNames: "installer",
//   minify: true,
//   legalComments: "none",
//   banner: {
//     "js": "#!/usr/bin/env node",
//   },
// });

// CJS
await build({
  entryPoints: ["src/installer.ts"],
  bundle: true,
  format: "cjs",
  platform: "node",
  target: "es2020",
  outdir: "dist/cjs",
  entryNames: "installer",
  minify: true,
  legalComments: "none",
  banner: {
    "js": "#!/usr/bin/env node",
  },
});
