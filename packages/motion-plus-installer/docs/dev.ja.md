<p align="center">
  <picture>
    <img width="150" src="../../../assets\images\motion-inst.1500x1500.png" alt="Motion Inst Logo">
  </picture>
  <h2 align="center">
    Motion Inst
  </h2>
  <p align="center">
    Motion+ パッケージをインストールする軽量 CLI
    <br />
    <a href="#"><strong>Learn more »</strong></a>
    <br />
    <br />
    <a href="#">Discord</a>
    ·
    <a href="#">Website</a>
    ·
    <a href="https://github.com/toakiryu/motion-plus-installer/issues">Issues</a>
  </p>
</p>

# Motion Plus Installer (DEV) — 使い方 (日本語)

## 目的

Motion 製品の認証付き API から .tgz を取得し、`pnpm add ./<file.tgz>` でローカルに自動インストールする軽量 CLI です。

## クイックスタート

リポジトリ内パッケージのビルドとパック（例）:

```powershell
cd packages\motion-plus-installer
pnpm install
pnpm run build
pnpm pack
# -> motion-plus-installer-0.1.0.tgz が生成される
```

テストプロジェクトでローカル tgz をインストール:

```powershell
cd /path/to/test-project
pnpm init -y
pnpm add "C:\path\to\motion-plus-installer-0.1.0.tgz"
.\node_modules\.bin\motion-plus-installer --help
```

## 使い方（CLI）

コマンド: `motion-plus-installer [options]`

主なオプション:

- `-p, --package` : パッケージ名（デフォルト: `motion-plus`）
- `-v, --pkg-version` : バージョン（デフォルト: 環境変数または `2.0.0-alpha.4`）
- `-s, --storage` : `node_modules` 内の保存先サブディレクトリ（例: `.motion-plus`）
- `-t, --token` : Authorization Bearer token（環境変数 `MOTION_TOKEN` が優先）
- `--keep / --no-keep` : ダウンロード後に .tgz を保持するか（デフォルト: 保持）
- `--force` : 既存ファイルを上書きして再ダウンロード
- `--retry <n>` : ダウンロード再試行回数（デフォルト 2）
- `--out <path>` : 直接出力ファイルパスを指定（`node_modules` 自動接頭なし）
- `--pnpm-cmd <cmd>` : `pnpm` 実行コマンド（デフォルト `pnpm`）
- `--proxy <url>` : HTTP(S) プロキシ
- `-q, --quiet` : 最小ログ
- `--no-pretty` : 色付け / パス短縮などを無効化
- `-h, --help` : ヘルプ

## 環境変数

- `MOTION_TOKEN` : 必須（API 認証用 Bearer token）
- `MOTION_PACKAGE` : デフォルトパッケージ名
- `MOTION_VERSION` : デフォルトバージョン
- `MOTION_STORAGE_SUBDIR` : node_modules 内の保存先サブディレクトリ
- `MOTION_REGISTRY_URL` : テスト用にダウンロード先ベース URL を上書き（例: `http://127.0.0.1:8000/registry`）
- 標準の `HTTP_PROXY` / `HTTPS_PROXY` を尊重

## セキュリティと運用注意

- トークン値はログに出力しません（存在のみ表示）。
- ダウンロードキャッシュは `node_modules/<storageSubdir>/` に保存されるため、リポジトリにコミットしないよう `.gitignore` に追加することを推奨します。

例: `.gitignore` に `node_modules/.motion-plus-installer/`

## ビルド & 配布

- `pnpm run build` で `dist/` にバンドルされた実行ファイルを生成します（配布は `pnpm pack` か `npm publish`）。
- `prepack` スクリプトで自動的にビルドされるよう設定されています。

## テスト

- ユニット: `src` のユーティリティ関数を `node:test` で実行（`pnpm test`）。
- E2E: `MOTION_REGISTRY_URL` を使いローカル HTTP サーバを立て、実際にダウンロード → `pnpm add ./<file.tgz>` が成功するか確認してください。

## トラブルシューティング

- `require is not defined` や ESM/CJS のエラーが出る場合: CLI は配布用に CommonJS へビルド済みです。ビルド済みファイル（`dist/`）が存在するか、`pnpm run build` を先に実行してください。
- `ENOENT`（pnpm が tgz を見つけられない）: デフォルトでダウンロードファイルは保持されます。`--no-keep` を指定しない限り削除されません。パスが正しいか確認してください。

## ライセンス

- MIT（パッケージの `package.json` を参照）
