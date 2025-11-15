<p align="center">
  <picture>
    <img width="150" src="../../../assets/images/motion-inst.1500x1500.png" alt="Motion Inst Logo">
  </picture>
  <h2 align="center">
    Motion Inst
  </h2>
  <p align="center">
    Lightweight CLI to install Motion+ packages
    <br />
    <a href="#"><strong>Learn more »</strong></a>
    <br />
    <br />
    <a href="#">Discord</a>
    ·
    <a href="#">Website</a>
    ·
    <a href="https://github.com/toakiryu/motion-plus-installer/issues">Issues</a>
  </p>
</p>

# Motion Plus Installer (DEV) — Usage

## Purpose

A lightweight CLI that retrieves `.tgz` packages for Motion from an authenticated API and installs them locally via `pnpm add ./<file.tgz>`.

## Quick start

Build and pack the in-repo package (example):

```powershell
cd packages\motion-plus-installer
pnpm install
pnpm run build
pnpm pack
# -> motion-plus-installer-0.1.0.tgz is generated
```

Install the local tgz into a test project:

```powershell
cd /path/to/test-project
pnpm init -y
pnpm add "C:\path\to\motion-plus-installer-0.1.0.tgz"
.\node_modules\.bin\motion-plus-installer --help
```

## CLI usage

Command: `motion-plus-installer [options]`

Main options:

- `-p, --package` : package name (default: `motion-plus`)
- `-v, --pkg-version` : version (default: environment variable or `2.0.0-alpha.4`)
- `-s, --storage` : storage subdirectory under `node_modules` (example: `.motion-plus`)
- `-t, --token` : Authorization Bearer token (environment variable `MOTION_TOKEN` takes precedence)
- `--keep / --no-keep` : whether to keep the downloaded .tgz after installation (default: keep)
- `--force` : overwrite existing file and re-download
- `--retry <n>` : number of download retries (default 2)
- `--out <path>` : specify direct output file path (no automatic `node_modules` prefix)
- `--pnpm-cmd <cmd>` : pnpm execution command (default `pnpm`)
- `--proxy <url>` : HTTP(S) proxy
- `-q, --quiet` : minimal logs
- `--no-pretty` : disable color / path-shortening
- `-h, --help` : help

## Environment variables

- `MOTION_TOKEN` : required (Bearer token for API authentication)
- `MOTION_PACKAGE` : default package name
- `MOTION_VERSION` : default version
- `MOTION_STORAGE_SUBDIR` : storage subdir under `node_modules`
- `MOTION_REGISTRY_URL` : override base download URL for testing (e.g. `http://127.0.0.1:8000/registry`)
- honors standard `HTTP_PROXY` / `HTTPS_PROXY`

## Security & operational notes

- Token values are not printed to logs; only presence is indicated.
- The download cache is stored under `node_modules/<storageSubdir>/`; add it to `.gitignore` (example: `node_modules/.motion-plus-installer/`).

## Build & distribution

- `pnpm run build` bundles the CLI into `dist/` for distribution. Use `pnpm pack` or `npm publish` to publish.
- A `prepack` script is configured to run the build automatically before packing.

## Tests

- Unit: run utilities in `src` with `node:test` (via `pnpm test`).
- E2E: start a local HTTP server and set `MOTION_REGISTRY_URL` to verify download → `pnpm add ./<file.tgz>` succeeds.

## Troubleshooting

- If you encounter ESM/CJS errors like `require is not defined`: the distributed CLI is built as CommonJS. Ensure `dist/` exists or run the released package via `pnpm add`.
- `ENOENT` (pnpm cannot find tgz): by default downloaded files are kept unless `--no-keep` is used. Verify paths.

## License

- MIT (see package `package.json`).

---
*Translated from Japanese to English using AI assistance.*
