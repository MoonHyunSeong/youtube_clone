import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique:true},
    avatarUrl:String,
    socialOnly:{type:Boolean, default:false},
    username: {type: String, required: true, unique:true},
    password: {type: String},
    name: {type: String, required: true},
    location: String,
    comments: [{type: mongoose.Schema.Types.ObjectId, ref:"Comment"}],
    videos:[{type:mongoose.Schema.Types.ObjectId, ref:"Video"}],
});

userSchema.pre("save", async function(){
    if(this.isModified("password")){
    // 비밀번호가 수정될때만 해싱되도록 조건문 걸어주기.
    this.password = await bcrypt.hash(this.password, 5);
    } 
}); 
// 비밀번호를 해시화 한 후 저장할 수 있도록 하는 내용이다.

const User = mongoose.model('User', userSchema);
export default User;