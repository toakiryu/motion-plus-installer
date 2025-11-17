import {
  defineConfig,
  resolveSiteDataByRoute,
  type HeadConfig,
} from "vitepress";
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
  localIconLoader,
} from "vitepress-plugin-group-icons";
import llmstxt from "vitepress-plugin-llms";

const prod = !!process.env.NETLIFY;

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Motion Inst",
  description: "Lightweight CLI to install Motion+ packages",

  rewrites: {
    "ja/:rest*": ":rest*",
  },

  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,

  sitemap: {
    hostname: "https://motion-inst.toaki.cc",
    transformItems(items) {
      return items.filter((item) => !item.url.includes("migration"));
    },
  },

  locales: {
    root: { label: "日本語", lang: "ja-JP", dir: "ltr" },
  },

  markdown: {
    math: true,
    codeTransformers: [
      // We use `[!!code` in demo to prevent transformation, here we revert it back.
      {
        postprocess(code) {
          return code.replace(/\[\!\!code/g, "[!code");
        },
      },
    ],
    config(md) {
      // TODO: remove when https://github.com/vuejs/vitepress/issues/4431 is fixed
      const fence = md.renderer.rules.fence!;
      md.renderer.rules.fence = function (tokens, idx, options, env, self) {
        const { localeIndex = "root" } = env;
        const codeCopyButtonTitle = (() => {
          switch (localeIndex) {
            case "en":
              return "Copy code";
            default:
              return "コードをコピー";
          }
        })();
        return fence(tokens, idx, options, env, self).replace(
          '<button title="Copy Code" class="copy"></button>',
          `<button title="${codeCopyButtonTitle}" class="copy"></button>`,
        );
      };
      md.use(groupIconMdPlugin);
    },
  },

  head: [["meta", { name: "theme-color", content: "#40DCA5" }]],

  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/toakiryu/motion-plus-installer",
      },
      { icon: "buymeacoffee", link: "https://buymeacoffee.com/toaki" },
    ],

    search: {
      provider: "local",
    },
  },

  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          vitepress: localIconLoader(
            import.meta.url,
            "../public/motion-inst.1500x1500.png",
          ),
          firebase: "logos:firebase",
        },
      }),
        llmstxt({
          workDir: "ja",
          ignoreFiles: ["index.md"],
        }),
    ],
  },

  transformPageData: prod
    ? (pageData, ctx) => {
        const site = resolveSiteDataByRoute(
          ctx.siteConfig.site,
          pageData.relativePath,
        );
        const title = `${pageData.title || site.title} | ${
          pageData.description || site.description
        }`;
        ((pageData.frontmatter.head ??= []) as HeadConfig[]).push(
          ["meta", { property: "og:locale", content: site.lang }],
          ["meta", { property: "og:title", content: title }],
        );
      }
    : undefined,
});
