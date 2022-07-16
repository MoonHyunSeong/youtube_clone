import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) =>{

    const a = document.createElement("a");
    //make fake link
    a.href = fileUrl;
    // mp4 파일로 변환한 mp4Url을 받기 위해 링크로 걸어줌.
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
}

const handleDownload = async () =>{

    actionBtn.removeEventListener("click", handleDownload);
    actionBtn.innerText = "Transcoding...";
    actionBtn.disabled = true;
    

    const ffmpeg = createFFmpeg({corePath:'https://unpkg.com/@ffmpeg/core@0.8.5/dist/ffmpeg-core.js', log: true});
    await ffmpeg.load();
    // await 를 쓰는 이유 : 사용자가 소프트웨어를 사용하기 때문이다. 준비가 될 때까지 기다려야한다. 사이즈가 무거울 수도 있으니깐.
    // 굉장히 중요한 파트. -> 유저가 js가 아닌 코드를 사용하는 것이다. 무언가를 설치해서
    // 우리 웹에서 다른 소프트웨어를 사용하는 것이기 떄문이다.

    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
    //ffmpeg를 통해 파일시스템을 만드는 과정이다. 
    // 레코드 파일을 만들때 브라우저에서 가상 폴더 or 파일을 만든것처럼 우리는 FS(형식, 이름, 바이너리파일)을 주어 ffmpeg의 세계에 파일을 만드는 과정이다.
    // 바이너리파일은 우리가 만들었던 blob 파일을 말하며 이를 fetch하여 전달해준다.
    await ffmpeg.run("-i", files.input, "-r" , "60",  files.output);
    // run 함수안에 (원하는 경우의 명령어, 다운로드된 webm 파일 이름, 프레임, 변환하고 싶은 비디오 확장자와 이름) 을 적어준다.
    

    await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb);
    

    const mp4File = ffmpeg.FS("readFile",  files.output);
    const thumbFile = ffmpeg.FS("readFile", files.thumb);
    
    const mp4Blob = new Blob([mp4File.buffer], {type:"video/mp4"});
    // mp4 blob 만들기
    const thumbBlob = new Blob([thumbFile.buffer], {type:"image/jpg"});

    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    downloadFile(mp4Url, "MyRecording.mp4");
    downloadFile(thumbUrl,"MyThumbnail.jpg" );

    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);

    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);

    // unlink, revoke 전부 링크를 끊어주기 위함. -> 쌓이고 쌓이면 느려지기만 한다.


    actionBtn.disabled = false;
    actionBtn.innerText = "Record Again";
    actionBtn.addEventListener("click", handleStart);

}

const handleStop = () => {
    actionBtn.innerText = "Download Recording";
    actionBtn.removeEventListener("click", handleStop);
    actionBtn.addEventListener("click", handleDownload);
    recorder.stop();
}

const handleStart =  () => {
    actionBtn.innerText = "Stop Recording";
    actionBtn.removeEventListener("click", handleStart);
    actionBtn.addEventListener("click", handleStop);
    recorder = new MediaRecorder(stream, {mimeType:"video/webm"});
    recorder.ondataavailable = (event) => {
        //ondataavailable recode가 중단되면 발생하는 event이다.
        videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        // createObjectURL를 쓰면서 녹화본을 봐야하기 때문에 비운다.
        video.src = videoFile;
        video.loop = true;
        video.play();
        //createObjectURL은 브라우저 메모리에서만 가능한 URL을 만들어준다. 
        // 단순히 부라우저의 메모리를 가르키기만 하고 있는 URL을 만든것으로 실존하지 않는다.
        // 브라우저에 의해서 만들어지는 것이다.
    };
    recorder.start();
}

const init = async () =>{
    stream = await navigator.mediaDevices.getUserMedia({
        audio: true, 
        video: {
            width:1024,
            height:576,
        },
    });
    video.srcObject = stream;
    //srcObject는 HTMLMediaElement 인터페이스의 속성으로 HTMLMediaElement와 
    // 연결된 미디어의 소스 역할을 하는 객체를 설정하거나 반환하는 역할을 한다
    
    video.play();
};

init();
actionBtn.addEventListener("click", handleStart);
