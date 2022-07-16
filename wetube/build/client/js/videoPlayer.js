"use strict";

var video = document.querySelector("video");
var playBtn = document.getElementById("play");
var playBtnIcon = playBtn.querySelector("i");
var muteBtn = document.getElementById("mute");
var muteBtnIcon = muteBtn.querySelector("i");
var volumeRange = document.getElementById("volume");
var currentTime = document.getElementById("currentTime");
var totalTime = document.getElementById("totalTime");
var timeLine = document.getElementById("timeline");
var fullScreenBtn = document.getElementById("fullScreen");
var fullScreenIcon = fullScreenBtn.querySelector("i");
var videoContainer = document.getElementById("videoContainer");
var videoControls = document.getElementById("videoControls");
var controlsTimeout = null;
var controlsMovementTimeout = null;
var volumeValue = 0.5;
video.volume = volumeValue;

var handlePlayClick = function handlePlayClick(e) {
  //if the video is playing, pause it
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  } //else play the video
  // playBtn.innerText = video.paused ? "Play" : "Pause";


  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

var handleMuteClick = function handleMuteClick(e) {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  } //muteBtn.innerText = video.muted ? "UnMute" : "Mute" ;


  muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

var handleVolumeChange = function handleVolumeChange(event) {
  var value = event.target.value;

  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }

  volumeValue = value;
  video.volume = value;
};

var formatTime = function formatTime(seconds) {
  return new Date(seconds * 1000).toISOString().substr(14, 5);
};

var handleLoadedMetadata = function handleLoadedMetadata() {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeLine.max = Math.floor(video.duration);
};

var handleTimeUpdate = function handleTimeUpdate() {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeLine.value = Math.floor(video.currentTime);
};

var handleTimelineChange = function handleTimelineChange(event) {
  var value = event.target.value;
  video.currentTime = value;
};

var handleFullScreen = function handleFullScreen() {
  var fullscreen = document.fullscreenElement;

  if (fullscreen) {
    document.exitFullscreen(); //fullScreenBtn.innerText = "Enter full Screen";

    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen(); // fullScreenBtn.innerText = "Exit full Screen";

    fullScreenIcon.classList = "fas fa-compress";
  }
};

var hideControls = function hideControls() {
  return videoControls.classList.remove("showing");
};

var handleMouseMove = function handleMouseMove() {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  } // user가 비디오에 들어왔다 떠나서 다시 들어올 때 발생한다.
  //handleMouseLeave에서 controlsTimeout에 값이 부여되어 실행되고 우리는 이것을 취소하기 위해 만들어준 것이다.


  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  } // 비디오 위에서 마우스가 움직이는 경우를 고려하여 제작한 if 구문이다.


  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

var handleMouseLeave = function handleMouseLeave() {
  controlsTimeout = setTimeout(hideControls, 3000); //setTimeout 은 숫자를 리턴해준다. 기존에 null 로 지정된 전역변수에 숫자를 부여함으로써 handleMouseMove 안에 if 구문으로 들어갈 수 있게 한다.
}; //what is fetch?


if (video.readyState == 4) {
  handleLoadedMetadata();
} // 이벤트리스너를 추가하기 전에 비디오가 전부 로딩이 되어 메타데이터가 불려지지 않을 수 있다. 그래서 추가한 구문


var handleEnded = function handleEnded() {
  var id = videoContainer.dataset.id;
  fetch("/api/videos/".concat(id, "/view"), {
    method: "POST"
  });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeLine.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen); // 코드 챌린지 -> 스페이바 또는 마우스로 비디오를 클릭해서 재생 멈춤 구현