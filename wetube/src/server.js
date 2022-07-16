import express from "express"; //recent code
//const express = require("express");
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import { localsMiddleware } from "./middlewares";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";



const app = express();
// 익스프레스를 활용하여 어플리케이션 만들기
const logger = morgan("dev");


app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
    secret : process.env.COOKIE_SECRET,
    resave : false,
    saveUninitialized: false,
    store:MongoStore.create({mongoUrl:process.env.DB_URL}),
}));
app.use(flash());
app.use(localsMiddleware);
//middleware 순서가 중요하다. 세션다음에 줘야만 세션이 만들어진다. 
app.use("/uploads", express.static("uploads"));
// 정적 기술을 통해 uploads에 대한 폴더에 대한 권한을 열어둔것 사람들이 열람할 수 있도록
app.use("/static", express.static("assets"));
// static 으로 권한을 열어줄때 url은 자유롭게 작성해도 상관없다 하지만 뒤에 폴더명은 실제 폴더와 똑같이 적어야만 한다.
app.use("/",rootRouter);
app.use((req,res,next) =>{
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
}); // sharedArrayBuffer 에러 발생할 때 해결책 -> 참고하여 복붙한 내용.
app.use("/videos", videoRouter);
app.use("/users", userRouter);
// get,set 등등 샌드위치 구간 브라우저가 요구하는 내용을 처리.
// 요청이라는 이벤트 처리라고 생각하면 된다.
app.use("/api", apiRouter);

export default app;





