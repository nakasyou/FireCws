# Welcome to FireCrx CONTRIBUTING Guide!
プルリクエストは大歓迎です！
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