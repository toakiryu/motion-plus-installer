# Motion Plus Installer

Lightweight CLI to install Motion+ packages

Motion Plus Installer fetches authenticated distribution `.tgz` files for Motion and installs them into your project (the CLI runs `pnpm add ./<file.tgz>` by default).

## Quick install

Install in a project (dev dependency):

~~~sh
cd /path/to/your-project
pnpm add --save-dev motion-plus-installer
~~~

Or run without installing via npx:

~~~sh
npx motion-plus-installer -p motion-plus -v 2.0.0
~~~

## Required environment

- `MOTION_TOKEN` — Bearer token used to access the protected download API.

Example (PowerShell):

~~~sh
$env:MOTION_TOKEN = 'your-token'
npx motion-plus-installer -p motion-plus -v 2.0.0
~~~

## Common options

- `-p, --package <name>` : package name (default: `motion-plus`).
- `-v, --pkg-version <version>` : version to fetch.
- `--keep / --no-keep` : keep downloaded `.tgz` after install (default: keep).
- `--force` : force re-download.
- `--pnpm-cmd <cmd>` : pnpm command to run (default: `pnpm`).
- `-q, --quiet` : minimal logging.

See `motion-plus-installer --help` for the full list of options.

## CI example (GitHub Actions)

~~~yml
- name: Install CLI
  run: pnpm add --save-dev motion-plus-installer
- name: Run installer
  env:
    MOTION_TOKEN: ${{ secrets.MOTION_TOKEN }}
  run: npx motion-plus-installer -p motion-plus -v 2.0.0
~~~

## Developer docs

Detailed usage and development instructions: `packages/motion-plus-installer/docs/usage.en.md` and `packages/motion-plus-installer/docs/dev.en.md`.

## License

See `packages/motion-plus-installer/package.json` for license information.
