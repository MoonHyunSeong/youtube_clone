"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _videoController = require("../controllers/videoController");

var _middlewares = require("../middlewares");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var videoRouter = _express["default"].Router();

videoRouter.get("/:id([0-9a-f]{24})", _videoController.watch); // 그냥 :id 하면 모든 문자,숫자를 받아서 원하는 템플릿에 가지 못하는 문제가 발생한다.
// 그런 문제를 해결하기 위해서 우리는 mongoose의 random id 값 부여하는 기준을 찾아보고 16진수로 24자리를 부여한다는 것을 알아냈다.
// 그 범위에 따른 정규표현식을 만들어 범위를 지정해주었고 그 범위 안에 드는 경우에만 템플릿을 가져올 수 있도록 하였다.

videoRouter.route("/:id([0-9a-f]{24})/edit").all(_middlewares.protectorMiddleware).get(_videoController.getEdit).post(_videoController.postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(_middlewares.protectorMiddleware).get(_videoController.deleteVideo);
videoRouter.route("/upload").all(_middlewares.protectorMiddleware).get(_videoController.getUpload).post(_middlewares.videoUpload.fields([{
  name: "video"
}, {
  name: "thumb"
}]), _videoController.postUpload);
var _default = videoRouter;
exports["default"] = _default;