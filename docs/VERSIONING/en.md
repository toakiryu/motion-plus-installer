# Versioning policy

We follow Semantic Versioning 2.0.0 (SemVer) for releases.

This file gives a short, practical summary — SemVer is more detailed, so see the official spec for full rules: https://semver.org/

## Short summary (practical)

- Version format: `MAJOR.MINOR.PATCH` (for example `1.4.2`).
- Increment the **MAJOR** version when you make incompatible API changes (breaking changes).
- Increment the **MINOR** version when you add functionality in a backwards-compatible manner.
- Increment the **PATCH** version when you make backwards-compatible bug fixes.

Examples:
- Fix a bug → bump `PATCH`: `1.0.0` → `1.0.1`
- Add a backward-compatible feature → bump `MINOR`: `1.0.1` → `1.1.0`
- Change public behavior incompatibly → bump `MAJOR`: `1.1.0` → `2.0.0`

## Pre-release / build metadata (optional)

- You can use pre-release identifiers like `1.2.0-alpha.1` for preview builds.
- Build metadata (after `+`) does not affect version precedence.

## How we use it in this repository

- The canonical package to publish is `packages/motion-plus-installer/package.json`.
- To publish a new release using the CI workflow in this repo, bump the `version` field in that `package.json`, open a PR to `main`, and merge. The publish workflow will run when `packages/motion-plus-installer/package.json` changes on `main` (or when a `v*` tag is pushed).
- Alternatively, you may create a git tag like `v1.2.3` and push it; the workflow is also triggered on `push` tags matching `v*`.

## Quick checklist for a release

1. Update `packages/motion-plus-installer/package.json` `version` field appropriately.
2. Commit and open a PR against `main` (include changelog or brief notes).
3. After reviewing and merging, the GitHub Actions workflow will build and publish the package.
4. Optionally push a release tag or create a GitHub Release for release notes.

## Link to the full spec

Read the full Semantic Versioning 2.0.0 spec for precise rules and examples: https://semver.org/

---
*Short summary added for maintainers — see the official spec for edge cases.*
