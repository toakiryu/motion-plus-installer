# CLI リファレンス

このページは `motion-plus-installer` CLI の主要オプションと使用例をまとめたリファレンスです。

## 基本

::: tip
ローカルにインストールしている場合は `./node_modules/.bin/motion-plus-installer` を直接利用できます。グローバルにインストールしている場合は `motion-plus-installer --help` で確認してください。
:::

この CLI はサブコマンド方式を採用しています。インストール操作は `install`（エイリアス `i`）サブコマンドを使って明示的に実行してください。

## サブコマンドと主なオプション

- **install** (`i`): 指定パッケージをダウンロードしてインストールします。引数は `pkg@version` 形式で指定します（例: `motion-plus@latest`）。
  - オプション（サブコマンドに付与）:
    - `-s, --storage <subdir>`: ダウンロードキャッシュの保存先（`node_modules` 内のサブディレクトリ）。デフォルト: `.motion-plus-installer`
    - `-t, --token <token>`: API へ渡す Bearer トークン（未指定の場合は環境変数 `MOTION_TOKEN` を参照。未設定だと実行時にエラーになります）。
    - `--keep` / `--no-keep`: ダウンロードした `.tgz` を保持する / 削除する（デフォルト: `--keep`）。
    - `--force`: 既存キャッシュを上書きして再ダウンロードする（デフォルト: false）。
    - `--retry <n>`: ダウンロードの再試行回数（デフォルト: `2`）。
    - `--out <path>`: ダウンロードした `.tgz` を指定パスへ直接出力する（`node_modules` の自動接頭なし）。
    - `--pm-cmd <cmd>`: 使用するパッケージマネージャコマンドを明示（例: `pnpm`, `npm`, `yarn`）。未指定時は自動検出します。
    - `--proxy <url>`: HTTP(S) プロキシを指定（実行時に `HTTP_PROXY` / `HTTPS_PROXY` 環境変数も設定されます）。
    - `-q, --quiet`: ログ出力を抑えて最小化する。
    - `--no-pretty`: 色付けやパス短縮などの「見た目」機能を無効化する。

  ::: warning 高度なオプション

  `-a, --allow-default`: 引数も環境変数も指定されていない場合に限り、デフォルトの `motion-plus@latest` へフォールバックします。通常は使用しないでください。CI などで自動化する場合にのみ明示的に指定してください。

  :::

- **clear-cache** (`cc`): ダウンロードキャッシュ（`.tgz`）を削除します。
  - オプション:
    - `-s, --storage <subdir>`: 対象ストレージを指定（既定: `.motion-plus-installer`）。
    - `--all`: ストレージディレクトリを丸ごと削除する（再帰削除）。
    - `-q, --quiet`: ログ出力を抑える。

その他の共通オプション（グローバル）:

- `-V, --version`: CLI のバージョンを表示します。
- `-h, --help`: ヘルプを表示します（commander 標準）。

## 実行前の確認

- `MOTION_TOKEN` を用意していることを確認してください。`install` 実行時に `--token` を指定するか、環境変数 `MOTION_TOKEN` を設定してください。
- 対象パッケージは `pkg@version` 形式で指定します。バージョンを省略したい場合は `latest` を指定してください（例: `motion-plus@latest`）。
- CI 環境では `MOTION_TOKEN` をシークレットに登録してください。

詳細な環境変数や設定方法については [環境変数と設定](./configuration) を参照してください。

## 実行例

- 最新（latest）をインストール:

```sh
motion-plus-installer install motion-plus@latest
# 省略形
motion-plus-installer i motion-plus@latest
```

- 特定バージョンをインストール:

```sh
motion-plus-installer install motion-plus@2.0.0-alpha.5
```

- キャッシュを削除（デフォルトストレージ内の .tgz を削除）:

```sh
motion-plus-installer clear-cache
```

- ストレージを丸ごと削除:

```sh
motion-plus-installer clear-cache --all
```

実際のコマンド例（`npx` / `pnpm dlx`、`.env` 例、CI スニペットなど）は、サイトの [利用方法](./usage) ページに集約しています。
