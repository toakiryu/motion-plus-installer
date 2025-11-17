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
    <br />
    <br />
    <br />
    <a href="./usage.ja.md">Japanese</a>
    ·
    <a href="./usage.en.md">English</a>
  </p>
</p>

# Motion Plus Installer — インストールと使い方（利用者向け）

このドキュメントは、エンドユーザーが `pnpm` 経由で `motion-plus-installer` をインストールし、実際に Motion 製品の .tgz を取得して `pnpm add` でプロジェクトに追加するまでの、簡潔な手順と例を示します。

## インストール（推奨）

プロジェクトにローカルでインストールする例:

~~~powershell
cd /path/to/your-project
pnpm add --save-dev motion-plus-installer
# もしくは開発依存にしたくない場合
pnpm add motion-plus-installer
~~~

グローバルで使いたい場合（OS によっては権限や PATH の扱いに注意）:

~~~powershell
pnpm add -g motion-plus-installer
~~~

インストール後、実行方法の例:

- プロジェクトにローカルインストールした場合:
  - `npx motion-plus-installer --help`
  - または `.\node_modules\.bin\motion-plus-installer --help`
- グローバルインストールした場合:
  - `motion-plus-installer --help`

## 必要な環境変数

- `MOTION_TOKEN` — 必須。Motion 製品のダウンロード API にアクセスするための Bearer トークン。
  - 例（PowerShell）:

~~~powershell
$env:MOTION_TOKEN = 'your-token-here'
motion-plus-installer -p motion-plus
~~~

CI/CD ではシークレットストア（GitHub Secrets 等）にトークンを入れて渡してください。

### ローカルで .env を使う場合（推奨）

ローカル開発時に `.env` ファイルから一時的に環境変数を読み込んでコマンドを実行するには、`dotenv-cli` を使うと便利です。`npx` を使えばローカルにインストールせずに実行できます。例:

~~~powershell
npx dotenv-cli -e .env -- npx motion-plus-installer -p motion-plus -v 2.0.0
~~~

CI 環境ではシークレットストアを使用することを推奨しますが、ローカルの簡易検証では上記コマンドが便利です。

## 使い方（簡易例）

1. トークンをセットして、指定パッケージ/バージョンをインストールする最小例:

~~~powershell
# 環境変数にトークンをセット
$env:MOTION_TOKEN = 'xxxxx'
# パッケージ 'motion-plus' のデフォルト（または指定）バージョンをダウンロードして pnpm add する
npx motion-plus-installer -p motion-plus -v 2.0.0
~~~

2. 既存キャッシュを上書きして再ダウンロードする（--force）:

~~~powershell
npx motion-plus-installer -p motion-plus --force
~~~

3. ダウンロードした .tgz を自動で削除したい場合（デフォルトは保持）:

~~~powershell
npx motion-plus-installer -p motion-plus --no-keep
~~~

## 主要 CLI オプション（概要）

- `-p, --package <name>` : 製品パッケージ名（例: `motion-plus`）。
- `-v, --pkg-version <version>` : 取得したいバージョン。
- `-t, --token <token>` : `MOTION_TOKEN` を使わない場合、ここで直接指定できます（注意：シェル履歴に残る可能性あり）。
- `-s, --storage <subdir>` : `node_modules` 内のキャッシュ保存先サブディレクトリを指定（デフォルトあり）。
- `--keep / --no-keep` : ダウンロード後に .tgz を保持するか（デフォルト: 保持）。
- `--force` : 既存のキャッシュを上書きして再ダウンロードする。
- `--retry <n>` : ダウンロード再試行回数（デフォルト 2）。
- `--pm-cmd <cmd>` : パッケージマネージャ実行コマンド（例: `pnpm`, `npm`, `yarn`）を指定します。互換性のため `--pnpm-cmd` も受け付けます。
- `-q, --quiet` : 最小限のログ出力。
- `--no-pretty` : 色付けやパス短縮などの「見た目」機能を無効化し、プレーン出力にします。

詳細は `motion-plus-installer --help` を参照してください。

## 自動パッケージマネージャ検出

`--pm-cmd`（または互換の `--pnpm-cmd`）が指定されていない場合、CLI は実行環境とリポジトリの状態から自動的に利用するパッケージマネージャを推測して選択します。一般的な優先順位は次の通りです。

1. 環境変数 `npm_config_user_agent`（CI やラッパーが設定することが多い）
2. 環境変数 `npm_execpath`（実行された npm 系コマンドのパス）
3. `package.json` の `packageManager` フィールド（例: `pnpm@7.0.0`）
4. ロックファイルの存在（`pnpm-lock.yaml` → `package-lock.json` → `yarn.lock` → `bun.lockb` の順）
5. PATH に存在する実行可能ファイル（`pnpm`, `yarn`, `bun` など）
6. 上記で特定できない場合は `npm` をデフォルトとします。

自動検出が便利な反面、CI や特殊環境では意図しない検出結果になることがあります。確実に使いたい場合は `--pm-cmd` で明示してください。

## CI での利用例（GitHub Actions）

~~~yaml
- uses: actions/checkout@v4
- name: Setup Node
  uses: pnpm/action-setup@v2
  with:
    version: 18
- name: Install CLI
  run: pnpm add --save-dev motion-plus-installer
- name: Run installer
  env:
    MOTION_TOKEN: ${{ secrets.MOTION_TOKEN }}
  run: npx motion-plus-installer -p motion-plus -v 2.0.0
~~~

## トラブルシューティング

- トークンが見つからない/認証エラー:
  - `MOTION_TOKEN` が正しくセットされているか、値が期限切れでないかを確認してください。
- `require is not defined` のような ESM/CJS エラーが出る場合:
  - パッケージの公開バージョンはビルド済み（CommonJS）を配布する予定です。もしソースから直接実行してエラーが出る場合は、パッケージのリリース版を `pnpm add` してください。
- `ENOENT`（pnpm が tgz を見つけられない等）:
  - デフォルトではダウンロードした .tgz は保持されます。`--no-keep` を指定している場合は削除されるため、あとで手動で参照する必要がある処理はしないでください。
- プロキシ環境でダウンロードが失敗する場合:
  - `HTTP_PROXY` / `HTTPS_PROXY` を設定するか、`--proxy` オプションでプロキシ URL を指定してください。

## セキュリティと運用上の注意

- `MOTION_TOKEN` は機密情報です。ログに値を出力しない設計になっていますが、環境変数やシークレットストアの管理はしっかり行ってください。
- ダウンロードキャッシュは `node_modules/<storageSubdir>/` に保存されるので、リポジトリに含めないよう `.gitignore` に追加してください（例: `node_modules/.motion-plus-installer/`）。

## 参考

- 詳細な開発者向けドキュメントやビルド手順、テスト手順は `README/dev.ja-jp.md`（開発者向け）を参照してください。
