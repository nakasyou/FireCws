<div align="center">

  ![image](./assets/firecrx.svg)
  ### FireCrx
</div>

# Welcome to FireCws's repo!
FireCws は、Chrome WebStoreからFirefoxでインストールできるようにする拡張機能です。
## なんのために？
Firefoxの欠点として、世界最大のブラウザ拡張機能プラットフォームである、Chrome Web Storeが使えない点がありました。それを解決します。
## 開発ガイド
### 拡張機能
#### パッケージ化
0. Denoをインストールします
1. 次のコマンドを入力します
```shell
deno task ext:package
```
2. `dist/firefox.xpi`にxpiファイルが出力されるはずです。
### サーバー
#### 前提条件
- Denoがインストールされていること
#### 開発
```shell
deno task server:dev
```
で、開発サーバーが起動します。
#### 本番環境
```shell
deno task server:start
```
です。

## ライセンス
特にファイルに明記してない限り、MIT LICENSEとします。
## 貢献
[CONTRIBUTING.md](CONTRIBUTING.md)を読んでみてください
