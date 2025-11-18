# プラン

このファイルは日本語版ドキュメントのプランです。

## ジャンル分け

VitePress 公式のテンプレートでは、`./guide/*.md` と `./reference/*.md` に分けられています。
このようやフォルダージャンル分けを採用してください。ドキュメントの数が少ない場合は、フォルダージャンル分けをする必要性がないので、
`./docs/*.md` にして、サイドバー上でジャンルを分けるだけでいいです。

## ドキュメントを更新した場合

`docs\config.ts` の `defineAdditionalConfig.sidebar` を更新してください。

## 作成予定のページ

以下は優先度を付けた作成予定ページの一覧です。まずは「必須」3 点を優先し、その後に「重要」「推奨」を実装します。

- **重要**
  - `ci.md` — GitHub Actions 等の CI 組み込み例とシークレット管理の注意点。
  - `pm-detection.md` — パッケージマネージャ検出ロジックの詳細（検出順序の説明、`--pm-cmd` 使用例）。

- **推奨**
  - `faq.md` — 事例ベースの Q&A。
  - `contributing.md` — 開発への貢献方法、PR テンプレートやローカルの開発フロー。

## 作成済みのページ

- `what-is-motion-inst.md` — プロジェクト概要（サイトに追加済み）
- `getting-started.md` — クイックスタート（サイトに追加済み）

- `cli-reference.md` — CLI オプション表を作成し、サイト向けに整形済み
- `usage.md` — 利用例ページを正規化して、重複を削除済み
- `development.md` — 開発者向け
- `troubleshooting.md` — よくある問題と対処
- `security.md` — トークン/署名/キャッシュ運用に関する注意点。
- `configuration.md` — 環境変数一覧と説明（`MOTION_*` 系）。
