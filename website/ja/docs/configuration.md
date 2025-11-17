# 環境変数と設定

このページでは `motion-plus-installer` が参照する主要な環境変数と簡単な説明、設定例をまとめます。

## 主要な環境変数

| 環境変数                     | 説明                                                                                                | 既定値                            |
| ---------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------- |
| `MOTION_TOKEN`               | API へアクセスするための Bearer トークン。CLI 実行時に未設定だとエラーになります。                  | （必須）                          |
| `MOTION_PACKAGE`             | デフォルトのパッケージ名（`-p, --package` を指定しない場合に利用）。                                | `motion-plus`                     |
| `MOTION_VERSION`             | デフォルトのパッケージバージョン（`-v, --pkg-version` を指定しない場合に利用）。                    | `2.0.0-alpha.4`                   |
| `MOTION_STORAGE_SUBDIR`      | ダウンロードキャッシュを保存する `node_modules` 内のサブディレクトリ名。                            | `.motion-plus-installer`          |
| `MOTION_REGISTRY_URL`        | ダウンロード先のベース URL。テスト用にローカルのモックサーバを使う場合に便利です。                  | `https://api.motion.dev/registry` |
| `HTTP_PROXY` / `HTTPS_PROXY` | プロキシ経由でダウンロードする際に設定します。CLI は `--proxy` 指定でも同様に環境変数を利用します。 | —                                 |

## 設定例

### PowerShell

```sh [PowerShell ~vscode-icons:file-type-powershell~]
$env:MOTION_TOKEN = '****'
$env:MOTION_REGISTRY_URL = 'https://api.motion.dev/registry'
pnpm dlx motion-plus-installer
```

## 注意点

- 環境変数に機密情報を設定する際は、ログに値が出力されないように注意してください。CI ではシークレット管理機能を使ってください。
- `MOTION_REGISTRY_URL` をテスト用に差し替えるときは、実運用用のトークンや URL を誤って公開しないよう注意してください。

---

### 関連ページ

- [利用方法](./usage)
- [CLI リファレンス](./cli-reference)
