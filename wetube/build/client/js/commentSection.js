"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var videoContainer = document.getElementById("videoContainer");
var form = document.getElementById("commentForm");

var addComment = function addComment(text, id) {
  var videoComments = document.querySelector(".video__comments ul");
  var newComment = document.createElement("li");
  newComment.dataset.id = id; // x누르고 아이디 찾아서 제거하면 된다는데.

  newComment.className = "video__comment";
  var icon = document.createElement("i");
  icon.className = "fas fa-comment";
  var span = document.createElement("span");
  span.innerText = "  ".concat(text);
  var span2 = document.createElement("span");
  span2.innerText = "  X";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

var handleSubmit = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
    var textarea, text, videoId, response, _yield$response$json, newCommentId;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            event.preventDefault();
            textarea = form.querySelector("textarea");
            text = textarea.value;
            videoId = videoContainer.dataset.id;

            if (!(text === "")) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return");

          case 6:
            _context.next = 8;
            return fetch("/api/videos/".concat(videoId, "/comment"), {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              //express에 json 미들웨어를 서버.js에서 활용하는데 이걸 쓰기 위해서는 우리가 json파일을 보내고 있다고 헤더에 담아야 한다.
              // 그래서 fetch할때 작성하여 같이 보내둔다.
              body: JSON.stringify({
                text: text
              }) //req.body처럼 그냥 이렇게 body만 보내도 된다.
              //하지만 텍스트만 보낼 때는 log를 출력하면서 잘 출력되는지 확인해야한다.
              //우리가 보낼때는 출력이 안되어서 body:text, 로만 해서 보냈어도 안되길래
              // server.js에서 express의 도움을 받아 app.use(express.text()); 처럼 해결하니 텍스트가 출력되었다.
              // 추가적으로 오브젝트로 보내는 경우도 고려할 때 우리는 이것을 string으로 바꿔서 해결하고 싶을때가 있을것이다.
              // 그럴때 body:JSON.stringify() 를 사용하면 된다.

            });

          case 8:
            response = _context.sent;

            if (!(response === 201)) {
              _context.next = 16;
              break;
            }

            textarea.value = "";
            _context.next = 13;
            return response.json();

          case 13:
            _yield$response$json = _context.sent;
            newCommentId = _yield$response$json.newCommentId;
            addComment(text, newCommentId);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function handleSubmit(_x) {
    return _ref.apply(this, arguments);
  };
}();

if (form) {
  form.addEventListener("submit", handleSubmit);
}