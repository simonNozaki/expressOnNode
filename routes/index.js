var express = require('express');
var router = express.Router();

// リクエスト共通処理

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GETリクエストの基本情報を返却します.
router.get('/get_data', function(req, res, next){
  console.log(req.baseUrl);
  var httpReq = {
    ip : req.ip,
    cookie : req.cookies.name,
    host : req.hostname,
    method : req.method,
    protocol : req.protocol
  }
  res.header('Content-Type', 'aplication/json');
  // JSONの電文を返信します.
  res.json(httpReq);
});

// POSTリクエストのサンプル
router.post('/post_data', function(req, res){
  console.log('リクエスト元IP : ' + req.ip);
  console.log(req.body);
  res.json(req.body);
});

module.exports = router;
