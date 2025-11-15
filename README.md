<p align="center">
  <picture>
    <img width="150" src="./assets\images\motion-inst.1500x1500.png" alt="Motion Inst Logo">
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
    <br />
    <br />
    <br />
    <a href="#">Japanese</a>
    ·
    <a href="#">English</a>
  </p>
</p>

# Motion Plus Installer

Motion 製品の配布用 `.tgz` を認証付き API から取得し、`pnpm add ./<file.tgz>` でプロジェクトへ自動インストールするための軽量 CLI ツールです。

## 作成経緯

このツールは、Motion 製品を社内や顧客環境へ配布する際に毎回手動で `.tgz` をダウンロードしてプロジェクトに追加する運用の手間を減らすために作られました。認証が必要な配布 API に対して、CI やローカル開発から安全にパッケージを取得して即座に `pnpm add` できるように、自動化と再現性を重視して設計しています。

主な動機:

- 手動ダウンロードのミスを減らす（バージョン違いやパスの取り違えなど）
- CI パイプラインでの自動化を容易にする
- ダウンロードキャッシュによりビルドの再現性とオフライン対策を向上させる

## 利点

- 簡単: 1 コマンドで認証付き API からダウンロードして `pnpm add` まで実行します。
- 安全: トークンは環境変数で渡し、ログへトークン値を直接出力しない設計です。
- CI フレンドリー: シークレットを使った自動実行と、`--pnpm-cmd` でコマンドの柔軟性を確保します。
- 再現性: ダウンロードした `.tgz` をキャッシュすることで同一バージョンの再利用やオフラインでのインストールが可能です。
- 軽量: 外部の heavyweight なパッケージ管理ツールに依存せず、Node + pnpm のワークフローに馴染む設計です。

## 概要

- ダウンロード元は認証が必要な API であり、Bearer トークン（`MOTION_TOKEN`）でアクセスします。
- ダウンロードした `.tgz` はデフォルトで `node_modules/<storageSubdir>/` にキャッシュされ、`pnpm add` によってローカルインストールされます。
- CLI は再試行・強制再取得・キャッシュ保持/削除などのオプションを備え、CI 環境でも利用できるよう設計されています。

## すばやい利用手順（利用者向け）

1. プロジェクトにインストール（開発用依存の例）:

```powershell
cd /path/to/your-project
pnpm add --save-dev motion-plus-installer
```

2. 環境変数にトークンを設定して実行（PowerShell の例）:

```powershell
$env:MOTION_TOKEN = 'your-token'
npx motion-plus-installer -p motion-plus -v 2.0.0
```

3. ローカル `.env` から一時的に環境変数を読み込んで実行する例（推奨）:

```powershell
npx dotenv-cli -e .env -- npx motion-plus-installer -p motion-plus -v 2.0.0
```

## ドキュメント

- 利用者向けの詳細な手順・オプション・CI サンプル: `packages/motion-plus-installer/docs/usage.ja.md`
- 開発者向け（ビルド手順、テスト、設計仕様）: `packages/motion-plus-installer/docs/dev.ja-jp.md`

## 開発とビルド

開発者向けの基本的な流れ:

```powershell
cd packages/motion-plus-installer
pnpm install
pnpm run build
pnpm test
```

- 配布時には `pnpm pack` または `npm publish` を使用します。
- ビルドは `dist/` に実行ファイルを生成するように設定されています（プロジェクトの設定に従ってください）。

## セキュリティと注意点

- `MOTION_TOKEN` は機密情報です。CI ではシークレットストア（例: GitHub Secrets）を利用してください。
- ダウンロードしたキャッシュは `.gitignore` に含めることを推奨します（例: `node_modules/.motion-plus-installer/`）。

## ライセンス

本リポジトリのライセンスは `packages/motion-plus-installer/package.json` を参照してください（通常は MIT）。
