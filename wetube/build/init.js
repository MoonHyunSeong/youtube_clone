"use strict";

require("regenerator-runtime");

require("dotenv/config");

require("./db");

require("./models/Video");

require("./models/User");

require("./models/Comment");

var _server = _interopRequireDefault(require("./server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import 가 많아져서 시작할 때 초기화를 위해서 만든 파일
//파일을 임포트 하는 순간 파일 내용에 따라 디비가 자동으로 연결된다.
//이제 누구나 video 스키마를 참조할 수 있다.
var PORT = 3000;

var handleListening = function handleListening() {
  return console.log("\uD83D\uDE00Server listening on PORT ".concat(PORT, " \uD83C\uDF20"));
};

_server["default"].listen(PORT, handleListening); // 요청을 듣기.