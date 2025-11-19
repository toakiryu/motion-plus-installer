# Quick Start {#getting-started}

This page explains how to install and use `motion-plus-installer` at a basic level.

## Example Usage (Reference)

To avoid duplication, concrete command examples on this site—such as using (`npx` / `pnpm dlx`, executing with `.env`, and CI snippets—are) consolidated on the [Usage](./usage) page.

## Using in CI

In CI environments, store `MOTION_TOKEN` as a secret, and invoke `npx motion-plus-installer` during your build steps.Example (GitHub Actions step):

```yaml [install.yml]
- name: Install Motion packages
  run: npx motion-plus-installer i motion-plus
  env:
    MOTION_TOKEN: ${{ secrets.MOTION_TOKEN }}
```

## Explicit Package Manager Specification

If automatic detection does not work properly, you can explicitly provide the command using the `--pm-cmd <cmd>` option.Simple examples and substitution patterns can be found in the [Usage](./usage) page.

For details, refer to the [CLI Reference](./cli-reference) and [Package Manager Detection](./pm-detection).
