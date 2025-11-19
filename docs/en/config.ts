/**
 * ja: この設定ファイルは、デフォルト言語（ja）用の追加設定を定義します。ほかの言語の設定は、言語ごとのディレクトリのルートにある `config.ts` に記述してください。
 * en: This configuration file defines additional settings for the default language (ja). Settings for other languages should be specified in `config.ts` at the root of each language-specific directory.
 */

import { createRequire } from "module";
import { defineAdditionalConfig, type DefaultTheme } from "vitepress";
const require = createRequire(import.meta.url);
const pkg = require("motion-plus-installer/package.json");
export default defineAdditionalConfig({
  description: "Lightweight CLI to install Motion+ packages",
  themeConfig: {
    nav: nav(),
    search: {
      options: searchOptions()
    },
    sidebar: {
      "/docs/": {
        base: "/en/docs/",
        items: sidebarDocs()
      }
    },
    editLink: {
      pattern: "https://github.com/toakiryu/motion-plus-installer/edit/main/docs/:path",
      text: "Edit this page on GitHub"
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2025-present Toa Kiryu"
    },
    notFound: {
      title: "PAGE NOT FOUND",
      quote: "But if you don't change your direction, and if you keep looking, you may end up where you are heading.",
      linkLabel: "go to home",
      linkText: "Take me home",
      code: "404"
    }
  }
});
function searchOptions(): Partial<DefaultTheme.LocalSearchOptions> {
  return {
    translations: {
      button: {
        buttonText: "Search",
        buttonAriaLabel: "Search"
      },
      modal: {
        footer: {
          selectText: "Select",
          selectKeyAriaLabel: "Enter key",
          navigateText: "Navigate",
          navigateUpKeyAriaLabel: "Arrow Up",
          navigateDownKeyAriaLabel: "Arrow Down",
          closeText: "Close",
          closeKeyAriaLabel: "Esc key"
        }
      }
    }
  };
}
function nav(): DefaultTheme.NavItem[] {
  return [{
    text: "Documentation",
    link: "/en/docs/what-is-motion-inst",
    activeMatch: "/en/docs/"
  }, {
    text: "Resources",
    items: [{
      text: "Contributing",
      link: "/contributors"
    }, {
      text: "Discussion",
      link: "https://github.com/toakiryu/motion-plus-installer/discussions"
    }]
  }, {
    text: pkg.version,
    items: [{
      text: "Changelog",
      link: "https://github.com/toakiryu/motion-plus-installer/blob/main/CHANGELOG.md"
    }, {
      text: "How to Contribute",
      link: "https://github.com/toakiryu/motion-plus-installer/blob/main/.github/contributing.md"
    }]
  }];
}
function sidebarDocs(): DefaultTheme.SidebarItem[] {
  return [{
    text: "Introduction",
    collapsed: false,
    items: [{
      text: "What is Motion Inst?",
      link: "what-is-motion-inst"
    }, {
      text: "Quick Start",
      link: "getting-started"
    }, {
      text: "Usage",
      link: "usage"
    }, {
      text: "CLI Reference",
      link: "cli-reference"
    }]
  }, {
    text: "Reference / Operations",
    collapsed: true,
    items: [{
      text: "Developer Info",
      link: "development"
    }, {
      text: "Configuration",
      link: "configuration"
    }, {
      text: "Package Manager Detection",
      link: "pm-detection"
    }, {
      text: "Troubleshooting",
      link: "troubleshooting"
    }, {
      text: "Security & Operations",
      link: "security"
    }, {
      text: "CI Integration",
      link: "ci"
    }, {
      text: "FAQ",
      link: "faq"
    }, {
      text: "Contributing",
      link: "contributing"
    }]
  }, {
    text: "LLM Assistant (Beta)",
    collapsed: true,
    items: [{
      text: "Docs List",
      link: "../llms.txt"
    }, {
      text: "Full Docs",
      link: "../llms-full.txt"
    }, {
      text: "Tiny Docs",
      link: "../llms-small.txt"
    }]
  }];
}