"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_mongoose["default"].connect(process.env.DB_URL);

var db = _mongoose["default"].connection;

var handleOpen = function handleOpen() {
  return console.log("😉 Connected to DB 😉");
};

var handleError = function handleError(error) {
  return console.log(" ❌ DB Error");
};

db.on("error", handleError);
db.once("open", handleOpen); // 디비를 몽구스와 연결시켜서 video model을 인식시키는 거다.