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

Motion 製品の配布用 `.tgz` を認証付き API から取得し、プロジェクトへ自動インストールするための軽量 CLI ツールです。デフォルトでは `pnpm` を優先しますが、`npm` や他のパッケージマネージャーもサポートしており、`--pm-cmd` オプションで明示的に指定できます。

## 作成経緯

このツールは、Motion 製品を社内や顧客環境へ配布する際に毎回手動で `.tgz` をダウンロードしてプロジェクトに追加する運用の手間を減らすために作られました。認証が必要な配布 API に対して、CI やローカル開発から安全にパッケージを取得して即座にインストールできるように、自動化と再現性を重視して設計しています。

主な動機:

- 手動ダウンロードのミスを減らす（バージョン違いやパスの取り違えなど）
- CI パイプラインでの自動化を容易にする
- ダウンロードキャッシュによりビルドの再現性とオフライン対策を向上させる

## 対応パッケージマネージャー

| パッケージマネージャー |  サポート状況 | 動作確認 | 備考                                      |
| ----------- | ------: | :--: | --------------------------------------- |
| `pnpm`      | 推奨 / 優先 |   ◎  | デフォルトで優先されます。最も検証された選択肢です。              |
| `npm`       |    サポート |   〇  | 検出条件によりフォールバックとして選択されます。                |
| `yarn`      |    サポート |   △  | Classic / Berry の違いにより挙動が異なる場合があります。    |
| `bun`       |     実験的 |   ×  | PATH に `bun` がある場合に検出されます。互換性に注意してください。 |

_検出動作については、[「パッケージ マネージャーの自動検出」](https://motion-inst.oss.toaki.cc/docs/pm-detection)セクションを参照してください。_

## 利点

- 簡単: 1 コマンドで認証付き API からダウンロードして `pnpm` / `npm` 等のパッケージマネージャーを使ってプロジェクトへインストールします（デフォルトでは `pnpm` が優先されます）。
- 安全: トークンは環境変数で渡し、ログへトークン値を直接出力しない設計です。
- CI フレンドリー: シークレットを使った自動実行と、`--pm-cmd` でパッケージマネージャーを指定できる柔軟性を確保します。明示指定がない場合はリポジトリや環境を参照して自動検出します。
- 再現性: ダウンロードした `.tgz` をキャッシュすることで同一バージョンの再利用やオフラインでのインストールが可能です。
- 軽量: 重い外部のパッケージ管理ツールに依存せず、Node 環境で動作する軽量な設計です（パッケージマネージャーは自動検出または `--pm-cmd` で指定できます）。

## ライセンス

本リポジトリのライセンスは [`license.txt`](https://github.com/toakiryu/motion-plus-installer/blob/main/LICENSE.txt) を参照してください（通常は MIT）。
