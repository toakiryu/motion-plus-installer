import 'vitepress';

declare module 'vitepress' {
  export namespace DefaultTheme {
    /**
     * Extended options for the custom NotFound component.
     * You can add fields here and reference them from `config.ts`.
     */
    interface NotFoundOptions {
      title?: string;
      quote?: string;
      link?: string;
      linkText?: string;
      linkLabel?: string;
      code?: string;
      /** 翻訳未実装のときに表示するメッセージ */
      translationMessage?: string;
      /** 翻訳元ページへ遷移するリンクのテキスト */
      translationLinkText?: string;
      // allow additional custom fields
      /** 翻訳に協力するためのリンク（例: CONTRIBUTING.md） */
      translationContributeLink?: string;
      /** 翻訳協力ボタンのテキスト */
      translationContributeText?: string;
      [key: string]: any;
    }

    // Augment the Config type so `themeConfig.notFound` is accepted.
    interface Config {
      notFound?: NotFoundOptions;
    }
  }
}
