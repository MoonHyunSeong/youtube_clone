"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _expressFlash = _interopRequireDefault(require("express-flash"));

var _connectMongo = _interopRequireDefault(require("connect-mongo"));

var _morgan = _interopRequireDefault(require("morgan"));

var _middlewares = require("./middlewares");

var _rootRouter = _interopRequireDefault(require("./routers/rootRouter"));

var _userRouter = _interopRequireDefault(require("./routers/userRouter"));

var _videoRouter = _interopRequireDefault(require("./routers/videoRouter"));

var _apiRouter = _interopRequireDefault(require("./routers/apiRouter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//recent code
//const express = require("express");
var app = (0, _express["default"])(); // 익스프레스를 활용하여 어플리케이션 만들기

var logger = (0, _morgan["default"])("dev");
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(_express["default"].json());
app.use((0, _expressSession["default"])({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  store: _connectMongo["default"].create({
    mongoUrl: process.env.DB_URL
  })
}));
app.use((0, _expressFlash["default"])());
app.use(_middlewares.localsMiddleware); //middleware 순서가 중요하다. 세션다음에 줘야만 세션이 만들어진다. 

app.use("/uploads", _express["default"]["static"]("uploads")); // 정적 기술을 통해 uploads에 대한 폴더에 대한 권한을 열어둔것 사람들이 열람할 수 있도록

app.use("/static", _express["default"]["static"]("assets")); // static 으로 권한을 열어줄때 url은 자유롭게 작성해도 상관없다 하지만 뒤에 폴더명은 실제 폴더와 똑같이 적어야만 한다.

app.use("/", _rootRouter["default"]);
app.use(function (req, res, next) {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
}); // sharedArrayBuffer 에러 발생할 때 해결책 -> 참고하여 복붙한 내용.

app.use("/videos", _videoRouter["default"]);
app.use("/users", _userRouter["default"]); // get,set 등등 샌드위치 구간 브라우저가 요구하는 내용을 처리.
// 요청이라는 이벤트 처리라고 생각하면 된다.

app.use("/api", _apiRouter["default"]);
var _default = app;
exports["default"] = _default;