# このリポジトリ向けの GitHub Copilot 指示

このドキュメントは、このリポジトリ（motion-plus-installer）のコンテキストで GitHub Copilot / AI 補完が適切に振る舞うための指示を日本語でまとめたものです。

---

## リポジトリ概要

- このモノレポは `packages/motion-plus-installer` を中心に、Node.js / TypeScript ベースのインストーラ生成ライブラリを含みます。
- ソースコードは `packages/motion-plus-installer/src`、テストは `packages/motion-plus-installer/test` にあります。

## 一般的なルール

- 変更は最小限に留める：1PR = 1 目的。不要なファイル変更や大規模リフォーマットは避ける。
- 既存のスタイルに従う：既存の `tsconfig.json` / `package.json` の設定やコードの書き方（命名規則、インデント、Promise/async の扱い等）に合わせる。
- 破壊的変更を提案しない：API 互換性を壊す提案はコメントで慎重に説明する。

## 提案の質

- 提案は具体的で短く：変更箇所（ファイル名）、変更理由、推奨コードスニペットを含める。
- テストを伴う提案：動作に関わる変更はテスト追加または既存テストの更新を含める。
- 依存追加は慎重に：新しいパッケージを追加する場合は、必要性と代替（標準 API や既存ユーティリティ）を明記する。

## ビルド・テストの実行方法（開発者向け）

- 依存インストール: `pnpm install`
- ルートワークスペースでのビルド（ワークスペース構成を利用する場合）: `pnpm -w -r build` または各パッケージで `pnpm --filter ./packages/motion-plus-installer build`
- パッケージ単体のテスト: `pnpm --filter ./packages/motion-plus-installer test`

（環境やスクリプトは `package.json` を参照してください。自動実行できるコマンドを直接実行する前に `package.json` を確認してください。）

## セキュリティと機密情報

- 何もハードコードしない：パスワード、トークン、個人情報をソースに書き込む提案はしない。
- 秘密情報は `.env` や CI シークレット等の仕組みを使うように案内する。

## ドキュメントとコミット

- ドキュメント更新を含める：機能変更や公開 API の変更があれば `README.md` や `packages/.../README.md` を更新する提案を含める。
- コミットメッセージ案を短く提示する（英語あるいは日本語）: 例 `fix(installer): 修正内容`、`feat(installer): 新機能概要`

## 禁止事項・注意点

- 他リポジトリからの大量コピーをそのまま提案しない。引用は短く、出典を明記する。
- ライセンス違反を助長する提案は行わない。

## 出力言語

- このリポジトリ向けの提案・コメントは原則として日本語で行う。ただし、生成するコード中の文字列やコメントは該当するターゲット言語（英語など）を使うことが望ましい場合がある。

## レビューチェックリスト（提案時に添える）

- 変更は最小限か？
- テストは追加/更新されたか？
- 既存のスタイルや設定に沿っているか？
- セキュリティ上の問題はないか？
- 依存追加は本当に必要か？

## 追加リソース

- ドキュメントリスト: [.github/resource/docs-list.md](./resource/docs-list.md)
- VitePress ドキュメント指示例: [.github/instructions/vitepress.instructions.md](./instructions/vitepress.instructions.md)

---

必要に応じてこのファイルを更新してください。開発チームの慣習やツール（Prettier/ESLint/CI）の設定が変わった場合はこの指示も合わせて更新してください。
