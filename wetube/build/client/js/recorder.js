"use strict";

var _ffmpeg = require("@ffmpeg/ffmpeg");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var actionBtn = document.getElementById("actionBtn");
var video = document.getElementById("preview");
var stream;
var recorder;
var videoFile;
var files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg"
};

var downloadFile = function downloadFile(fileUrl, fileName) {
  var a = document.createElement("a"); //make fake link

  a.href = fileUrl; // mp4 파일로 변환한 mp4Url을 받기 위해 링크로 걸어줌.

  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

var handleDownload = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var ffmpeg, mp4File, thumbFile, mp4Blob, thumbBlob, mp4Url, thumbUrl;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            actionBtn.removeEventListener("click", handleDownload);
            actionBtn.innerText = "Transcoding...";
            actionBtn.disabled = true;
            ffmpeg = (0, _ffmpeg.createFFmpeg)({
              corePath: 'https://unpkg.com/@ffmpeg/core@0.8.5/dist/ffmpeg-core.js',
              log: true
            });
            _context.next = 6;
            return ffmpeg.load();

          case 6:
            _context.t0 = ffmpeg;
            _context.t1 = files.input;
            _context.next = 10;
            return (0, _ffmpeg.fetchFile)(videoFile);

          case 10:
            _context.t2 = _context.sent;

            _context.t0.FS.call(_context.t0, "writeFile", _context.t1, _context.t2);

            _context.next = 14;
            return ffmpeg.run("-i", files.input, "-r", "60", files.output);

          case 14:
            _context.next = 16;
            return ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb);

          case 16:
            mp4File = ffmpeg.FS("readFile", files.output);
            thumbFile = ffmpeg.FS("readFile", files.thumb);
            mp4Blob = new Blob([mp4File.buffer], {
              type: "video/mp4"
            }); // mp4 blob 만들기

            thumbBlob = new Blob([thumbFile.buffer], {
              type: "image/jpg"
            });
            mp4Url = URL.createObjectURL(mp4Blob);
            thumbUrl = URL.createObjectURL(thumbBlob);
            downloadFile(mp4Url, "MyRecording.mp4");
            downloadFile(thumbUrl, "MyThumbnail.jpg");
            ffmpeg.FS("unlink", files.input);
            ffmpeg.FS("unlink", files.output);
            ffmpeg.FS("unlink", files.thumb);
            URL.revokeObjectURL(mp4Url);
            URL.revokeObjectURL(thumbUrl);
            URL.revokeObjectURL(videoFile); // unlink, revoke 전부 링크를 끊어주기 위함. -> 쌓이고 쌓이면 느려지기만 한다.

            actionBtn.disabled = false;
            actionBtn.innerText = "Record Again";
            actionBtn.addEventListener("click", handleStart);

          case 33:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function handleDownload() {
    return _ref.apply(this, arguments);
  };
}();

var handleStop = function handleStop() {
  actionBtn.innerText = "Download Recording";
  actionBtn.removeEventListener("click", handleStop);
  actionBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

var handleStart = function handleStart() {
  actionBtn.innerText = "Stop Recording";
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream, {
    mimeType: "video/webm"
  });

  recorder.ondataavailable = function (event) {
    //ondataavailable recode가 중단되면 발생하는 event이다.
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null; // createObjectURL를 쓰면서 녹화본을 봐야하기 때문에 비운다.

    video.src = videoFile;
    video.loop = true;
    video.play(); //createObjectURL은 브라우저 메모리에서만 가능한 URL을 만들어준다. 
    // 단순히 부라우저의 메모리를 가르키기만 하고 있는 URL을 만든것으로 실존하지 않는다.
    // 브라우저에 의해서 만들어지는 것이다.
  };

  recorder.start();
};

var init = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return navigator.mediaDevices.getUserMedia({
              audio: true,
              video: {
                width: 1024,
                height: 576
              }
            });

          case 2:
            stream = _context2.sent;
            video.srcObject = stream; //srcObject는 HTMLMediaElement 인터페이스의 속성으로 HTMLMediaElement와 
            // 연결된 미디어의 소스 역할을 하는 객체를 설정하거나 반환하는 역할을 한다

            video.play();

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function init() {
    return _ref2.apply(this, arguments);
  };
}();

init();
actionBtn.addEventListener("click", handleStart);