"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.watch = exports.search = exports.registerView = exports.postUpload = exports.postEdit = exports.home = exports.getUpload = exports.getEdit = exports.deleteVideo = exports.createComment = void 0;

var _Video = _interopRequireDefault(require("../models/Video"));

var _Comment = _interopRequireDefault(require("../models/Comment"));

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Video.find({}, (error, videos)=>{  
// });
var home = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var videos;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _Video["default"].find({}).sort({
              createdAt: "desc"
            }).populate("owner");

          case 2:
            videos = _context.sent;
            //db 에서 video가 존재할 때 그 내용을 찾아서 videos 에 담는다.
            console.log(videos);
            res.render("home", {
              pageTitle: "home",
              videos: videos
            });

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function home(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.home = home;

var watch = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var id, video;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = req.params.id; // == const id = req.params.id;
            // id를 콘솔창에 출력해보면 비디오에 대한 id가 나온다. 
            // id는 어디서 오는가? 비디오 목록에서 비디오를 누르면 url 안에 Id가 존재한다. 
            // id를 바탕으로 그 비디오를 찾는 것이다.
            // 디비에 연결 된 경우에는 req.params 로 가져온 id만으로도 비디오를 찾을 수 있다는 것을 알려준다.

            _context2.next = 3;
            return _Video["default"].findById(id).populate("owner").populate("comments");

          case 3:
            video = _context2.sent;

            if (video) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", res.status(404).render("404", {
              pageTitle: "Video not found."
            }));

          case 6:
            return _context2.abrupt("return", res.render("watch", {
              pageTitle: "Watching",
              video: video
              /* == video:video*/

            }));

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function watch(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.watch = watch;

var getEdit = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var id, _id, video;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id;
            _id = req.session.user._id;
            _context3.next = 4;
            return _Video["default"].findById(id);

          case 4:
            video = _context3.sent;

            if (video) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt("return", res.status(404).render("404", {
              pageTitle: "Video not found."
            }));

          case 7:
            if (!(String(video.owner) !== String(_id))) {
              _context3.next = 10;
              break;
            }

            req.flash("error", "Not authorized"); //어떠한 상황에서도 백엔드에서 본인이 아닌 이상 수정이 불가능하게 한다.

            return _context3.abrupt("return", res.status(403).redirect("/"));

          case 10:
            return _context3.abrupt("return", res.render("edit", {
              pageTitle: "Edit ".concat(video.title),
              video: video
            }));

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getEdit(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getEdit = getEdit;

var postEdit = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var id, _id, _req$body, title, description, hashtags, video;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = req.params.id;
            _id = req.session.user._id;
            _req$body = req.body, title = _req$body.title, description = _req$body.description, hashtags = _req$body.hashtags; // 수정하고 싶은 내용들을 여기에 담아두고 밑에서 수정하는거다.
            // body는 form을 통해 받은 내용들을 가져오는 것이다.

            _context4.next = 5;
            return _Video["default"].exists({
              _id: id
            });

          case 5:
            video = _context4.sent;

            if (video) {
              _context4.next = 8;
              break;
            }

            return _context4.abrupt("return", res.render("404", {
              pageTitle: "Video not found."
            }));

          case 8:
            if (!(String(video.owner) !== String(_id))) {
              _context4.next = 10;
              break;
            }

            return _context4.abrupt("return", res.status(403).redirect("/"));

          case 10:
            _context4.next = 12;
            return _Video["default"].findByIdAndUpdate(id, {
              // this.title = title 이런식으로 하지 않고 mongoose 에 있는 함수를 사용하여서 
              // 바꿀 내용을 구조적으로 보여주고 한번에 해결하는 구조를 만들어준다. create와 유사.
              title: title,
              description: description,
              hashtags: _Video["default"].formatHashtags(hashtags)
            });

          case 12:
            return _context4.abrupt("return", res.redirect("/videos/".concat(id)));

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function postEdit(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.postEdit = postEdit;

var getUpload = function getUpload(req, res) {
  return res.render("upload", {
    pageTitle: "Upload Video"
  });
};

exports.getUpload = getUpload;

var postUpload = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var _id, _req$files, video, thumb, _req$body2, title, description, hashtags, newVideo, user;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _id = req.session.user._id;
            _req$files = req.files, video = _req$files.video, thumb = _req$files.thumb;
            _req$body2 = req.body, title = _req$body2.title, description = _req$body2.description, hashtags = _req$body2.hashtags;
            _context5.prev = 3;
            _context5.next = 6;
            return _Video["default"].create({
              title: title,
              // == title : this.title 자바식으로 짬뽕해서 쓰면 이런식이다.
              description: description,
              //createdAt: Date.now(),
              fileUrl: video[0].path,
              thumbUrl: thumb[0].path,
              owner: _id,
              hashtags: _Video["default"].formatHashtags(hashtags) // meta:{
              //     views:0,
              //     rating:0,
              // },
              // 모델에서 디폴트 값을 주었기 때문에 굳이 다시 쓸 필요가 없어진 내용들이다. -> 헷갈리면 6.17 강의 확인

            });

          case 6:
            newVideo = _context5.sent;
            _context5.next = 9;
            return _User["default"].findById(_id);

          case 9:
            user = _context5.sent;
            user.videos.push(newVideo._id);
            user.save();
            return _context5.abrupt("return", res.redirect("/"));

          case 15:
            _context5.prev = 15;
            _context5.t0 = _context5["catch"](3);
            return _context5.abrupt("return", res.status(400).render("upload", {
              pageTitle: "Upload Video",
              errorMessage: _context5.t0._message
            }));

          case 18:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[3, 15]]);
  }));

  return function postUpload(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.postUpload = postUpload;

var deleteVideo = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    var _id, id, video;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _id = req.session.user._id;
            id = req.params.id;
            _context6.next = 4;
            return _Video["default"].findById(id);

          case 4:
            video = _context6.sent;

            if (video) {
              _context6.next = 7;
              break;
            }

            return _context6.abrupt("return", res.render("404", {
              pageTitle: "Video not found."
            }));

          case 7:
            if (!(String(video.owner) !== String(_id))) {
              _context6.next = 9;
              break;
            }

            return _context6.abrupt("return", res.status(403).redirect("/"));

          case 9:
            _context6.next = 11;
            return _Video["default"].findByIdAndDelete(id);

          case 11:
            return _context6.abrupt("return", res.redirect("/"));

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function deleteVideo(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}(); // delete, remove 차이?
// -> 대부분의 경우 delete를 사용한다.


exports.deleteVideo = deleteVideo;

var search = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
    var keyword, videos;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            keyword = req.query.keyword; // 입력받은 값을 갖고 오는 query

            videos = []; // if 구절 유효범위 문제 때문에 let으로 구성

            if (!keyword) {
              _context7.next = 6;
              break;
            }

            _context7.next = 5;
            return _Video["default"].find({
              title: {
                $regex: new RegExp("".concat(keyword, "$"), "i") // i == 대소문자 구분을 안해주는 역할.
                // keyword를 포함하는 영상들을 찾을거다.
                //₩^${keyword}₩ => 키워드로 시작하는 문자열만 찾는다.
                //이건 몽고디비가 제공하는 기능이다.

              }
            }).populate("owner");

          case 5:
            videos = _context7.sent;

          case 6:
            return _context7.abrupt("return", res.render("search", {
              pageTitle: "Search",
              videos: videos
            }));

          case 7:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function search(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();

exports.search = search;

var registerView = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res) {
    var id, video;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            id = req.params.id; //id from router

            _context8.next = 3;
            return _Video["default"].findById(id);

          case 3:
            video = _context8.sent;

            if (video) {
              _context8.next = 6;
              break;
            }

            return _context8.abrupt("return", res.sendStatus(404));

          case 6:
            video.meta.views = video.meta.views + 1;
            _context8.next = 9;
            return video.save();

          case 9:
            return _context8.abrupt("return", res.sendStatus(200));

          case 10:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function registerView(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

exports.registerView = registerView;

var createComment = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res) {
    var user, text, id, video, comment;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            user = req.session.user, text = req.body.text, id = req.params.id;
            _context9.next = 3;
            return _Video["default"].findById(id);

          case 3:
            video = _context9.sent;

            if (video) {
              _context9.next = 6;
              break;
            }

            return _context9.abrupt("return", res.sendStatus(404));

          case 6:
            _context9.next = 8;
            return _Comment["default"].create({
              text: text,
              owner: user._id,
              video: id
            });

          case 8:
            comment = _context9.sent;
            video.comments.push(comment._id);
            video.save();
            return _context9.abrupt("return", res.status(201).json({
              newCommentId: comment._id
            }));

          case 12:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));

  return function createComment(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

exports.createComment = createComment;