# expressOnNode
express.jsを利用した、ウェブAPIです.

# コンポーネントについて
## サービス基盤 : node.js
アプリ基盤はnode.jsです.  
3000番にてHTTP, 4000番にてHTTPSの通信を行います.
## MVC : express
## ロギング : morgan
ロガーライブラリです.

# APIへのリクエスト
ヘッダーには、`X-Node-App`を入れてください.これがないと`406 : Not Acceptable`を返却します.  
`./in`配下に、サンプルのリクエストデータがあり, 以下のcURLコマンドにて挙動を確認できます.  
`curl -d @input.json --insecure -H "X-Node-App : client" https://localhost:4000/api/v1/post_data`