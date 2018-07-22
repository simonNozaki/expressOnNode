# ===============Commands===============
# docker build -t node-webserver:1.0.0 .
# docker run --name node-webserver -d -p 13000:300 -p 14000:4000 -v /Users/SimonNozaki/ApplicationDevelopment/expressOnNode/src/log /app/nodejs/log node-webserver:1.0.0 
# docker ps
# docker ps -a
# curl -g -H "X-Node-App:client1" --insecure https://localhost:14000/api/v1/get_data
# curl -g -H "X-Node-App:client1" http://localhost:13000/api/v1/get_data
# =====================================

# CentOS7
FROM centos:centos7

# nodejsの関連モジュールをインストールします.
RUN yum install -y epel-release && \
    yum install -y nodejs npm && \
    mkdir -p /app/nodejs

# http, https用のポートをそれぞれ解放しておきます.
EXPOSE 3000 4000

# ソースコードをコピーします.
COPY . /app/nodejs

# 必要なモジュールをまとめてインストールします.
RUN cd /app/nodejs && npm install && ls -la

# 実行ディレクトリを移動しておきます.
WORKDIR /app/nodejs

# アプリを起動します.
CMD node app.js