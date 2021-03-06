"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_mongoose["default"].connect(process.env.DB_URL);

var db = _mongoose["default"].connection;

var handleOpen = function handleOpen() {
  return console.log("๐ Connected to DB ๐");
};

var handleError = function handleError(error) {
  return console.log(" โ DB Error");
};

db.on("error", handleError);
db.once("open", handleOpen); // ๋๋น๋ฅผ ๋ชฝ๊ตฌ์ค์ ์ฐ๊ฒฐ์์ผ์ video model์ ์ธ์์ํค๋ ๊ฑฐ๋ค.