<p align="center">
  <picture>
    <img width="150" src="https://raw.githubusercontent.com/toakiryu/motion-plus-installer/refs/heads/main/assets/images/motion-inst.1500x1500.png" alt="Motion Inst Logo">
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
    <br />
    <br />
    <br />
    <a href="/README/ja.md">Japanese</a>
    ·
    <a href="/README/en.md">English</a>
  </p>
</p>

# Motion Plus Installer

Motion Plus Installer is a lightweight CLI tool that fetches distribution `.tgz` files for Motion from an authenticated API and installs them into your project. By default it prefers `pnpm`, but it also supports `npm` and other package managers and lets you explicitly choose one with the `--pm-cmd` option.

## Background

This tool was created to reduce manual steps when distributing Motion packages internally or to customers. Instead of downloading `.tgz` files by hand and adding them into projects, this CLI automates fetching authenticated packages and installing them, improving reproducibility and enabling CI workflows.

Key motivations:

- Reduce human error when downloading or selecting package versions
- Make CI integration and automation easier
- Improve reproducibility and offline resilience by caching downloaded `.tgz` files

## Supported package managers

| Package manager |                 Support | Verified | Notes                                                   |
| --------------- | ----------------------: | :------: | ------------------------------------------------------- |
| `pnpm`          | Recommended / preferred |    ◎     | Preferred by default; most thoroughly tested.           |
| `npm`           |               Supported |    〇    | Can be selected as a fallback depending on detection.   |
| `yarn`          |               Supported |    △     | Behavior may differ between Classic and Berry.          |
| `bun`           |            Experimental |    ×     | Detected if `bun` is on PATH; compatibility is limited. |

See the "Package manager auto-detection" section for detection behavior.

## Benefits

- Simple: one command downloads the authenticated package and installs it into your project using the selected package manager (pnpm is preferred by default).
- Safe: tokens are passed via environment variables and token values are not printed to logs.
- CI-friendly: works with secrets and provides `--pm-cmd` to explicitly choose a package manager when desired. If not specified, the CLI attempts to auto-detect the manager from the environment and repository.
- Reproducible: cached `.tgz` files enable consistent installs and offline usage.
- Lightweight: designed to run in Node environments without heavy external dependencies; package manager is auto-detected or selectable via `--pm-cmd`.

## Overview

- The download endpoint requires authentication using a Bearer token (`MOTION_TOKEN`).
- Downloaded `.tgz` files are cached by default under `node_modules/<storageSubdir>/` and then installed using the selected package manager.
- The CLI provides options for retries, force re-download, cache keep/remove, and more; it is designed to work well in CI.

## Quick Start (end users)

1. Install the CLI in your project (dev dependency example):

~~~sh
cd /path/to/your-project
pnpm add --save-dev motion-plus-installer
~~~

2. Set the token environment variable and run (PowerShell example):

~~~sh
$env:MOTION_TOKEN = 'your-token'
npx motion-plus-installer -p motion-plus -v 2.0.0
~~~

3. Run quickly with a local `.env` using `dotenv-cli` (recommended for local testing):

~~~sh
npx dotenv-cli -e .env -- npx motion-plus-installer -p motion-plus -v 2.0.0
~~~

## Package manager auto-detection

When `--pm-cmd` is not explicitly provided, the CLI attempts to detect the package manager in the following order:

1. Environment indicators (e.g. `npm_config_user_agent`) and execution path info (e.g. `npm_execpath`)
2. The `packageManager` field in `package.json`
3. Lockfiles at the repository root (`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, etc.)
4. Executable availability checks on `PATH` (e.g. `pnpm`, `npm`, `yarn`)
5. If none apply, fall back to `npm`

If you specifically rely on `pnpm` behavior, pass `--pm-cmd pnpm`. The old `--pnpm-cmd` option remains for compatibility but `--pm-cmd` is preferred.

## Documentation

- [Detailed user instructions, options, and CI examples](https://github.com/toakiryu/motion-plus-installer/blob/main/packages/motion-plus-installer/docs/usage.en.md)
- [Developer documentation (build steps, tests, design)](https://github.com/toakiryu/motion-plus-installer/blob/main/packages/motion-plus-installer/docs/dev.en.md)

## Development & Build

Basic development flow:

~~~sh
cd packages/motion-plus-installer
pnpm install
pnpm run build
pnpm test
~~~

- Use `pnpm pack` or `npm publish` to publish a release.
- The build generates an executable under `dist/`.

## Security & Notes

- `MOTION_TOKEN` is sensitive. Use secret stores (e.g. GitHub Secrets) in CI.
- Add the download cache to `.gitignore` (example: `node_modules/.motion-plus-installer/`).

## License

See [`license.txt`](https://github.com/toakiryu/motion-plus-installer/blob/main/LICENSE.txt) for license information (typically MIT).
