import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const db  = mongoose.connection;

const handleOpen = () => console.log("๐ Connected to DB ๐");
const handleError = (error) => console.log(" โ DB Error");
db.on("error" , handleError);
db.once("open", handleOpen);

// ๋๋น๋ฅผ ๋ชฝ๊ตฌ์ค์ ์ฐ๊ฒฐ์์ผ์ video model์ ์ธ์์ํค๋ ๊ฑฐ๋ค.