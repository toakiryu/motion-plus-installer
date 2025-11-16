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
    <a href="https://github.com/toakiryu/motion-plus-installer/blob/main/README/ja.md">Japanese</a>
    ·
    <a href="https://github.com/toakiryu/motion-plus-installer/blob/main/README/en.md">English</a>
  </p>
</p>

# Motion Plus Installer

Lightweight CLI to install Motion+ packages

Motion Plus Installer fetches authenticated distribution `.tgz` files for Motion and installs them into your project. By default the CLI prefers `pnpm`, but it also supports `npm` and other package managers; you can explicitly choose one with the `--pm-cmd` option.

## Quick install

Install in a project (dev dependency):

```sh
cd /path/to/your-project
pnpm add --save-dev motion-plus-installer
```

Or run without installing via npx:

```sh
npx motion-plus-installer -p motion-plus -v 2.0.0
```

## Supported package managers

| Package manager |                 Support | Verified | Notes                                                   |
| --------------- | ----------------------: | :------: | ------------------------------------------------------- |
| `pnpm`          | Recommended / preferred |    ◎     | Preferred by default; most thoroughly tested.           |
| `npm`           |               Supported |    〇    | Can be selected as a fallback depending on detection.   |
| `yarn`          |               Supported |    △     | Behavior may differ between Classic and Berry.          |
| `bun`           |            Experimental |    ×     | Detected if `bun` is on PATH; compatibility is limited. |

See the "Package manager auto-detection" section for detection behavior.

## Required environment

- `MOTION_TOKEN` — Bearer token used to access the protected download API.

Example (PowerShell):

```sh
$env:MOTION_TOKEN = 'your-token'
npx motion-plus-installer -p motion-plus -v 2.0.0
```

## Common options

- `-p, --package <name>` : package name (default: `motion-plus`).
- `-v, --pkg-version <version>` : version to fetch.
- `--keep / --no-keep` : keep downloaded `.tgz` after install (default: keep).
- `--force` : force re-download.
- `--pnpm-cmd <cmd>` : pnpm command to run (default: `pnpm`).
- `-q, --quiet` : minimal logging.

See `motion-plus-installer --help` for the full list of options.

## CI example (GitHub Actions)

```yml
- name: Install CLI
  run: pnpm add --save-dev motion-plus-installer
- name: Run installer
  env:
    MOTION_TOKEN: ${{ secrets.MOTION_TOKEN }}
  run: npx motion-plus-installer -p motion-plus -v 2.0.0
```

## Documentation

- [Detailed user instructions, options, and CI examples](https://github.com/toakiryu/motion-plus-installer/blob/main/packages/motion-plus-installer/docs/usage.en.md)
- [Developer documentation (build steps, tests, design)](https://github.com/toakiryu/motion-plus-installer/blob/main/packages/motion-plus-installer/docs/dev.en.md)

## License

See [`license.txt`](https://github.com/toakiryu/motion-plus-installer/blob/main/packages/motion-plus-installer/LICENSE.txt) for license information.
