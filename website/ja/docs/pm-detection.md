# パッケージマネージャ検出

`motion-plus-installer` は、利用するパッケージマネージャー（例: `pnpm`, `npm`, `yarn`, `bun`）を自動検出して、ダウンロードした `.tgz` をプロジェクトへ追加します。

このページでは検出の順序と、意図したマネージャーを使うための対処法を説明します。

## 検出の優先順位

自動検出は以下の順序で行われます（上位が優先）。

1. 環境変数 `npm_config_user_agent` の解析
2. 環境変数 `npm_execpath` の解析
3. プロジェクトの `package.json` の `packageManager` フィールド
4. ロックファイルの存在確認（`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lockb`）
5. 実行可能ファイルの存在チェック（`pnpm`, `yarn`, `bun` を順に確認）
6. 上記どれにも当てはまらない場合は `npm` を選択

このロジックにより、ローカル環境や CI 環境で一般的に使われているマネージャーを高い精度で推測できます。

## 各ステップの説明

- `npm_config_user_agent` / `npm_execpath`:
  - Node 実行時に設定される npm/Yarn/PNPM のユーザーエージェントや実行パスを参照します。npx や pnpm dlx 経由での実行時に有用です。
- `package.json` の `packageManager`:
  - 例: `"packageManager": "pnpm@8.0.0"` のように設定されている場合、そのマネージャーを優先します。
- ロックファイル:
  - リポジトリに残っているロックファイルから明示的に判定します（`pnpm-lock.yaml` → `pnpm`、`package-lock.json` → `npm`、`yarn.lock` → `yarn`、`bun.lockb` → `bun`）。
- 実行可能ファイルの有無チェック:
  - ローカル環境に `pnpm`/`yarn`/`bun` がインストールされているか `--version` 実行で確認します。

## 明示的に指定する（推奨）

自動検出が期待通りでない場合や CI 環境で確実に特定のマネージャーを使いたい場合は、CLI オプション `--pm-cmd <cmd>` を指定してください（例: `--pm-cmd pnpm`）。

::: code-group

```sh [pnpm]
# pnpm を使う例
pnpm dlx motion-plus-installer --pm-cmd pnpm -p motion-plus -v 2.0.0
```

```sh [npm]
# npm を使う例
npx motion-plus-installer --pm-cmd npm -p motion-plus -v 2.0.0
```

```sh [yarn]
# yarn を使う例
yarn dlx motion-plus-installer --pm-cmd yarn -p motion-plus -v 2.0.0
```

:::

## 実行後に実際に呼ばれるコマンド（内部）

インストーラは検出したマネージャーに応じて以下のように `.tgz` をプロジェクトに追加します。

- `pnpm`, `yarn` の場合: `pnpm add ./path/to/file.tgz` / `yarn add ./path/to/file.tgz`
- `npm` の場合: `npm install ./path/to/file.tgz`

（内部では、指定した `--pm-cmd` の先頭トークンをコマンド名として解析し、サブコマンドは上記のように組み立てられます。）

## CI の運用上の注意

- CI では環境が固定されているため、明示的に `--pm-cmd` を指定することを推奨します。特に `node` イメージやランナーが複数のパッケージマネージャを含む場合、検出結果が変わることがあります。
- 例（GitHub Actions）:

```yaml
- name: Install Motion package
  run: npx motion-plus-installer --pm-cmd pnpm -p motion-plus -v 2.0.0
  env:
    MOTION_TOKEN: ${{ secrets.MOTION_TOKEN }}
```

## トラブルシュートのヒント

- 検出結果を知りたい場合は、`--pm-cmd <cmd>` を指定して明示的に実行ログを確認してください。
- まれに、`npm_config_user_agent` が空で `package.json` に `packageManager` が設定されていないと、グローバルにインストールされた `pnpm` が優先される場合があります。CI では `--pm-cmd` 指定で回避できます。

---

### 関連

- [CLI リファレンス](./cli-reference)
- [トラブルシューティング](./troubleshooting)
