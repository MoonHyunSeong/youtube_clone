import "regenerator-runtime";
// import 가 많아져서 시작할 때 초기화를 위해서 만든 파일
import "dotenv/config";
import "./db";
//파일을 임포트 하는 순간 파일 내용에 따라 디비가 자동으로 연결된다.
import "./models/Video";
import "./models/User";
import "./models/Comment";
//이제 누구나 video 스키마를 참조할 수 있다.
import app from "./server";



const PORT = 3000;

const handleListening = () => console.log(`😀Server listening on PORT ${PORT} 🌠`);

app.listen(PORT, handleListening);

// 요청을 듣기.