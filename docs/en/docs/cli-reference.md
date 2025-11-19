# CLI Reference

This page provides a consolidated reference for major options and usage examples of the `motion-plus-installer` CLI.

## Basics

:::tip
If installed locally, you can invoke `./node_modules/.bin/motion-plus-installer` directly.If installed globally, run `motion-plus-installer --help` to check availability.
:::

This CLI follows a subcommand-based design.Installation operations must be executed explicitly using the `install` (alias: `i`) subcommand.

## Subcommands and Key Options

- **install** (`i`): Downloads and installs the specified package.Arguments must follow the `pkg@version` format (e.g., `motion-plus@latest`).

  - Options (applied to the subcommand):
    - `-s, --storage <subdir>`: (Subdirectory inside `node_modules`) used for download caching.Default: `.motion-plus-installer`
    - `-t, --token <token>`: Bearer token for API calls. (If omitted, the `MOTION_TOKEN` environment variable is used.Execution fails if neither is set).
    - `--keep` / `--no-keep`: Retain or delete downloaded `.tgz` files (default: `--keep`).
    - `--force`: Overwrite existing cache and re-download (default: false).
    - `--retry <n>`: Number of retry attempts for downloads (default: `2`).
    - `--out <path>`: Output downloaded `.tgz` directly to the specified path (without auto-prefixing inside `node_modules`).
    - `--pm-cmd <cmd>`: Explicit package manager command (e.g., `pnpm`, `npm`, `yarn`).Auto-detected if omitted.
    - `--proxy <url>`: Specify an HTTP(S) proxy. (Automatically sets `HTTP_PROXY` / `HTTPS_PROXY` during execution).
    - `-q, --quiet`: Minimize log output.
    - `--no-pretty`: Disable formatting features like color and path shortening.

  ::: warning Advanced Option

  `-a, --allow-default`: Falls back to `motion-plus@latest` **only when neither arguments nor environment variables are provided**.Avoid using this unless requiredfor automation scenarios such as CI.

  :::

- **clear-cache** (`cc`): Deletes cached download artifacts (`.tgz`).
  - Options:
    - `-s, --storage <subdir>`: Target storage (default: `.motion-plus-installer`).
    - `--all`: Remove the entire storage directory recursively.
    - `-q, --quiet`: Suppress log output.

Other (global) options:

- `-V, --version`: Display the CLI version.
- `-h, --help`: Show help output (commander standard).

## Pre-execution Checklist

- Ensure that `MOTION_TOKEN` is available.Specify it via `--token` or set the `MOTION_TOKEN` environment variable.
- Specify target packages in `pkg@version` format.Use `latest` to omit version numbers (e.g., `motion-plus@latest`).
- In CI environments, store `MOTION_TOKEN` as a secret.

For details on environment variables and configuration, refer to [Environment Variables & Configuration](./configuration).

## Usage Examples

- Install the latest version:

```sh
motion-plus-installer install motion-plus@latest
# Short form
motion-plus-installer i motion-plus@latest
```

- Install a specific version:

```sh
motion-plus-installer install motion-plus@2.0.0-alpha.5
```

- Clear cache (delete `.tgz` files from default storage):

```sh
motion-plus-installer clear-cache
```

- ストレージを丸ごと削除:

```sh
motion-plus-installer clear-cache --all
```

実際のコマンド例（`npx` / `pnpm dlx`、`.env` 例、CI スニペットなど）は、サイトの [利用方法](./usage) ページに集約しています。
