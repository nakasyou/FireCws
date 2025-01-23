<div align="center">

  ![image](./old/assets/firecrx.svg)
  ### FireCws
</div>

他の言語で読む：[English (United Status)](./README.en_us.md)

FireCws は、Chrome用に書かれた拡張機能(.crx)をFirefox用拡張機能(.xpi)にコンパイルするライブラリです。

## なんのために？
Firefoxの欠点として、世界最大のブラウザ拡張機能プラットフォームである、Chrome Web Storeが使えない点がありました。それを解決します。

## つかいかた
### Install
```shell
npm i firecws #npm
yarn add firecws #yarn
pnpm add firecws #pnpm
bun add firecws #bun
```
### Import
```ts
import * as firecws from 'firecws' // Node/Bun
import * as firecws from 'npm:firecws' // Deno

import * as firecws from 'jsr:@ns/firecws' // JSR(wip)
```

### 使う
.crx拡張をChrome Web Storeから読み込み:
```ts
const extensionId = 'ophjlpahpchlmihnnnihgmmeilfjmjjc' // LINE
const crxExt = await firecws.fromWebStore(extensionId)
```

xpiにコンパイル:
```ts
const { xpi } = await firecws.compile(crxExt, {
  // Options
}, progres => {
  // 進捗のハンドラー
})

xpi // xpiのUint8Array
```

## サポート一覧表
- 💯 - 完全に動作することが証明済み
- ✅ - 不自然な点なし
- ⭕ - 不自然な点があるが、大体の機能は使える
- 🤔 - エラーがでたりして、完全に機能が使えない。不便。
- ❌ - インストールができない

| 名前 | チェック時拡張機能バージョン | チェック時FireCwsバージョン | Status |
| --- | --- | --- | --- |
| [LINE](https://chromewebstore.google.com/detail/line/ophjlpahpchlmihnnnihgmmeilfjmjjc?hl=ja) | 3.1.2 | 0.2.0 | 🤔 |

## 問題点
コンパイル構造が肥大化していて、かなりコンパイルが遅いです。

## Special Thanks
- @EdamAme-x
  - LINE が origin を判定している事実とその解決策のアドバイス

## ライセンス
特にファイルに明記してない限り、MIT LICENSEとします。
## 貢献
[CONTRIBUTING.md](CONTRIBUTING.md)を読んでみてください
