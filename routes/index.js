var express = require('express');
var router = express.Router();

/********************************************
 * 定数
 ********************************************/
const HTTP_APP_HEADER_1 = 'X-Node-App';
const HTTP_STATUS_OK = 'リクエストは正常に処理されました.';
const HTTP_STATUS_NG = '不正なリクエストです.';
const HTTP_HEADER_INVALID = 'ヘッダー情報を確認してください.';
const HTTP_REQUEST_INVALID = '入力内容が不正です.入力を確認してください.';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GETリクエストの基本情報を返却します.
router.get('/get_data', function(req, res, next){
  var httpReq = {};
  if(!(req.get('X-Node-App') == 'undefined' || req.get('X-Node-App') == null)){
    // ヘッダー情報の一覧を取得します.
    var headerInfo = [];
    Object.keys(req.headers).forEach(function(key){
      headerInfo.push({ key : req.headers[key] });
    });
    httpReq = {
      status : HTTP_STATUS_OK,
      requestInfo : {
        ip : req.ip,
        cookie : req.cookies.name,
        host : req.hostname,
        method : req.method,
        protocol : req.protocol,
      },
      headerInfo : headerInfo
    }
    res.header('Content-Type', 'aplication/json');
  }else{
    httpReq = {
      status : HTTP_STATUS_NG,
      requestInfo : {
        errorMessage : HTTP_HEADER_INVALID
      }
    }
    res.status(406);
  };
  // JSONの電文を返信します.
  res.json(httpReq);
});

// POSTリクエストのサンプル
router.post('/post_data', function(req, res){
  // ヘッダー情報が正しいことを確認します.
  if(hasInvalidHeader(req) != null){
    res.json(hasInvalidHeader(req));
  // 入力されたデータが正しいことを確認します.
  }else if(hasValidData(req) != null){
    res.json(hasValidData(req));
  }else{
    res.json(req.body);
  }
});

// 入力内容がnullの場合、処理を終了します.
function hasValidData(req){
  if(req.body == null || req.body.length == 0){
    httpReq = {
      status : HTTP_STATUS_NG,
      errorMessage : HTTP_REQUEST_INVALID
    };
    return httpReq;
  }
}

// ヘッダー情報の入力が正しいことを確認します.
function hasInvalidHeader(req){
  if(req.get(HTTP_APP_HEADER_1) == 'undefined' || req.get(HTTP_APP_HEADER_1) == null){
    var httpReq = {
      status : HTTP_STATUS_NG,
      requestInfo : {
        errorMessage : HTTP_HEADER_INVALID
      }
    }
  }
  return httpReq;
}

module.exports = router;
