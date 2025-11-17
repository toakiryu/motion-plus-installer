---
applyTo: "website/ja/**"
---

# VitePress ドキュメントサイト

このフォルダには VitePress を使った日本語版ドキュメントサイトのコンテンツが含まれています。

## 執筆について

1. VitePress には組み込みの Markdown 拡張機能が用意されています。細は公式ドキュメントの [Markdown](.github/resource/vitepress/md/*.md) を参照してください。

2. 複数のパッケージマネージャーをそれぞれ紹介する場合は以下のコードグループを使ってください。

~~~md
::: code-group

```sh [<pkg-manager>]
<cmd>
```

:::
~~~

例(pnpm/npm):

~~~md
::: code-group

```sh [pnpm]
pnpm dlx motion-plus-installer
````

```sh [npm]
npx motion-plus-installer
```

:::
~~~

- タスクリストは書かないでください。
- フロントマターは指示がない限り使用しないでください。

## 主なファイル

- `_plan.md` — ドキュメント作成のプランと優先度
```
