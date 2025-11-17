/**
 * ja: この設定ファイルは、デフォルト言語（ja）用の追加設定を定義します。ほかの言語の設定は、言語ごとのディレクトリのルートにある `config.ts` に記述してください。
 * en: This configuration file defines additional settings for the default language (ja). Settings for other languages should be specified in `config.ts` at the root of each language-specific directory.
 */

import { createRequire } from "module";
import { defineAdditionalConfig, type DefaultTheme } from "vitepress";

const require = createRequire(import.meta.url);
const pkg = require("motion-plus-installer/package.json");

export default defineAdditionalConfig({
  description: "Motion+ パッケージをインストールする軽量 CLI",

  themeConfig: {
    nav: nav(),

    search: {
      options: searchOptions(),
    },

    sidebar: {
      "/docs/": { base: "/docs/", items: sidebarDocs() },
    },

    editLink: {
      pattern:
        "https://github.com/toakiryu/motion-plus-installer/edit/main/docs/:path",
      text: "GitHub でこのページを編集",
    },

    footer: {
      message: "MIT ライセンスの下で公開されています。",
      copyright: "Copyright © 2025-present Toa Kiryu",
    },
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: "ドキュメント",
      link: "/docs/what-is-motion-inst",
      activeMatch: "/docs/",
    },
    {
      text: pkg.version,
      items: [
        {
          text: "更新履歴",
          link: "https://github.com/toakiryu/motion-plus-installer/blob/main/CHANGELOG.md",
        },
        {
          text: "コントリビュート方法",
          link: "https://github.com/toakiryu/motion-plus-installer/blob/main/.github/contributing.md",
        },
      ],
    },
  ];
}

function sidebarDocs(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: "導入",
      collapsed: false,
      items: [
        { text: "Motion Inst とは？", link: "what-is-motion-inst" },
        { text: "クイックスタート", link: "getting-started" },
        { text: "使い方", link: "usage" },
        { text: "コマンドラインリファレンス", link: "cli-reference" },
      ],
    },
    {
      text: "参考 / 運用",
      collapsed: true,
      items: [
        { text: "開発者向け情報", link: "development" },
        { text: "設定 (環境変数)", link: "configuration" },
        { text: "パッケージマネージャ検出", link: "pm-detection" },
        { text: "トラブルシューティング", link: "troubleshooting" },
        { text: "セキュリティと運用", link: "security" },
        { text: "CI 連携例", link: "ci" },
        { text: "よくある質問 (FAQ)", link: "faq" },
        { text: "コントリビュート方法", link: "contributing" },
      ],
    },
    {
      text: "LLM アシスタント (ベータ)",
      collapsed: true,
      items: [
        { text: "Docs List", link: "../llms.txt" },
        { text: "Full Docs", link: "../llms-full.txt" },
        { text: "Tiny Docs", link: "../llms-small.txt" },
      ],
    },
  ];
}

function searchOptions(): Partial<DefaultTheme.LocalSearchOptions> {
  return {
    translations: {
      button: {
        buttonText: "検索",
        buttonAriaLabel: "検索",
      },
      modal: {
        footer: {
          selectText: "選択",
          selectKeyAriaLabel: "Enter キー",
          navigateText: "移動",
          navigateUpKeyAriaLabel: "上矢印キー",
          navigateDownKeyAriaLabel: "下矢印キー",
          closeText: "閉じる",
          closeKeyAriaLabel: "Esc キー",
        },
      },
    },
  };
}
