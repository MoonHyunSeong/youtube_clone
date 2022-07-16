
const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeLine = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) =>{
    //if the video is playing, pause it
    if(video.paused){
        
        video.play();
    } else {
        video.pause();
    }
    //else play the video
    // playBtn.innerText = video.paused ? "Play" : "Pause";
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";

};

const handleMuteClick = (e) =>{
    if(video.muted){
        video.muted =false;
    } else{
        video.muted =true;
    }
    //muteBtn.innerText = video.muted ? "UnMute" : "Mute" ;
    muteBtnIcon.classList = video.muted 
        ? "fas fa-volume-mute" 
        : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) =>{
    const {target: {value}} = event;
    if(video.muted){
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = value;
    video.volume = value;
};

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substr(14,5);

const handleLoadedMetadata = () =>{
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeLine.max = Math.floor(video.duration);
};

const handleTimeUpdate = () =>{
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeLine.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) =>{
    const {
        target : {value},
    } = event;
    video.currentTime = value;
};

const handleFullScreen = () => {
    const fullscreen = document.fullscreenElement;
    if(fullscreen){
        document.exitFullscreen();
        //fullScreenBtn.innerText = "Enter full Screen";
        fullScreenIcon.classList = "fas fa-expand";
    }else{
        videoContainer.requestFullscreen();
        // fullScreenBtn.innerText = "Exit full Screen";
        fullScreenIcon.classList = "fas fa-compress";
    }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () =>{
    if(controlsTimeout){
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    } // user가 비디오에 들어왔다 떠나서 다시 들어올 때 발생한다.
    //handleMouseLeave에서 controlsTimeout에 값이 부여되어 실행되고 우리는 이것을 취소하기 위해 만들어준 것이다.
    if(controlsMovementTimeout){
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }// 비디오 위에서 마우스가 움직이는 경우를 고려하여 제작한 if 구문이다.
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () =>{
    controlsTimeout = setTimeout(hideControls, 3000);
    //setTimeout 은 숫자를 리턴해준다. 기존에 null 로 지정된 전역변수에 숫자를 부여함으로써 handleMouseMove 안에 if 구문으로 들어갈 수 있게 한다.
};


//what is fetch?
if(video.readyState == 4 ){
    handleLoadedMetadata();
}
// 이벤트리스너를 추가하기 전에 비디오가 전부 로딩이 되어 메타데이터가 불려지지 않을 수 있다. 그래서 추가한 구문

const handleEnded = () => {
    const {id} = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, {
        method:"POST",
    });
}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove",handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeLine.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);



// 코드 챌린지 -> 스페이바 또는 마우스로 비디오를 클릭해서 재생 멈춤 구현