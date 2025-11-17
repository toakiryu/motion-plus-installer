# 利用方法 {#usage}

ここではエンドユーザー向けの実例を示します。

## 開発依存としてインストール

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

## 一時的に実行（npx / dlx）

::: code-group

```sh [pnpm]
pnpm dlx motion-plus-installer -p motion-plus -v 2.0.0
```

```sh [npm]
npx motion-plus-installer -p motion-plus -v 2.0.0
```

:::

## 環境変数（PowerShell の例）

```sh [PowerShell ~vscode-icons:file-type-powershell~]
$env:MOTION_TOKEN = 'your-token'
```

::: code-group

```sh [pnpm]
pnpm dlx motion-plus-installer
```

```sh [npm]
npx motion-plus-installer
```

:::

## ENV を使う（dotenv-cli）

::: code-group

```sh [pnpm]
pnpm dlx dotenv-cli -e .env -- pnpm dlx motion-plus-installer
```

```sh [npm]
npx dotenv-cli -e .env -- npx motion-plus-installer
```

:::

## CI 例（GitHub Actions）

```yaml
- name: Install CLI
  run: pnpm add --save-dev motion-plus-installer
- name: Run installer
  env:
    MOTION_TOKEN: ${{ secrets.MOTION_TOKEN }}
  run: npx motion-plus-installer -p motion-plus -v 2.0.0
```

### 注意点

- `MOTION_TOKEN` は機密情報です。CI ではシークレットとして保存してください。[トークンノート](#token-note)
- `.tgz` の扱い（`--keep` / `--no-keep`）に注意してください。

#### トークンノート {#token-note}

ローカル検証では `.env` を使うことが便利ですが、本番や CI では必ずシークレットストアを利用してください。

詳細は [CLI リファレンス](./cli-reference) と [環境変数と設定](./configuration) を参照してください。
