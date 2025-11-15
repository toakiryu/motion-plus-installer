---
title: Publish workflow
---

# Publish workflow (GitHub Actions)

このドキュメントは、`.github/workflows/publish.yml` ワークフローの目的、トリガー、実行内容、メンテナ向け注意点を簡潔にまとめたものです。

## 目的

`packages/motion-plus-installer` パッケージをビルドして npm レジストリへ公開する自動化ワークフローです。タグによるリリースや、`package.json` のバージョン更新を main ブランチへマージしたときに起動します。

## トリガー

- `push` のタグ: `v*`（例: `v1.2.3`）
- `push` のブランチ: `main` で、かつ `packages/motion-plus-installer/package.json` に変更がある場合

これにより、手動でタグを切るパターンと、version を bump して main にマージするパターンの両方で公開できます。

## 実行内容（要約）

1. `actions/setup-node@v4` で Node.js をセットアップ（`node-version: 18`、`registry-url: https://registry.npmjs.org`、`always-auth: true`）
2. `pnpm/action-setup@v2` で pnpm をセットアップ（version: 8）
3. `pnpm install --frozen-lockfile` を `packages/motion-plus-installer` で実行（依存解決）
4. `pnpm run build` を `packages/motion-plus-installer` で実行（ビルド）
5. `pnpm publish --no-git-checks --access public` を `packages/motion-plus-installer` で実行し、npm へパブリッシュ

## 必要な Secrets / 設定

- `NPM_TOKEN`（リポジトリまたは組織の Secrets）: npm への認証に使います。ワークフロー中で `NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}` として渡されます。

注意: GitHub の Secrets 名が異なる場合はワークフロー内の参照を適宜変更してください。

## 動作例（運用上の流れ）

1. `packages/motion-plus-installer/package.json` の `version` を更新する（例: `0.1.0` → `0.1.1`）
2. 変更をコミットして `main` にマージする
3. ワークフローが起動し、ビルド → publish が実行される

別の方法として、ローカルで `git tag vX.Y.Z` を作成し `git push origin vX.Y.Z` するとタグトリガーでも公開できます。

## 注意点 / 推奨事項

- ワークフローは `packages/motion-plus-installer` を対象に動作するため、リポジトリのルート `package.json` を誤って公開する心配はありません。
- `prepack` / `prepublish` スクリプトがパッケージ側にある場合、`pnpm publish` 実行時に自動で走りますが、明示的に `pnpm run build` を実行しているため、ビルド漏れは防がれます。
- `--access public` を付与しています。プライベートスコープ／組織ポリシーがある場合はオプションを調整してください。
- ワークフローが誤って走るのを防ぐため、`paths` 条件で `packages/motion-plus-installer/package.json` に限定していますが、もし他のファイルと同時にマージする運用をしたい場合は条件を緩めてください。

## トラブルシューティング

- Publish に失敗する場合は、まず `NPM_TOKEN` が正しく設定されているかを確認してください。
- ビルドに失敗する場合は、`pnpm run build` の出力を確認し、依存や TypeScript のエラーを修正してください。
- 自動検出で publish したくない PR のマージがトリガーとなる場合は、ワークフロー冒頭に追加のチェック（例: `git diff` で `package.json` のみ差分か確認）を挿入できます。必要ならそのスニペットを追加します。

---
このドキュメントはリポジトリ内のワークフロー `publish.yml` の解説です。運用ポリシーに合わせてカスタマイズしてください。
