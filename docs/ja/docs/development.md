# 開発者向けドキュメント

このページではパッケージのビルド、テスト、ローカル検証手順を示します。

## ビルド & パック

```sh [PowerShell ~vscode-icons:file-type-powershell~]
cd packages\motion-plus-installer
pnpm install
pnpm run build
pnpm pack
# -> motion-plus-installer-<version>.tgz が生成される
```

## ローカルでのテストプロジェクトで検証

```sh [PowerShell ~vscode-icons:file-type-powershell~]
cd /path/to/test-project
pnpm init -y
pnpm add "C:\path\to\motion-plus-installer-0.1.0.tgz"
.\node_modules\.bin\motion-plus-installer --help
```

## テスト

- ユニットテスト: `pnpm test`（`src` のユーティリティを検証）
- E2E テスト: `MOTION_REGISTRY_URL` を使ってローカルの HTTP サーバでダウンロードの検証を行う。

### 実装ノート（抜粋）

- パッケージマネージャの検出と実行は `src/pm.ts` に実装されています。ユニットテストでは `child_process.spawn` をモックしてください。
- `installer.ts` は CLI オプションのパースと実行フローを担います。

詳細は [パッケージマネージャ検出](./pm-detection) と [CLI リファレンス](./cli-reference) を参照してください。
