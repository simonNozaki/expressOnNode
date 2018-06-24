/********************************************
 * モジュールセットアップ
 ********************************************/
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var fs = require('fs');

// Logger(Morgan及び関連モジュール)のセットアップ
var logger = require('morgan');
var path = require('path');
var rfs = require('rotating-file-stream');
var logDir = path.join(__dirname, 'log');
const moment = require('moment-timezone');
// ログディレクトリの存在チェック、なければ新規作成します.
fs.existsSync(logDir) || fs.mkdirSync(logDir);
// ローテーションのストリームオブジェクトを生成します.ファイルのローテーション間隔を1日に設定します.
var yymmdd = moment(new Date(), 'YY-MM-DD');
var accessLogStream = rfs('app.log',{
  interval : '1d',
  path : logDir
});
// ロガーのタイムゾーンをフォーマットします.
logger.token('date', (req, res, tz) => {
  return moment().tz(tz).format();
});
logger.format('Asia/Tokyo', '[:date[Asia/Tokyo]] :method :url :status :response-time[digits]');

// HTTP系モジュール
var http = require('http');
var https = require('https');
// routingの読み込み
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Loggerをセットアップします.
app.use(logger('Asia/Tokyo', {stream : accessLogStream}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', indexRouter);
app.use('/users', usersRouter);

/********************************************
 * 定数
 ********************************************/
const LOG_SERVER_START_UP = 'サーバを起動します.';

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// HTTPをサポートするサーバインスタンスです.
var httpServer = http.createServer(app).listen(3000);

// HTTPSをサポートするサーバインスタンスです.
// SSL通信用の秘密鍵、証明書です.
var encryption = {
  key : fs.readFileSync('./ssl/server_20180621.key'),
  cert : fs.readFileSync('./ssl/server_20180621.crt')
};

var httpsServer = https.createServer(encryption, app).listen(4000, function(req, res){
  console.log(LOG_SERVER_START_UP);
});

module.exports = app;
