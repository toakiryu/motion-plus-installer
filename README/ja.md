<p align="center">
  <picture>
    <img width="150" src="https://raw.githubusercontent.com/toakiryu/motion-plus-installer/refs/heads/main/assets/images/motion-inst.1500x1500.png" alt="Motion Inst Logo">
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
    <a href="/README/ja.md">Japanese</a>
    ·
    <a href="/README/en.md">English</a>
  </p>
</p>

# Motion Plus Installer

Motion 製品の配布用 `.tgz` を認証付き API から取得し、プロジェクトへ自動インストールするための軽量 CLI ツールです。デフォルトでは `pnpm` を優先しますが、`npm` や他のパッケージマネージャーもサポートしており、`--pm-cmd` オプションで明示的に指定できます。

## 作成経緯

このツールは、Motion 製品を社内や顧客環境へ配布する際に毎回手動で `.tgz` をダウンロードしてプロジェクトに追加する運用の手間を減らすために作られました。認証が必要な配布 API に対して、CI やローカル開発から安全にパッケージを取得して即座にインストールできるように、自動化と再現性を重視して設計しています。

主な動機:

- 手動ダウンロードのミスを減らす（バージョン違いやパスの取り違えなど）
- CI パイプラインでの自動化を容易にする
- ダウンロードキャッシュによりビルドの再現性とオフライン対策を向上させる

## 対応パッケージマネージャー

| パッケージマネージャー | サポート状況 | 動作確認 | 備考                                                               |
| ---------------------- | -----------: | :------: | ------------------------------------------------------------------ |
| `pnpm`                 |  推奨 / 優先 |    ◎     | デフォルトで優先されます。最も検証された選択肢です。               |
| `npm`                  |     サポート |    〇    | 検出条件によりフォールバックとして選択されます。                   |
| `yarn`                 |     サポート |    △     | Classic / Berry の違いにより挙動が異なる場合があります。           |
| `bun`                  |       実験的 |    ×     | PATH に `bun` がある場合に検出されます。互換性に注意してください。 |

> [詳細はこちら](#パッケージマネージャの自動検出)

## 利点

- 簡単: 1 コマンドで認証付き API からダウンロードして `pnpm` / `npm` 等のパッケージマネージャーを使ってプロジェクトへインストールします（デフォルトでは `pnpm` が優先されます）。
- 安全: トークンは環境変数で渡し、ログへトークン値を直接出力しない設計です。
- CI フレンドリー: シークレットを使った自動実行と、`--pm-cmd` でパッケージマネージャーを指定できる柔軟性を確保します。明示指定がない場合はリポジトリや環境を参照して自動検出します。
- 再現性: ダウンロードした `.tgz` をキャッシュすることで同一バージョンの再利用やオフラインでのインストールが可能です。
- 軽量: 重い外部のパッケージ管理ツールに依存せず、Node 環境で動作する軽量な設計です（パッケージマネージャーは自動検出または `--pm-cmd` で指定できます）。

1. プロジェクトにインストール（開発用依存の例）:

```sh
cd /path/to/your-project
pnpm add --save-dev motion-plus-installer
```

1. 環境変数にトークンを設定して実行（PowerShell の例）:

```sh
$env:MOTION_TOKEN = 'your-token'
npx motion-plus-installer -p motion-plus -v 2.0.0
```

1. ローカル `.env` から一時的に環境変数を読み込んで実行する例（推奨）:

```sh
npx dotenv-cli -e .env -- npx motion-plus-installer -p motion-plus -v 2.0.0
```

## ドキュメント

- [利用者向けの詳細な手順・オプション・CI サンプル](https://github.com/toakiryu/motion-plus-installer/blob/main/packages/motion-plus-installer/docs/usage.ja.md)
- [開発者向け（ビルド手順、テスト、設計仕様）](https://github.com/toakiryu/motion-plus-installer/blob/main/packages/motion-plus-installer/docs/dev.ja.md)

## パッケージマネージャの自動検出

1. 環境変数（`npm_config_user_agent` 等）や実行パス情報（`npm_execpath`）
2. `package.json` の `packageManager` フィールド
3. リポジトリルートに存在するロックファイル（`pnpm-lock.yaml`, `package-lock.json`, `yarn.lock` など）
4. PATH 上での `pnpm` / `npm` / `yarn` 実行可能性チェック
5. どれも見つからない場合は `npm` をフォールバックとして選択します。

-- 明示的に `pnpm` 固有の挙動を期待する場合は、`--pm-cmd pnpm` のように指定してください。旧オプションの `--pnpm-cmd` は互換性のために残していますが、新しい `--pm-cmd` を推奨します。

注: 明示的に指定する場合は `--pm-cmd <コマンド>` を使ってください（例: `--pm-cmd npm`）。
リストにない別のパッケージマネージャを使う場合も、実行可能なコマンド名を指定すれば動作することが多いですが、フラグやサブコマンドの違いにより期待どおりに動かない場合があります。

## 開発とビルド

開発者向けの基本的な流れ:

```sh
cd packages/motion-plus-installer
pnpm install
pnpm run build
pnpm test
```

- 配布時には `pnpm pack` または `npm publish` を使用します。
- ビルドは `dist/` に実行ファイルを生成するように設定されています（プロジェクトの設定に従ってください）。

注意: パッケージのビルド・パッケージング手順はパッケージマネージャに依存しないように整備しています。`prepack` フックは内部ビルドスクリプト（`node ./build.mjs`）を使うため、利用者側で必ずしも `pnpm` を要求しません。

## セキュリティと注意点

- `MOTION_TOKEN` は機密情報です。CI ではシークレットストア（例: GitHub Secrets）を利用してください。
- ダウンロードしたキャッシュは `.gitignore` に含めることを推奨します（例: `node_modules/.motion-plus-installer/`）。

## ライセンス

本リポジトリのライセンスは [`license.txt`](https://github.com/toakiryu/motion-plus-installer/blob/main/LICENSE.txt) を参照してください（通常は MIT）。
