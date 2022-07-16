"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startGithubLogin = exports.see = exports.postLogin = exports.postJoin = exports.postEdit = exports.postChangePassword = exports.logout = exports.getLogin = exports.getJoin = exports.getEdit = exports.getChangePassword = exports.finishGithubLogin = void 0;

var _User = _interopRequireDefault(require("../models/User"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getJoin = function getJoin(req, res) {
  res.render("join", {
    pageTitle: "Join"
  });
};

exports.getJoin = getJoin;

var postJoin = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, name, username, email, password, password2, location, pageTitle, exists;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, name = _req$body.name, username = _req$body.username, email = _req$body.email, password = _req$body.password, password2 = _req$body.password2, location = _req$body.location;
            pageTitle = "Join";

            if (!(password !== password2)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", res.status(400).render("join", {
              pageTitle: pageTitle,
              errorMessage: "password confirmaion does not match."
            }));

          case 4:
            _context.next = 6;
            return _User["default"].exists({
              $or: [{
                username: username
              }, {
                email: email
              }]
            });

          case 6:
            exists = _context.sent;

            if (!exists) {
              _context.next = 9;
              break;
            }

            return _context.abrupt("return", res.status(400).render("join", {
              //status(400) 을 넣어줌으로 에러를 처리한다.
              pageTitle: pageTitle,
              errorMessage: "This username/email is already taken"
            }));

          case 9:
            ;
            _context.prev = 10;
            _context.next = 13;
            return _User["default"].create({
              name: name,
              username: username,
              email: email,
              password: password,
              location: location
            });

          case 13:
            return _context.abrupt("return", res.redirect("/login"));

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](10);
            return _context.abrupt("return", res.status(400).render("join", {
              pageTitle: "Join Video",
              errorMessage: _context.t0._message
            }));

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[10, 16]]);
  }));

  return function postJoin(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.postJoin = postJoin;

var getLogin = function getLogin(req, res) {
  res.render("login", {
    pageTitle: "Login"
  });
};

exports.getLogin = getLogin;

var postLogin = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var _Login, pageTitle, _req$body2, username, password, user, ok;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            //check if account exists
            // check if password correct
            _Login = "Login", pageTitle = _Login.pageTitle;
            _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password; // 브라우저를 통해서 입력 받은 내용

            _context2.next = 4;
            return _User["default"].findOne({
              username: username,
              socialOnly: false
            });

          case 4:
            user = _context2.sent;

            if (user) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt("return", res.status(400).render("login", {
              pageTitle: pageTitle,
              errorMessage: "An account with this username does not exists."
            }));

          case 7:
            ;
            _context2.next = 10;
            return _bcrypt["default"].compare(password, user.password);

          case 10:
            ok = _context2.sent;

            if (ok) {
              _context2.next = 13;
              break;
            }

            return _context2.abrupt("return", res.status(400).render("login", {
              pageTitle: pageTitle,
              errorMessage: "Wrong password."
            }));

          case 13:
            ;
            req.session.loggedIn = true; //loggedIn은 내부적으로 저장되어 있는게 아니라 그냥 추가한거다. user도 마찬가지.
            //필요한 내용을 세션에 이런식으로 추가할 수 있다.

            req.session.user = user; //디비에서 꺼내온 내용을 세션에 담는다고 생각하자.
            // 위 내용은 middleware에서 세션별로 로그인 인증을 처리한다.

            return _context2.abrupt("return", res.redirect("/"));

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function postLogin(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.postLogin = postLogin;

var startGithubLogin = function startGithubLogin(req, res) {
  var baseUrl = 'https://github.com/login/oauth/authorize?';
  var config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email"
  }; // 위 내용은 깃헙에서 요구하는 파라미터의 이름이다. 
  // 각 회사별로 요구하는 이름이 다르니 그 점에 유의하면서 작성하도록 한다.

  var params = new URLSearchParams(config).toString();
  var finalUrl = "".concat(baseUrl).concat(params);
  return res.redirect(finalUrl);
};

exports.startGithubLogin = startGithubLogin;

var finishGithubLogin = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var baseUrl, config, params, finalUrl, tokenRequest, access_token, apiUrl, userData, emailData, emailObj, user;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            baseUrl = "https://github.com/login/oauth/access_token?";
            config = {
              client_id: process.env.GH_CLIENT,
              client_secret: process.env.GH_SECRET,
              code: req.query.code
            };
            params = new URLSearchParams(config).toString();
            finalUrl = "".concat(baseUrl).concat(params);
            _context3.next = 6;
            return (0, _nodeFetch["default"])(finalUrl, {
              method: "POST",
              headers: {
                Accept: "application/json"
              }
            });

          case 6:
            _context3.next = 8;
            return _context3.sent.json();

          case 8:
            tokenRequest = _context3.sent;

            if (!("access_token" in tokenRequest)) {
              _context3.next = 37;
              break;
            }

            access_token = tokenRequest.access_token; //github API와 소통하기 위한 엑세스ㅡ토큰이다. 규격이다.

            apiUrl = "http://api.github.com";
            _context3.next = 14;
            return (0, _nodeFetch["default"])("".concat(apiUrl, "/user"), {
              headers: {
                Authorization: "token ".concat(access_token)
              }
            });

          case 14:
            _context3.next = 16;
            return _context3.sent.json();

          case 16:
            userData = _context3.sent;
            _context3.next = 19;
            return (0, _nodeFetch["default"])("".concat(apiUrl, "/user/emails"), {
              headers: {
                Authorization: "token ".concat(access_token)
              }
            });

          case 19:
            _context3.next = 21;
            return _context3.sent.json();

          case 21:
            emailData = _context3.sent;
            emailObj = emailData.find(function (email) {
              return email.primary === true && email.verified === true;
            });

            if (emailObj) {
              _context3.next = 25;
              break;
            }

            return _context3.abrupt("return", res.redirect("/login"));

          case 25:
            _context3.next = 27;
            return _User["default"].findOne({
              email: emailObj.email
            });

          case 27:
            user = _context3.sent;

            if (user) {
              _context3.next = 32;
              break;
            }

            _context3.next = 31;
            return _User["default"].create({
              avatarUrl: userData.avatar_url,
              name: userData.name,
              username: userData.login,
              email: emailObj.email,
              password: "",
              socialOnly: true,
              location: userData.location
            });

          case 31:
            user = _context3.sent;

          case 32:
            //userData 는 API로부터 오며, emailData 또한 깃헙API로부터 온다는걸
            req.session.loggedIn = true;
            req.session.user = user;
            return _context3.abrupt("return", res.redirect("/"));

          case 37:
            return _context3.abrupt("return", res.redirect("/login"));

          case 38:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function finishGithubLogin(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.finishGithubLogin = finishGithubLogin;

var logout = function logout(req, res) {
  req.flash("error", "byebye");
  req.session.destroy();
  return res.redirect("/");
};

exports.logout = logout;

var getEdit = function getEdit(req, res) {
  return res.render("edit-profile", {
    pageTitle: "Edit Profile",
    user: req.session.user
  });
};

exports.getEdit = getEdit;

var postEdit = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var _req$session$user, _id, avatarUrl, _req$body3, name, email, username, location, file, updateUser;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            // email 중복체크 코드 챌린지.
            _req$session$user = req.session.user, _id = _req$session$user._id, avatarUrl = _req$session$user.avatarUrl, _req$body3 = req.body, name = _req$body3.name, email = _req$body3.email, username = _req$body3.username, location = _req$body3.location, file = req.file;
            _context4.next = 3;
            return _User["default"].findByIdAndUpdate(_id, {
              avatarUrl: file ? file.path : avatarUrl,
              name: name,
              email: email,
              username: username,
              location: location
            }, {
              "new": true
            });

          case 3:
            updateUser = _context4.sent;
            // findByIdAndUpdate는 업데이트 되기 전의 데이터를 리턴해주고  {new :true} 를 설정해주면 findByIdAndUpdate가
            // 업데이트된 데이터를 리턴해줄것이다. 이와같이하면 아래 주석내용처럼 길게 작성할 필요가 없다.
            req.session.user = updateUser; // req.session.user = {
            //     ...req.session.user,
            //     // 세션업데이트 과정에서 수정되지 않는 내용이 있기때문에 먼저 덮어주고 수정된 내용을 밑에 작성해준다.
            //     name,
            //     email,
            //     username,
            //     location,
            // };
            // 폼에서 내용을 받고 디비에 업데이트를 했지만 세션도 업데이트를 해줘야한다.
            //그래야만 프론트에서 변경된 값이 보인다.

            return _context4.abrupt("return", res.redirect("/users/edit"));

          case 6:
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

var getChangePassword = function getChangePassword(req, res) {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }

  return res.render("users/change-password", {
    pageTitle: "change Password"
  });
};

exports.getChangePassword = getChangePassword;

var postChangePassword = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var _req$session$user2, _id, password, _req$body4, oldPassword, newPassword, newPasswordConfirmation, user, ok;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _req$session$user2 = req.session.user, _id = _req$session$user2._id, password = _req$session$user2.password, _req$body4 = req.body, oldPassword = _req$body4.oldPassword, newPassword = _req$body4.newPassword, newPasswordConfirmation = _req$body4.newPasswordConfirmation;
            _context5.next = 3;
            return _User["default"].findById(_id);

          case 3:
            user = _context5.sent;
            _context5.next = 6;
            return _bcrypt["default"].compare(oldPassword, user.password);

          case 6:
            ok = _context5.sent;

            if (ok) {
              _context5.next = 9;
              break;
            }

            return _context5.abrupt("return", res.status(400).render("users/change-password", {
              pageTitle: "change Password",
              errorMessage: "the current password is incorrect"
            }));

          case 9:
            if (!(newPassword !== newPasswordConfirmation)) {
              _context5.next = 11;
              break;
            }

            return _context5.abrupt("return", res.status(400).render("users/change-password", {
              pageTitle: "change Password",
              errorMessage: "the password does not match"
            }));

          case 11:
            user.password = newPassword;
            user.save(); //req.session.user.password = user.password;
            // 세션과 디비 업데이트를 각각 해줘야한다.

            return _context5.abrupt("return", res.redirect("/users/logout"));

          case 14:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function postChangePassword(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.postChangePassword = postChangePassword;

var see = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    var id, user;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            id = req.params.id;
            _context6.next = 3;
            return _User["default"].findById(id).populate({
              path: "videos",
              populate: {
                path: "owner",
                model: "User"
              }
            });

          case 3:
            user = _context6.sent;

            if (user) {
              _context6.next = 6;
              break;
            }

            return _context6.abrupt("return", res.status(404).render("404", {
              pageTitle: "User not found"
            }));

          case 6:
            return _context6.abrupt("return", res.render("users/profile", {
              pageTitle: user.name,
              user: user
            }));

          case 7:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function see(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

exports.see = see;