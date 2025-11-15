<p align="center">
  <picture>
    <img width="150" src="../../../assets\images\motion-inst.1500x1500.png" alt="Motion Inst Logo">
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

# Motion Plus Installer — Install & Usage (User)

This document provides concise instructions for end users to install `motion-plus-installer` via `pnpm` and use it to fetch Motion `.tgz` packages and add them to their projects.

## Installation (recommended)

Install locally in your project:

```powershell
cd /path/to/your-project
pnpm add --save-dev motion-plus-installer
# or, if you prefer not to save as a dev dependency
pnpm add motion-plus-installer
```

Global install (may require elevated permissions on some OSes):

```powershell
pnpm add -g motion-plus-installer
```

After installation:

- Local install: `npx motion-plus-installer --help` or `.
ode_modules\.bin\motion-plus-installer --help`
- Global install: `motion-plus-installer --help`

## Required environment variables

- `MOTION_TOKEN` — required. Bearer token used to access the Motion package download API.

PowerShell example:

```powershell
$env:MOTION_TOKEN = 'your-token-here'
motion-plus-installer -p motion-plus
```

For CI/CD, provide the token via your secret store (e.g. GitHub Secrets).

### Using a local `.env` for quick testing (recommended)

Use `dotenv-cli` to load a `.env` file temporarily without installing it globally. Example:

```powershell
npx dotenv-cli -e .env -- npx motion-plus-installer -p motion-plus -v 2.0.0
```

In CI, prefer injecting secrets via the runner's secret management.

## Quick usage examples

1. Minimal example — set token and install a specified package/version:

```powershell
# set token
$env:MOTION_TOKEN = 'xxxxx'
# download and install package 'motion-plus' version 2.0.0
npx motion-plus-installer -p motion-plus -v 2.0.0
```

2. Force re-download to overwrite existing cache:

```powershell
npx motion-plus-installer -p motion-plus --force
```

3. Automatically delete the downloaded .tgz after install (default is to keep):

```powershell
npx motion-plus-installer -p motion-plus --no-keep
```

## Major CLI options (summary)

- `-p, --package <name>` : product package name (e.g. `motion-plus`).
- `-v, --pkg-version <version>` : version to fetch.
- `-t, --token <token>` : provide token directly instead of `MOTION_TOKEN` (beware shell history).
- `-s, --storage <subdir>` : subdirectory under `node_modules` to store cache (default provided).
- `--keep / --no-keep` : whether to keep the downloaded .tgz after installation (default: keep).
- `--force` : force re-download, overwriting existing cache.
- `--retry <n>` : number of download retries (default: 2).
- `--pnpm-cmd <cmd>` : override the pnpm command name (default `pnpm`). Useful in CI.
- `-q, --quiet` : minimize logs.
- `--no-pretty` : disable color and path-shortening for plain output.

See `motion-plus-installer --help` for full details.

## CI example (GitHub Actions)

```yaml
- uses: actions/checkout@v4
- name: Setup Node
  uses: pnpm/action-setup@v2
  with:
    version: 18
- name: Install CLI
  run: pnpm add --save-dev motion-plus-installer
- name: Run installer
  env:
    MOTION_TOKEN: ${{ secrets.MOTION_TOKEN }}
  run: npx motion-plus-installer -p motion-plus -v 2.0.0
```

## Troubleshooting

- Token not found / auth error: ensure `MOTION_TOKEN` is set and not expired.
- `require is not defined` ESM/CJS issues: the distributed package is built as CommonJS. If you run from source and see errors, use the release tarball via `pnpm add`.
- `ENOENT` (pnpm cannot find the tgz): by default downloaded files are kept. If you used `--no-keep`, the file will have been removed after installation.
- Proxy downloads failing: set `HTTP_PROXY`/`HTTPS_PROXY` or use `--proxy`.

## Security

- `MOTION_TOKEN` is sensitive. Treat it as a secret and do not commit it to version control.

## See also

- Developer docs and build instructions: `packages/motion-plus-installer/docs/dev.en.md`

---
*Translated from Japanese to English using AI assistance.*
