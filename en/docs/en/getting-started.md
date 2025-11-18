# クイックスタート {#getting-started}

このページでは、`motion-plus-installer` のインストールと基本的な使い方を示します。

## 実行例（参照）

このページの具体的なコマンド例（`npx` / `pnpm dlx`、`.env` を使った実行、CI スニペットなど）は重複を避けるためサイトの [利用方法](./usage) ページにまとめています。

## CI での利用

CI では `MOTION_TOKEN` をシークレットとして保存し、ビルド手順の中で `npx motion-plus-installer` を呼び出してください。例（GitHub Actions のステップ）:

```yaml [install.yml]
- name: Install Motion packages
  run: npx motion-plus-installer i motion-plus
  env:
    MOTION_TOKEN: ${{ secrets.MOTION_TOKEN }}
```

## パッケージマネージャーの明示

自動検出が上手くいかない場合は、`--pm-cmd <cmd>` オプションで実行コマンドを明示できます。簡単な例や置換例は [利用方法](./usage) にあります。

詳細は [CLI リファレンス](./cli-reference) と [パッケージマネージャ検出](./pm-detection) を参照してください。
