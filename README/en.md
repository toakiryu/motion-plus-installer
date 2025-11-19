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
    <a href="https://motion-inst.oss.toaki.cc"><strong>Learn more »</strong></a>
    <br />
    <br />
    <a href="#">Discord</a>
    ·
    <a href="https://motion-inst.oss.toaki.cc">Website</a>
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

Motion Plus Installer is a lightweight CLI tool that fetches distribution `.tgz` files for Motion from an authenticated API and installs them into your project.By default it prefers `pnpm`, but it also supports `npm` and other package managers and lets you explicitly choose one with the `--pm-cmd` option.

## Background

This tool was created to reduce manual steps when distributing Motion packages internally or to customers.Instead of downloading `.tgz` files by hand and adding them into projects, this CLI automates fetching authenticated packages and installing them, improving reproducibility and enabling CI workflows.

Key motivations:

- Reduce human error when downloading or selecting package versions
- Make CI integration and automation easier
- Improve reproducibility and offline resilience by caching downloaded `.tgz` files

## Supported package managers

| Package manager |                 Support | Verified | Notes                                                                  |
| --------------- | ----------------------: | :------: | ---------------------------------------------------------------------- |
| `pnpm`          | Recommended / preferred |     ◎    | Preferred by default;Most thoroughly tested.           |
| `npm`           |               Supported |     〇    | Can be selected as a fallback depending on detection.  |
| `yarn`          |               Supported |     △    | Behavior may differ between Classic and Berry.         |
| `bun`           |            Experimental |     ×    | Detected if `bun` is on PATH;Compatibility is limited. |

_See the ["Package manager auto-detection"](https://motion-inst.oss.toaki.cc/docs/pm-detection) section for detection behavior._

## Benefits

- Simple: one command downloads the authenticated package and installs it into your project using the selected package manager (pnpm is preferred by default).
- Safe: tokens are passed via environment variables and token values are not printed to logs.
- CI-friendly: works with secrets and provides `--pm-cmd` to explicitly choose a package manager when desired.If not specified, the CLI attempts to auto-detect the manager from the environment and repository.
- Reproducible: cached `.tgz` files enable consistent installs and offline usage.
- Lightweight: designed to run in Node environments without heavy external dependencies; (package manager is auto-detected or selectable via `--pm-cmd`).

## License

See [`license.txt`](https://github.com/toakiryu/motion-plus-installer/blob/main/LICENSE.txt) for license information (typically MIT).
