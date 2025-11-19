# Usage {#usage}

This section provides practical examples for end users.

## Install as a development dependency

::: code-group

```sh [pnpm]
cd /path/to/your-project
pnpm add -D motion-plus-installer
```

```sh [npm]
cd /path/to/your-project
npm install --save-dev motion-plus-installer
```

:::

## Run temporarily (npx / dlx)

::: code-group

```sh [pnpm]
pnpm dlx motion-plus-installer i motion-plus@latest
```

```sh [npm]
npx motion-plus-installer motion-plus@latest
```

:::

## Environment variables (PowerShell example)

```sh [PowerShell ~vscode-icons:file-type-powershell~]
$env:MOTION_TOKEN = 'your-token'
```

::: code-group

```sh [pnpm]
pnpm dlx motion-plus-installer i motion-plus@latest
```

```sh [npm]
npx motion-plus-installer i motion-plus@latest
```

:::

## Using ENV files (dotenv-cli)

::: code-group

```sh [pnpm]
pnpm dlx dotenv-cli -e .env -- pnpm dlx motion-plus-installer i motion-plus@latest
```

```sh [npm]
npx dotenv-cli -e .env -- npx motion-plus-installer i motion-plus@latest
```

:::

## CI Example (GitHub Actions)

```yaml
- name: Install CLI
  run: pnpm add --save-dev motion-plus-installer
- name: Run installer
  env:
    MOTION_TOKEN: ${{ secrets.MOTION_TOKEN }}
  run: npx motion-plus-installer i motion-plus@latest
```

:::warning Warning

- `MOTION_TOKEN` is sensitive information.In CI environments, store it as a secret (see Token Notes).
- Be mindful of how `.tgz` files are handled (`--keep `/` --no-keep`).

:::

:::details Token Notes {#token-note}

Using `.env` is convenient for local testing, but in production or CI you must rely on a secret store.

:::

For more details, see the [CLI Reference](./cli-reference) and [Environment Variables & Configuration](./configuration).
