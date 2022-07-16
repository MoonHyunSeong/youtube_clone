import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const db  = mongoose.connection;

const handleOpen = () => console.log("😉 Connected to DB 😉");
const handleError = (error) => console.log(" ❌ DB Error");
db.on("error" , handleError);
db.once("open", handleOpen);

// 디비를 몽구스와 연결시켜서 video model을 인식시키는 거다.